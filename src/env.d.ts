/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string;
  readonly BETTER_AUTH_SECRET: string;
  readonly BETTER_AUTH_URL: string;
  readonly GOOGLE_CLIENT_ID: string;
  readonly GOOGLE_CLIENT_SECRET: string;
  readonly BREVO_API_KEY: string;
  readonly SITE_URL: string;
  readonly POLAR_ACCESS_TOKEN: string;
  readonly POLAR_WEBHOOK_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    session: {
      user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
      };
      session: {
        id: string;
        userId: string;
        expiresAt: Date;
        token: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress: string | null;
        userAgent: string | null;
      };
    } | null;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    } | null;
    subscription: {
      id: string;
      status: 'active' | 'cancelled' | 'expired' | 'paused';
      currentPeriodEnd: Date | null;
      cancelAtPeriodEnd: boolean;
    } | null;
    isSubscribed: boolean;
    isAdmin: boolean;
  }
}
