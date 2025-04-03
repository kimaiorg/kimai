import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { CustomerService } from '@/domain/customer/customer.service';
import {
  CreateCustomerDto,
  createCustomerSchema,
  UpdateCustomerDto,
  updateCustomerSchema,
  listCustomerSchema,
  ListCustomerDto,
} from '@/api/customer/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody } from '@nestjs/swagger';
import { CreateCustomerSwagger } from '@/api/customer/swagger';
import { PaginationResponse } from '@/libs/response/pagination';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Post('')
  @ApiBody({ type: CreateCustomerSwagger })
  @Permissions(['create:customers'])
  @UsePipes(new ZodValidationPipe(createCustomerSchema))
  async createCustomer(
    @Body() dto: CreateCustomerDto,
  ): Promise<Customer | null> {
    return await this.customerService.createCustomer(dto);
  }

  @Get(':id')
  @Permissions(['read:customers'])
  async getCustomer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Customer | null> {
    return await this.customerService.getCustomer(id);
  }

  @Get('')
  @Permissions(['read:customers'])
  @UsePipes(new ZodValidationPipe(listCustomerSchema))
  async listCustomers(
    @Query() dto: ListCustomerDto,
  ): Promise<PaginationResponse<Customer>> {
    return await this.customerService.listCustomers(dto);
  }

  @Put(':id')
  @Permissions(['update:customers'])
  @UsePipes(new ZodValidationPipe(updateCustomerSchema))
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer | null> {
    return await this.customerService.updateCustomer(id, dto);
  }
}
