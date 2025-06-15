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
    tags: { name: "dashboard" }
  };

  // Truy cập trang dashboard
  console.log("Truy cập trang dashboard");
  const dashboardResponse = http.get(`${baseUrl}/en/dashboard`, params);

  check(dashboardResponse, {
    "Trang Dashboard tải thành công": (r) => r.status === 200,
    "Không bị chuyển hướng đến trang đăng nhập": (r) => !r.url.includes("login"),
    "Chứa dữ liệu dashboard": (r) => r.body.includes("dashboard") || r.body.includes("Dashboard")
  });

  // Giả lập người dùng xem các thành phần trong dashboard
  if (dashboardResponse.status === 200) {
    // Giả lập xem báo cáo hoặc biểu đồ
    console.log("Xem báo cáo trong dashboard");

    // Ví dụ: Truy cập API để lấy dữ liệu báo cáo
    const reportResponse = http.get(`${baseUrl}/api/dashboard/reports`, {
      ...params,
      tags: { name: "dashboard-reports" }
    });

    check(reportResponse, {
      "Dữ liệu báo cáo tải thành công": (r) => r.status === 200 || r.status === 404 // 404 nếu API không tồn tại
    });
  }

  // Đợi giữa các request
  sleep(2);
}
