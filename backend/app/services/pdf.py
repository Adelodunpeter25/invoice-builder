"""PDF generation service."""
from pathlib import Path
from io import BytesIO
from jinja2 import Environment, FileSystemLoader
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
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
    """Generate PDF for an invoice."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    currency_symbol = get_currency_symbol(invoice.currency.value)
    
    # Title
    c.setFont("Helvetica-Bold", 32)
    c.drawString(40, height - 80, "INVOICE")
    
    # Invoice meta
    c.setFont("Helvetica", 11)
    c.drawString(40, height - 100, f"Invoice No. {invoice.invoice_number} Due: {invoice.due_date.strftime('%b %d %Y')}")
    
    # Bill To and From
    y = height - 150
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "BILL TO")
    c.drawString(320, y, "FROM")
    
    c.setFont("Helvetica", 14)
    y -= 20
    c.drawString(40, y, client.name)
    c.drawString(320, y, user.company_name or user.username)
    
    # Line Items Header
    y -= 80
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "LINE ITEMS")
    
    # Table Header
    y -= 30
    c.setFillColorRGB(0.2, 0.2, 0.2)
    c.rect(40, y - 15, width - 80, 30, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Description")
    c.drawString(300, y, "Price")
    c.drawString(400, y, "QTY")
    c.drawString(500, y, "Total")
    
    # Line Items
    c.setFillColorRGB(0, 0, 0)
    c.setFont("Helvetica", 14)
    y -= 30
    for item in invoice.line_items:
        total_price = item.quantity * item.unit_price
        c.drawString(50, y, item.description[:30])
        c.drawString(300, y, f"{currency_symbol}{item.unit_price:.2f}")
        c.drawString(400, y, str(item.quantity))
        c.drawString(500, y, f"{currency_symbol}{total_price:.2f}")
        y -= 25
    
    # Totals
    y -= 30
    c.drawString(400, y, "Subtotal")
    c.drawString(500, y, f"{currency_symbol}{invoice.subtotal:.2f}")
    
    y -= 20
    c.drawString(400, y, "Discount")
    c.drawString(500, y, f"{currency_symbol}{invoice.discount_amount:.2f}")
    
    y -= 20
    c.drawString(400, y, "Tax")
    c.drawString(500, y, f"{currency_symbol}{invoice.tax_amount:.2f}")
    
    y -= 30
    c.setFont("Helvetica-Bold", 16)
    c.drawString(400, y, "Total")
    c.drawString(500, y, f"{currency_symbol}{invoice.total_amount:.2f}")
    
    # Notes
    if invoice.notes:
        y -= 60
        c.setFont("Helvetica-Bold", 12)
        c.drawString(40, y, "NOTES")
        c.setFont("Helvetica", 12)
        y -= 20
        for line in simpleSplit(invoice.notes, "Helvetica", 12, width - 80):
            c.drawString(40, y, line)
            y -= 15
    
    # Footer
    c.setFillColorRGB(0.2, 0.2, 0.2)
    c.rect(0, 0, width, 40, fill=1)
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica", 11)
    footer_text = f"{user.company_phone or ''} | {user.email or ''}"
    c.drawCentredString(width / 2, 15, footer_text)
    
    c.save()
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
