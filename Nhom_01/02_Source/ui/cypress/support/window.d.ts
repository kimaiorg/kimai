// Thêm type cho window và localStorage
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      window(options?: Partial<Cypress.Loggable & Timeoutable & Withinable & Shadow>): Chainable<Window>;
    }
  }
  
  interface Window {
    localStorage: Storage;
  }
}

export {};
