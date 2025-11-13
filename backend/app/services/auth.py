"""Authentication service."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestException, UnauthorizedException
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserRegister
from app.schemas.user import UserUpdate
from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)


async def register_user(db: AsyncSession, data: UserRegister) -> User:
    """Register a new user."""
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise BadRequestException("Email already registered")

    result = await db.execute(select(User).where(User.username == data.username))
    if result.scalar_one_or_none():
        raise BadRequestException("Username already taken")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        company_name=data.company_name,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def login_user(db: AsyncSession, data: UserLogin) -> TokenResponse:
    """Authenticate user and return tokens."""
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise UnauthorizedException("Invalid email or password")

    if not user.is_active:
        raise UnauthorizedException("Account is inactive")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
    """Get user by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise UnauthorizedException("User not found")
    return user


async def update_user(db: AsyncSession, user_id: int, data: UserUpdate) -> User:
    """Update user profile."""
    user = await get_user_by_id(db, user_id)

    if data.email and data.email != user.email:
        result = await db.execute(select(User).where(User.email == data.email))
        if result.scalar_one_or_none():
            raise BadRequestException("Email already in use")
        user.email = data.email

    if data.company_name is not None:
        user.company_name = data.company_name
    
    if data.company_address is not None:
        user.company_address = data.company_address
    
    if data.company_city is not None:
        user.company_city = data.company_city
    
    if data.company_country is not None:
        user.company_country = data.company_country
    
    if data.company_phone is not None:
        user.company_phone = data.company_phone

    if data.new_password:
        if not data.current_password:
            raise BadRequestException("Current password is required")
        if not verify_password(data.current_password, user.hashed_password):
            raise BadRequestException("Current password is incorrect")
        user.hashed_password = hash_password(data.new_password)

    await db.flush()
    await db.refresh(user)
    return user
