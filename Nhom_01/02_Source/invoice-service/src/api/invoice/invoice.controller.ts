import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Invoice } from '@/types';
import { Permissions } from '@/libs/decorators';
import { InvoiceService } from '@/domain/invoice/invoice.service';
import {
  CreateInvoiceDto,
  createInvoiceSchema,
  updateInvoiceSchema,
  UpdateInvoiceDto,
  listInvoiceSchema,
  ListInvoiceDto,
  FilterInvoiceDto,
  filterInvoiceSchema,
  UpdateInvoiceStatusDto,
  updateInvoiceStatusSchema,
  CreateInvoiceFromFilterDto,
  createInvoiceFromFilterSchema,
} from '@/api/invoice/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import {
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateInvoiceSwagger,
  UpdateInvoiceSwagger,
  ListInvoiceSwaggerDto,
  FilterInvoiceSwaggerDto,
  UpdateInvoiceStatusSwaggerDto,
  CreateInvoiceFromFilterSwaggerDto,
} from '@/api/invoice/swagger';
import { PaginationResponse } from '@/libs/response/pagination';
import { z } from 'zod';
import { Request } from 'express';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({ type: CreateInvoiceSwagger })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The invoice has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  @Permissions(['create:invoices'])
  @UsePipes(new ZodValidationPipe(createInvoiceSchema))
  async createInvoice(@Body() dto: CreateInvoiceDto): Promise<any> {
    const result = await this.invoiceService.createInvoice(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoice has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['read:invoices'])
  async getInvoice(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.invoiceService.getInvoice(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices with pagination and filtering' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    type: String,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sort_order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'],
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'customer_id',
    required: false,
    type: Number,
    description: 'Filter by customer ID',
  })
  @ApiQuery({
    name: 'user_id',
    required: false,
    type: Number,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Filter by keyword',
  })
  @ApiQuery({
    name: 'from_date',
    required: false,
    type: String,
    description: 'Filter by created date from (ISO format)',
  })
  @ApiQuery({
    name: 'to_date',
    required: false,
    type: String,
    description: 'Filter by created date to (ISO format)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoices have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['read:invoices'])
  @UsePipes(new ZodValidationPipe(listInvoiceSchema))
  async listInvoices(@Query() dto: ListInvoiceDto, @Req() request: Request): Promise<any> {
    try {
      // Extract authorization header using the same approach as filterInvoices
      let authHeader = request.headers['authorization'];

      if (!authHeader && request.headers['authorization']) {
        authHeader = request.headers['authorization'] as string;
      }
      if (!authHeader && request.headers['Authorization']) {
        authHeader = request.headers['Authorization'] as string;
      }

      if (!authHeader && request.query && request.query['access_token']) {
        authHeader = `Bearer ${request.query['access_token']}`;
      }

      if (!authHeader && request.cookies && request.cookies['access_token']) {
        authHeader = `Bearer ${request.cookies['access_token']}`;
      }
      
      // Log the authorization header for debugging
      console.log('All headers:', JSON.stringify(request.headers, null, 2));
      console.log(
        'Authorization header:',
        authHeader ? `${authHeader.substring(0, 15)}...` : 'undefined',
      );
      
      // Add the auth header to the DTO
      const dtoWithAuth = { ...dto, authHeader };
      
      const result = await this.invoiceService.listInvoices(dtoWithAuth);
      return result;
    } catch (error) {
      console.error('Error in listInvoices controller:', error);
      return {
        success: false,
        message: 'Failed to list invoices',
        error: error.message,
      };
    }
  }

  @Post('filter')
  @ApiOperation({ summary: 'Filter invoices' })
  @ApiBody({
    type: FilterInvoiceSwaggerDto,
    description: 'Filter criteria for invoices',
    examples: {
      example1: {
        summary: 'Basic filter example',
        value: {
          customer_id: 3,
          from: '2025-03-01T00:00:00Z',
          to: '2025-05-31T23:59:59Z',
          project_id: 1,
          activities: [1],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async filterInvoices(
    @Body() dto: FilterInvoiceDto,
    @Req() request: Request,
  ): Promise<any> {
    try {
      console.log('Request body:', dto);

      if (!dto || Object.keys(dto).length === 0) {
        console.log('Empty request body, using default values');

        dto = {
          customer_id: 3,
          from: '2025-03-01T00:00:00Z',
          to: '2025-05-31T23:59:59Z',
          project_id: 1,
          activities: [1],
        };
      }

      if (!dto.customer_id) {
        return {
          success: false,
          message: 'customer_id is required',
        };
      }

      if (!dto.from || !dto.to) {
        return {
          success: false,
          message: 'from and to dates are required',
        };
      }

      // Ensure activities is always an array (even if empty)
      if (!dto.activities) {
        dto.activities = [];
      } else if (!Array.isArray(dto.activities)) {
        // If activities is provided but not an array, convert it to an array
        dto.activities = [dto.activities];
      }
      
      let authHeader = request.headers['authorization'];

      if (!authHeader && request.headers['authorization']) {
        authHeader = request.headers['authorization'] as string;
      }
      if (!authHeader && request.headers['Authorization']) {
        authHeader = request.headers['Authorization'] as string;
      }

      if (!authHeader && request.query && request.query['access_token']) {
        authHeader = `Bearer ${request.query['access_token']}`;
      }

      if (!authHeader && request.cookies && request.cookies['access_token']) {
        authHeader = `Bearer ${request.cookies['access_token']}`;
      }

      console.log('All headers:', JSON.stringify(request.headers, null, 2));
      console.log(
        'Authorization header:',
        authHeader ? `${authHeader.substring(0, 15)}...` : 'undefined',
      );

      if (!authHeader) {
        console.log('No authorization header provided, using mock data');
        return {
          success: true,
          data: [
            {
              id: `INV-MOCK-${Date.now()}`,
              customer: {
                id: dto.customer_id,
                name: `Customer ${dto.customer_id}`,
                company: 'Sample Company',
                address: '123 Main St, New York, USA',
              },
              date: new Date().toISOString(),
              fromDate: dto.from,
              toDate: dto.to,
              dueDate: new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              status: 'NEW',
              taxPrice: 100,
              taxRate: 10,
              templateId: 1,
              totalPrice: '1000',
              finalPrice: '1100',
              currency: 'USD',
              notes: 'Sample invoice from Swagger',
              createdBy: 'System',
              createdAt: new Date().toISOString(),
              items: [
                {
                  description: 'Sample item',
                  quantity: 1,
                  unitPrice: 1000,
                  taxRate: 10,
                  date: new Date().toISOString(),
                },
              ],
            },
          ],
        };
      }

      return this.invoiceService.filterInvoices(dto, authHeader);
    } catch (error) {
      console.error('Error in filterInvoices controller:', error);
      return {
        success: false,
        message: 'Failed to filter invoices',
        error: error.message,
      };
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiBody({ type: UpdateInvoiceSwagger })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoice has been successfully updated.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['update:invoices'])
  async updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateInvoiceSchema)) dto: UpdateInvoiceDto,
  ): Promise<any> {
    try {
      return await this.invoiceService.updateInvoice(id, dto);
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      return {
        success: false,
        message: error.message || 'Failed to update invoice',
        error: error.stack,
        statusCode: 500
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoice has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @Permissions(['delete:invoices'])
  async deleteInvoice(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const result = await this.invoiceService.deleteInvoice(id);
    return {
      success: result,
      message: result ? 'Invoice deleted successfully' : 'Invoice not found',
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiBody({ type: UpdateInvoiceStatusSwaggerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoice status has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['update:invoices'])
  @UsePipes(new ZodValidationPipe(updateInvoiceStatusSchema))
  async updateInvoiceStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvoiceStatusDto,
  ): Promise<any> {
    return await this.invoiceService.updateInvoiceStatus(id, dto);
  }

  @Put(':id/status/paid')
  @ApiOperation({ summary: 'Mark an invoice as paid' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The invoice has been successfully marked as paid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Invoice not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['update:invoices'])
  async markInvoiceAsPaid(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.invoiceService.markInvoiceAsPaid(id);
  }

  @Post('generate')
  @ApiOperation({
    summary: 'Generate invoice from filtered results',
    description:
      'Creates a new invoice based on a previously filtered result. This endpoint converts a temporary filtered invoice into a permanent invoice in the database.',
  })
  @ApiBody({ type: CreateInvoiceFromFilterSwaggerDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The invoice has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  @Permissions(['create:invoices'])
  async createInvoiceFromFilter(@Body() body: any): Promise<any> {
    try {
      console.log('[INVOICE_DEBUG] Creating invoice from filter with data:', JSON.stringify(body, null, 2));
      
      // Validate the incoming data
      const validatedData = createInvoiceFromFilterSchema.parse(body);
      console.log('[INVOICE_DEBUG] Validated data:', JSON.stringify(validatedData, null, 2));
      
      // Call the service to create the invoice
      const result = await this.invoiceService.createInvoiceFromFilter(validatedData);
      console.log('[INVOICE_DEBUG] Service result:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error('[INVOICE_DEBUG] Error creating invoice from filter:', error);
      
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: 'Validation failed',
          error: JSON.stringify(error.errors),
          statusCode: 400
        };
      }
      
      return {
        success: false,
        message: error.message || 'Failed to create invoice from filter',
        error: error.stack,
        statusCode: 500
      };
    }
  }
  
  @Get('filtered/:id')
  @ApiOperation({
    summary: 'Get a specific filtered invoice',
    description: 'Retrieves a specific filtered invoice by its ID',
  })
  @ApiParam({ name: 'id', description: 'Filtered Invoice ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The filtered invoice has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Filtered invoice not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['read:invoices'])
  async getFilteredInvoice(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.invoiceService.getFilteredInvoice(id);
  }
  
  @Get('filtered/customer/:customerId')
  @ApiOperation({
    summary: 'Get all filtered invoices for a customer',
    description: 'Retrieves all filtered invoices for a specific customer that have not been saved yet',
  })
  @ApiParam({ name: 'customerId', description: 'Customer ID', type: 'number' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The filtered invoices have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['read:invoices'])
  async getFilteredInvoicesByCustomer(@Param('customerId', ParseIntPipe) customerId: number): Promise<any> {
    return await this.invoiceService.getFilteredInvoices(customerId);
  }
  
  @Post('filtered/cleanup')
  @ApiOperation({
    summary: 'Clean up expired filtered invoices',
    description: 'Deletes all expired filtered invoices that have not been saved',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The expired filtered invoices have been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @Permissions(['delete:invoices'])
  async cleanupExpiredFilteredInvoices(): Promise<any> {
    return await this.invoiceService.cleanupExpiredFilteredInvoices();
  }
}
