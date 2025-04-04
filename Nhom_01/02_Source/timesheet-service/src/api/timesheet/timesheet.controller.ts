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
} from '@/api/timesheet/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { PaginationResponse } from '@/libs/response/pagination';
import {
  StartTimesheetSwagger,
  EndTimesheetSwagger,
} from '@/api/timesheet/swagger';
import { ApiBody } from '@nestjs/swagger';

@Controller('timesheets')
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}
  @Post('start')
  @ApiBody({ type: StartTimesheetSwagger })
  @UsePipes(new ZodValidationPipe(startTimesheetSchema))
  async startTimesheet(
    @Body() dto: StartTimesheetDto,
  ): Promise<Timesheet | null> {
    return await this.timesheetService.startTimesheet(dto);
  }

  @Post('end')
  @ApiBody({ type: EndTimesheetSwagger })
  @UsePipes(new ZodValidationPipe(endTimesheetSchema))
  async endTimesheet(@Body() dto: EndTimesheetDto): Promise<Timesheet | null> {
    return await this.timesheetService.endTimesheet(dto);
  }

  @Get('')
  @Permissions(['read:timesheets'])
  @UsePipes(new ZodValidationPipe(listTimesheetSchema))
  async listTimesheet(
    @Query() dto: ListTimesheetDto,
  ): Promise<PaginationResponse<Timesheet>> {
    return await this.timesheetService.listTimesheets(dto);
  }
}
