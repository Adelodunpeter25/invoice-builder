"""Template service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.template import Template
from app.schemas.template import TemplateCreate, TemplateUpdate


async def create_template(db: AsyncSession, user_id: int, data: TemplateCreate) -> Template:
    """Create a new template."""
    if data.is_default:
        result = await db.execute(
            select(Template).where(Template.user_id == user_id, Template.is_default == True)
        )
        existing_default = result.scalar_one_or_none()
        if existing_default:
            existing_default.is_default = False
    
    template = Template(user_id=user_id, **data.model_dump())
    db.add(template)
    await db.flush()
    await db.refresh(template)
    return template


async def get_templates(db: AsyncSession, user_id: int) -> list[Template]:
    """Get all templates for a user."""
    result = await db.execute(
        select(Template).where(Template.user_id == user_id).order_by(Template.created_at.desc())
    )
    return list(result.scalars().all())


async def get_template_by_id(db: AsyncSession, user_id: int, template_id: int) -> Template:
    """Get a template by ID."""
    result = await db.execute(select(Template).where(Template.id == template_id))
    template = result.scalar_one_or_none()
    
    if not template:
        raise NotFoundException("Template not found")
    
    if template.user_id != user_id:
        raise ForbiddenException("Access denied")
    
    return template


async def update_template(
    db: AsyncSession, user_id: int, template_id: int, data: TemplateUpdate
) -> Template:
    """Update a template."""
    template = await get_template_by_id(db, user_id, template_id)
    
    update_data = data.model_dump(exclude_unset=True)
    
    if update_data.get("is_default"):
        result = await db.execute(
            select(Template).where(Template.user_id == user_id, Template.is_default == True)
        )
        existing_default = result.scalar_one_or_none()
        if existing_default and existing_default.id != template_id:
            existing_default.is_default = False
    
    for field, value in update_data.items():
        setattr(template, field, value)
    
    await db.flush()
    await db.refresh(template)
    return template


async def delete_template(db: AsyncSession, user_id: int, template_id: int) -> None:
    """Delete a template."""
    template = await get_template_by_id(db, user_id, template_id)
    await db.delete(template)
    await db.flush()


async def get_default_template(db: AsyncSession, user_id: int) -> Template | None:
    """Get user's default template."""
    result = await db.execute(
        select(Template).where(Template.user_id == user_id, Template.is_default == True)
    )
    return result.scalar_one_or_none()
