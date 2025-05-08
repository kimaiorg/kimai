import { Module } from '@nestjs/common';
import { NotificationController } from '@/api/notification/notification.controller';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [NotificationController],
})
export class ApiModule {}
