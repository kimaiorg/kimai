// Import Auth0Tokens interface
import { Auth0Tokens } from './commands/auth0-commands';

// Thêm type cho custom commands
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login to Auth0 using API
     * @example cy.loginToAuth0('username', 'password')
     * @returns Auth0Tokens object
     */
    loginToAuth0(username?: string, password?: string, options?: {
      domain?: string;
      clientId?: string;
      clientSecret?: string;
      audience?: string;
      scope?: string;
    }): Chainable<Auth0Tokens>;

    /**
     * Custom command to set Auth0 tokens in localStorage
     * @example cy.setAuth0Tokens(tokens)
     */
    setAuth0Tokens(tokens: Auth0Tokens): Chainable<void>;
  }
}
