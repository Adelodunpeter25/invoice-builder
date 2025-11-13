"""Email service using Resend."""

import resend

from app.core.config import settings
from app.core.logging import logger

resend.api_key = settings.RESEND_API_KEY


async def send_invoice_email(
    to_email: str,
    invoice_number: str,
    client_name: str,
    pdf_content: bytes | None = None,
) -> bool:
    """Send invoice via email with optional PDF attachment."""
    try:
        params = {
            "from": f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>",
            "to": [to_email],
            "subject": f"Invoice {invoice_number}",
            "html": f"""
                <h2>Invoice {invoice_number}</h2>
                <p>Dear {client_name},</p>
                <p>Please find your invoice attached.</p>
                <p>Thank you for your business!</p>
                <br>
                <p>Best regards,<br>{settings.EMAILS_FROM_NAME}</p>
            """,
        }
        
        if pdf_content:
            params["attachments"] = [
                {
                    "filename": f"invoice_{invoice_number}.pdf",
                    "content": pdf_content,
                }
            ]
        
        resend.Emails.send(params)
        logger.info(f"Invoice email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send invoice email: {str(e)}")
        return False
