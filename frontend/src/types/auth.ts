export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  company_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  company_name: string | null;
  company_address: string | null;
  company_city: string | null;
  company_country: string | null;
  company_phone: string | null;
  preferred_currency: string;
  is_active: boolean;
  created_at: string;
}
