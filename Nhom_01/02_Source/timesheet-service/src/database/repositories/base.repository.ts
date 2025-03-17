/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BaseRepositoryInterface } from './base.repository.interface';
import { PrismaClient } from '../prisma.service';
import {
  CreateOptions,
  GetOptions,
  UpdateOptions,
} from '@/types/database.type';

export class BaseRepository<T> implements BaseRepositoryInterface<T> {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly tableName: string,
  ) {}

  async create(entity: T, options: CreateOptions): Promise<T> {
    return await this.prismaClient[this.tableName].create({
      data: entity,
      ...options,
    });
  }

  async createMany(entities: T[], options: CreateOptions): Promise<T[]> {
    return await Promise.all(
      entities.map((entity) => this.create(entity, options)),
    );
  }

  async findById(
    id: number | string,
    options: GetOptions<T>,
  ): Promise<T | null> {
    return await this.prismaClient[this.tableName].findUnique({
      where: {
        id: id,
      },
      ...options,
    });
  }

  async findAll(options: GetOptions<T>): Promise<T[]> {
    return await this.prismaClient[this.tableName].findUnique({
      ...options,
    });
  }

  async update(options: UpdateOptions<T>): Promise<T | null> {
    const updated = await this.prismaClient[this.tableName].update({
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
}
