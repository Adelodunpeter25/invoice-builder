import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import { getToken } from '@/lib/auth';

export const useConvertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
  return useQuery({
    queryKey: ['currency-convert', amount, fromCurrency, toCurrency],
    queryFn: async () => {
      if (fromCurrency === toCurrency) {
        return { converted_amount: amount };
      }
      const token = getToken();
      return get<{ converted_amount: number }>(
        `/api/v1/currency/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
        token
      );
    },
    enabled: !!amount && !!fromCurrency && !!toCurrency,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExchangeRates = (baseCurrency: string = 'NGN') => {
  return useQuery({
    queryKey: ['exchange-rates', baseCurrency],
    queryFn: async () => {
      const token = getToken();
      return get<any>(`/api/v1/currency/rates?base=${baseCurrency}`, token);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
