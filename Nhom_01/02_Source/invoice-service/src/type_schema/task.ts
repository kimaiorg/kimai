export type TaskType = {
  id: number;
  title: string;
  description?: string;
  status: string;
  billable?: boolean;
  quantity?: number;
  price?: number;
  deadline?: string;
  created_at?: string;
  color?: string;
};
