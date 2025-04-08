"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { InvoiceHistoryItem, InvoiceTemplate } from "@/type_schema/invoice";
import { InvoiceService, CreateInvoiceParams } from "./invoiceService";
import { loadInvoicesFromLocalStorage, loadTemplatesFromLocalStorage } from "./mockData";

// Define the context type
interface DatabaseContextType {
  // Invoice data and operations
  invoices: InvoiceHistoryItem[];
  refreshInvoices: () => void;
  updateInvoiceStatus: (id: string, status: string, paymentDate?: string, notes?: string) => void;
  deleteInvoice: (id: string) => void;
  createInvoice: (params: CreateInvoiceParams) => void;

  // Template data and operations
  templates: InvoiceTemplate[];
  refreshTemplates: () => void;
  createTemplate: (template: Omit<InvoiceTemplate, "id" | "createdAt">) => void;
  updateTemplate: (id: string, template: Partial<InvoiceTemplate>) => void;
  deleteTemplate: (id: string) => void;

  // Customer data
  customers: string[];

  // Loading state
  isLoading: boolean;
}

// Create the context with a default value
const DatabaseContext = createContext<DatabaseContextType>({
  invoices: [],
  refreshInvoices: () => {},
  updateInvoiceStatus: () => {},
  deleteInvoice: () => {},
  createInvoice: () => {},

  templates: [],
  refreshTemplates: () => {},
  createTemplate: () => {},
  updateTemplate: () => {},
  deleteTemplate: () => {},

  customers: [],

  isLoading: true
});

// Create a provider component
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<InvoiceHistoryItem[]>([]);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the database on component mount
  useEffect(() => {
    if (isInitialized) return;

    const initializeData = () => {
      try {
        // Initialize the database if needed
        InvoiceService.initializeDatabase();

        // Load data
        setInvoices(loadInvoicesFromLocalStorage());
        setTemplates(loadTemplatesFromLocalStorage());
        setCustomers(InvoiceService.getCustomers());

        setIsLoading(false);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing database:", error);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeData();
  }, [isInitialized]);

  // Function to refresh invoices
  const refreshInvoices = () => {
    setInvoices(InvoiceService.getInvoices());
  };

  // Function to update invoice status
  const updateInvoiceStatus = (id: string, status: string, paymentDate?: string, notes?: string) => {
    try {
      InvoiceService.updateInvoiceStatus({ id, status, paymentDate, notes });
      refreshInvoices();
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  // Function to delete an invoice
  const deleteInvoice = (id: string) => {
    try {
      const success = InvoiceService.deleteInvoice(id);
      if (success) {
        refreshInvoices();
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  // Function to create an invoice
  const createInvoice = (params: CreateInvoiceParams) => {
    try {
      InvoiceService.createInvoice(params);
      refreshInvoices();
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  // Function to refresh templates
  const refreshTemplates = () => {
    setTemplates(InvoiceService.getTemplates());
  };

  // Function to create a template
  const createTemplate = (template: Omit<InvoiceTemplate, "id" | "createdAt">) => {
    try {
      InvoiceService.createTemplate(template);
      refreshTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  // Function to update a template
  const updateTemplate = (id: string, template: Partial<InvoiceTemplate>) => {
    try {
      InvoiceService.updateTemplate(id, template);
      refreshTemplates();
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  // Function to delete a template
  const deleteTemplate = (id: string) => {
    try {
      const success = InvoiceService.deleteTemplate(id);
      if (success) {
        refreshTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  // Create the context value
  const contextValue: DatabaseContextType = {
    invoices,
    refreshInvoices,
    updateInvoiceStatus,
    deleteInvoice,
    createInvoice,

    templates,
    refreshTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,

    customers,

    isLoading
  };

  return <DatabaseContext.Provider value={contextValue}>{children}</DatabaseContext.Provider>;
}

// Custom hook to use the database context
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
