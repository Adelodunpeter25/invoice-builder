"""PDF generation service."""
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from app.models.client import Client
from app.models.invoice import Invoice
from app.models.user import User


TEMPLATES_DIR = Path(__file__).parent.parent / "templates" / "invoice"


def get_currency_symbol(currency: str) -> str:
    """Get currency symbol."""
    symbols = {
        "NGN": "₦",
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
    }
    return symbols.get(currency, currency)


def generate_invoice_pdf(invoice: Invoice, client: Client, user: User, template_name: str = "invoice_template.html") -> bytes:
    """Generate PDF for an invoice using Jinja2 template."""
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    template = env.get_template(template_name)
    
    currency_symbol = get_currency_symbol(invoice.currency.value)
    
    context = {
        "invoice": invoice,
        "client": client,
        "user": user,
        "line_items": invoice.line_items,
        "currency_symbol": currency_symbol,
    }
    
    html_content = template.render(**context)
    pdf_bytes = HTML(string=html_content).write_pdf()
    
    return pdf_bytes
