/**
 * Authentication API hooks.
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/lib/api';
import type { LoginData, RegisterData, TokenResponse, UserResponse } from '@/types';

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
