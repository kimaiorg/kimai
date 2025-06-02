/// <reference types="cypress" />

import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

// Load biến môi trường từ file .env
dotenv.config({ path: ".env" });

export default defineConfig({
  e2e: {
    baseUrl: process.env.AUTH0_BASE_URL || "http://localhost:3000",
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Cypress.PluginConfigOptions {
      // Thêm các biến môi trường vào config.env
      config.env = {
        ...config.env,
        AUTH0_DOMAIN: process.env.AUTH0_ISSUER_BASE_URL?.replace("https://", ""),
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_AUDIENCE: process.env.AUTH0_KIMAI_API_AUDIENCE,
        AUTH0_USERNAME: process.env.AUTH0_USERNAME || "superadmin@gmail.com",
        AUTH0_PASSWORD: process.env.AUTH0_PASSWORD || "Admin123@"
      };
      return config;
    }
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  // Tăng thời gian chờ request lên 1 phút
  defaultCommandTimeout: 60000,
  requestTimeout: 60000,
  responseTimeout: 60000
});
