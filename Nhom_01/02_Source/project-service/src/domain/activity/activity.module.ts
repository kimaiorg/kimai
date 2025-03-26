import { Module } from '@nestjs/common';
import { ActivityService } from '@/domain/activity/activity.service';
import { ActivityModule as ActivityRepositoryModule } from '@/infrastructure/activity/activity.module';
import { ProjectModule } from '@/infrastructure/project/project.module';

@Module({
  imports: [ActivityRepositoryModule, ProjectModule],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
