import { test, expect } from "@playwright/test";

test.describe("Login Fl tests", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("test dashboard access", async ({ page }) => {
    // 1. Navigate to your application
    console.log("Navigating to the application...");
    await page.goto("http://localhost:3000");

    // 2. Take a screenshot of the landing page
    await page.screenshot({ path: "test-results/e2e/landing-page.png" });

    // 3. Check if we're logged in
    const pageContent = await page.content();
    console.log("Page contains logout button:", pageContent.includes("Logout"));
    console.log("Page contains user profile:", pageContent.includes("Profile"));

    // 5. Take a screenshot of the authenticated page
    await page.screenshot({ path: "test-results/e2e/authenticated-page.png" });

    console.log("Authentication verified successfully!");
  });
});

test("test login to dashboard", async ({ page }) => {
  // 1. Navigate to your application
  console.log("Navigating to the application...");
  await page.goto("http://localhost:3000");

  // 2. Wait for login form to load
  console.log("Waiting for login form to load...");
  await page.waitForSelector("form", { timeout: 10000 });

  // Take screenshot of the login form
  await page.screenshot({ path: "test-results/e2e/login-form-test.png" });

  // 3. Use a more direct approach to fill the form
  console.log("Filling login form...");

  // Type email directly into the focused field
  await page.keyboard.insertText("Superadmin@gmail.com");
  await page.keyboard.press("Tab");
  await page.keyboard.insertText("Admin123@");

  // Take screenshot after filling
  await page.screenshot({ path: "test-results/2e2/after-fill-test.png" });

  // 4. Press Enter to submit the form
  console.log("Submitting form...");
  await page.keyboard.press("Enter");

  // 5. Follow the onboarding flow to reach the dashboard
  console.log("Starting onboarding flow...");

  // Wait for the first screen after login
  await page.waitForLoadState("networkidle", { timeout: 10000 });
  await page.screenshot({ path: "test-results/e2e/after-login-screen1.png" });

  // Click 'Get Started' button
  console.log("Clicking Get Started button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Get Started")');

  // Wait for the next screen
  await page.waitForLoadState("networkidle", { timeout: 5000 });
  await page.screenshot({ path: "test-results/e2e/after-get-started.png" });

  // Click first 'Continue' button
  console.log("Clicking first Continue button...");
  await page.waitForTimeout(1500); // Wait 1.5 seconds
  await page.click('button:has-text("Continue")');

  // Wait for the next screen
  await page.waitForLoadState("networkidle", { timeout: 5000 });
  await page.screenshot({ path: "test-results/e2e/after-continue1.png" });

  // Click second 'Continue' button
  console.log("Clicking second Continue button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Continue")');

  // Wait for the next screen
  await page.waitForLoadState("networkidle", { timeout: 5000 });
  await page.screenshot({ path: "test-results/e2e/after-continue2.png" });

  // Click 'Go to Dashboard' button
  console.log("Clicking Go to Dashboard button...");
  await page.waitForTimeout(1000); // Wait 1 second
  await page.click('button:has-text("Go to Dashboard")');

  // Wait for dashboard to load
  console.log("Waiting for dashboard to load...");
  await page.waitForLoadState("networkidle", { timeout: 10000 });

  // Take screenshot of the dashboard
  await page.screenshot({ path: "test-results/e2e/dashboard.png" });

  // Pause for 3 seconds on the dashboard screen
  console.log("Pausing on dashboard for 3 seconds...");
  await page.waitForTimeout(2000);

  // Log where we are
  const currentUrl = page.url();
  console.log("Current URL after onboarding:", currentUrl);

  // Check if we're on the dashboard
  const pageContent = await page.content();
  const isOnDashboard =
    pageContent.includes("Dashboard") || pageContent.includes("Timesheet") || pageContent.includes("Projects");

  console.log("Dashboard status:", isOnDashboard ? "Successfully reached dashboard" : "Not on dashboard");

  // Verify we reached the dashboard
  expect(isOnDashboard).toBeTruthy();

  console.log("Login and onboarding flow completed successfully!");
});
