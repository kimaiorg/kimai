"use client";

import React, { useState, useEffect } from "react";
import { InvoiceHistoryItem } from "@/type_schema/invoice";
import dynamic from "next/dynamic";

// Dynamically import the entire @react-pdf/renderer package
// Sử dụng noSSR thay vì dynamic import để tránh lỗi ESM
const PDFRenderer = dynamic(
  () => import("./pdf-renderer").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading PDF viewer...</p>
        </div>
      </div>
    ),
  }
);

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
    return total + (quantity * unitPrice);  
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
const InvoicePDF = ({ invoice }: { invoice: InvoiceHistoryItem }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
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
    <PDFRenderer 
      invoice={invoice}
      helpers={{
        formatCurrency,
        calculateItemAmount,
        calculateSubtotal,
        calculateTaxTotal,
        calculateGrandTotal
      }}
    />
  );
};

export default InvoicePDF;

// Để sử dụng trong download, export một hàm tạo document
export const createInvoiceDocument = async (invoice: InvoiceHistoryItem) => {
  // Sẽ được triển khai trong file pdf-renderer.tsx
  const { createDocument } = await import("./pdf-renderer");
  return createDocument(invoice, {
    formatCurrency,
    calculateItemAmount,
    calculateSubtotal,
    calculateTaxTotal,
    calculateGrandTotal
  });
};
