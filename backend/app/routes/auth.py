"""Authentication routes."""

from fastapi import APIRouter

from app.core.deps import DBSession
from app.schemas.auth import TokenResponse, UserLogin, UserRegister
from app.schemas.user import UserResponse
from app.services.auth import get_user_by_id, login_user, register_user
from app.utils.jwt import CurrentUser

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: UserRegister, db: DBSession):
    """Register a new user."""
    user = await register_user(db, data)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: DBSession):
    """Login and receive access tokens."""
    return await login_user(db, data)


@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: CurrentUser, db: DBSession):
    """Get current authenticated user."""
    user = await get_user_by_id(db, user_id)
    return user
