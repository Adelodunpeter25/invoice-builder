export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN';

export interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
}

export interface ClientBasic {
  id: number;
  name: string;
  email: string;
}

export interface Invoice {
  id: number;
  user_id: number;
  client_id: number;
  client: ClientBasic;
  invoice_number: string;
  status: InvoiceStatus;
  currency: Currency;
  amount: number;
  issue_date: string;
  due_date: string;
  payment_terms: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  line_items?: LineItem[];
}

export interface InvoiceCreate {
  client_id: number;
  issue_date: string;
  due_date: string;
  currency?: Currency;
  payment_terms?: string;
  notes?: string;
  line_items: LineItem[];
}

export interface InvoiceFilters {
  page?: number;
  page_size?: number;
  status?: string;
  client_id?: number;
  start_date?: string;
  end_date?: string;
}
