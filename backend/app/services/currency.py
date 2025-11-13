"""Currency exchange rate service."""
import httpx
from app.core.config import settings


async def get_exchange_rates(base_currency: str = "NGN") -> dict:
    """Get exchange rates for a base currency."""
    if not settings.EXCHANGE_RATE_API_KEY:
        raise ValueError("EXCHANGE_RATE_API_KEY not configured")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.EXCHANGE_RATE_API_URL}/{settings.EXCHANGE_RATE_API_KEY}/latest/{base_currency}")
        response.raise_for_status()
        return response.json()


async def convert_currency(amount: float, from_currency: str, to_currency: str) -> float:
    """Convert amount from one currency to another."""
    if from_currency == to_currency:
        return amount
    
    rates_data = await get_exchange_rates(from_currency)
    rate = rates_data["conversion_rates"].get(to_currency)
    
    if not rate:
        raise ValueError(f"Exchange rate not found for {to_currency}")
    
    return round(amount * rate, 2)
