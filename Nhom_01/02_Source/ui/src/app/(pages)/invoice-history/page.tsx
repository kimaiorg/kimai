"use client";

import React, { useState, useEffect } from "react";
import { Role } from "@/type_schema/role";
import { MoreHorizontal, Download, Calendar, Filter, Search, Edit, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { InvoiceHistoryItem, INVOICE_STATUS_OPTIONS } from "@/type_schema/invoice";
import { DatabaseProvider, useDatabase } from "@/db/DatabaseContext";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { InvoiceService } from "@/db/invoiceService";

// Define status options
const statusOptions = INVOICE_STATUS_OPTIONS;

function InvoiceHistoryContent() {
  const router = useRouter();
  const { invoices, updateInvoiceStatus, deleteInvoice, refreshInvoices } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceHistoryItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceHistoryItem | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [description, setDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [initialized, setInitialized] = useState(false);

  // Load invoices when component mounts
  useEffect(() => {
    if (!initialized) {
      refreshInvoices();
      setInitialized(true);
    }
  }, [refreshInvoices, initialized]);

  // Filter invoices when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle invoice row click to open status dialog
  const handleInvoiceClick = (invoice: InvoiceHistoryItem) => {
    setSelectedInvoice(invoice);
    setNewStatus(invoice.status);
    setDescription("");
    setPaymentDate("");
    setShowStatusDialog(true);
  };

  // Handle action menu toggle
  const handleActionMenuToggle = (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    setShowActionMenu(showActionMenu === invoiceId ? null : invoiceId);
  };

  // Handle edit invoice
  const handleEditInvoice = (e: React.MouseEvent, invoice: InvoiceHistoryItem) => {
    e.stopPropagation();
    setShowActionMenu(null);

    // In a real app, navigate to edit page with invoice ID
    console.log("Edit invoice:", invoice.id);
    // router.push(`/invoice-edit/${invoice.id}`);

    // For now, just show an alert
    alert(`Edit invoice: ${invoice.id}`);
  };

  // Handle download invoice
  const handleDownloadInvoice = async (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    setShowActionMenu(null);

    try {
      // Tìm invoice cần tải xuống
      const invoice = invoices.find((inv) => inv.id === invoiceId);

      if (!invoice) {
        console.error("Invoice not found");
        return;
      }

      // Import downloadInvoicePDF từ invoice-pdf
      const { downloadInvoicePDF } = await import("@/components/invoice/invoice-pdf");
      
      // Tải xuống PDF trực tiếp
      const filename = `invoice-${invoiceId}.pdf`;
      const success = downloadInvoicePDF(invoice, filename);
      
      if (!success) {
        throw new Error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Error downloading invoice. Please try again.");
    }
  };

  // Handle delete invoice
  const handleDeleteInvoice = (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    setShowActionMenu(null);

    if (window.confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(invoiceId);
    }
  };

  // Handle preview invoice
  const handlePreviewInvoice = (e: React.MouseEvent, invoiceId: string) => {
    e.stopPropagation();
    // Navigate to invoice preview page without locale prefix
    router.push(`/invoice-preview/${invoiceId}`);
  };

  // Handle save status changes
  const handleSaveStatus = () => {
    if (!selectedInvoice) return;

    setLoading(true);

    try {
      updateInvoiceStatus(selectedInvoice.id, newStatus, paymentDate, description);
      setShowStatusDialog(false);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      alert("Error updating invoice status");
    } finally {
      setLoading(false);
    }
  };

  // Get user initials color class
  const getUserColorClass = (initials: string) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Sent":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice History</h1>
        <button
          onClick={() => router.push("/invoice-create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create Invoice
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="px-3 py-2 border rounded-md flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <button className="px-3 py-2 border rounded-md w-full md:w-auto">Export</button>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleInvoiceClick(invoice)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColorClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.totalPrice} {invoice.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getUserColorClass(invoice.createdBy)}`}
                      >
                        <span className="text-xs font-medium text-white">{invoice.createdBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={(e) => handleActionMenuToggle(e, invoice.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {showActionMenu === invoice.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <button
                              onClick={(e) => handleEditInvoice(e, invoice)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => handleDownloadInvoice(e, invoice.id)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </button>
                            <button
                              onClick={(e) => handleDeleteInvoice(e, invoice.id)}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              role="menuitem"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
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

        {/* Pagination */}
        {filteredInvoices.length > itemsPerPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {indexOfLastItem > filteredInvoices.length ? filteredInvoices.length : indexOfLastItem}
                  </span>{" "}
                  of <span className="font-medium">{filteredInvoices.length}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1 ? "bg-gray-100 text-gray-400" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Dialog */}
      {showStatusDialog && selectedInvoice && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {selectedInvoice.customer} – {selectedInvoice.date} – {selectedInvoice.totalPrice}{" "}
                {selectedInvoice.currency}
              </h2>
              <button
                onClick={() => setShowStatusDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full border rounded-md p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment date</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="DD.MM.YYYY"
                    className="w-full border rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                  <Calendar className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                  {paymentDate && (
                    <button
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setPaymentDate("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t space-x-2">
              <button
                onClick={() => setShowStatusDialog(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceHistory() {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  if (!isClientSide) {
    return null;
  }

  return (
    <DatabaseProvider>
      <InvoiceHistoryContent />
    </DatabaseProvider>
  );
}

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoiceHistory = AuthenticatedRoute(InvoiceHistory, [Role.ADMIN, Role.SUPER_ADMIN, Role.TEAM_LEAD]);

export default AuthenticatedInvoiceHistory;
