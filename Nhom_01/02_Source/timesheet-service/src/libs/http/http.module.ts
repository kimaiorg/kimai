import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProjectHttpService } from './project-http.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ProjectHttpService],
  exports: [ProjectHttpService],
  imports: [
    ConfigModule,
    AxiosHttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class HttpModule {}
