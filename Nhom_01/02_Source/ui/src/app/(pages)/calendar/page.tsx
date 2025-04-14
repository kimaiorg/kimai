"use client";

import MyCalendar from "@/app/(pages)/calendar/calendar";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Calendar() {
  return (
    <>
      <h1>Calendar</h1>
      <MyCalendar />
    </>
  );
}
export default AuthenticatedRoute(Calendar, []);
