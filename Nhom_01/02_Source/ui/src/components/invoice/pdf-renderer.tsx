"use client";

import React from "react";
import { InvoiceHistoryItem } from "@/type_schema/invoice";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font, pdf } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500
    },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 }
  ]
});

// Define styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 12,
    padding: 30,
    backgroundColor: "#FFFFFF",
    color: "#333333"
  },
  section: {
    margin: 10,
    padding: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 10
  },
  headerLeft: {
    flexDirection: "column"
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end"
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    color: "#1E40AF"
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 5
  },
  text: {
    fontSize: 12,
    marginBottom: 3
  },
  bold: {
    fontWeight: 700
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingTop: 8,
    paddingBottom: 8
  },
  column: {
    flexDirection: "column",
    marginBottom: 10
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
    fontWeight: 700,
    fontSize: 12
  },
  description: {
    width: "40%"
  },
  quantity: {
    width: "15%",
    textAlign: "center"
  },
  unitPrice: {
    width: "15%",
    textAlign: "right"
  },
  taxRate: {
    width: "15%",
    textAlign: "right"
  },
  amount: {
    width: "15%",
    textAlign: "right"
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
    fontSize: 10,
    color: "#666666"
  },
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20
  },
  totalsTable: {
    width: "40%"
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 5
  },
  grandTotal: {
    backgroundColor: "#F3F4F6",
    fontWeight: 700,
    paddingTop: 8,
    paddingBottom: 8
  },
  notes: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 4
  },
  notesTitle: {
    fontWeight: 700,
    marginBottom: 5
  },
  viewer: {
    width: "100%",
    height: "100%"
  }
});

// Helper types
type HelperFunctions = {
  formatCurrency: (amount: string | number, currency: string) => string;
  calculateItemAmount: (item: any) => number;
  calculateSubtotal: (items: any[]) => number;
  calculateTaxTotal: (items: any[], taxRate?: number) => number;
  calculateGrandTotal: (items: any[], taxRate?: number) => number;
};

// PDF Document Component
export const InvoiceDocument = ({ invoice, helpers }: { invoice: InvoiceHistoryItem; helpers: HelperFunctions }) => {
  const { formatCurrency, calculateSubtotal, calculateTaxTotal, calculateGrandTotal } = helpers;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.subtitle}>{invoice.id || "INV-2025-0001"}</Text>
            <Text style={styles.text}>Date: {invoice.date || "April 8, 2025"}</Text>
            <Text style={styles.text}>Due Date: {invoice.dueDate || "May 8, 2025"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.subtitle}>From</Text>
            <Text style={styles.text}>Kimai Time Tracking</Text>
            <Text style={styles.text}>123 Time Street</Text>
            <Text style={styles.text}>Timekeeper City, TC 12345</Text>
            <Text style={styles.text}>contact@kimai.org</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.column}>
            <Text style={styles.subtitle}>Bill To</Text>
            <Text style={styles.text}>{invoice.customer || "Client Company, Inc."}</Text>
            <Text style={styles.text}>456 Client Avenue</Text>
            <Text style={styles.text}>Client City, CS 67890</Text>
            <Text style={styles.text}>client@example.com</Text>
          </View>

          {/* Table Header */}
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={{ width: "15%" }}>Date</Text>
            <Text style={{ width: "45%" }}>Description</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Rate</Text>
            <Text style={{ width: "10%", textAlign: "right" }}>Qty</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Amount</Text>
          </View>

          {/* Table Rows - Default sample data if no items */}
          {invoice.items && invoice.items.length > 0 ? (
            invoice.items.map((item, index) => (
              <View
                key={index}
                style={styles.row}
              >
                <Text style={{ width: "15%" }}>{item.date || "4/7/25"}</Text>
                <Text style={{ width: "45%" }}>{item.description}</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>
                  {formatCurrency(item.unitPrice, invoice.currency || "TTD")}
                </Text>
                <Text style={{ width: "10%", textAlign: "right" }}>{item.quantity}</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>
                  {formatCurrency(Number(item.quantity) * Number(item.unitPrice), invoice.currency || "TTD")}
                </Text>
              </View>
            ))
          ) : (
            // Sample data rows
            <>
              <View style={styles.row}>
                <Text style={{ width: "15%" }}>4/7/25</Text>
                <Text style={{ width: "45%" }}>Esse ut / Omnis molestias</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>TTD 0.00</Text>
                <Text style={{ width: "10%", textAlign: "right" }}>8.00</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>TTD 0.00</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ width: "15%" }}>4/8/25</Text>
                <Text style={{ width: "45%" }}>Distinctio quod / Dolorem molestiae</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>TTD 71.00</Text>
                <Text style={{ width: "10%", textAlign: "right" }}>0.03</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>TTD 2.37</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ width: "15%" }}>4/8/25</Text>
                <Text style={{ width: "45%" }}>Esse ut / Omnis molestias</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>TTD 0.00</Text>
                <Text style={{ width: "10%", textAlign: "right" }}>8.00</Text>
                <Text style={{ width: "15%", textAlign: "right" }}>TTD 0.00</Text>
              </View>
            </>
          )}

          {/* Totals */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsTable}>
              <View style={styles.totalsRow}>
                <Text>Subtotal</Text>
                <Text>
                  {invoice.items && invoice.items.length > 0
                    ? formatCurrency(calculateSubtotal(invoice.items), invoice.currency || "TTD")
                    : formatCurrency(2.37, "TTD")}
                </Text>
              </View>
              <View style={styles.totalsRow}>
                <Text>Tax (16%)</Text>
                <Text>
                  {invoice.items && invoice.items.length > 0
                    ? formatCurrency(calculateTaxTotal(invoice.items), invoice.currency || "TTD")
                    : formatCurrency(0.38, "TTD")}
                </Text>
              </View>
              <View style={[styles.totalsRow, styles.grandTotal]}>
                <Text>Total</Text>
                <Text>
                  {invoice.items && invoice.items.length > 0
                    ? formatCurrency(calculateGrandTotal(invoice.items), invoice.currency || "TTD")
                    : formatCurrency(2.75, "TTD")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>Invoice generated by Kimai Time Tracking System</Text>
        </View>
      </Page>
    </Document>
  );
};

// Main component for PDF viewer
const PDFRenderer = ({ invoice, helpers }: { invoice: InvoiceHistoryItem; helpers: HelperFunctions }) => {
  return (
    <PDFViewer style={styles.viewer}>
      <InvoiceDocument invoice={invoice} helpers={helpers} />
    </PDFViewer>
  );
};

// Export function to create PDF document for download
export const createDocument = async (invoice: InvoiceHistoryItem, helpers: HelperFunctions) => {
  return pdf(<InvoiceDocument invoice={invoice} helpers={helpers} />);
};

export default PDFRenderer;
