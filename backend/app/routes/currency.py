"""Currency exchange rate routes."""
from fastapi import APIRouter, Query
from app.services.currency import get_exchange_rates, convert_currency

router = APIRouter(prefix="/currency", tags=["Currency"])


@router.get("/rates")
async def get_rates(base: str = Query("USD", description="Base currency code")):
    """Get exchange rates for a base currency."""
    return await get_exchange_rates(base)


@router.get("/convert")
async def convert(
    amount: float = Query(..., description="Amount to convert"),
    from_currency: str = Query(..., alias="from", description="Source currency code"),
    to_currency: str = Query(..., alias="to", description="Target currency code")
):
    """Convert amount from one currency to another."""
    converted_amount = await convert_currency(amount, from_currency, to_currency)
    return {
        "amount": amount,
        "from": from_currency,
        "to": to_currency,
        "converted_amount": converted_amount
    }
