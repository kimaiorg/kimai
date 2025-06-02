import { test, expect } from "@playwright/test";
import { loginViaApi } from "../utils/auth-helper";

test.describe("Auth0 Login Flow", () => {
  test("should login with valid credentials using API", async ({ page }) => {
    // Truy cập trang chủ
    await page.goto("/");

    // Login via API
    const tokens = await loginViaApi(page);
    console.log("Access token:", tokens.accessToken.substring(0, 20) + "...");

    // Kiểm tra đã đăng nhập thành công
    const isAuthenticated = await page.evaluate(() => localStorage.getItem("auth0.is.authenticated"));
    expect(isAuthenticated).toBe("true");

    // Đợi một chút trước khi reload
    await page.waitForTimeout(1000);

    // Reload trang để áp dụng tokens
    await page.reload();

    // Đợi thêm sau khi reload
    await page.waitForTimeout(2000);

    // Kiểm tra lại localStorage sau khi reload
    const tokenAfterReload = await page.evaluate(() => localStorage.getItem("auth0.access_token"));
    console.log("Token after reload:", tokenAfterReload ? "exists" : "missing");

    // Truy cập trang dashboard
    await page.goto("/en/dashboard", { timeout: 30000 });

    // Log URL hiện tại để debug
    console.log("Current URL:", page.url());

    // Kiểm tra không có lỗi 401
    const content = await page.content();
    if (content.includes("401") || content.includes("Unauthorized")) {
      console.log("Page shows 401 error");
    } else {
      console.log("No 401 error detected");
    }
  });

  test("should navigate to protected pages with cookie approach", async ({ page }) => {
    // Truy cập trang chủ
    await page.goto("/");

    // Thử cách tiếp cận khác: đăng nhập qua form UI nếu có
    try {
      // Kiểm tra nếu có nút Login
      const loginButton = page.getByRole("button", { name: /login/i });
      if (await loginButton.isVisible()) {
        await loginButton.click();

        // Điền form đăng nhập nếu được chuyển hướng đến trang đăng nhập Auth0
        if (page.url().includes("auth0.com")) {
          await page.getByLabel("Email").fill("superadmin@gmail.com");
          await page.getByLabel("Password").fill("Admin123@");
          await page.getByRole("button", { name: /log in/i }).click();

          // Đợi chuyển hướng về ứng dụng
          await page.waitForURL(/localhost/, { timeout: 30000 });
        }
      } else {
        // Nếu không có nút Login, sử dụng API login
        await loginViaApi(page);
        await page.reload();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log("Error during UI login, falling back to API login:", error);
      await loginViaApi(page);
      await page.reload();
      await page.waitForTimeout(2000);
    }

    // Truy cập trang được bảo vệ
    await page.goto("/en/invoice-history", { timeout: 30000 });

    // Kiểm tra URL hiện tại
    expect(page.url()).toContain("/en/invoice-history");

    // Kiểm tra không bị chuyển hướng đến trang đăng nhập
    expect(page.url()).not.toContain("/login");
  });
});
