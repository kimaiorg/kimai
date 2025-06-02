import { TaskResponseType } from './task';
import { UserType } from './user';
export type WeekOptionType = {
    week: number;
    label: string;
    from: string;
    to: string;
};
export type WeeklyOneUserReportResponseType = {
    user_id: string;
    fromDate: string;
    toDate: string;
    entries: {
        task: TaskResponseType;
        duration: any[];
        totalDuration: any;
    }[];
};
export type WeeklyAllUsersReportResponseType = {
    fromDate: string;
    toDate: string;
    entries: {
        user_id: string;
        user?: UserType;
        task: TaskResponseType;
        duration: any[];
        totalDuration: any;
    }[];
};
export type WeekDayType = {
    date: Date;
    dayNumber: number;
    dayName: string;
};
export interface WeeklyReportEntry {
    id: number;
    project_id: number;
    user_id: number;
    duration: number;
    date: string;
    description?: string;
    activity_id?: number;
    task_id?: number;
}
export interface ProjectReportData {
    id: number;
    customer_id: number;
    customer_name: string;
    name: string;
    hourly_quota: number;
    budget: number;
    spent: number;
    time_spent: number;
    last_entry: string;
    this_month: number;
    total: number;
    not_exported: number;
    not_billed: number;
    budget_used_percentage: number;
    color: string;
}
export interface UserReportData {
    id: number;
    name: string;
    email?: string;
    role: string;
}
export interface CustomerReportData {
    id: number;
    name: string;
    address?: string;
    contact?: string;
}
export interface ReportFilter {
    startDate?: Date;
    endDate?: Date;
    userId?: number;
    projectId?: number;
    customerId?: number;
    activityId?: number;
    taskId?: number;
}
export interface WeeklyUserReportResponse {
    entries: WeeklyReportEntry[];
    projects: {
        id: number;
        name: string;
        color: string;
    }[];
    user: {
        id: number;
        name: string;
    };
    week: {
        number: number;
        year: number;
        start: string;
        end: string;
    };
    totals: {
        duration: number;
        byDay: Record<string, number>;
        byProject: Record<number, number>;
    };
}
export interface ProjectOverviewResponse {
    projects: ProjectReportData[];
    customers: CustomerReportData[];
}
export interface WeeklyAllUsersReportResponse {
    entries: WeeklyReportEntry[];
    users: UserReportData[];
    projects: {
        id: number;
        name: string;
        color: string;
    }[];
    week: {
        number: number;
        year: number;
        start: string;
        end: string;
    };
    totals: {
        duration: number;
        byDay: Record<string, number>;
        byUser: Record<number, number>;
    };
}
export declare enum ReportView {
    WEEKLY_USER = "WEEKLY_USER",
    WEEKLY_ALL_USERS = "WEEKLY_ALL_USERS",
    PROJECT_OVERVIEW = "PROJECT_OVERVIEW"
}
