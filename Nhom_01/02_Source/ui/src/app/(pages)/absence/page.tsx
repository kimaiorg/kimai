"use client";

import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Absence() {
  return <div>This is my Absence page</div>;
}
export default AuthenticatedRoute(Absence, []);
