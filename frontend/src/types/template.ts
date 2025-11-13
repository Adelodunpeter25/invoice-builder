export interface Template {
  id: number;
  user_id: number;
  name: string;
  layout: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  default_terms: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateCreate {
  name: string;
  layout?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  default_terms?: string;
  is_default?: boolean;
}
