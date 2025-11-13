"""Authentication schemas."""

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """User registration schema."""

    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)
    company_name: str | None = None


class UserLogin(BaseModel):
    """User login schema."""

    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Token refresh schema."""

    refresh_token: str
