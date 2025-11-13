"""Invoice model."""

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import Currency, InvoiceStatus
from app.core.database import Base


class Invoice(Base):
    """Invoice model."""

    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    client_id: Mapped[int] = mapped_column(Integer, ForeignKey("clients.id", ondelete="CASCADE"))
    invoice_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    status: Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus), default=InvoiceStatus.DRAFT)
    currency: Mapped[Currency] = mapped_column(Enum(Currency), default=Currency.USD)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    issue_date: Mapped[date] = mapped_column(Date)
    due_date: Mapped[date] = mapped_column(Date)
    payment_terms: Mapped[str] = mapped_column(Text, nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="invoices")
    client: Mapped["Client"] = relationship("Client", back_populates="invoices")
    line_items: Mapped[list["LineItem"]] = relationship("LineItem", back_populates="invoice", cascade="all, delete-orphan")
