"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InvoiceHistoryItem } from "@/type_schema/invoice";

// Helper functions
export const formatCurrency = (amount: string | number, currency: string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    return `${currency} 0.00`;
  }
  return `${currency} ${numAmount.toFixed(2)}`;
};

export const calculateItemAmount = (item: any) => {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  return quantity * unitPrice;
};

export const calculateSubtotal = (items: any[]) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return total + (quantity * unitPrice);  
  }, 0);
};

export const calculateTaxTotal = (items: any[], taxRate = 16) => {
  if (!items || items.length === 0) return 0;
  const subtotal = calculateSubtotal(items);
  return subtotal * (taxRate / 100);
};

export const calculateGrandTotal = (items: any[], taxRate = 16) => {
  if (!items || items.length === 0) return 0;
  const subtotal = calculateSubtotal(items);
  const tax = subtotal * (taxRate / 100);
  return subtotal + tax;
};

// Main function to generate PDF
export const generateInvoicePDF = (invoice: InvoiceHistoryItem) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice ${invoice.id || "INV-2025-0001"}`,
    subject: "Invoice",
    author: "Kimai Time Tracking System",
    creator: "Kimai Time Tracking System"
  });
  
  // Add header
  doc.setFontSize(24);
  doc.setTextColor(30, 64, 175); // Blue color similar to #1E40AF
  doc.text("Invoice", 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.id || "INV-2025-0001", 20, 30);
  
  // Add invoice details
  doc.setFontSize(10);
  doc.text(`Date: ${invoice.date || new Date().toLocaleDateString()}`, 20, 40);
  doc.text(`Due Date: ${invoice.dueDate || new Date().toLocaleDateString()}`, 20, 45);
  
  // Add company information on the right
  doc.setFontSize(12);
  doc.text("From:", 140, 20);
  doc.setFontSize(10);
  doc.text("Kimai Time Tracking", 140, 25);
  doc.text("123 Time Street", 140, 30);
  doc.text("Time City, TC 12345", 140, 35);
  doc.text("Email: info@kimai.org", 140, 40);
  
  // Add customer information
  doc.setFontSize(12);
  doc.text("Bill To:", 20, 60);
  doc.setFontSize(10);
  doc.text(invoice.customer || "Customer Name", 20, 65);
  doc.text("Customer Address", 20, 70);
  doc.text("customer@example.com", 20, 75);
  
  // Add items table
  const tableColumn = ["Date", "Description", "Unit Price", "Quantity", "Amount"];
  
  // Define table rows
  let tableRows = [];
  
  if (invoice.items && invoice.items.length > 0) {
    tableRows = invoice.items.map(item => [
      item.date || new Date().toLocaleDateString(),
      item.description || "Item description",
      formatCurrency(item.unitPrice, invoice.currency || "TTD"),
      item.quantity.toString(),
      formatCurrency(calculateItemAmount(item), invoice.currency || "TTD")
    ]);
  } else {
    // Sample data rows
    tableRows = [
      ["4/7/25", "Esse ut / Omnis molestias", "TTD 0.00", "8.00", "TTD 0.00"],
      ["4/8/25", "Distinctio quod / Dolorem molestiae", "TTD 71.00", "0.03", "TTD 2.37"],
      ["4/8/25", "Esse ut / Omnis molestias", "TTD 0.00", "8.00", "TTD 0.00"]
    ];
  }
  
  // Add table to document
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 85,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [243, 244, 246], // Light gray similar to #F3F4F6
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Date
      1: { cellWidth: 'auto' }, // Description
      2: { cellWidth: 30, halign: 'right' }, // Unit Price
      3: { cellWidth: 25, halign: 'center' }, // Quantity
      4: { cellWidth: 30, halign: 'right' } // Amount
    }
  });
  
  // Get the y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add totals
  const subtotal = invoice.items && invoice.items.length > 0
    ? calculateSubtotal(invoice.items)
    : 2.37;
  
  const tax = invoice.items && invoice.items.length > 0
    ? calculateTaxTotal(invoice.items)
    : 0.38;
  
  const total = invoice.items && invoice.items.length > 0
    ? calculateGrandTotal(invoice.items)
    : 2.75;
  
  // Create totals table
  autoTable(doc, {
    body: [
      ['Subtotal', formatCurrency(subtotal, invoice.currency || "TTD")],
      ['Tax (16%)', formatCurrency(tax, invoice.currency || "TTD")],
      ['Total', formatCurrency(total, invoice.currency || "TTD")]
    ],
    startY: finalY,
    theme: 'plain',
    styles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 100 }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102); // Gray color similar to #666666
    doc.text(
      "Thank you for your business! Invoice generated by Kimai Time Tracking System",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  
  return doc;
};

// Function to download the PDF
export const downloadInvoicePDF = (invoice: InvoiceHistoryItem, filename?: string) => {
  try {
    // Generate PDF
    const doc = generateInvoicePDF(invoice);
    
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
