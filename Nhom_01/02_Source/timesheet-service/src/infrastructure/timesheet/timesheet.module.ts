import { Module } from '@nestjs/common';
import { TimesheetRepository } from '@/infrastructure/timesheet/timesheet.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TimesheetRepository],
  exports: [TimesheetRepository],
})
export class TimesheetModule {}
