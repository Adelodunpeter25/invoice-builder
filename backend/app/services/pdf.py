"""PDF generation service."""

from datetime import date
from decimal import Decimal
from io import BytesIO

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from app.models.client import Client
from app.models.invoice import Invoice
from app.models.user import User


def generate_invoice_pdf(invoice: Invoice, client: Client, user: User) -> bytes:
    """Generate PDF for an invoice."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title = Paragraph(f"<b>INVOICE {invoice.invoice_number}</b>", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Company and Client Info
    info_data = [
        ["From:", "Bill To:"],
        [user.company_name or user.username, client.name],
        [user.email, client.email],
        ["", client.phone or ""],
        ["", client.address or ""],
    ]
    
    info_table = Table(info_data, colWidths=[3 * inch, 3 * inch])
    info_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Invoice Details
    details_data = [
        ["Invoice Date:", str(invoice.issue_date)],
        ["Due Date:", str(invoice.due_date)],
        ["Status:", invoice.status.value.upper()],
        ["Currency:", invoice.currency.value],
    ]
    
    details_table = Table(details_data, colWidths=[2 * inch, 2 * inch])
    elements.append(details_table)
    elements.append(Spacer(1, 0.5 * inch))
    
    # Line Items
    line_items_data = [["Description", "Quantity", "Unit Price", "Tax Rate", "Total"]]
    
    for item in invoice.line_items:
        subtotal = item.quantity * item.unit_price
        tax = subtotal * (item.tax_rate / Decimal("100"))
        total = subtotal + tax
        
        line_items_data.append([
            item.description,
            str(item.quantity),
            f"{invoice.currency.value} {item.unit_price:.2f}",
            f"{item.tax_rate}%",
            f"{invoice.currency.value} {total:.2f}",
        ])
    
    line_items_table = Table(line_items_data, colWidths=[2.5 * inch, 1 * inch, 1.2 * inch, 1 * inch, 1.3 * inch])
    line_items_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(line_items_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Total
    total_data = [
        ["", "", "", "TOTAL:", f"{invoice.currency.value} {invoice.amount:.2f}"]
    ]
    total_table = Table(total_data, colWidths=[2.5 * inch, 1 * inch, 1.2 * inch, 1 * inch, 1.3 * inch])
    total_table.setStyle(TableStyle([
        ("ALIGN", (3, 0), (-1, -1), "RIGHT"),
        ("FONTNAME", (3, 0), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (3, 0), (-1, -1), 14),
    ]))
    elements.append(total_table)
    
    # Payment Terms and Notes
    if invoice.payment_terms:
        elements.append(Spacer(1, 0.5 * inch))
        terms = Paragraph(f"<b>Payment Terms:</b><br/>{invoice.payment_terms}", styles["Normal"])
        elements.append(terms)
    
    if invoice.notes:
        elements.append(Spacer(1, 0.3 * inch))
        notes = Paragraph(f"<b>Notes:</b><br/>{invoice.notes}", styles["Normal"])
        elements.append(notes)
    
    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
