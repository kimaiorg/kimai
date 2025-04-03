import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '@/infrastructure/customer/customer.repository';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from '@/api/customer/dto/create-customer.dto';
import { UpdateCustomerDto } from '@/api/customer/dto/update-customer.dto';
import { ListCustomerDto } from '@/api/customer/dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(dto: CreateCustomerDto): Promise<Customer | null> {
    return await this.customerRepository.create(dto);
  }

  async getCustomer(id: number): Promise<Customer | null> {
    return await this.customerRepository.findById(id);
  }

  async listCustomers(
    dto: ListCustomerDto,
  ): Promise<PaginationResponse<Customer>> {
    const count = (await this.customerRepository.count({})) as number;

    const data = await this.customerRepository.findAll({
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sortBy]: dto.sortOrder,
      },
    });

    return {
      data,
      metadata: {
        total: count || 0,
        totalPages: Math.ceil(count / dto.limit) || 0,
        page: dto.page,
        limit: dto.limit,
      },
    };
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
