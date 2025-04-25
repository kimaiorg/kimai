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
import { ApiBody, ApiQuery, ApiParam, ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({ type: CreateInvoiceSwagger })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The invoice has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  @Permissions(['create:invoices'])
  @UsePipes(new ZodValidationPipe(createInvoiceSchema))
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
  ): Promise<any> {
    const result = await this.invoiceService.createInvoice(dto);
    return {
      success: true,
      data: result
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoice has been successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['read:invoices'])
  async getInvoice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.invoiceService.getInvoice(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'sort_by', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sort_order', required: false, enum: ['asc', 'desc'], description: 'Sort direction' })
  @ApiQuery({ name: 'status', required: false, enum: ['NEW', 'PENDING', 'PAID', 'CANCELED', 'OVERDUE'], description: 'Filter by status' })
  @ApiQuery({ name: 'customer_id', required: false, type: Number, description: 'Filter by customer ID' })
  @ApiQuery({ name: 'user_id', required: false, type: Number, description: 'Filter by user ID' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Filter by keyword' })
  @ApiQuery({ name: 'from_date', required: false, type: String, description: 'Filter by created date from (ISO format)' })
  @ApiQuery({ name: 'to_date', required: false, type: String, description: 'Filter by created date to (ISO format)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoices have been successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['read:invoices'])
  @UsePipes(new ZodValidationPipe(listInvoiceSchema))
  async listInvoices(
    @Query() dto: ListInvoiceDto,
  ): Promise<any> {
    const result = await this.invoiceService.listInvoices(dto);
    return result;
  }

  @Post('filter')
  @ApiOperation({ 
    summary: 'Filter invoices based on criteria', 
    description: 'Returns matching invoices without creating any new resources. Use this endpoint to preview invoices before generating them.'
  })
  @ApiBody({ type: FilterInvoiceSwaggerDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoices have been successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @Permissions(['read:invoices'])
  @UsePipes(new ZodValidationPipe(filterInvoiceSchema))
  async filterInvoices(
    @Body() dto: FilterInvoiceDto,
  ): Promise<any> {
    return await this.invoiceService.filterInvoices(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiBody({ type: UpdateInvoiceSwagger, required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoice has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['update:invoices'])
  @UsePipes(new ZodValidationPipe(updateInvoiceSchema))
  async updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvoiceDto,
  ): Promise<any> {
    return await this.invoiceService.updateInvoice(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoice has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @Permissions(['delete:invoices'])
  async deleteInvoice(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    const result = await this.invoiceService.deleteInvoice(id);
    return {
      success: result,
      message: result ? 'Invoice deleted successfully' : 'Invoice not found'
    };
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiParam({ name: 'id', description: 'Invoice ID', type: 'number' })
  @ApiBody({ type: UpdateInvoiceStatusSwaggerDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoice status has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'The invoice has been successfully marked as paid.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Invoice not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Permissions(['update:invoices'])
  async markInvoiceAsPaid(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.invoiceService.markInvoiceAsPaid(id);
  }

  @Post('generate')
  @ApiOperation({ 
    summary: 'Generate invoice from filter results', 
    description: 'Creates a new invoice based on filter criteria. This endpoint actually creates and saves a new invoice in the database.'
  })
  @ApiBody({ type: CreateInvoiceFromFilterSwaggerDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The invoice has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  @Permissions(['create:invoices'])
  async createInvoiceFromFilter(@Body() body: any): Promise<any> {
    try {
      const validatedData = createInvoiceFromFilterSchema.parse(body);
      return await this.invoiceService.createInvoiceFromFilter(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          message: 'Validation error',
          errors: error.errors,
        };
      }
      return {
        success: false,
        message: 'Failed to create invoice from filter',
      };
    }
  }
}
