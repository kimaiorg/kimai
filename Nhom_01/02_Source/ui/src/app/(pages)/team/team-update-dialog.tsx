"use client";

import { TeamType } from "@/type_schema/team";

export default function TeamUpdateDialog({
  children,
  targetTeam,
  fetchTeams
}: {
  children: React.ReactNode;
  targetTeam: TeamType;
  fetchTeams: () => void;
}) {
  return <div>TeamUpdateDialog</div>;
}
