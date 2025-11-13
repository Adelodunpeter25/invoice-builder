"""Client schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class ClientCreate(BaseModel):
    """Client creation schema."""

    name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    tax_id: str | None = None


class ClientUpdate(BaseModel):
    """Client update schema."""

    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None
    tax_id: str | None = None


class ClientResponse(BaseModel):
    """Client response schema."""

    id: int
    user_id: int
    name: str
    email: str
    phone: str | None
    address: str | None
    tax_id: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
