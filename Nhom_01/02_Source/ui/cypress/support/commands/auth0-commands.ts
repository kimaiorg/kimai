/// <reference types="cypress" />

// Định nghĩa kiểu dữ liệu cho response từ Auth0
interface Auth0TokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  token_type: string;
  scope?: string;
  refresh_token?: string;
}

// Auth0 error response
interface Auth0ErrorResponse {
  error: string;
  error_description?: string;
}

// Token object để trả về từ loginToAuth0 command
export interface Auth0Tokens {
  accessToken: string;
  idToken: string;
  expiresAt: string;
  refreshToken?: string;
  scope?: string;
}

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to Auth0 using API
       * @example cy.loginToAuth0('username', 'password')
       */
      loginToAuth0(
        username?: string,
        password?: string,
        options?: {
          domain?: string;
          clientId?: string;
          clientSecret?: string;
          audience?: string;
          scope?: string;
        }
      ): Chainable<Auth0Tokens>;

      /**
       * Custom command to set Auth0 tokens in localStorage
       * @example cy.setAuth0Tokens(tokens)
       */
      setAuth0Tokens(tokens: Auth0Tokens): Chainable<void>;
    }
  }
}

/**
 * Custom command để đăng nhập vào Auth0 qua API
 */
Cypress.Commands.add(
  "loginToAuth0",
  (
    username = Cypress.env("AUTH0_USERNAME"),
    password = Cypress.env("AUTH0_PASSWORD"),
    options: {
      domain?: string;
      clientId?: string;
      clientSecret?: string;
      audience?: string;
      scope?: string;
    } = {}
  ) => {
    const domain = options.domain || Cypress.env("AUTH0_DOMAIN");
    const clientId = options.clientId || Cypress.env("AUTH0_CLIENT_ID");
    const clientSecret = options.clientSecret || Cypress.env("AUTH0_CLIENT_SECRET");
    const audience = options.audience || Cypress.env("AUTH0_AUDIENCE");
    const scope = options.scope || "openid profile email offline_access";

    if (!domain || !clientId) {
      throw new Error("Missing Auth0 configuration. Please check your cypress.config.ts file or .env.");
    }

    const body = {
      grant_type: "password",
      username,
      password,
      audience,
      scope,
      client_id: clientId,
      client_secret: clientSecret,
      connection: "Username-Password-Authentication"
    };

    const tokenUrl = `https://${domain}/oauth/token`;

    // Log request details for debugging
    cy.log(`🔑 Sending Auth0 token request to ${tokenUrl}`);
    cy.log(`💬 Using client_id: ${clientId.substring(0, 5)}...`);

    return cy
      .request({
        method: "POST",
        url: tokenUrl,
        headers: { "Content-Type": "application/json" },
        body,
        timeout: 60000,
        failOnStatusCode: false
      })
      .then((response: any) => {
        const typedResponse = response as Cypress.Response<Auth0TokenResponse | Auth0ErrorResponse>;

        if (typedResponse.status !== 200) {
          const errorBody = typedResponse.body as Auth0ErrorResponse;
          cy.log(`❌ Auth0 login failed: ${errorBody.error} - ${errorBody.error_description || ""}`);
          throw new Error(`Auth0 login failed: ${errorBody.error} - ${errorBody.error_description || ""}`);
        }

        const authBody = typedResponse.body as Auth0TokenResponse;
        const { access_token, id_token, expires_in } = authBody;

        // Calculate expiration time
        const expiresAt = String(Math.floor(Date.now() / 1000) + expires_in);

        // Create tokens object
        const tokens: Auth0Tokens = {
          accessToken: access_token,
          idToken: id_token,
          expiresAt: expiresAt,
          refreshToken: authBody.refresh_token,
          scope: authBody.scope
        };

        // Set tokens in localStorage
        cy.window().then((win: Window) => {
          win.localStorage.setItem("auth0.is.authenticated", "true");
          win.localStorage.setItem("auth0.access_token", tokens.accessToken);
          win.localStorage.setItem("auth0.id_token", tokens.idToken);
          win.localStorage.setItem("auth0.expires_at", tokens.expiresAt);

          if (tokens.refreshToken) {
            win.localStorage.setItem("auth0.refresh_token", tokens.refreshToken);
          }

          if (tokens.scope) {
            win.localStorage.setItem("auth0.scope", tokens.scope);
          }

          // Thêm các key của Next.js Auth0 SDK
          win.localStorage.setItem("a0.spajs.txs", "{}");
        });

        cy.log("✅ Successfully logged in to Auth0");
        cy.log(`ℹ️ Token info: access_token length=${access_token.length}, id_token length=${id_token.length}`);

        return cy.wrap(tokens);
      });
  }
);

/**
 * Command để lưu Auth0 tokens vào localStorage
 */
Cypress.Commands.add("setAuth0Tokens", (tokens: Auth0Tokens) => {
  return cy.window().then((win: Window) => {
    // Lưu tokens vào localStorage
    win.localStorage.setItem("auth0.is.authenticated", "true");
    win.localStorage.setItem("auth0.access_token", tokens.accessToken);
    win.localStorage.setItem("auth0.id_token", tokens.idToken);
    win.localStorage.setItem("auth0.expires_at", tokens.expiresAt);

    // Lưu các trường tùy chọn
    if (tokens.refreshToken) {
      win.localStorage.setItem("auth0.refresh_token", tokens.refreshToken);
    }

    if (tokens.scope) {
      win.localStorage.setItem("auth0.scope", tokens.scope);
    }

    // Thêm các key của Next.js Auth0 SDK
    win.localStorage.setItem("a0.spajs.txs", "{}");

    cy.log("✅ Auth0 tokens set in localStorage");
  });
});
