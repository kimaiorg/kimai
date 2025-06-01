import { mockApiToken } from "@/__tests__/feature/invoice/mockdata";
import { expectAny } from "@/__tests__/utils/testUtils";
import { getManagementAccessToken } from "@/api/auth.api";
import { invoiceAxios } from "@/api/axios";
import { filterInvoices, getAllInvoiceHistories, saveInvoice, updateInvoiceStatus } from "@/api/invoice.api";
jest.mock("@/api/axios");
jest.mock("@/api/auth.api");

const mockToken = mockApiToken;
describe("Invoice API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should filter invoices", async () => {
    const mockRequest = {
      activities: [160, 148],
      customer_id: 99,
      from: "2025-04-01T17:00:00.000Z",
      project_id: 129,
      to: "2025-07-01T17:00:00.000Z"
    };
    const mockResponse = {
      success: true,
      data: {
        invoiceId: 174876436,
        activities: [
          { id: 160, name: "Dynamic Pricing Engine", tasks: [] },
          { id: 148, name: "Customer Journey Optimization", tasks: [] }
        ]
      }
    };
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (invoiceAxios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await filterInvoices(mockRequest);

    expectAny(getManagementAccessToken).toHaveBeenCalled();
    expectAny(invoiceAxios.post).toHaveBeenCalledWith("/api/v1/invoices/filter", mockRequest, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expectAny(result).not.toBeNull();
    expectAny(result.success).toEqual(mockResponse.success);
    expectAny(result.data.activities.length).toEqual(mockResponse.data.activities.length);
  });

  it("should save an invoice", async () => {
    const mockInvoice = {
      comment: "No note",
      dueDays: 30,
      filteredInvoiceId: 5,
      userId: "auth0|67d991b80f7916d942e25d1d"
    };
    const mockStatus = 201;
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (invoiceAxios.post as jest.Mock).mockResolvedValue({ status: mockStatus });

    const result = await saveInvoice(mockInvoice);

    expectAny(getManagementAccessToken).toHaveBeenCalled();
    expectAny(invoiceAxios.post).toHaveBeenCalledWith("/api/v1/invoices/generate", mockInvoice, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expectAny(result).toBe(mockStatus);
  });

  it("should get all invoice histories", async () => {
    const mockResponse = { data: { data: { items: [] } } };
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (invoiceAxios.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getAllInvoiceHistories();

    expectAny(getManagementAccessToken).toHaveBeenCalled();
    expectAny(invoiceAxios.get).toHaveBeenCalledWith("/api/v1/invoices?", {
      headers: {
        Authorization: `Bearer ${mockToken}`
      }
    });
    expectAny(result).toEqual(mockResponse.data.data);
  });

  it("should update invoice status", async () => {
    const mockRequest = { status: "PAID", comment: "" };
    const mockInvoiceId = "123";
    const mockStatus = 200;
    (getManagementAccessToken as jest.Mock).mockResolvedValue(mockToken);
    (invoiceAxios.put as jest.Mock).mockResolvedValue({ status: mockStatus });

    const result = await updateInvoiceStatus(mockRequest, mockInvoiceId);

    expectAny(getManagementAccessToken).toHaveBeenCalled();
    expectAny(invoiceAxios.put).toHaveBeenCalledWith(`/api/v1/invoices/${mockInvoiceId}`, mockRequest, {
      headers: { Authorization: `Bearer ${mockToken}` }
    });
    expectAny(result).toBe(mockStatus);
  });
});
