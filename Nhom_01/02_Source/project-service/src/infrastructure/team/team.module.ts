import { Module } from '@nestjs/common';
import { TeamRepository } from '@/infrastructure/team/team.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TeamRepository],
  exports: [TeamRepository],
})
export class TeamModule {}
