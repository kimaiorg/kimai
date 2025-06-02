import { test as setup } from "@playwright/test";

// File where the authentication state will be saved
const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // 1. Navigate to your application
  console.log("Navigating to the application...");
  await page.goto("http://localhost:3000");

  // 2. Wait for login form to load
  console.log("Waiting for login form to load...");
  await page.waitForSelector("form", { timeout: 10000 });

  // Take screenshot of the login form
  await page.screenshot({ path: "test-results/login-form.png" });

  // 3. Use a more direct approach to fill the form
  console.log("Filling login form...");

  // Type email directly into the focused field
  await page.keyboard.insertText("Superadmin@gmail.com");
  await page.keyboard.press("Tab");
  await page.keyboard.insertText("Admin123@");

  // Take screenshot after filling
  await page.screenshot({ path: "test-results/after-fill.png" });

  // 4. Press Enter to submit the form
  console.log("Submitting form...");
  await page.keyboard.press("Enter");

  // 5. Follow the onboarding flow to reach the dashboard
  console.log("Starting onboarding flow...");

  // Wait for the first screen after login
  await page.waitForLoadState("networkidle", { timeout: 10000 });
  await page.screenshot({ path: "test-results/after-login-screen1.png" });

  // Click 'Get Started' button
  console.log("Clicking Get Started button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Get Started")');

  // Wait for the next screen
  await page.waitForLoadState("networkidle", { timeout: 5000 });
  await page.screenshot({ path: "test-results/after-get-started.png" });

  // Click first 'Continue' button
  console.log("Clicking first Continue button...");
  await page.waitForTimeout(1500); // Wait 1.5 seconds
  await page.click('button:has-text("Continue")');

  // Wait for the next screen
  await page.waitForLoadState("networkidle", { timeout: 5000 });
  await page.screenshot({ path: "test-results/after-continue1.png" });

  // Click second 'Continue' button
  console.log("Clicking second Continue button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Continue")');

  // Wait for the next screen
  await page.waitForLoadState("networkidle", { timeout: 5000 });
  await page.screenshot({ path: "test-results/after-continue2.png" });

  // Click 'Go to Dashboard' button
  console.log("Clicking Go to Dashboard button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Go to Dashboard")');

  // Wait for dashboard to load
  console.log("Waiting for dashboard to load...");
  await page.waitForLoadState("networkidle", { timeout: 10000 });

  // Take screenshot of the dashboard
  await page.screenshot({ path: "test-results/dashboard.png" });

  // Pause for 3 seconds on the dashboard screen
  console.log("Pausing on dashboard for 3 seconds...");
  await page.waitForTimeout(5000);

  // Log where we are
  const currentUrl = page.url();
  console.log("Current URL after onboarding:", currentUrl);

  // Check if we're on the dashboard
  const pageContent = await page.content();
  const isOnDashboard =
    pageContent.includes("Dashboard") || pageContent.includes("Timesheet") || pageContent.includes("Projects");

  console.log("Dashboard status:", isOnDashboard ? "Successfully reached dashboard" : "Not on dashboard");

  // Save authentication state to be used in other tests
  console.log("Saving authentication state...");
  await page.context().storageState({ path: authFile });
});
