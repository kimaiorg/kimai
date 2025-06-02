import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Set global prefix
  app.setGlobalPrefix('api/v1');
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Report Service API')
    .setDescription('API for generating various reports including weekly user reports, all users reports, and project overview reports')
    .setVersion('1.0')
    .addTag('reports')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = configService.get<number>('PORT') || 3337;
  await app.listen(port);
  console.log(`Report service is running on port ${port}`);
  console.log(`Swagger documentation is available at http://localhost:${port}/api/docs`);
}

bootstrap();
