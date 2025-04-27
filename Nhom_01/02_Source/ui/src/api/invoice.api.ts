import { getManagementAccessToken } from "@/api/auth.api";
import { FilterInvoiceRequestDTO, InvoiceHistoryType, UpdateInvoiceRequestDTO } from "@/type_schema/invoice";
import axios from "axios";

const INVOICE_BACKEND_URL = process.env.INVOICE_BACKEND_URL;

export async function filterInvoices(request: FilterInvoiceRequestDTO): Promise<any> {
  const token = await getManagementAccessToken();
  try {
    const response = await axios.post(`${INVOICE_BACKEND_URL}/api/v1/invoices/filter`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

// BE trước khi return => lưu tạm => Invoice id temp. => save invoice => invoice id real
// const invoiceFilterResponse = {
//   data: {
//     invoice_id_temp: "id",
//     totalMoney: 1110,
//     totalDuration: 129,
//     customer: CustomerType,
//     activities: [
//       {
//         name: "",
//         // Activity Type
//         tasks: [
//           // Task Type
//         ]
//       },
//       {
//         name: "",
//         // Activity Type
//         tasks: [
//           // Task Type
//         ]
//       }
//     ]
//   }
// };

// invoice/generate
// Client
const payload = {
  invoice_id: "invoice_id_temp",
  notes: ""
};

export async function saveInvoice(invoice: InvoiceHistoryType): Promise<any> {
  const token = await getManagementAccessToken();

  try {
    const response = await axios.post(`${INVOICE_BACKEND_URL}/api/v1/invoices/generate`, invoice, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}

export async function updateInvoiceStatus(request: UpdateInvoiceRequestDTO, invoiceId: string): Promise<any> {
  const token = await getManagementAccessToken();

  // const invoiceHistories = JSON.parse(localStorage.getItem("invoiceHistoryList") || "[]") as InvoiceHistoryType[];
  // const invoiceHistory = invoiceHistories.findIndex((item) => item.id === invoiceId);
  // if (invoiceHistory !== -1) {
  //   invoiceHistories[invoiceHistory].status = request.status;
  //   invoiceHistories[invoiceHistory].dueDate = request.paymentDate;
  //   invoiceHistories[invoiceHistory].notes = request.description;
  // }
  // localStorage.setItem("invoiceHistoryList", JSON.stringify(invoiceHistories));

  // return 200;
  try {
    const response = await axios.post(`/api/v1/invoices/generate`, request, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.status;
  } catch (error: any) {
    return error.response.status;
  }
}
