"""User model."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    """User model representing platform users."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    company_name: Mapped[str] = mapped_column(String(255), nullable=True)
    company_address: Mapped[str] = mapped_column(String(500), nullable=True)
    company_city: Mapped[str] = mapped_column(String(100), nullable=True)
    company_country: Mapped[str] = mapped_column(String(100), nullable=True)
    company_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    invoices: Mapped[list["Invoice"]] = relationship("Invoice", back_populates="user", cascade="all, delete-orphan")
    clients: Mapped[list["Client"]] = relationship("Client", back_populates="user", cascade="all, delete-orphan")
    templates: Mapped[list["Template"]] = relationship("Template", back_populates="user", cascade="all, delete-orphan")
