import { NotificationModule } from '@/infrastructure/notification/notification.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [NotificationModule],
  exports: [NotificationModule],
})
export class InfrastructureModule {}
