import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule],
  providers: [AppService],
})
export class AppModule {}
