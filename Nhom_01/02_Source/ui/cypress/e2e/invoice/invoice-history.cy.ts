/// <reference types="cypress" />
// Import Auth0Tokens interface
import { Auth0Tokens } from '../../support/commands/auth0-commands';

// Lấy baseUrl từ Cypress config để đảm bảo nhất quán
const getBaseUrl = () => Cypress.config().baseUrl || 'http://localhost:3000';
const localOrigin = 'http://localhost:3000';
const auth0Origin = 'https://dev-r0btd5eozgc7ofkj.us.auth0.com';

describe("Invoice History Page", () => {
  let accessToken: string;
  
  beforeEach(() => {
    // Xóa localStorage và cookies trước mỗi test
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Truy cập trang chủ trước
    cy.visit('/');
    
    // Đăng nhập trước khi mỗi test
    cy.loginToAuth0().then((tokens: Auth0Tokens) => {
      // Lưu token để sử dụng trong test
      accessToken = tokens.accessToken;
      
      // Lưu tokens vào localStorage
      cy.setAuth0Tokens(tokens);
      
      // Reload trang để áp dụng tokens
      cy.reload();
      
      // Đợi một chút để đảm bảo token được xử lý
      cy.wait(1000);
    });
  });

  it('should access invoice-history page via UI', () => {
    // Kiểm tra đã đăng nhập thành công
    cy.window().then((win: Window) => {
      const isAuthenticated = win.localStorage.getItem('auth0.is.authenticated');
      const token = win.localStorage.getItem('auth0.access_token');
      expect(isAuthenticated).to.equal('true');
      // Log token để debug
      if (token) {
        cy.log(`Access Token: ${token.substring(0, 10)}...`);
      }
    });
    
    // Truy cập trực tiếp trang invoice-history
    cy.visit('/en/invoice-history', {
      // Thêm timeout dài hơn để đảm bảo trang tải xong
      timeout: 30000,
      // Bỏ qua lỗi nếu trang trả về 401 (để test có thể tiếp tục và kiểm tra lỗi)
      failOnStatusCode: false
    });
    
    // Kiểm tra URL hiện tại
    cy.url().should('include', '/en/invoice-history');
    
    // Kiểm tra không bị chuyển hướng đến trang đăng nhập
    cy.url().should('not.include', '/login');
    
    // Kiểm tra không có lỗi 401
    cy.get('body').should('not.contain', '401');
    cy.get('body').should('not.contain', 'Unauthorized');
    
    // Kiểm tra các phần tử trên trang invoice-history
    // Thay thế các selector bên dưới bằng các selector thực tế của trang
    cy.get('h1', { timeout: 10000 }).should('exist'); // Kiểm tra có tiêu đề
    cy.contains('Invoice History', { timeout: 10000 }).should('exist'); // Kiểm tra có text "Invoice History"
  });

  it('should display invoice data correctly', () => {
    // Truy cập trực tiếp trang invoice-history sau khi đã đăng nhập
    cy.visit('/en/invoice-history');
    
    // Đợi dữ liệu hóa đơn được tải
    cy.get('table', { timeout: 10000 }).should('be.visible');
    
    // Kiểm tra bảng dữ liệu hóa đơn
    cy.get('table tbody tr').should('have.length.at.least', 1);
    
    // Kiểm tra các cột trong bảng
    cy.get('table thead th').should('exist');
    
    // Kiểm tra chức năng tìm kiếm/lọc (nếu có)
    cy.get('input[type="search"]').should('exist');
    
    // Kiểm tra phân trang (nếu có)
    cy.get('.pagination').should('exist');
  });

  it('should handle empty invoice history gracefully', () => {
    // Giả lập trường hợp không có hóa đơn nào
    // Đây là một ví dụ, bạn có thể cần điều chỉnh cách tiếp cận tùy thuộc vào ứng dụng
    
    // Truy cập trang invoice-history với tham số tìm kiếm không khớp với bất kỳ hóa đơn nào
    cy.visit('/en/invoice-history?search=nonexistentinvoice123456789');
    
    // Kiểm tra thông báo "không có dữ liệu" hoặc bảng trống
    cy.contains('No invoices found').should('exist');
    // Hoặc
    cy.get('table tbody tr').should('have.length', 0);
  });
});
