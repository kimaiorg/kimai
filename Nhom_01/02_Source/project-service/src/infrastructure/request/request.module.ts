import { Module } from '@nestjs/common';
import { PrismaModule } from '@/libs/database/prisma.module';
import { RequestRepository } from './request.repository';
import { TaskRepository } from '@/infrastructure/task/task.repository';

@Module({
  imports: [PrismaModule],
  providers: [RequestRepository, TaskRepository],
  exports: [RequestRepository, TaskRepository],
})
export class RequestModule {}
