/**
 * Invoice management hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

interface Invoice {
  id: number;
  user_id: number;
  client_id: number;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  currency: 'USD' | 'EUR' | 'GBP' | 'NGN';
  amount: number;
  issue_date: string;
  due_date: string;
  payment_terms: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  line_items?: LineItem[];
}

interface InvoiceCreate {
  client_id: number;
  issue_date: string;
  due_date: string;
  currency?: 'USD' | 'EUR' | 'GBP' | 'NGN';
  payment_terms?: string;
  notes?: string;
  line_items: LineItem[];
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface InvoiceFilters {
  page?: number;
  page_size?: number;
  status?: string;
  client_id?: number;
  start_date?: string;
  end_date?: string;
}

export function useInvoices(filters: InvoiceFilters = {}) {
  const token = api.getToken();
  const { page = 1, page_size = 10, status, client_id, start_date, end_date } = filters;
  
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: page_size.toString(),
  });
  
  if (status) params.append('status', status);
  if (client_id) params.append('client_id', client_id.toString());
  if (start_date) params.append('start_date', start_date);
  if (end_date) params.append('end_date', end_date);
  
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () =>
      api.get<PaginatedResponse<Invoice>>(
        `/api/v1/invoices?${params.toString()}`,
        token || undefined
      ),
    enabled: !!token,
  });
}

export function useInvoice(id: number) {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => api.get<Invoice>(`/api/v1/invoices/${id}`, token || undefined),
    enabled: !!token && !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (data: InvoiceCreate) =>
      api.post<Invoice>('/api/v1/invoices', data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice(id: number) {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (data: Partial<InvoiceCreate>) =>
      api.put<Invoice>(`/api/v1/invoices/${id}`, data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
  });
}

export function useUpdateInvoiceStatus(id: number) {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (status: string) =>
      api.patch<Invoice>(`/api/v1/invoices/${id}/status?status=${status}`, undefined, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (id: number) =>
      api.del(`/api/v1/invoices/${id}`, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useSendInvoice(id: number) {
  const token = api.getToken();
  
  return useMutation({
    mutationFn: () =>
      api.post<{ success: boolean; message: string }>(
        `/api/v1/invoices/${id}/send`,
        undefined,
        token || undefined
      ),
  });
}

export function useCloneInvoice(id: number) {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: () =>
      api.post<Invoice>(`/api/v1/invoices/${id}/clone`, undefined, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
