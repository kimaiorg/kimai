import { Role } from "@/type_schema/role";
import {
  AlarmClockPlus,
  Boxes,
  Calendar,
  ClipboardPaste,
  FileChartColumnIncreasing,
  FilePlus,
  FileText,
  GitPullRequestCreateArrow,
  Home,
  ListTodo,
  Menu,
  PackageOpen,
  Settings,
  SquareUserRound,
  UserRound,
  Users,
  UsersRound,
  Wrench
} from "lucide-react";

export const timesheetNavMain = [
  {
    title: "Dashboard",
    translationKey: "sidebar.dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: false,
    allowRoles: [],
    items: undefined
  },
  {
    title: "Time tracking",
    translationKey: "sidebar.timesheet",
    url: "/timesheet",
    icon: AlarmClockPlus,
    isActive: false,
    allowRoles: [],
    items: [
      {
        title: "My times",
        translationKey: "sidebar.timesheet",
        url: "/timesheet",
        icon: AlarmClockPlus,
        isActive: false,
        allowRoles: []
      },
      {
        title: "Calendar",
        translationKey: "sidebar.calendar",
        url: "/calendar",
        icon: Calendar,
        isActive: false,
        allowRoles: []
      }
    ]
  },
  {
    title: "Request",
    translationKey: "sidebar.request",
    url: "/request",
    icon: GitPullRequestCreateArrow,
    isActive: false,
    allowRoles: [],
    items: undefined
  },
  {
    title: "Reporting",
    translationKey: "sidebar.reporting",
    url: "/reporting",
    icon: FileChartColumnIncreasing,
    isActive: false,
    allowRoles: [],
    items: undefined
  },
  {
    title: "Invoices",
    translationKey: "sidebar.invoice",
    url: "/invoice",
    icon: ClipboardPaste,
    isActive: true,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN],
    items: [
      {
        title: "Create invoice",
        translationKey: "sidebar.createInvoice",
        url: "/invoice",
        icon: FilePlus,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Invoice history",
        translationKey: "sidebar.invoiceHistory",
        url: "/invoice-history",
        icon: Menu,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      }
    ]
  },
  {
    title: "Tasks",
    translationKey: "sidebar.task",
    url: "/task",
    icon: ListTodo,
    isActive: false,
    allowRoles: [],
    item: undefined
  },
  {
    title: "Exspenses",
    translationKey: "sidebar.expense",
    url: "/expense",
    icon: FileText,
    isActive: false,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD],
    items: [
      {
        title: "Expenses",
        translationKey: "sidebar.expense",
        url: "/expense",
        icon: FileText,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      },
      {
        title: "Categories",
        translationKey: "sidebar.category",
        url: "/category",
        icon: Menu,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      }
    ]
  },
  {
    title: "Administration",
    translationKey: "sidebar.administration",
    url: "/customer",
    icon: PackageOpen,
    isActive: false,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD],
    items: [
      {
        title: "Customer",
        translationKey: "sidebar.customer",
        url: "/customer",
        icon: UserRound,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Projects",
        translationKey: "sidebar.project",
        url: "/project",
        icon: Boxes,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Activities",
        translationKey: "sidebar.activity",
        url: "/activity",
        icon: ListTodo,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      }
    ]
  },
  {
    title: "System",
    translationKey: "sidebar.system",
    url: "/user",
    icon: Settings,
    isActive: true,
    allowRoles: [Role.ADMIN, Role.SUPER_ADMIN],
    items: [
      {
        title: "Users",
        translationKey: "sidebar.user",
        url: "/user",
        icon: UsersRound,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN]
      },
      {
        title: "Roles",
        translationKey: "sidebar.role",
        url: "/role",
        icon: SquareUserRound,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN]
      },
      {
        title: "Teams",
        translationKey: "sidebar.team",
        url: "/team",
        icon: Users,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Settings",
        translationKey: "sidebar.setting",
        url: "/setting",
        icon: Wrench,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      }
    ]
  }
];
