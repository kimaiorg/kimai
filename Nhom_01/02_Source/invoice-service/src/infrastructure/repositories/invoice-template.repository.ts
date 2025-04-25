import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InvoiceTemplate } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';
import { InvoiceTemplateRepositoryInterface } from '@/domain/invoice-template/invoice-template.repository.interface';
import { PaginationResponse } from '@/libs/response/pagination';

@Injectable()
export class InvoiceTemplateRepository implements InvoiceTemplateRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    const result = await this.prisma.invoiceTemplate.create({
      data: {
        name: data.name!,
        title: data.title!,
        company: data.company,
        address: data.address,
        vatId: data.vatId,
        vatRate: data.vatRate as any,
        currency: data.currency,
        dueDays: data.dueDays,
        paymentTerms: data.paymentTerms,
        paymentDetails: data.paymentDetails,
        template: data.template,
        numberFormat: data.numberFormat,
        isActive: data.isActive,
      },
    });
    
    return result as unknown as InvoiceTemplate;
  }

  async findById(id: number): Promise<InvoiceTemplate | null> {
    const result = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
    });
    
    return result as unknown as InvoiceTemplate | null;
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
      name?: string;
      isActive?: boolean;
    };
  }): Promise<PaginationResponse<InvoiceTemplate>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = params;
    
    // Build where conditions based on filters
    const where: any = {};
    
    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' };
    }
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    // Count total items
    const totalItems = await this.prisma.invoiceTemplate.count({ where });
    
    // Get paginated data
    const items = await this.prisma.invoiceTemplate.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      items: items as unknown as InvoiceTemplate[],
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async update(id: number, data: Partial<InvoiceTemplate>): Promise<InvoiceTemplate | null> {
    const template = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
    });
    
    if (!template) {
      return null;
    }
    
    const result = await this.prisma.invoiceTemplate.update({
      where: { id },
      data: {
        name: data.name,
        title: data.title,
        company: data.company,
        address: data.address,
        vatId: data.vatId,
        vatRate: data.vatRate,
        currency: data.currency,
        dueDays: data.dueDays,
        paymentTerms: data.paymentTerms,
        paymentDetails: data.paymentDetails,
        template: data.template,
        numberFormat: data.numberFormat,
        isActive: data.isActive,
      },
    });
    
    return result as unknown as InvoiceTemplate;
  }

  async delete(id: number): Promise<boolean> {
    const template = await this.prisma.invoiceTemplate.findUnique({
      where: { id },
    });
    
    if (!template) {
      return false;
    }
    
    await this.prisma.invoiceTemplate.delete({
      where: { id },
    });
    
    return true;
  }
}
