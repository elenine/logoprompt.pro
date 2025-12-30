/// <reference types="astro/client" />

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
    isAffiliate: boolean;
  }
}
