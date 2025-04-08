"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DatabaseProvider, useDatabase } from "@/db/DatabaseContext";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";
import { InvoiceHistoryItem } from "@/type_schema/invoice";
import { Calendar, Filter, Search, X } from "lucide-react";
import { InvoiceService } from "@/db/invoiceService"; // Sửa đường dẫn import

function InvoiceContent() {
  const router = useRouter();
  const { invoices, customers, updateInvoiceStatus } = useDatabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dateRange, setDateRange] = useState("01/04/2025 - 30/04/2025");
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceHistoryItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Filter invoices based on search criteria
  const handleSearch = () => {
    let filtered = [...invoices];

    // Filter by customer if selected
    if (selectedCustomer) {
      filtered = filtered.filter((invoice) => invoice.customer.toLowerCase() === selectedCustomer.toLowerCase());
    }

    // Filter by search term if provided
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Set filtered invoices and mark as searched
    setFilteredInvoices(filtered);
    setHasSearched(true);
  };

  // Handle preview invoice
  const handlePreviewInvoice = (invoiceId: string) => {
    router.push(`/invoice-preview/${invoiceId}`);
  };

  // Handle save invoice status
  const handleSaveInvoice = (invoiceId: string) => {
    try {
      // Tìm invoice cần lưu
      const invoiceToSave = invoices.find((inv) => inv.id === invoiceId);

      if (!invoiceToSave) {
        console.error("Invoice not found");
        return;
      }

      // Tạo một bản sao của invoice với ID mới để lưu vào history
      const today = new Date();

      // Format ngày theo định dạng DD.MM.YYYY để phù hợp với hiển thị trong invoice-history
      const day = today.getDate().toString().padStart(2, "0");
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const year = today.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;

      const historyInvoice = {
        ...invoiceToSave,
        id: `INV-${Date.now().toString().slice(-8)}`, // Tạo ID mới
        status: "New",
        date: formattedDate, // Cập nhật ngày tạo thành ngày hiện tại với định dạng DD.MM.YYYY
        createdAt: today.toISOString()
      };

      // Lưu invoice mới vào danh sách invoices (sẽ xuất hiện trong invoice-history)
      InvoiceService.addInvoiceToHistory(historyInvoice);

      // Show success message
      setSaveSuccess(invoiceId);

      // Xóa invoice khỏi danh sách kết quả tìm kiếm sau một khoảng thời gian ngắn
      setTimeout(() => {
        // Cập nhật danh sách hiển thị bằng cách loại bỏ invoice đã lưu
        setFilteredInvoices((prev) => prev.filter((inv) => inv.id !== invoiceId));
        setSaveSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Get color class for customer dot
  const getCustomerColorClass = (customer: string) => {
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
    const index = customer.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      {/* Filter Section */}
      <div className="bg-white rounded-md shadow-sm mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Filter invoice data</h2>
        </div>

        <div className="p-4 space-y-4">
          {/* Search Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search term</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time range</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <Calendar className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <div className="relative">
              <select
                className="w-full border rounded-md p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">All customers</option>
                {customers.map((customer, index) => (
                  <option
                    key={index}
                    value={customer}
                  >
                    {customer}
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
        </div>

        {/* Filter Buttons */}
        <div className="p-4 flex space-x-2 border-t">
          <button className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-1" />
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div>
          <h2 className="text-lg font-medium mb-4">Preview</h2>

          {/* Results Table */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"
                  ></th>
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
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              className="h-5 w-5"
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
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full mr-2 ${getCustomerColorClass(invoice.customer)}`}></div>
                          <div className="text-sm font-medium text-gray-900">{invoice.customer}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {Math.floor(Math.random() * 200) + 1}.{Math.floor(Math.random() * 60)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.totalPrice} {invoice.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handlePreviewInvoice(invoice.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Preview
                        </button>
                        {saveSuccess === invoice.id ? (
                          <span className="text-green-600 px-3 py-1">Saved ✓</span>
                        ) : (
                          <button
                            onClick={() => handleSaveInvoice(invoice.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Invoice() {
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  if (!isClientSide) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DatabaseProvider>
      <InvoiceContent />
    </DatabaseProvider>
  );
}

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoice = AuthenticatedRoute(Invoice, [Role.ADMIN, Role.SUPER_ADMIN, Role.TEAM_LEAD]);

export default AuthenticatedInvoice;
