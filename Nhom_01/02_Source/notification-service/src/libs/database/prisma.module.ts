import { Module } from '@nestjs/common';
import { PrismaClient } from '@/libs/database/prisma.service';
import { Prisma2Client } from '@/libs/database/prisma2.service';

@Module({
  providers: [PrismaClient, Prisma2Client],
  exports: [PrismaClient, Prisma2Client],
})
export class PrismaModule {}
