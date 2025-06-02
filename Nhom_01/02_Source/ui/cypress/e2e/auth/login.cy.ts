/// <reference types="cypress" />
// Import Auth0Tokens interface
import { Auth0Tokens } from "../../support/commands/auth0-commands";

// Lấy baseUrl từ Cypress config để đảm bảo nhất quán
const getBaseUrl = () => Cypress.config().baseUrl || "http://localhost:3000";

describe("Auth0 Login Flow (API-based)", () => {
  beforeEach(() => {
    // Always start on your app's origin
    cy.visit("/");
    cy.window().then((win: Window) => {
      win.localStorage.clear();
    });
  });

  it("should login with valid credentials using custom command", () => {
    // Stay on localhost origin throughout
    cy.visit("/");

    // Login via API and get tokens
    cy.loginToAuth0().then((tokens: Auth0Tokens) => {
      // Set tokens in localStorage while on correct origin
      cy.setAuth0Tokens(tokens);

      // Verify authentication
      cy.window().then((win: Window) => {
        expect(win.localStorage.getItem("auth0.is.authenticated")).to.equal("true");
        expect(win.localStorage.getItem("auth0.access_token")).to.equal(tokens.accessToken);
      });
    });
  });

  it("should navigate to invoice-history page via API", () => {
    cy.visit("/");

    cy.loginToAuth0().then((tokens: Auth0Tokens) => {
      // Make API request directly with the token
      cy.request({
        method: "GET",
        url: `${getBaseUrl()}/en/invoice-history`,
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      }).then((response: Cypress.Response<any>) => {
        expect(response.status).to.equal(200);
        cy.log(`Response body length: ${response.body ? response.body.length : 0}`);
      });
    });
  });

  it("should navigate to invoice-history page and check UI", () => {
    cy.visit("/");

    cy.loginToAuth0().then((tokens: Auth0Tokens) => {
      // Sử dụng cy.origin để xử lý cross-origin với baseUrl
      cy.origin(getBaseUrl(), { args: { tokens } }, ({ tokens }) => {
        // Đảm bảo rằng các lệnh bên dưới được thực thi trong origin này
        cy.visit("/");

        // Set tokens in localStorage
        cy.window().then((win: Window) => {
          // Lưu tokens vào localStorage
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

        // Verify authentication state
        cy.window().then((win: Window) => {
          const isAuthenticated = win.localStorage.getItem("auth0.is.authenticated");
          expect(isAuthenticated).to.equal("true");
        });

        // Navigate to the protected page
        cy.visit("/en/invoice-history", {
          timeout: 30000,
          failOnStatusCode: false
        });

        // Check the final URL and page content
        cy.url().then((url: string) => {
          cy.log(`Current URL: ${url}`);
          if (url.includes("/invoice-history")) {
            cy.log("✅ Successfully loaded invoice-history page");
            cy.get("body").should("exist");

            // Add more specific UI checks
            // cy.get('[data-testid="invoice-table"]').should('exist');
          } else {
            cy.log(`❌ Failed to navigate to invoice-history page. Current URL: ${url}`);
          }
        });
      });
    });
  });

  it("should handle invalid credentials via API", () => {
    interface Auth0ErrorResponse {
      error: string;
      error_description?: string;
    }

    const domain = Cypress.env("AUTH0_DOMAIN");
    const clientId = Cypress.env("AUTH0_CLIENT_ID");
    const audience = Cypress.env("AUTH0_AUDIENCE");

    cy.request({
      method: "POST",
      url: `https://${domain}/oauth/token`,
      headers: { "content-type": "application/json" },
      body: {
        grant_type: "password",
        username: "invalid@example.com",
        password: "wrongpassword",
        client_id: clientId,
        audience: audience,
        scope: "openid profile email",
        realm: "Username-Password-Authentication"
      },
      failOnStatusCode: false
    }).then((response: any) => {
      const typedResponse = response as Cypress.Response<Auth0ErrorResponse>;
      expect(typedResponse.status).to.be.oneOf([400, 401, 403]);
      expect(typedResponse.body).to.have.property("error");
    });
  });

  // Test using cy.session for better session management
  it("should login using session management", () => {
    cy.session("auth0-login", () => {
      cy.visit("/");
      cy.loginToAuth0().then((tokens: Auth0Tokens) => {
        cy.setAuth0Tokens(tokens);
      });
    });

    // After session, visit the app
    cy.visit("/");

    // Verify session is maintained
    cy.window().then((win: Window) => {
      expect(win.localStorage.getItem("auth0.is.authenticated")).to.equal("true");
    });

    // Navigate to protected page
    cy.visit("/en/invoice-history", { failOnStatusCode: false });

    cy.url().should("include", "invoice-history");
  });

  // Alternative approach using cy.origin if needed
  it("should handle cross-origin navigation if necessary", () => {
    cy.visit("/");

    cy.loginToAuth0().then((tokens: Auth0Tokens) => {
      // Use cy.origin to handle cross-origin operations
      cy.origin(getBaseUrl(), { args: tokens }, (tokens: Auth0Tokens) => {
        // Đảm bảo rằng các lệnh bên dưới được thực thi trong origin này
        cy.visit("/");

        cy.window().then((win: Window) => {
          // Set tokens in localStorage
          win.localStorage.setItem("auth0.is.authenticated", "true");
          win.localStorage.setItem("auth0.access_token", tokens.accessToken);
          win.localStorage.setItem("auth0.id_token", tokens.idToken);

          // Sử dụng expiresAt từ tokens thay vì tính toán từ expires_in
          win.localStorage.setItem("auth0.expires_at", tokens.expiresAt);
        });

        // Verify authentication
        cy.window().then((win: Window) => {
          expect(win.localStorage.getItem("auth0.is.authenticated")).to.equal("true");
        });

        // Navigate to protected page
        cy.visit("/en/invoice-history", { failOnStatusCode: false });
        cy.url().then((url: string) => {
          cy.log(`Final URL: ${url}`);
        });
      });
    });
  });
});
