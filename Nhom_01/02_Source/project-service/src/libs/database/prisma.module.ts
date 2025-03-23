import { Module } from '@nestjs/common';
import { PrismaClient } from '@/libs/database/prisma.service';

@Module({
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}
