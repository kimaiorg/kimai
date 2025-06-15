"use client";

import { getAllInvoiceHistories } from "@/api/invoice.api";
import FilterInvoiceHistoryModal from "@/app/(pages)/invoice-history/filter-modal";
import InvoiceStatusUpdateDialog from "@/app/(pages)/invoice-history/invoice-history-status-dialog";
import InvoiceSendMailDialog from "@/app/(pages)/invoice-history/invoice-send-email-dialog";
import InvoicePreviewDialog from "@/app/(pages)/invoice/invoice-preview-dialog";
import { generateInvoiceTemplatePDF } from "@/components/invoice/templates/invoice-pdf-generator";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useTranslation } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";
import { PaginationV2 } from "@/type_schema/common";
import { InvoiceHistoryType } from "@/type_schema/invoice";
import { Role } from "@/type_schema/role";
import { formatDate } from "date-fns";
import debounce from "debounce";
import {
  BadgeDollarSign,
  Download,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const getCssColorClass = (status: string) => {
  // Generate a consistent color based on the first character of customer name
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500"
  ];
  const index = status.charCodeAt(0) % colors.length;
  return colors[index];
};

function InvoiceHistoryContent() {
  const { t } = useTranslation();
  const queryParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const page = queryParams.get("page") ? Number(queryParams.get("page")) : 1;
  const limit = queryParams.get("limit") ? Number(queryParams.get("limit")) : 10;
  const searchKeyword = queryParams.get("keyword") || "";
  const [keyword, setKeyword] = useState<string>(searchKeyword);
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "");
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc");
  const [fromDate, setFromDate] = useState<string>(queryParams.get("fromDate") || "");
  const [toDate, setToDate] = useState<string>(queryParams.get("toDate") || "");
  const [customerId, setCustomerId] = useState<string>(queryParams.get("customerId") || "");
  const [status, setStatus] = useState<string>(queryParams.get("status") || "");
  const [loading, setLoading] = useState(false);

  const fetchInvoiceHistories = async (
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: string,
    fromDate?: string,
    toDate?: string,
    customerId?: string,
    status?: string
  ) => {
    try {
      const result = await getAllInvoiceHistories(
        page,
        limit,
        keyword,
        sortBy,
        sortOrder,
        fromDate,
        toDate,
        customerId,
        status
      );
      setInvoiceHistories(result);
    } catch (error) {
      console.log("Error fetching invoiceHistories:", error);
    }
  };

  const updateQueryParams = (param: string, value: string) => {
    const params = new URLSearchParams(queryParams);
    params.set(param, value);
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  // Handle search input change
  const handleUpdateKeyword = (keyword: string) => {
    updateQueryParams("keyword", keyword);
  };
  const debounceSearchKeyword = useCallback(debounce(handleUpdateKeyword, 1000), []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);
    debounceSearchKeyword(keyword);
  };

  const goToPage = (page: number) => {
    fetchInvoiceHistories(page, limit, keyword, sortBy, sortOrder, fromDate, toDate, customerId, status);
    updateQueryParams("page", page.toString());
  };

  const updateUrl = (params: URLSearchParams) => {
    const newUrl = `${pathname}?${params.toString()}`;
    replace(newUrl);
  };

  const handleFilterChange = (props: any) => {
    const params = new URLSearchParams();
    const { _sortBy, _sortOrder } = props;
    params.set("page", "1"); // Reset to first page when applying filters
    if (_sortBy) params.set("sortBy", _sortBy);
    if (_sortOrder) params.set("sortOrder", _sortOrder);
    updateUrl(params);
  };

  const [invoiceHistories, setInvoiceHistories] = useState<PaginationV2<InvoiceHistoryType> | null>(null);

  // Load invoices when component mounts
  useEffect(() => {
    fetchInvoiceHistories(page, limit, searchKeyword, sortBy, sortOrder);
  }, [page, limit, searchKeyword, sortBy, sortOrder]);

  // Handle download invoice
  const handleDownloadInvoice = async (invoiceHistory: InvoiceHistoryType) => {
    try {
      // Tải xuống PDF trực tiếp
      const filename = `invoice-${invoiceHistory.customer.name}.pdf`;
      const success = downloadInvoicePreviewPDF(invoiceHistory, filename);

      if (!success) {
        throw new Error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error downloading invoice. Please try again.");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice history</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-[200px] bg-white dark:bg-slate-700 border border-gray-200"
              value={keyword}
              onChange={handleSearchChange}
            />
          </div>
          <FilterInvoiceHistoryModal
            handleFilterChangeAction={handleFilterChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            fromDate={fromDate}
            toDate={toDate}
            customerId={customerId}
            status={status}
          >
            <Button
              variant="outline"
              size="icon"
              className="flex items-center justify-center cursor-pointer border border-gray-200"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </FilterInvoiceHistoryModal>
          <Link href={"/invoice"}>
            <Button className="flex items-center justify-center gap-2 cursor-pointer bg-main text-white">
              Create <Plus />
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-700 rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceHistories && invoiceHistories.items.length > 0 ? (
                invoiceHistories.items.map((invoice, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">{formatDate(invoice.date, "dd/MM/yyyy")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">{invoice.customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-lg ${getStatusColorClass(invoice.status)} text-white`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">
                      {formatCurrency(Number(invoice.totalAmount), invoice.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border border-gray-200"
                        >
                          <InvoicePreviewDialog invoice={invoice}>
                            <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                              <Eye size={14} /> Show preview
                            </div>
                          </InvoicePreviewDialog>
                          {invoice.status === "NEW" && (
                            <InvoiceSendMailDialog
                              targetInvoice={invoice}
                              refetchData={fetchInvoiceHistories}
                            >
                              <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md text-violet-600">
                                <Mail size={14} /> Send invoice
                              </div>
                            </InvoiceSendMailDialog>
                          )}
                          {invoice.status === "PENDING" && (
                            <InvoiceStatusUpdateDialog
                              targetInvoice={invoice}
                              refetchData={() => fetchInvoiceHistories()}
                            >
                              <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md text-lime-600">
                                <BadgeDollarSign size={14} /> Mark as paid
                              </div>
                            </InvoiceStatusUpdateDialog>
                          )}
                          <div
                            className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download size={14} /> Download
                          </div>
                          <div className="text-red-500 flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                            <Trash2
                              size={14}
                              stroke="red"
                            />{" "}
                            Delete
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {loading ? "Loading..." : "No invoices found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {invoiceHistories && (
        <div className="mt-4">
          <PaginationWithLinks
            page={invoiceHistories.page}
            pageSize={invoiceHistories.limit}
            totalCount={invoiceHistories.total}
            callback={goToPage}
          />
        </div>
      )}
    </>
  );
}

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoiceHistory = AuthenticatedRoute(InvoiceHistoryContent, [Role.ADMIN, Role.SUPER_ADMIN]);

export default AuthenticatedInvoiceHistory;

export const getCustomerColorClass = (status: string) => {
  // Generate a consistent color based on the first character of customer name
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500"
  ];
  const index = status.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getStatusColorClass = (status: string) => {
  // Generate a consistent color based on the first character of customer name
  const colors = [
    "bg-sky-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-rose-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500"
  ];
  switch (status.toLowerCase()) {
    case "new":
      return colors[0];
    case "pending":
      return colors[1];
    case "paid":
      return colors[2];
    default:
      return colors[3];
  }
};

const downloadInvoicePreviewPDF = (invoice: InvoiceHistoryType, filename?: string) => {
  try {
    // Import trực tiếp từ pdf-generator để tránh lỗi
    const doc = generateInvoiceTemplatePDF(invoice);

    // Set filename
    const defaultFilename = `Invoice-${"INV-2025-0001"}.pdf`;
    const finalFilename = filename || defaultFilename;

    // Download PDF
    doc.save(finalFilename);

    return true;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return false;
  }
};
