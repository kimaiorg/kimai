import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@/infrastructure/category/category.repository';
import { Category } from '@prisma/client';
import {
  ListCategoryDto,
  UpdateCategoryDto,
  CreateCategoryDto,
} from '@/api/category/dto';
import { PaginationResponse } from '@/libs/response/pagination';
import { buildListQuery } from './builder';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(dto: CreateCategoryDto): Promise<Category | null> {
    return await this.categoryRepository.create(dto);
  }

  async listCategories(
    dto: ListCategoryDto,
  ): Promise<PaginationResponse<Category>> {
    const where = buildListQuery(dto);
    const count = (await this.categoryRepository.count({
      where,
    })) as number;

    const data = await this.categoryRepository.findAll({
      where,
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      orderBy: {
        [dto.sort_by]: dto.sort_order,
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

  async updateCategory(
    id: number,
    dto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return await this.categoryRepository.update({
      where: {
        id: id,
        deleted_at: null,
      },
      data: dto,
    });
  }
}
