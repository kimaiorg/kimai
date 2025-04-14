"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { InvoiceTemplateList } from "@/components/invoice/invoice-template-list";
import { CreateTemplateDialog } from "@/components/invoice/create-template-dialog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Role } from "@/type_schema/role";
import { InvoiceTemplate } from "@/type_schema/invoice";
import { Button } from "@/components/ui/button";

function InvoiceTemplatePage() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([
    {
      id: "1",
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
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
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
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
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
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      name: "Testing",
      format: "PDF",
      title: "Test Invoice",
      companyName: "Test Company",
      vatId: "TEST123456",
      address: "Test Address\nTest City",
      contact: "Phone: 123-456-7890\nEmail: test@example.com\nWeb: www.test.com",
      termsOfPayment: "Test payment terms",
      bankAccount: "Test Bank\nBIC: TESTBIC\nIBAN: TESTIBAN12345",
      paymentTerm: "7",
      taxRate: "10.000",
      language: "English",
      invoiceNumberGenerator: "Configured format",
      invoiceTemplate: "Invoice",
      grouping: "Default (one row per entry)",
      createdAt: new Date().toISOString()
    },
    {
      id: "5",
      name: "Timesheet (HTML)",
      format: "HTML",
      title: "Timesheet",
      companyName: "Timesheet Solutions",
      vatId: "TS123456789",
      address: "789 Time Street\nLondon, UK",
      contact: "Phone: +44 20 1234567\nEmail: info@timesheet.co.uk\nWeb: www.timesheet.co.uk",
      termsOfPayment: "Payment due upon receipt",
      bankAccount: "HSBC\nBIC: HSBCGB2L\nIBAN: GB29HBUK40524401234567",
      paymentTerm: "0",
      taxRate: "20.000",
      language: "English",
      invoiceNumberGenerator: "Configured format",
      invoiceTemplate: "Invoice",
      grouping: "Activity",
      createdAt: new Date().toISOString()
    }
  ]);

  const handleCreateTemplate = (newTemplate: Omit<InvoiceTemplate, "id" | "createdAt" | "updatedAt">) => {
    const template: InvoiceTemplate = {
      ...newTemplate,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString()
    };
    setTemplates([...templates, template]);
    setIsCreateDialogOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Templates</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-1 bg-main text-white"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <InvoiceTemplateList
        templates={templates}
        setTemplates={setTemplates}
      />

      <CreateTemplateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateTemplate}
      />
    </>
  );
}

// Sử dụng AuthenticatedRoute như một Higher-Order Component
const AuthenticatedInvoiceTemplatePage = AuthenticatedRoute(InvoiceTemplatePage, [Role.ADMIN, Role.SUPER_ADMIN]);

export default AuthenticatedInvoiceTemplatePage;
