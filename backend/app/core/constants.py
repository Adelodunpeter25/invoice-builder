"""Application-wide constants."""

from enum import Enum


class InvoiceStatus(str, Enum):
    """Invoice status options."""

    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class Currency(str, Enum):
    """Supported currencies."""

    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    NGN = "NGN"


class UserRole(str, Enum):
    """User roles."""

    USER = "user"
    ADMIN = "admin"

