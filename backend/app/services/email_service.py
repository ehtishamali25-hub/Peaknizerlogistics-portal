import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class EmailService:
    
    @staticmethod
    async def send_email(to_email: str, subject: str, body: str):
        """Send email using SMTP with SSL"""
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.SMTP_FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Attach HTML version
        msg.attach(MIMEText(body, 'html'))
        
        try:
            # Create SSL context
            context = ssl.create_default_context()
            
            # Connect to SMTP server with SSL
            print(f"Connecting to {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
            server = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context)
            
            # Login
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                print("Login successful")
            
            # Send email
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
                        <p><strong>Login URL:</strong> <a href="https://peaknizer-frontend.onrender.com/login">https://peaknizer-frontend.onrender.com/login</a></p>
                        <p><strong>Email:</strong> The email you registered with</p>
                        <p><strong>Password:</strong> The password you set during registration</p>
                    </div>
                    
                    <p style="text-align: center;">
                        <a href="https://peaknizer-frontend.onrender.com/login" class="login-btn">Access Your Portal</a>
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