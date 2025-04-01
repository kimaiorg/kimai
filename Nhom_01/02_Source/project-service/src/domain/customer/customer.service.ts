import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/infrastructure/customer/customer.repository';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from '@/api/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/api/customer/dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(dto: CreateCustomerDto): Promise<Customer | null> {
    return await this.customerRepository.create(dto);
  }

  async getCustomer(id: number): Promise<Customer | null> {
    return await this.customerRepository.findById(id);
  }

  async listCustomers(): Promise<Customer[] | null> {
    return await this.customerRepository.findAll();
  }
  async updateCustomer(
    id: number,
    dto: UpdateCustomerDto,
  ): Promise<Customer | null> {
    return await this.customerRepository.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }
}
