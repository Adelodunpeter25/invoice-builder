import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '@/lib/api';
import type { UserResponse } from '@/types';

interface User {
  id: number;
  email: string;
  username: string;
  company_name: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, companyName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token and fetch user on mount
    const token = api.getToken();
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = api.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await api.get<UserResponse>('/api/v1/auth/me', token);
      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        company_name: userData.company_name,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      api.removeToken();
      api.removeRefreshToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<{ access_token: string; refresh_token: string }>(
      '/api/v1/auth/login',
      { email, password }
    );

    api.setToken(response.access_token);
    api.setRefreshToken(response.refresh_token);

    await fetchCurrentUser();
  };

  const signup = async (username: string, email: string, password: string, companyName?: string) => {
    await api.post<UserResponse>('/api/v1/auth/register', {
      username,
      email,
      password,
      company_name: companyName,
    });

    // After signup, login automatically
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    api.removeToken();
    api.removeRefreshToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
