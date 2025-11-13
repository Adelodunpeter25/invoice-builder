"""User schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserResponse(BaseModel):
    """User response schema."""

    id: int
    username: str
    email: EmailStr
    company_name: str | None
    company_address: str | None
    company_city: str | None
    company_country: str | None
    company_phone: str | None
    preferred_currency: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    """User update schema."""

    email: EmailStr | None = None
    company_name: str | None = Field(None, max_length=255)
    company_address: str | None = Field(None, max_length=500)
    company_city: str | None = Field(None, max_length=100)
    company_country: str | None = Field(None, max_length=100)
    company_phone: str | None = Field(None, max_length=50)
    preferred_currency: str | None = Field(None, max_length=3)
    current_password: str | None = None
    new_password: str | None = None

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str | None) -> str | None:
        """Validate password strength."""
        if v is not None and len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return v
