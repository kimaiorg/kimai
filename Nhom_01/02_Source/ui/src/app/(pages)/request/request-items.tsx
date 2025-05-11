import { TableWithHeaderSkeleton } from "@/components/skeleton/table-skeleton";
import { RequestViewType } from "@/type_schema/request";
import { Clock3, Home, Stethoscope } from "lucide-react";
import dynamic from "next/dynamic";

const enum RequestPageType {
  TIMESHEET = "timesheet",
  EXPENSE = "expense",
  ABSENCE = "absence",
  TASK = "task"
}

const TimesheetRequest = dynamic(() => import("@/app/(pages)/request/timesheet/page"), {
  ssr: false,
  loading: () => <TableWithHeaderSkeleton />
});
// const ExpenseRequest = dynamic(() => import("@/app/(pages)/request/expense/page"), {
//   ssr: false,
//   loading: () => <TableWithHeaderSkeleton />
// });
const AbsenceRequest = dynamic(() => import("@/app/(pages)/request/absence/page"), {
  ssr: false,
  loading: () => <TableWithHeaderSkeleton />
});
const TaskRequest = dynamic(() => import("@/app/(pages)/request/task/page"), {
  ssr: false,
  loading: () => <TableWithHeaderSkeleton />
});

const requestCards: RequestViewType[] = [
  {
    id: RequestPageType.TIMESHEET,
    title: "Timesheet requests",
    icon: (
      <Clock3
        className="h-24 w-24 text-violet-600"
        strokeWidth={1}
      />
    ),
    component: TimesheetRequest,
    background: "bg-violet-100",
    description: "Manage timesheet requests",
    textColor: "text-violet-600"
  },
  {
    id: RequestPageType.TASK,
    title: "Task expense requests",
    icon: (
      <Stethoscope
        className="h-24 w-24 text-lime-600"
        strokeWidth={1}
      />
    ),
    component: TaskRequest,
    background: "bg-lime-100",
    description: "Manage task expense requests",
    textColor: "text-lime-600"
  },
  // {
  //   id: RequestPageType.EXPENSE,
  //   title: "Expense requests",
  //   icon: (
  //     <Stethoscope
  //       className="h-24 w-24 text-sky-600"
  //       strokeWidth={1}
  //     />
  //   ),
  //   component: ExpenseRequest,
  //   background: "bg-sky-100",
  //   description: "Manage expense requests",
  //   textColor: "text-sky-600"
  // },
  {
    id: RequestPageType.ABSENCE,
    title: "Absence requests",
    icon: (
      <Home
        className="h-24 w-24 text-amber-600"
        strokeWidth={1}
      />
    ),
    component: AbsenceRequest,
    background: "bg-amber-100",
    description: "Manage absence requests",
    textColor: "text-amber-600"
  }
];

const getRequestById = (id: string) => requestCards.find((request) => request.id === id);

export { getRequestById, requestCards, RequestPageType };
