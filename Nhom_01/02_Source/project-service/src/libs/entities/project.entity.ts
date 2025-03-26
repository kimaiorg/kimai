import { Customer, Team } from '@prisma/client';

export class ProjectEntity {
  id: number;
  name: string;
  color: string;
  project_number: string;
  order_number: string;
  order_date: Date;
  start_date: Date;
  end_date: Date;
  budget: number;
  teams: Team[];
  customer: Customer;
}
