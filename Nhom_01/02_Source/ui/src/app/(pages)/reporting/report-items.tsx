import { FolderIcon, UserIcon, UsersIcon } from "@/components/shared/icons";
import { TimesheetTableSkeleton } from "@/components/skeleton/table-skeleton";
import { ReportView, ReportViewType } from "@/type_schema/report";
import { Role } from "@/type_schema/role";
import dynamic from "next/dynamic";

const ProjectOverview = dynamic(() => import("@/app/(pages)/reporting/project-overview"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});
// const WeeklyAll = dynamic(() => import("@/app/(pages)/reporting/weekly-all"), {
//   ssr: false,
//   loading: () => <TimesheetTableSkeleton />
// });
const WeeklyUser = dynamic(() => import("@/app/(pages)/reporting/weekly-user"), {
  ssr: false,
  loading: () => <TimesheetTableSkeleton />
});

const reportCards: ReportViewType[] = [
  {
    title: "Weekly view for one user",
    type: ReportView.WEEKLY_USER,
    icon: <UserIcon className="h-6 w-6 text-pink-500" />,
    component: WeeklyUser,
    allowRoles: []
  },
  // {
  //   title: "Weekly view for all users",
  //   type: ReportView.WEEKLY_ALL_USERS,
  //   icon: <UsersIcon className="h-6 w-6 text-pink-500" />,
  //   component: WeeklyAll,
  //   allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
  // },
  {
    type: ReportView.PROJECT_OVERVIEW,
    title: "Project overview",
    icon: <FolderIcon className="h-6 w-6 text-green-500" />,
    component: ProjectOverview,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
  }
];

const getReportViewByType = (type: ReportView): ReportViewType => reportCards.find((report) => report.type === type)!;

export { getReportViewByType, reportCards };
