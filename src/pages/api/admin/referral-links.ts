import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { referralLink, adminActivityLog } from '@/db/schema-admin';
import { desc, eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// GET - List all referral links
export const GET: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const db = getDb(env.DATABASE_URL);

    const links = await db
      .select({
        id: referralLink.id,
        referralCode: referralLink.referralCode,
        directAdUrl: referralLink.directAdUrl,
        affiliateId: referralLink.affiliateId,
        affiliateName: user.name,
        affiliateEmail: user.email,
        isActive: referralLink.isActive,
        description: referralLink.description,
        clickCount: referralLink.clickCount,
        createdAt: referralLink.createdAt,
      })
      .from(referralLink)
      .leftJoin(user, eq(referralLink.affiliateId, user.id))
      .orderBy(desc(referralLink.createdAt));

    return new Response(
      JSON.stringify({ links }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin referral links error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch referral links' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST - Create new referral link
export const POST: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const body = await context.request.json();
    const { referralCode, directAdUrl, affiliateId, description, isActive } = body;

    if (!referralCode || !directAdUrl) {
      return new Response(
        JSON.stringify({ error: 'Referral code and direct ad URL are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);

    // Check if referral code already exists
    const existing = await db
      .select({ id: referralLink.id })
      .from(referralLink)
      .where(eq(referralLink.referralCode, referralCode))
      .limit(1);

    if (existing[0]) {
      return new Response(
        JSON.stringify({ error: 'Referral code already exists' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const linkId = crypto.randomUUID();

    await db.insert(referralLink).values({
      id: linkId,
      referralCode,
      directAdUrl,
      affiliateId: affiliateId || null,
      description: description || null,
      isActive: isActive !== false,
    });

    // Log admin action
    const adminUser = context.locals.user;
    if (adminUser) {
      await db.insert(adminActivityLog).values({
        id: crypto.randomUUID(),
        adminId: adminUser.id,
        action: 'create_referral_link',
        targetType: 'referral_link',
        targetId: linkId,
        details: { referralCode, directAdUrl, affiliateId },
        ipAddress: context.request.headers.get('x-forwarded-for') || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true, id: linkId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin create referral link error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create referral link' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
