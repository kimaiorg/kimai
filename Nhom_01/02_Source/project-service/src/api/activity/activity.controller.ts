import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Activity } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { ActivityService } from '@/domain/activity/activity.service';
import {
  createActivitySchema,
  CreateActivityDto,
} from '@/api/activity/dto/create-activity.dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody } from '@nestjs/swagger';
import { CreateTeamSwagger } from '@/api/team/swagger';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Post('')
  // @ApiBody({ type: CreateTeamSwagger })
  @Permissions(['create:teams'])
  @UsePipes(new ZodValidationPipe(createActivitySchema))
  async createActivity(
    @Body() dto: CreateActivityDto,
  ): Promise<Activity | null> {
    return await this.activityService.createActivity(dto);
  }

  @Get(':id')
  @Permissions(['read:teams'])
  async getActivity(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Activity | null> {
    return await this.activityService.getActivity(id);
  }

  @Get('')
  @Permissions(['read:teams'])
  async listTeams(): Promise<Activity[] | null> {
    return await this.activityService.listActivities();
  }
}
