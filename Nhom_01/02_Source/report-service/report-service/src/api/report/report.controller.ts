import { Controller, Get, Query, Headers, Param } from '@nestjs/common';
import { ReportService } from '../../domain/report/report.service';
import { WeeklyUserReportDto, WeeklyAllUsersReportDto, ProjectOverviewReportDto } from './dto';
import { WeeklyOneUserReportResponseType, WeeklyAllUsersReportResponseType, ProjectOverviewResponse } from '../../type_schema/report';
import { PaginationResponse } from '../../libs/response/pagination';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({ summary: 'Get weekly report for one user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns weekly report data for a specific user', 
    type: Object
  })
  @Get('one-user')
  async getWeeklyOneUserReport(
    @Query() dto: WeeklyUserReportDto,
    @Headers('authorization') authHeader: string,
  ): Promise<WeeklyOneUserReportResponseType> {
    return this.reportService.getWeeklyOneUserReport(dto.userId.toString(), dto.fromDate, dto.toDate, authHeader);
  }

  @ApiOperation({ summary: 'Get weekly report for all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns weekly report data for all users', 
    type: Object
  })
  @Get('all-users')
  async getWeeklyAllUsersReport(
    @Query() dto: WeeklyAllUsersReportDto,
    @Headers('authorization') authHeader: string,
  ): Promise<PaginationResponse<WeeklyAllUsersReportResponseType>> {
    return this.reportService.getWeeklyAllUsersReport(dto.fromDate, dto.toDate, authHeader);
  }

  @ApiOperation({ summary: 'Get project overview report' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns overview data for all projects or filtered by customer', 
    type: Object
  })
  @Get('projects/overview')
  async getProjectOverviewReport(
    @Query() dto: ProjectOverviewReportDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ProjectOverviewResponse> {
    return this.reportService.getProjectOverviewReport(dto.customerId, authHeader);
  }

  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns dashboard data including timesheet summary and chart data', 
    type: Object
  })
  @Get('dashboard/:userId')
  async getDashboardData(
    @Param('userId') userId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<any> {
    return this.reportService.getDashboardData(userId, authHeader);
  }
  
  @ApiOperation({ summary: 'Get dashboard data for all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns dashboard data for all users', 
    type: Object
  })
  @Get('dashboard')
  async getAllUsersDashboardData(
    @Headers('authorization') authHeader: string,
  ): Promise<any> {
    return this.reportService.getDashboardData(undefined, authHeader);
  }
}
