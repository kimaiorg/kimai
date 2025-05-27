import { TaskType } from './task';

export type ActivityType = {
  id: number;
  name: string;
  description?: string;
  color?: string;
  created_at?: string;
  tasks?: TaskType[];
};
