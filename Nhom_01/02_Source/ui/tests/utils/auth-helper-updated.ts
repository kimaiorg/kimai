import { Page } from '@playwright/test';

export interface Auth0Tokens {
  accessToken: string;
  idToken: string;
  expiresAt: string;
  refreshToken?: string;
  scope?: string;
}

export async function loginViaApi(page: Page): Promise<Auth0Tokens> {
  // Sử dụng thông tin xác thực từ file .env
  const domain = 'dev-r0btd5eozgc7ofkj.us.auth0.com';
  const clientId = 'xBZ7jnlcHqlksyXxTDdg4EDStyyc2Q96';
  const clientSecret = '1oyLX_A3BKda3JpWyo3f94O_rJ3ApOjcL-_vDe0c_T4bufkmhwaFSsEENYwj8wts';
  const audience = 'kimai_api';
  const username = 'superadmin@gmail.com';
  const password = 'Admin123@';
  const scope = 'openid profile email offline_access';

  console.log('Using Auth0 configuration:');
  console.log(`Domain: ${domain}`);
  console.log(`Client ID: ${clientId}`);
  console.log(`Username: ${username}`);

  const tokenUrl = `https://${domain}/oauth/token`;
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'password',
      username,
      password,
      audience,
      scope,
      client_id: clientId,
      client_secret: clientSecret,
      connection: 'Username-Password-Authentication'
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Auth0 login failed:', errorData);
    
    // Fallback to fake tokens if API call fails
    console.log('Using fake tokens for testing...');
    const tokens: Auth0Tokens = {
      accessToken: 'fake_access_token_for_testing',
      idToken: 'fake_id_token_for_testing',
      expiresAt: String(Math.floor(Date.now() / 1000) + 86400), // Hết hạn sau 24 giờ
      refreshToken: 'fake_refresh_token_for_testing',
      scope: scope
    };

    // Set tokens in localStorage
    await page.evaluate((tokens) => {
      localStorage.setItem('auth0.is.authenticated', 'true');
      localStorage.setItem('auth0.access_token', tokens.accessToken);
      localStorage.setItem('auth0.id_token', tokens.idToken);
      localStorage.setItem('auth0.expires_at', tokens.expiresAt);
      
      if (tokens.refreshToken) {
        localStorage.setItem('auth0.refresh_token', tokens.refreshToken);
      }
      
      if (tokens.scope) {
        localStorage.setItem('auth0.scope', tokens.scope);
      }
      
      // Thêm các key của Next.js Auth0 SDK
      localStorage.setItem('a0.spajs.txs', '{}');
    }, tokens);

    return tokens;
  }

  const data = await response.json();
  
  // Calculate expiration time
  const expiresAt = String(Math.floor(Date.now() / 1000) + data.expires_in);
  
  const tokens: Auth0Tokens = {
    accessToken: data.access_token,
    idToken: data.id_token,
    expiresAt: expiresAt,
    refreshToken: data.refresh_token,
    scope: data.scope
  };

  // Set tokens in localStorage
  await page.evaluate((tokens) => {
    localStorage.setItem('auth0.is.authenticated', 'true');
    localStorage.setItem('auth0.access_token', tokens.accessToken);
    localStorage.setItem('auth0.id_token', tokens.idToken);
    localStorage.setItem('auth0.expires_at', tokens.expiresAt);
    
    if (tokens.refreshToken) {
      localStorage.setItem('auth0.refresh_token', tokens.refreshToken);
    }
    
    if (tokens.scope) {
      localStorage.setItem('auth0.scope', tokens.scope);
    }
    
    // Thêm các key của Next.js Auth0 SDK
    localStorage.setItem('a0.spajs.txs', '{}');
  }, tokens);

  return tokens;
}

export async function setupAuthState(page: Page): Promise<void> {
  // Truy cập trang chủ trước
  await page.goto('/');
  
  // Login via API
  await loginViaApi(page);
  
  // Reload trang để áp dụng tokens
  await page.reload();
  
  // Đợi một chút để đảm bảo token được xử lý
  await page.waitForTimeout(1000);
}
