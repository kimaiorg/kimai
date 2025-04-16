"use client";

import MyCalendar from "@/app/(pages)/calendar/calendar";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";

function Calendar() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-3">Calendar</h1>
      <MyCalendar />
    </>
  );
}
export default AuthenticatedRoute(Calendar, []);
