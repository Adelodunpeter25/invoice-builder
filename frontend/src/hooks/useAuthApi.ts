/**
 * Authentication API hooks.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  company_name?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  company_name: string | null;
  is_active: boolean;
  created_at: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<TokenResponse>('/api/v1/auth/login', data);
      api.setToken(response.access_token);
      api.setRefreshToken(response.refresh_token);
      return response;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      return api.post<UserResponse>('/api/v1/auth/register', data);
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = api.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await api.post<TokenResponse>('/api/v1/auth/refresh', {
        refresh_token: refreshToken,
      });
      api.setToken(response.access_token);
      api.setRefreshToken(response.refresh_token);
      return response;
    },
  });
}

export function useCurrentUser() {
  const token = api.getToken();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.get<UserResponse>('/api/v1/auth/me', token || undefined),
    enabled: !!token,
  });
}

export function useLogout() {
  return () => {
    api.removeToken();
    api.removeRefreshToken();
  };
}
