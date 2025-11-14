export const formatCurrency = (amount: number | string, currency: string = 'NGN'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0.00';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  return symbols[currency] || currency;
};

export const convertAndFormatCurrency = (
  amount: number | string,
  convertedAmount: number | undefined,
  targetCurrency: string
): string => {
  const displayAmount = convertedAmount ?? (typeof amount === 'string' ? parseFloat(amount) : amount);
  return formatCurrency(displayAmount, targetCurrency);
};
