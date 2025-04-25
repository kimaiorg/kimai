import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '@/infrastructure/repositories/invoice.repository';
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

@Injectable()
export class InvoiceService {
  private readonly timesheetServiceUrl: string;
  private readonly projectServiceUrl: string;

  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const timesheetUrl = this.configService.get<string>('TIMESHEET_SERVICE_URL');
    this.timesheetServiceUrl = timesheetUrl || 'https://timesheet-service.onrender.com';
    
    const projectUrl = this.configService.get<string>('PROJECT_SERVICE_URL');
    this.projectServiceUrl = projectUrl || 'https://project-service-6067.onrender.com';
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

  async getInvoices(params: ListInvoiceDto): Promise<any> {
    try {
      // Tạo query params cho repository - ListInvoiceDto đã được transform
      // nên đã có đầy đủ các trường cần thiết: page, limit, sortBy, sortOrder, filters
      const result = await this.invoiceRepository.findAll(params);
      
      // Chuyển đổi dữ liệu để phù hợp với cấu trúc của frontend
      const invoices = await Promise.all(result.items.map(async (invoice: any) => {
        const customerInfo = await this.getCustomerInfo(invoice.customerId);
        
        return {
          id: invoice.id.toString(),
          invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
          customer: {
            id: customerInfo.id,
            name: customerInfo.name,
            company: customerInfo.company,
            address: customerInfo.address
          },
          date: invoice.createdAt.toISOString(),
          dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
          paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : null,
          status: invoice.status,
          totalAmount: invoice.total.toString(),
          currency: invoice.currency || 'USD',
          comment: invoice.comment || '',
          items: (invoice.items || []).map((item: any) => ({
            id: item.id.toString(),
            description: item.description || '',
            quantity: Number(item.amount || 0),
            unitPrice: Number(item.rate || 0),
            totalPrice: Number((Number(item.amount) || 0) * (Number(item.rate) || 0)),
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
      console.error('Error getting invoices:', error);
      return {
        success: false,
        message: 'Failed to get invoices',
        error: error.message
      };
    }
  }

  async getInvoice(id: number): Promise<any> {
    try {
      const invoice: any = await this.invoiceRepository.findById(id);
      
      if (!invoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }
      
      const customerInfo = await this.getCustomerInfo(invoice.customerId);
      
      return {
        success: true,
        data: {
          id: invoice.id.toString(),
          customer: customerInfo,
          date: invoice.createdAt.toISOString(),
          dueDate: invoice.dueDate.toISOString(),
          status: invoice.status,
          totalPrice: invoice.total.toString(),
          currency: invoice.currency,
          notes: invoice.comment || '',
          createdBy: invoice.userId.toString(),
          createdAt: invoice.createdAt.toISOString(),
          paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : undefined,
          items: (invoice.items || []).map((item: any) => ({
            description: item.description || '',
            quantity: Number(item.amount || 0),
            unitPrice: Number(item.rate || 0),
            taxRate: 10, // Mặc định 10%
            date: item.begin ? item.begin.toISOString() : new Date().toISOString(),
          })),
        }
      };
    } catch (error) {
      console.error('Failed to get invoice:', error);
      return {
        success: false,
        message: 'An error occurred while getting invoice',
      };
    }
  }

  async listInvoices(params: ListInvoiceDto): Promise<any> {
    try {
      // Đảm bảo params có đủ thông tin cần thiết
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        filters: params.filters || {}
      };
      
      const result = await this.invoiceRepository.findAll(queryParams);
      
      // Chuyển đổi dữ liệu để phù hợp với cấu trúc của frontend
      const invoices = await Promise.all(result.items.map(async (invoice: any) => {
        const customerInfo = await this.getCustomerInfo(invoice.customerId);
        
        return {
          id: invoice.id.toString(),
          invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
          customer: {
            id: customerInfo.id,
            name: customerInfo.name,
            company: customerInfo.company,
            address: customerInfo.address
          },
          date: invoice.createdAt.toISOString(),
          dueDate: invoice.dueDate ? invoice.dueDate.toISOString() : null,
          paymentDate: invoice.paymentDate ? invoice.paymentDate.toISOString() : null,
          status: invoice.status,
          totalAmount: invoice.total.toString(),
          currency: invoice.currency || 'USD',
          comment: invoice.comment || '',
          items: (invoice.items || []).map((item: any) => ({
            id: item.id.toString(),
            description: item.description || '',
            quantity: Number(item.amount || 0),
            unitPrice: Number(item.rate || 0),
            totalPrice: Number((Number(item.amount) || 0) * (Number(item.rate) || 0)),
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
      console.error('Error listing invoices:', error);
      return {
        success: false,
        message: 'Failed to list invoices',
        error: error.message
      };
    }
  }

  async updateInvoice(id: number, dto: UpdateInvoiceDto): Promise<any> {
    try {
      // Kiểm tra xem invoice có tồn tại không
      const existingInvoice: any = await this.invoiceRepository.findById(id);
      if (!existingInvoice) {
        return {
          success: false,
          message: 'Invoice not found',
        };
      }
      
      // Cập nhật invoice
      const updatedInvoice: any = await this.invoiceRepository.update(id, {
        status: dto.status,
        comment: dto.comment,
        paymentDate: dto.paymentDate
      });
      
      // Kiểm tra nếu updatedInvoice là null
      if (!updatedInvoice) {
        return {
          success: false,
          message: 'Failed to update invoice',
        };
      }
      
      // Lấy thông tin customer mẫu
      const customerInfo = await this.getCustomerInfo(updatedInvoice.customerId);
      
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
      console.error('Failed to update invoice:', error);
      return {
        success: false,
        message: 'An error occurred while updating invoice',
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

      // Lấy thông tin customer mẫu
      const customerInfo = await this.getCustomerInfo(updatedInvoice.customerId);
      
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

  async filterInvoices(dto: FilterInvoiceDto): Promise<any> {
    try {
      // Gọi timesheet-service để lấy dữ liệu timesheet
      const timesheets = await this.fetchTimesheets(dto);
      
      // Nếu không có dữ liệu timesheet, trả về mảng rỗng
      if (!timesheets || timesheets.length === 0) {
        return {
          success: true,
          data: []
        };
      }
      
      // Tính toán tổng số tiền
      const totalAmount = this.calculateTotalAmount(timesheets);
      
      // Tạo các invoice items từ timesheets
      const invoiceItems = this.createInvoiceItems(timesheets);
      
      // Lấy thông tin customer mẫu
      const customerInfo = await this.getCustomerInfo(dto.customer_id);
      
      // Tạo invoice history object
      const invoiceHistory = {
        id: `INV-${Date.now()}`,
        customer: customerInfo,
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'NEW',
        totalPrice: totalAmount.toString(),
        currency: 'USD',
        notes: '',
        createdBy: 'System',
        createdAt: new Date().toISOString(),
        items: invoiceItems
      };
      
      return {
        success: true,
        data: [invoiceHistory]
      };
    } catch (error) {
      console.error('Failed to filter invoices:', error);
      
      // Tạo dữ liệu mẫu trong trường hợp lỗi
      const mockInvoice = await this.createMockInvoice(dto);
      
      return {
        success: true,
        data: [mockInvoice]
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
      // Chuyển đổi dữ liệu từ DTO
      const transformedDto = transformCreateInvoiceFromFilterDto(dto);
      
      // Tạo invoice mới
      const newInvoice = await this.invoiceRepository.create(transformedDto);
      
      // Đánh dấu các timesheet đã được xuất
      if (transformedDto.timesheetIds && transformedDto.timesheetIds.length > 0) {
        await this.markTimesheetsAsExported(transformedDto.timesheetIds);
      }
      
      // Chuyển đổi dữ liệu để phù hợp với cấu trúc của frontend
      return {
        success: true,
        data: {
          id: newInvoice.id.toString(),
          invoiceNumber: newInvoice.invoiceNumber,
          status: newInvoice.status,
          createdAt: newInvoice.createdAt.toISOString(),
        }
      };
    } catch (error) {
      console.error('Failed to create invoice from filter:', error);
      return {
        success: false,
        message: 'An error occurred while creating invoice from filter',
      };
    }
  }

  private async generateInvoiceNumber(customerId: number): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    // Tạo số invoice theo định dạng: INV-CUSTOMERID-YYYYMMDD-RANDOM
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
      items: []
    };
  }

  /**
   * Lấy thông tin customer từ project-service
   */
  private async getCustomerInfo(customerId: number): Promise<any> {
    try {
      console.log(`Fetching customer info for ID ${customerId} from ${this.projectServiceUrl}/api/v1/customers/${customerId}`);
      
      // Gọi API getCustomer từ project-service
      const response = await firstValueFrom(
        this.httpService.get(`${this.projectServiceUrl}/api/v1/customers/${customerId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 5000 // Timeout sau 5 giây nếu không nhận được response
        })
      );
      
      console.log('Response status:', response.status);
      
      // Kiểm tra nếu response có dữ liệu
      if (response.data) {
        console.log('Customer data from API:', response.data);
        
        // Project-service trả về trực tiếp dữ liệu Customer, không có wrapper success/data
        return {
          id: response.data.id,
          name: response.data.name || `Customer ${customerId}`,
          company: response.data.company || '',
          address: response.data.address || '',
          comment: response.data.comment || '',
          visible: response.data.visible,
          vatId: response.data.vatId || '',
          number: response.data.number || '',
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
      }
      
      // Trả về dữ liệu mẫu nếu không lấy được từ service
      console.log(`No customer data found for ID ${customerId}`);
      return this.createDefaultCustomerInfo(customerId);
    } catch (error) {
      console.error(`Failed to fetch customer info for ID ${customerId}:`, error.message);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      // Trả về dữ liệu mẫu trong trường hợp lỗi
      return this.createDefaultCustomerInfo(customerId);
    }
  }
  
  /**
   * Tạo thông tin customer mặc định khi không lấy được từ service
   */
  private createDefaultCustomerInfo(customerId: number): any {
    return {
      id: customerId,
      name: `Customer ${customerId}`,
      company: 'Unknown Company',
      address: 'Unknown Address',
      comment: '',
      visible: true,
      vatId: '',
      number: '',
      country: '',
      currency: 'USD',
      phone: '',
      fax: '',
      mobile: '',
      email: '',
      homepage: '',
      timezone: 'UTC',
      color: '#000000',
    };
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
