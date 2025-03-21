import { ExampleModule } from '@/domain/example/example.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ExampleModule],
  exports: [ExampleModule],
})
export class DomainModule {}
