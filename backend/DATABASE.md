# Database Setup

## Prerequisites

1. Start PostgreSQL database:
```bash
docker-compose up -d
```

## Initialize Database

### Option 1: Using init_db.py (Quick Setup)
```bash
uv run python init_db.py
```

This will create all tables based on SQLAlchemy models.

### Option 2: Using migrator-cli (Production)
```bash
# Generate initial migration
uv run migrator create initial_schema

# Apply migrations
uv run migrator upgrade

# Check migration status
uv run migrator status
```

## Migration Commands

- `migrator create <name>` - Create a new migration
- `migrator upgrade` - Apply pending migrations
- `migrator downgrade` - Rollback last migration
- `migrator status` - Show migration status
- `migrator history` - Show migration history

## Database Configuration

Database settings are in `.env`:
```
DATABASE_URL=postgresql+asyncpg://invoice_user:invoice_pass@localhost:5432/invoice_db
```

## Models

- **User** - Platform users with authentication
- **Client** - Customer information
- **Invoice** - Invoice records with status tracking
- **LineItem** - Individual invoice line items
- **Template** - Custom invoice templates
