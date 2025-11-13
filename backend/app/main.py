"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.routes.auth import router as auth_router
from app.routes.client import router as client_router
from app.routes.health import router as health_router
from app.routes.invoice import router as invoice_router

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
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


