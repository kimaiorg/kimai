"use client";

import { CalendarEventType } from "@/type_schema/calendar";
import { TimesheetType } from "@/type_schema/timesheet";
import { formatDate } from "@fullcalendar/core/index.js";
import { Clock, User } from "lucide-react";

// Tooltip component
export default function EventTooltip({ event, position }: { event: TimesheetType; position: any }) {
  if (!event) return null;

  const { task, user, start_time, end_time } = event;

  return (
    <div
      className="absolute z-50 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3 border border-gray-200 w-64"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`
      }}
    >
      <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{task?.title}</div>

      <div className="flex items-center text-sm mb-2 text-gray-700 dark:text-gray-300">
        <Clock className="w-4 h-4 mr-2" />
        <span>
          {formatDate(start_time, { hour: "2-digit", minute: "2-digit" })} -
          {end_time ? formatDate(end_time, { hour: "2-digit", minute: "2-digit" }) : "Ongoing"}
        </span>
      </div>

      {task && <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">{task.description}</div>}

      <div className="mt-2">
        <div className="flex items-center text-sm mb-1 text-gray-700 dark:text-gray-300">
          <User className="w-4 h-4 mr-2" />
          <span>Assignee: {user.name}</span>
        </div>
      </div>
    </div>
  );
}
