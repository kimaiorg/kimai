import { Module } from '@nestjs/common';
import { NotificationRepository } from '@/infrastructure/notification/notification.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationModule {}
