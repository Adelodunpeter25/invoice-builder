from app.core.database import Base
from app.models import User, Client, Invoice, LineItem, Template

DATABASE_URL = "postgresql+asyncpg://invoice_user:invoice_pass@localhost:5432/invoice_db"
