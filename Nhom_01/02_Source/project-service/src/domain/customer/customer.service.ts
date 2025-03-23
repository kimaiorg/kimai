import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/infrastructure/customer/customer.repository';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from '@/api/customer/dto/create-customer.dto';

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
}
