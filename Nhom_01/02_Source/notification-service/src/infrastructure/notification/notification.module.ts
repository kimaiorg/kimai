import { Module } from '@nestjs/common';
import { NotificationRepository } from '@/infrastructure/notification/notification.repository';
import { Notification2Repository } from '@/infrastructure/notification/notification2.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationRepository, Notification2Repository],
  exports: [NotificationRepository, Notification2Repository],
})
export class NotificationModule {}
