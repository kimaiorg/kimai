import { Module } from '@nestjs/common';
import { ExampleController } from '@/api/example/example.controller';
import { ExampleModule } from '@/domain/example/example.module';

@Module({
  imports: [ExampleModule],
  controllers: [ExampleController],
})
export class ApiModule {}
