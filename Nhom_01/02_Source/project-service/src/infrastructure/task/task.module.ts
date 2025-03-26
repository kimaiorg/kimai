import { Module } from '@nestjs/common';
import { TaskRepository } from '@/infrastructure/task/task.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TaskRepository],
  exports: [TaskRepository],
})
export class TaskModule {}
