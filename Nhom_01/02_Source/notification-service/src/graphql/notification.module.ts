import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [DomainModule],
  providers: [NotificationResolver],
  controllers: [],
})
export class NotificationModule {}
