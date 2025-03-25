export interface Customer {
  id: string;
  name: string;
  color: string;
  description?: string;
  address?: string;
  company_name?: string;
  account_number?: string;
  vat_id?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  email?: string;
  phone?: string;
  homepage?: string;
  visible?: boolean;
  createdAt?: Date;
}
