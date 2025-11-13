"""Line item model."""

from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class LineItem(Base):
    """Line item model representing individual products/services on an invoice."""

    __tablename__ = "line_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    invoice_id: Mapped[int] = mapped_column(Integer, ForeignKey("invoices.id", ondelete="CASCADE"))
    description: Mapped[str] = mapped_column(Text)
    quantity: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    tax_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)

    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="line_items")
