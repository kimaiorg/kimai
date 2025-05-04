"use client";

import { generateInvoiceTemplatePDF } from "@/components/invoice/templates/invoice-pdf-generator";
import { InvoiceHistoryType } from "@/type_schema/invoice";
import { useEffect, useRef, useState } from "react";

// Main component
export const InvoicePDFPreview = ({ invoice }: { invoice: InvoiceHistoryType }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    try {
      // Generate PDF
      const doc = generateInvoiceTemplatePDF(invoice);

      // Create blob URL
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Cleanup function
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, [invoice]);

  if (!pdfUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        className="w-full h-full border-0"
        title="Invoice PDF"
      />
    </div>
  );
};
