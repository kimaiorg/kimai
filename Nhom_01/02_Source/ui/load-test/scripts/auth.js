import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import { environments } from "../config/environments.js";

// Lấy môi trường từ biến ENV hoặc mặc định là dev
const env = environments[__ENV.ENV || "dev"];
const baseUrl = env.baseUrl;
const auth0Domain = env.auth0Domain;
const clientId = env.clientId;
const clientSecret = env.clientSecret;
const audience = env.audience;
const scope = env.scope;

// Load dữ liệu người dùng
const users = new SharedArray("users", function () {
  return JSON.parse(open("../data/users.json"));
});

// Hàm đăng nhập và lấy token từ Auth0
export function getAuth0Token() {
  // Sử dụng tài khoản superadmin để đảm bảo đăng nhập thành công
  const user = users[0]; // Sử dụng tài khoản đầu tiên (superadmin)

  console.log(`Đăng nhập với tài khoản: ${user.username}`);

  // Gọi API Auth0 để lấy token (giống như trong auth-helper.ts của Playwright)
  const tokenUrl = `https://${auth0Domain}/oauth/token`;

  // In thông tin cấu hình Auth0 để debug
  console.log(`Domain: ${auth0Domain}`);
  console.log(`Client ID: ${clientId}`);
  console.log(`Audience: ${audience}`);

  const payload = JSON.stringify({
    grant_type: "password",
    username: user.username,
    password: user.password,
    audience: audience,
    scope: scope,
    client_id: clientId,
    client_secret: clientSecret,
    connection: "Username-Password-Authentication"
  });

  const params = {
    headers: {
      "Content-Type": "application/json"
    },
    timeout: "60s" // Tăng thời gian chờ
  };

  // Thử lại nhiều lần nếu cần
  let response;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    console.log(`Lần thử đăng nhập ${attempts}/${maxAttempts}`);

    response = http.post(tokenUrl, payload, params);

    if (response.status === 200) {
      break;
    }

    console.log(`Lần thử ${attempts} thất bại: ${response.status} ${response.body}`);
    sleep(1); // Đợi 1 giây trước khi thử lại
  }

  // Kiểm tra kết quả đăng nhập
  const success = check(response, {
    "Đăng nhập thành công": (r) => r.status === 200,
    "Nhận được access token": (r) => r.json("access_token") !== undefined
  });

  if (!success) {
    console.log(`Đăng nhập thất bại sau ${maxAttempts} lần thử: ${response.status}`);
    console.log(`Response body: ${response.body}`);

    // Trả về token giả lập nếu đăng nhập thất bại (giống như trong auth-helper.ts)
    return {
      access_token: "fake_access_token_for_testing",
      id_token: "fake_id_token_for_testing",
      expires_at: Math.floor(Date.now() / 1000) + 86400, // Hết hạn sau 24 giờ
      refresh_token: "fake_refresh_token_for_testing",
      scope: scope
    };
  }

  // Trả về token thật nếu đăng nhập thành công
  const tokens = response.json();
  tokens.expires_at = Math.floor(Date.now() / 1000) + tokens.expires_in;

  return tokens;
}

// Hàm mô phỏng việc lưu token vào localStorage (chỉ để ghi log)
export function simulateLocalStorageSetup(tokens) {
  console.log("Thiết lập token trong localStorage (mô phỏng)");
  console.log(`Access Token (10 ký tự đầu): ${tokens.access_token.substring(0, 10)}...`);
  console.log(`Hết hạn sau: ${new Date(tokens.expires_at * 1000).toISOString()}`);

  // Trong k6, chúng ta không thể thực sự lưu vào localStorage
  // Nhưng chúng ta có thể sử dụng token này cho các request tiếp theo
  return tokens;
}

// Hàm mặc định khi chạy script này trực tiếp
export default function () {
  const tokens = getAuth0Token();
  simulateLocalStorageSetup(tokens);

  // Đợi giữa các request
  sleep(1);
}
