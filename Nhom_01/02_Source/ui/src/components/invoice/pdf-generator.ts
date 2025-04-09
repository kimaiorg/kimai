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
  
  // Define colors
  const primaryColor: number[] = [30, 64, 175]; // Blue color similar to #1E40AF
  const secondaryColor: number[] = [243, 244, 246]; // Light gray similar to #F3F4F6
  const textColor: number[] = [51, 51, 51]; // Dark gray for text
  const borderColor: number[] = [229, 231, 235]; // Light gray for borders
  
  // Set page margins
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 2 * margin;
  
  // Add header with logo-like styling
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, margin, contentWidth, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("KIMAI", margin + 5, margin + 10);
  
  // Invoice title and number
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Invoice", margin, margin + 30);
  
  doc.setFontSize(16);
  doc.text(invoice.id || "INV-2025-0001", margin, margin + 40);
  
  // Add invoice details in a nice box
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(margin, margin + 45, contentWidth / 2 - 10, 40, 2, 2, 'FD');
  
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${invoice.date || new Date().toLocaleDateString()}`, margin + 5, margin + 55);
  doc.text(`Due Date: ${invoice.dueDate || new Date().toLocaleDateString()}`, margin + 5, margin + 65);
  doc.text(`Status: ${invoice.status || "Pending"}`, margin + 5, margin + 75);
  
  // Add company information in a nice box on the right
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(margin + contentWidth / 2 + 10, margin + 45, contentWidth / 2 - 10, 40, 2, 2, 'FD');
  
  doc.setFont("helvetica", "bold");
  doc.text("From:", margin + contentWidth / 2 + 15, margin + 55);
  doc.setFont("helvetica", "normal");
  doc.text("Kimai Time Tracking", margin + contentWidth / 2 + 15, margin + 65);
  doc.text("123 Time Street", margin + contentWidth / 2 + 15, margin + 75);
  doc.text("Time City, TC 12345", margin + contentWidth / 2 + 15, margin + 85);
  
  // Add customer information in a nice box
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(margin, margin + 95, contentWidth, 40, 2, 2, 'FD');
  
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", margin + 5, margin + 105);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.customer || "Customer Name", margin + 5, margin + 115);
  doc.text("Customer Address", margin + 5, margin + 125);
  doc.text("customer@example.com", margin + 5, margin + 135);
  
  // Add items table with improved styling
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
  
  // Add table to document with improved styling
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: margin + 145,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 6,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 30 }, // Date
      1: { cellWidth: 'auto' }, // Description
      2: { cellWidth: 35, halign: 'right' }, // Unit Price
      3: { cellWidth: 25, halign: 'center' }, // Quantity
      4: { cellWidth: 35, halign: 'right' } // Amount
    },
    alternateRowStyles: {
      fillColor: [252, 252, 253]
    },
    didDrawPage: (data) => {
      // Add footer on each page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          "Thank you for your business! Invoice generated by Kimai Time Tracking System",
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
        
        // Add page number
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - margin,
          doc.internal.pageSize.getHeight() - 10,
          { align: "right" }
        );
      }
    }
  });
  
  // Get the y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add totals with improved styling
  const subtotal = invoice.items && invoice.items.length > 0
    ? calculateSubtotal(invoice.items)
    : 2.37;
  
  const tax = invoice.items && invoice.items.length > 0
    ? calculateTaxTotal(invoice.items)
    : 0.38;
  
  const total = invoice.items && invoice.items.length > 0
    ? calculateGrandTotal(invoice.items)
    : 2.75;
  
  // Create totals table with improved styling
  autoTable(doc, {
    body: [
      ['Subtotal', formatCurrency(subtotal, invoice.currency || "TTD")],
      ['Tax (16%)', formatCurrency(tax, invoice.currency || "TTD")],
      ['Total', formatCurrency(total, invoice.currency || "TTD")]
    ],
    startY: finalY,
    theme: 'plain',
    styles: {
      fontSize: 10,
      lineColor: [229, 231, 235],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 80, fontStyle: 'bold' },
      1: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: pageWidth - 115 },
    didParseCell: function(data) {
      // Add background color to total row
      if (data.row.index === 2) {
        data.cell.styles.fillColor = [primaryColor[0], primaryColor[1], primaryColor[2]];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });
  
  // Add notes section if available
  if (invoice.notes) {
    const notesY = (doc as any).lastAutoTable.finalY + 20;
    
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setFillColor(252, 252, 253);
    doc.roundedRect(margin, notesY, contentWidth, 30, 2, 2, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text("Notes:", margin + 5, notesY + 10);
    
    doc.setFont("helvetica", "normal");
    doc.text(invoice.notes, margin + 5, notesY + 20);
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
