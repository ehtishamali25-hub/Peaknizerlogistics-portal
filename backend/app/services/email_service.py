import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from app.core.config import settings

class EmailService:
    
    @staticmethod
    async def send_email(to_email: str, subject: str, body: str, attachment_path: str = None, attachment_filename: str = None):
        """Send email using SMTP, optionally with a single file attachment"""
        
        msg = MIMEMultipart('mixed')
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # HTML body goes in its own sub-part when the outer message is 'mixed'
        body_part = MIMEMultipart('alternative')
        body_part.attach(MIMEText(body, 'html'))
        msg.attach(body_part)
        
        if attachment_path and os.path.exists(attachment_path):
            with open(attachment_path, 'rb') as f:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(f.read())
            encoders.encode_base64(part)
            filename = attachment_filename or os.path.basename(attachment_path)
            part.add_header('Content-Disposition', f'attachment; filename="{filename}"')
            msg.attach(part)
        
        try:
            context = ssl.create_default_context()
            
            print(f"Connecting to {settings.SMTP_HOST}:{settings.SMTP_PORT} (SSL={settings.SMTP_USE_SSL})...")
            
            if settings.SMTP_USE_SSL:
                server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context)
            else:
                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
                server.starttls(context=context)
            
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                print("Login successful")
            
            server.send_message(msg)
            print(f"Email sent successfully to {to_email}")
            
            server.quit()
            return True
            
        except smtplib.SMTPAuthenticationError:
            print("SMTP Authentication Error: Check your username and password")
            return False
        except smtplib.SMTPConnectError:
            print("SMTP Connection Error: Could not connect to server")
            return False
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False
    
    @staticmethod
    def get_decline_email_template(customer_name: str, reason: str) -> str:
        """Get HTML template for decline email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 0;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }}
                .header {{
                    background-color: #f44336;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }}
                .header h2 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    padding: 30px;
                    background-color: #ffffff;
                }}
                .reason-box {{
                    background-color: #fff3f3;
                    border-left: 4px solid #f44336;
                    padding: 15px;
                    margin: 20px 0;
                    font-style: italic;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    background-color: #f8f8f8;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 12px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #f44336;
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Registration Declined</h2>
                </div>
                <div class="content">
                    <div class="logo">PEAKNIZERLOGISTICS</div>
                    
                    <p>Dear {customer_name},</p>
                    
                    <p>Thank you for your interest in Peaknizer Logistics. After reviewing your registration request, we regret to inform you that it has been declined.</p>
                    
                    <p><strong>Reason for decline:</strong></p>
                    <div class="reason-box">
                        {reason}
                    </div>
                    
                    <p>If you believe this is an error or would like to discuss this further, please contact our support team at <a href="mailto:info@peaknizerlogistics.com">info@peaknizerlogistics.com</a>.</p>
                    
                    <p>Best regards,<br>
                    <strong>The Peaknizer Logistics Team</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Peaknizer Logistics. All rights reserved.</p>
                    <p>This is an automated message, please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    @staticmethod
    def get_approve_email_template(customer_name: str, customer_code: str) -> str:
        """Get HTML template for approval email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 0;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }}
                .header {{
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }}
                .header h2 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    padding: 30px;
                    background-color: #ffffff;
                }}
                .credentials-box {{
                    background-color: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 20px;
                    margin: 20px 0;
                }}
                .login-btn {{
                    display: inline-block;
                    background-color: #f44336;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    background-color: #f8f8f8;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 12px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #f44336;
                    margin-bottom: 10px;
                }}
                .feature-list {{
                    list-style-type: none;
                    padding: 0;
                }}
                .feature-list li {{
                    padding: 8px 0;
                    padding-left: 25px;
                    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%234CAF50" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>') left center no-repeat;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Registration Approved!</h2>
                </div>
                <div class="content">
                    <div class="logo">PEAKNIZERLOGISTICS</div>
                    
                    <p>Dear {customer_name},</p>
                    
                    <p>Great news! Your registration with <strong>Peaknizer Logistics</strong> has been approved.</p>
                    
                    <div class="credentials-box">
                        <h3 style="margin-top: 0; color: #333;">Your Account Details:</h3>
                        <p><strong>Customer Code:</strong> {customer_code}</p>
                        <p><strong>Login URL:</strong> <a href="https://peaknizerlogistics-portal-frontend.onrender.com/login">https://peaknizerlogistics-portal-frontend.onrender.com/login</a></p>
                        <p><strong>Email:</strong> The email you registered with</p>
                        <p><strong>Password:</strong> The password you set during registration</p>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="https://peaknizerlogistics-portal-frontend.onrender.com/login" class="login-btn">Access Your Portal</a>
                    </p>
                    
                    <p><strong>With your new account you can:</strong></p>
                    <ul class="feature-list">
                        <li>View your real-time inventory</li>
                        <li>Check and download invoices</li>
                        <li>Upload payment proofs</li>
                        <li>Track shipping details</li>
                        <li>Manage your account</li>
                    </ul>
                    
                    <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:info@peaknizerlogistics.com">info@peaknizerlogistics.com</a>.</p>
                    
                    <p>Welcome aboard!<br>
                    <strong>The Peaknizer Logistics Team</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Peaknizer Logistics. All rights reserved.</p>
                    <p>2503D N Harrison St, Arlington, VA 22207</p>
                </div>
            </div>
        </body>
        </html>
        """

    @staticmethod
    def get_invoice_notification_email_template(customer_name: str, invoice_number: str, invoice_type: str, total_amount: str, due_date: str) -> str:
        """Get HTML template for invoice-available notification"""
        type_label = 'Shipping' if invoice_type == 'shipping' else 'Prep'
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 0;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }}
                .header {{
                    background-color: #4CAF50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }}
                .header h2 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    padding: 30px;
                    background-color: #ffffff;
                }}
                .invoice-box {{
                    background-color: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    padding: 20px;
                    margin: 20px 0;
                }}
                .invoice-box table {{
                    width: 100%;
                    border-collapse: collapse;
                }}
                .invoice-box td {{
                    padding: 6px 0;
                }}
                .login-btn {{
                    display: inline-block;
                    background-color: #f44336;
                    color: white;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }}
                .footer {{
                    text-align: center;
                    padding: 20px;
                    background-color: #f8f8f8;
                    border-top: 1px solid #ddd;
                    color: #666;
                    font-size: 12px;
                }}
                .logo {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #f44336;
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Invoice Available</h2>
                </div>
                <div class="content">
                    <div class="logo">PEAKNIZERLOGISTICS</div>
                    
                    <p>Dear {customer_name},</p>
                    
                    <p>A new {type_label.lower()} invoice is now available on your Peaknizer Logistics account. A copy is attached to this email as a PDF.</p>
                    
                    <div class="invoice-box">
                        <table>
                            <tr><td><strong>Invoice #:</strong></td><td>{invoice_number}</td></tr>
                            <tr><td><strong>Type:</strong></td><td>{type_label}</td></tr>
                            <tr><td><strong>Amount:</strong></td><td>{total_amount}</td></tr>
                            <tr><td><strong>Due Date:</strong></td><td>{due_date}</td></tr>
                        </table>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="https://peaknizerlogistics-portal-frontend.onrender.com/login" class="login-btn">View in Portal</a>
                    </p>
                    
                    <p>If you have any questions about this invoice, please contact us at <a href="mailto:info@peaknizerlogistics.com">info@peaknizerlogistics.com</a>.</p>
                    
                    <p>Best regards,<br>
                    <strong>The Peaknizer Logistics Team</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Peaknizer Logistics. All rights reserved.</p>
                    <p>This is an automated message, please do not reply directly to this email.</p>
                </div>
            </div>
        </body>
        </html>
        """