import { TimesheetModule } from '@/infrastructure/timesheet/timesheet.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TimesheetModule],
  exports: [TimesheetModule],
})
export class InfrastructureModule {}
