import { TimesheetTableSkeleton } from "@/components/skeleton/table-skeleton";
import { RequestViewType } from "@/type_schema/request";
import { Clock3, Home, Stethoscope } from "lucide-react";
import dynamic from "next/dynamic";

const TimesheetRequest = dynamic(() => import("@/app/(pages)/request/timesheet/page"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});
const ExpenseRequest = dynamic(() => import("@/app/(pages)/request/expense/page"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});
const AbsenceRequest = dynamic(() => import("@/app/(pages)/request/absence/page"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});

const requestCards: RequestViewType[] = [
  {
    id: "timesheet",
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
    id: "expense",
    title: "Expense requests",
    icon: (
      <Stethoscope
        className="h-24 w-24 text-sky-600"
        strokeWidth={1}
      />
    ),
    component: ExpenseRequest,
    background: "bg-sky-100",
    description: "Manage expense requests",
    textColor: "text-sky-600"
  },

  {
    id: "absence",
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

export { requestCards, getRequestById };
