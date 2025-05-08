import { NotificationModule } from '@/domain/notification/notification.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [NotificationModule],
  exports: [NotificationModule],
})
export class DomainModule {}
