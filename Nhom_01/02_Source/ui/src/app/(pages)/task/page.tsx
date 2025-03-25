"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function Task() {
  return <div>This is my Task page</div>;
}
export default AuthenticatedRoute(Task, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
