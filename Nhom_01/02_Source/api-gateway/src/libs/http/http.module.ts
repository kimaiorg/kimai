import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpService } from './base-http.service';

@Module({
  providers: [HttpService],
  exports: [HttpService],
  imports: [
    AxiosHttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
})
export class HttpModule {}
