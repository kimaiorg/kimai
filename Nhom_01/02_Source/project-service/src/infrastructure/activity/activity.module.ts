import { Module } from '@nestjs/common';
import { ActivityRepository } from '@/infrastructure/activity/activity.repository';
import { PrismaModule } from '@/libs/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ActivityRepository],
  exports: [ActivityRepository],
})
export class ActivityModule {}
