import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user, subscription } from '@/db/schema';
import { desc, like, or, sql, eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  // Admin check is done by middleware, but double-check
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const filter = url.searchParams.get('filter') || 'all'; // all, admins, subscribed

    const offset = (page - 1) * limit;
    const db = getDb(env.DATABASE_URL);

    // Build where clause
    let whereClause = undefined;
    if (search) {
      whereClause = or(
        like(user.name, `%${search}%`),
        like(user.email, `%${search}%`)
      );
    }

    // Get users with subscription status
    const usersQuery = db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        subscriptionStatus: subscription.status,
      })
      .from(user)
      .leftJoin(subscription, sql`${user.id} = ${subscription.userId}`)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);

    // Apply filter
    let users;
    if (filter === 'admins') {
      users = await usersQuery.where(
        whereClause
          ? sql`${user.isAdmin} = true AND (${whereClause})`
          : sql`${user.isAdmin} = true`
      );
    } else if (filter === 'subscribed') {
      users = await usersQuery.where(
        whereClause
          ? sql`${subscription.status} = 'active' AND (${whereClause})`
          : sql`${subscription.status} = 'active'`
      );
    } else {
      users = whereClause
        ? await usersQuery.where(whereClause)
        : await usersQuery;
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user);
    const total = Number(countResult[0]?.count || 0);

    // Get active subscriptions count
    const activeSubsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscription)
      .where(eq(subscription.status, 'active'));
    const activeSubscriptions = Number(activeSubsResult[0]?.count || 0);

    return new Response(
      JSON.stringify({
        users,
        activeSubscriptions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin users error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
