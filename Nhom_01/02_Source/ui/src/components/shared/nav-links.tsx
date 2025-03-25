import { Role } from "@/type_schema/role";
import {
  AlarmClockPlus,
  Boxes,
  Calculator,
  Calendar,
  ClipboardPaste,
  ClipboardPlus,
  FileChartColumnIncreasing,
  FilePlus,
  FileText,
  Home,
  ListTodo,
  Menu,
  PackageOpen,
  PersonStanding,
  Scale,
  Settings,
  SquareUserRound,
  Tag,
  UserRound,
  Users,
  UsersRound,
  Wrench
} from "lucide-react";

export const timesheetNavMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: false,
    allowRoles: []
  },
  {
    title: "Time tracking",
    url: "/timesheet",
    icon: AlarmClockPlus,
    isActive: false,
    allowRoles: [],
    items: [
      {
        title: "My times",
        url: "/timesheet",
        icon: AlarmClockPlus,
        isActive: false,
        allowRoles: []
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
        isActive: false,
        allowRoles: []
      },
      {
        title: "Export",
        url: "/export",
        icon: ClipboardPlus,
        isActive: false,
        allowRoles: []
      }
    ]
  },
  {
    title: "Employment contract",
    url: "/working-time",
    icon: Scale,
    isActive: false,
    allowRoles: [],
    items: [
      {
        title: "Working time",
        url: "/working-time",
        icon: Calculator,
        isActive: false,
        allowRoles: []
      },
      {
        title: "Absence",
        url: "/absence",
        icon: PersonStanding,
        isActive: false,
        allowRoles: []
      }
    ]
  },
  {
    title: "Reporting",
    url: "/reporting",
    icon: FileChartColumnIncreasing,
    isActive: false,
    allowRoles: []
  },
  {
    title: "Invoices",
    url: "/invoice",
    icon: ClipboardPaste,
    isActive: true,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN],
    items: [
      {
        title: "Create invoice",
        url: "/invoice",
        icon: FilePlus,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Invoice history",
        url: "/invoice-history",
        icon: Menu,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      }
    ]
  },
  {
    title: "Tasks",
    url: "/task",
    icon: ListTodo,
    isActive: false,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
  },
  {
    title: "Exspenses",
    url: "/expense",
    icon: FileText,
    isActive: false,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD],
    items: [
      {
        title: "Expenses",
        url: "/expense",
        icon: FileText,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      },
      {
        title: "Categories",
        url: "/category",
        icon: Menu,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      }
    ]
  },
  {
    title: "Administration",
    url: "/customer",
    icon: PackageOpen,
    isActive: false,
    allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD],
    items: [
      {
        title: "Customer",
        url: "/customer",
        icon: UserRound,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Projects",
        url: "/project",
        icon: Boxes,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Activities",
        url: "/activity",
        icon: ListTodo,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      },
      {
        title: "Tags",
        url: "/tag",
        icon: Tag,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
      }
    ]
  },
  {
    title: "System",
    url: "/user",
    icon: Settings,
    isActive: true,
    allowRoles: [Role.ADMIN, Role.SUPER_ADMIN],
    items: [
      {
        title: "Users",
        url: "/user",
        icon: UsersRound,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN]
      },
      {
        title: "Roles",
        url: "/role",
        icon: SquareUserRound,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN]
      },
      {
        title: "Teams",
        url: "/team",
        icon: Users,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      },
      {
        title: "Settings",
        url: "/setting",
        icon: Wrench,
        isActive: false,
        allowRoles: [Role.SUPER_ADMIN, Role.ADMIN]
      }
    ]
  }
];
