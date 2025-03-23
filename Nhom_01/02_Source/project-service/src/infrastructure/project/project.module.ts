import { Module } from '@nestjs/common';
import { ProjectRepository } from '@/infrastructure/project/project.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProjectRepository],
  exports: [ProjectRepository],
})
export class ProjectModule {}
