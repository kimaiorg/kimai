# Test info

- Name: Invoice History Page >> should access invoice-history page via UI
- Location: C:\Users\dhuu3\Desktop\kimai\Nhom_01\02_Source\ui\tests\invoice\invoice-history.spec.ts:10:7

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Invoice History')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for getByText('Invoice History')

    at C:\Users\dhuu3\Desktop\kimai\Nhom_01\02_Source\ui\tests\invoice\invoice-history.spec.ts:35:53
```

# Page snapshot

```yaml
- main:
  - heading "401" [level=1]
  - paragraph: Unauthorized
  - button "Login"
- region "Notifications alt+T"
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { setupAuthState } from '../utils/auth-helper';
   3 |
   4 | test.describe('Invoice History Page', () => {
   5 |   test.beforeEach(async ({ page }) => {
   6 |     // Thiết lập trạng thái xác thực trước mỗi test
   7 |     await setupAuthState(page);
   8 |   });
   9 |
  10 |   test('should access invoice-history page via UI', async ({ page }) => {
  11 |     // Kiểm tra đã đăng nhập thành công
  12 |     const isAuthenticated = await page.evaluate(() => localStorage.getItem('auth0.is.authenticated'));
  13 |     expect(isAuthenticated).toBe('true');
  14 |     
  15 |     // Log token để debug
  16 |     const token = await page.evaluate(() => localStorage.getItem('auth0.access_token'));
  17 |     console.log(`Access Token: ${token?.substring(0, 10)}...`);
  18 |     
  19 |     // Truy cập trực tiếp trang invoice-history
  20 |     await page.goto('/en/invoice-history', { timeout: 30000 });
  21 |     
  22 |     // Kiểm tra URL hiện tại
  23 |     expect(page.url()).toContain('/en/invoice-history');
  24 |     
  25 |     // Kiểm tra không bị chuyển hướng đến trang đăng nhập
  26 |     expect(page.url()).not.toContain('/login');
  27 |     
  28 |     // Kiểm tra không có lỗi 401
  29 |     const pageContent = await page.content();
  30 |     expect(pageContent).not.toContain('401');
  31 |     expect(pageContent).not.toContain('Unauthorized');
  32 |     
  33 |     // Kiểm tra các phần tử trên trang invoice-history
  34 |     await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
> 35 |     await expect(page.getByText('Invoice History')).toBeVisible({ timeout: 10000 });
     |                                                     ^ Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
  36 |   });
  37 |
  38 |   test('should display invoice data correctly', async ({ page }) => {
  39 |     // Truy cập trực tiếp trang invoice-history sau khi đã đăng nhập
  40 |     await page.goto('/en/invoice-history');
  41 |     
  42 |     // Đợi dữ liệu hóa đơn được tải
  43 |     await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
  44 |     
  45 |     // Kiểm tra bảng dữ liệu hóa đơn
  46 |     const rows = await page.locator('table tbody tr').count();
  47 |     expect(rows).toBeGreaterThanOrEqual(1);
  48 |     
  49 |     // Kiểm tra các cột trong bảng
  50 |     await expect(page.locator('table thead th')).toBeVisible();
  51 |     
  52 |     // Kiểm tra chức năng tìm kiếm/lọc (nếu có)
  53 |     await expect(page.locator('input[type="search"]')).toBeVisible();
  54 |     
  55 |     // Kiểm tra phân trang (nếu có)
  56 |     await expect(page.locator('.pagination')).toBeVisible();
  57 |   });
  58 |
  59 |   test('should handle empty invoice history gracefully', async ({ page }) => {
  60 |     // Giả lập trường hợp không có hóa đơn nào
  61 |     await page.goto('/en/invoice-history?search=nonexistentinvoice123456789');
  62 |     
  63 |     // Kiểm tra thông báo "không có dữ liệu" hoặc bảng trống
  64 |     const noDataMessage = page.getByText('No invoices found');
  65 |     if (await noDataMessage.isVisible()) {
  66 |       await expect(noDataMessage).toBeVisible();
  67 |     } else {
  68 |       const rows = await page.locator('table tbody tr').count();
  69 |       expect(rows).toBe(0);
  70 |     }
  71 |   });
  72 | });
```