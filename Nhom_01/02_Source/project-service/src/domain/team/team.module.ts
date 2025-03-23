import { Module } from '@nestjs/common';
import { TeamService } from '@/domain/team/team.service';
import { TeamModule as TeamRepositoryModule } from '@/infrastructure/team/team.module';

@Module({
  imports: [TeamRepositoryModule],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
