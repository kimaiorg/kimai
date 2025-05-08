import { Module } from '@nestjs/common';
import { NotificationService } from '@/domain/notification/notification.service';
import { NotificationModule as NotificationRepositoryModule } from '@/infrastructure/notification/notification.module';

@Module({
  imports: [NotificationRepositoryModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
