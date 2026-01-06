// Environment variable helper for local development and deployment
// Note: For local dev, ensure .env file exists at project root
// For production, environment variables are provided by the hosting platform

export interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BREVO_API_KEY: string;
  SITE_URL: string;
  POLAR_ACCESS_TOKEN: string;
  POLAR_WEBHOOK_SECRET: string;
}

// Helper to get env var from multiple sources (Astro, process.env, Deno for edge)
function getEnvVar(key: string): string {
  // Try import.meta.env first (Astro's native way)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Fallback to process.env for Node.js environments
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // Return empty string if not found (will be caught by validation)
  return '';
}

export function getEnv(): Env {
  return {
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    BETTER_AUTH_SECRET: getEnvVar('BETTER_AUTH_SECRET'),
    BETTER_AUTH_URL: getEnvVar('BETTER_AUTH_URL'),
    GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET'),
    BREVO_API_KEY: getEnvVar('BREVO_API_KEY'),
    SITE_URL: getEnvVar('SITE_URL'),
    POLAR_ACCESS_TOKEN: getEnvVar('POLAR_ACCESS_TOKEN'),
    POLAR_WEBHOOK_SECRET: getEnvVar('POLAR_WEBHOOK_SECRET'),
  };
}
