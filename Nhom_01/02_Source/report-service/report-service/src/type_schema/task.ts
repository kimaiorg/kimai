export enum TaskStatus {
  OPEN = 'OPEN',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  CLOSED = 'CLOSED',
}

export interface TaskResponseType {
  id: number;
  title: string;
  color: string;
  deadline?: string;
  created_at: string;
  deleted_at: string | null;
  description?: string;
  status?: TaskStatus;
  project?: {
    id: number;
    name: string;
    color: string;
  };
}
