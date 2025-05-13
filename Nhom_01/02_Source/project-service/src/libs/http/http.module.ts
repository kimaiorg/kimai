/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TimesheetHttpService } from './timesheet-http.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [TimesheetHttpService],
  exports: [TimesheetHttpService],
  imports: [
    ConfigModule,
    AxiosHttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class HttpModule {}
