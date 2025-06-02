import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Capture screenshot after each test
    screenshot: 'only-on-failure',
    // Record video for failed tests
    video: 'on-first-retry',
    // Set viewport size
    viewport: { width: 1280, height: 720 },
    // Add extra HTTP headers to avoid CORS issues
    extraHTTPHeaders: {
      'Origin': 'http://localhost:3000',
    },
  },
  
  projects: [
    // Setup project to create authentication state
    {
      name: 'setup',
      testMatch: /auth-setup\.ts/,
    },
    
    // Test project that uses authentication state
    {
      name: 'authenticated',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        // Use saved authentication state
        storageState: 'playwright/.auth/user.json',
      },
    },
    
    // Project for testing on different browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
