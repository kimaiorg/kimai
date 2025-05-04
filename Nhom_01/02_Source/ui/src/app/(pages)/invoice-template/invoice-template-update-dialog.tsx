"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { InvoiceTemplate } from "@/type_schema/invoice";
import { useState } from "react";

export function InvoiceTemplateUpdateDialog({
  children,
  targetInvoiceTemplate,
  refetchInvoiceTemplates
}: {
  children: React.ReactNode;
  targetInvoiceTemplate: InvoiceTemplate;
  refetchInvoiceTemplates: () => void;
}) {
  const { t } = useTranslation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>(targetInvoiceTemplate);

  const saveTemplate = () => {
    refetchInvoiceTemplates();
    setIsEditDialogOpen(false);
  };

  return (
    <div className="rounded-md">
      {/* Edit Template Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader>
            <DialogTitle>{t("invoiceTemplate.EDIT_TEMPLATE")}</DialogTitle>
          </DialogHeader>
          <div className="py-2 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.TEMPLATE_NAME")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.name || ""}
                onChange={(e) => selectedTemplate && setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.FORMAT")} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.format || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, format: e.target.value })
                }
              >
                <option value="PDF">{t("invoiceTemplate.PDF")}</option>
                <option value="HTML">{t("invoiceTemplate.HTML")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.TITLE")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.title || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.COMPANY_NAME")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.companyName || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, companyName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.VAT_ID")}</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.vatId || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, vatId: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.ADDRESS")}</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                value={selectedTemplate?.address || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.CONTACT")}</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                value={selectedTemplate?.contact || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, contact: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.TERMS_OF_PAYMENT")}</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                value={selectedTemplate?.termsOfPayment || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, termsOfPayment: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.BANK_ACCOUNT")}</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={2}
                value={selectedTemplate?.bankAccount || ""}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, bankAccount: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.PAYMENT_TERM")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.paymentTerm || "30"}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, paymentTerm: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.TAX_RATE")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.taxRate || "0.000"}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, taxRate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.LANGUAGE")} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.language || "English"}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, language: e.target.value })
                }
                required
              >
                <option value="English">{t("invoiceTemplate.ENGLISH")}</option>
                <option value="Vietnamese">{t("invoiceTemplate.VIETNAMESE")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.INVOICE_NUMBER_GENERATOR")} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.invoiceNumberGenerator || "Configured format"}
                onChange={(e) =>
                  selectedTemplate &&
                  setSelectedTemplate({ ...selectedTemplate, invoiceNumberGenerator: e.target.value })
                }
                required
              >
                <option value="Configured format">{t("invoiceTemplate.CONFIGURED_FORMAT")}</option>
                <option value="Custom format">{t("invoiceTemplate.CUSTOM_FORMAT")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.INVOICE_TEMPLATE")} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.invoiceTemplate || "Invoice"}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, invoiceTemplate: e.target.value })
                }
                required
              >
                <option value="Invoice">{t("invoiceTemplate.INVOICE")}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">{t("invoiceTemplate.DOWNLOAD_TEMPLATES")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("invoiceTemplate.GROUPING")} <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTemplate?.grouping || "Default (one row per entry)"}
                onChange={(e) =>
                  selectedTemplate && setSelectedTemplate({ ...selectedTemplate, grouping: e.target.value })
                }
                required
              >
                <option value="Default (one row per entry)">{t("invoiceTemplate.DEFAULT_GROUPING")}</option>
                <option value="Activity">{t("invoiceTemplate.ACTIVITY")}</option>
                <option value="Project">{t("invoiceTemplate.PROJECT")}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">{t("invoiceTemplate.GROUPING_DESCRIPTION")}</p>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              {t("invoiceTemplate.CANCEL")}
            </button>
            <button
              onClick={saveTemplate}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            >
              {t("invoiceTemplate.SAVE")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
