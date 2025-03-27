/// <reference types="cypress" />

describe("Login Flow", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("/api/auth/login");
  });

  it("should display the login form", () => {
    // Check if the login form is displayed
    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("should login with admin credentials", () => {
    cy.get('input[name="username"]').type("admin@gmail.com");
    cy.get('input[name="password"]').type("Admin123@");
    cy.get('button[type="submit"]').click();

    // Wait for redirect and check if we're logged in
    cy.url().should("include", "/dashboard");
    cy.getByTestId("user-menu").should("be.visible");
  });

  it("should show error with invalid credentials", () => {
    cy.get('input[name="username"]').type("invalid@example.com");
    cy.get('input[name="password"]').type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Check for error message
    cy.contains("Wrong email or password").should("be.visible");
  });
});
