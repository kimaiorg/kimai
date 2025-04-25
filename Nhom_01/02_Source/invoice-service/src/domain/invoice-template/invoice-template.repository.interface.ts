import { InvoiceTemplate } from '@/types';
import { PaginationResponse } from '@/libs/response/pagination';

export interface InvoiceTemplateRepositoryInterface {
  create(data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate>;
  findById(id: number): Promise<InvoiceTemplate | null>;
  findAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
      name?: string;
      isActive?: boolean;
    };
  }): Promise<PaginationResponse<InvoiceTemplate>>;
  update(id: number, data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate | null>;
  delete(id: number): Promise<boolean>;
}
