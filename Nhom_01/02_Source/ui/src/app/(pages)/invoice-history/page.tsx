"use client";

import InvoiceStatusUpdateDialog from "@/app/(pages)/invoice-history/invoice-history-status-dialog";
import InvoicePreviewDialog from "@/app/(pages)/invoice/invoice-preview-dialog";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { InvoiceHistoryType } from "@/type_schema/invoice";
import { Role } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";
import { Download, Eye, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const [invoiceHistories, setInvoiceHistories] = useState<InvoiceHistoryType[]>([]);

  const fetchInvoiceHistories = async () => {
    const histories = JSON.parse(localStorage.getItem("invoiceHistoryList") || "[]") as InvoiceHistoryType[];
    setInvoiceHistories(histories);
  };

  // Load invoices when component mounts
  useEffect(() => {
    fetchInvoiceHistories();
  }, []);

  // Handle download invoice
  const handleDownloadInvoice = async (invoiceHistory: InvoiceHistoryType) => {
    try {
      // Import downloadInvoicePDF từ invoice-pdf
      const { downloadInvoicePreviewPDF } = await import("@/components/invoice/invoice-pdf-preview");

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
        <h1 className="text-2xl font-bold">Invoice History</h1>
        <Button
          onClick={() => router.push("/invoice")}
          className="bg-lime-500 hover:bg-lime-600 text-white cursor-pointer"
        >
          Create Invoice
        </Button>
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
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Created By
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
              {invoiceHistories.length > 0 ? (
                invoiceHistories.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">{invoice.customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-lg ${getStatusColorClass(invoice.status)} text-white`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm ">
                      {invoice.totalPrice} {invoice.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full`}>
                        <span className="text-xs font-medium text-center">
                          {userList.find((user) => user.user_id == invoice.createdBy)?.name || "N/A"}
                        </span>
                      </div>
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
                          <InvoiceStatusUpdateDialog
                            targetInvoice={invoice}
                            refetchData={() => fetchInvoiceHistories()}
                          >
                            <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
                              <SquarePen size={14} /> Edit
                            </div>
                          </InvoiceStatusUpdateDialog>
                          <div className="flex gap-2 items-center cursor-pointer py-1 pl-2 pr-4 hover:bg-gray-100 dark:hover:bg-slate-700 text-md">
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
    </>
  );
}

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoiceHistory = AuthenticatedRoute(InvoiceHistoryContent, [
  Role.ADMIN,
  Role.SUPER_ADMIN,
  Role.TEAM_LEAD
]);

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
