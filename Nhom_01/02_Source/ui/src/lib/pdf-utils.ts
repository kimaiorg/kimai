"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDuration } from "./utils";

interface ReportPdfOptions {
  title: string;
  subtitle?: string;
  columns: string[];
  data: any[][];
  filename: string;
  orientation?: "portrait" | "landscape";
  companyInfo?: {
    name: string;
    address?: string;
    logo?: string;
  };
  customerInfo?: {
    name: string;
    address?: string;
    contact?: string;
  };
  summary?: {
    label: string;
    value: string;
  }[];
}

/**
 * Generate a PDF report using jsPDF and jspdf-autotable
 * @param options PDF generation options
 * @returns Blob URL of the generated PDF
 */
export function generateReportPdf(options: ReportPdfOptions): string {
  // Create PDF document
  const doc = new jsPDF({
    orientation: options.orientation || "portrait",
    unit: "mm",
    format: "a4"
  });

  // Set document properties
  doc.setProperties({
    title: options.title,
    subject: options.subtitle || "",
    creator: "Kimai Time Tracking",
    author: "Kimai"
  });

  // Add header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(options.title, 14, 20);

  if (options.subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(options.subtitle, 14, 28);
  }

  // Add company info if provided
  let yPos = 40;
  if (options.companyInfo) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(options.companyInfo.name, 14, yPos);

    if (options.companyInfo.address) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const addressLines = options.companyInfo.address.split("\n");
      addressLines.forEach((line, index) => {
        doc.text(line, 14, yPos + 5 + index * 4);
      });
      yPos += 5 + addressLines.length * 4;
    }

    yPos += 10;
  }

  // Add customer info if provided
  if (options.customerInfo) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Customer:", 14, yPos);
    doc.text(options.customerInfo.name, 35, yPos);

    if (options.customerInfo.address) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      const addressLines = options.customerInfo.address.split("\n");
      addressLines.forEach((line, index) => {
        doc.text(line, 35, yPos + 5 + index * 4);
      });
      yPos += 5 + addressLines.length * 4;
    }

    if (options.customerInfo.contact) {
      doc.setFontSize(9);
      doc.text("Contact:", 14, yPos + 5);
      doc.text(options.customerInfo.contact, 35, yPos + 5);
      yPos += 5;
    }

    yPos += 10;
  }

  // Add table
  autoTable(doc, {
    head: [options.columns],
    body: options.data,
    startY: yPos,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // Add summary if provided
  if (options.summary && options.summary.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary:", 14, finalY);

    options.summary.forEach((item, index) => {
      doc.setFontSize(9);
      doc.text(item.label + ":", 14, finalY + 5 + index * 5);
      doc.text(item.value, 50, finalY + 5 + index * 5);
    });
  }

  // Add page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );

    // Add footer with date
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on ${today}`, 14, doc.internal.pageSize.getHeight() - 10);
  }

  // Generate and return blob URL
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}

/**
 * Generate a PDF for weekly report
 * @param title Report title
 * @param weekInfo Week information
 * @param columns Column headers
 * @param data Table data
 * @param filename Output filename
 * @returns Blob URL of the generated PDF
 */
export function generateWeeklyReportPdf(
  title: string,
  weekInfo: { number: number; year: number; start: string; end: string },
  columns: string[],
  data: any[][],
  filename: string
): string {
  const subtitle = `Week ${weekInfo.number}, ${weekInfo.year} (${weekInfo.start} to ${weekInfo.end})`;

  return generateReportPdf({
    title,
    subtitle,
    columns,
    data,
    filename,
    orientation: "landscape",
    companyInfo: {
      name: "Kimai Time Tracking",
      address: "123 Time Street\nTracking City, TC 12345"
    },
    summary: [
      {
        label: "Total Hours",
        value: formatDuration(
          data.reduce((sum, row) => {
            // Assuming the total duration is in the second column (index 1)
            if (!row[1] || typeof row[1] !== "string") {
              return sum; // Skip invalid entries
            }

            const durationParts = row[1].split(":");
            if (durationParts.length < 2) {
              return sum; // Skip invalid format
            }

            const hours = parseInt(durationParts[0]) || 0;
            const minutes = parseInt(durationParts[1]) || 0;
            return sum + hours * 3600 + minutes * 60;
          }, 0)
        )
      }
    ]
  });
}

/**
 * Generate a PDF for project overview report
 * @param title Report title
 * @param columns Column headers
 * @param data Table data
 * @param filename Output filename
 * @param summary Optional summary data to display at the end
 * @returns Blob URL of the generated PDF
 */
export function generateProjectOverviewPdf(
  title: string,
  columns: string[],
  data: any[][],
  filename: string,
  summary?: Array<{ label: string; value: string }>
): string {
  return generateReportPdf({
    title,
    columns,
    data,
    filename,
    orientation: "landscape",
    companyInfo: {
      name: "Kimai Time Tracking",
      address: "123 Time Street\nTracking City, TC 12345"
    },
    summary
  });
}

/**
 * Generate a PDF invoice for a project
 * @param invoiceData Invoice data
 * @returns Blob URL of the generated PDF
 */
export function generateInvoicePdf(invoiceData: {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyInfo: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  customerInfo: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  paymentTerms?: string;
}): string {
  // Create PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Set document properties
  doc.setProperties({
    title: `Invoice #${invoiceData.invoiceNumber}`,
    subject: `Invoice for ${invoiceData.customerInfo.name}`,
    creator: "Kimai Time Tracking",
    author: invoiceData.companyInfo.name
  });

  // Add header with invoice title
  doc.setFontSize(24);
  doc.setTextColor(66, 66, 66);
  doc.text("INVOICE", 14, 20);

  // Add invoice details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 14, 30);
  doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 14, 35);
  doc.text(`Due Date: ${invoiceData.dueDate}`, 14, 40);

  // Add company info
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text("From:", 14, 55);
  doc.setFontSize(10);
  doc.text(invoiceData.companyInfo.name, 14, 60);

  const companyAddressLines = invoiceData.companyInfo.address.split("\n");
  companyAddressLines.forEach((line, index) => {
    doc.text(line, 14, 65 + index * 5);
  });

  let yPos = 65 + companyAddressLines.length * 5;

  if (invoiceData.companyInfo.email) {
    doc.text(`Email: ${invoiceData.companyInfo.email}`, 14, yPos);
    yPos += 5;
  }

  if (invoiceData.companyInfo.phone) {
    doc.text(`Phone: ${invoiceData.companyInfo.phone}`, 14, yPos);
    yPos += 5;
  }

  if (invoiceData.companyInfo.website) {
    doc.text(`Website: ${invoiceData.companyInfo.website}`, 14, yPos);
    yPos += 5;
  }

  // Add customer info
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66);
  doc.text("Bill To:", 120, 55);
  doc.setFontSize(10);
  doc.text(invoiceData.customerInfo.name, 120, 60);

  const customerAddressLines = invoiceData.customerInfo.address.split("\n");
  customerAddressLines.forEach((line, index) => {
    doc.text(line, 120, 65 + index * 5);
  });

  yPos = 65 + customerAddressLines.length * 5;

  if (invoiceData.customerInfo.email) {
    doc.text(`Email: ${invoiceData.customerInfo.email}`, 120, yPos);
    yPos += 5;
  }

  if (invoiceData.customerInfo.phone) {
    doc.text(`Phone: ${invoiceData.customerInfo.phone}`, 120, yPos);
    yPos += 5;
  }

  // Add items table
  autoTable(doc, {
    head: [["Description", "Quantity", "Unit Price", "Amount"]],
    body: invoiceData.items.map((item) => [
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.amount)
    ]),
    startY: 100,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 20, halign: "right" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" }
    }
  });

  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setTextColor(66, 66, 66);

  // Subtotal
  doc.text("Subtotal:", 140, finalY);
  doc.text(formatCurrency(invoiceData.subtotal), 170, finalY, { align: "right" });

  // Tax
  doc.text(`Tax (${invoiceData.taxRate}%):`, 140, finalY + 5);
  doc.text(formatCurrency(invoiceData.taxAmount), 170, finalY + 5, { align: "right" });

  // Total
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Total:", 140, finalY + 12);
  doc.text(formatCurrency(invoiceData.total), 170, finalY + 12, { align: "right" });

  // Add notes if provided
  if (invoiceData.notes) {
    doc.setFontSize(10);
    doc.setTextColor(66, 66, 66);
    doc.text("Notes:", 14, finalY + 25);
    doc.setTextColor(100, 100, 100);
    doc.text(invoiceData.notes, 14, finalY + 30);
  }

  // Add payment terms if provided
  if (invoiceData.paymentTerms) {
    const notesY = invoiceData.notes ? finalY + 40 : finalY + 25;
    doc.setFontSize(10);
    doc.setTextColor(66, 66, 66);
    doc.text("Payment Terms:", 14, notesY);
    doc.setTextColor(100, 100, 100);
    doc.text(invoiceData.paymentTerms, 14, notesY + 5);
  }

  // Add page number and footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );

    // Add footer
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.getHeight() - 10);
  }

  // Generate and return blob URL
  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount);
}
