import { Module } from '@nestjs/common';
import { RequestService } from '@/domain/request/request.service';
import { RequestModule as RequestRepositoryModule } from '@/infrastructure/request/request.module';
import { ProjectModule } from '@/infrastructure/project/project.module';
import { TimesheetHttpService } from '@/libs/http/timesheet-http.service';
import { HttpModule } from '@/libs/http/http.module';
import { RabbitmqModule } from '@/libs/rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [
    RequestRepositoryModule,
    ProjectModule,
    HttpModule,
    ConfigModule,
    RabbitmqModule.register({
      queue: 'notification',
    }),
    PrismaModule,
  ],
  providers: [RequestService, TimesheetHttpService],
  exports: [RequestService],
})
export class RequestModule {}
