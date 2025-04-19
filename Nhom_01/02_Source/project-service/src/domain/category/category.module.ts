import { Module } from '@nestjs/common';
import { CategoryService } from '@/domain/category/category.service';
import { CategoryModule as CategoryRepositoryModule } from '@/infrastructure/category/category.module';

@Module({
  imports: [CategoryRepositoryModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
