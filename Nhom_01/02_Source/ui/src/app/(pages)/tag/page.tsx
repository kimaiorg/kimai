"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function Tag() {
  return <div>This is my Tag page</div>;
}
export default AuthenticatedRoute(Tag, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
