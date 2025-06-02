import { test, expect } from '@playwright/test';
import { loginViaApi } from './auth-helper';

test.describe('Auth Helper Test', () => {
  test('should successfully get tokens from Auth0', async ({ page }) => {
    // Truy cập trang chủ
    await page.goto('/');
    
    // Gọi loginViaApi và log kết quả
    console.log('Calling loginViaApi...');
    const tokens = await loginViaApi(page);
    
    // Log thông tin token (chỉ hiển thị một phần để bảo mật)
    console.log('Access Token (first 10 chars):', tokens.accessToken.substring(0, 10) + '...');
    console.log('ID Token (first 10 chars):', tokens.idToken.substring(0, 10) + '...');
    console.log('Expires At:', new Date(Number(tokens.expiresAt) * 1000).toISOString());
    
    // Kiểm tra tokens có tồn tại
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.idToken).toBeTruthy();
    expect(tokens.expiresAt).toBeTruthy();
    
    // Kiểm tra localStorage
    const isAuthenticated = await page.evaluate(() => localStorage.getItem('auth0.is.authenticated'));
    const storedAccessToken = await page.evaluate(() => localStorage.getItem('auth0.access_token'));
    
    console.log('Is Authenticated in localStorage:', isAuthenticated);
    console.log('Access Token in localStorage exists:', !!storedAccessToken);
    
    expect(isAuthenticated).toBe('true');
    expect(storedAccessToken).toBeTruthy();
  });
});
