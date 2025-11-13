/**
 * API client for making requests to the backend.
 */

const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  token?: string;
  skipRefresh?: boolean;
}

/**
 * Make an API request.
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipRefresh, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (response.status === 401 && !skipRefresh && endpoint !== '/api/v1/auth/refresh') {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await post<{ access_token: string; refresh_token: string }>(
          '/api/v1/auth/refresh',
          { refresh_token: refreshToken },
          undefined
        );
        setToken(refreshResponse.access_token);
        setRefreshToken(refreshResponse.refresh_token);
        
        return request<T>(endpoint, { ...options, token: refreshResponse.access_token, skipRefresh: true });
      } catch {
        removeToken();
        removeRefreshToken();
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    throw new Error(error.detail || 'An error occurred');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * GET request.
 */
export async function get<T>(endpoint: string, token?: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET', token });
}

/**
 * POST request.
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  token?: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * PUT request.
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  token?: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * PATCH request.
 */
export async function patch<T>(
  endpoint: string,
  data?: unknown,
  token?: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
}

/**
 * DELETE request.
 */
export async function del<T>(endpoint: string, token?: string): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE', token });
}

/**
 * Get stored auth token.
 */
export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

/**
 * Store auth token.
 */
export function setToken(token: string): void {
  localStorage.setItem('access_token', token);
}

/**
 * Remove auth token.
 */
export function removeToken(): void {
  localStorage.removeItem('access_token');
}

/**
 * Get stored refresh token.
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

/**
 * Store refresh token.
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem('refresh_token', token);
}

/**
 * Remove refresh token.
 */
export function removeRefreshToken(): void {
  localStorage.removeItem('refresh_token');
}
