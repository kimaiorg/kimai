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
import { Timesheet } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { TimesheetService } from '@/domain/timesheet/timesheet.service';
import {
  startTimesheetSchema,
  StartTimesheetDto,
  endTimesheetSchema,
  EndTimesheetDto,
  listTimesheetSchema,
  ListTimesheetDto,
  ListTimesheetsMeDto,
  listTimesheetsMeSchema,
} from '@/api/timesheet/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { PaginationResponse } from '@/libs/response/pagination';
import {
  StartTimesheetSwagger,
  ListTimesheetsMeSwaggerDto,
} from '@/api/timesheet/swagger';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}
  @Post('start')
  @ApiBody({ type: StartTimesheetSwagger })
  @UsePipes(new ZodValidationPipe(startTimesheetSchema))
  async startTimesheet(
    @Req() req: Request,
    @Body() dto: StartTimesheetDto,
  ): Promise<Timesheet | null> {
    const userId = req['user'].sub;
    return await this.timesheetService.startTimesheet(userId, dto);
  }

  @Post('end')
  async endTimesheet(@Req() req: Request): Promise<Timesheet | null> {
    const userId = req['user'].sub;
    return await this.timesheetService.endTimesheet(userId);
  }

  @Get('')
  @Permissions(['read:timesheets'])
  @UsePipes(new ZodValidationPipe(listTimesheetSchema))
  async listTimesheets(
    @Query() dto: ListTimesheetDto,
  ): Promise<PaginationResponse<Timesheet>> {
    return await this.timesheetService.listTimesheets(dto);
  }

  @Get('me')
  @ApiQuery({type: ListTimesheetsMeSwaggerDto, required: false})
  @UsePipes(new ZodValidationPipe(listTimesheetsMeSchema))
  async listTimesheetsMe(
    @Req() req: Request,
    @Query() dto: ListTimesheetsMeDto,
  ): Promise<PaginationResponse<Timesheet>> {
    const userId = req['user'].sub;
    return await this.timesheetService.listTimesheetsMe(userId, dto);
  }
}
