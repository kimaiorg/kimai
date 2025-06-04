import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InvoiceRepository } from '@/infrastructure/repositories/invoice.repository';
import { FilteredInvoiceRepository } from '@/infrastructure/repositories/filtered-invoice.repository';
import { CreateInvoiceDto } from '@/api/invoice/dto/create-invoice.dto';
import { UpdateInvoiceDto } from '@/api/invoice/dto/update-invoice.dto';
import { ListInvoiceDto } from '@/api/invoice/dto/list-invoice.dto';
import { FilterInvoiceDto, CreateInvoiceFromFilterDto } from '@/api/invoice/dto';
import { PaginationResponse } from '@/libs/response/pagination';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UpdateInvoiceStatusDto } from '@/api/invoice/dto/update-invoice-status.dto';
import { transformCreateInvoiceFromFilterDto } from '@/api/invoice/dto/create-invoice-from-filter.dto';
import { Invoice } from '@prisma/client';
import { ActivityType } from '@/type_schema/activity';
import { CustomerType } from '@/type_schema/customer';
import { ProjectType } from '@/type_schema/project';
import { TaskType } from '@/type_schema/task';
import { InvoiceHistoryType, InvoiceHistoryItemType, InvoiceTemplateType } from '@/type_schema/invoice';
import { EmailService } from '@/infrastructure/services/email.service';

// Define a type for customer information
interface CustomerInfo {
  id: number;
  name: string;
  company?: string;
  address?: string;
  comment?: string;
  vatId?: string;
  number?: string;
  country?: string;
  currency?: string;
  phone?: string;
  fax?: string;
  mobile?: string;
  email?: string;
  homepage?: string;
  timezone?: string;
  color?: string;
  [key: string]: any; // Allow for additional properties
}

@Injectable()
export class InvoiceService {
  private readonly timesheetServiceUrl: string;
  private readonly projectServiceUrl: string;
  private readonly logger = new Logger(InvoiceService.name);
  private readonly invoiceNumberFormat: string;
  private customerCache: Map<number, { data: CustomerInfo; timestamp: number }> = new Map();

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly filteredInvoiceRepository: FilteredInvoiceRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {

    const env = this.configService.get<string>('NODE_ENV') || 'development';
    console.log(`[INVOICE_SERVICE] Current environment: ${env}`);
  
    // Define default URLs for different environments
    const defaultUrls = {
      production: {
        timesheet: 'https://timesheet-service.onrender.com',
        project: 'https://project-service-6067.onrender.com'
      },
      development: {
        // Update default development URLs to match your local setup
        timesheet: 'http://localhost:3334',
        project: 'http://localhost:3333'
      }
    };
    
    console.log(`[INVOICE_SERVICE] Default URLs for ${env}:`, JSON.stringify(defaultUrls[env]));
    
    // First check for generic service URLs that override environment-specific ones
    const timesheetUrl = this.configService.get<string>('TIMESHEET_SERVICE_URL');
    const projectUrl = this.configService.get<string>('PROJECT_SERVICE_URL');
    
    console.log(`[INVOICE_SERVICE] Environment variables:`);
    console.log(`  - TIMESHEET_SERVICE_URL: ${timesheetUrl || 'not set'}`);
    console.log(`  - PROJECT_SERVICE_URL: ${projectUrl || 'not set'}`);
    console.log(`  - TIMESHEET_SERVICE_URL_${env.toUpperCase()}: ${this.configService.get<string>(`TIMESHEET_SERVICE_URL_${env.toUpperCase()}`) || 'not set'}`);
    console.log(`  - PROJECT_SERVICE_URL_${env.toUpperCase()}: ${this.configService.get<string>(`PROJECT_SERVICE_URL_${env.toUpperCase()}`) || 'not set'}`);
    
    if (timesheetUrl) {
      this.timesheetServiceUrl = timesheetUrl;
      console.log(`[INVOICE_SERVICE] Using TIMESHEET_SERVICE_URL override: ${this.timesheetServiceUrl}`);
    } else if (env === 'production') {
      const timesheetUrlProd = this.configService.get<string>('TIMESHEET_SERVICE_URL_PROD');
      this.timesheetServiceUrl = timesheetUrlProd || defaultUrls.production.timesheet;
      console.log(`[INVOICE_SERVICE] Using production timesheet URL: ${this.timesheetServiceUrl}`);
    } else {
      const timesheetUrlDev = this.configService.get<string>('TIMESHEET_SERVICE_URL_DEV');
      this.timesheetServiceUrl = timesheetUrlDev || defaultUrls.development.timesheet;
      console.log(`[INVOICE_SERVICE] Using development timesheet URL: ${this.timesheetServiceUrl}`);
    }
    
    if (projectUrl) {
      this.projectServiceUrl = projectUrl;
      console.log(`[INVOICE_SERVICE] Using PROJECT_SERVICE_URL override: ${this.projectServiceUrl}`);
    } else if (env === 'production') {
      const projectUrlProd = this.configService.get<string>('PROJECT_SERVICE_URL_PROD');
      this.projectServiceUrl = projectUrlProd || defaultUrls.production.project;
      console.log(`[INVOICE_SERVICE] Using production project URL: ${this.projectServiceUrl}`);
    } else {
      const projectUrlDev = this.configService.get<string>('PROJECT_SERVICE_URL_DEV');
      this.projectServiceUrl = projectUrlDev || defaultUrls.development.project;
      console.log(`[INVOICE_SERVICE] Using development project URL: ${this.projectServiceUrl}`);
    }
    
    // Verify URLs are set
    if (!this.timesheetServiceUrl) {
      console.error(`[INVOICE_SERVICE] WARNING: Timesheet service URL is not set!`);
    }
    
    if (!this.projectServiceUrl) {
      console.error(`[INVOICE_SERVICE] WARNING: Project service URL is not set!`);
    }
    
    // Service URLs are already set above
    
    console.log(`[${env}] Using Timesheet Service URL: ${this.timesheetServiceUrl}`);
    console.log(`[${env}] Using Project Service URL: ${this.projectServiceUrl}`);
  }

  async createInvoice(dto: CreateInvoiceDto): Promise<any> {
    try {
    
      if (dto.timesheetIds && dto.timesheetIds.length > 0) {
        await this.markTimesheetsAsExported(dto.timesheetIds);
      }
      
      // Generate invoice number
      dto.invoiceNumber = await this.generateInvoiceNumber(dto.customerId);
      
      // Calculate due date
      dto.dueDate = this.calculateDueDate(new Date(), dto.dueDays || 14);
      
      // Gọi repository với DTO
      return this.invoiceRepository.create(dto);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  }

  /**
   * Extract metadata from comment field if it exists
   */
  private extractMetadataFromComment(comment: string): any {
    if (!comment) return null;
    
    // Look for the metadata marker
    const metadataMatch = comment.match(/<!--METADATA:(.+?)-->/s);
    if (metadataMatch && metadataMatch[1]) {
      try {
        // Parse the JSON string back to an object
        return JSON.parse(metadataMatch[1]);
      } catch (error) {
        console.error('[INVOICE_SERVICE] Error parsing metadata from comment:', error);
        return null;
      }
    }
    return null;
  }
  
  /**
   * Extract user comment without metadata
   */
  private extractUserComment(comment: string): string {
    if (!comment) return '';
    
    // Remove the metadata part if it exists
    return comment.replace(/\n?<!--METADATA:.+?-->/s, '');
  }

  async getInvoices(params: ListInvoiceDto): Promise<any> {
    try {
      console.log('[INVOICE_SERVICE] Getting invoices with params:', JSON.stringify(params, null, 2));
      
      // Get invoices from repository
      const result = await this.invoiceRepository.findAll(params);
      console.log(`[INVOICE_SERVICE] Found ${result.items.length} invoices`);
      
      // Transform data to match frontend structure
      const invoices = await Promise.all(result.items.map(async (invoice: any) => {
        console.log(`[INVOICE_SERVICE] Processing invoice ${invoice.id} with filteredInvoiceId: ${invoice.filteredInvoiceId || 'none'}`);
        console.log(`[INVOICE_SERVICE] Invoice comment: ${invoice.comment ? 'Present' : 'None'}`);
        
        // Try to extract metadata from comment field first
        const metadata = this.extractMetadataFromComment(invoice.comment);
        console.log(`[INVOICE_SERVICE] Metadata extraction result: ${metadata ? 'Found' : 'Not found'}`);
        
        let customerInfo: CustomerInfo | null = null;
        let customerSource = 'unknown';
        
        // Try multiple sources for customer data in order of preference
        // 1. Metadata in comment
        if (metadata && metadata.customerData) {
          console.log(`[INVOICE_SERVICE] Using customer data from invoice metadata for invoice ${invoice.id}`);
          customerInfo = metadata.customerData;
          customerSource = 'metadata';
          console.log(`[INVOICE_SERVICE] Customer from metadata: ${customerInfo?.name || 'Unknown name'}`);
        }
        // 2. Filtered invoice
        else if (invoice.filteredInvoiceId) {
          try {
            console.log(`[INVOICE_SERVICE] Fetching filtered invoice ${invoice.filteredInvoiceId}`);
            const filteredInvoice = await this.filteredInvoiceRepository.findById(invoice.filteredInvoiceId);
            console.log(`[INVOICE_SERVICE] Filtered invoice found: ${filteredInvoice ? 'Yes' : 'No'}`);
            
            if (filteredInvoice) {
              console.log(`[INVOICE_SERVICE] Filtered invoice response data: ${filteredInvoice.responseData ? 'Present' : 'Missing'}`);
              console.log(`[INVOICE_SERVICE] Full filtered invoice data:`, JSON.stringify(filteredInvoice, null, 2));
              
              // Improved extraction of customer data from filtered invoice
              if (filteredInvoice.responseData) {
                // Try to extract customer from different possible locations in the response
                let customerFromResponse: any = null;
                
                console.log(`[INVOICE_SERVICE] Examining filtered invoice response data structure:`, JSON.stringify(filteredInvoice.responseData, null, 2));
                
                if (filteredInvoice.responseData.customer) {
                  customerFromResponse = filteredInvoice.responseData.customer;
                  console.log(`[INVOICE_SERVICE] Found customer directly in responseData.customer`);
                } else if (filteredInvoice.responseData.data && filteredInvoice.responseData.data.customer) {
                  customerFromResponse = filteredInvoice.responseData.data.customer;
                  console.log(`[INVOICE_SERVICE] Found customer in responseData.data.customer`);
                } else if (Array.isArray(filteredInvoice.responseData.activities)) {
                  // Try to extract from first activity if available
                  const firstActivity = filteredInvoice.responseData.activities[0];
                  if (firstActivity && firstActivity.customer) {
                    customerFromResponse = firstActivity.customer;
                    console.log(`[INVOICE_SERVICE] Found customer in first activity`);
                  }
                }
                
                if (customerFromResponse) {
                  console.log(`[INVOICE_SERVICE] Customer found in filtered invoice:`, typeof customerFromResponse, 
                    customerFromResponse.id ? `ID: ${customerFromResponse.id}` : 'No ID', 
                    customerFromResponse.name ? `Name: ${customerFromResponse.name}` : 'No name');
                  
                  // Ensure customerFromResponse has the required fields for CustomerInfo
                  const validCustomerInfo: CustomerInfo = {
                    id: customerFromResponse.id || invoice.customerId,
                    name: customerFromResponse.name || `Customer ${invoice.customerId}`,
                    company: customerFromResponse.company || '',
                    address: customerFromResponse.address || '',
                    comment: customerFromResponse.comment || '',
                    vatId: customerFromResponse.vatId || '',
                    number: customerFromResponse.number || '',
                    country: customerFromResponse.country || '',
                    currency: customerFromResponse.currency || 'USD',
                    phone: customerFromResponse.phone || '',
                    fax: customerFromResponse.fax || '',
                    mobile: customerFromResponse.mobile || '',
                    email: customerFromResponse.email || '',
                    homepage: customerFromResponse.homepage || '',
                    timezone: customerFromResponse.timezone || 'UTC',
                    color: customerFromResponse.color || '#000000',
                  };
                  
                  customerInfo = validCustomerInfo;
                  customerSource = 'filtered_invoice';
                  
                  // Store this in the cache for future use
                  await this.storeCustomerData(invoice.customerId, customerInfo);
                  console.log(`[INVOICE_SERVICE] Stored customer data in cache for ID ${invoice.customerId}`);
                } else {
                  console.log(`[INVOICE_SERVICE] No customer data found in any expected location in filtered invoice response`);
                }
              } else {
                console.log(`[INVOICE_SERVICE] No response data in filtered invoice`);
              }
            }
            
            // If we still don't have customer info, try cache
            if (!customerInfo) {
              const cachedCustomer = this.customerCache.get(invoice.customerId);
              if (cachedCustomer) {
                console.log(`[INVOICE_SERVICE] Using cached customer data for ID ${invoice.customerId}`);
                customerInfo = cachedCustomer.data;
                customerSource = 'cache';
              }
            }
          } catch (error) {
            console.error(`[INVOICE_SERVICE] Error getting filtered invoice ${invoice.filteredInvoiceId}:`, error);
          }
        }
        
        // 3. Cache
        if (!customerInfo) {
          const cachedCustomer = this.customerCache.get(invoice.customerId);
          if (cachedCustomer) {
            console.log(`[INVOICE_SERVICE] Using cached customer data for ID ${invoice.customerId}`);
            customerInfo = cachedCustomer.data;
            customerSource = 'cache';
          }
        }
        
        // 4. API call as last resort
        if (!customerInfo) {
          console.log(`[INVOICE_SERVICE] Fetching customer from API for ID ${invoice.customerId}`);
          try {
            customerInfo = await this.getCustomerInfo(invoice.customerId);
            customerSource = 'api';
          } catch (error) {
            console.error(`[INVOICE_SERVICE] Error fetching customer from API: ${error.message}`);
            // Throw error since we can't proceed without customer data
            throw new Error(`Failed to get customer data for invoice ${invoice.id}: ${error.message}`);
          }
        }
        
        // Log the final customer info source
        console.log(`[INVOICE_SERVICE] Final customer source for invoice ${invoice.id}: ${customerSource}`);
        console.log(`[INVOICE_SERVICE] Using customer: ${customerInfo?.name || 'Unknown'} (ID: ${customerInfo?.id || invoice.customerId})`);
        
        // For existing invoices that don't have proper customer data, let's update them
        if (customerSource === 'default' && invoice.filteredInvoiceId) {
          console.log(`[INVOICE_SERVICE] Scheduling background update of customer data for invoice ${invoice.id}`);
          // We'll do this asynchronously to not block the current request
          setTimeout(async () => {
            try {
              // Try to get better customer data and update the invoice
              const filteredInvoice = await this.filteredInvoiceRepository.findById(invoice.filteredInvoiceId);
              if (filteredInvoice?.responseData?.customer) {
                const betterCustomerInfo = filteredInvoice.responseData.customer;
                // Store in cache for future use
                await this.storeCustomerData(invoice.customerId, betterCustomerInfo);
                console.log(`[INVOICE_SERVICE] Updated cache with better customer data for invoice ${invoice.id}`);
              }
            } catch (error) {
              console.error(`[INVOICE_SERVICE] Error in background customer data update:`, error);
            }
          }, 0);
        }
        
        // Extract user comment without metadata
        const userComment = this.extractUserComment(invoice.comment || '');
        
        // Customer info must be available at this point
        if (!customerInfo) {
          throw new Error(`No customer information available for invoice ${invoice.id}`);
        }
        const safeCustomerInfo = customerInfo;
        
        return {
          id: invoice.id.toString(),
          invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
          customer: {
            id: safeCustomerInfo.id || invoice.customerId,
            name: safeCustomerInfo.name || `Customer ${invoice.customerId}`,
            company: safeCustomerInfo.company || '',
            address: safeCustomerInfo.address || '',
            comment: safeCustomerInfo.comment || '',
            vatId: safeCustomerInfo.vatId || '',
            number: safeCustomerInfo.number || '',
            country: safeCustomerInfo.country || '',
            currency: safeCustomerInfo.currency || 'USD',
            phone: safeCustomerInfo.phone || '',
            fax: safeCustomerInfo.fax || '',
            mobile: safeCustomerInfo.mobile || '',
            email: safeCustomerInfo.email || '',
            homepage: safeCustomerInfo.homepage || '',
            timezone: safeCustomerInfo.timezone || 'UTC',
            color: safeCustomerInfo.color || '#000000'
          },
          date: invoice.createdAt.toISOString(),
          dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
          paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : null,
          status: invoice.status,
          totalAmount: invoice.total.toString(),
          currency: invoice.currency || 'USD',
          comment: userComment, // Use the user comment without metadata
          items: (invoice.items || []).map((item: any) => ({
            id: item.id.toString(),
            description: item.description || '',
            quantity: Number(item.amount || 0),
            unitPrice: Number(item.rate || 0),
            totalPrice: Number(item.total || 0),
            taxRate: Number(item.taxRate || 0)
          }))
        };
      }));
      
      return {
        success: true,
        data: {
          items: invoices,
          total: result.meta?.totalItems || 0,
          page: result.meta?.currentPage || 1,
          limit: result.meta?.itemsPerPage || 10,
          totalPages: result.meta?.totalPages || 1
        }
      };
    } catch (error) {
      console.error('[INVOICE_SERVICE] Error getting invoices:', error);
      return {
        success: false,
        message: 'Failed to get invoices',
        error: error.message
      };
    }
  }

  async getInvoice(id: number, authHeader?: string): Promise<any> {
    try {
      const invoice: any = await this.invoiceRepository.findById(id);
      
      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }
      
      // Get customer info from the API - no fallback to mock data
      let customerInfo;
      try {
        customerInfo = await this.getCustomerInfo(invoice.customerId, authHeader);
      } catch (error) {
        console.error(`Failed to get customer info for invoice ${id}: ${error.message}`);
        return {
          success: false,
          message: `Failed to retrieve customer information: ${error.message}`,
        };
      }
      
      // Default tax rate
      const defaultTaxRate = 10; // 10%
      
      // Map invoice items and calculate subtotals
      const items = (invoice.items || []).map((item: any) => {
        const quantity = Number(item.amount);
        const unitPrice = Number(item.rate);
        const taxRate = item.taxRate || defaultTaxRate;
        
        return {
          description: item.description,
          quantity: quantity,
          unitPrice: unitPrice,
          taxRate: taxRate,
          date: item.begin ? item.begin.toISOString() : new Date().toISOString(),
        };
      });
      
      // Calculate total price from items
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      
      // Use the invoice total if available, otherwise use calculated subtotal
      const totalPrice = invoice.total ? Number(invoice.total) : subtotal;
      
      // Calculate tax amount (assuming all items have the same tax rate)
      const taxRate = defaultTaxRate;
      const taxPrice = totalPrice * (taxRate / 100);
      
      // Calculate final price with tax
      const finalPrice = totalPrice + taxPrice;
      
      return {
        success: true,
        data: {
          id: invoice.id.toString(),
          customer: customerInfo,
          date: invoice.createdAt.toISOString(),
          dueDate: invoice.dueDate.toISOString(),
          status: invoice.status,
          totalPrice: totalPrice.toString(),
          taxRate: taxRate,
          taxPrice: taxPrice,
          finalPrice: finalPrice,
          currency: invoice.currency,
          comment: invoice.comment || '',
          createdBy: invoice.userId.toString(),
          createdAt: invoice.createdAt.toISOString(),
          paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : undefined,
          items: items,
        }
      };
    } catch (error) {
      console.error(`Failed to get invoice ${id}: ${error.message}`);
      return {
        success: false,
        message: 'An error occurred while getting invoice',
        error: error.message,
      };
    }
  }

  async listInvoices(params: ListInvoiceDto): Promise<any> {
    try {
      // Extract standard parameters for repository
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc', 
        filters = {}
      } = params;
      
      // Extract authHeader separately (it may not exist in the type)
      const authHeader = (params as any).authHeader;
      
      // Sử dụng repository để truy vấn dữ liệu
      const paginationResult = await this.invoiceRepository.findAll({
        page,
        limit,
        sortBy,
        sortOrder,
        filters
      });
      
      const invoices = paginationResult.items;
      const total = paginationResult.meta.totalItems;
      
      const processedInvoices = await Promise.all(invoices.map(async (invoice: any) => {
        // Get customer info using our improved method
        let customerInfo;
        try {
          customerInfo = await this.getCustomerInfo(invoice.customerId, authHeader);
        } catch (error) {
          // Log the error but continue processing the invoice
          console.error(`Error fetching customer data for invoice ${invoice.id}: ${error.message}`);
          
          // Use minimal customer info when API call fails
          customerInfo = {
            id: invoice.customerId,
            name: `Customer ${invoice.customerId}`,
            company: '',
            address: '',
            comment: '',
            visible: true
          };
        }
        
        // Trả về dữ liệu đã được xử lý
        return {
          id: invoice.id.toString(),
          invoiceNumber: invoice.invoiceNumber,
          customer: customerInfo,
          date: invoice.createdAt.toISOString(),
          dueDate: invoice.dueDate.toISOString(),
          paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : null,
          status: invoice.status,
          totalAmount: invoice.total.toString(),
          currency: invoice.currency,
          comment: '',
          items: Array.isArray(invoice.items) ? invoice.items.map((item: any) => ({
            id: item.id.toString(),
            description: item.description,
            quantity: typeof item.amount === 'object' && item.amount && typeof item.amount.toNumber === 'function' ? 
              item.amount.toNumber() : Number(item.amount),
            unitPrice: typeof item.rate === 'object' && item.rate && typeof item.rate.toNumber === 'function' ? 
              item.rate.toNumber() : Number(item.rate),
            totalPrice: typeof item.total === 'object' && item.total && typeof item.total.toNumber === 'function' ? 
              item.total.toNumber() : Number(item.total),
            taxRate: 0, // Mặc định nếu không có trong dữ liệu
          })) : [],
        };
      }));
      
      return {
        success: true,
        data: {
          items: processedInvoices,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error listing invoices:', error);
      return {
        success: false,
        message: 'Failed to list invoices',
        error: error.message,
      };
    }
  }

  async updateInvoice(id: number, dto: UpdateInvoiceDto): Promise<any> {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          message: 'Invalid invoice ID',
        };
      }

      // Kiểm tra xem invoice có tồn tại không
      const existingInvoice: any = await this.invoiceRepository.findById(id);
      if (!existingInvoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }
      
      // Prepare update data - only include fields that are provided
      const updateData: any = {};
      
      if (dto.status !== undefined) {
        updateData.status = dto.status;
      }
      
      if (dto.comment !== undefined) {
        updateData.comment = dto.comment;
      }
      
      // If status is PAID and no payment date is provided, set it to current date
      if (dto.status === 'PAID') {
        updateData.paymentDate = dto.paymentDate || new Date();
      } else if (dto.paymentDate) {
        updateData.paymentDate = dto.paymentDate;
      }
      
      console.log(`Updating invoice ${id} with data:`, updateData);
      
      // Cập nhật invoice
      const updatedInvoice: any = await this.invoiceRepository.update(id, updateData);
      
      // Kiểm tra nếu updatedInvoice là null
      if (!updatedInvoice) {
        return {
          success: false,
          message: 'Failed to update invoice',
        };
      }
      
      // No automatic email sending - emails will be sent via dedicated endpoint
      
      return {
        success: true,
        emailSent: dto.status === 'PAID' ? true : false,
      };
    } catch (error) {
      console.error(`Failed to update invoice ${id}: ${error.message}`);
      return {
        success: false,
        message: 'An error occurred while updating invoice',
        error: error.message,
      };
    }
  }

  async deleteInvoice(id: number): Promise<boolean> {
    // Get invoice to find timesheet IDs
    const invoice = await this.invoiceRepository.findById(id);
    if (invoice && invoice.timesheetIds && invoice.timesheetIds.length > 0) {
      // Unmark timesheets as exported
      await this.unmarkTimesheetsAsExported(invoice.timesheetIds);
    }
    
    return this.invoiceRepository.delete(id);
  }

  async markInvoiceAsPaid(id: number): Promise<any> {
    try {
      // Tìm invoice theo id
      const invoice = await this.invoiceRepository.findById(id);
      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }

      // Cập nhật trạng thái invoice thành PAID và thêm ngày thanh toán
      const updatedInvoice = await this.invoiceRepository.update(id, {
        status: 'PAID',
        paymentDate: new Date(),
      });

      if (updatedInvoice === null) {
        return {
          success: false,
          message: 'Failed to mark invoice as paid',
        };
      }

      // Lấy thông tin customer từ API
      const customerInfo = await this.getCustomerInfo(updatedInvoice.customerId);
      
      // No automatic email sending - emails will be sent via dedicated endpoint
      
      // Chuyển đổi dữ liệu để phù hợp với cấu trúc của frontend
      return {
        success: true,
        data: {
          id: updatedInvoice.id.toString(),
          customer: customerInfo,
          date: updatedInvoice.createdAt.toISOString(),
          dueDate: updatedInvoice.dueDate.toISOString(),
          status: updatedInvoice.status,
          totalPrice: updatedInvoice.total.toString(),
          currency: updatedInvoice.currency,
          notes: updatedInvoice.comment || '',
          createdBy: updatedInvoice.userId.toString(),
          createdAt: updatedInvoice.createdAt.toISOString(),
          paymentDate: updatedInvoice.paymentDate ? updatedInvoice.paymentDate.toISOString() : undefined,
          items: (updatedInvoice.items || []).map((item: any) => ({
            description: item.description,
            quantity: Number(item.amount),
            unitPrice: Number(item.rate),
            taxRate: 10, // Mặc định 10%
            date: item.begin.toISOString(),
          })),
        }
      };
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
      return {
        success: false,
        message: 'An error occurred while marking invoice as paid',
      };
    }
  }

  async filterInvoices(dto: FilterInvoiceDto, authHeader?: string): Promise<{ success: boolean; data?: InvoiceHistoryType; filteredInvoiceId?: number; message?: string; error?: any }> {
    try {
      console.log('Filter invoice DTO:', dto);
      
      if (!dto.customer_id) {
        throw new BadRequestException('customer_id is required');
      }
      if (!dto.from || !dto.to) {
        throw new BadRequestException('from and to dates are required');
      }
      
      // Ensure activities is always an array (even if empty)
      if (!dto.activities) {
        dto.activities = [];
      }
      
      // Get customer info
      console.log(`[Customer Service] Fetching customer info for ID: ${dto.customer_id}`);
      const customerInfo = await this.getCustomerInfo(dto.customer_id, authHeader) as CustomerType;
      console.log('[Customer Service] Response:', JSON.stringify(customerInfo, null, 2));
      
      if (!customerInfo) {
        throw new NotFoundException(`Customer with ID ${dto.customer_id} not found`);
      }
      
      // Get project info if project_id is provided
      let projectInfo: any = null;
      if (dto.project_id) {
        console.log(`[Project Service] Fetching project info for ID: ${dto.project_id}`);
        const projectResponse = await this.getProjectInfo(dto.project_id, authHeader);
        console.log('[Project Service] Response:', JSON.stringify(projectResponse, null, 2));
        projectInfo = projectResponse as ProjectType;
      } else {
        console.log('[Project Service] No project_id provided, skipping project info fetch');
      }
      
      const activities: ActivityType[] = [];
      if (dto.activities && dto.activities.length > 0) {
        for (const activityId of dto.activities) {
          try {
            console.log(`[Activity Service] Fetching activity info for ID: ${activityId}`);
            const activityResponse = await firstValueFrom(
              this.httpService.get(`${this.projectServiceUrl}/api/v1/activities/${activityId}`, {
                headers: this.getHeaders(authHeader),
                timeout: 5000
              })
            );
            
            console.log(`[Activity Service] Response for activity ${activityId}:`, JSON.stringify(activityResponse.data, null, 2));
            
            if (activityResponse.data) {
              activities.push(activityResponse.data as ActivityType);
            }
          } catch (error) {
            console.error(`Failed to fetch activity info for ID ${activityId}:`, error.message);
          }
        }
      }
      
      // Fetch tasks by activities
      const tasks = await this.fetchTasksByActivities(dto.activities || [], authHeader) as any[];
      
      // Fetch expenses for tasks
      console.log(`[EXPENSE_API] Fetching expenses for ${tasks.length} tasks`);
      const expenses = await this.fetchExpensesFromTasks(tasks, authHeader) as any[];
      console.log(`[EXPENSE_API] Fetched ${expenses.length} expenses with costs: ${expenses.map(e => `ID:${e.id}=${e.cost}`).join(', ')}`);
      
      const taskToExpenseMap = new Map<number | string, any>();
      expenses.forEach(expense => {
        if (expense.task_id) {
          taskToExpenseMap.set(expense.task_id, expense);
        }
      });
      
      const processedTasks: any[] = [];
      const activityToTasksMap = new Map<number | string, any[]>();
      
      console.log(`[PRICE_DEBUG] Processing ${tasks.length} tasks for pricing`);
      
      tasks.forEach(task => {
        const taskExpense = taskToExpenseMap.get(task.id);
        
        // Use the cost field from the expense API response if available
        // Otherwise fall back to amount or default value
        let expenseAmount = 45; // Default cost from the example
        
        if (taskExpense) {
          console.log(`[PRICE_DEBUG] Found expense for task ${task.id}: cost=${taskExpense.cost}, amount=${taskExpense.amount}`);
          
          if (taskExpense.cost !== undefined && taskExpense.cost !== null) {
            expenseAmount = parseFloat(String(taskExpense.cost)) || 45;
            console.log(`[PRICE_DEBUG] Using cost field for task ${task.id}: ${expenseAmount}`);
          } else if (taskExpense.amount !== undefined && taskExpense.amount !== null) {
            expenseAmount = parseFloat(String(taskExpense.amount)) || 45;
            console.log(`[PRICE_DEBUG] Using amount field for task ${task.id}: ${expenseAmount}`);
          } else {
            console.log(`[PRICE_DEBUG] Neither cost nor amount found for task ${task.id}, using default: ${expenseAmount}`);
          }
        } else {
          console.log(`[PRICE_DEBUG] No expense found for task ${task.id}, using default cost: ${expenseAmount}`);
        }
        
        const processedTask = {
          ...task,
          price: expenseAmount,
          expense_id: task.expense_id || (taskExpense ? taskExpense.id : null)
        };
        
        console.log(`[PRICE_DEBUG] Final price for task ${task.id}: ${processedTask.price}`);
        processedTasks.push(processedTask);
        
        if (task.activity_id) {
          if (!activityToTasksMap.has(task.activity_id)) {
            activityToTasksMap.set(task.activity_id, []);
          }
          const taskList = activityToTasksMap.get(task.activity_id);
          if (taskList) {
            taskList.push(processedTask);
          }
        }
      });
      
      let totalTasksPrice = 0;
      processedTasks.forEach(task => {

        if (task.status === 'COMPLETED' || task.status === 'DONE' || task.status === 'DOING') {
          const taskPrice = task.price || 0;
          const taskQuantity = task.quantity || 1;
          const taskTotalPrice = taskPrice * taskQuantity;
          totalTasksPrice += taskTotalPrice;
          console.log(`Adding task ${task.id} with price ${taskPrice} x quantity ${taskQuantity} = ${taskTotalPrice} to total`);
        }
      });
      
      console.log(`Total tasks price: ${totalTasksPrice}`);
    
      const totalPrice = totalTasksPrice;
      const taxRate = 10; // Assume tax rate is 10%
      const taxPrice = Math.round(totalPrice * taxRate / 100);
      const finalPrice = totalPrice + taxPrice;

      // Create template object to match InvoiceTemplateType
      const template: InvoiceTemplateType = {
        id: 1,
        name: "Default Template",
        format: "A4",
        title: "Invoice",
        companyName: "Kimai Organization",
        vatId: "VAT123456",
        address: "123 Kimai Street, City",
        contact: "contact@kimai.org",
        termsOfPayment: "Payment due within 14 days",
        bankAccount: "BANK123456789",
        paymentTerm: "14 days",
        taxRate: "10%",
        language: "en",
        invoiceNumberGenerator: "standard",
        invoiceTemplate: "default",
        grouping: "activity",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Transform activities to match InvoiceHistoryItemType
      const transformedActivities: InvoiceHistoryItemType[] = activities.map((activity: ActivityType) => {
        const activityTasks = activityToTasksMap.get(activity.id) || [];
        
        const sortedTasks = [...activityTasks].sort((a, b) => {
          const idA = Number(a.id) || 0;
          const idB = Number(b.id) || 0;
          return idB - idA;
        });
        
        const activityTotalPrice = sortedTasks
          .filter(task => task.status === 'COMPLETED' || task.status === 'DONE' || task.status === 'DOING')
          .reduce((total, task) => {
            const taskPrice = task.price || 0;
            const taskQuantity = task.quantity || 1;
            return total + (taskPrice * taskQuantity);
          }, 0);
        
        // Transform tasks to match TaskType
        const transformedTasks: TaskType[] = sortedTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          billable: task.billable,
          quantity: task.quantity,
          price: task.price || 100,
          deadline: task.deadline,
          created_at: task.created_at,
          color: task.color
        }));
        
        // Return activity in the format of InvoiceHistoryItemType
        return {
          id: activity.id,
          name: activity.name,
          description: activity.description,
          color: activity.color,
          created_at: activity.created_at,
          totalPrice: activityTotalPrice,
          tasks: transformedTasks
        };
      });
      
      // Create response in InvoiceHistoryType format
      const invoiceData: InvoiceHistoryType = {
        invoiceId: parseInt(`${Date.now()}`.substring(0, 9)),
        customer: customerInfo,
        project: projectInfo,
        fromDate: dto.from,
        toDate: dto.to,
        status: "NEW",
        totalPrice: totalPrice,
        taxRate: taxRate,
        taxPrice: taxPrice,
        finalPrice: finalPrice,
        currency: "USD",
        notes: "",
        createdBy: "system",
        createdAt: new Date().toISOString(),
        template: template,
        activities: transformedActivities
      };
      
      // Save filtered invoice results to database for later retrieval
      const savedFilteredInvoice = await this.filteredInvoiceRepository.saveFilteredInvoice(
        dto,
        invoiceData,
        totalPrice,
        taxRate,
        taxPrice,
        finalPrice
      );
      
      console.log(`Saved filtered invoice with ID: ${savedFilteredInvoice.id}`);
      
      return {
        success: true,
        data: invoiceData,
        filteredInvoiceId: savedFilteredInvoice.id
      };
    } catch (error) {
      console.error('Error in filterInvoices service:', error);
      return {
        success: false,
        message: error.message || 'Failed to filter invoices',
        error: error
      };
    }
  }

  async updateInvoiceStatus(id: number, dto: UpdateInvoiceStatusDto): Promise<any> {
    try {
      // Kiểm tra xem invoice có tồn tại không
      const existingInvoice = await this.invoiceRepository.findById(id);
      if (!existingInvoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }
      
      // Cập nhật trạng thái invoice
      const updatedInvoice = await this.invoiceRepository.update(id, {
        status: this.validateInvoiceStatus(dto.status),
        paymentDate: dto.status === 'PAID' ? new Date() : undefined,
      });
      
      // Kiểm tra nếu updatedInvoice là null
      if (!updatedInvoice) {
        return {
          success: false,
          message: 'Failed to update invoice status',
        };
      }
      
      // Chuyển đổi dữ liệu để phù hợp với cấu trúc của frontend
      return {
        success: true,
        data: {
          id: updatedInvoice.id.toString(),
          status: updatedInvoice.status,
          paymentDate: updatedInvoice.paymentDate ? updatedInvoice.paymentDate.toISOString() : undefined,
        }
      };
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      return {
        success: false,
        message: 'An error occurred while updating invoice status',
      };
    }
  }

  async createInvoiceFromFilter(dto: CreateInvoiceFromFilterDto): Promise<any> {
    try {
      console.log('[INVOICE_SERVICE] Creating invoice from filter with DTO:', JSON.stringify(dto, null, 2));
      
      // Check if we have a filteredInvoiceId
      if (!dto.filteredInvoiceId) {
        return {
          success: false,
          message: 'Filtered invoice ID is required',
        };
      }
      
      // Get the filtered invoice from the database
      const filteredInvoice = await this.filteredInvoiceRepository.findById(dto.filteredInvoiceId);
      console.log('[INVOICE_SERVICE] Found filtered invoice:', filteredInvoice ? 'yes' : 'no');
      
      if (!filteredInvoice) {
        return {
          success: false,
          message: `Filtered invoice with ID ${dto.filteredInvoiceId} not found`,
        };
      }
      
      // Check if the filtered invoice has already been saved
      if (filteredInvoice.isSaved) {
        return {
          success: false,
          message: 'This filtered invoice has already been saved',
        };
      }
      
      // Extract the response data from the filtered invoice
      const responseData = filteredInvoice.responseData;
      console.log('[INVOICE_SERVICE] Response data from filtered invoice:', 
        responseData ? 'Available' : 'Not available');
      
      if (!responseData) {
        return {
          success: false,
          message: 'Filtered invoice data is missing or invalid',
        };
      }
      
      console.log('[INVOICE_SERVICE] Customer ID:', filteredInvoice.customerId);
      console.log('[INVOICE_SERVICE] Total price:', filteredInvoice.totalPrice);
      console.log('[INVOICE_SERVICE] Tax price:', filteredInvoice.taxPrice);
      console.log('[INVOICE_SERVICE] Final price:', filteredInvoice.finalPrice);
      
      // Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber(filteredInvoice.customerId);
      
      // Calculate due date
      const dueDate = this.calculateDueDate(new Date(), dto.dueDays || 14);
      
      // Create invoice items from the filtered invoice data
      const items: Array<{
        description: string;
        amount: number | string;
        rate: number | string;
        total: number | string;
        projectId: number;
        activityId: number | null;
        begin: Date;
        end: Date;
      }> = [];
      
      // Extract activities and tasks from the response data
      if (responseData.activities && responseData.activities.length > 0) {
        console.log('[INVOICE_SERVICE] Processing activities:', responseData.activities.length);
        for (const activity of responseData.activities) {
          console.log(`[INVOICE_SERVICE] Activity ${activity.id} (${activity.name}) has ${activity.tasks?.length || 0} tasks`);
          if (activity.tasks && activity.tasks.length > 0) {
            for (const task of activity.tasks) {
              if (task.status === 'COMPLETED' || task.status === 'DONE' || task.status === 'DOING') {
                // Log the task details for debugging
                console.log(`[INVOICE_SERVICE] Processing task: ${task.id} - ${task.title}`);
                console.log(`[INVOICE_SERVICE] Task price: ${task.price}, quantity: ${task.quantity}`);
                
                // Use the actual price from the task data
                const taskPrice = task.price || 0;
                const taskQuantity = task.quantity || 1;
                const taskTotal = taskQuantity * taskPrice;
                
                console.log(`[INVOICE_SERVICE] Calculated total: ${taskTotal}`);
                
                items.push({
                  description: task.title || 'No description',
                  amount: taskQuantity,
                  rate: taskPrice,
                  total: taskTotal,
                  projectId: filteredInvoice.projectId || 0,
                  activityId: activity.id,
                  begin: new Date(filteredInvoice.fromDate),
                  end: new Date(filteredInvoice.toDate),
                });
              }
            }
          }
        }
      }
      
      console.log('[INVOICE_SERVICE] Created', items.length, 'invoice items');
      
      // Ensure we have all required data for creating an invoice
      if (!filteredInvoice.customerId) {
        return {
          success: false,
          message: 'Customer ID is missing in the filtered invoice data',
        };
      }
      
      // Extract customer data from the filtered invoice
      const customerData = responseData.customer;
      if (customerData) {
        console.log('[INVOICE_SERVICE] Found customer data in filtered invoice:', customerData.name);
        // Store the customer data in a cache for later retrieval
        await this.storeCustomerData(filteredInvoice.customerId, customerData);
      } else {
        console.log('[INVOICE_SERVICE] No customer data found in filtered invoice');
      }
      
      // Create a metadata object to store additional data that's not in the invoice schema
      const metadata = {
        customerData: customerData || null,
        projectData: responseData.project || null,
        source: 'filtered_invoice'
      };
      
      console.log('[INVOICE_SERVICE] Creating invoice with customer:', 
        customerData ? customerData.name : 'No customer data');
      
      // Create the invoice with data from the filtered invoice
      // The comment will be used to store metadata
      const userComment = dto.comment || '';
      
      const invoiceData = {
        invoiceNumber,
        customerId: filteredInvoice.customerId,
        userId: dto.userId || 1, // Default to user ID 1 if not provided
        total: filteredInvoice.finalPrice,
        tax: filteredInvoice.taxPrice,
        subtotal: filteredInvoice.totalPrice,
        currency: filteredInvoice.currency || 'USD',
        vat: filteredInvoice.taxRate || 0,
        status: 'NEW',
        comment: userComment, // The repository will append metadata to this
        dueDays: dto.dueDays || 14,
        dueDate,
        timesheetIds: dto.timesheetIds || [],
        items,
        filteredInvoiceId: filteredInvoice.id,
        // Store metadata as JSON string - will be appended to comment by repository
        metadata: JSON.stringify(metadata),
      };
      
      console.log('[INVOICE_SERVICE] Creating invoice with data:', JSON.stringify({
        invoiceNumber,
        customerId: filteredInvoice.customerId,
        userId: dto.userId || 1,
        total: filteredInvoice.finalPrice,
        tax: filteredInvoice.taxPrice,
        subtotal: filteredInvoice.totalPrice,
        currency: filteredInvoice.currency || 'USD',
        vat: filteredInvoice.taxRate || 0,
        items: items.length,
      }, null, 2));
      
      // Create the invoice
      const newInvoice = await this.invoiceRepository.create(invoiceData);
      console.log('[INVOICE_SERVICE] Invoice created with ID:', newInvoice?.id);
      
      // Mark the filtered invoice as saved
      await this.filteredInvoiceRepository.markAsSaved(filteredInvoice.id);
      console.log('[INVOICE_SERVICE] Marked filtered invoice as saved');
      
      // Mark timesheets as exported if provided
      if (dto.timesheetIds && dto.timesheetIds.length > 0) {
        await this.markTimesheetsAsExported(dto.timesheetIds);
        console.log('[INVOICE_SERVICE] Marked timesheets as exported');
      }
      
      // // Send email notification to customer if customer has email
      // if (customerData && customerData.email) {
      //   try {
      //     console.log('[INVOICE_SERVICE] Sending email notification to customer:', customerData.email);
          
      //     // Prepare invoice data for email
      //     const invoiceForEmail = {
      //       id: newInvoice.id.toString(),
      //       invoiceNumber: newInvoice.invoiceNumber,
      //       date: newInvoice.createdAt.toISOString(),
      //       dueDate: newInvoice.dueDate.toISOString(),
      //       status: newInvoice.status,
      //       subtotalAmount: newInvoice.subtotal.toString(),
      //       taxAmount: newInvoice.tax.toString(),
      //       taxRate: newInvoice.vat.toString(),
      //       totalAmount: newInvoice.total.toString(),
      //       currency: newInvoice.currency,
      //       customer: customerData,
      //       items: items.map(item => ({
      //         description: item.description,
      //         quantity: Number(item.amount),
      //         unitPrice: Number(item.rate),
      //         totalPrice: Number(item.total),
      //       })),
      //     };
          
      //     // Log detailed invoice items data for debugging
      //     console.log(`[INVOICE_SERVICE] Invoice items for email (${invoiceForEmail.items.length}):`);
      //     invoiceForEmail.items.forEach((item, index) => {
      //       console.log(`[INVOICE_SERVICE] Item ${index + 1}:`, JSON.stringify(item));
      //     });
          
      //     // Send the email with user information
      //     const emailResult = await this.emailService.sendInvoiceEmail(
      //       customerData.email,
      //       `New Invoice #${newInvoice.invoiceNumber} Generated`,
      //       invoiceForEmail,
      //       {
      //         userId: dto.userId || 1,
      //         userName: `User ${dto.userId || 1}` // In a real app, you would fetch the actual user name
      //       }
      //     );
          
      //     console.log('[INVOICE_SERVICE] Email notification result:', emailResult);
      //   } catch (emailError) {
      //     // Just log the error but don't fail the invoice creation
      //     console.error('[INVOICE_SERVICE] Failed to send email notification:', emailError);
      //   }
      // } else {
      //   console.log('[INVOICE_SERVICE] Customer has no email address, skipping notification');
      // }
      
      return {
        success: true,
        data: {
          id: newInvoice.id.toString(),
          invoiceNumber: newInvoice.invoiceNumber,
          status: newInvoice.status,
          createdAt: newInvoice.createdAt.toISOString(),
          filteredInvoiceId: filteredInvoice.id,
        }
      };
    } catch (error) {
      console.error('[INVOICE_SERVICE] Failed to create invoice from filter:', error);
      return {
        success: false,
        message: 'An error occurred while creating invoice from filter',
        error: error.message,
        stack: error.stack,
      };
    }
  }
  
  /**
   * Get all filtered invoices for a customer that haven't been saved yet
   */
  async getFilteredInvoices(customerId: number): Promise<any> {
    try {
      const filteredInvoices = await this.filteredInvoiceRepository.findByCustomerId(customerId);
      
      return {
        success: true,
        data: filteredInvoices.map(invoice => ({
          id: invoice.id,
          customerId: invoice.customerId,
          projectId: invoice.projectId,
          fromDate: invoice.fromDate.toISOString(),
          toDate: invoice.toDate.toISOString(),
          totalPrice: invoice.totalPrice.toString(),
          taxRate: invoice.taxRate.toString(),
          taxPrice: invoice.taxPrice.toString(),
          finalPrice: invoice.finalPrice.toString(),
          currency: invoice.currency,
          createdAt: invoice.createdAt.toISOString(),
          expiresAt: invoice.expiresAt.toISOString(),
        }))
      };
    } catch (error) {
      console.error('Failed to get filtered invoices:', error);
      return {
        success: false,
        message: 'An error occurred while getting filtered invoices',
      };
    }
  }
  
  /**
   * Get a specific filtered invoice by ID
   */
  async getFilteredInvoice(id: number): Promise<any> {
    try {
      const filteredInvoice = await this.filteredInvoiceRepository.findById(id);
      
      if (!filteredInvoice) {
        return {
          success: false,
          message: `Filtered invoice with ID ${id} not found`,
        };
      }
      
      return {
        success: true,
        data: {
          id: filteredInvoice.id,
          customerId: filteredInvoice.customerId,
          projectId: filteredInvoice.projectId,
          fromDate: filteredInvoice.fromDate.toISOString(),
          toDate: filteredInvoice.toDate.toISOString(),
          totalPrice: filteredInvoice.totalPrice.toString(),
          taxRate: filteredInvoice.taxRate.toString(),
          taxPrice: filteredInvoice.taxPrice.toString(),
          finalPrice: filteredInvoice.finalPrice.toString(),
          currency: filteredInvoice.currency,
          isSaved: filteredInvoice.isSaved,
          createdAt: filteredInvoice.createdAt.toISOString(),
          expiresAt: filteredInvoice.expiresAt.toISOString(),
          responseData: filteredInvoice.responseData,
        }
      };
    } catch (error) {
      console.error('Failed to get filtered invoice:', error);
      return {
        success: false,
        message: 'An error occurred while getting filtered invoice',
      };
    }
  }

  /**
   * Clean up expired filtered invoices
   */
  async cleanupExpiredFilteredInvoices(): Promise<any> {
    try {
      const deletedCount = await this.filteredInvoiceRepository.deleteExpired();
      
      return {
        success: true,
        data: {
          deletedCount,
        }
      };
    } catch (error) {
      console.error('Failed to cleanup expired filtered invoices:', error);
      return {
        success: false,
        message: 'An error occurred while cleaning up expired filtered invoices',
      };
    }
  }
  
  /**
   * Send an invoice email for a specific invoice ID
   * @param id Invoice ID
   * @param emailType Type of email to send ('standard' or 'update_notification')
   * @param senderInfo Optional information about the sender
   * @param overrideEmail Optional email to send to instead of customer email
   * @param authHeader Optional authorization header for API calls
   * @returns Promise with the result of sending the email
   */
  async sendInvoiceEmail(
    id: number, 
    emailType: string = 'standard', 
    senderInfo?: { userId?: number | string; userName?: string }, 
    overrideEmail?: string,
    authHeader?: string
  ): Promise<any> {
    try {
      // Find the invoice
      const invoice = await this.invoiceRepository.findById(id);
      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }

      // Get customer info - pass the auth header if provided
      const customerInfo = await this.getCustomerInfo(invoice.customerId, authHeader);
      if (!customerInfo || (!customerInfo.email && !overrideEmail)) {
        return {
          success: false,
          message: `Cannot send email: Customer ${invoice.customerId} has no email address and no override email provided`,
        };
      }

      // Determine which email to use - override email takes precedence
      const targetEmail = overrideEmail || customerInfo.email || '';
      
      // Validate that we have a valid email to send to
      if (!targetEmail) {
        return {
          success: false,
          message: 'Cannot send email: No valid email address provided',
        };
      }

      // Process invoice items with proper calculations
      const processedItems = (invoice.items || []).map((item: any) => {
        const quantity = Number(item.amount) || 0;
        const unitPrice = Number(item.rate) || 0;
        const total = quantity * unitPrice;
        
        return {
          description: item.description,
          quantity: quantity,
          unitPrice: unitPrice,
          total: total,
          totalPrice: total, // Add totalPrice property that email service expects
          taxRate: 10, // Default 10%
          date: item.begin ? item.begin.toISOString() : new Date().toISOString(),
        };
      });
      
      // Calculate subtotal from items
      const subtotal = processedItems.reduce((sum, item) => sum + (item.total || 0), 0);
      
      // Get tax rate from invoice or use default 10%
      const taxRate = Number(invoice.vat || 10);
      const tax = subtotal * (taxRate / 100);
      
      // Calculate total
      const total = subtotal + tax;

      // Prepare invoice data for email
      const invoiceData = {
        id: invoice.id.toString(),
        invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
        customer: customerInfo,
        date: invoice.createdAt.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status,
        totalAmount: total,
        totalPrice: total.toFixed(2),
        subtotalAmount: subtotal.toFixed(2), // Match property name expected by email service
        taxAmount: tax.toFixed(2), // Match property name expected by email service
        taxRate: taxRate, // Include the tax rate
        currency: invoice.currency || 'USD',
        notes: invoice.comment || '',
        paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : undefined,
        items: processedItems,
        emailType: emailType, // Set the email type for template selection
      };

      // Determine subject based on email type and invoice status
      let subject = `Invoice #${invoiceData.invoiceNumber}`;
      if (emailType === 'update_notification') {
        subject += ` - ${invoice.status} Notification`;
      }

      // Send the email
      this.logger.log(`Sending ${emailType} email for invoice #${invoiceData.invoiceNumber} to ${targetEmail}`);
      const emailResult = await this.emailService.sendInvoiceEmail(
        targetEmail,
        subject,
        invoiceData,
        senderInfo
      );

      if (emailResult.success) {
        this.logger.log(`Email sent successfully to ${targetEmail}`);
        
        // Update invoice status to PENDING after successful email sending
        try {
          await this.invoiceRepository.update(id, { status: 'PENDING' });
          this.logger.log(`Updated invoice #${invoice.id} status to PENDING`);
        } catch (updateError) {
          this.logger.error(`Failed to update invoice status: ${updateError.message}`);
          // Don't fail the whole operation if just the status update fails
        }
        
        return {
          success: true,
          message: `Email sent successfully to ${targetEmail}`,
          emailDetails: emailResult,
          statusUpdated: true,
        };
      } else {
        this.logger.error(`Failed to send email: ${emailResult.error}`);
        return {
          success: false,
          message: 'Failed to send email',
          error: emailResult.error,
        };
      }
    } catch (error) {
      this.logger.error(`Error sending invoice email: ${error.message}`);
      return {
        success: false,
        message: 'An error occurred while sending the invoice email',
        error: error.message,
      };
    }
  }
  
  /**
   * Generate a unique invoice number based on customer ID and current date
   * @param customerId The customer ID to include in the invoice number
   * @returns A unique invoice number string
   */
  private async generateInvoiceNumber(customerId: number): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Format: INV-CUSTOMERID-YYYYMMDD-RANDOM
    return `INV-${customerId}-${year}${month}${day}-${random}`;
  }
  
  private calculateDueDate(date: Date, days: number): Date {
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
  }
  
  private async markTimesheetsAsExported(timesheetIds: number[]): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(`${this.timesheetServiceUrl}/api/v1/timesheets/mark-as-exported`, {
          ids: timesheetIds
        })
      );
    } catch (error) {
      console.error('Failed to mark timesheets as exported:', error);
    }
  }
  
  private async unmarkTimesheetsAsExported(timesheetIds: number[]): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(`${this.timesheetServiceUrl}/api/v1/timesheets/unmark-as-exported`, {
          ids: timesheetIds
        })
      );
    } catch (error) {
      console.error('Failed to unmark timesheets as exported:', error);
    }
  }
  
  private async fetchTimesheets(dto: FilterInvoiceDto): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.timesheetServiceUrl}/api/v1/timesheets/filter`, {
          customer_id: dto.customer_id,
          project_id: dto.project_id,
          from: dto.from,
          to: dto.to,
          activities: dto.activities
        })
      );
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      
      console.log(`No timesheets found for filter: ${JSON.stringify(dto)}`);
      return [];
    } catch (error) {
      console.error('Failed to fetch timesheets:', error);
      return [];
    }
  }
  
  private calculateTotalAmount(timesheets: any[]): number {
    return timesheets.reduce((total, timesheet) => {
      const rate = parseFloat(timesheet.rate) || 0;
      const amount = parseFloat(timesheet.amount) || 0;
      return total + (rate * amount);
    }, 0);
  }
  
  private createInvoiceItems(timesheets: any[]): any[] {
    return timesheets.map(timesheet => ({
      description: timesheet.description || 'No description',
      quantity: Number(timesheet.amount) || 0,
      unitPrice: Number(timesheet.rate) || 0,
      taxRate: 10, // Mặc định 10%
      date: timesheet.begin || new Date().toISOString(),
    }));
  }
  
  private async createMockInvoice(dto: FilterInvoiceDto): Promise<any> {
    const customerInfo = await this.getCustomerInfo(dto.customer_id);
    
    return {
      id: `INV-MOCK-${Date.now()}`,
      customer: {
        id: customerInfo.id,
        name: customerInfo.name,
        company: customerInfo.company,
        address: customerInfo.address
      },
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'NEW',
      totalPrice: '0.00',
      currency: 'USD',
      notes: '',
      createdBy: 'System',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Fetch tasks by activity IDs
   * If activityIds is empty, fetch all tasks
   */
  private async fetchTasksByActivities(activityIds: number[], authHeader?: string): Promise<any[]> {
    try {
      const allTasks: any[] = [];
      
      // If no activity IDs are provided, fetch all tasks
      if (!activityIds || activityIds.length === 0) {
        console.log(`Fetching ALL tasks from ${this.projectServiceUrl}/api/v1/tasks (no activity filter)`);
        
        const response = await firstValueFrom(
          this.httpService.get(`${this.projectServiceUrl}/api/v1/tasks`, {
            headers: this.getHeaders(authHeader),
            timeout: 8000
          })
        );
        
        if (response.data && response.data.data) {
          console.log(`Received ${response.data.data.length} tasks (all activities)`);
          allTasks.push(...response.data.data);
        }
        
        return allTasks;
      }
      
      // If activity IDs are provided, fetch tasks for each activity
      for (const activityId of activityIds) {
        console.log(`Fetching tasks for activity ID ${activityId} from ${this.projectServiceUrl}/api/v1/tasks?activity_id=${activityId}`);
        
        console.log(`Request URL: ${this.projectServiceUrl}/api/v1/tasks?activity_id=${activityId}`);
        
        const response = await firstValueFrom(
          this.httpService.get(`${this.projectServiceUrl}/api/v1/tasks`, {
            params: {
              activity_id: activityId.toString()
            },
            headers: this.getHeaders(authHeader),
            timeout: 8000
          })
        );
        
        if (response.data && response.data.data) {
          console.log(`Received ${response.data.data.length} tasks for activity ID ${activityId}`);
          allTasks.push(...response.data.data);
        }
      }
      
      return allTasks;
    } catch (error) {
      console.error('Failed to fetch tasks by activities:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      return [];
    }
  }
  
  /**
   * Fetch expenses from tasks
   */
  private async fetchExpensesFromTasks(tasks: any[], authHeader?: string): Promise<any[]> {
    if (!tasks || tasks.length === 0) {
      return [];
    }
    
    try {
      const expenses: any[] = [];
      
      // Extract expense IDs from tasks
      const expenseIds = tasks
        .filter(task => task.expense_id)
        .map(task => task.expense_id);
      
      console.log(`[EXPENSE_DEBUG] Tasks with expense IDs: ${expenseIds.length}/${tasks.length}`);
      
      if (expenseIds.length === 0) {
        console.log('[EXPENSE_DEBUG] No expense IDs found in tasks, creating default expenses');
        // Create default expenses for all tasks
        tasks.forEach(task => {
          const defaultCost = 45; // Use the same default cost as in the example
        
          const defaultExpense = {
            id: `default-${task.id}`,
            name: `Expense for ${task.title}`,
            description: task.description || `Default expense for task ${task.id}`,
            amount: defaultCost,
            cost: defaultCost, // Add cost field to match API response structure
            created_at: task.created_at,
            task_id: task.id
          };
          console.log(`[EXPENSE_DEBUG] Created default expense for task ${task.id} with cost=${defaultCost}`);
          expenses.push(defaultExpense);
        });
        return expenses;
      }
      
      // Get unique expense IDs to avoid duplicate API calls
      const uniqueExpenseIds = [...new Set(expenseIds)];
      console.log(`[EXPENSE_DEBUG] Unique expense IDs to fetch: ${uniqueExpenseIds.join(', ')}`);
      
      // Fetch each expense from the API
      for (const expenseId of uniqueExpenseIds) {
        console.log(`[EXPENSE_DEBUG] Fetching expense data for ID ${expenseId} from ${this.projectServiceUrl}/api/v1/expenses/${expenseId}`);
        
        try {
          const response = await firstValueFrom(
            this.httpService.get(`${this.projectServiceUrl}/api/v1/expenses/${expenseId}`, {
              headers: this.getHeaders(authHeader),
              timeout: 5000
            })
          );
          
          if (response.data) {
            // Find the task related to this expense
            const relatedTask = tasks.find(task => task.expense_id === expenseId);
            if (relatedTask) {
              // Extract cost from response
              const cost = response.data.cost;
              console.log(`[EXPENSE_DEBUG] API response for expense ID ${expenseId}: cost=${cost}`);
              
              // Add task_id to the expense data for mapping
              response.data.task_id = relatedTask.id;
              
              // Ensure cost is properly set
              if (cost === undefined || cost === null) {
                response.data.cost = 45;
                console.log(`[EXPENSE_DEBUG] Cost not found in API response, using default cost=45 for task ${relatedTask.id}`);
              }
              
              expenses.push(response.data);
              console.log(`[EXPENSE_DEBUG] Added expense with cost=${response.data.cost} for task ${relatedTask.id}`);
            }
          }
        } catch (error) {
          console.error(`[EXPENSE_DEBUG] Failed to fetch expense with ID ${expenseId}:`, error.message);
          
          // Create a default expense if API call fails
          const relatedTask = tasks.find(task => task.expense_id === expenseId);
          if (relatedTask) {
            const defaultCost = 45; // Use the same default cost as in the example
            
            const defaultExpense = {
              id: expenseId,
              name: `Expense for ${relatedTask.title}`,
              description: relatedTask.description || `Default expense for task ${relatedTask.id}`,
              amount: defaultCost,
              cost: defaultCost, // Add cost field to match API response structure
              created_at: relatedTask.created_at,
              task_id: relatedTask.id
            };
            console.log(`[EXPENSE_DEBUG] Created default expense for task ${relatedTask.id} with cost=${defaultCost} (API failure)`);
            expenses.push(defaultExpense);
          }
        }
      }
      
      // Create default expenses for tasks without expense_id
      const tasksWithoutExpense = tasks.filter(task => !task.expense_id);
      tasksWithoutExpense.forEach(task => {
        // Use the same default cost as in the example (45)
        const defaultCost = 45;
        
        const defaultExpense = {
          id: `default-${task.id}`,
          name: `Expense for ${task.title}`,
          description: task.description || `Default expense for task ${task.id}`,
          amount: defaultCost,
          cost: defaultCost, // Add cost field to match API response structure
          created_at: task.created_at,
          task_id: task.id
        };
        console.log(`[EXPENSE_DEBUG] Created default expense for task ${task.id} with cost=${defaultCost} (no expense_id)`);
        expenses.push(defaultExpense);
      });
      
      console.log(`[EXPENSE_DEBUG] Fetched ${expenses.length} expenses from ${tasks.length} tasks`);
      console.log(`[EXPENSE_DEBUG] Expense costs: ${expenses.map(e => e.cost).join(', ')}`);
      return expenses;
    } catch (error) {
      console.error('[EXPENSE_DEBUG] Failed to fetch expenses from tasks:', error);
      return [];
    }
  }

  /**
   * Lấy thông tin project từ project-service
   */
  private async getProjectInfo(projectId: number, authHeader?: string): Promise<any> {
    try {
      console.log(`Fetching project info for ID ${projectId} from ${this.projectServiceUrl}/api/v1/projects/${projectId}`);
      console.log(`Authorization token received: ${authHeader}`);
      
      // Use the getHeaders method to ensure consistent header handling
      const headers = this.getHeaders(authHeader);

      console.log(`Request URL: ${this.projectServiceUrl}/api/v1/projects/${projectId}`);
      console.log(`Request headers:`, headers);
      
      const response = await firstValueFrom(
        this.httpService.get(`${this.projectServiceUrl}/api/v1/projects/${projectId}`, {
          headers: headers,
          timeout: 5000 
        })
      );
      
      console.log('Project response status:', response.status);
  
      if (response.data) {
        console.log('Project data from API:', response.data);
        return response.data;
      }
      
      
      console.log(`No project data found for ID ${projectId}`);
      return null;
    } catch (error) {
      console.error(`Failed to fetch project info for ID ${projectId}:`, error.message);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      // Trả về null trong trường hợp lỗi
      return null;
    }
  }

  /**
   * Store customer data for later retrieval
   */
  private storeCustomerData(customerId: number, customerData: CustomerInfo): void {
    try {
      console.log(`[INVOICE_SERVICE] Storing customer data for ID ${customerId}`);
      
      // Store in the customerCache map
      this.customerCache.set(customerId, {
        data: customerData,
        timestamp: new Date().getTime()
      });
      
      console.log(`[INVOICE_SERVICE] Customer data stored for ID ${customerId}`);
    } catch (error) {
      console.error(`[INVOICE_SERVICE] Failed to store customer data for ID ${customerId}:`, error);
    }
  }

  /**
   * Lấy thông tin customer từ project-service hoặc từ cache
   */
  /**
   * Fetches customer information from the project service API
   * If data cannot be retrieved, an error is thrown (no fallback to mock data)
   */
  private async getCustomerInfo(customerId: number, authHeader?: string): Promise<CustomerInfo> {
    // Check if we have cached customer data that's less than 1 hour old
    const cachedCustomer = this.customerCache.get(customerId);
    if (cachedCustomer && (new Date().getTime() - cachedCustomer.timestamp < 3600000)) {
      return cachedCustomer.data;
    }
    
    // Check if project service URL is set
    if (!this.projectServiceUrl) {
      throw new Error(`Project service URL is not configured. Please check environment variables.`);
    }
    
    // Construct the URL with proper path
    let url = this.projectServiceUrl;
    // Make sure URL doesn't end with a slash
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    // Add the API path
    url = `${url}/api/v1/customers/${customerId}`;
    
    // Use the getHeaders method to ensure consistent header handling
    const headers = this.getHeaders(authHeader);
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: headers,
          timeout: 10000 // Increased timeout to 10 seconds
        })
      );
      
      // Check if response has data
      if (!response.data) {
        throw new Error(`API returned empty response for customer ID ${customerId}`);
      }
      
      // Map the API response fields to our CustomerInfo interface
      // The API uses snake_case but our interface uses camelCase
      const customerData: CustomerInfo = {
        id: response.data.id,
        name: response.data.name || `Customer ${customerId}`,
        company: response.data.company_name || '',
        address: response.data.address || '',
        comment: response.data.description || '',
        visible: true,
        vatId: response.data.vat_id || '',
        number: response.data.account_number || '',
        country: response.data.country || '',
        currency: response.data.currency || 'USD',
        phone: response.data.phone || '',
        fax: response.data.fax || '',
        mobile: response.data.mobile || '',
        email: response.data.email || '',
        homepage: response.data.homepage || '',
        timezone: response.data.timezone || 'UTC',
        color: response.data.color || '#000000',
      };
      
      // Store the customer data in the cache
      this.storeCustomerData(customerId, customerData);
      
      return customerData;
    } catch (error: any) {
      // Provide detailed error information
      let errorMessage = `Failed to fetch customer data from ${url}: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message;
      }
      
      console.error(`[INVOICE_SERVICE] ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Tạo dữ liệu mẫu cho customer khi không lấy được từ service
   */
  // Method removed - we no longer use default customer data



  private getHeaders(authHeader?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    return headers;
  }

  private validateInvoiceStatus(status: string): "NEW" | "PENDING" | "PAID" | "CANCELED" | "OVERDUE" {
    // Validate status
    const validStatuses = ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'] as const;
    if (!validStatuses.includes(status as any)) {
      throw new Error(`Invalid invoice status: ${status}`);
    }
    return status as "NEW" | "PENDING" | "PAID" | "CANCELED" | "OVERDUE";
  }
}
