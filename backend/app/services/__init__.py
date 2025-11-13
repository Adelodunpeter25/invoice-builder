"""Business logic services."""

from app.services.auth import get_user_by_id, login_user, register_user
from app.services.client import (
    create_client,
    delete_client,
    get_client_by_id,
    get_clients,
    update_client,
)
from app.services.email import send_invoice_email
from app.services.invoice import (
    check_duplicate_invoice,
    clone_invoice,
    create_invoice,
    delete_invoice,
    get_invoice_by_id,
    get_invoices,
    update_invoice,
    update_invoice_status,
)
from app.services.pdf import generate_invoice_pdf
from app.services.template import (
    create_template,
    delete_template,
    get_default_template,
    get_template_by_id,
    get_templates,
    update_template,
)

__all__ = [
    "register_user",
    "login_user",
    "get_user_by_id",
    "create_client",
    "get_clients",
    "get_client_by_id",
    "update_client",
    "delete_client",
    "create_invoice",
    "get_invoices",
    "get_invoice_by_id",
    "update_invoice",
    "delete_invoice",
    "update_invoice_status",
    "clone_invoice",
    "check_duplicate_invoice",
    "create_template",
    "get_templates",
    "get_template_by_id",
    "update_template",
    "delete_template",
    "get_default_template",
    "send_invoice_email",
    "generate_invoice_pdf",
]

