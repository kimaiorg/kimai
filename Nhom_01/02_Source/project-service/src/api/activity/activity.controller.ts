import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Activity } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { ActivityService } from '@/domain/activity/activity.service';
import {
  createActivitySchema,
  CreateActivityDto,
  updateActivitySchema,
  UpdateActivityDto,
  listActivitySchema,
  ListActivityDto,
} from '@/api/activity/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateActivitySwagger,
  UpdateActivitySwagger,
  ListActivitySwaggerDto,
} from '@/api/activity/swagger';
import { PaginationResponse } from '@/libs/response/pagination';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Post('')
  @ApiBody({ type: CreateActivitySwagger })
  @Permissions(['create:activities'])
  @UsePipes(new ZodValidationPipe(createActivitySchema))
  async createActivity(
    @Body() dto: CreateActivityDto,
  ): Promise<Activity | null> {
    return await this.activityService.createActivity(dto);
  }

  @Get(':id')
  @Permissions(['read:activities'])
  async getActivity(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Activity | null> {
    return await this.activityService.getActivity(id);
  }

  @Get('')
  @ApiQuery({ type: ListActivitySwaggerDto, required: false })
  @UsePipes(new ZodValidationPipe(listActivitySchema))
  @Permissions(['read:activities'])
  async listActivities(
    @Query() dto: ListActivityDto,
  ): Promise<PaginationResponse<Activity>> {
    return await this.activityService.listActivities(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateActivitySwagger, required: false })
  @Permissions(['update:activities'])
  @UsePipes(new ZodValidationPipe(updateActivitySchema))
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateActivityDto,
  ): Promise<Activity | null> {
    return await this.activityService.updateAcitivty(id, dto);
  }
}
