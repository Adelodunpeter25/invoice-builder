/**
 * Client management hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';

interface Client {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  tax_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientCreate {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export function useClients(page = 1, pageSize = 10) {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['clients', page, pageSize],
    queryFn: () =>
      api.get<PaginatedResponse<Client>>(
        `/api/v1/clients?page=${page}&page_size=${pageSize}`,
        token || undefined
      ),
    enabled: !!token,
  });
}

export function useClient(id: number) {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => api.get<Client>(`/api/v1/clients/${id}`, token || undefined),
    enabled: !!token && !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (data: ClientCreate) =>
      api.post<Client>('/api/v1/clients', data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient(id: number) {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (data: Partial<ClientCreate>) =>
      api.put<Client>(`/api/v1/clients/${id}`, data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (id: number) =>
      api.del(`/api/v1/clients/${id}`, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
