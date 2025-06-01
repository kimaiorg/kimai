import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Invoice } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';
import { InvoiceRepositoryInterface } from '@/domain/invoice/invoice.repository.interface';
import { UpdateInvoiceDto } from '@/api/invoice/dto/update-invoice.dto';
import { ListInvoiceDto } from '@/api/invoice/dto/list-invoice.dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Injectable()
export class InvoiceRepository implements InvoiceRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<Invoice> {
    // Check if we have metadata to store
    let comment = data.comment || '';
    
    // If we have metadata, append it to the comment field in a way that we can extract it later
    if (data.metadata) {
      console.log('[INVOICE_REPOSITORY] Adding metadata to comment field');
      // Add a special marker to identify this as containing metadata
      comment = `${comment}\n<!--METADATA:${data.metadata}-->`;
    }
    
    // Create the invoice with all fields
    const result = await this.prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber!,
        customerId: data.customerId,
        userId: data.userId,
        total: data.total,
        tax: data.tax,
        subtotal: data.subtotal,
        currency: data.currency || 'USD',
        vat: data.vat || 0,
        status: 'NEW',
        comment: comment, // Use the comment with metadata if available
        dueDays: data.dueDays || 14,
        dueDate: data.dueDate!,
        timesheetIds: data.timesheetIds || [],
        paymentDate: null,
        items: data.items
          ? {
              create: data.items.map((item) => ({
                description: item.description,
                amount: item.amount,
                rate: item.rate,
                total: item.total,
                timesheetId: item.timesheetId,
                projectId: item.projectId,
                activityId: item.activityId,
                begin: item.begin,
                end: item.end,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });

    return result as unknown as Invoice;
  }

  async findById(id: number): Promise<Invoice | null> {
    const result = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    return result as unknown as Invoice | null;
  }

  async findAll(params: ListInvoiceDto): Promise<PaginationResponse<Invoice>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      filters = {},
    } = params;

    // Build where conditions based on filters
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.createdAt) {
      where.createdAt = filters.createdAt;
    }

    if (filters.keyword) {
      where.OR = [
        { invoiceNumber: { contains: filters.keyword, mode: 'insensitive' } },
        { comment: { contains: filters.keyword, mode: 'insensitive' } },
      ];
    }

    // Count total items
    const totalItems = await this.prisma.invoice.count({ where });

    // Get paginated data
    const items = await this.prisma.invoice.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
      include: {
        items: true,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: items as unknown as Invoice[],
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async update(id: number, data: UpdateInvoiceDto): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return null;
    }

    const result = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: data.status || undefined,
        comment: data.comment,
        paymentDate: data.status === 'PAID' ? new Date() : undefined,
      },
      include: {
        items: true,
      },
    });

    return result as unknown as Invoice;
  }

  async delete(id: number): Promise<boolean> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return false;
    }

    await this.prisma.invoice.delete({
      where: { id },
    });

    return true;
  }

  async markAsPaid(id: number, paymentDate: Date): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return null;
    }

    const result = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentDate,
      },
      include: {
        items: true,
      },
    });

    return result as unknown as Invoice;
  }

  async findByTimesheetIds(timesheetIds: number[]): Promise<Invoice[]> {
    const results = await this.prisma.invoice.findMany({
      where: {
        timesheetIds: {
          hasSome: timesheetIds,
        },
      },
      include: {
        items: true,
      },
    });

    return results as unknown as Invoice[];
  }
}
