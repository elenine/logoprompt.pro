import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// GET - Get single user details
export const GET: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

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

// PATCH - Update user (make admin)
export const PATCH: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const userId = context.params.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { isAdmin } = body;

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
      isAdmin: boolean;
      updatedAt: Date;
    }> = {
      updatedAt: new Date(),
    };

    if (typeof isAdmin === 'boolean') {
      updateData.isAdmin = isAdmin;
    }

    // Update user
    await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId));

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
