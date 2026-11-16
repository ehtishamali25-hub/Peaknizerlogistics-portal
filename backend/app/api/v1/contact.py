import html
import logging
import re
import time
from collections import deque
from threading import Lock
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.services.email_service import EmailService

router = APIRouter(prefix="/contact", tags=["Contact"])

logger = logging.getLogger(__name__)

COMPANY_INBOX = "info@peaknizerlogistics.com"

# Protection against someone flooding the inbox: at most MAX_PER_IP messages
# from one visitor and MAX_TOTAL from everyone, in any WINDOW_SECONDS period.
WINDOW_SECONDS = 10 * 60
MAX_PER_IP = 5
MAX_TOTAL = 40

_recent_by_ip = {}
_recent_all = deque()
_lock = Lock()


class ContactForm(BaseModel):
    # Spaces at the start and end of every text field are removed
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    # Optional, so the homepage quote form (where phone is not required) can use this too
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=150)
    service: str = Field(default="General Inquiry", min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=5000)
    # Hidden trap field on the website forms. People never fill it; spam robots do.
    fax: Optional[str] = Field(default=None, max_length=200)


def _client_ip(request: Request) -> str:
    # Behind Render's proxy the visitor's address is the first one in X-Forwarded-For
    forwarded = request.headers.get("x-forwarded-for", "")
    if forwarded:
        return forwarded.split(",")[0].strip()[:64] or "unknown"
    return request.client.host if request.client else "unknown"


def _too_many(ip: str) -> bool:
    """True when this visitor (or everyone together) has sent too many messages recently."""
    now = time.monotonic()
    cutoff = now - WINDOW_SECONDS

    with _lock:
        while _recent_all and _recent_all[0] < cutoff:
            _recent_all.popleft()

        # Forget visitors whose messages are all older than the window
        for key in [k for k, times in _recent_by_ip.items() if not times or times[-1] < cutoff]:
            del _recent_by_ip[key]

        times = _recent_by_ip.get(ip)
        if times:
            while times and times[0] < cutoff:
                times.popleft()

        if (times and len(times) >= MAX_PER_IP) or len(_recent_all) >= MAX_TOTAL:
            return True

        _recent_by_ip.setdefault(ip, deque()).append(now)
        _recent_all.append(now)
        return False


def _one_line(text: str) -> str:
    """Email subjects must be a single line."""
    return re.sub(r"\s+", " ", text or "").strip()


def _safe(text: Optional[str], fallback: str = "Not provided") -> str:
    """Visitor text is shown as plain text in the email, never as HTML."""
    text = (text or "").strip()
    return html.escape(text) if text else fallback


def _build_email(form: ContactForm) -> str:
    email = html.escape(str(form.email))
    message = _safe(form.message).replace("\r\n", "\n").replace("\r", "\n").replace("\n", "<br>")

    return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #f44336; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>New Contact Form Submission</h2>
                <p>A new contact form has been submitted on your website.</p>
                
                <div class="field">
                    <div class="label">Name:</div>
                    <div>{_safe(form.name)}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email:</div>
                    <div><a href="mailto:{email}">{email}</a></div>
                </div>
                
                <div class="field">
                    <div class="label">Phone:</div>
                    <div>{_safe(form.phone)}</div>
                </div>
                
                <div class="field">
                    <div class="label">Company:</div>
                    <div>{_safe(form.company)}</div>
                </div>
                
                <div class="field">
                    <div class="label">Service Interested In:</div>
                    <div>{_safe(form.service)}</div>
                </div>
                
                <div class="field">
                    <div class="label">Message:</div>
                    <div>{message}</div>
                </div>
            </div>
        </body>
        </html>
        """


@router.post("/send")
async def send_contact_form(form: ContactForm, request: Request):
    """Send a website form (Contact page or homepage quote request) to the company email"""

    # A filled trap field means a robot: answer "ok" but send nothing
    if form.fax:
        logger.info("Contact form: dropped a robot submission")
        return {"message": "Email sent successfully"}

    if _too_many(_client_ip(request)):
        raise HTTPException(
            status_code=429,
            detail="Too many messages. Please try again in a few minutes."
        )

    subject = f"New Contact Form Submission - {_one_line(form.service)}"

    try:
        sent = await EmailService.send_email(
            to_email=COMPANY_INBOX,
            subject=subject,
            body=_build_email(form)
        )
    except Exception:
        logger.exception("Contact form: unexpected error while sending the email")
        sent = False

    if not sent:
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "Email sent successfully"}