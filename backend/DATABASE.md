# Database Setup

## Prerequisites

1. Start PostgreSQL database:
```bash
docker-compose up -d
```

## Initialize Database

### Option 1: Using init_db.py (Quick Setup for Development)
```bash
uv run python scripts/init_db.py
```

This will create all tables based on SQLAlchemy models.

### Option 2: Using migrator-cli (Recommended for Production)

1. Initialize migration environment:
```bash
cd backend
migrator init
```

2. Create initial migration:
```bash
migrator makemigrations "initial schema"
```

3. Apply migrations:
```bash
migrator migrate
```

## Migration Commands

- `migrator init` - Initialize migration environment
- `migrator makemigrations "description"` - Create a new migration
- `migrator migrate` - Apply pending migrations
- `migrator downgrade` - Rollback last migration
- `migrator history` - Show migration history
- `migrator current` - Show current revision
- `migrator status` - Show migration status
- `migrator stamp head` - Mark database as migrated (for existing databases)

## Database Configuration

Database settings are configured in `.env`:
```
# For the FastAPI app (with asyncpg driver)
DATABASE_URL=postgresql+asyncpg://invoice_user:invoice_pass@localhost:5432/invoice_db
```

**Note**: migrator-cli will automatically convert `postgresql+asyncpg://` to `postgresql://` for migrations.

## Models

- **User** - Platform users with authentication
- **Client** - Customer information
- **Invoice** - Invoice records with status tracking
- **LineItem** - Individual invoice line items
- **Template** - Custom invoice templates

## Relationships

- User → Clients (one-to-many)
- User → Invoices (one-to-many)
- User → Templates (one-to-many)
- Client → Invoices (one-to-many)
- Invoice → LineItems (one-to-many)
