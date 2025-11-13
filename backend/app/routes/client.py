"""Client routes."""

from fastapi import APIRouter, Depends, Query

from app.core.deps import DBSession
from app.schemas.client import ClientCreate, ClientResponse, ClientUpdate
from app.services.client import (
    create_client,
    delete_client,
    get_client_by_id,
    get_clients,
    update_client,
)
from app.utils.jwt import CurrentUser
from app.utils.pagination import PaginatedResponse, PaginationParams

router = APIRouter(prefix="/clients", tags=["Clients"])


@router.post("", response_model=ClientResponse, status_code=201)
async def create_client_endpoint(
    data: ClientCreate,
    user_id: CurrentUser,
    db: DBSession,
):
    """Create a new client."""
    client = await create_client(db, user_id, data)
    return client


@router.get("", response_model=PaginatedResponse[ClientResponse])
async def get_clients_endpoint(
    user_id: CurrentUser,
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
):
    """Get paginated list of clients."""
    pagination = PaginationParams(page=page, page_size=page_size)
    clients, total = await get_clients(db, user_id, pagination)
    return PaginatedResponse.create(clients, total, page, page_size)


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client_endpoint(
    client_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Get a client by ID."""
    client = await get_client_by_id(db, user_id, client_id)
    return client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client_endpoint(
    client_id: int,
    data: ClientUpdate,
    user_id: CurrentUser,
    db: DBSession,
):
    """Update a client."""
    client = await update_client(db, user_id, client_id, data)
    return client


@router.delete("/{client_id}", status_code=204)
async def delete_client_endpoint(
    client_id: int,
    user_id: CurrentUser,
    db: DBSession,
):
    """Delete a client."""
    await delete_client(db, user_id, client_id)
