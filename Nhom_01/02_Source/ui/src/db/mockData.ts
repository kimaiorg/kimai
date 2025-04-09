import { InvoiceHistoryItem, InvoiceTemplate, INVOICE_STATUS_OPTIONS } from "@/type_schema/invoice";

// Generate a random date in the format DD.MM.YY
const generateRandomDate = (pastDays = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * pastDays));
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear().toString().slice(2)}`;
};

// Generate a random price
const generateRandomPrice = (min = 100, max = 10000) => {
  const price = (Math.random() * (max - min) + min).toFixed(2);
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Generate a random user initials
const generateRandomUser = () => {
  const users = ["AS", "SU", "JD", "TN", "KL"];
  return users[Math.floor(Math.random() * users.length)];
};

// Generate a random invoice
const generateRandomInvoice = (): InvoiceHistoryItem => {
  const date = generateRandomDate();
  const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const status = INVOICE_STATUS_OPTIONS[Math.floor(Math.random() * INVOICE_STATUS_OPTIONS.length)];
  const totalPrice = generateRandomPrice();
  const createdBy = generateRandomUser();

  // Generate random items
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items = [];

  for (let i = 0; i < itemCount; i++) {
    const quantity = Math.floor(Math.random() * 5) + 1;
    const unitPrice = Math.floor(Math.random() * 1000) + 100;
    const taxRate = [0, 5, 10, 15][Math.floor(Math.random() * 4)];

    items.push({
      description: `Item ${i + 1} - ${["Consulting", "Development", "Design", "Support"][Math.floor(Math.random() * 4)]}`,
      quantity,
      unitPrice,
      taxRate
    });
  }

  // Generate due date (7-30 days from invoice date)
  const parts = date.split(".");
  const invoiceDate = new Date(parseInt(`20${parts[2]}`), parseInt(parts[1]) - 1, parseInt(parts[0]));
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 23) + 7);

  const dueDateFormatted = `${dueDate.getDate().toString().padStart(2, "0")}.${(dueDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${dueDate.getFullYear().toString().slice(2)}`;

  return {
    id: `${date.replace(/\./g, "")}-${Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0")}`,
    date,
    dueDate: dueDateFormatted,
    customer,
    status,
    totalPrice,
    currency: "TTD",
    createdBy,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    notes: Math.random() > 0.5 ? "Payment due within terms specified in contract." : undefined,
    items
  };
};

// Mock customers
export const mockCustomers = [
  "Blick, Walter and Monahan",
  "Acme Corporation",
  "Globex Industries",
  "Stark Enterprises",
  "Wayne Enterprises",
  "Umbrella Corporation",
  "Cyberdyne Systems",
  "Soylent Corp",
  "Massive Dynamic",
  "Aperture Science"
];

// Mock invoice templates
export const mockInvoiceTemplates: InvoiceTemplate[] = [
  {
    id: "template-1",
    name: "Default Template",
    format: "PDF",
    title: "Invoice",
    companyName: "Abbott-Gerlach",
    vatId: "51323653524006",
    address: "5687 Greenfelder Pine\n99349 East Zoey, Macao",
    contact: "Phone: 857.919.4369\nEmail: leannon.cassie@example.org\nWeb: www.example.org",
    termsOfPayment: "I would like to thank you for your confidence and will gladly be there for you again!",
    bankAccount: "Acme Bank\nBIC: AAISANBXBW\nIBAN: DE07700111109999999999",
    paymentTerm: "30",
    taxRate: "0.000",
    language: "English",
    invoiceNumberGenerator: "Configured format",
    invoiceTemplate: "Invoice",
    grouping: "Default (one row per entry)",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "template-2",
    name: "HTML Template",
    format: "HTML",
    title: "Invoice",
    companyName: "Kimai Inc.",
    vatId: "DE123456789",
    address: "123 Main Street\nBerlin, Germany 10115",
    contact: "Phone: +49 30 123456\nEmail: info@kimai.org\nWeb: www.kimai.org",
    termsOfPayment: "Thank you for your business!",
    bankAccount: "Deutsche Bank\nBIC: DEUTDEFFXXX\nIBAN: DE89370400440532013000",
    paymentTerm: "14",
    taxRate: "19.000",
    language: "English",
    invoiceNumberGenerator: "Configured format",
    invoiceTemplate: "Invoice",
    grouping: "Activity",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "template-3",
    name: "Single service date (PDF)",
    format: "PDF",
    title: "Invoice",
    companyName: "Tech Solutions GmbH",
    vatId: "DE987654321",
    address: "456 Tech Street\nMunich, Germany 80331",
    contact: "Phone: +49 89 987654\nEmail: info@techsolutions.de\nWeb: www.techsolutions.de",
    termsOfPayment: "Payment due within 14 days",
    bankAccount: "Commerzbank\nBIC: COBADEFFXXX\nIBAN: DE91100000000123456789",
    paymentTerm: "14",
    taxRate: "19.000",
    language: "English",
    invoiceNumberGenerator: "Configured format",
    invoiceTemplate: "Invoice",
    grouping: "Project",
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Generate mock invoices
export function generateMockInvoices(count = 10): InvoiceHistoryItem[] {
  const invoices: InvoiceHistoryItem[] = [];
  for (let i = 0; i < count; i++) {
    invoices.push(generateRandomInvoice());
  }
  return invoices;
}

// Mock invoices
export const mockInvoices = generateMockInvoices(15);

// Function to save invoices to localStorage
export const saveInvoicesToLocalStorage = (invoices: InvoiceHistoryItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("savedInvoices", JSON.stringify(invoices));
  }
};

// Function to load invoices from localStorage
export const loadInvoicesFromLocalStorage = (): InvoiceHistoryItem[] => {
  if (typeof window !== "undefined") {
    const savedInvoices = localStorage.getItem("savedInvoices");
    if (savedInvoices) {
      return JSON.parse(savedInvoices);
    }
  }
  return mockInvoices;
};

// Function to save templates to localStorage
export const saveTemplatesToLocalStorage = (templates: InvoiceTemplate[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("savedTemplates", JSON.stringify(templates));
  }
};

// Function to load templates from localStorage
export const loadTemplatesFromLocalStorage = (): InvoiceTemplate[] => {
  if (typeof window !== "undefined") {
    const savedTemplates = localStorage.getItem("savedTemplates");
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
  }
  return mockInvoiceTemplates;
};
