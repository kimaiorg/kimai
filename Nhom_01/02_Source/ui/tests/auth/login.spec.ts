import { test, expect } from '@playwright/test';
import { loginViaApi } from '../utils/auth-helper';

test.describe('Auth0 Login Flow', () => {
  test('should login with valid credentials using API', async ({ page }) => {
    // Truy cập trang chủ
    await page.goto('/');
    
    // Login via API
    await loginViaApi(page);
    
    // Kiểm tra đã đăng nhập thành công
    const isAuthenticated = await page.evaluate(() => localStorage.getItem('auth0.is.authenticated'));
    expect(isAuthenticated).toBe('true');
    
    // Reload trang để áp dụng tokens
    await page.reload();

    await page.goto('/en/dashboard');
    
   
  });

  test('should navigate to protected pages after login', async ({ page }) => {
    // Thiết lập trạng thái xác thực
    await page.goto('/');
    await loginViaApi(page);
    await page.reload();
    
    // Truy cập trang được bảo vệ
    await page.goto('/en/invoice-history');
    
    // Kiểm tra URL hiện tại
    expect(page.url()).toContain('/en/invoice-history');
    
    // Kiểm tra không bị chuyển hướng đến trang đăng nhập
    expect(page.url()).not.toContain('/login');
  });
});
