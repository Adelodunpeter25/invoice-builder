"""Initialize production database with admin user."""

import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models import User
from app.utils.auth import hash_password

DATABASE_URL = os.getenv('PROD_DB_URL') 

async def init_db():
    """Create all database tables and admin user."""
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        admin = User(
            email="admin@invoice.com",
            username="admin",
            hashed_password=hash_password("admin123"),
            company_name="Admin Company",
            company_address="Lagos Nigeria",
            company_phone="07039201122"
        )
        session.add(admin)
        await session.commit()
    
    await engine.dispose()
    print("Database initialized with admin user!")

if __name__ == "__main__":
    asyncio.run(init_db())
