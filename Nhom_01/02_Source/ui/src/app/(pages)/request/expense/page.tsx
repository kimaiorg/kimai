"use client";

import { getRequestById } from "@/app/(pages)/request/request-items";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { RequestViewType } from "@/type_schema/request";
import { Role } from "@/type_schema/role";

function ExpenseUpdateRequestPage() {
  const request: RequestViewType = getRequestById("expense")!;
  return <div>This is my update expense request page</div>;
}
export default AuthenticatedRoute(ExpenseUpdateRequestPage, [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]);
