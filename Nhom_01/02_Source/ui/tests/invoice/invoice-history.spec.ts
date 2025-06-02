import { test, expect } from "@playwright/test";
import { setupAuthState } from "../utils/auth-helper";

test.describe("Invoice History Page", () => {
  test.beforeEach(async ({ page }) => {
    // Thiết lập trạng thái xác thực trước mỗi test
    await setupAuthState(page);
  });

  test("should access invoice-history page via UI", async ({ page }) => {
    // Kiểm tra đã đăng nhập thành công
    const isAuthenticated = await page.evaluate(() => localStorage.getItem("auth0.is.authenticated"));
    expect(isAuthenticated).toBe("true");

    // Log token để debug
    const token = await page.evaluate(() => localStorage.getItem("auth0.access_token"));
    console.log(`Access Token: ${token?.substring(0, 10)}...`);

    // Truy cập trực tiếp trang invoice-history
    await page.goto("/en/invoice-history", { timeout: 30000 });

    // Kiểm tra URL hiện tại
    expect(page.url()).toContain("/en/invoice-history");

    // Kiểm tra không bị chuyển hướng đến trang đăng nhập
    expect(page.url()).not.toContain("/login");

    // Kiểm tra không có lỗi 401
    const pageContent = await page.content();
    expect(pageContent).not.toContain("401");
    expect(pageContent).not.toContain("Unauthorized");

    // Kiểm tra các phần tử trên trang invoice-history
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Invoice History")).toBeVisible({ timeout: 10000 });
  });

  test("should display invoice data correctly", async ({ page }) => {
    // Truy cập trực tiếp trang invoice-history sau khi đã đăng nhập
    await page.goto("/en/invoice-history");

    // Đợi dữ liệu hóa đơn được tải
    await expect(page.locator("table")).toBeVisible({ timeout: 10000 });

    // Kiểm tra bảng dữ liệu hóa đơn
    const rows = await page.locator("table tbody tr").count();
    expect(rows).toBeGreaterThanOrEqual(1);

    // Kiểm tra các cột trong bảng
    await expect(page.locator("table thead th")).toBeVisible();

    // Kiểm tra chức năng tìm kiếm/lọc (nếu có)
    await expect(page.locator('input[type="search"]')).toBeVisible();

    // Kiểm tra phân trang (nếu có)
    await expect(page.locator(".pagination")).toBeVisible();
  });

  test("should handle empty invoice history gracefully", async ({ page }) => {
    // Giả lập trường hợp không có hóa đơn nào
    await page.goto("/en/invoice-history?search=nonexistentinvoice123456789");

    // Kiểm tra thông báo "không có dữ liệu" hoặc bảng trống
    const noDataMessage = page.getByText("No invoices found");
    if (await noDataMessage.isVisible()) {
      await expect(noDataMessage).toBeVisible();
    } else {
      const rows = await page.locator("table tbody tr").count();
      expect(rows).toBe(0);
    }
  });
});
