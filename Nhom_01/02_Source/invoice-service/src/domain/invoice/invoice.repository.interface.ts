import { Invoice } from '@/types';
import { UpdateInvoiceDto } from '@/api/invoice/dto/update-invoice.dto';
import { ListInvoiceDto } from '@/api/invoice/dto/list-invoice.dto';
import { PaginationResponse } from '@/libs/response/pagination';

export interface InvoiceRepositoryInterface {
  create(data: any): Promise<Invoice>;
  findById(id: number): Promise<Invoice | null>;
  findAll(params: ListInvoiceDto): Promise<PaginationResponse<Invoice>>;
  update(id: number, data: UpdateInvoiceDto): Promise<Invoice | null>;
  delete(id: number): Promise<boolean>;
  markAsPaid(id: number, paymentDate: Date): Promise<Invoice | null>;
  findByTimesheetIds(timesheetIds: number[]): Promise<Invoice[]>;
}
