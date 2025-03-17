import {
  CreateOptions,
  GetOptions,
  UpdateOptions,
} from '@/types/database.type';

export interface BaseRepositoryInterface<T> {
  create(entity: T, options: CreateOptions): Promise<T>;
  createMany(entities: T[], options: CreateOptions): Promise<T[]>;
  findById(id: number | string, options: GetOptions<T>): Promise<T | null>;
  findAll(options: GetOptions<T>): Promise<T[]>;
  update(options: UpdateOptions<T>): Promise<T | null>;
  delete(id: number | string): Promise<boolean>;
}
