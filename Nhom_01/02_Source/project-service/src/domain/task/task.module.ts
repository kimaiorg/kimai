import { Module } from '@nestjs/common';
import { TaskService } from '@/domain/task/task.service';
import { TaskModule as TaskRepositoryModule } from '@/infrastructure/task/task.module';

@Module({
  imports: [TaskRepositoryModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
