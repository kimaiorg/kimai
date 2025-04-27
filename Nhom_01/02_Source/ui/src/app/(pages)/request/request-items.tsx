import { UsersIcon } from "@/components/shared/icons";
import { TimesheetTableSkeleton } from "@/components/skeleton/table-skeleton";
import { RequestViewType } from "@/type_schema/request";
import { Stethoscope } from "lucide-react";
import dynamic from "next/dynamic";

const TimesheetRequest = dynamic(() => import("@/app/(pages)/request/timesheet-request"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});
const ExpenseRequest = dynamic(() => import("@/app/(pages)/request/expense-request"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});

const requestCards: RequestViewType[] = [
  {
    title: "Timesheet requests",
    icon: (
      <Stethoscope
        className="h-24 w-24 text-amber-600"
        strokeWidth={1}
      />
    ),
    component: TimesheetRequest,
    background: "bg-amber-100",
    description: "Timesheet requests"
  },

  {
    title: "Expense requests",
    icon: <UsersIcon className="h-6 w-6 text-pink-500" />,
    component: ExpenseRequest,
    background: "bg-pink-100",
    description: "Expense requests"
  }
];

export { requestCards };
