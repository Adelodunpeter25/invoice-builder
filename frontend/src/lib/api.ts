/**
 * API client for making requests to the backend.
 */

const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Make an API request.
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

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

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: response.statusText,
    }));
    throw new Error(error.detail || 'An error occurred');
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
