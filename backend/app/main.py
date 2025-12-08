"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.handlers import validation_exception_handler, global_exception_handler
from app.routes.auth import router as auth_router
from app.routes.client import router as client_router
from app.routes.currency import router as currency_router
from app.routes.health import router as health_router
from app.routes.invoice import router as invoice_router
from app.routes.invoice_operations import router as invoice_operations_router
from app.routes.template import router as template_router

setup_logging()

description = """
Invoice Generator API

A modern invoice generation platform with user authentication, client management, 
and automated invoice creation with PDF generation and email delivery.
"""

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=description,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1},
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://invoice.estateman.online", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(client_router, prefix=settings.API_V1_STR)
app.include_router(currency_router, prefix=settings.API_V1_STR)
app.include_router(invoice_router, prefix=settings.API_V1_STR)
app.include_router(invoice_operations_router, prefix=settings.API_V1_STR)
app.include_router(template_router, prefix=settings.API_V1_STR)


