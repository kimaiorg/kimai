import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@/libs/configs/config.module';
import { PrismaModule } from '@/libs/database/prisma.module';
import { ApiModule } from '@/api/api.module';
import { DomainModule } from '@/domain/domain.module';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { AuthMiddleware } from '@/libs/middlewares';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { PermissionsGuard } from '@/libs/guards/permission.guard';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';

@Module({
  imports: [
    InfrastructureModule,
    ConfigModule,
    PrismaModule,
    ApiModule,
    DomainModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
