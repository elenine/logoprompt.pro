import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { adminActivityLog } from '@/db/schema-admin';
import { eq } from 'drizzle-orm';

export const prerender = false;

// GET - Get single user details
export const GET: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = context.locals.runtime?.env;
  if (!env?.DATABASE_URL) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const userId = context.params.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);
    const userDetails = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userDetails[0]) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ user: userDetails[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin get user error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH - Update user (make affiliate, set referral code, make admin)
export const PATCH: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = context.locals.runtime?.env;
  if (!env?.DATABASE_URL) {
    return new Response(
      JSON.stringify({ error: 'Database not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const userId = context.params.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { isAffiliate, isAdmin, referralCode } = body;

    const db = getDb(env.DATABASE_URL);

    // Check if user exists
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existingUser[0]) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build update object
    const updateData: Partial<{
      isAffiliate: boolean;
      isAdmin: boolean;
      referralCode: string | null;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    if (typeof isAffiliate === 'boolean') {
      updateData.isAffiliate = isAffiliate;
    }

    if (typeof isAdmin === 'boolean') {
      updateData.isAdmin = isAdmin;
    }

    if (referralCode !== undefined) {
      // Check if referral code is already taken by another user
      if (referralCode) {
        const existingCode = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.referralCode, referralCode))
          .limit(1);

        if (existingCode[0] && existingCode[0].id !== userId) {
          return new Response(
            JSON.stringify({ error: 'Referral code already in use' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      updateData.referralCode = referralCode || null;
    }

    // Update user
    await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId));

    // Log admin action
    const adminUser = context.locals.user;
    if (adminUser) {
      await db.insert(adminActivityLog).values({
        id: crypto.randomUUID(),
        adminId: adminUser.id,
        action: 'update_user',
        targetType: 'user',
        targetId: userId,
        details: updateData,
        ipAddress: context.request.headers.get('x-forwarded-for') || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User updated' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin update user error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
