import { useConvertCurrency } from '@/hooks/useCurrency';
import { getCurrencySymbol, formatCurrency } from '@/lib/currency';

interface CurrencyAmountProps {
  amount: number | string;
  fromCurrency: string;
  toCurrency: string;
  className?: string;
}

export const CurrencyAmount = ({ amount, fromCurrency, toCurrency, className }: CurrencyAmountProps) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const { data, isLoading } = useConvertCurrency(numAmount, fromCurrency, toCurrency);
  
  const displayAmount = data?.converted_amount ?? numAmount;
  const symbol = getCurrencySymbol(toCurrency);
  
  if (isLoading) {
    return <span className={className}>...</span>;
  }
  
  return (
    <span className={className}>
      {symbol}{formatCurrency(displayAmount)}
    </span>
  );
};
