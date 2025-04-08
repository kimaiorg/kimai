"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash2, FileText, FileCode } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Template } from "@/app/(pages)/invoice-template/page";

interface InvoiceTemplateListProps {
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
}

export function InvoiceTemplateList({ templates, setTemplates }: InvoiceTemplateListProps) {
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter((t) => t.id !== selectedTemplate.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const saveTemplate = (updatedTemplate: Template) => {
    setTemplates(templates.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t)));
    setIsEditDialogOpen(false);
  };

  const getFormatIcon = (format: string) => {
    return format === "PDF" ? (
      <FileText className="h-4 w-4 text-red-500" />
    ) : (
      <FileCode className="h-4 w-4 text-blue-500" />
    );
  };

  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">{t("invoiceTemplate.NAME")}</TableHead>
            <TableHead className="font-semibold">{t("invoiceTemplate.FORMAT")}</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow
              key={template.id}
              className="hover:bg-gray-50"
            >
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFormatIcon(template.format)}
                  <span>{template.format}</span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(template)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>{t("invoiceTemplate.EDIT")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(template)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("invoiceTemplate.DELETE")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {templates.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-6 text-gray-500"
              >
                {t("invoiceTemplate.NO_TEMPLATES_FOUND")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("invoiceTemplate.CONFIRM_DELETION")}</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete the template "{selectedTemplate?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              {t("invoiceTemplate.CANCEL")}
            </button>
            <button
              onClick={confirmDelete}
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
            >
              {t("invoiceTemplate.DELETE")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              onClick={() => selectedTemplate && saveTemplate(selectedTemplate)}
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
