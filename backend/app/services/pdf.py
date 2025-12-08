"""PDF generation service."""

from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from decimal import Decimal

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


def format_currency(amount: float | Decimal) -> str:
    """Format currency with commas."""
    return f"{float(amount):,.2f}"


def generate_invoice_pdf(
    invoice: Invoice,
    client: Client,
    user: User,
    template_name: str = "invoice_template.html"
) -> bytes:
    """Generate PDF from HTML template."""
    env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))
    env.filters['format_currency'] = format_currency
    
    template = env.get_template(template_name)
    
    currency_symbol = get_currency_symbol(invoice.currency.value)
    
    # Calculate line item totals
    line_items_with_totals = []
    subtotal = Decimal("0")
    
    for item in invoice.line_items:
        item_subtotal = item.quantity * item.unit_price
        tax = item_subtotal * (item.tax_rate / Decimal("100"))
        total_price = item_subtotal + tax
        subtotal += total_price
        
        line_items_with_totals.append({
            "description": item.description,
            "quantity": float(item.quantity),
            "unit_price": float(item.unit_price),
            "tax_rate": float(item.tax_rate),
            "total_price": float(total_price),
        })
    
    html_content = template.render(
        invoice=invoice,
        client=client,
        user=user,
        currency_symbol=currency_symbol,
        line_items=line_items_with_totals,
        subtotal=float(subtotal),
    )
    
    pdf_bytes = HTML(string=html_content).write_pdf()
    
    return pdf_bytes
