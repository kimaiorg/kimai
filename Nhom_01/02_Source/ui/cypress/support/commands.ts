/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

// Import Testing Library commands
import "@testing-library/cypress/add-commands";

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in with email and password
       * @example cy.login('admin@gmail.com', 'Admin123@')
       */
      login(email: string, password: string): Chainable<Element>;

      /**
       * Custom command to select DOM element by data-testid attribute
       * @example cy.getByTestId('dashboard-title')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Login command implementation
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.log("Logging in with credentials");
  cy.visit("/api/auth/login");
  cy.get('input[name="username"]').type(email);
  cy.get('input[name="password"]').type(password, { log: false });
  cy.get('button[type="submit"]').click();

  // Wait for redirect after successful login
  cy.url().should("include", "/dashboard");
});

// getByTestId command implementation
Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});
