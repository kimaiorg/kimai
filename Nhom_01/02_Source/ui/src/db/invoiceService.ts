import { InvoiceHistoryItem, InvoiceTemplate, INVOICE_STATUS_OPTIONS } from "@/type_schema/invoice";
import {
  loadInvoicesFromLocalStorage,
  saveInvoicesToLocalStorage,
  loadTemplatesFromLocalStorage,
  saveTemplatesToLocalStorage,
  mockCustomers
} from "./mockData";

// Interface for creating a new invoice
export interface CreateInvoiceParams {
  customer: string;
  templateId: string;
  items: InvoiceItem[];
  dueDate?: string; // Optional due date
  notes?: string; // Optional notes
}

// Invoice item interface
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

// Interface for updating invoice status
export interface UpdateInvoiceStatusParams {
  id: string;
  status: string;
  paymentDate?: string;
  notes?: string;
}

// Invoice service class to handle all invoice operations
export class InvoiceService {
  // Get all invoices
  static getInvoices(): InvoiceHistoryItem[] {
    return loadInvoicesFromLocalStorage();
  }

  // Get a single invoice by ID
  static getInvoiceById(id: string): InvoiceHistoryItem | undefined {
    const invoices = this.getInvoices();
    return invoices.find((invoice) => invoice.id === id);
  }

  // Create a new invoice
  static createInvoice(params: CreateInvoiceParams): InvoiceHistoryItem {
    const { customer, templateId, items, dueDate, notes } = params;

    // Calculate total price
    let totalPrice = 0;
    for (const item of items) {
      const itemTotal = item.quantity * item.unitPrice;
      const tax = itemTotal * (item.taxRate / 100);
      totalPrice += itemTotal + tax;
    }

    // Format the total price
    const formattedTotalPrice = totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Create invoice
    const invoice: InvoiceHistoryItem = {
      id: `INV-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString().split("T")[0],
      dueDate,
      customer,
      status: "New",
      totalPrice: formattedTotalPrice,
      currency: "TTD",
      createdBy: "JD", // In a real app, this would be the current user
      createdAt: new Date().toISOString(),
      notes,
      items
    };

    // Save to localStorage
    const invoices = this.getInvoices();
    invoices.unshift(invoice);
    saveInvoicesToLocalStorage(invoices);

    return invoice;
  }

  // Update invoice status
  static updateInvoiceStatus(params: UpdateInvoiceStatusParams): InvoiceHistoryItem {
    const invoices = this.getInvoices();
    const index = invoices.findIndex((invoice) => invoice.id === params.id);

    if (index === -1) {
      throw new Error("Invoice not found");
    }

    // Validate status
    if (!INVOICE_STATUS_OPTIONS.includes(params.status)) {
      throw new Error("Invalid status");
    }

    // Update the invoice
    invoices[index] = {
      ...invoices[index],
      status: params.status
      // We could add more fields here like paymentDate, notes, etc.
    };

    // Save the updated invoices
    saveInvoicesToLocalStorage(invoices);

    return invoices[index];
  }

  // Delete an invoice
  static deleteInvoice(id: string): boolean {
    const invoices = this.getInvoices();
    const filteredInvoices = invoices.filter((invoice) => invoice.id !== id);

    if (filteredInvoices.length === invoices.length) {
      return false; // No invoice was deleted
    }

    saveInvoicesToLocalStorage(filteredInvoices);
    return true;
  }

  // Add an invoice directly to history
  static addInvoiceToHistory(invoice: InvoiceHistoryItem): InvoiceHistoryItem {
    const invoices = this.getInvoices();

    // Add to the beginning of the invoices array
    invoices.unshift(invoice);

    // Save to localStorage
    saveInvoicesToLocalStorage(invoices);

    return invoice;
  }

  // Get all templates
  static getTemplates(): InvoiceTemplate[] {
    return loadTemplatesFromLocalStorage();
  }

  // Get a single template by ID
  static getTemplateById(id: string): InvoiceTemplate | undefined {
    const templates = this.getTemplates();
    return templates.find((template) => template.id === id);
  }

  // Create a new template
  static createTemplate(template: Omit<InvoiceTemplate, "id" | "createdAt">): InvoiceTemplate {
    const templates = this.getTemplates();

    // Create the new template
    const newTemplate: InvoiceTemplate = {
      ...template,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };

    // Add to templates and save
    templates.push(newTemplate);
    saveTemplatesToLocalStorage(templates);

    return newTemplate;
  }

  // Update a template
  static updateTemplate(id: string, template: Partial<InvoiceTemplate>): InvoiceTemplate {
    const templates = this.getTemplates();
    const index = templates.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Template not found");
    }

    // Update the template
    templates[index] = {
      ...templates[index],
      ...template,
      updatedAt: new Date().toISOString()
    };

    // Save the updated templates
    saveTemplatesToLocalStorage(templates);

    return templates[index];
  }

  // Delete a template
  static deleteTemplate(id: string): boolean {
    const templates = this.getTemplates();
    const filteredTemplates = templates.filter((template) => template.id !== id);

    if (filteredTemplates.length === templates.length) {
      return false; // No template was deleted
    }

    saveTemplatesToLocalStorage(filteredTemplates);
    return true;
  }

  // Get all customers
  static getCustomers(): string[] {
    return mockCustomers;
  }

  // Initialize the database with mock data (if needed)
  static initializeDatabase(): void {
    // Check if we already have data in localStorage
    const invoices = loadInvoicesFromLocalStorage();
    const templates = loadTemplatesFromLocalStorage();

    // If we don't have any data, save the mock data
    if (invoices.length === 0) {
      saveInvoicesToLocalStorage(invoices);
    }

    if (templates.length === 0) {
      saveTemplatesToLocalStorage(templates);
    }
  }
}
