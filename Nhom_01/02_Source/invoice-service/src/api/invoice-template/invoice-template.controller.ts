import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { InvoiceTemplateService } from '@/domain/invoice-template/invoice-template.service';
import { InvoiceTemplate } from '@/types';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { Permissions } from '@/libs/decorators/permissions.decorator';
import { PaginationResponse } from '@/libs/response/pagination';
import {
  CreateInvoiceTemplateDto,
  UpdateInvoiceTemplateDto,
  ListInvoiceTemplateDto,
  createInvoiceTemplateSchema,
  updateInvoiceTemplateSchema,
  listInvoiceTemplateSchema,
} from './dto';
import {
  CreateTemplateSwagger,
  UpdateTemplateSwagger,
  ListTemplateSwagger,
} from './swagger';

@ApiTags('invoice-templates')
@Controller('invoice-templates')
export class InvoiceTemplateController {
  constructor(
    private readonly invoiceTemplateService: InvoiceTemplateService,
  ) {}

  @Post()
  @ApiBody({ type: CreateTemplateSwagger })
  @ApiResponse({
    status: 201,
    description: 'The invoice template has been successfully created.',
  })
  @Permissions(['create:invoice-templates'])
  @UsePipes(new ZodValidationPipe(createInvoiceTemplateSchema))
  async createTemplate(
    @Body() dto: CreateInvoiceTemplateDto,
  ): Promise<InvoiceTemplate> {
    return await this.invoiceTemplateService.createTemplate(dto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Invoice template ID' })
  @ApiResponse({ status: 200, description: 'Return the invoice template.' })
  @ApiResponse({ status: 404, description: 'Invoice template not found.' })
  @Permissions(['read:invoice-templates'])
  async getTemplate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InvoiceTemplate | null> {
    return await this.invoiceTemplateService.getTemplate(id);
  }

  @Get()
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
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by template name',
  })
  @ApiQuery({
    name: 'is_active',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the list of invoice templates.',
  })
  @Permissions(['read:invoice-templates'])
  @UsePipes(new ZodValidationPipe(listInvoiceTemplateSchema))
  async listTemplates(
    @Query() query: ListInvoiceTemplateDto,
  ): Promise<PaginationResponse<InvoiceTemplate>> {
    return await this.invoiceTemplateService.listTemplates(query);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'Invoice template ID' })
  @ApiBody({ type: UpdateTemplateSwagger })
  @ApiResponse({
    status: 200,
    description: 'The invoice template has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Invoice template not found.' })
  @Permissions(['update:invoice-templates'])
  @UsePipes(new ZodValidationPipe(updateInvoiceTemplateSchema))
  async updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvoiceTemplateDto,
  ): Promise<InvoiceTemplate | null> {
    return await this.invoiceTemplateService.updateTemplate(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Invoice template ID' })
  @ApiResponse({
    status: 200,
    description: 'The invoice template has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Invoice template not found.' })
  @Permissions(['delete:invoice-templates'])
  async deleteTemplate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean }> {
    const result = await this.invoiceTemplateService.deleteTemplate(id);
    return { success: result };
  }
}
