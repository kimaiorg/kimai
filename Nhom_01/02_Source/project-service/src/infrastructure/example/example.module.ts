import { Module } from '@nestjs/common';
import { ExampleRepository } from '@/infrastructure/example/example.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExampleRepository],
  exports: [ExampleRepository],
})
export class ExampleModule {}
