import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { 
  WeeklyOneUserReportResponseType, 
  WeeklyAllUsersReportResponseType, 
  ProjectOverviewResponse,
  WeeklyReportEntry,
  ProjectReportData,
  CustomerReportData,
  UserReportData
} from '../../type_schema/report';
import { PaginationResponse } from '../../libs/response/pagination';
import { TaskResponseType, TaskStatus } from '../../type_schema/task';
import { UserType } from '../../type_schema/user';

@Injectable()
export class ReportService {
  private readonly timesheetServiceUrl: string;
  private readonly projectServiceUrl: string;
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const env = this.configService.get<string>('NODE_ENV') || 'development';
    console.log(`[REPORT_SERVICE] Current environment: ${env}`);

    // Initialize service URLs from environment variables with fallbacks
    this.timesheetServiceUrl = this.configService.get<string>('TIMESHEET_SERVICE_URL') || 'http://localhost:3334';
    this.projectServiceUrl = this.configService.get<string>('PROJECT_SERVICE_URL') || 'http://localhost:3333';

    // Log the service URLs for debugging
    this.logger.log(`REPORT SERVICE INITIALIZED WITH:`);
    this.logger.log(`- Timesheet Service URL: ${this.timesheetServiceUrl}`);
    this.logger.log(`- Project Service URL: ${this.projectServiceUrl}`);
    this.logger.log(`- Environment variables: TIMESHEET_SERVICE_URL=${this.configService.get<string>('TIMESHEET_SERVICE_URL')}, PROJECT_SERVICE_URL=${this.configService.get<string>('PROJECT_SERVICE_URL')}`);

    // Define default URLs for different environments
    const defaultUrls = {
      production: {
        timesheet: 'https://timesheet-service.onrender.com',
        project: 'https://project-service-6067.onrender.com'
      },
      development: {
        timesheet: 'http://localhost:3334',
        project: 'http://localhost:3333'
      }
    };

    console.log(`[REPORT_SERVICE] Default URLs for ${env}:`, JSON.stringify(defaultUrls[env]));

    // First check for generic service URLs that override environment-specific ones
    const timesheetUrl = this.configService.get<string>('TIMESHEET_SERVICE_URL');
    const projectUrl = this.configService.get<string>('PROJECT_SERVICE_URL');

    console.log(`[REPORT_SERVICE] Environment variables:`);
    console.log(`  - TIMESHEET_SERVICE_URL: ${timesheetUrl || 'not set'}`);
    console.log(`  - PROJECT_SERVICE_URL: ${projectUrl || 'not set'}`);
    console.log(`  - TIMESHEET_SERVICE_URL_${env.toUpperCase()}: ${this.configService.get<string>(`TIMESHEET_SERVICE_URL_${env.toUpperCase()}`) || 'not set'}`);
    console.log(`  - PROJECT_SERVICE_URL_${env.toUpperCase()}: ${this.configService.get<string>(`PROJECT_SERVICE_URL_${env.toUpperCase()}`) || 'not set'}`);

    // Use environment variables if available, otherwise use defaults
    this.timesheetServiceUrl = timesheetUrl || 
                              this.configService.get<string>(`TIMESHEET_SERVICE_URL_${env.toUpperCase()}`) || 
                              defaultUrls[env].timesheet;
    
    this.projectServiceUrl = projectUrl || 
                            this.configService.get<string>(`PROJECT_SERVICE_URL_${env.toUpperCase()}`) || 
                            defaultUrls[env].project;

    // Verify URLs are set
    if (!this.timesheetServiceUrl) {
      console.error(`[REPORT_SERVICE] WARNING: Timesheet service URL is not set!`);
    }

    if (!this.projectServiceUrl) {
      console.error(`[REPORT_SERVICE] WARNING: Project service URL is not set!`);
    }

    console.log(`[${env}] Using Timesheet Service URL: ${this.timesheetServiceUrl}`);
    console.log(`[${env}] Using Project Service URL: ${this.projectServiceUrl}`);
  }

  /**
   * Get weekly report for one user
   */
  async getWeeklyOneUserReport(
    userId: string,
    fromDate: string,
    toDate: string,
    authHeader?: string,
  ): Promise<WeeklyOneUserReportResponseType> {
    try {
      this.logger.log(`Fetching weekly report for user ${userId} from ${fromDate} to ${toDate}`);
      
      // Skip fetching user info from customer endpoint for Auth0 IDs
      // Auth0 IDs are in format "auth0|..." and don't need to be looked up in the customer service
      let user: UserType;
      if (userId.startsWith('auth0|')) {
        // Create a basic user object with the Auth0 ID
        user = {
          user_id: userId,
          name: `User ${userId.substring(0, 10)}...`, // Truncate for display
          email: `user-${userId.split('|')[1].substring(0, 6)}@example.com`, // Generate a placeholder email
        };
        this.logger.log(`Using Auth0 ID directly: ${userId}`);
      } else {
        // Only fetch user info if it's not an Auth0 ID (e.g., it's a numeric customer ID)
        user = await this.getUserInfo(userId, authHeader);
      }
      
      // 2. Get timesheet entries for the user within the date range
      const timesheetEntries = await this.getTimesheetEntries(userId, fromDate, toDate, authHeader);
      
      // 3. Get tasks information for the timesheet entries
      const taskIds = [...new Set(timesheetEntries.map(entry => entry.task_id).filter(id => id !== null && id !== undefined))];
      const tasks = await this.getTasksInfo(taskIds as number[], authHeader);
      
      // 4. Process the data to create the weekly report
      const entries = this.processWeeklyUserReportEntries(timesheetEntries, tasks, fromDate, toDate);
      
      // 5. Create and return the response
      return {
        user_id: userId,
        fromDate,
        toDate,
        entries,
      };
    } catch (error) {
      this.logger.error(`Error fetching weekly report for user ${userId}:`, error);
      // For now, return mock data in case of error
      return this.generateMockWeeklyUserReport(userId, fromDate, toDate);
    }
  }

  /**
   * Get weekly report for all users
   */
  async getWeeklyAllUsersReport(
    fromDate: string,
    toDate: string,
    authHeader?: string,
  ): Promise<PaginationResponse<WeeklyAllUsersReportResponseType>> {
    try {
      this.logger.log(`Fetching weekly report for all users from ${fromDate} to ${toDate}`);
      
      // 1. Get all users from project service
      this.logger.log('Step 1: Getting all users from project service');
      const users = await this.getAllUsers(authHeader);
      this.logger.log(`Retrieved ${users.length} users from project service`);
      
      // 2. Get timesheet entries for all users within the date range
      this.logger.log(`Step 2: Getting timesheet entries for all users from ${fromDate} to ${toDate}`);
      const timesheetEntries = await this.getAllTimesheetEntries(fromDate, toDate, authHeader);
      this.logger.log(`Retrieved ${timesheetEntries.length} timesheet entries`);
      
      // Kiểm tra nếu không có bản ghi nào
      if (!timesheetEntries || timesheetEntries.length === 0) {
        this.logger.warn(`No timesheet entries found for the date range ${fromDate} to ${toDate}`);
        return {
          metadata: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          },
          data: [],
        };
      }
      
      // 3. Get tasks information for the timesheet entries
      this.logger.log('Step 3: Extracting unique task IDs from timesheet entries');
      const taskIds = [...new Set(timesheetEntries
        .map(entry => entry.task_id)
        .filter(id => id !== null && id !== undefined))];
      
      this.logger.log(`Found ${taskIds.length} unique task IDs: ${taskIds.join(', ')}`);
      
      if (taskIds.length === 0) {
        this.logger.warn('No valid task IDs found in timesheet entries');
      }
      
      this.logger.log('Getting task information from project service');
      const tasks = await this.getTasksInfo(taskIds as number[], authHeader);
      this.logger.log(`Retrieved information for ${tasks.length} tasks`);
      
      // 4. Process the data to create the weekly report for each user
      this.logger.log('Step 4: Processing data to create weekly reports');
      
      // Group timesheet entries by user
      this.logger.log('Grouping timesheet entries by user');
      const entriesByUser = this.groupTimesheetEntriesByUser(timesheetEntries);
      const userIds = Object.keys(entriesByUser);
      this.logger.log(`Timesheet entries grouped for ${userIds.length} users`);
      
      // Tạo một báo cáo duy nhất chứa tất cả người dùng
      // Mỗi người dùng sẽ có một mục trong mảng data
      const allUsersReport: WeeklyAllUsersReportResponseType[] = [];
      
      // Xử lý từng người dùng
      for (const userId in entriesByUser) {
        const userEntries = entriesByUser[userId];
        this.logger.log(`Processing ${userEntries.length} entries for user ${userId}`);
        
        // Tìm thông tin người dùng
        const user = users.find(u => u.user_id === userId);
        if (!user) {
          this.logger.warn(`User with ID ${userId} not found in users list`);
          continue;
        }
        
        // Xử lý các mục báo cáo cho người dùng này
        const reportEntries = this.processWeeklyAllUsersReportEntries(userEntries, tasks, users, fromDate, toDate);
        this.logger.log(`Generated ${reportEntries.length} report entries for user ${userId}`);
        
        // Thêm báo cáo của người dùng này vào danh sách
        allUsersReport.push({
          fromDate,
          toDate,
          entries: reportEntries,
        });
      }
      
      // 5. Create and return the paginated response
      this.logger.log(`Step 5: Creating paginated response with ${allUsersReport.length} user reports`);
      return {
        metadata: {
          total: allUsersReport.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(allUsersReport.length / 10),
        },
        data: allUsersReport,
      };
    } catch (error) {
      this.logger.error(`Error fetching weekly report for all users:`, error);
      
      // Log thông tin chi tiết về lỗi
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        this.logger.error('No response received from server');
      } else {
        this.logger.error(`Error message: ${error.message}`);
      }
      
      // For now, return mock data in case of error
      return {
        metadata: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        data: [this.generateMockWeeklyAllUsersReport(fromDate, toDate)],
      };
    }
  }

  /**
   * Get project overview report
   */
  async getProjectOverviewReport(
    customerId?: number,
    authHeader?: string,
  ): Promise<ProjectOverviewResponse> {
    try {
      this.logger.log(`Fetching project overview report${customerId ? ` for customer ${customerId}` : ''}`);
      
      // 1. Get projects from project service
      const projects = await this.getProjects(customerId, authHeader);
      
      // 2. Get customers from project service
      const customers = await this.getCustomers(authHeader);
      
      // 3. Get timesheet data for each project
      const projectIds = projects.map(project => project.id);
      const projectTimesheets = await this.getTimesheetsByProjects(projectIds, authHeader);
      
      // 4. Process the data to create the project report
      const projectReportData: ProjectReportData[] = projects.map(project => {
        const projectTimesheet = projectTimesheets.filter(timesheet => timesheet.project_id === project.id);
        
        // Calculate project metrics
        const timeSpent = this.calculateTotalDuration(projectTimesheet);
        const lastEntry = this.getLastEntryDate(projectTimesheet);
        const thisMonth = this.calculateCurrentMonthDuration(projectTimesheet);
        const notExported = this.calculateNotExportedDuration(projectTimesheet);
        const notBilled = this.calculateNotBilledDuration(projectTimesheet);
        
        // Find customer for this project
        const customer = customers.find(c => c.id === project.customer_id);
        
        return {
          id: project.id,
          customer_id: project.customer_id,
          customer_name: customer ? customer.name : 'Unknown Customer',
          name: project.name,
          hourly_quota: project.hourly_quota || 0,
          budget: project.budget || 0,
          spent: 0, // This would need to be calculated from invoice data
          time_spent: timeSpent,
          last_entry: lastEntry,
          this_month: thisMonth,
          total: timeSpent,
          not_exported: notExported,
          not_billed: notBilled,
          budget_used_percentage: project.budget ? (timeSpent / project.budget) * 100 : 0,
          color: project.color || '#000000',
        };
      });
      
      // 5. Create customer report data
      const customerReportData: CustomerReportData[] = customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        address: customer.address,
        contact: customer.contact,
      }));
      
      // 6. Create and return the response
      return {
        projects: projectReportData,
        customers: customerReportData,
      };
    } catch (error) {
      this.logger.error(`Error fetching project overview report:`, error);
      // For now, return mock data in case of error
      return this.generateMockProjectOverviewReport();
    }
  }

  /**
   * Helper method to get user information from project service
   */
  private async getUserInfo(userId: string, authHeader?: string): Promise<UserType> {
    try {
      // Check if project service URL is set
      if (!this.projectServiceUrl) {
        throw new Error(`Project service URL is not configured. Please check environment variables.`);
      }
      
      const url = `${this.projectServiceUrl}/api/v1/customers/${userId}`;
      const headers = this.getHeaders(authHeader);
      
      this.logger.log(`Fetching user info from: ${url}`);
      
      const response = await firstValueFrom(
        this.httpService.get(url, { 
          headers,
          timeout: 10000 // Increased timeout to 10 seconds
        })
      );
      
      if (!response.data) {
        throw new Error(`API returned empty response for user ID ${userId}`);
      }
      
      return response.data;
    } catch (error: any) {
      let errorMessage = `Error fetching user info for ID ${userId}: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return a default user object in case of error
      return {
        user_id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
      };
    }
  }

  /**
   * Helper method to get all users from project service
   * 
   * Trong thực tế, chúng ta không có endpoint riêng cho users, nên chúng ta sẽ
   * trích xuất thông tin user từ timesheet entries để tạo danh sách user
   */
  private async getAllUsers(authHeader?: string): Promise<UserType[]> {
    try {
      // Lấy tất cả timesheet entries để trích xuất user_id
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 90); // Lấy dữ liệu 90 ngày trở lại
      
      const toDate = new Date();
      
      // Lấy timesheet entries
      const timesheetEntries = await this.getAllTimesheetEntries(
        fromDate.toISOString().split('T')[0],
        toDate.toISOString().split('T')[0],
        authHeader
      );
      
      // Tạo danh sách user từ timesheet entries
      const userMap = {};
      
      timesheetEntries.forEach(entry => {
        const userId = String(entry.user_id);
        if (userId && !userMap[userId]) {
          userMap[userId] = {
            user_id: userId,
            name: `User ${Object.keys(userMap).length + 1}`,
            email: `${userId.replace(/[^a-zA-Z0-9]/g, '')}@example.com`
          };
        }
      });
      
      const users = Object.values(userMap) as UserType[];
      this.logger.log(`Created ${users.length} users from timesheet entries`);
      
      // Log một số user ID để debug
      if (users.length > 0) {
        const sampleUsers = users.slice(0, Math.min(3, users.length));
        this.logger.log(`Sample user IDs: ${sampleUsers.map(u => u.user_id).join(', ')}`);
      }
      
      return users;
    } catch (error: any) {
      let errorMessage = `Error creating users from timesheet entries: `;
      errorMessage += error.message || 'Unknown error';
      
      this.logger.error(errorMessage);
      
      // Return a default user list in case of error with Auth0 format IDs
      // Đảm bảo ID khớp với ID trong timesheet entries
      return [
        {
          user_id: 'auth0|67d99257463a53ee93784bb3',
          name: 'Default User',
          email: 'default@example.com',
        }
      ];
    }
  }

  /**
   * Helper method to get timesheet entries for a user
   */
  private async getTimesheetEntries(
    userId: string,
    fromDate: string,
    toDate: string,
    authHeader?: string,
  ): Promise<WeeklyReportEntry[]> {
    try {
      // Check if timesheet service URL is set
      if (!this.timesheetServiceUrl) {
        throw new Error(`Timesheet service URL is not configured. Please check environment variables.`);
      }
      
      // Sử dụng endpoint /api/v1/timesheets với phương thức GET và các tham số query đúng
      const url = `${this.timesheetServiceUrl}/api/v1/timesheets`;
      const params = new URLSearchParams();
      
      // Format dates to YYYY-MM-DD format without time component
      const formattedFromDate = new Date(fromDate).toISOString().split('T')[0];
      const formattedToDate = new Date(toDate).toISOString().split('T')[0];
      
      params.append('from_date', formattedFromDate);
      params.append('to_date', formattedToDate);
      // Fix the double encoding issue - don't use encodeURIComponent here
      // The URLSearchParams will handle the encoding correctly
      params.append('user_id', userId); // Changed from 'userId' to 'user_id' to match timesheet service API
      
      const headers = this.getHeaders(authHeader);
      
      const fullUrl = `${url}?${params.toString()}`;
      this.logger.log(`EXACT API CALL: ${fullUrl}`);
      this.logger.log(`Fetching timesheet entries from: ${url}?${params.toString()} for user ${userId}`);
      this.logger.log(`Original date range: from ${fromDate} to ${toDate}`);
      this.logger.log(`Formatted date range: from ${formattedFromDate} to ${formattedToDate}`);
      
      try {
        const response = await firstValueFrom(
          this.httpService.get(fullUrl, { 
            headers,
            timeout: 10000 // Increased timeout to 10 seconds
          })
        );
        
        // Log the raw response for debugging
        this.logger.log(`Raw API response: ${JSON.stringify(response.data)}`);
        
        // Kiểm tra phản hồi
        if (!response.data) {
          throw new Error(`API returned empty response for timesheet entries`);
        }
        
        // Xử lý cấu trúc phản hồi từ timesheet-service API
        // Theo bộ nhớ, API trả về dữ liệu trong cấu trúc { data: [...], metadata: {...} }
        let timesheetEntries: WeeklyReportEntry[] = [];
        
        if (response.data.data && Array.isArray(response.data.data)) {
          // Cấu trúc chuẩn: { data: [...], metadata: {...} }
          timesheetEntries = response.data.data;
          this.logger.log(`Received ${timesheetEntries.length} timesheet entries for user ${userId} (paginated structure)`);
        } else if (Array.isArray(response.data)) {
          // Trường hợp API trả về mảng trực tiếp
          timesheetEntries = response.data;
          this.logger.log(`Received ${timesheetEntries.length} timesheet entries for user ${userId} (direct array)`);
        } else if (typeof response.data === 'object' && !Array.isArray(response.data) && !response.data.data) {
          // Trường hợp API trả về đối tượng đơn lẻ
          timesheetEntries = [response.data];
          this.logger.log(`Received single timesheet entry for user ${userId} (object)`);
        } else {
          throw new Error(`API returned unexpected structure for timesheet entries: ${JSON.stringify(response.data)}`);
        }
        
        // Thêm thông tin debug về dữ liệu nhận được
        if (timesheetEntries.length > 0) {
          this.logger.log(`Sample timesheet entry: ${JSON.stringify(timesheetEntries[0])}`);
        } else {
          this.logger.warn(`No timesheet entries found for user ${userId} in date range ${fromDate} to ${toDate}`);
        }
        
        return timesheetEntries;
      } catch (error) {
        let errorMessage = `Error fetching timesheet entries for user ${userId}: `;
        
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          errorMessage += `Server responded with status ${error.response.status}. `;
          if (error.response.data) {
            errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
        } else {
          // Something happened in setting up the request
          errorMessage += error.message || 'Unknown error';
        }
        
        this.logger.error(errorMessage);
        
        // Return empty array in case of error
        return [];
      }
    } catch (error) {
      let errorMessage = `Error fetching timesheet entries for user ${userId}: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Helper method to get all timesheet entries
   */
  private async getAllTimesheetEntries(
    fromDate: string,
    toDate: string,
    authHeader?: string,
  ): Promise<WeeklyReportEntry[]> {
    try {
      // Check if timesheet service URL is set
      if (!this.timesheetServiceUrl) {
        throw new Error(`Timesheet service URL is not configured. Please check environment variables.`);
      }
      
      const url = `${this.timesheetServiceUrl}/api/v1/timesheets`;
      const params = new URLSearchParams();
      params.append('from_date', fromDate);
      params.append('to_date', toDate);
      
      const headers = this.getHeaders(authHeader);
      
      const fullUrl = `${url}?${params.toString()}`;
      this.logger.log(`EXACT API CALL: ${fullUrl}`);
      this.logger.log(`Fetching all timesheet entries from: ${url}?${params.toString()}`);
      
      try {
        const response = await firstValueFrom(
          this.httpService.get(fullUrl, { 
            headers,
            timeout: 10000 // Increased timeout to 10 seconds
          })
        );
        
        // Log the raw response for debugging
        this.logger.log(`Raw API response: ${JSON.stringify(response.data)}`);
        
        // Kiểm tra phản hồi
        if (!response.data) {
          throw new Error(`API returned empty response for all timesheet entries`);
        }
        
        // Xử lý cấu trúc phản hồi từ timesheet-service API
        // Theo bộ nhớ, API trả về dữ liệu trong cấu trúc { data: [...], metadata: {...} }
        let timesheetEntries: WeeklyReportEntry[] = [];
        
        if (response.data.data && Array.isArray(response.data.data)) {
          // Cấu trúc chuẩn: { data: [...], metadata: {...} }
          timesheetEntries = response.data.data;
          this.logger.log(`Received ${timesheetEntries.length} timesheet entries (paginated structure)`);
        } else if (Array.isArray(response.data)) {
          // Trường hợp API trả về mảng trực tiếp
          timesheetEntries = response.data;
          this.logger.log(`Received ${timesheetEntries.length} timesheet entries (direct array)`);
        } else if (typeof response.data === 'object' && !Array.isArray(response.data) && !response.data.data) {
          // Trường hợp API trả về đối tượng đơn lẻ
          timesheetEntries = [response.data];
          this.logger.log(`Received single timesheet entry (object)`);
        } else {
          throw new Error(`API returned unexpected structure for all timesheet entries: ${JSON.stringify(response.data)}`);
        }
        
        // Thêm thông tin debug về dữ liệu nhận được
        if (timesheetEntries.length > 0) {
          this.logger.log(`Sample timesheet entry: ${JSON.stringify(timesheetEntries[0])}`);
          this.logger.log(`Total timesheet entries received: ${timesheetEntries.length}`);
        } else {
          this.logger.warn(`No timesheet entries found for the date range ${fromDate} to ${toDate}`);
        }
        
        return timesheetEntries;
      } catch (error) {
        let errorMessage = `Error fetching all timesheet entries: `;
        
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          errorMessage += `Server responded with status ${error.response.status}. `;
          if (error.response.data) {
            errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
        } else {
          // Something happened in setting up the request
          errorMessage += error.message || 'Unknown error';
        }
        
        this.logger.error(errorMessage);
        
        // Return empty array in case of error
        return [];
      }
    } catch (error) {
      let errorMessage = `Error fetching all timesheet entries: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Helper method to get task information
   */
  private async getTasksInfo(taskIds: number[], authHeader?: string): Promise<TaskResponseType[]> {
    try {
      // Check if project service URL is set
      if (!this.projectServiceUrl) {
        throw new Error(`Project service URL is not configured. Please check environment variables.`);
      }
      
      const tasks: TaskResponseType[] = [];
      
      // Lấy thông tin từng task riêng biệt
      for (const taskId of taskIds) {
        try {
          const url = `${this.projectServiceUrl}/api/v1/tasks/${taskId}`;
          const headers = this.getHeaders(authHeader);
          
          const fullUrl = `${url}`;
          this.logger.log(`EXACT API CALL: ${fullUrl}`);
          this.logger.log(`Fetching task info from: ${url}`);
          
          const response = await firstValueFrom(
            this.httpService.get(fullUrl, { 
              headers,
              timeout: 5000 // 5 seconds timeout
            })
          );
          
          // Log the raw response for debugging
          this.logger.log(`Raw API response: ${JSON.stringify(response.data)}`);
          
          if (response.data) {
            tasks.push(response.data);
          }
        } catch (taskError) {
          this.logger.warn(`Error fetching task ${taskId}: ${taskError.message}`);
          // Tiếp tục với task tiếp theo
        }
      }
      
      this.logger.log(`Successfully fetched ${tasks.length} out of ${taskIds.length} tasks`);
      return tasks;
    } catch (error: any) {
      let errorMessage = `Error fetching tasks info: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Helper method to get projects
   */
  private async getProjects(customerId?: number, authHeader?: string): Promise<any[]> {
    try {
      const url = `${this.projectServiceUrl}/api/v1/projects`;
      const params = new URLSearchParams();
      if (customerId) {
        params.append('customerId', customerId.toString());
      }
      
      const headers = this.getHeaders(authHeader);
      
      const fullUrl = `${url}?${params.toString()}`;
      this.logger.log(`EXACT API CALL: ${fullUrl}`);
      this.logger.log(`Fetching projects from: ${url}?${params.toString()}`);
      
      try {
        const response = await firstValueFrom(
          this.httpService.get(fullUrl, { headers })
        );
        
        // Log the raw response for debugging
        this.logger.log(`Raw API response: ${JSON.stringify(response.data)}`);
        
        return response.data;
      } catch (error) {
        let errorMessage = `Error fetching projects: `;
        
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          errorMessage += `Server responded with status ${error.response.status}. `;
          if (error.response.data) {
            errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
        } else {
          // Something happened in setting up the request
          errorMessage += error.message || 'Unknown error';
        }
        
        this.logger.error(errorMessage);
        
        // Return empty array in case of error
        return [];
      }
    } catch (error) {
      let errorMessage = `Error fetching projects: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Helper method to get customers
   */
  private async getCustomers(authHeader?: string): Promise<any[]> {
    try {
      const url = `${this.projectServiceUrl}/api/v1/customers`;
      const headers = this.getHeaders(authHeader);
      
      const fullUrl = `${url}`;
      this.logger.log(`EXACT API CALL: ${fullUrl}`);
      this.logger.log(`Fetching customers from: ${url}`);
      
      try {
        const response = await firstValueFrom(
          this.httpService.get(fullUrl, { headers })
        );
        
        // Log the raw response for debugging
        this.logger.log(`Raw API response: ${JSON.stringify(response.data)}`);
        
        return response.data;
      } catch (error) {
        let errorMessage = `Error fetching customers: `;
        
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          errorMessage += `Server responded with status ${error.response.status}. `;
          if (error.response.data) {
            errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
        } else {
          // Something happened in setting up the request
          errorMessage += error.message || 'Unknown error';
        }
        
        this.logger.error(errorMessage);
        
        // Return empty array in case of error
        return [];
      }
    } catch (error) {
      let errorMessage = `Error fetching customers: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Helper method to get timesheet entries for projects
   */
  private async getTimesheetsByProjects(
    projectIds: number[],
    authHeader?: string,
  ): Promise<WeeklyReportEntry[]> {
    try {
      if (projectIds.length === 0) {
        return [];
      }
      
      const url = `${this.timesheetServiceUrl}/api/v1/timesheets/projects`;
      const params = new URLSearchParams();
      params.append('projectIds', projectIds.join(','));
      
      const headers = this.getHeaders(authHeader);
      
      const fullUrl = `${url}?${params.toString()}`;
      this.logger.log(`EXACT API CALL: ${fullUrl}`);
      this.logger.log(`Fetching timesheet entries for projects from: ${url}?${params.toString()}`);
      
      try {
        const response = await firstValueFrom(
          this.httpService.get(fullUrl, { headers })
        );
        
        // Log the raw response for debugging
        this.logger.log(`Raw API response: ${JSON.stringify(response.data)}`);
        
        return response.data;
      } catch (error) {
        let errorMessage = `Error fetching timesheet entries for projects: `;
        
        if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          errorMessage += `Server responded with status ${error.response.status}. `;
          if (error.response.data) {
            errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
        } else {
          // Something happened in setting up the request
          errorMessage += error.message || 'Unknown error';
        }
        
        this.logger.error(errorMessage);
        
        // Return empty array in case of error
        return [];
      }
    } catch (error) {
      let errorMessage = `Error fetching timesheet entries for projects: `;
      
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx range
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data) {
          errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
      } else {
        // Something happened in setting up the request
        errorMessage += error.message || 'Unknown error';
      }
      
      this.logger.error(errorMessage);
      
      // Return empty array in case of error
      return [];
    }
  }

  /**
   * Process timesheet entries to create weekly report entries for one user
   */
  private processWeeklyUserReportEntries(
    timesheetEntries: WeeklyReportEntry[],
    tasks: TaskResponseType[],
    fromDate: string,
    toDate: string,
  ): any[] {
    // Group timesheet entries by task
    const entriesByTask = {};
    
    timesheetEntries.forEach(entry => {
      if (entry.task_id) {
        if (!entriesByTask[entry.task_id]) {
          entriesByTask[entry.task_id] = [];
        }
        entriesByTask[entry.task_id].push(entry);
      }
    });
    
    // Create report entries
    const reportEntries = [];
    
    for (const taskId in entriesByTask) {
      const taskEntries = entriesByTask[taskId];
      const task = tasks.find(t => t.id === parseInt(taskId));
      
      if (!task) continue;
      
      // Create duration array for each day of the week
      const duration = this.createDurationArray(taskEntries, fromDate, toDate);
      
      // Calculate total duration
      const totalDuration = this.formatTotalDuration(this.calculateTotalDuration(taskEntries));
      
      reportEntries.push({
        task,
        duration,
        totalDuration,
      });
    }
    
    return reportEntries;
  }

  /**
   * Process timesheet entries to create weekly report entries for all users
   * @returns Array of entries matching WeeklyAllUsersReportResponseType.entries structure
   */
  private processWeeklyAllUsersReportEntries(
    timesheetEntries: WeeklyReportEntry[],
    tasks: TaskResponseType[],
    users: UserType[],
    fromDate: string,
    toDate: string,
  ): {
    user_id: string;
    user?: UserType;
    task: TaskResponseType;
    duration: string[];
    totalDuration: string;
  }[] {
    this.logger.log(`Processing ${timesheetEntries.length} timesheet entries for weekly report`);
    this.logger.log(`Available tasks: ${tasks.length}, Available users: ${users.length}`);
    
    // Group timesheet entries by task and user
    const entriesByTaskAndUser = {};
    
    timesheetEntries.forEach(entry => {
      try {
        if (!entry.task_id) {
          this.logger.warn(`Entry missing task_id: ${JSON.stringify(entry)}`);
          return;
        }
        
        if (!entry.user_id) {
          this.logger.warn(`Entry missing user_id: ${JSON.stringify(entry)}`);
          return;
        }
        
        const key = `${entry.user_id}_${entry.task_id}`;
        if (!entriesByTaskAndUser[key]) {
          entriesByTaskAndUser[key] = [];
        }
        entriesByTaskAndUser[key].push(entry);
      } catch (error) {
        this.logger.error(`Error processing entry: ${JSON.stringify(entry)}`, error);
      }
    });
    
    // Log số lượng nhóm task-user
    const keys = Object.keys(entriesByTaskAndUser);
    this.logger.log(`Grouped entries into ${keys.length} task-user combinations`);
    
    // Create report entries
    const reportEntries = [];
    
    for (const key in entriesByTaskAndUser) {
      try {
        const [userId, taskId] = key.split('_');
        const taskEntries = entriesByTaskAndUser[key];
        
        this.logger.log(`Processing ${taskEntries.length} entries for user ${userId} and task ${taskId}`);
        
        // Tìm task tương ứng
        const task = tasks.find(t => t.id === parseInt(taskId));
        if (!task) {
          this.logger.warn(`Task with ID ${taskId} not found in tasks list`);
          continue;
        }
        
        // Tìm user tương ứng
        const user = users.find(u => u.user_id === userId);
        if (!user) {
          this.logger.warn(`User with ID ${userId} not found in users list`);
          // Vẫn tiếp tục xử lý ngay cả khi không tìm thấy user
        }
        
        // Create duration array for each day of the week
        const duration = this.createDurationArray(taskEntries, fromDate, toDate);
        
        // Calculate total duration
        const totalDuration = this.formatTotalDuration(this.calculateTotalDuration(taskEntries));
        
        this.logger.log(`Created report entry for user ${userId}, task ${taskId} with total duration ${totalDuration}`);
        
        reportEntries.push({
          user_id: userId,
          user, // Có thể là undefined nếu không tìm thấy user
          task,
          duration,
          totalDuration,
        });
      } catch (error) {
        this.logger.error(`Error processing task-user combination ${key}:`, error);
      }
    }
    
    this.logger.log(`Generated ${reportEntries.length} report entries in total`);
    return reportEntries;
  }

  /**
   * Create duration array for each day of the week
   * @returns Array of 7 strings representing durations for each day of the week (Monday to Sunday)
   */
  /**
   * Group timesheet entries by user_id and task_id
   * @param entries Timesheet entries to group
   * @returns Grouped entries by user_id and task_id
   */
  

  private createDurationArray(
    entries: WeeklyReportEntry[],
    fromDate: string,
    toDate: string,
  ): string[] {
    // Khởi tạo mảng duration với 7 phần tử rỗng (cho 7 ngày trong tuần)
    const duration = ['', '', '', '', '', '', ''];
    const fromDateObj = new Date(fromDate);
    
    // Đảm bảo fromDate là ngày đầu tuần (thứ Hai - index 0)
    const fromDateDay = fromDateObj.getDay(); // 0 = Chủ nhật, 1 = Thứ hai, ..., 6 = Thứ bảy
    const adjustedFromDate = new Date(fromDateObj);
    if (fromDateDay === 0) { // Nếu là Chủ nhật, lùi lại 6 ngày để lấy thứ Hai tuần trước
      adjustedFromDate.setDate(fromDateObj.getDate() - 6);
    } else { // Nếu không phải Chủ nhật, lùi lại (fromDateDay - 1) ngày để lấy thứ Hai
      adjustedFromDate.setDate(fromDateObj.getDate() - (fromDateDay - 1));
    }
    
    this.logger.log(`Creating duration array for ${entries.length} entries from ${fromDate} to ${toDate}`);
    this.logger.log(`Adjusted from date to Monday: ${adjustedFromDate.toISOString().split('T')[0]}`);
    
    // Tạo một bản đồ để tổng hợp thời gian cho mỗi ngày (tính bằng giây)
    const durationByDay = [0, 0, 0, 0, 0, 0, 0]; // [Thứ 2, Thứ 3, ..., Chủ nhật]
    
    entries.forEach(entry => {
      // Xử lý trường hợp entry có thể có start_time nhưng không có date
      // Đây là để tương thích với dữ liệu thực tế từ API
      const dateValue = entry.date || (entry as any).start_time;
      
      if (!dateValue) {
        this.logger.warn(`Entry missing both date and start_time: ${JSON.stringify(entry)}`);
        return;
      }
      
      try {
        const entryDate = new Date(dateValue);
        const entryDateStr = entryDate.toISOString().split('T')[0];
        
        // Tính toán chỉ số ngày trong tuần (0-6, với 0 = Thứ Hai, 6 = Chủ nhật)
        let dayIndex;
        const entryDay = entryDate.getDay(); // 0 = Chủ nhật, 1 = Thứ hai, ..., 6 = Thứ bảy
        
        if (entryDay === 0) { // Chủ nhật
          dayIndex = 6; // Chủ nhật là ngày cuối tuần (index 6)
        } else {
          dayIndex = entryDay - 1; // Các ngày khác: Thứ 2 -> 0, Thứ 3 -> 1, ...
        }
        
        // Kiểm tra xem ngày entry có nằm trong khoảng fromDate và toDate không
        const entryTime = entryDate.getTime();
        const fromTime = new Date(fromDate).getTime();
        const toTime = new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1; // Kết thúc của ngày toDate
        
        if (entryTime >= fromTime && entryTime <= toTime) {
          // Chuyển đổi duration thành số giây để tổng hợp
          let durationInSeconds = 0;
          
          if (typeof entry.duration === 'number') {
            // Nếu duration là số giây
            durationInSeconds = entry.duration;
          } else if ((entry as any).start_time && (entry as any).end_time) {
            // Nếu có start_time và end_time, tính duration
            // Sử dụng as any để tránh lỗi TypeScript vì các trường này không có trong WeeklyReportEntry
            try {
              const startTime = new Date((entry as any).start_time).getTime();
              const endTime = new Date((entry as any).end_time).getTime();
              durationInSeconds = Math.floor((endTime - startTime) / 1000);
              this.logger.log(`Calculated duration from start_time and end_time: ${durationInSeconds} seconds`);
            } catch (err) {
              this.logger.error(`Error calculating duration from start_time and end_time: ${err.message}`);
            }
          } else if (typeof entry.duration === 'string') {
            // Nếu duration là chuỗi định dạng 'HH:MM' hoặc 'H:MM'
            const durationStr = entry.duration as string;
            if (durationStr && durationStr.includes(':')) {
              const [hours, minutes] = durationStr.split(':').map(part => parseInt(part, 10));
              if (!isNaN(hours) && !isNaN(minutes)) {
                durationInSeconds = hours * 3600 + minutes * 60;
              }
            }
          }
          
          // Cộng dồn thời gian vào ngày tương ứng
          if (durationInSeconds > 0) {
            durationByDay[dayIndex] += durationInSeconds;
            this.logger.log(`Added ${durationInSeconds} seconds to day ${dayIndex} (${entryDateStr}), new total: ${durationByDay[dayIndex]} seconds`);
          }
        } else {
          this.logger.warn(`Entry date ${entryDateStr} is outside the range ${fromDate} to ${toDate}`);
        }
      } catch (error) {
        this.logger.error(`Error processing entry date: ${error.message}`);
      }
    });
    
    // Chuyển đổi tổng thời gian từ giây sang định dạng giờ:phút
    for (let i = 0; i < 7; i++) {
      if (durationByDay[i] > 0) {
        duration[i] = this.formatDuration(durationByDay[i]);
      }
    }
    
    this.logger.log(`Final duration array: ${JSON.stringify(duration)}`);
    return duration;
  }

  /**
   * Format duration in seconds to hours:minutes format
   */
  private formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * Format total duration in seconds to hours:minutes format
   */
  private formatTotalDuration(totalDurationInSeconds: number): string {
    if (isNaN(totalDurationInSeconds) || totalDurationInSeconds < 0) {
      this.logger.warn(`Invalid total duration: ${totalDurationInSeconds}, using 0 instead`);
      totalDurationInSeconds = 0;
    }
    
    const hours = Math.floor(totalDurationInSeconds / 3600);
    const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
    const paddedMinutes = minutes.toString().padStart(2, '0');
    
    this.logger.log(`Formatting total duration: ${totalDurationInSeconds} seconds = ${hours}:${paddedMinutes}`);
    return `${hours}:${paddedMinutes}`;
  }

  /**
   * Calculate total duration for timesheet entries
   */
  private calculateTotalDuration(entries: WeeklyReportEntry[]): number {
    return entries.reduce((total, entry) => {
      // Kiểm tra nếu duration là số
      if (typeof entry.duration === 'number') {
        return total + entry.duration;
      }
      
      // Nếu duration là chuỗi định dạng 'HH:MM' hoặc 'H:MM'
      if (typeof entry.duration === 'string') {
        try {
          const durationStr = entry.duration as string;
          if (durationStr && durationStr.includes(':')) {
            const [hours, minutes] = durationStr.split(':').map(part => parseInt(part, 10));
            if (!isNaN(hours) && !isNaN(minutes)) {
              // Chuyển đổi thành số giây
              return total + (hours * 3600 + minutes * 60);
            }
          }
        } catch (error) {
          this.logger.warn(`Error parsing duration string: ${entry.duration}`, error);
        }
      }
      
      // Nếu không thể xử lý, trả về tổng hiện tại
      return total;
    }, 0);
  }

  /**
   * Calculate current month duration for timesheet entries
   */
  private calculateCurrentMonthDuration(entries: WeeklyReportEntry[]): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
    
    return this.calculateTotalDuration(monthEntries);
  }

  /**
   * Calculate not exported duration for timesheet entries
   */
  private calculateNotExportedDuration(entries: WeeklyReportEntry[]): number {
    const notExportedEntries = entries.filter(entry => !entry['exported']);
    return this.calculateTotalDuration(notExportedEntries);
  }

  /**
   * Calculate not billed duration for timesheet entries
   */
  private calculateNotBilledDuration(entries: WeeklyReportEntry[]): number {
    const notBilledEntries = entries.filter(entry => !entry['billed']);
    return this.calculateTotalDuration(notBilledEntries);
  }

  /**
   * Get the last entry date from timesheet entries
   */
  private getLastEntryDate(entries: WeeklyReportEntry[]): string {
    if (entries.length === 0) {
      return '';
    }
    
    const sortedEntries = [...entries].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return sortedEntries[0].date;
  }

  /**
   * Group timesheet entries by user_id and task_id
   * @param entries Timesheet entries to group
   * @returns Grouped entries by user_id and task_id
   */
  

  private groupTimesheetEntriesByUser(entries: WeeklyReportEntry[]): Record<string, WeeklyReportEntry[]> {
    const entriesByUser = {};
    
    this.logger.log(`Grouping ${entries.length} timesheet entries by user`);
    
    entries.forEach(entry => {
      try {
        if (!entry.user_id) {
          this.logger.warn(`Entry missing user_id: ${JSON.stringify(entry)}`);
          return;
        }
        
        const userId = entry.user_id.toString();
        if (!entriesByUser[userId]) {
          entriesByUser[userId] = [];
          this.logger.log(`Created new group for user ${userId}`);
        }
        entriesByUser[userId].push(entry);
      } catch (error) {
        this.logger.error(`Error processing entry for grouping: ${JSON.stringify(entry)}`, error);
      }
    });
    
    // Log số lượng nhóm người dùng và số lượng bản ghi trong mỗi nhóm
    const userIds = Object.keys(entriesByUser);
    this.logger.log(`Grouped entries into ${userIds.length} user groups`);
    userIds.forEach(userId => {
      this.logger.log(`User ${userId} has ${entriesByUser[userId].length} entries`);
    });
    
    return entriesByUser;
  }

  /**
   * Get headers for HTTP requests
   */
  private getHeaders(authHeader?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    return headers;
  }


  /**
   * Generate mock weekly user report for testing
   */
  private generateMockWeeklyUserReport(
    userId: string,
    fromDate: string,
    toDate: string,
  ): WeeklyOneUserReportResponseType {
    return {
      user_id: userId,
      fromDate,
      toDate,
      entries: [
        {
          task: {
            id: 1,
            title: 'Task 1 Fix bug',
            color: 'red',
            deadline: '2025-05-01T15:39:11.346Z',
            created_at: '2025-05-01T15:39:11.346Z',
            deleted_at: null,
            status: TaskStatus.PROCESSING,
          },
          duration: ['', '', '7:00', '5:00', '6:00', '', ''],
          totalDuration: '18:00',
        },
        {
          task: {
            id: 2,
            title: 'Task 2 Implement feature',
            color: 'blue',
            deadline: '2025-05-10T15:39:11.346Z',
            created_at: '2025-05-01T15:39:11.346Z',
            deleted_at: null,
            status: TaskStatus.PROCESSING,
          },
          duration: ['4:00', '3:00', '', '', '', '2:00', ''],
          totalDuration: '9:00',
        },
      ],
    };
  }

  /**
   * Generate mock weekly all users report for testing
   */
  private generateMockWeeklyAllUsersReport(
    fromDate: string,
    toDate: string,
  ): WeeklyAllUsersReportResponseType {
    return {
      fromDate,
      toDate,
      entries: [
        {
          user_id: '1',
          user: {
            user_id: '1',
            name: 'User 1',
            email: 'user1@example.com',
          },
          task: {
            id: 1,
            title: 'Task 1 Fix bug',
            color: 'red',
            deadline: '2025-05-01T15:39:11.346Z',
            created_at: '2025-05-01T15:39:11.346Z',
            deleted_at: null,
            status: TaskStatus.PROCESSING,
          },
          duration: ['', '', '7:00', '5:00', '6:00', '', ''],
          totalDuration: '18:00',
        },
        {
          user_id: '2',
          user: {
            user_id: '2',
            name: 'User 2',
            email: 'user2@example.com',
          },
          task: {
            id: 2,
            title: 'Task 2 Implement feature',
            color: 'blue',
            deadline: '2025-05-10T15:39:11.346Z',
            created_at: '2025-05-01T15:39:11.346Z',
            deleted_at: null,
            status: TaskStatus.PROCESSING,
          },
          duration: ['4:00', '3:00', '', '', '', '2:00', ''],
          totalDuration: '9:00',
        },
      ],
    };
  }

  /**
   * Get dashboard data for the UI
   * @param userId User ID to get dashboard data for (optional)
   * @param authHeader Authorization header (optional)
   * @returns Dashboard data including timesheet summary and chart data
   */
  async getDashboardData(userId?: string, authHeader?: string): Promise<any> {
    try {
      this.logger.log(`Fetching dashboard data${userId ? ` for user ${userId}` : ' for all users'}`);
      
      // Get current date
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Calculate date ranges
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday of current week
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday of current week
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      
      // Format dates
      const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
      const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
      const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
      const endOfMonthStr = endOfMonth.toISOString().split('T')[0];
      const startOfYearStr = startOfYear.toISOString().split('T')[0];
      const endOfYearStr = endOfYear.toISOString().split('T')[0];
      
      this.logger.log(`Date ranges: Today: ${todayStr}, Week: ${startOfWeekStr} to ${endOfWeekStr}, Month: ${startOfMonthStr} to ${endOfMonthStr}, Year: ${startOfYearStr} to ${endOfYearStr}`);
      
      // Get timesheet entries for different periods
      let todayEntries, weekEntries, monthEntries, yearEntries;
      
      if (userId) {
        // Get data for specific user - userId is a string in Auth0 format
        this.logger.log(`Fetching timesheet entries for user ${userId}`);
        todayEntries = await this.getTimesheetEntries(userId, todayStr, todayStr, authHeader);
        weekEntries = await this.getTimesheetEntries(userId, startOfWeekStr, endOfWeekStr, authHeader);
        monthEntries = await this.getTimesheetEntries(userId, startOfMonthStr, endOfMonthStr, authHeader);
        yearEntries = await this.getTimesheetEntries(userId, startOfYearStr, endOfYearStr, authHeader);
      } else {
        // Get data for all users
        this.logger.log('Fetching timesheet entries for all users');
        todayEntries = await this.getAllTimesheetEntries(todayStr, todayStr, authHeader);
        weekEntries = await this.getAllTimesheetEntries(startOfWeekStr, endOfWeekStr, authHeader);
        monthEntries = await this.getAllTimesheetEntries(startOfMonthStr, endOfMonthStr, authHeader);
        yearEntries = await this.getAllTimesheetEntries(startOfYearStr, endOfYearStr, authHeader);
      }
      
      this.logger.log(`Retrieved entries - Today: ${todayEntries.length}, Week: ${weekEntries.length}, Month: ${monthEntries.length}, Year: ${yearEntries.length}`);
      
      // Log sample entries for debugging
      if (todayEntries.length > 0) {
        this.logger.log(`Sample today entry: ${JSON.stringify(todayEntries[0])}`);
      }
      
      // Calculate total hours for each period
      const todayHours = this.calculateTotalDuration(todayEntries);
      const weekHours = this.calculateTotalDuration(weekEntries);
      const monthHours = this.calculateTotalDuration(monthEntries);
      const yearHours = this.calculateTotalDuration(yearEntries);
      
      this.logger.log(`Calculated hours - Today: ${todayHours}s, Week: ${weekHours}s, Month: ${monthHours}s, Year: ${yearHours}s`);
      
      // Generate chart data for the week
      const chartData = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        // Filter entries for this day
        const dayEntries = weekEntries.filter(entry => {
          // Extract date from start_time (which is in ISO format)
          const entryDate = entry.start_time ? entry.start_time.split('T')[0] : null;
          return entryDate === dateStr;
        });
        
        // Calculate hours for this day
        const hoursDuration = this.calculateTotalDuration(dayEntries) / 3600; // Convert seconds to hours
        
        chartData.push({
          date: formattedDate,
          hour: Number(hoursDuration.toFixed(1))
        });
      }
      
      // For demonstration purposes, generate random trending values
      // In a real implementation, these would be calculated based on historical data
      const todayTrending = Math.floor(Math.random() * 5) + 1;
      const weekTrending = Math.floor(Math.random() * 10) + 5;
      const monthTrending = Math.floor(Math.random() * 20) + 10;
      const yearTrending = Math.floor(Math.random() * 50) + 100;
      
      return {
        summary: {
          today: {
            hours: this.formatTotalDuration(todayHours),
            trending: todayTrending
          },
          week: {
            hours: this.formatTotalDuration(weekHours),
            trending: weekTrending
          },
          month: {
            hours: this.formatTotalDuration(monthHours),
            trending: monthTrending
          },
          year: {
            hours: this.formatTotalDuration(yearHours),
            trending: yearTrending
          }
        },
        chartData
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard data', error);
      throw error;
    }
  }

  /**
   * Generate mock project overview report for testing
   */
  private generateMockProjectOverviewReport(): ProjectOverviewResponse {
    return {
      projects: [
        {
          id: 1,
          customer_id: 1,
          customer_name: 'Customer 1',
          name: 'Project 1',
          hourly_quota: 40,
          budget: 10000,
          spent: 5000,
          time_spent: 120,
          last_entry: '2025-05-01',
          this_month: 80,
          total: 120,
          not_exported: 40,
          not_billed: 60,
          budget_used_percentage: 50,
          color: '#FF5733',
        },
        {
          id: 2,
          customer_id: 1,
          customer_name: 'Customer 1',
          name: 'Project 2',
          hourly_quota: 30,
          budget: 8000,
          spent: 2000,
          time_spent: 60,
          last_entry: '2025-05-02',
          this_month: 40,
          total: 60,
          not_exported: 20,
          not_billed: 30,
          budget_used_percentage: 25,
          color: '#33FF57',
        },
      ],
      customers: [
        {
          id: 1,
          name: 'Customer 1',
          address: '123 Main St',
          contact: 'John Doe',
        },
        {
          id: 2,
          name: 'Customer 2',
          address: '456 Oak Ave',
          contact: 'Jane Smith',
        },
      ],
    };
  }
}
