export interface ActivityResponse {
  id: number;
  name: string;
  description: string;
  team: TeamResponse;
}

export interface TeamResponse {
  id: number;
  lead: string;
}
