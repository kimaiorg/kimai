import { FolderIcon, UserIcon, UsersIcon } from "@/components/shared/icons";
import { TimesheetTableSkeleton } from "@/components/skeleton/table-skeleton";
import { ReportViewType } from "@/type_schema/report";
import dynamic from "next/dynamic";

const ProjectOverview = dynamic(() => import("@/app/(pages)/reporting/project-overview"), {
  loading: () => <TimesheetTableSkeleton />
});
const WeeklyAll = dynamic(() => import("@/app/(pages)/reporting/weekly-all"), {
  loading: () => <TimesheetTableSkeleton />
});
const WeeklyUser = dynamic(() => import("@/app/(pages)/reporting/weekly-user"), {
  loading: () => <TimesheetTableSkeleton />
});

const reportCards: ReportViewType[] = [
  {
    title: "Weekly view for one user",
    icon: <UserIcon className="h-6 w-6 text-pink-500" />,
    component: WeeklyUser
  },

  {
    title: "Weekly view for all users",
    icon: <UsersIcon className="h-6 w-6 text-pink-500" />,
    component: WeeklyAll
  },
  {
    title: "Project overview",
    icon: <FolderIcon className="h-6 w-6 text-green-500" />,
    component: ProjectOverview
  }
];

export { reportCards };
