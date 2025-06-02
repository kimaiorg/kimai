/* eslint-disable @typescript-eslint/no-require-imports */
import { mockInvoiceData, mockUserObj, mockUserStateObj } from "@/__tests__/feature/invoice/mockdata";
import { expectAny } from "@/__tests__/utils/testUtils";
import InvoicePage, { InvoiceContent } from "@/app/(pages)/invoice/page";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { useUser } from "@auth0/nextjs-auth0/client";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

// Mock API modules
jest.mock("@/api/customer.api");
jest.mock("@/api/project.api");
jest.mock("@/api/activity.api");
jest.mock("@/api/invoice.api");
// Get the mocked modules
const customerApi = require("@/api/customer.api");
const projectApi = require("@/api/project.api");
const activityApi = require("@/api/activity.api");
const invoiceApi = require("@/api/invoice.api");

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

// Mock Auth0 hook
jest.mock("@auth0/nextjs-auth0/client", () => ({
  useUser: jest.fn()
}));

// Mock Redux hook
jest.mock("@/lib/redux-toolkit/hooks", () => ({
  useAppSelector: jest.fn()
}));

describe("Invoice Page", () => {
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
    (useAppSelector as unknown as jest.Mock).mockReturnValue({
      userState: mockUserStateObj,
      userListState: { users: [] }
    });
    (useUser as jest.Mock).mockReturnValue({
      user: mockUserObj,
      error: null,
      isLoading: false
    });
    customerApi.getAllCustomers.mockResolvedValue({ data: [] });
    projectApi.getAllProjects.mockResolvedValue({ data: [] });
    activityApi.getAllActivities.mockResolvedValue({ data: [] });
    invoiceApi.saveInvoice.mockResolvedValue(200);
    invoiceApi.filterInvoices.mockResolvedValue(mockInvoiceData);
  });

  it("renders error page when unauthorized", async () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      error: null,
      isLoading: false
    });

    render(<InvoicePage />);
    await waitFor(() => {
      expectAny(screen.getByText("401")).toBeInTheDocument();
      expectAny(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });

  it("Render invoice ui", async () => {
    render(<InvoiceContent />);
    await waitFor(() => {
      expectAny(screen.getByText("Invoices")).toBeInTheDocument();
      expectAny(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
      expectAny(screen.getByText("Please select a project")).toBeInTheDocument();
      expectAny(screen.getByText("Please select an invoice")).toBeInTheDocument();
    });
  });

  it("Filter invoice", async () => {
    render(<InvoiceContent />);
    await waitFor(() => {
      expectAny(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    await waitFor(async () => {
      expectAny(invoiceApi.filterInvoices).toHaveBeenCalled();
      expectAny(screen.queryByText("Please select an invoice")).toBeNull();
    });
    expectAny(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    expectAny(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
  });

  it("Preview invoice", async () => {
    render(<InvoiceContent />);
    expectAny(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    await waitFor(() => {
      expectAny(invoiceApi.filterInvoices).toHaveBeenCalled();
      expectAny(screen.queryByText("Please select an invoice")).toBeNull();
      expectAny(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: /preview/i }));
    await waitFor(() => {
      const previewHeading = screen.getByRole("heading", { level: 2, name: "Preview" });
      expectAny(previewHeading).toBeInTheDocument();
    });
  });

  it("Save invoice successfully", async () => {
    render(<InvoiceContent />);
    await waitFor(() => {
      expectAny(screen.getByRole("button", { name: /filter/i })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    await waitFor(() => {
      expectAny(invoiceApi.filterInvoices).toHaveBeenCalled();
    });
    expectAny(screen.getByRole("button", { name: /export/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /export/i }));
    await waitFor(() => {
      expectAny(invoiceApi.saveInvoice).toHaveBeenCalled();
    });
  });
});
