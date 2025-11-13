"""Invoice operations routes (PDF, Email, Clone)."""

from fastapi import APIRouter, Response

from app.core.deps import DBSession
from app.schemas.invoice import InvoiceResponse
from app.services.client import get_client_by_id
from app.services.email import send_invoice_email
from app.services.invoice import clone_invoice, get_invoice_by_id
from app.services.pdf import generate_invoice_pdf
from app.services.auth import get_user_by_id
from app.utils.jwt import CurrentUser

router = APIRouter(prefix="/invoices", tags=["Invoice Operations"])


@router.get("/{invoice_id}/pdf")
async def download_invoice_pdf(
    invoice_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Generate and download invoice PDF."""
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    client = await get_client_by_id(db, user_id, invoice.client_id)
    user = await get_user_by_id(db, user_id)
    
    pdf_bytes = generate_invoice_pdf(invoice, client, user)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=invoice_{invoice.invoice_number}.pdf"
        },
    )


@router.post("/{invoice_id}/send")
async def send_invoice(
    invoice_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Send invoice via email with PDF attachment."""
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    client = await get_client_by_id(db, user_id, invoice.client_id)
    user = await get_user_by_id(db, user_id)
    
    pdf_bytes = generate_invoice_pdf(invoice, client, user)
    
    success = await send_invoice_email(
        invoice=invoice,
        client=client,
        company_name=user.company_name or user.username,
        pdf_content=pdf_bytes,
    )
    
    return {"success": success, "message": "Invoice sent successfully" if success else "Failed to send invoice"}


@router.post("/{invoice_id}/clone", response_model=InvoiceResponse)
async def clone_invoice_endpoint(
    invoice_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Clone an existing invoice."""
    invoice = await clone_invoice(db, user_id, invoice_id)
    return invoice
