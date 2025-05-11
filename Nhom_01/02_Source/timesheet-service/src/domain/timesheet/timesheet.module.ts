import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetModule as TimesheetRepositoryModule } from '@/infrastructure/timesheet/timesheet.module';
import { RabbitmqModule } from '@/libs/rabbitmq/rabbitmq.module';
import { HttpModule } from '@/libs/http/http.module';
@Module({
  imports: [
    TimesheetRepositoryModule,
    HttpModule,
    RabbitmqModule.register({
      queue: 'notification',
    }),
  ],
  providers: [TimesheetService],
  exports: [TimesheetService],
})
export class TimesheetModule {}
