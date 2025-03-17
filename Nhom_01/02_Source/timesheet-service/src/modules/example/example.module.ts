import { Module } from '@nestjs/common';
import { ExampleController } from '@/modules/example/example.controller';
import { ExampleService } from '@/modules/example/example.service';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
})
export class ExampleModule {}
