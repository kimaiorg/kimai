"use client";

import { formatCurrency } from "@/lib/utils";
import { InvoiceHistoryType } from "@/type_schema/invoice";
import { formatDate } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Main function to generate PDF
export const generateInvoiceTemplatePDF = (invoice: InvoiceHistoryType) => {
  // Create a new PDF document with larger page size
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Set document properties
  doc.setProperties({
    title: `The invoice`,
    subject: "Invoice",
    author: "Kimai Time Tracking System",
    creator: "Kimai Time Tracking System"
  });

  // Define colors
  const primaryColor: number[] = [110, 68, 255]; // Blue color similar to #1E40AF
  const textColor: number[] = [51, 51, 51]; // Dark gray for text
  const borderColor: number[] = [229, 231, 235]; // Light gray for borders

  // Set page margins
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 2 * margin;

  // Add header with logo-like styling
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, margin, contentWidth, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("KIMAI", margin + 5, margin + 7);

  // Invoice title and number
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.text("The invoice", margin, margin + 20);

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(10);
  doc.text("Bill information:", margin, margin + 30);

  // doc.setFontSize(14);
  // doc.text(invoice.id || "INV-2025-0001", margin, margin + 27);

  // Create a two-column layout for invoice details and company info
  const colWidth = (contentWidth - 5) / 2;

  // Left column - Invoice details in a nice box
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(margin, margin + 32, colWidth, 30, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  // Add invoice details with proper spacing
  const detailsStartY = margin + 38;
  const lineHeight = 5;

  doc.setFont("helvetica", "bold");
  doc.text("From date:", margin + 3, detailsStartY);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(invoice?.fromDate || Date.now(), "dd.MM.yyyy HH:mm"), margin + 25, detailsStartY);

  doc.setFont("helvetica", "bold");
  doc.text("To date:", margin + 3, detailsStartY + lineHeight);
  doc.setFont("helvetica", "normal");
  doc.text(
    formatDate(invoice.toDate || invoice.dueDate || Date.now(), "dd.MM.yyyy HH:mm"),
    margin + 25,
    detailsStartY + lineHeight
  );

  doc.setFont("helvetica", "bold");
  doc.text("Status:", margin + 3, detailsStartY + lineHeight * 2);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.status || "Pending", margin + 25, detailsStartY + lineHeight * 2);

  // Right column - Company information in a nice box
  const rightColX = margin + colWidth + 5;
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(rightColX, margin + 32, colWidth, 30, 2, 2, "FD");

  // Add company information with proper spacing
  doc.setFont("helvetica", "bold");
  doc.text("From:", rightColX + 3, detailsStartY);
  doc.setFont("helvetica", "normal");
  doc.text("Kimai Time Tracking", rightColX + 3, detailsStartY + lineHeight);
  doc.text("123 Time Street", rightColX + 3, detailsStartY + lineHeight * 2);
  doc.text("Time City, TC 12345", rightColX + 3, detailsStartY + lineHeight * 3);

  // Add customer information in a nice box
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(margin, margin + 67, contentWidth, 32, 2, 2, "FD");

  const customerStartY = margin + 73;

  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", margin + 4, customerStartY);
  doc.text("Full name:", margin + 4, customerStartY + lineHeight);
  doc.text("Address:", margin + 4, customerStartY + lineHeight * 2);
  doc.text("Email:", margin + 4, customerStartY + lineHeight * 3);
  doc.text("Contract:", margin + 4, customerStartY + lineHeight * 4);

  doc.setFont("helvetica", "normal");
  doc.text(invoice.customer.name, margin + 20, customerStartY + lineHeight);
  doc.text(invoice.customer.address, margin + 20, customerStartY + lineHeight * 2);
  doc.text(invoice.customer.email, margin + 20, customerStartY + lineHeight * 3);
  doc.text(invoice.customer.phone, margin + 20, customerStartY + lineHeight * 4);

  // Add items table with improved styling
  const tableColumns = ["No.", "Date", "Description", "Total"];

  // Define table rows
  const tableRows = [];
  let startIdx = 1;

  for (const invoiceActivity of invoice.activities) {
    tableRows.push([
      (startIdx++).toString(),
      formatDate(invoiceActivity.created_at, "dd.MM.yyyy"),
      invoiceActivity.name,
      // formatCurrency(invoiceActivity.unitPrice, invoice.currency || "USD"),
      // invoiceActivity.quantity.toString(),
      formatCurrency(invoiceActivity.totalPrice, invoice.currency || "USD")
    ]);
  }

  // Add table to document with improved styling
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: margin + 105,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [229, 231, 235],
      lineWidth: 0.1,
      overflow: "linebreak",
      cellWidth: "wrap"
    },
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: {
      0: { cellWidth: 15 }, // No
      1: { cellWidth: 35 }, // Date
      2: { cellWidth: "auto" }, // Description
      3: { cellWidth: 25, halign: "left" } // Total Price
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
          "Thank you for your business!",
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 22,
          { align: "center" }
        );

        doc.text(
          "Invoice generated by Kimai Time Tracking System",
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 17,
          { align: "center" }
        );

        // Add page number
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - margin,
          doc.internal.pageSize.getHeight() - 17,
          { align: "right" }
        );
      }
    }
  });

  // Get the y position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 6;

  // Create totals table with improved styling
  autoTable(doc, {
    body: [
      ["Total", formatCurrency(invoice.totalPrice, invoice.currency || "USD")],
      [`Tax (${invoice.taxRate}%)`, formatCurrency(invoice.taxPrice, invoice.currency || "USD")],
      ["Final", formatCurrency(invoice.finalPrice, invoice.currency || "USD")]
    ],
    startY: finalY,
    margin: { left: 136 },
    theme: "plain",
    styles: {
      fontSize: 9,
      lineColor: [229, 231, 235],
      lineWidth: 0.1
    },
    tableWidth: "wrap",
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold" },
      1: { cellWidth: 25, halign: "right" }
    },
    didParseCell: function (data) {
      // Add background color to total row
      if (data.row.index === 2) {
        data.cell.styles.fillColor = [primaryColor[0], primaryColor[1], primaryColor[2]];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = "bold";
      }
    }
  });

  // Add notes section if available
  const notesY = (doc as any).lastAutoTable.finalY + 10;

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(252, 252, 253);
  doc.roundedRect(margin, notesY, contentWidth, 25, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Notes:", margin + 5, notesY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Split long notes into multiple lines
  const splitNotes = doc.splitTextToSize(invoice?.notes || "This is the default notes.", contentWidth - 10);
  doc.text(splitNotes, margin + 5, notesY + 14);

  return doc;
};
