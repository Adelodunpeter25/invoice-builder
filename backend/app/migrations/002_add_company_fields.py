"""Add company fields to users table."""
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncConnection


async def upgrade(conn: AsyncConnection) -> None:
    """Add company address fields to users table."""
    await conn.execute(text("""
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS company_address VARCHAR(500),
        ADD COLUMN IF NOT EXISTS company_city VARCHAR(100),
        ADD COLUMN IF NOT EXISTS company_country VARCHAR(100),
        ADD COLUMN IF NOT EXISTS company_phone VARCHAR(50)
    """))


async def downgrade(conn: AsyncConnection) -> None:
    """Remove company address fields from users table."""
    await conn.execute(text("""
        ALTER TABLE users 
        DROP COLUMN IF EXISTS company_address,
        DROP COLUMN IF EXISTS company_city,
        DROP COLUMN IF EXISTS company_country,
        DROP COLUMN IF EXISTS company_phone
    """))
