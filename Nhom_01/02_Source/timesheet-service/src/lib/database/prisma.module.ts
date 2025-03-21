import { Module } from '@nestjs/common';
import { PrismaClient } from '@/lib/database/prisma.service';

@Module({
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}
