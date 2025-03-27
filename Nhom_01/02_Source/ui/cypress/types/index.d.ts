/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to log in a user
     * @example cy.login('admin@gmail.com', 'Admin123@')
     */
    login(email: string, password: string): Chainable<Element>;

    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('greeting')
     */
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
  }

  interface PluginEvents {
    // Authentication events
    auth: {
      login(credentials: { email: string; password: string }): void;
      logout(): void;
    };
    // Test events
    test: {
      beforeTest(testInfo: { name: string; title: string }): void;
      afterTest(results: { passed: boolean; error?: Error }): void;
    };
  }

  interface PluginConfigOptions {
    // Basic configuration
    baseUrl: string;
    env: {
      environment: "development" | "staging" | "production";
      apiUrl: string;
      credentials?: {
        username: string;
        password: string;
      };
    };
    // Test configuration
    retries: {
      runMode: number;
      openMode: number;
    };
  }
}
