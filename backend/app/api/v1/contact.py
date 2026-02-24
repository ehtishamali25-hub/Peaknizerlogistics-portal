from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.services.email_service import EmailService
import asyncio

router = APIRouter(prefix="/contact", tags=["Contact"])

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: str = None
    service: str
    message: str

@router.post("/send")
async def send_contact_form(form: ContactForm):
    """Send contact form to company email"""
    try:
        # Prepare email content
        subject = f"New Contact Form Submission - {form.service}"
        
        body = f"""
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
                    <div>{form.name}</div>
                </div>
                
                <div class="field">
                    <div class="label">Email:</div>
                    <div>{form.email}</div>
                </div>
                
                <div class="field">
                    <div class="label">Phone:</div>
                    <div>{form.phone}</div>
                </div>
                
                <div class="field">
                    <div class="label">Company:</div>
                    <div>{form.company or 'Not provided'}</div>
                </div>
                
                <div class="field">
                    <div class="label">Service Interested In:</div>
                    <div>{form.service}</div>
                </div>
                
                <div class="field">
                    <div class="label">Message:</div>
                    <div>{form.message}</div>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Send email to company
        result = await EmailService.send_email(
            to_email="info@peaknizerlogistics.com",
            subject=subject,
            body=body
        )
        
        if result:
            return {"message": "Email sent successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send email")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))