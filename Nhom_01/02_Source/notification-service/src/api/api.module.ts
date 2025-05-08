import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { NotificationController } from '@/api/notification/notification.controller';
import { DomainModule } from '@/domain/domain.module';
import { AuthMiddleware } from '@/libs/middlewares/auth.middleware';

@Module({
  imports: [DomainModule],
  controllers: [NotificationController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'notifications',
        method: RequestMethod.POST,
        version: '1',
      })
      .forRoutes('*');
  }
}
