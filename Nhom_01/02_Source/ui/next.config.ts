import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_IAM_API_AUDIENCE: process.env.AUTH0_IAM_API_AUDIENCE,
    AUTH0_KIMAI_API_AUDIENCE: process.env.AUTH0_KIMAI_API_AUDIENCE,
    AUTH0_KIMAI_API_ID: process.env.AUTH0_KIMAI_API_ID,
    BACKEND_URL: process.env.BACKEND_URL
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: true
  },
  // Ensure trailing slashes are consistent
  trailingSlash: false,
  // Increase serverless function timeout for Auth0 callbacks
  serverRuntimeConfig: {
    timeout: 60
  },
  images: {
    domains: ["s.gravatar.com", "cdn.auth0.com"]
  }
};

export default nextConfig;
