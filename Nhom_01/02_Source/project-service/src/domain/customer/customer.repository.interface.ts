import { BaseRepositoryInterface } from '@/libs/database/repositories/base.repository.interface';
import { Customer } from '@prisma/client';

export interface ICustomerRepository
  extends BaseRepositoryInterface<Customer> {}
