"""Client service."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenException, NotFoundException
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate
from app.utils.pagination import PaginationParams


async def create_client(db: AsyncSession, user_id: int, data: ClientCreate) -> Client:
    """Create a new client."""
    client = Client(user_id=user_id, **data.model_dump())
    db.add(client)
    await db.flush()
    await db.refresh(client)
    return client


async def get_clients(db: AsyncSession, user_id: int, pagination: PaginationParams) -> tuple[list[Client], int]:
    """Get paginated list of clients for a user."""
    query = select(Client).where(Client.user_id == user_id)
    
    count_query = select(func.count()).select_from(Client).where(Client.user_id == user_id)
    total = await db.scalar(count_query)
    
    result = await db.execute(
        query.offset(pagination.offset).limit(pagination.limit).order_by(Client.created_at.desc())
    )
    clients = result.scalars().all()
    
    return list(clients), total or 0


async def get_client_by_id(db: AsyncSession, user_id: int, client_id: int) -> Client:
    """Get a client by ID."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    
    if not client:
        raise NotFoundException("Client not found")
    
    if client.user_id != user_id:
        raise ForbiddenException("Access denied")
    
    return client


async def update_client(db: AsyncSession, user_id: int, client_id: int, data: ClientUpdate) -> Client:
    """Update a client."""
    client = await get_client_by_id(db, user_id, client_id)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    await db.flush()
    await db.refresh(client)
    return client


async def delete_client(db: AsyncSession, user_id: int, client_id: int) -> None:
    """Delete a client."""
    client = await get_client_by_id(db, user_id, client_id)
    await db.delete(client)
    await db.flush()
