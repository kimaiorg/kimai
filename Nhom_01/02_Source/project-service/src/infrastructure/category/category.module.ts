import { Module } from '@nestjs/common';
import { CategoryRepository } from '@/infrastructure/category/category.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
