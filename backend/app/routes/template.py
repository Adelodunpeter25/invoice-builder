"""Template routes."""

from fastapi import APIRouter

from app.core.deps import DBSession
from app.schemas.template import TemplateCreate, TemplateResponse, TemplateUpdate
from app.services.template import (
    create_template,
    delete_template,
    get_default_template,
    get_template_by_id,
    get_templates,
    update_template,
)
from app.utils.jwt import CurrentUser

router = APIRouter(prefix="/templates", tags=["Templates"])


@router.post("", response_model=TemplateResponse, status_code=201)
async def create_template_endpoint(
    data: TemplateCreate,
    user_id: CurrentUser,
    db: DBSession,
):
    """Create a new template."""
    template = await create_template(db, user_id, data)
    return template


@router.get("", response_model=list[TemplateResponse])
async def get_templates_endpoint(
    user_id: CurrentUser,
    db: DBSession,
):
    """Get all templates."""
    templates = await get_templates(db, user_id)
    return templates


@router.get("/default", response_model=TemplateResponse | None)
async def get_default_template_endpoint(
    user_id: CurrentUser,
    db: DBSession,
):
    """Get default template."""
    template = await get_default_template(db, user_id)
    return template


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template_endpoint(
    template_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Get a template by ID."""
    template = await get_template_by_id(db, user_id, template_id)
    return template


@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template_endpoint(
    template_id: int,
    data: TemplateUpdate,
    user_id: CurrentUser,
    db: DBSession,
):
    """Update a template."""
    template = await update_template(db, user_id, template_id, data)
    return template


@router.delete("/{template_id}", status_code=204)
async def delete_template_endpoint(
    template_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Delete a template."""
    await delete_template(db, user_id, template_id)
