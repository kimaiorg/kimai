"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function CreateExpense() {
  return <div>This is my CreateExpense page</div>;
}
export default AuthenticatedRoute(CreateExpense, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
