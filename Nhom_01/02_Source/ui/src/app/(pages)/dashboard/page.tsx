"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Dashboard() {
  return <div>This is my dashboard</div>;
}
export default AuthenticatedRoute(Dashboard, []);
