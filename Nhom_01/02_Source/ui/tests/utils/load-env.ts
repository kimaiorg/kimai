import * as fs from 'fs';
import * as path from 'path';

export interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  username: string;
  password: string;
}

export function loadEnvConfig(): Auth0Config {
  try {
    const envPath = path.resolve(process.cwd(), '.env.playwright');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const config: Record<string, string> = {};
    
    // Parse .env file
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        config[key] = value;
      }
    });
    
    return {
      domain: config.AUTH0_DOMAIN || 'dev-r0btd5eozgc7ofkj.us.auth0.com',
      clientId: config.AUTH0_CLIENT_ID || '',
      clientSecret: config.AUTH0_CLIENT_SECRET || '',
      audience: config.AUTH0_AUDIENCE || '',
      username: config.AUTH0_USERNAME || 'superadmin@gmail.com',
      password: config.AUTH0_PASSWORD || 'Admin123@'
    };
  } catch (error) {
    console.error('Error loading .env.playwright file:', error);
    
    // Fallback to default values
    return {
      domain: 'dev-r0btd5eozgc7ofkj.us.auth0.com',
      clientId: 'your_client_id',
      clientSecret: 'your_client_secret',
      audience: 'your_audience',
      username: 'superadmin@gmail.com',
      password: 'Admin123@'
    };
  }
}
