import { Module } from '@nestjs/common';
import { ExampleService } from '@/domain/example/example.service';
import { ExampleModule as ExampleRepositoryModule } from '@/infrastructure/example/example.module';

@Module({
  imports: [ExampleRepositoryModule],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
