import { TimesheetModule } from '@/domain/timesheet/timesheet.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TimesheetModule],
  exports: [TimesheetModule],
})
export class DomainModule {}
