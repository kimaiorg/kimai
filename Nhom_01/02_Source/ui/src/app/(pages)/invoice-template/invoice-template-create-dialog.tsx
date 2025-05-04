"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useState } from "react";

export function InvoiceTemplateCreateDialog({
  children,
  fetchInvoiceTemplates
}: {
  children: React.ReactNode;
  fetchInvoiceTemplates: () => void;
}) {
  const { t } = useTranslation();
  const [templateName, setTemplateName] = useState("");
  const [templateFormat, setTemplateFormat] = useState("PDF");
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatId, setVatId] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [termsOfPayment, setTermsOfPayment] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("30");
  const [taxRate, setTaxRate] = useState("0.000");
  const [language, setLanguage] = useState("English");
  const [invoiceNumberGenerator, setInvoiceNumberGenerator] = useState("Configured format");
  const [invoiceTemplate, setInvoiceTemplate] = useState("Invoice");
  const [grouping, setGrouping] = useState("Default (one row per entry)");

  const [open, setOpen] = useState(false);

  const handleCreateNewInvoiceTemplate = () => {
    setOpen(false);
    fetchInvoiceTemplates();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("invoiceTemplate.CREATE_INVOICE_TEMPLATE")}</DialogTitle>
        </DialogHeader>
        <div className="py-2 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("invoiceTemplate.NAME")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("invoiceTemplate.FORMAT")} <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={templateFormat}
              onChange={(e) => setTemplateFormat(e.target.value)}
              required
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.VAT_ID")}</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={vatId}
              onChange={(e) => setVatId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.ADDRESS")}</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.CONTACT")}</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.TERMS_OF_PAYMENT")}</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              value={termsOfPayment}
              onChange={(e) => setTermsOfPayment(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("invoiceTemplate.BANK_ACCOUNT")}</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("invoiceTemplate.PAYMENT_TERM")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
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
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("invoiceTemplate.LANGUAGE")} <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
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
              value={invoiceNumberGenerator}
              onChange={(e) => setInvoiceNumberGenerator(e.target.value)}
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
              value={invoiceTemplate}
              onChange={(e) => setInvoiceTemplate(e.target.value)}
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
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
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
            onClick={handleCreateNewInvoiceTemplate}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
            disabled={!templateName || !title || !companyName}
          >
            {t("invoiceTemplate.SAVE")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
