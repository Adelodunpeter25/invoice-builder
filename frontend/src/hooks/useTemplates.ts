/**
 * Template management hooks.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import type { Template, TemplateCreate } from '@/types';

export function useTemplates() {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => api.get<Template[]>('/api/v1/templates', token || undefined),
    enabled: !!token,
  });
}

export function useTemplate(id: number) {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => api.get<Template>(`/api/v1/templates/${id}`, token || undefined),
    enabled: !!token && !!id,
  });
}

export function useDefaultTemplate() {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['template', 'default'],
    queryFn: () => api.get<Template | null>('/api/v1/templates/default', token || undefined),
    enabled: !!token,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (data: TemplateCreate) =>
      api.post<Template>('/api/v1/templates', data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUpdateTemplate(id: number) {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (data: Partial<TemplateCreate>) =>
      api.put<Template>(`/api/v1/templates/${id}`, data, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['template', id] });
      queryClient.invalidateQueries({ queryKey: ['template', 'default'] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  const token = api.getToken();
  
  return useMutation({
    mutationFn: (id: number) =>
      api.del(`/api/v1/templates/${id}`, token || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}
