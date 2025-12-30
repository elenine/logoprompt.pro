import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const currentUser = context.locals.user;

  if (!currentUser) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await context.request.json();
    const { referralCode } = body;

    if (!referralCode || typeof referralCode !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid referral code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const env = context.locals.runtime?.env;
    if (!env?.DATABASE_URL) {
      return new Response(
        JSON.stringify({ error: 'Database not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);

    // Check if user already has a referral code saved
    const existingUser = await db
      .select({ referredBy: user.referredBy })
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1);

    if (existingUser[0]?.referredBy) {
      // User already has a referral code, don't overwrite
      return new Response(
        JSON.stringify({ success: true, message: 'Referral already saved' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save the referral code
    await db
      .update(user)
      .set({
        referredBy: referralCode,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    return new Response(
      JSON.stringify({ success: true, message: 'Referral code saved' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Save referral error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save referral' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
