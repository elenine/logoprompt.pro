/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Env {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  BREVO_API_KEY: string;
  SITE_URL: string;
}

declare namespace App {
  interface Locals extends Runtime {
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
  }
}
