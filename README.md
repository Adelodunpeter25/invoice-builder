# Invoice Generator

A modern invoice generation platform built with FastAPI and React.

## Features

- 🔐 User authentication with JWT
- 👥 Client management
- 📄 Invoice creation and management
- 💰 Multiple currencies support
- 📧 Email invoices with PDF attachments
- 🎨 Customizable invoice templates
- 📊 Invoice status tracking (Draft, Sent, Paid, Overdue, Cancelled)

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Async ORM
- **PostgreSQL** - Database
- **Argon2** - Password hashing
- **JWT** - Authentication
- **ReportLab** - PDF generation
- **Resend** - Email service
- **uv** - Package manager

### Frontend
- React (to be implemented)

## Getting Started

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- uv package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-gen
```

2. Start the database:
```bash
docker-compose up -d
```

3. Set up the backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. Install dependencies:
```bash
uv sync
```

5. Initialize the database:
```bash
uv run python scripts/init_db.py
```

6. Run the application:
```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/api/v1/openapi.json`
- Interactive docs: `http://localhost:8000/docs`

## Project Structure

```
invoice-gen/
├── backend/
│   ├── app/
│   │   ├── core/          # Core configuration and utilities
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   ├── templates/     # Email and invoice templates
│   │   └── main.py        # Application entry point
│   ├── scripts/           # Utility scripts
│   ├── .env.example       # Environment variables template
│   └── pyproject.toml     # Python dependencies
├── docker-compose.yml     # PostgreSQL setup
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Clients
- `POST /api/v1/clients` - Create client
- `GET /api/v1/clients` - List clients (paginated)
- `GET /api/v1/clients/{id}` - Get client
- `PUT /api/v1/clients/{id}` - Update client
- `DELETE /api/v1/clients/{id}` - Delete client

### Invoices
- `POST /api/v1/invoices` - Create invoice
- `GET /api/v1/invoices` - List invoices (paginated, filterable)
- `GET /api/v1/invoices/{id}` - Get invoice
- `PUT /api/v1/invoices/{id}` - Update invoice
- `PATCH /api/v1/invoices/{id}/status` - Update status
- `DELETE /api/v1/invoices/{id}` - Delete invoice
- `GET /api/v1/invoices/{id}/pdf` - Download PDF
- `POST /api/v1/invoices/{id}/send` - Send via email
- `POST /api/v1/invoices/{id}/clone` - Clone invoice

### Templates
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates` - List templates
- `GET /api/v1/templates/default` - Get default template
- `GET /api/v1/templates/{id}` - Get template
- `PUT /api/v1/templates/{id}` - Update template
- `DELETE /api/v1/templates/{id}` - Delete template

## Environment Variables

See `.env.example` for required configuration:

- `SECRET_KEY` - JWT secret key
- `DATABASE_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Resend API key for emails
- `EMAILS_FROM_EMAIL` - Sender email address

## Development

### Database Migrations

Using migrator-cli:
```bash
# Create migration
uv run migrator create migration_name

# Apply migrations
uv run migrator upgrade

# Check status
uv run migrator status
```

See `backend/DATABASE.md` for more details.

### Running Tests

```bash
cd backend
uv run pytest
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
