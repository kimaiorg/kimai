export interface Project {
    id: string;
    name: string;
    color?: string;
    project_number?: number;
    order_number?: number;
    order_date?: Date;
    start_date?: Date;
    end_date?: Date;
    budget?: number;
    teams?: number[];
    customer?: number | string;
    visible?: boolean;
    billable?: boolean;
    description?: string;
    createdAt?: Date;
}
