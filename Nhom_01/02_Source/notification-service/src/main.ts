import { AppModule } from '@/app.module';
import { ENV } from '@/libs/configs/env';
import { HttpExceptionFilter } from '@/libs/filters/http-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ENV.app_version,
  });

  const config = new DocumentBuilder()
    .setTitle('KIMAI')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api/docs', app as any, document);
  app.enableCors();
  await app.listen(ENV.app_port ?? 3000);

  const workerApp = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: {
      origin: '*',
    },
  });

  // Configure and start microservices
  const queues = ['notification'];
  for (const queue of queues) {
    workerApp.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`${ENV.rabbitmq.url}`],
        queue: queue,
        noAck: false,
        prefetchCount: 1,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  await workerApp.startAllMicroservices();
}
void bootstrap();
