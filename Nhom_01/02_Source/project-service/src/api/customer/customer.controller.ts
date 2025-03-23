import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { CustomerService } from '@/domain/customer/customer.service';
import {
  CreateCustomerDto,
  createCustomerSchema,
} from '@/api/customer/dto/create-customer.dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Post('')
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
  async listCustomers(): Promise<Customer[] | null> {
    return await this.customerService.listCustomers();
  }
}
