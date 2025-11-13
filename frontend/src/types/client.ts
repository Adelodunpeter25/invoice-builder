export interface Client {
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

export interface ClientCreate {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  tax_id?: string;
}
