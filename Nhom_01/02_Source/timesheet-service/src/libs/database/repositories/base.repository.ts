/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BaseRepositoryInterface } from './base.repository.interface';
import { PrismaClient } from '@/libs/database/prisma.service';
import {
  CreateOptions,
  GetOptions,
  UpdateOptions,
} from '@/libs/types/database.type';

export class BaseRepository<T> implements BaseRepositoryInterface<T> {
  constructor(
    protected readonly prismaClient: PrismaClient,
    private readonly tableName: string,
  ) {}

  async create(entity: any, options?: CreateOptions): Promise<T> {
    return await this.prismaClient[this.tableName].create({
      data: entity,
      ...options,
    });
  }

  async createMany(entities: any[], options?: CreateOptions): Promise<T[]> {
    return await Promise.all(
      entities.map((entity) => this.create(entity, options)),
    );
  }

  async findById(
    id: number | string,
    options?: GetOptions<T>,
  ): Promise<T | null> {
    return await this.prismaClient[this.tableName].findUnique({
      where: {
        id: id,
      },
      ...options,
    });
  }

  async findAll(options?: GetOptions<T>): Promise<T[]> {
    return await this.prismaClient[this.tableName].findMany({
      ...options,
    });
  }

  async update(options: UpdateOptions<T>): Promise<T | null> {
    const updated = await this.prismaClient[this.tableName].updateMany({
      ...options,
    });
    return updated;
  }

  async delete(id: number | string): Promise<boolean> {
    return await this.prismaClient[this.tableName].delete({
      where: {
        id: id,
        deleted_at: null,
      },
    });
  }

  async count(options?: GetOptions<T>): Promise<number | null> {
    return await this.prismaClient[this.tableName].count({
      ...options,
    });
  }
}
