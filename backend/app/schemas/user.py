"""User schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    """User response schema."""

    id: int
    username: str
    email: EmailStr
    company_name: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
