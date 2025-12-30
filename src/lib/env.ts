// Environment variable helper for Vercel deployment

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

export function getEnv(): Env {
  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    BREVO_API_KEY: process.env.BREVO_API_KEY!,
    SITE_URL: process.env.SITE_URL!,
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN!,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET!,
  };
}
