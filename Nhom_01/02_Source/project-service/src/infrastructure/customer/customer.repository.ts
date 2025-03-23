import { BaseRepository } from '@/libs/database/repositories/base.repository';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '@/domain/customer/customer.repository.interface';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerRepository
  extends BaseRepository<Customer>
  implements ICustomerRepository
{
  constructor(protected readonly prismaClient: PrismaClient) {
    super(prismaClient, 'customer');
  }
}
