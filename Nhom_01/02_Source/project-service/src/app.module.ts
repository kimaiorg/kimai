import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@/libs/configs/config.module';
import { PrismaModule } from '@/libs/database/prisma.module';
import { ApiModule } from '@/api/api.module';
import { DomainModule } from '@/domain/domain.module';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { AuthMiddleware } from '@/libs/middlewares';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from '@/libs/guards/permission.guard';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    InfrastructureModule,
    ConfigModule,
    PrismaModule,
    ApiModule,
    DomainModule,
   CacheModule.registerAsync({
  useFactory: () => ({
    store: redisStore,
    clusterConfig: {
      nodes: [
        { host: 'redis-node1', port: 6379 },
        { host: 'redis-node2', port: 6379 },
      ],
      redisOptions: {
        scaleReads: 'all', // load balancing reads
      },
    },
  }),
  isGlobal: true,
}),
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
