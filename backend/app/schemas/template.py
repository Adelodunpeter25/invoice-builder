"""Template schemas."""

from datetime import datetime

from pydantic import BaseModel


class TemplateCreate(BaseModel):
    """Template creation schema."""

    name: str
    layout: str = "standard"
    primary_color: str = "#000000"
    secondary_color: str = "#666666"
    logo_url: str | None = None
    default_terms: str | None = None
    is_default: bool = False


class TemplateUpdate(BaseModel):
    """Template update schema."""

    name: str | None = None
    layout: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    logo_url: str | None = None
    default_terms: str | None = None
    is_default: bool | None = None


class TemplateResponse(BaseModel):
    """Template response schema."""

    id: int
    user_id: int
    name: str
    layout: str
    primary_color: str
    secondary_color: str
    logo_url: str | None
    default_terms: str | None
    is_default: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
