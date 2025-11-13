"""API routes."""

from app.routes.auth import router as auth_router
from app.routes.client import router as client_router
from app.routes.health import router as health_router
from app.routes.invoice import router as invoice_router
from app.routes.invoice_operations import router as invoice_operations_router
from app.routes.template import router as template_router

__all__ = [
    "auth_router",
    "health_router",
    "client_router",
    "invoice_router",
    "invoice_operations_router",
    "template_router",
]

