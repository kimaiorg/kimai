"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllProjects } from "@/api/project.api";
import { getAllTasks } from "@/api/task.api";
import { getAllMyTimesheets } from "@/api/timesheet.api";
import EventTooltip from "@/app/(pages)/calendar/event-tooltip";
import { CalendarManualTimesheetCreateDialog } from "@/app/(pages)/timesheet/calendar-timesheet-create-dialog";
import CalendarTimesheetViewDialog from "@/app/(pages)/timesheet/calendar-timesheet-view-dialog";
import { CalendarSkeleton } from "@/components/skeleton/calendar-skeleton";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { CalendarEventType } from "@/type_schema/calendar";
import { TimesheetStatus, TimesheetType } from "@/type_schema/timesheet";
import { UserType } from "@/type_schema/user.schema";
import { useUser } from "@auth0/nextjs-auth0/client";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useRef, useState } from "react";

type CreateTimeSheetProps = {
  startTime?: string;
  endTime?: string;
};

export default function MyCalendar() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState<CalendarEventType[] | null>(null);
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [openCreatingTimesheetDialog, setOpenCreatingTimesheetDialog] = useState<boolean>(false);
  const [openViewingTimesheetDialog, setOpenViewingTimesheetDialog] = useState<boolean>(false);

  const [creatingTimesheet, setCreatingTimesheet] = useState<CreateTimeSheetProps>({});
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const [timesheetInfo, setTimesheetInfo] = useState<TimesheetType | null>(null);

  const { user: currentUser } = useUser();

  const handleFetchTimesheets = () => {
    const fetchTimesheets = async () => {
      const [projects, activities, tasks] = await Promise.all([
        getAllProjects(1, 250),
        getAllActivities(1, 250),
        getAllTasks(1, 250)
      ]);
      const result = await getAllMyTimesheets();
      const timesheets: TimesheetType[] = result.data
        .map((timesheet) => {
          const { user_id, project_id, activity_id, task_id, ...rest } = timesheet;
          return {
            ...rest,
            status: timesheet.status as TimesheetStatus,
            user: userList.find((user) => user.user_id === user_id)!,
            project: projects.data.find((project) => project.id === project_id)!,
            activity: activities.data.find((activity) => activity.id === activity_id)!,
            task: tasks.data.find((task) => task.id === task_id)!
          };
        })
        .filter((timesheet) => timesheet.user.user_id === currentUser?.sub);
      const eventList = timesheets.map((timesheet) => ({
        id: timesheet.id.toString(),
        title: timesheet.task!.title,
        start: timesheet.start_time,
        end: timesheet.end_time || new Date().toISOString(),
        backgroundColor: "#EA4335",
        timesheet: timesheet
      }));
      setEvents(eventList);
    };
    fetchTimesheets();
  };

  useEffect(() => {
    handleFetchTimesheets();
  }, []);

  useEffect(() => {
    if (!calendarRef.current || !events) return;

    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, bootstrap5Plugin, interactionPlugin],
      initialView: "dayGridMonth",
      weekNumbers: true,
      nowIndicator: true,
      slotMinTime: "06:00:00",
      slotMaxTime: "23:00:00",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "timeGridDay,timeGridWeek,dayGridMonth"
      },
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
        startTime: "08:00",
        endTime: "17:00"
      },
      events: events!,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true, // Allow "more" link when too many events
      eventOverlap: true, // Allow events to overlap
      allDaySlot: false,
      select: (info) => {
        setOpenCreatingTimesheetDialog(true);
        setCreatingTimesheet({ startTime: info.startStr, endTime: info.endStr });
        calendar.unselect();
      },
      // Tooltip related event handlers
      eventMouseEnter: (info) => {
        const rect = info.el.getBoundingClientRect();
        setTooltipPosition({
          x: rect.right + 10, // Position tooltip to the right of the event
          y: rect.top // Align with the top of the event
        });
        setTooltipData(info.event.extendedProps.timesheet);
      },

      eventMouseLeave: () => {
        setTooltipData(null);
      },

      eventClick: (info) => {
        setTimesheetInfo(info.event.extendedProps.timesheet);
        setOpenViewingTimesheetDialog(true);
      }
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [events]);

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
        {!calendarRef.current && <CalendarSkeleton />}
        {calendarRef && (
          <div
            ref={calendarRef}
            className="min-h-[600px]"
          ></div>
        )}
        {openCreatingTimesheetDialog && creatingTimesheet.startTime && creatingTimesheet.endTime && (
          <CalendarManualTimesheetCreateDialog
            fetchTimesheets={handleFetchTimesheets}
            openDialog={openCreatingTimesheetDialog}
            setOpenDialog={setOpenCreatingTimesheetDialog}
            startTime={creatingTimesheet.startTime!}
            endTime={creatingTimesheet.endTime!}
          >
            <div></div>
          </CalendarManualTimesheetCreateDialog>
        )}
        {tooltipData && (
          <EventTooltip
            event={tooltipData}
            position={tooltipPosition}
          />
        )}
        {timesheetInfo && (
          <CalendarTimesheetViewDialog
            timesheet={timesheetInfo}
            open={openViewingTimesheetDialog}
            setOpen={(open) => {
              setOpenViewingTimesheetDialog(open);
              if (!open) setTimesheetInfo(null);
            }}
          >
            <div></div>
          </CalendarTimesheetViewDialog>
        )}
      </div>
    </>
  );
}
