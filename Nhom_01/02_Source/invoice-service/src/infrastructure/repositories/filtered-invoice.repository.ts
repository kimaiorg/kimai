import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { FilterInvoiceDto } from '@/api/invoice/dto';
import * as crypto from 'crypto';

type PrismaServiceWithFilteredInvoice = PrismaService & {
  filteredInvoice: any;
}

@Injectable()
export class FilteredInvoiceRepository {
  constructor(private readonly prisma: PrismaServiceWithFilteredInvoice) {
  }

  /**
   * Generate a unique hash for a filter to prevent duplicate filter results
   */
  private generateFilterHash(filter: FilterInvoiceDto): string {
    const filterString = JSON.stringify({
      customer_id: filter.customer_id,
      project_id: filter.project_id,
      from: filter.from,
      to: filter.to,
      activities: filter.activities?.sort() || [],
    });
    
    return crypto.createHash('md5').update(filterString).digest('hex');
  }

  /**
   * Save filtered invoice results
   */
  async saveFilteredInvoice(
    filterDto: FilterInvoiceDto, 
    responseData: any, 
    totalPrice: number,
    taxRate: number,
    taxPrice: number,
    finalPrice: number
  ): Promise<any> {
    // Generate a unique hash for this filter
    const filterHash = this.generateFilterHash(filterDto);
    
    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Check if a filtered invoice with this hash already exists
    const existingFilter = await this.prisma.filteredInvoice.findUnique({
      where: { filterHash },
    });
    
    if (existingFilter) {
      // Update the existing filter
      return this.prisma.filteredInvoice.update({
        where: { id: existingFilter.id },
        data: {
          customerId: filterDto.customer_id,
          projectId: filterDto.project_id || null,
          fromDate: new Date(filterDto.from),
          toDate: new Date(filterDto.to),
          activities: filterDto.activities || [],
          totalPrice: totalPrice,
          taxRate: taxRate,
          taxPrice: taxPrice,
          finalPrice: finalPrice,
          currency: "USD",
          filterData: filterDto as any,
          responseData: responseData as any,
          expiresAt,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create a new filtered invoice
      return this.prisma.filteredInvoice.create({
        data: {
          filterHash,
          customerId: filterDto.customer_id,
          projectId: filterDto.project_id || null,
          fromDate: new Date(filterDto.from),
          toDate: new Date(filterDto.to),
          activities: filterDto.activities || [],
          totalPrice: totalPrice,
          taxRate: taxRate,
          taxPrice: taxPrice,
          finalPrice: finalPrice,
          currency: "USD",
          isSaved: false,
          filterData: filterDto as any,
          responseData: responseData as any,
          expiresAt,
        },
      });
    }
  }

  /**
   * Find a filtered invoice by ID
   */
  async findById(id: number): Promise<any> {
    return this.prisma.filteredInvoice.findUnique({
      where: { id },
    });
  }

  /**
   * Find filtered invoices by customer ID
   */
  async findByCustomerId(customerId: number): Promise<any[]> {
    return this.prisma.filteredInvoice.findMany({
      where: { 
        customerId,
        isSaved: false,
        expiresAt: { gt: new Date() } // Only return non-expired records
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Mark a filtered invoice as saved
   */
  async markAsSaved(id: number): Promise<any> {
    return this.prisma.filteredInvoice.update({
      where: { id },
      data: { isSaved: true },
    });
  }

  /**
   * Delete expired filtered invoices
   */
  async deleteExpired(): Promise<number> {
    const result = await this.prisma.filteredInvoice.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        isSaved: false,
      },
    });
    
    return result.count;
  }
}
