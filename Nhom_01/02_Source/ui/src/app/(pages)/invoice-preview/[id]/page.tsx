"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvoiceHistoryItem } from "@/type_schema/invoice";
import { DatabaseProvider, useDatabase } from "@/db/DatabaseContext";
import InvoicePDF from "@/components/invoice/invoice-pdf";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";
import { ArrowLeft } from "lucide-react";

function InvoicePreviewContent() {
  const router = useRouter();
  const params = useParams();
  const { invoices } = useDatabase();
  const [invoice, setInvoice] = useState<InvoiceHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id && invoices.length > 0) {
      const invoiceId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundInvoice = invoices.find((inv) => inv.id === invoiceId);

      if (foundInvoice) {
        setInvoice(foundInvoice);
        setError(null);
      } else {
        setError(`Invoice with ID ${invoiceId} not found`);
      }

      setLoading(false);
    }
  }, [params, invoices]);

  const handleBack = () => {
    router.push("/invoice");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoice
        </button>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto py-6">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoice
        </button>
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">No invoice found. </strong>
          <span className="block sm:inline">Please select an invoice from the history page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto py-4 px-4 bg-white shadow-sm">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoice
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <InvoicePDF invoice={invoice} />
      </div>
    </div>
  );
}

function InvoicePreview() {
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
      <InvoicePreviewContent />
    </DatabaseProvider>
  );
}

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoicePreview = AuthenticatedRoute(InvoicePreview, [Role.ADMIN, Role.SUPER_ADMIN, Role.TEAM_LEAD]);

export default AuthenticatedInvoicePreview;
