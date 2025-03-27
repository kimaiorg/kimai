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

  // Extend Record<string, any> to avoid empty interface error
  interface PluginEvents extends Record<string, any> {
    // Define plugin events here
  }

  // Extend Record<string, any> to avoid empty interface error
  interface PluginConfigOptions extends Record<string, any> {
    // Define plugin config options here
  }
}
