import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { affiliatePayoutSettings } from '@/db/schema-admin';
import { eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// GET - Get affiliate payout settings
export const GET: APIRoute = async (context) => {
  const currentUser = context.locals.user;

  if (!currentUser || !context.locals.isAffiliate) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const db = getDb(env.DATABASE_URL);

    const settings = await db
      .select()
      .from(affiliatePayoutSettings)
      .where(eq(affiliatePayoutSettings.userId, currentUser.id))
      .limit(1);

    if (!settings[0]) {
      // Return default settings
      return new Response(
        JSON.stringify({
          settings: {
            payoutMethod: 'paypal',
            country: 'other',
            paypalEmail: null,
            bankName: null,
            bankBranch: null,
            bankAccountNumber: null,
            bankAccountName: null,
            minimumPayout: '5.00',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ settings: settings[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get affiliate settings error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch settings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST/PUT - Save affiliate payout settings
export const POST: APIRoute = async (context) => {
  const currentUser = context.locals.user;

  if (!currentUser || !context.locals.isAffiliate) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const body = await context.request.json();
    const {
      payoutMethod,
      country,
      paypalEmail,
      bankName,
      bankBranch,
      bankAccountNumber,
      bankAccountName,
    } = body;

    // Validate
    if (!payoutMethod || !['paypal', 'bank_transfer'].includes(payoutMethod)) {
      return new Response(
        JSON.stringify({ error: 'Invalid payout method' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (payoutMethod === 'paypal' && !paypalEmail) {
      return new Response(
        JSON.stringify({ error: 'PayPal email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (payoutMethod === 'bank_transfer') {
      if (!bankName || !bankAccountNumber || !bankAccountName) {
        return new Response(
          JSON.stringify({ error: 'Bank details are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const db = getDb(env.DATABASE_URL);

    // Check if settings exist
    const existing = await db
      .select({ id: affiliatePayoutSettings.id })
      .from(affiliatePayoutSettings)
      .where(eq(affiliatePayoutSettings.userId, currentUser.id))
      .limit(1);

    const settingsData = {
      payoutMethod: payoutMethod as 'paypal' | 'bank_transfer',
      country: country || 'other',
      paypalEmail: paypalEmail || null,
      bankName: bankName || null,
      bankBranch: bankBranch || null,
      bankAccountNumber: bankAccountNumber || null,
      bankAccountName: bankAccountName || null,
      updatedAt: new Date(),
    };

    if (existing[0]) {
      // Update
      await db
        .update(affiliatePayoutSettings)
        .set(settingsData)
        .where(eq(affiliatePayoutSettings.userId, currentUser.id));
    } else {
      // Insert
      await db.insert(affiliatePayoutSettings).values({
        id: crypto.randomUUID(),
        userId: currentUser.id,
        ...settingsData,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Save affiliate settings error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save settings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
