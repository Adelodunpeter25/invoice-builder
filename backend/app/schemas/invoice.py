"""Invoice schemas."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel

from app.core.constants import Currency, InvoiceStatus


class LineItemCreate(BaseModel):
    """Line item creation schema."""

    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal("0")


class LineItemResponse(BaseModel):
    """Line item response schema."""

    id: int
    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal

    model_config = {"from_attributes": True}


class InvoiceCreate(BaseModel):
    """Invoice creation schema."""

    client_id: int
    issue_date: date
    due_date: date
    currency: Currency = Currency.USD
    payment_terms: str | None = None
    notes: str | None = None
    line_items: list[LineItemCreate]


class InvoiceUpdate(BaseModel):
    """Invoice update schema."""

    client_id: int | None = None
    status: InvoiceStatus | None = None
    issue_date: date | None = None
    due_date: date | None = None
    currency: Currency | None = None
    payment_terms: str | None = None
    notes: str | None = None
    line_items: list[LineItemCreate] | None = None


class InvoiceResponse(BaseModel):
    """Invoice response schema."""

    id: int
    user_id: int
    client_id: int
    invoice_number: str
    status: InvoiceStatus
    currency: Currency
    amount: Decimal
    issue_date: date
    due_date: date
    payment_terms: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime
    line_items: list[LineItemResponse]

    model_config = {"from_attributes": True}


class InvoiceListResponse(BaseModel):
    """Invoice list response schema (without line items)."""

    id: int
    user_id: int
    client_id: int
    invoice_number: str
    status: InvoiceStatus
    currency: Currency
    amount: Decimal
    issue_date: date
    due_date: date
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
