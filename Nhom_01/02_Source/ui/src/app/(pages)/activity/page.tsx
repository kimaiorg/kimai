"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function Activity() {
  return <div>This is my Activity page</div>;
}
export default AuthenticatedRoute(Activity, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
