import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { referralLink } from '@/db/schema-admin';
import { eq, and, sql } from 'drizzle-orm';

export const prerender = false;

// Default direct ad URL when no referral or invalid referral
const DEFAULT_DIRECT_URL = 'https://otieu.com/4/9338001';

export const GET: APIRoute = async (context) => {
  const refCode = context.url.searchParams.get('ref');

  // If no ref code, return default URL
  if (!refCode) {
    return new Response(
      JSON.stringify({ url: DEFAULT_DIRECT_URL }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = context.locals.runtime?.env;
  if (!env?.DATABASE_URL) {
    // If database not configured, return default
    return new Response(
      JSON.stringify({ url: DEFAULT_DIRECT_URL }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const db = getDb(env.DATABASE_URL);

    // Find the referral link
    const link = await db
      .select({
        id: referralLink.id,
        directAdUrl: referralLink.directAdUrl,
        isActive: referralLink.isActive,
        clickCount: referralLink.clickCount,
      })
      .from(referralLink)
      .where(
        and(
          eq(referralLink.referralCode, refCode),
          eq(referralLink.isActive, true)
        )
      )
      .limit(1);

    if (!link[0]) {
      return new Response(
        JSON.stringify({ url: DEFAULT_DIRECT_URL }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Increment click count (fire and forget for performance)
    db.update(referralLink)
      .set({
        clickCount: sql`COALESCE(${referralLink.clickCount}, 0) + 1`,
        updatedAt: new Date(),
      })
      .where(eq(referralLink.id, link[0].id))
      .catch(console.error);

    return new Response(
      JSON.stringify({ url: link[0].directAdUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Referral URL fetch error:', error);
    return new Response(
      JSON.stringify({ url: DEFAULT_DIRECT_URL }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
