"""Authentication routes."""

from fastapi import APIRouter

from app.core.deps import DBSession
from app.core.exceptions import UnauthorizedException
from app.schemas.auth import TokenRefresh, TokenResponse, UserLogin, UserRegister
from app.schemas.user import UserResponse
from app.services.auth import get_user_by_id, login_user, register_user
from app.utils.auth import create_access_token, create_refresh_token, decode_token
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


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(data: TokenRefresh, db: DBSession):
    """Refresh access token using refresh token."""
    payload = decode_token(data.refresh_token)
    
    if payload is None or payload.get("type") != "refresh":
        raise UnauthorizedException("Invalid refresh token")
    
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")
    
    user = await get_user_by_id(db, int(user_id))
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: CurrentUser, db: DBSession):
    """Get current authenticated user."""
    user = await get_user_by_id(db, user_id)
    return user
