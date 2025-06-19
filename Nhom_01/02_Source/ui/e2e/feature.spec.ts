import { test, expect } from "@playwright/test";

// Tăng timeout cho toàn bộ test lên 5 phút (300000ms)
test.setTimeout(300000);

// Sử dụng trạng thái xác thực đã lưu cho tất cả các test
test.use({ storageState: "playwright/.auth/user.json" });

// Test case cho Dashboard
test("Dashboard page", async ({ page }) => {
  // Điều hướng đến trang dashboard
  console.log("Navigating to dashboard...");
  await page.goto("http://localhost:3000/dashboard");

  // Chờ đợi dashboard xuất hiện với thời gian không giới hạn
  console.log("Waiting for dashboard content to appear...");

  try {
    // Đặt timeout rất lớn (1 giờ) để đảm bảo không bị timeout
    const longTimeout = 3600000; // 1 giờ

    // Click vào sidebar menu Dashboard nếu có
    try {
      // Tìm và click vào link Dashboard trong sidebar
      const dashboardLink = await page.getByRole("link", { name: "Dashboard" });
      if (await dashboardLink.isVisible()) {
        console.log("Clicking on Dashboard menu item...");
        await dashboardLink.click();
        await page.waitForTimeout(2000); // Đợi sau khi click
      }
    } catch (error) {
      console.log("Dashboard menu item not found or already on dashboard page:", error);
    }

    // Chờ heading "My dashboard" xuất hiện
    await page.getByRole("heading", { name: "My dashboard" }).waitFor({ timeout: longTimeout });

    console.log("✅ Dashboard content found successfully!");
  } catch (error: any) {
    console.error("❌ Error waiting for dashboard content:", error.message);
    // Chụp ảnh màn hình lỗi
    await page.screenshot({ path: "test-results/e2e/dashboard-error.png" });
    throw error; // Re-throw để đánh dấu test thất bại
  }

  // Đợi thêm 2 giây sau khi tìm thấy nội dung để đảm bảo trang đã tải hoàn toàn
  await page.waitForTimeout(2000);

  // Chụp ảnh màn hình dashboard
  await page.screenshot({ path: "test-results/e2e/dashboard.png" });

  // Kiểm tra heading "My dashboard" có xuất hiện không
  await expect(page.getByRole("heading", { name: "My dashboard" })).toBeVisible();

  console.log("Dashboard test completed successfully");
});

// Test case cho Report
test("Report page", async ({ page }) => {
  console.log("Navigating to application...");
  await page.goto("http://localhost:3000");

  // Chờ đợi Report page xuất hiện với thời gian dài
  try {
    const longTimeout = 360000; // 60 giây

    // Click vào sidebar menu Reporting
    console.log("Looking for Reporting menu item in sidebar...");
    const reportingLink = await page.getByRole("link", { name: "Reporting" });
    console.log("Clicking on Reporting menu item...");
    await reportingLink.click();

    // Đợi sau khi click
    await page.waitForTimeout(2000);

    // Chờ heading "Reporting" xuất hiện
    await page.getByRole("heading", { name: "Reporting" }).waitFor({ timeout: longTimeout });
    console.log("✅ Report page loaded successfully!");

    // Chụp ảnh màn hình
    await page.screenshot({ path: "test-results/e2e/report-page.png" });

    // Kiểm tra heading "Reporting" có xuất hiện không
    await expect(page.getByRole("heading", { name: "Reporting" })).toBeVisible();

    console.log("Report page test completed successfully");
  } catch (error: any) {
    console.error("❌ Error loading Report page:", error.message);
    await page.screenshot({ path: "test-results/e2e/report-error.png" });
    throw error;
  }
});

// Test case cho Request Management
test("Request Management Page ", async ({ page }) => {
  console.log("Navigating to application...");
  await page.goto("http://localhost:3000");

  // Chờ đợi Request Management page xuất hiện
  try {
    const longTimeout = 360000; // 60 giây

    // Click vào sidebar menu Request
    console.log("Looking for Request menu item in sidebar...");
    const requestLink = await page.getByRole("link", { name: "Request" });
    console.log("Clicking on Request menu item...");
    await requestLink.click();

    // Đợi sau khi click
    await page.waitForTimeout(2000);

    // Chờ heading "Request Management" xuất hiện
    await page.getByRole("heading", { name: "Request" }).waitFor({ timeout: longTimeout });
    console.log("✅ Request Management page loaded successfully!");

    // Chụp ảnh màn hình
    await page.screenshot({ path: "test-results/e2e/request-page.png" });

    // Kiểm tra heading "Request Management" có xuất hiện không
    await expect(page.getByRole("heading", { name: "Request Management" })).toBeVisible();

    console.log("Request Management page test completed successfully");
  } catch (error: any) {
    console.error("❌ Error loading Request Management page:", error.message);
    await page.screenshot({ path: "test-results/e2e/request-error.png" });
    throw error;
  }
});
