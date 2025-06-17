import { mockApiToken } from "@/__tests__/feature/invoice/mockdata";
import {
  mockDashboardReportData,
  mockProjectData,
  mockWeekUserReportData
} from "@/__tests__/feature/reporting/mockdata";
import { expectAny } from "@/__tests__/utils/testUtils";
import { getManagementAccessToken } from "@/api/auth.api";
import { reportAxios } from "@/api/axios";
import { getAllProjects } from "@/api/project.api";
import { getDashboardReport, getProjectOverviewReport, getWeeklyOneUserReport } from "@/api/report.api";

jest.mock("@/api/axios");

// Mock Redux hook
jest.mock("@/lib/redux-toolkit/hooks", () => ({
  useAppSelector: jest.fn()
}));

jest.mock("@/api/auth.api", () => ({
  getManagementAccessToken: jest.fn()
}));

jest.mock("@/api/project.api", () => ({
  getAllProjects: jest.fn()
}));

const mockToken = mockApiToken;
describe("Reporting API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
  });

  it("should return weekly one user report", async () => {
    const mockRequest = {
      userId: "1",
      fromDate: "2023-01-01",
      toDate: "2023-01-31"
    };
    const mockResponse = mockWeekUserReportData;
    (reportAxios.get as jest.Mock).mockResolvedValue({ data: mockResponse });
    const result = await getWeeklyOneUserReport(mockRequest.userId, mockRequest.fromDate, mockRequest.toDate);
    console.log(result);
    expectAny(getManagementAccessToken).toHaveBeenCalled();

    expectAny(result).not.toBeNull();
    expectAny(result.user_id).toEqual(mockResponse.user_id);
    expectAny(result.fromDate).toEqual(mockResponse.fromDate);
    expectAny(result.toDate).toEqual(mockResponse.toDate);
    expectAny(result.entries).not.toBeNull();
    expectAny(result.entries.length).toEqual(mockResponse.entries.length);
  });

  it("should return project overview report", async () => {
    const mockRequest = {
      customerId: 1
    };
    const mockResponse = mockProjectData;
    (getAllProjects as jest.Mock).mockResolvedValue({
      metadata: {
        page: 1,
        size: 10,
        total: mockResponse.length,
        totalPages: 1
      },
      data: mockResponse
    });

    const result = await getProjectOverviewReport(mockRequest.customerId);
    expectAny(getManagementAccessToken).toHaveBeenCalled();

    expectAny(result).not.toBeNull();
    expectAny(result.customers).not.toBeNull();
    expectAny(result.customers.length).toBeGreaterThanOrEqual(mockResponse.length);
    expectAny(result.projects).not.toBeNull();
    expectAny(result.projects.length).toEqual(mockResponse.length);
  });

  it("should get dashboard data", async () => {
    const mockRequest = {
      userId: "1"
    };
    const mockResponse = mockDashboardReportData;

    (reportAxios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await getDashboardReport(mockRequest.userId);

    expectAny(getManagementAccessToken).toHaveBeenCalled();

    expectAny(result).not.toBeNull();
    expectAny(result.summary).not.toBeNull();
    expectAny(result.chartData).not.toBeNull();
  });
});
