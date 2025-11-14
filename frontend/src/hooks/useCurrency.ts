import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useConvertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
  return useQuery({
    queryKey: ['currency-convert', amount, fromCurrency, toCurrency],
    queryFn: async () => {
      if (fromCurrency === toCurrency) {
        return { converted_amount: amount };
      }
      const response = await api.get('/api/v1/currency/convert', {
        params: { amount, from: fromCurrency, to: toCurrency }
      });
      return response.data;
    },
    enabled: !!amount && !!fromCurrency && !!toCurrency,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExchangeRates = (baseCurrency: string = 'NGN') => {
  return useQuery({
    queryKey: ['exchange-rates', baseCurrency],
    queryFn: async () => {
      const response = await api.get('/api/v1/currency/rates', {
        params: { base: baseCurrency }
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
