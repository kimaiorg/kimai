import { mockApiToken } from "@/__tests__/feature/invoice/mockdata";
import { mockDashboardReportData, mockProjectReviewReportData, mockWeekUserReportData } from "@/__tests__/feature/reporting/mockdata";
import { expectAny } from "@/__tests__/utils/testUtils";
import { getManagementAccessToken } from "@/api/auth.api";
import { reportAxios } from "@/api/axios";
import { getDashboardReport, getProjectOverviewReport, getWeeklyOneUserReport } from "@/api/report.api";

jest.mock("@/api/axios"); 

const mockToken = mockApiToken;
describe("Reporting API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return weekly one user report", async () => {
    const mockRequest = {
      userId: "1",
      fromDate: "2023-01-01",
      toDate: "2023-01-31"
    };
    const mockResponse = mockWeekUserReportData;
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (reportAxios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getWeeklyOneUserReport(mockRequest.userId, mockRequest.fromDate, mockRequest.toDate);

    expectAny(getManagementAccessToken).toHaveBeenCalled();
    expectAny(reportAxios.get).toHaveBeenCalledWith("/api/v1/reports/one-user", {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expectAny(result).not.toBeNull(); 
    expectAny(result.user_id).toEqual(mockResponse.user_id);
    expectAny(result.fromDate).toEqual(mockResponse.fromDate);
    expectAny(result.toDate).toEqual(mockResponse.toDate);
    expectAny(result.entries).not.toBeNull(); 
    expectAny(result.entries.length).toEqual(mockResponse.entries.length);
  });

  it("should return project overview report", async () => {
    const mockRequest = {
      customerId: 1, 
    };
    const mockResponse = mockProjectReviewReportData;
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (reportAxios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getProjectOverviewReport(mockRequest.customerId);
    expectAny(getManagementAccessToken).toHaveBeenCalled(); 

    expectAny(result).not.toBeNull(); 
    expectAny(result.customers).not.toBeNull();
    expectAny(result.customers.length).toEqual(mockResponse.customers.length);
    expectAny(result.projects).not.toBeNull();
    expectAny(result.projects.length).toEqual(mockResponse.projects.length); 
  });

  it("should get dashboard data", async () => {
    const mockRequest = {
      userId: "1"
    };
    const mockResponse = mockDashboardReportData;
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (reportAxios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getDashboardReport(mockRequest.userId);

    expectAny(getManagementAccessToken).toHaveBeenCalled();
    expectAny(reportAxios.get).toHaveBeenCalledWith(`/api/v1/reports/dashboard/${mockRequest.userId}`, {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expectAny(result).not.toBeNull();
    expectAny(result.summary).not.toBeNull(); 
    expectAny(result.chartData).not.toBeNull();
  }); 
});
