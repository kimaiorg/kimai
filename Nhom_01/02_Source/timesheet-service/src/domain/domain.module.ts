import { TimesheetModule } from '@/domain/timesheet/timesheet.module';
import { HttpModule } from '@/libs/http/http.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [TimesheetModule, HttpModule],
  exports: [TimesheetModule],
})
export class DomainModule {}
