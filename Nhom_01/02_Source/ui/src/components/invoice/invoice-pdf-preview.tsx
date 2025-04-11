"use client";

import React, { useState, useEffect, useRef } from "react";
import { InvoiceHistoryItem, InvoiceHistoryType } from "@/type_schema/invoice";
import { generateInvoicePDF } from "./pdf-generator";
import { generateInvoicePreviewPDF } from "@/components/invoice/invoice-pdf-generator";

// Format currency
const formatCurrency = (amount: string | number, currency: string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    return `${currency} 0.00`;
  }
  return `${currency} ${numAmount.toFixed(2)}`;
};

// Calculate item amount
const calculateItemAmount = (item: any) => {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  return quantity * unitPrice;
};

const calculateSubtotal = (items: any[]) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return total + quantity * unitPrice;
  }, 0);
};

// Calculate tax total
const calculateTaxTotal = (items: any[], taxRate = 16) => {
  if (!items || items.length === 0) return 0;
  const subtotal = calculateSubtotal(items);
  return subtotal * (taxRate / 100);
};

// Calculate grand total
const calculateGrandTotal = (items: any[], taxRate = 16) => {
  if (!items || items.length === 0) return 0;
  const subtotal = calculateSubtotal(items);
  const tax = subtotal * (taxRate / 100);
  return subtotal + tax;
};

// Main component
export const InvoicePDFPreview = ({ invoice }: { invoice: InvoiceHistoryType }) => {
  const [isClient, setIsClient] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsClient(true);

    if (isClient) {
      try {
        // Generate PDF
        const doc = generateInvoicePreviewPDF(invoice);

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
    }
  }, [invoice, isClient]);

  if (!isClient || !pdfUrl) {
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

// Để sử dụng trong download, export một hàm tạo document
export const createInvoiceDocument = async (invoice: InvoiceHistoryType) => {
  // Sử dụng jsPDF thay vì @react-pdf/renderer
  const doc = generateInvoicePreviewPDF(invoice);
  return doc;
};

// Hàm tải xuống PDF
export const downloadInvoicePreviewPDF = (invoice: InvoiceHistoryType, filename?: string) => {
  try {
    // Import trực tiếp từ pdf-generator để tránh lỗi
    const doc = generateInvoicePreviewPDF(invoice);

    // Set filename
    const defaultFilename = `Invoice-${invoice.id || "INV-2025-0001"}.pdf`;
    const finalFilename = filename || defaultFilename;

    // Download PDF
    doc.save(finalFilename);

    return true;
  } catch (error) {
    console.error("Error downloading PDF:", error);
    return false;
  }
};
