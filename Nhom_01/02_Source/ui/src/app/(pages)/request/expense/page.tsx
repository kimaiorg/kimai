"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";

function ExpenseUpdateRequestPage() {
  return <div>This is my update expense request page</div>;
}
export default AuthenticatedRoute(ExpenseUpdateRequestPage, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
