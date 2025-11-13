"""FastAPI application entry point."""

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.routes.auth import router as auth_router
from app.routes.client import router as client_router
from app.routes.health import router as health_router
from app.routes.invoice import router as invoice_router
from app.routes.invoice_operations import router as invoice_operations_router
from app.routes.template import router as template_router

setup_logging()

description = """
## Invoice Generator API

A modern invoice generation platform with user authentication, client management, 
and automated invoice creation with PDF generation and email delivery.

### Features

* **Authentication** - JWT-based user authentication with refresh tokens
* **Client Management** - Create and manage customer information
* **Invoice Management** - Create, update, and track invoices with multiple statuses
* **PDF Generation** - Generate professional PDF invoices
* **Email Delivery** - Send invoices via email with PDF attachments
* **Templates** - Customize invoice templates with branding
* **Multi-Currency** - Support for USD, EUR, and GBP

### Authentication

All endpoints except `/health` and authentication endpoints require a Bearer token.
Include the token in the Authorization header: `Authorization: Bearer <token>`
"""

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=description,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1},
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": " -> ".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        })
    
    logger.warning(f"Validation error: {errors}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Validation error",
            "errors": errors,
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred",
            "error": str(exc) if settings.VERSION != "production" else None,
        },
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(client_router, prefix=settings.API_V1_STR)
app.include_router(invoice_router, prefix=settings.API_V1_STR)
app.include_router(invoice_operations_router, prefix=settings.API_V1_STR)
app.include_router(template_router, prefix=settings.API_V1_STR)


