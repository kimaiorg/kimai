import { Module } from '@nestjs/common';
import { TimesheetService } from './timesheet.service';
import { TimesheetModule as TimesheetRepositoryModule } from '@/infrastructure/timesheet/timesheet.module';
import { RabbitmqModule } from '@/libs/rabbitmq/rabbitmq.module';
import { HttpModule } from '@/libs/http/http.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ClientsModule } from '@nestjs/microservices';
@Module({
  imports: [
    TimesheetRepositoryModule,
    HttpModule,
    ClientsModule.register([
      {
        name: 'ACTIVITY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'proto',
          protoPath: join(__dirname, '../../proto/activity.proto'),
        },
      },
    ]),
    RabbitmqModule.register({
      queue: 'notification',
    }),
  ],
  providers: [TimesheetService],
  exports: [TimesheetService],
})
export class TimesheetModule {}
