import { ReportService } from '../../domain/report/report.service';
import { WeeklyUserReportDto, WeeklyAllUsersReportDto, ProjectOverviewReportDto } from './dto';
import { WeeklyOneUserReportResponseType, WeeklyAllUsersReportResponseType, ProjectOverviewResponse } from '../../type_schema/report';
import { PaginationResponse } from '../../libs/response/pagination';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getWeeklyOneUserReport(dto: WeeklyUserReportDto, authHeader: string): Promise<WeeklyOneUserReportResponseType>;
    getWeeklyAllUsersReport(dto: WeeklyAllUsersReportDto, authHeader: string): Promise<PaginationResponse<WeeklyAllUsersReportResponseType>>;
    getProjectOverviewReport(dto: ProjectOverviewReportDto, authHeader: string): Promise<ProjectOverviewResponse>;
    getDashboardData(userId: string, authHeader: string): Promise<any>;
    getAllUsersDashboardData(authHeader: string): Promise<any>;
}
