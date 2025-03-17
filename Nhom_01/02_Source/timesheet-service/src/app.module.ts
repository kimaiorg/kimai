import { Module } from '@nestjs/common';
import { ExampleModule } from '@/modules/example/example.module';
import { ConfigModule } from '@/configs/config.module';

@Module({
  imports: [ExampleModule, ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
