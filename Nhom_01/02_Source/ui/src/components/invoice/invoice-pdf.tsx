"use client";

import React from "react";
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { InvoiceHistoryItem } from "@/type_schema/invoice";

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
  return subtotal * (taxRate / 100);  // Already has proper parentheses
};

// Calculate grand total
const calculateGrandTotal = (items: any[], taxRate = 16) => {
  if (!items || items.length === 0) return 0;
  const subtotal = calculateSubtotal(items);
  const tax = calculateTaxTotal(items, taxRate);
  return subtotal + tax;  // Simple addition, no parentheses needed
};

// Invoice PDF Document
export const InvoiceDocument = ({ invoice }: { invoice: InvoiceHistoryItem }) => (
  <Document>
    <Page
      size="A4"
      style={styles.page}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Invoice</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.text}>Date: {invoice.date || "4/8/25"}</Text>
        </View>
      </View>

      {/* Customer Information */}
      <View style={[styles.section, { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }]}>
        <View>
          <Text style={styles.subtitle}>To</Text>
          <Text style={[styles.text, styles.bold]}>{invoice.customer || "Blick, Walter and Monahan"}</Text>
          <Text style={styles.text}>27607 Mayer Passage</Text>
          <Text style={styles.text}>Port Janet, LA 28012</Text>
          <Text style={styles.text}>VAT-ID: 6011344859299246</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>From</Text>
          <Text style={[styles.text, styles.bold]}>Abbott-Gerhold</Text>
          <Text style={styles.text}>5687 Greenfelder Pine</Text>
          <Text style={styles.text}>99349 East Zoey, Macao</Text>
          <Text style={styles.text}>VAT-ID: 5132365352400664</Text>
        </View>
      </View>

      {/* Invoice Details */}
      <View style={[styles.section, { marginBottom: 20 }]}>
        <Text style={styles.text}>Invoice number: {invoice.id || "2025/003"}</Text>
        <Text style={styles.text}>Payment target: {invoice.dueDate || "4/18/25"}</Text>
        <Text style={styles.text}>Account: C-34833872</Text>
      </View>

      {/* Invoice Items */}
      <View style={styles.section}>
        {/* Table Header */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={{ width: "15%" }}>Date</Text>
          <Text style={{ width: "45%" }}>Description</Text>
          <Text style={{ width: "15%", textAlign: "right" }}>Unit price</Text>
          <Text style={{ width: "10%", textAlign: "right" }}>Quantity</Text>
          <Text style={{ width: "15%", textAlign: "right" }}>Total price</Text>
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

// Main component
const InvoicePDF = ({ invoice }: { invoice: InvoiceHistoryItem }) => {
  return (
    <PDFViewer style={styles.viewer}>
      <InvoiceDocument invoice={invoice} />
    </PDFViewer>
  );
};

export default InvoicePDF;
