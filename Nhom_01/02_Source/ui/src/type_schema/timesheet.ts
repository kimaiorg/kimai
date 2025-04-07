export interface Timesheet {
  id: string;
  description?: string;
  start_time: Date;
  end_time?: Date;
  duration?: number; // in seconds
  user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  // Additional fields for UI display (these would come from related services)
  project?: string;
  activity?: string;
  user_name?: string;
  billable?: boolean;
  tags?: string[];
  status?: "running" | "stopped";
}
