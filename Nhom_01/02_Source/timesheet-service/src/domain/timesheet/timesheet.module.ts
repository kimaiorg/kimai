import { Module } from '@nestjs/common';
import { TimesheetService } from '@/domain/timesheet/timesheet.service';
import { TimesheetModule as TimesheetRepositoryModule } from '@/infrastructure/timesheet/timesheet.module';

@Module({
  imports: [TimesheetRepositoryModule],
  providers: [TimesheetService],
  exports: [TimesheetService],
})
export class TimesheetModule {}
