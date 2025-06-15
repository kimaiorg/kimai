import http from "k6/http";
import { check, sleep } from "k6";
import { getAuth0Token } from "./auth.js";
import { environments } from "../config/environments.js";

// Lấy môi trường từ biến ENV hoặc mặc định là dev
const env = environments[__ENV.ENV || "dev"];
const baseUrl = env.baseUrl;

export default function () {
  // Đăng nhập và lấy token
  const tokens = getAuth0Token();

  // Headers cho các request tiếp theo
  const params = {
    headers: {
      "Authorization": `Bearer ${tokens.access_token}`,
      "Content-Type": "application/json"
    },
    tags: { name: "invoice-history" }
  };

  // Truy cập trang invoice history
  console.log("Truy cập trang invoice history");
  const invoiceHistoryResponse = http.get(`${baseUrl}/en/invoice-history`, params);

  check(invoiceHistoryResponse, {
    "Trang Invoice History tải thành công": (r) => r.status === 200,
    "Không bị chuyển hướng đến trang đăng nhập": (r) => !r.url.includes("login"),
    "Chứa dữ liệu hóa đơn": (r) => r.body.includes("invoice") || r.body.includes("Invoice")
  });

  // Giả lập người dùng xem chi tiết hóa đơn (nếu có)
  if (invoiceHistoryResponse.status === 200) {
    // Thử tìm ID hóa đơn từ response (đây là ví dụ, cần điều chỉnh theo cấu trúc thực tế)
    // Trong thực tế, bạn có thể cần phân tích HTML hoặc gọi API riêng để lấy danh sách hóa đơn
    const invoiceId = "123"; // Giả định ID

    console.log(`Xem chi tiết hóa đơn: ${invoiceId}`);

    // Xem chi tiết hóa đơn
    const invoiceDetailResponse = http.get(`${baseUrl}/en/invoice/${invoiceId}`, {
      ...params,
      tags: { name: "invoice-detail" }
    });

    check(invoiceDetailResponse, {
      "Chi tiết hóa đơn tải thành công": (r) => r.status === 200,
      "Chứa thông tin chi tiết hóa đơn": (r) => r.body.includes("details") || r.body.includes("Details")
    });
  }

  // Đợi giữa các request
  sleep(2);
}
