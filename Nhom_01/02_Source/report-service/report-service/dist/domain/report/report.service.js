"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const task_1 = require("../../type_schema/task");
let ReportService = ReportService_1 = class ReportService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.logger = new common_1.Logger(ReportService_1.name);
        const env = this.configService.get('NODE_ENV') || 'development';
        console.log(`[REPORT_SERVICE] Current environment: ${env}`);
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
        const timesheetUrl = this.configService.get('TIMESHEET_SERVICE_URL');
        const projectUrl = this.configService.get('PROJECT_SERVICE_URL');
        console.log(`[REPORT_SERVICE] Environment variables:`);
        console.log(`  - TIMESHEET_SERVICE_URL: ${timesheetUrl || 'not set'}`);
        console.log(`  - PROJECT_SERVICE_URL: ${projectUrl || 'not set'}`);
        console.log(`  - TIMESHEET_SERVICE_URL_${env.toUpperCase()}: ${this.configService.get(`TIMESHEET_SERVICE_URL_${env.toUpperCase()}`) || 'not set'}`);
        console.log(`  - PROJECT_SERVICE_URL_${env.toUpperCase()}: ${this.configService.get(`PROJECT_SERVICE_URL_${env.toUpperCase()}`) || 'not set'}`);
        this.timesheetServiceUrl = timesheetUrl ||
            this.configService.get(`TIMESHEET_SERVICE_URL_${env.toUpperCase()}`) ||
            defaultUrls[env].timesheet;
        this.projectServiceUrl = projectUrl ||
            this.configService.get(`PROJECT_SERVICE_URL_${env.toUpperCase()}`) ||
            defaultUrls[env].project;
        if (!this.timesheetServiceUrl) {
            console.error(`[REPORT_SERVICE] WARNING: Timesheet service URL is not set!`);
        }
        if (!this.projectServiceUrl) {
            console.error(`[REPORT_SERVICE] WARNING: Project service URL is not set!`);
        }
        console.log(`[${env}] Using Timesheet Service URL: ${this.timesheetServiceUrl}`);
        console.log(`[${env}] Using Project Service URL: ${this.projectServiceUrl}`);
    }
    async getWeeklyOneUserReport(userId, fromDate, toDate, authHeader) {
        try {
            this.logger.log(`Fetching weekly report for user ${userId} from ${fromDate} to ${toDate}`);
            const user = await this.getUserInfo(userId, authHeader);
            const timesheetEntries = await this.getTimesheetEntries(userId, fromDate, toDate, authHeader);
            const taskIds = [...new Set(timesheetEntries.map(entry => entry.task_id).filter(id => id !== null && id !== undefined))];
            const tasks = await this.getTasksInfo(taskIds, authHeader);
            const entries = this.processWeeklyUserReportEntries(timesheetEntries, tasks, fromDate, toDate);
            return {
                user_id: userId,
                fromDate,
                toDate,
                entries,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching weekly report for user ${userId}:`, error);
            return this.generateMockWeeklyUserReport(userId, fromDate, toDate);
        }
    }
    async getWeeklyAllUsersReport(fromDate, toDate, authHeader) {
        try {
            this.logger.log(`Fetching weekly report for all users from ${fromDate} to ${toDate}`);
            this.logger.log('Step 1: Getting all users from project service');
            const users = await this.getAllUsers(authHeader);
            this.logger.log(`Retrieved ${users.length} users from project service`);
            this.logger.log(`Step 2: Getting timesheet entries for all users from ${fromDate} to ${toDate}`);
            const timesheetEntries = await this.getAllTimesheetEntries(fromDate, toDate, authHeader);
            this.logger.log(`Retrieved ${timesheetEntries.length} timesheet entries`);
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
            this.logger.log('Step 3: Extracting unique task IDs from timesheet entries');
            const taskIds = [...new Set(timesheetEntries
                    .map(entry => entry.task_id)
                    .filter(id => id !== null && id !== undefined))];
            this.logger.log(`Found ${taskIds.length} unique task IDs: ${taskIds.join(', ')}`);
            if (taskIds.length === 0) {
                this.logger.warn('No valid task IDs found in timesheet entries');
            }
            this.logger.log('Getting task information from project service');
            const tasks = await this.getTasksInfo(taskIds, authHeader);
            this.logger.log(`Retrieved information for ${tasks.length} tasks`);
            this.logger.log('Step 4: Processing data to create weekly reports');
            this.logger.log('Grouping timesheet entries by user');
            const entriesByUser = this.groupTimesheetEntriesByUser(timesheetEntries);
            const userIds = Object.keys(entriesByUser);
            this.logger.log(`Timesheet entries grouped for ${userIds.length} users`);
            const allUsersReport = [];
            for (const userId in entriesByUser) {
                const userEntries = entriesByUser[userId];
                this.logger.log(`Processing ${userEntries.length} entries for user ${userId}`);
                const user = users.find(u => u.user_id === userId);
                if (!user) {
                    this.logger.warn(`User with ID ${userId} not found in users list`);
                    continue;
                }
                const reportEntries = this.processWeeklyAllUsersReportEntries(userEntries, tasks, users, fromDate, toDate);
                this.logger.log(`Generated ${reportEntries.length} report entries for user ${userId}`);
                allUsersReport.push({
                    fromDate,
                    toDate,
                    entries: reportEntries,
                });
            }
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
        }
        catch (error) {
            this.logger.error(`Error fetching weekly report for all users:`, error);
            if (error.response) {
                this.logger.error(`Response status: ${error.response.status}`);
                this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
            }
            else if (error.request) {
                this.logger.error('No response received from server');
            }
            else {
                this.logger.error(`Error message: ${error.message}`);
            }
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
    async getProjectOverviewReport(customerId, authHeader) {
        try {
            this.logger.log(`Fetching project overview report${customerId ? ` for customer ${customerId}` : ''}`);
            const projects = await this.getProjects(customerId, authHeader);
            const customers = await this.getCustomers(authHeader);
            const projectIds = projects.map(project => project.id);
            const projectTimesheets = await this.getTimesheetsByProjects(projectIds, authHeader);
            const projectReportData = projects.map(project => {
                const projectTimesheet = projectTimesheets.filter(timesheet => timesheet.project_id === project.id);
                const timeSpent = this.calculateTotalDuration(projectTimesheet);
                const lastEntry = this.getLastEntryDate(projectTimesheet);
                const thisMonth = this.calculateCurrentMonthDuration(projectTimesheet);
                const notExported = this.calculateNotExportedDuration(projectTimesheet);
                const notBilled = this.calculateNotBilledDuration(projectTimesheet);
                const customer = customers.find(c => c.id === project.customer_id);
                return {
                    id: project.id,
                    customer_id: project.customer_id,
                    customer_name: customer ? customer.name : 'Unknown Customer',
                    name: project.name,
                    hourly_quota: project.hourly_quota || 0,
                    budget: project.budget || 0,
                    spent: 0,
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
            const customerReportData = customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                address: customer.address,
                contact: customer.contact,
            }));
            return {
                projects: projectReportData,
                customers: customerReportData,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching project overview report:`, error);
            return this.generateMockProjectOverviewReport();
        }
    }
    async getUserInfo(userId, authHeader) {
        try {
            if (!this.projectServiceUrl) {
                throw new Error(`Project service URL is not configured. Please check environment variables.`);
            }
            const url = `${this.projectServiceUrl}/api/v1/customers/${userId}`;
            const headers = this.getHeaders(authHeader);
            this.logger.log(`Fetching user info from: ${url}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers,
                timeout: 10000
            }));
            if (!response.data) {
                throw new Error(`API returned empty response for user ID ${userId}`);
            }
            return response.data;
        }
        catch (error) {
            let errorMessage = `Error fetching user info for ID ${userId}: `;
            if (error.response) {
                errorMessage += `Server responded with status ${error.response.status}. `;
                if (error.response.data) {
                    errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
                }
            }
            else if (error.request) {
                errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
            }
            else {
                errorMessage += error.message || 'Unknown error';
            }
            this.logger.error(errorMessage);
            return {
                user_id: userId,
                name: `User ${userId}`,
                email: `user${userId}@example.com`,
            };
        }
    }
    async getAllUsers(authHeader) {
        try {
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - 90);
            const toDate = new Date();
            const timesheetEntries = await this.getAllTimesheetEntries(fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0], authHeader);
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
            const users = Object.values(userMap);
            this.logger.log(`Created ${users.length} users from timesheet entries`);
            if (users.length > 0) {
                const sampleUsers = users.slice(0, Math.min(3, users.length));
                this.logger.log(`Sample user IDs: ${sampleUsers.map(u => u.user_id).join(', ')}`);
            }
            return users;
        }
        catch (error) {
            let errorMessage = `Error creating users from timesheet entries: `;
            errorMessage += error.message || 'Unknown error';
            this.logger.error(errorMessage);
            return [
                {
                    user_id: 'auth0|67d99257463a53ee93784bb3',
                    name: 'Default User',
                    email: 'default@example.com',
                }
            ];
        }
    }
    async getTimesheetEntries(userId, fromDate, toDate, authHeader) {
        try {
            if (!this.timesheetServiceUrl) {
                throw new Error(`Timesheet service URL is not configured. Please check environment variables.`);
            }
            const url = `${this.timesheetServiceUrl}/api/v1/timesheets`;
            const params = new URLSearchParams();
            params.append('from_date', fromDate);
            params.append('to_date', toDate);
            params.append('userId', encodeURIComponent(userId));
            const headers = this.getHeaders(authHeader);
            this.logger.log(`Fetching timesheet entries from: ${url}?${params.toString()} for user ${userId}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${url}?${params.toString()}`, {
                headers,
                timeout: 10000
            }));
            if (!response.data) {
                throw new Error(`API returned empty response for timesheet entries`);
            }
            let timesheetEntries = [];
            if (response.data.data && Array.isArray(response.data.data)) {
                timesheetEntries = response.data.data;
                this.logger.log(`Received ${timesheetEntries.length} timesheet entries for user ${userId} (paginated structure)`);
            }
            else if (Array.isArray(response.data)) {
                timesheetEntries = response.data;
                this.logger.log(`Received ${timesheetEntries.length} timesheet entries for user ${userId} (direct array)`);
            }
            else if (typeof response.data === 'object' && !Array.isArray(response.data) && !response.data.data) {
                timesheetEntries = [response.data];
                this.logger.log(`Received single timesheet entry for user ${userId} (object)`);
            }
            else {
                throw new Error(`API returned unexpected structure for timesheet entries: ${JSON.stringify(response.data)}`);
            }
            if (timesheetEntries.length > 0) {
                this.logger.log(`Sample timesheet entry: ${JSON.stringify(timesheetEntries[0])}`);
            }
            return timesheetEntries;
        }
        catch (error) {
            let errorMessage = `Error fetching timesheet entries for user ${userId}: `;
            if (error.response) {
                errorMessage += `Server responded with status ${error.response.status}. `;
                if (error.response.data) {
                    errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
                }
            }
            else if (error.request) {
                errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
            }
            else {
                errorMessage += error.message || 'Unknown error';
            }
            this.logger.error(errorMessage);
            return [];
        }
    }
    async getAllTimesheetEntries(fromDate, toDate, authHeader) {
        try {
            if (!this.timesheetServiceUrl) {
                throw new Error(`Timesheet service URL is not configured. Please check environment variables.`);
            }
            const url = `${this.timesheetServiceUrl}/api/v1/timesheets`;
            const params = new URLSearchParams();
            params.append('from_date', fromDate);
            params.append('to_date', toDate);
            const headers = this.getHeaders(authHeader);
            this.logger.log(`Fetching all timesheet entries from: ${url}?${params.toString()}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${url}?${params.toString()}`, {
                headers,
                timeout: 10000
            }));
            if (!response.data) {
                throw new Error(`API returned empty response for all timesheet entries`);
            }
            let timesheetEntries = [];
            if (response.data.data && Array.isArray(response.data.data)) {
                timesheetEntries = response.data.data;
                this.logger.log(`Received ${timesheetEntries.length} timesheet entries (paginated structure)`);
            }
            else if (Array.isArray(response.data)) {
                timesheetEntries = response.data;
                this.logger.log(`Received ${timesheetEntries.length} timesheet entries (direct array)`);
            }
            else if (typeof response.data === 'object' && !Array.isArray(response.data) && !response.data.data) {
                timesheetEntries = [response.data];
                this.logger.log(`Received single timesheet entry (object)`);
            }
            else {
                throw new Error(`API returned unexpected structure for all timesheet entries: ${JSON.stringify(response.data)}`);
            }
            if (timesheetEntries.length > 0) {
                this.logger.log(`Sample timesheet entry: ${JSON.stringify(timesheetEntries[0])}`);
                this.logger.log(`Total timesheet entries received: ${timesheetEntries.length}`);
            }
            else {
                this.logger.warn(`No timesheet entries found for the date range ${fromDate} to ${toDate}`);
            }
            return timesheetEntries;
        }
        catch (error) {
            let errorMessage = `Error fetching all timesheet entries: `;
            if (error.response) {
                errorMessage += `Server responded with status ${error.response.status}. `;
                if (error.response.data) {
                    errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
                }
            }
            else if (error.request) {
                errorMessage += `No response received from server. Check if timesheet service is running at ${this.timesheetServiceUrl}.`;
            }
            else {
                errorMessage += error.message || 'Unknown error';
            }
            this.logger.error(errorMessage);
            return [];
        }
    }
    async getTasksInfo(taskIds, authHeader) {
        try {
            if (!this.projectServiceUrl) {
                throw new Error(`Project service URL is not configured. Please check environment variables.`);
            }
            const tasks = [];
            for (const taskId of taskIds) {
                try {
                    const url = `${this.projectServiceUrl}/api/v1/tasks/${taskId}`;
                    const headers = this.getHeaders(authHeader);
                    this.logger.log(`Fetching task info from: ${url}`);
                    const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                        headers,
                        timeout: 5000
                    }));
                    if (response.data) {
                        tasks.push(response.data);
                    }
                }
                catch (taskError) {
                    this.logger.warn(`Error fetching task ${taskId}: ${taskError.message}`);
                }
            }
            this.logger.log(`Successfully fetched ${tasks.length} out of ${taskIds.length} tasks`);
            return tasks;
        }
        catch (error) {
            let errorMessage = `Error fetching tasks info: `;
            if (error.response) {
                errorMessage += `Server responded with status ${error.response.status}. `;
                if (error.response.data) {
                    errorMessage += `Response: ${JSON.stringify(error.response.data)}`;
                }
            }
            else if (error.request) {
                errorMessage += `No response received from server. Check if project service is running at ${this.projectServiceUrl}.`;
            }
            else {
                errorMessage += error.message || 'Unknown error';
            }
            this.logger.error(errorMessage);
            return [];
        }
    }
    async getProjects(customerId, authHeader) {
        try {
            const url = `${this.projectServiceUrl}/api/v1/projects`;
            const params = new URLSearchParams();
            if (customerId) {
                params.append('customerId', customerId.toString());
            }
            const headers = this.getHeaders(authHeader);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${url}?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching projects:`, error);
            return [];
        }
    }
    async getCustomers(authHeader) {
        try {
            const url = `${this.projectServiceUrl}/api/v1/customers`;
            const headers = this.getHeaders(authHeader);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, { headers }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching customers:`, error);
            return [];
        }
    }
    async getTimesheetsByProjects(projectIds, authHeader) {
        try {
            if (projectIds.length === 0) {
                return [];
            }
            const url = `${this.timesheetServiceUrl}/api/v1/timesheets/projects`;
            const params = new URLSearchParams();
            params.append('projectIds', projectIds.join(','));
            const headers = this.getHeaders(authHeader);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${url}?${params.toString()}`, { headers }));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching timesheet entries for projects:`, error);
            return [];
        }
    }
    processWeeklyUserReportEntries(timesheetEntries, tasks, fromDate, toDate) {
        const entriesByTask = {};
        timesheetEntries.forEach(entry => {
            if (entry.task_id) {
                if (!entriesByTask[entry.task_id]) {
                    entriesByTask[entry.task_id] = [];
                }
                entriesByTask[entry.task_id].push(entry);
            }
        });
        const reportEntries = [];
        for (const taskId in entriesByTask) {
            const taskEntries = entriesByTask[taskId];
            const task = tasks.find(t => t.id === parseInt(taskId));
            if (!task)
                continue;
            const duration = this.createDurationArray(taskEntries, fromDate, toDate);
            const totalDuration = this.formatTotalDuration(this.calculateTotalDuration(taskEntries));
            reportEntries.push({
                task,
                duration,
                totalDuration,
            });
        }
        return reportEntries;
    }
    processWeeklyAllUsersReportEntries(timesheetEntries, tasks, users, fromDate, toDate) {
        this.logger.log(`Processing ${timesheetEntries.length} timesheet entries for weekly report`);
        this.logger.log(`Available tasks: ${tasks.length}, Available users: ${users.length}`);
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
            }
            catch (error) {
                this.logger.error(`Error processing entry: ${JSON.stringify(entry)}`, error);
            }
        });
        const keys = Object.keys(entriesByTaskAndUser);
        this.logger.log(`Grouped entries into ${keys.length} task-user combinations`);
        const reportEntries = [];
        for (const key in entriesByTaskAndUser) {
            try {
                const [userId, taskId] = key.split('_');
                const taskEntries = entriesByTaskAndUser[key];
                this.logger.log(`Processing ${taskEntries.length} entries for user ${userId} and task ${taskId}`);
                const task = tasks.find(t => t.id === parseInt(taskId));
                if (!task) {
                    this.logger.warn(`Task with ID ${taskId} not found in tasks list`);
                    continue;
                }
                const user = users.find(u => u.user_id === userId);
                if (!user) {
                    this.logger.warn(`User with ID ${userId} not found in users list`);
                }
                const duration = this.createDurationArray(taskEntries, fromDate, toDate);
                const totalDuration = this.formatTotalDuration(this.calculateTotalDuration(taskEntries));
                this.logger.log(`Created report entry for user ${userId}, task ${taskId} with total duration ${totalDuration}`);
                reportEntries.push({
                    user_id: userId,
                    user,
                    task,
                    duration,
                    totalDuration,
                });
            }
            catch (error) {
                this.logger.error(`Error processing task-user combination ${key}:`, error);
            }
        }
        this.logger.log(`Generated ${reportEntries.length} report entries in total`);
        return reportEntries;
    }
    createDurationArray(entries, fromDate, toDate) {
        const duration = ['', '', '', '', '', '', ''];
        const fromDateObj = new Date(fromDate);
        const fromDateDay = fromDateObj.getDay();
        const adjustedFromDate = new Date(fromDateObj);
        if (fromDateDay === 0) {
            adjustedFromDate.setDate(fromDateObj.getDate() - 6);
        }
        else {
            adjustedFromDate.setDate(fromDateObj.getDate() - (fromDateDay - 1));
        }
        this.logger.log(`Creating duration array for ${entries.length} entries from ${fromDate} to ${toDate}`);
        this.logger.log(`Adjusted from date to Monday: ${adjustedFromDate.toISOString().split('T')[0]}`);
        const durationByDay = [0, 0, 0, 0, 0, 0, 0];
        entries.forEach(entry => {
            const dateValue = entry.date || entry.start_time;
            if (!dateValue) {
                this.logger.warn(`Entry missing both date and start_time: ${JSON.stringify(entry)}`);
                return;
            }
            try {
                const entryDate = new Date(dateValue);
                const entryDateStr = entryDate.toISOString().split('T')[0];
                let dayIndex;
                const entryDay = entryDate.getDay();
                if (entryDay === 0) {
                    dayIndex = 6;
                }
                else {
                    dayIndex = entryDay - 1;
                }
                const entryTime = entryDate.getTime();
                const fromTime = new Date(fromDate).getTime();
                const toTime = new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1;
                if (entryTime >= fromTime && entryTime <= toTime) {
                    let durationInSeconds = 0;
                    if (typeof entry.duration === 'number') {
                        durationInSeconds = entry.duration;
                    }
                    else if (entry.start_time && entry.end_time) {
                        try {
                            const startTime = new Date(entry.start_time).getTime();
                            const endTime = new Date(entry.end_time).getTime();
                            durationInSeconds = Math.floor((endTime - startTime) / 1000);
                            this.logger.log(`Calculated duration from start_time and end_time: ${durationInSeconds} seconds`);
                        }
                        catch (err) {
                            this.logger.error(`Error calculating duration from start_time and end_time: ${err.message}`);
                        }
                    }
                    else if (typeof entry.duration === 'string') {
                        const durationStr = entry.duration;
                        if (durationStr && durationStr.includes(':')) {
                            const [hours, minutes] = durationStr.split(':').map(part => parseInt(part, 10));
                            if (!isNaN(hours) && !isNaN(minutes)) {
                                durationInSeconds = hours * 3600 + minutes * 60;
                            }
                        }
                    }
                    if (durationInSeconds > 0) {
                        durationByDay[dayIndex] += durationInSeconds;
                        this.logger.log(`Added ${durationInSeconds} seconds to day ${dayIndex} (${entryDateStr}), new total: ${durationByDay[dayIndex]} seconds`);
                    }
                }
                else {
                    this.logger.warn(`Entry date ${entryDateStr} is outside the range ${fromDate} to ${toDate}`);
                }
            }
            catch (error) {
                this.logger.error(`Error processing entry date: ${error.message}`);
            }
        });
        for (let i = 0; i < 7; i++) {
            if (durationByDay[i] > 0) {
                duration[i] = this.formatDuration(durationByDay[i]);
            }
        }
        this.logger.log(`Final duration array: ${JSON.stringify(duration)}`);
        return duration;
    }
    formatDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }
    formatTotalDuration(totalDurationInSeconds) {
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
    calculateTotalDuration(entries) {
        return entries.reduce((total, entry) => {
            if (typeof entry.duration === 'number') {
                return total + entry.duration;
            }
            if (typeof entry.duration === 'string') {
                try {
                    const durationStr = entry.duration;
                    if (durationStr && durationStr.includes(':')) {
                        const [hours, minutes] = durationStr.split(':').map(part => parseInt(part, 10));
                        if (!isNaN(hours) && !isNaN(minutes)) {
                            return total + (hours * 3600 + minutes * 60);
                        }
                    }
                }
                catch (error) {
                    this.logger.warn(`Error parsing duration string: ${entry.duration}`, error);
                }
            }
            return total;
        }, 0);
    }
    calculateCurrentMonthDuration(entries) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });
        return this.calculateTotalDuration(monthEntries);
    }
    calculateNotExportedDuration(entries) {
        const notExportedEntries = entries.filter(entry => !entry['exported']);
        return this.calculateTotalDuration(notExportedEntries);
    }
    calculateNotBilledDuration(entries) {
        const notBilledEntries = entries.filter(entry => !entry['billed']);
        return this.calculateTotalDuration(notBilledEntries);
    }
    getLastEntryDate(entries) {
        if (entries.length === 0) {
            return '';
        }
        const sortedEntries = [...entries].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        return sortedEntries[0].date;
    }
    groupTimesheetEntriesByUser(entries) {
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
            }
            catch (error) {
                this.logger.error(`Error processing entry for grouping: ${JSON.stringify(entry)}`, error);
            }
        });
        const userIds = Object.keys(entriesByUser);
        this.logger.log(`Grouped entries into ${userIds.length} user groups`);
        userIds.forEach(userId => {
            this.logger.log(`User ${userId} has ${entriesByUser[userId].length} entries`);
        });
        return entriesByUser;
    }
    getHeaders(authHeader) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }
        return headers;
    }
    generateMockWeeklyUserReport(userId, fromDate, toDate) {
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
                        status: task_1.TaskStatus.PROCESSING,
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
                        status: task_1.TaskStatus.PROCESSING,
                    },
                    duration: ['4:00', '3:00', '', '', '', '2:00', ''],
                    totalDuration: '9:00',
                },
            ],
        };
    }
    generateMockWeeklyAllUsersReport(fromDate, toDate) {
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
                        status: task_1.TaskStatus.PROCESSING,
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
                        status: task_1.TaskStatus.PROCESSING,
                    },
                    duration: ['4:00', '3:00', '', '', '', '2:00', ''],
                    totalDuration: '9:00',
                },
            ],
        };
    }
    async getDashboardData(userId, authHeader) {
        try {
            this.logger.log(`Fetching dashboard data${userId ? ` for user ${userId}` : ' for all users'}`);
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            const endOfYear = new Date(today.getFullYear(), 11, 31);
            const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
            const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
            const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
            const endOfMonthStr = endOfMonth.toISOString().split('T')[0];
            const startOfYearStr = startOfYear.toISOString().split('T')[0];
            const endOfYearStr = endOfYear.toISOString().split('T')[0];
            this.logger.log(`Date ranges: Today: ${todayStr}, Week: ${startOfWeekStr} to ${endOfWeekStr}, Month: ${startOfMonthStr} to ${endOfMonthStr}, Year: ${startOfYearStr} to ${endOfYearStr}`);
            let todayEntries, weekEntries, monthEntries, yearEntries;
            if (userId) {
                this.logger.log(`Fetching timesheet entries for user ${userId}`);
                todayEntries = await this.getTimesheetEntries(userId, todayStr, todayStr, authHeader);
                weekEntries = await this.getTimesheetEntries(userId, startOfWeekStr, endOfWeekStr, authHeader);
                monthEntries = await this.getTimesheetEntries(userId, startOfMonthStr, endOfMonthStr, authHeader);
                yearEntries = await this.getTimesheetEntries(userId, startOfYearStr, endOfYearStr, authHeader);
            }
            else {
                this.logger.log('Fetching timesheet entries for all users');
                todayEntries = await this.getAllTimesheetEntries(todayStr, todayStr, authHeader);
                weekEntries = await this.getAllTimesheetEntries(startOfWeekStr, endOfWeekStr, authHeader);
                monthEntries = await this.getAllTimesheetEntries(startOfMonthStr, endOfMonthStr, authHeader);
                yearEntries = await this.getAllTimesheetEntries(startOfYearStr, endOfYearStr, authHeader);
            }
            this.logger.log(`Retrieved entries - Today: ${todayEntries.length}, Week: ${weekEntries.length}, Month: ${monthEntries.length}, Year: ${yearEntries.length}`);
            if (todayEntries.length > 0) {
                this.logger.log(`Sample today entry: ${JSON.stringify(todayEntries[0])}`);
            }
            const todayHours = this.calculateTotalDuration(todayEntries);
            const weekHours = this.calculateTotalDuration(weekEntries);
            const monthHours = this.calculateTotalDuration(monthEntries);
            const yearHours = this.calculateTotalDuration(yearEntries);
            this.logger.log(`Calculated hours - Today: ${todayHours}s, Week: ${weekHours}s, Month: ${monthHours}s, Year: ${yearHours}s`);
            const chartData = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                const dayEntries = weekEntries.filter(entry => {
                    const entryDate = entry.start_time ? entry.start_time.split('T')[0] : null;
                    return entryDate === dateStr;
                });
                const hoursDuration = this.calculateTotalDuration(dayEntries) / 3600;
                chartData.push({
                    date: formattedDate,
                    hour: Number(hoursDuration.toFixed(1))
                });
            }
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
        }
        catch (error) {
            this.logger.error('Error fetching dashboard data', error);
            throw error;
        }
    }
    generateMockProjectOverviewReport() {
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
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = ReportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ReportService);
//# sourceMappingURL=report.service.js.map