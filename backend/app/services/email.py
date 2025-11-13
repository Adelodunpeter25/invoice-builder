"""Email service using Resend."""

from pathlib import Path

import resend
from jinja2 import Environment, FileSystemLoader

from app.core.config import settings
from app.core.logging import logger
from app.models.client import Client
from app.models.invoice import Invoice

resend.api_key = settings.RESEND_API_KEY

template_dir = Path(__file__).parent.parent / "templates" / "email"
jinja_env = Environment(loader=FileSystemLoader(template_dir))


async def send_invoice_email(
    invoice: Invoice,
    client: Client,
    company_name: str,
    pdf_content: bytes | None = None,
) -> bool:
    """Send invoice via email with optional PDF attachment."""
    try:
        template = jinja_env.get_template("invoice.html")
        html_content = template.render(
            invoice_number=invoice.invoice_number,
            client_name=client.name,
            company_name=company_name,
            issue_date=invoice.issue_date.strftime("%B %d, %Y"),
            due_date=invoice.due_date.strftime("%B %d, %Y"),
            currency=invoice.currency.value,
            amount=f"{invoice.amount:.2f}",
            payment_terms=invoice.payment_terms,
        )
        
        params = {
            "from": f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>",
            "to": [client.email],
            "subject": f"Invoice {invoice.invoice_number}",
            "html": html_content,
        }
        
        if pdf_content:
            params["attachments"] = [
                {
                    "filename": f"invoice_{invoice.invoice_number}.pdf",
                    "content": pdf_content,
                }
            ]
        
        resend.Emails.send(params)
        logger.info(f"Invoice email sent to {client.email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send invoice email: {str(e)}")
        return False
