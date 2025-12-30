import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { referralLink, adminActivityLog } from '@/db/schema-admin';
import { eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// GET - Get single referral link
export const GET: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const linkId = context.params.id;
    if (!linkId) {
      return new Response(
        JSON.stringify({ error: 'Link ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);
    const link = await db
      .select()
      .from(referralLink)
      .where(eq(referralLink.id, linkId))
      .limit(1);

    if (!link[0]) {
      return new Response(
        JSON.stringify({ error: 'Referral link not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ link: link[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin get referral link error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch referral link' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH - Update referral link
export const PATCH: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const linkId = context.params.id;
    if (!linkId) {
      return new Response(
        JSON.stringify({ error: 'Link ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { directAdUrl, affiliateId, description, isActive } = body;

    const db = getDb(env.DATABASE_URL);

    // Check if link exists
    const existing = await db
      .select()
      .from(referralLink)
      .where(eq(referralLink.id, linkId))
      .limit(1);

    if (!existing[0]) {
      return new Response(
        JSON.stringify({ error: 'Referral link not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (directAdUrl !== undefined) updateData.directAdUrl = directAdUrl;
    if (affiliateId !== undefined) updateData.affiliateId = affiliateId || null;
    if (description !== undefined) updateData.description = description;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    await db
      .update(referralLink)
      .set(updateData)
      .where(eq(referralLink.id, linkId));

    // Log admin action
    const adminUser = context.locals.user;
    if (adminUser) {
      await db.insert(adminActivityLog).values({
        id: crypto.randomUUID(),
        adminId: adminUser.id,
        action: 'update_referral_link',
        targetType: 'referral_link',
        targetId: linkId,
        details: updateData,
        ipAddress: context.request.headers.get('x-forwarded-for') || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin update referral link error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update referral link' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE - Delete referral link
export const DELETE: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const linkId = context.params.id;
    if (!linkId) {
      return new Response(
        JSON.stringify({ error: 'Link ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);

    // Check if link exists
    const existing = await db
      .select({ referralCode: referralLink.referralCode })
      .from(referralLink)
      .where(eq(referralLink.id, linkId))
      .limit(1);

    if (!existing[0]) {
      return new Response(
        JSON.stringify({ error: 'Referral link not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.delete(referralLink).where(eq(referralLink.id, linkId));

    // Log admin action
    const adminUser = context.locals.user;
    if (adminUser) {
      await db.insert(adminActivityLog).values({
        id: crypto.randomUUID(),
        adminId: adminUser.id,
        action: 'delete_referral_link',
        targetType: 'referral_link',
        targetId: linkId,
        details: { referralCode: existing[0].referralCode },
        ipAddress: context.request.headers.get('x-forwarded-for') || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin delete referral link error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete referral link' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
