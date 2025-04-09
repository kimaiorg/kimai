import { AppModule } from "@/app.module";
import { ENV } from "@/libs/configs/env";
import { HttpExceptionFilter } from "@/libs/filters/http-exception.filter";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix("api");

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ENV.app_version
  });

  const config = new DocumentBuilder().setTitle("KIMAI").setDescription("API Documentation").setVersion("1.0").build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  app.enableCors();
  await app.listen(ENV.app_port ?? 3000);
}
void bootstrap();
