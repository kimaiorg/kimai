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
import {
  createNotificationSchema,
  CreateNotificationDto,
} from '@/api/notification/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { NotificationService } from '@/domain/notification/notification.service';
import { Notification } from '@prisma/client';
import { PaginationResponse } from '@/libs/response/pagination';
import {
  ListNotificationsDto,
  listNotificationsSchema,
} from './dto/list-notifications.dto';
import {
  ListNotificationsSwaggerDto,
  CreateNotificationSwaggerDto,
  UpdateNotificationSwaggerDto,
} from './swagger';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  UpdateNotificationDto,
  updateNotificationSchema,
} from './dto/update-notification.dto copy';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('')
  @UsePipes(new ZodValidationPipe(createNotificationSchema))
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationSwaggerDto })
  async createNotification(
    @Body() dto: CreateNotificationDto,
  ): Promise<Notification | null> {
    return await this.notificationService.createNotification(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiBody({ type: UpdateNotificationSwaggerDto })
  async updateNotification(
    @Body(new ZodValidationPipe(updateNotificationSchema))
    dto: UpdateNotificationDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<Notification | null> {
    const userId = req['user'].sub as string;
    return await this.notificationService.updateNotification(id, dto, userId);
  }

  @Get('')
  @UsePipes(new ZodValidationPipe(listNotificationsSchema))
  @ApiOperation({ summary: 'List notifications' })
  @ApiQuery({ type: ListNotificationsSwaggerDto })
  async listNotifications(
    @Req() req: Request,
    @Query() dto: ListNotificationsDto,
  ): Promise<PaginationResponse<Notification>> {
    const userId = req['user'].sub as string;
    return await this.notificationService.listNotifications(userId, dto);
  }
}
