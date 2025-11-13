"""Invoice schemas."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, field_validator, model_validator

from app.core.constants import Currency, InvoiceStatus


class LineItemCreate(BaseModel):
    """Line item creation schema."""

    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal("0")

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v: Decimal) -> Decimal:
        """Validate quantity is positive."""
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        return v

    @field_validator("unit_price")
    @classmethod
    def validate_unit_price(cls, v: Decimal) -> Decimal:
        """Validate unit price is non-negative."""
        if v < 0:
            raise ValueError("Unit price cannot be negative")
        return v

    @field_validator("tax_rate")
    @classmethod
    def validate_tax_rate(cls, v: Decimal) -> Decimal:
        """Validate tax rate is between 0 and 100."""
        if v < 0 or v > 100:
            raise ValueError("Tax rate must be between 0 and 100")
        return v


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

    @field_validator("client_id")
    @classmethod
    def validate_client_id(cls, v: int) -> int:
        """Validate client_id is positive."""
        if v <= 0:
            raise ValueError("Client ID must be positive")
        return v

    @field_validator("line_items")
    @classmethod
    def validate_line_items(cls, v: list[LineItemCreate]) -> list[LineItemCreate]:
        """Validate at least one line item exists."""
        if not v or len(v) == 0:
            raise ValueError("Invoice must have at least one line item")
        return v

    @model_validator(mode="after")
    def validate_dates(self):
        """Validate due date is after issue date."""
        if self.due_date < self.issue_date:
            raise ValueError("Due date must be on or after issue date")
        return self


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
