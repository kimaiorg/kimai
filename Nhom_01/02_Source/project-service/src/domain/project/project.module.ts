import { Module } from '@nestjs/common';
import { ProjectService } from '@/domain/project/project.service';
import { ProjectModule as ProjectRepositoryModule } from '@/infrastructure/project/project.module';

@Module({
  imports: [ProjectRepositoryModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
