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
      isGlobal: true,
      useFactory: async () => {
        const cluster = createCluster([
          { host: '127.0.0.1', port: 7000 },
          { host: '127.0.0.1', port: 7001 },
          { host: '127.0.0.1', port: 7002 },
        ]);

        cluster.on('connect', () => console.log('Redis Cluster connected!'));
        cluster.on('error', (err) => console.error('Redis Cluster error', err));

        return {
          store: redisStore,
          cluster,
          ttl: 60, // seconds
        };
      },
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
