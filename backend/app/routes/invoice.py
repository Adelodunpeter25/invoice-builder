"""Invoice routes."""

from fastapi import APIRouter, Query

from app.core.constants import InvoiceStatus
from app.core.deps import DBSession
from app.schemas.invoice import InvoiceCreate, InvoiceListResponse, InvoiceResponse, InvoiceUpdate
from app.services.invoice import (
    create_invoice,
    delete_invoice,
    get_invoice_by_id,
    get_invoices,
    update_invoice,
    update_invoice_status,
)
from app.utils.jwt import CurrentUser
from app.utils.pagination import PaginatedResponse, PaginationParams

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.post("", response_model=InvoiceResponse, status_code=201)
async def create_invoice_endpoint(
    data: InvoiceCreate,
    user_id: CurrentUser,
    db: DBSession,
):
    """Create a new invoice."""
    invoice = await create_invoice(db, user_id, data)
    return invoice


@router.get("", response_model=PaginatedResponse[InvoiceListResponse])
async def get_invoices_endpoint(
    user_id: CurrentUser,
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    status: InvoiceStatus | None = None,
    client_id: int | None = None,
):
    """Get paginated list of invoices with optional filters."""
    pagination = PaginationParams(page=page, page_size=page_size)
    invoices, total = await get_invoices(db, user_id, pagination, status, client_id)
    return PaginatedResponse.create(invoices, total, page, page_size)


@router.get("/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice_endpoint(
    invoice_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Get an invoice by ID with line items."""
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice_endpoint(
    invoice_id: int,
    data: InvoiceUpdate,
    user_id: CurrentUser,
    db: DBSession,
):
    """Update an invoice."""
    invoice = await update_invoice(db, user_id, invoice_id, data)
    return invoice


@router.patch("/{invoice_id}/status", response_model=InvoiceResponse)
async def update_invoice_status_endpoint(
    invoice_id: int,
    status: InvoiceStatus,
    user_id: CurrentUser,
    db: DBSession,
):
    """Update invoice status."""
    invoice = await update_invoice_status(db, user_id, invoice_id, status)
    return invoice


@router.delete("/{invoice_id}", status_code=204)
async def delete_invoice_endpoint(
    invoice_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Delete an invoice."""
    await delete_invoice(db, user_id, invoice_id)
