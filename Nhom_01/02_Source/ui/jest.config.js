const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/_*.{js,jsx,ts,tsx}",
    "!src/**/*.stories.{js,jsx,ts,tsx}"
  ],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}"],
  // Exclude utility files from test runs
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/", "<rootDir>/src/__tests__/utils/"]
};

module.exports = createJestConfig(customJestConfig);
