import { Injectable } from '@nestjs/common';
import { InvoiceTemplate } from '@/types';
import { InvoiceTemplateRepository } from '@/infrastructure/repositories/invoice-template.repository';
import { PaginationResponse } from '@/libs/response/pagination';
import { ListInvoiceTemplateDto } from '@/api/invoice-template/dto/list-invoice-template.dto';

@Injectable()
export class InvoiceTemplateService {
  constructor(
    private readonly invoiceTemplateRepository: InvoiceTemplateRepository,
  ) {}

  async createTemplate(data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    return this.invoiceTemplateRepository.create(data);
  }

  async getTemplate(id: number): Promise<InvoiceTemplate | null> {
    return this.invoiceTemplateRepository.findById(id);
  }

  async listTemplates(params: ListInvoiceTemplateDto): Promise<PaginationResponse<InvoiceTemplate>> {
    // Đảm bảo params có đủ thông tin cần thiết
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      filters: params.filters || {}
    };
    
    return this.invoiceTemplateRepository.findAll(queryParams);
  }

  async updateTemplate(id: number, data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate | null> {
    return this.invoiceTemplateRepository.update(id, data);
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.invoiceTemplateRepository.delete(id);
  }
}
