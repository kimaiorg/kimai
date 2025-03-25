"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function Team() {
  return <div>This is my Team page</div>;
}
export default AuthenticatedRoute(Team, [Role.SUPER_ADMIN, Role.ADMIN]);
