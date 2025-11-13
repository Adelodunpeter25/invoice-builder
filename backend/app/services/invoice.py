"""Invoice service."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.constants import InvoiceStatus
from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.invoice import Invoice
from app.models.line_item import LineItem
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate
from app.utils.pagination import PaginationParams


async def generate_invoice_number(db: AsyncSession, user_id: int) -> str:
    """Generate unique invoice number."""
    year = datetime.utcnow().year
    result = await db.execute(
        select(func.count()).select_from(Invoice).where(Invoice.user_id == user_id)
    )
    count = result.scalar() or 0
    return f"INV-{year}-{count + 1:05d}"


def calculate_invoice_amount(line_items: list[LineItem]) -> Decimal:
    """Calculate total invoice amount including tax."""
    total = Decimal("0")
    for item in line_items:
        subtotal = item.quantity * item.unit_price
        tax = subtotal * (item.tax_rate / Decimal("100"))
        total += subtotal + tax
    return total


async def create_invoice(db: AsyncSession, user_id: int, data: InvoiceCreate) -> Invoice:
    """Create a new invoice."""
    invoice_number = await generate_invoice_number(db, user_id)
    
    invoice = Invoice(
        user_id=user_id,
        client_id=data.client_id,
        invoice_number=invoice_number,
        issue_date=data.issue_date,
        due_date=data.due_date,
        currency=data.currency,
        payment_terms=data.payment_terms,
        notes=data.notes,
        status=InvoiceStatus.DRAFT,
    )
    db.add(invoice)
    await db.flush()
    
    line_items = [
        LineItem(invoice_id=invoice.id, **item.model_dump())
        for item in data.line_items
    ]
    db.add_all(line_items)
    await db.flush()
    
    invoice.amount = calculate_invoice_amount(line_items)
    await db.flush()
    await db.refresh(invoice, ["line_items"])
    
    return invoice


async def get_invoices(
    db: AsyncSession,
    user_id: int,
    pagination: PaginationParams,
    status: InvoiceStatus | None = None,
    client_id: int | None = None,
) -> tuple[list[Invoice], int]:
    """Get paginated list of invoices for a user."""
    query = select(Invoice).where(Invoice.user_id == user_id)
    count_query = select(func.count()).select_from(Invoice).where(Invoice.user_id == user_id)
    
    if status:
        query = query.where(Invoice.status == status)
        count_query = count_query.where(Invoice.status == status)
    
    if client_id:
        query = query.where(Invoice.client_id == client_id)
        count_query = count_query.where(Invoice.client_id == client_id)
    
    total = await db.scalar(count_query)
    
    result = await db.execute(
        query.offset(pagination.offset).limit(pagination.limit).order_by(Invoice.created_at.desc())
    )
    invoices = result.scalars().all()
    
    return list(invoices), total or 0


async def get_invoice_by_id(db: AsyncSession, user_id: int, invoice_id: int) -> Invoice:
    """Get an invoice by ID with line items."""
    result = await db.execute(
        select(Invoice)
        .options(selectinload(Invoice.line_items))
        .where(Invoice.id == invoice_id)
    )
    invoice = result.scalar_one_or_none()
    
    if not invoice:
        raise NotFoundException("Invoice not found")
    
    if invoice.user_id != user_id:
        raise ForbiddenException("Access denied")
    
    return invoice


async def update_invoice(db: AsyncSession, user_id: int, invoice_id: int, data: InvoiceUpdate) -> Invoice:
    """Update an invoice."""
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    
    update_data = data.model_dump(exclude_unset=True, exclude={"line_items"})
    for field, value in update_data.items():
        setattr(invoice, field, value)
    
    if data.line_items is not None:
        await db.execute(select(LineItem).where(LineItem.invoice_id == invoice_id))
        for item in invoice.line_items:
            await db.delete(item)
        
        line_items = [
            LineItem(invoice_id=invoice.id, **item.model_dump())
            for item in data.line_items
        ]
        db.add_all(line_items)
        await db.flush()
        await db.refresh(invoice, ["line_items"])
        
        invoice.amount = calculate_invoice_amount(invoice.line_items)
    
    await db.flush()
    await db.refresh(invoice)
    return invoice


async def delete_invoice(db: AsyncSession, user_id: int, invoice_id: int) -> None:
    """Delete an invoice."""
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    await db.delete(invoice)
    await db.flush()


async def update_invoice_status(
    db: AsyncSession, user_id: int, invoice_id: int, status: InvoiceStatus
) -> Invoice:
    """Update invoice status."""
    invoice = await get_invoice_by_id(db, user_id, invoice_id)
    invoice.status = status
    await db.flush()
    await db.refresh(invoice)
    return invoice
