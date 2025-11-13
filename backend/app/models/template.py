"""Invoice template model."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Template(Base):
    """Template model allowing users to save custom invoice designs."""

    __tablename__ = "templates"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(255))
    layout: Mapped[str] = mapped_column(String(50), default="standard")
    primary_color: Mapped[str] = mapped_column(String(7), default="#000000")
    secondary_color: Mapped[str] = mapped_column(String(7), default="#666666")
    logo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    default_terms: Mapped[str] = mapped_column(Text, nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="templates")
