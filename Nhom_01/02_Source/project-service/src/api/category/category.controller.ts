import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { CategoryService } from '@/domain/category/category.service';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateCategorySwagger,
  UpdateCategorySwagger,
  ListCategorySwaggerDto,
} from '@/api/category/swagger';
import {
  ListCategoryDto,
  listCategorySchema,
  updateCategorySchema,
  UpdateCategoryDto,
  createCategorySchema,
  CreateCategoryDto,
} from '@/api/category/dto';
import { PaginationResponse } from '@/libs/response/pagination';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }
  @Post('')
  @ApiBody({ type: CreateCategorySwagger })
  @Permissions(['create:categories'])
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Category | null> {
    return await this.categoryService.createCategory(dto);
  }

  @Get('')
  @ApiQuery({ type: ListCategorySwaggerDto, required: false })
  @Permissions(['read:categories'])
  @UsePipes(new ZodValidationPipe(listCategorySchema))
  async listTeams(
    @Query() dto: ListCategoryDto,
  ): Promise<PaginationResponse<Category>> {
    return await this.categoryService.listCategories(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCategorySwagger, required: false })
  @Permissions(['update:categories'])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateCategorySchema)) dto: UpdateCategoryDto,
  ): Promise<Category | null> {
    return await this.categoryService.updateCategory(id, dto);
  }
}
