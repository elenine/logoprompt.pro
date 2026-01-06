import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from '@/db';
import * as schema from '@/db/schema';
import { sendPasswordResetEmail } from './email';

interface AuthConfig {
  databaseUrl: string;
  secret: string;
  baseUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  brevoApiKey: string;
}

let authInstance: ReturnType<typeof betterAuth> | null = null;
let currentConfig: AuthConfig | null = null;

export function createAuth(config: AuthConfig) {
  // Return cached instance if config hasn't changed
  if (
    authInstance &&
    currentConfig &&
    currentConfig.databaseUrl === config.databaseUrl &&
    currentConfig.secret === config.secret
  ) {
    return authInstance;
  }

  const db = getDb(config.databaseUrl);

  authInstance = betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
      },
    }),
    baseURL: config.baseUrl,
    secret: config.secret,
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        if (config.brevoApiKey) {
          await sendPasswordResetEmail(config.brevoApiKey, user.email, url);
        }
      },
    },
    socialProviders: {
      google: {
        clientId: config.googleClientId,
        clientSecret: config.googleClientSecret,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update session every 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    advanced: {
      generateId: () => crypto.randomUUID(),
    },
  });

  currentConfig = config;
  return authInstance;
}

export function getAuthFromEnv(env: {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BREVO_API_KEY: string;
}) {
  return createAuth({
    databaseUrl: env.DATABASE_URL,
    secret: env.BETTER_AUTH_SECRET,
    baseUrl: env.BETTER_AUTH_URL,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    brevoApiKey: env.BREVO_API_KEY,
  });
}
