/* eslint-disable @typescript-eslint/no-require-imports */
import { mockProjectReviewReportData, mockReportCards, mockUserList, mockUserObj, mockUserStateObj, mockWeekUserReportData } from "@/__tests__/feature/reporting/mockdata";
import { expectAny } from "@/__tests__/utils/testUtils";
import ReportingPageComponent, { ReportingPage } from "@/app/(pages)/reporting/page";
import { ProjectOverviewReport } from "@/app/(pages)/reporting/project-overview";
import { getReportViewByType } from "@/app/(pages)/reporting/report-items";
import { WeeklyUserReport } from "@/app/(pages)/reporting/weekly-user";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { ReportView } from "@/type_schema/report";
import { Role } from "@/type_schema/role";
import { useUser } from "@auth0/nextjs-auth0/client";
import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FolderIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';

// Mock API modules
jest.mock("@/api/customer.api");
jest.mock("@/api/project.api");
jest.mock("@/api/activity.api"); 
jest.mock('@/api/report.api', () => ({
  getWeeklyOneUserReport: jest.fn(),
  getProjectOverviewReport: jest.fn(),
}));
// Get the mocked modules
const customerApi = require("@/api/customer.api");
const projectApi = require("@/api/project.api");
const activityApi = require("@/api/activity.api");
const reportApi = require("@/api/report.api");

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: () => '/reporting',
}));

// Mock Auth0 hook
jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn()
}));

// Mock Redux hook
jest.mock('@/lib/redux-toolkit/hooks', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('@/app/(pages)/reporting/report-items', () => ({
  getReportViewByType: jest.fn(),
  reportCards: mockReportCards
})); 

jest.mock('xlsx', () => ({
  writeFile: jest.fn(), 
  utils: {
    aoa_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
}));
function createMockPointerEvent(
  type: string,
  props: PointerEventInit = {}
): PointerEvent {
  const event = new Event(type, props) as PointerEvent;
  Object.assign(event, {
    button: props.button ?? 0,
    ctrlKey: props.ctrlKey ?? false,
    pointerType: props.pointerType ?? "mouse",
  });
  return event;
}

// Assign the mock function to the global window object
window.PointerEvent = createMockPointerEvent as any;

// Mock HTMLElement methods
Object.assign(window.HTMLElement.prototype, {
  scrollIntoView: jest.fn(),
  releasePointerCapture: jest.fn(),
  hasPointerCapture: jest.fn(),
});

describe("Reporting Page", () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => "mock-pdf-url");
    global.URL.revokeObjectURL = jest.fn();
 
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
   
    (useAppSelector as unknown as jest.Mock).mockImplementation((selector) => { 
      if (selector.toString().endsWith('state.userListState.users')) {
        return mockUserList;
      }
      if (selector.toString().endsWith('state.userState.privilege')) {
        return mockUserStateObj.privilege;
      }
      if (selector.toString().endsWith('state.userState')) {
        return mockUserStateObj;
      }
      return undefined;
    });
    (useUser as jest.Mock).mockReturnValue({
      user: mockUserObj,
      error: null,
      isLoading: false
    });
    customerApi.getAllCustomers.mockResolvedValue({ data: [] });
    projectApi.getAllProjects.mockResolvedValue({ data: [] });
    activityApi.getAllActivities.mockResolvedValue({ data: [] }); 
    reportApi.getWeeklyOneUserReport.mockResolvedValue(mockWeekUserReportData);
    reportApi.getProjectOverviewReport.mockResolvedValue(mockProjectReviewReportData);
 
  });

  it("renders error page when unauthorized", async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      error: null,
      isLoading: false
    });

    render(<ReportingPageComponent />);
    await waitFor(() => {
      expectAny(screen.getByText("401")).toBeInTheDocument();
      expectAny(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });

  it("Render week user reporting ui", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      title: "Weekly view for one user",
      type: ReportView.WEEKLY_USER,
      icon: <UserIcon className="h-6 w-6 text-pink-500" />,
      component: WeeklyUserReport,
      allowRoles: []
    });   
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getWeeklyOneUserReport).toHaveBeenCalled(); 
    }); 
    expectAny(screen.getByRole("heading", { level: 1, name: "Reporting" })).toBeInTheDocument(); 
    expectAny(screen.getByRole("heading", { level: 2, name: "Weekly view for one user" })).toBeInTheDocument();  
    await waitFor(() => {   
      expectAny(screen.getByText("Project overview")).toBeInTheDocument();
      
      expectAny(screen.getByRole("button", { name: /excel/i })).toBeInTheDocument();
      expectAny(screen.getByRole("button", { name: /pdf/i })).toBeInTheDocument();

      const selectElements = screen.getAllByRole('combobox');
      expectAny(selectElements.length).toBe(2);

      const table = screen.getByRole('table');
      const rowgroups = within(table).getAllByRole('rowgroup');
      const thead = rowgroups.find(el => el.tagName.toLowerCase() === 'thead')!;
      const headers = within(within(thead).getByRole('row')).getAllByRole('columnheader');
      const expectedHeaders = [
        'Task',
        'Total',
        'MON 2',
        'TUE 3',
        'WED 4',
        'THU 5',
        'FRI 6',
        'SAT 7',
        'SUN 8'
      ];
    
      expectedHeaders.forEach((text, index) => {
        expectAny(headers[index]).toHaveTextContent(text);
      });
    });
  });
  
  it("View report for the current user", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      title: "Weekly view for one user",
      type: ReportView.WEEKLY_USER,
      icon: <UserIcon className="h-6 w-6 text-pink-500" />,
      component: WeeklyUserReport,
      allowRoles: []
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getWeeklyOneUserReport).toHaveBeenCalled(); 
    }); 
    expectAny(screen.getByRole("heading", { level: 1, name: "Reporting" })).toBeInTheDocument(); 
    expectAny(screen.getByRole("heading", { level: 2, name: "Weekly view for one user" })).toBeInTheDocument();  
    await waitFor(() => {
      expectAny(screen.getByText("Superadmin")).toBeInTheDocument();
      const selects = screen.getAllByRole('combobox');
      const hasSuperadmin = selects.some(select => select.textContent?.includes('Superadmin'));
      expectAny(hasSuperadmin).toBe(true);
      expectAny(screen.getByRole("button", { name: /excel/i })).toBeInTheDocument();
      expectAny(screen.getByRole("button", { name: /pdf/i })).toBeInTheDocument();
    });
     
    await waitFor(async () => {
      expectAny(reportApi.getWeeklyOneUserReport).toHaveBeenCalled(); 
    }); 
    
    const table = screen.getByRole('table');
    const rowgroups = within(table).getAllByRole('rowgroup');
    const tbody = rowgroups.find(el => el.tagName.toLowerCase() === 'tbody')!;
    const rows = within(tbody).getAllByRole('row'); 
    expectAny(rows.length).toBeGreaterThan(1); 
    expectAny(within(rows[0]).getByText('Develop batch APPROVED system')).toBeInTheDocument(); 
    expectAny(within(rows[1]).getByText('Develop machine learning pipeline')).toBeInTheDocument(); 
    expectAny(within(rows[2]).getByText('Create predictive analytics system')).toBeInTheDocument(); 
    expectAny(within(rows[3]).getByText('Create content management system')).toBeInTheDocument(); 
    expectAny(within(rows[4]).getByText('Develop virtual reality experience')).toBeInTheDocument(); 
    expectAny(within(rows[5]).getByText('Develop autonomous decision system')).toBeInTheDocument(); 
    expectAny(within(rows[6]).getByText('Total')).toBeInTheDocument(); 
  }); 

  it("View report for a specified user", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      title: "Weekly view for one user",
      type: ReportView.WEEKLY_USER,
      icon: <UserIcon className="h-6 w-6 text-pink-500" />,
      component: WeeklyUserReport,
      allowRoles: []
    }); 
    const mockUserEvent = userEvent.setup();
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getWeeklyOneUserReport).toHaveBeenCalled(); 
    }); 
    expectAny(screen.getByRole("heading", { level: 1, name: "Reporting" })).toBeInTheDocument(); 
    expectAny(screen.getByRole("heading", { level: 2, name: "Weekly view for one user" })).toBeInTheDocument();  
    const selects = screen.getAllByRole('combobox');
    const userCombobox = selects.find(select => select.textContent!.includes('Superadmin'))!;
    await mockUserEvent.click(userCombobox); 
    const targetOption = screen.getByText('Heny Louria'); 
    await mockUserEvent.click(targetOption);
    await waitFor(() => {
      expectAny(userCombobox).toHaveTextContent('Heny Louria');
    });

    const table = screen.getByRole('table');
    const rowgroups = within(table).getAllByRole('rowgroup');
    const tbody = rowgroups.find(el => el.tagName.toLowerCase() === 'tbody')!;
    const rows = within(tbody).getAllByRole('row'); 
    expectAny(rows.length).toBeGreaterThan(1);  
    
  }); 

  it("Export week user report as Excel", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      title: "Weekly view for one user",
      type: ReportView.WEEKLY_USER,
      icon: <UserIcon className="h-6 w-6 text-pink-500" />,
      component: WeeklyUserReport,
      allowRoles: []
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getWeeklyOneUserReport).toHaveBeenCalled(); 
    }); 
    const mockUserEvent = userEvent.setup(); 
    const excelButton = screen.getByRole('button', { name: /excel/i });
    await mockUserEvent.click(excelButton);
    expectAny(excelButton).toBeInTheDocument(); 
    expectAny(XLSX.writeFile).toHaveBeenCalled();
  });
  
  it("Export week user report as PDF", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      title: "Weekly view for one user",
      type: ReportView.WEEKLY_USER,
      icon: <UserIcon className="h-6 w-6 text-pink-500" />,
      component: WeeklyUserReport,
      allowRoles: []
    });
    render(<ReportingPage />);
    const mockUserEvent = userEvent.setup(); 
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null); 
    const pdfButton = screen.getByRole('button', { name: /pdf/i });
    await mockUserEvent.click(pdfButton); 
    expectAny(openSpy).toHaveBeenCalled();

    openSpy.mockRestore();
  });
  
  it("Render project review report ui", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      type: ReportView.PROJECT_OVERVIEW,
      title: "Project overview",
      icon: <FolderIcon className="h-6 w-6 text-green-500" />,
      component: ProjectOverviewReport,
      allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getProjectOverviewReport).toHaveBeenCalled();
    });
    expectAny(screen.getByRole("heading", { level: 1, name: "Reporting" })).toBeInTheDocument(); 
    expectAny(screen.getByRole("heading", { level: 2, name: "Project overview" })).toBeInTheDocument();  
    const selectElement = screen.getByRole('combobox');
    expectAny(selectElement).toBeInTheDocument();

    const table = screen.getByRole('table');
    const rowgroups = within(table).getAllByRole('rowgroup');
    const thead = rowgroups.find(el => el.tagName.toLowerCase() === 'thead')!;
    const headers = within(within(thead).getByRole('row')).getAllByRole('columnheader');
    const expectedHeaders = [ 				
      'Name',
      'Hourly Quota',
      'Budget',
      'Last Entry',
      'This Month',
      'Total',
      'Not Exported', 
    ];
    
    expectedHeaders.forEach((text, index) => {
      expectAny(headers[index]).toHaveTextContent(text);
    });
  });
  
  it("View project review report of the current user", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      type: ReportView.PROJECT_OVERVIEW,
      title: "Project overview",
      icon: <FolderIcon className="h-6 w-6 text-green-500" />,
      component: ProjectOverviewReport,
      allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getProjectOverviewReport).toHaveBeenCalled();
    });
    expectAny(screen.getByRole("heading", { level: 1, name: "Reporting" })).toBeInTheDocument(); 
    expectAny(screen.getByRole("heading", { level: 2, name: "Project overview" })).toBeInTheDocument();  
    const table = screen.getByRole('table');
    const rowgroups = within(table).getAllByRole('rowgroup');
    const tbody = rowgroups.find(el => el.tagName.toLowerCase() === 'tbody')!;
    const rows = within(tbody).getAllByRole('row');
    expectAny(rows.length).toBeGreaterThan(4);
    expectAny(within(rows[0]).getByText('Marrie Curiie')).toBeInTheDocument(); 
    expectAny(within(rows[1]).getByText('Workflow Automation System')).toBeInTheDocument(); 
    expectAny(within(rows[1]).getByText('3010')).toBeInTheDocument(); 
    expectAny(within(rows[1]).getByText('2025-04-10')).toBeInTheDocument();  
    expectAny(within(rows[1]).getByText('1939:00')).toBeInTheDocument();  
    
    expectAny(within(rows[2]).getByText('Alice Smith')).toBeInTheDocument(); 
    expectAny(within(rows[3]).getByText('Enterprise Resource Planning')).toBeInTheDocument(); 
    expectAny(within(rows[3]).getByText('1211')).toBeInTheDocument(); 
    expectAny(within(rows[3]).getByText('2026-04-05')).toBeInTheDocument();  
    expectAny(within(rows[3]).getByText('4391:00')).toBeInTheDocument();  

    expectAny(within(rows[4]).getByText('Bob Johnson')).toBeInTheDocument(); 
    expectAny(within(rows[5]).getByText('Event Management Solution')).toBeInTheDocument(); 
    expectAny(within(rows[5]).getByText('4086')).toBeInTheDocument(); 
    expectAny(within(rows[5]).getByText('2026-05-05')).toBeInTheDocument(); 
    expectAny(within(rows[5]).getByText('3209:00')).toBeInTheDocument(); 

    expectAny(within(rows[6]).getByText('Sophia Rodriguez')).toBeInTheDocument(); 
    expectAny(within(rows[7]).getByText('Logistics Optimization')).toBeInTheDocument();  
    expectAny(within(rows[7]).getByText('2818')).toBeInTheDocument();  
    expectAny(within(rows[7]).getByText('2025-03-15')).toBeInTheDocument();  
    expectAny(within(rows[7]).getByText('5057:00')).toBeInTheDocument();   
  });

  it("View project review report of a specified user", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      type: ReportView.PROJECT_OVERVIEW,
      title: "Project overview",
      icon: <FolderIcon className="h-6 w-6 text-green-500" />,
      component: ProjectOverviewReport,
      allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getProjectOverviewReport).toHaveBeenCalled(); 
    }); 
    expectAny(screen.getByRole("heading", { level: 1, name: "Reporting" })).toBeInTheDocument(); 
    expectAny(screen.getByRole("heading", { level: 2, name: "Project overview" })).toBeInTheDocument();  
    const mockUserEvent = userEvent.setup();
    const selects = screen.getAllByRole('combobox');
    const userCombobox = selects.find(select => select.textContent!.includes('All Customers'))!;
    await mockUserEvent.click(userCombobox); 
    const allElements = screen.getAllByText('Sophia Rodriguez');
    const targetOption = allElements.find(el => el.tagName.toLowerCase() === 'option')!;
    await mockUserEvent.click(targetOption);
    await waitFor(() => {
      expectAny(userCombobox).toHaveTextContent('Sophia Rodriguez');
    });

    const table = screen.getByRole('table');
    const rowgroups = within(table).getAllByRole('rowgroup');
    const tbody = rowgroups.find(el => el.tagName.toLowerCase() === 'tbody')!;
    const rows = within(tbody).getAllByRole('row'); 
    expectAny(rows.length).toBeGreaterThan(1);  
    
  });

  it("Export project review report as Excel", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      type: ReportView.PROJECT_OVERVIEW,
      title: "Project overview",
      icon: <FolderIcon className="h-6 w-6 text-green-500" />,
      component: ProjectOverviewReport,
      allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getProjectOverviewReport).toHaveBeenCalled(); 
    }); 
    const mockUserEvent = userEvent.setup(); 
    const excelButton = screen.getByRole('button', { name: /excel/i });
    await mockUserEvent.click(excelButton);
    expectAny(excelButton).toBeInTheDocument(); 
    expectAny(XLSX.writeFile).toHaveBeenCalled();
  });
  
  it("Export project review report as PDF", async () => {
    (getReportViewByType as jest.Mock).mockReturnValue({
      type: ReportView.PROJECT_OVERVIEW,
      title: "Project overview",
      icon: <FolderIcon className="h-6 w-6 text-green-500" />,
      component: ProjectOverviewReport,
      allowRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.TEAM_LEAD]
    });
    render(<ReportingPage />);
    await waitFor(async () => {
      expectAny(reportApi.getProjectOverviewReport).toHaveBeenCalled(); 
    }); 
    const mockUserEvent = userEvent.setup(); 
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null); 
    const pdfButton = screen.getByRole('button', { name: /pdf/i });
    await mockUserEvent.click(pdfButton); 
    expectAny(openSpy).toHaveBeenCalled();

    openSpy.mockRestore();
  });
});
