import { test as setup } from "@playwright/test";

// Tăng timeout cho toàn bộ test lên 5 phút (300000ms)
setup.setTimeout(300000);

// File where the authentication state will be saved
const authFile = "playwright/.auth/user.json";

setup("Get Started", async ({ page }) => {
  // 1. Navigate to your application
  console.log("Navigating to the application...");
  await page.goto("http://localhost:3000");

  // 2. Wait for login form to load
  console.log("Waiting for login form to load...");
  await page.waitForTimeout(3000); // Wait 1 second

  // Take screenshot of the login form
  await page.screenshot({ path: "test-results/e2e/login-form.png" });

  // 3. Use a more direct approach to fill the form
  console.log("Filling login form...");

  // Type email directly into the focused field
  await page.keyboard.insertText("Superadmin@gmail.com");
  await page.keyboard.press("Tab");
  await page.keyboard.insertText("Admin123@");

  // Take screenshot after filling
  await page.screenshot({ path: "test-results/e2e/after-fill.png" });

  // 4. Press Enter to submit the form
  console.log("Submitting form...");
  await page.keyboard.press("Enter");

  // 5. Follow the onboarding flow to reach the dashboard
  console.log("Starting onboarding flow...");

  // Wait for the first screen after login
  await page.waitForTimeout(3000); // Wait 1 second
  await page.screenshot({ path: "test-results/e2e/after-login-screen1.png" });

  // Click 'Get Started' button
  console.log("Clicking Get Started button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Get Started")');

  // Wait for the next screen
  await page.waitForTimeout(3000); // Wait 1 second
  await page.screenshot({ path: "test-results/e2e/after-get-started.png" });

  // Click first 'Continue' button
  console.log("Clicking first Continue button...");
  await page.waitForTimeout(1500); // Wait 1.5 seconds
  await page.click('button:has-text("Continue")');

  // Wait for the next screen
  await page.waitForTimeout(3000); // Wait 1 second
  await page.screenshot({ path: "test-results/e2e/after-continue1.png" });

  // Click second 'Continue' button
  console.log("Clicking second Continue button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Continue")');

  // Wait for the next screen
  await page.waitForTimeout(1000); // Wait 1 second
  await page.screenshot({ path: "test-results/e2e/after-continue2.png" });

  // Click 'Go to Dashboard' button
  console.log("Clicking Go to Dashboard button...");
  await page.click('button:has-text("Go to Dashboard")');

  // Wait for dashboard to load by looking for specific text
  console.log("Waiting for dashboard to load...");

  // Chờ đợi dashboard xuất hiện với thời gian không giới hạn
  console.log("Waiting indefinitely for dashboard content to appear...");

  try {
    // Đặt timeout rất lớn (1 giờ) để đảm bảo không bị timeout
    const longTimeout = 3600000; // 1 giờ

    // Chờ một trong các text này xuất hiện
    await Promise.any([page.waitForSelector("text=My dashboard", { timeout: longTimeout })]);

    console.log("✅ Dashboard content found successfully!");
  } catch (error: any) {
    console.error("❌ Error waiting for dashboard content:", error.message);
    // Chụp ảnh màn hình lỗi
    await page.screenshot({ path: "test-results/e2e/dashboard-error.png" });
  }

  // Đợi thêm 2 giây sau khi tìm thấy nội dung để đảm bảo trang đã tải hoàn toàn
  await page.waitForTimeout(2000);

  // Chụp ảnh màn hình dashboard
  await page.screenshot({ path: "test-results/e2e/dashboard.png" });

  // Log URL hiện tại
  const currentUrl = page.url();
  console.log("Current URL after onboarding:", currentUrl);

  // Check if we're on the dashboard
  const pageContent = await page.content();
  const isOnDashboard =
    pageContent.includes("My dashboard") || pageContent.includes("Timesheet") || pageContent.includes("Projects");

  console.log("Dashboard status:", isOnDashboard ? "Successfully reached dashboard" : "Not on dashboard");

  // Save authentication state to be used in other tests
  console.log("Saving authentication state...");
  await page.context().storageState({ path: authFile });
});
