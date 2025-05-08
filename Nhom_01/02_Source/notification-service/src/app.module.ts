import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthMiddleware } from './libs/middlewares/auth.middleware';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'api/notifications',
        method: RequestMethod.POST,
        version: '1',
      })
      .forRoutes('*');
  }
}
