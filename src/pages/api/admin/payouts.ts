import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { affiliatePayout, adminActivityLog } from '@/db/schema-admin';
import { desc, eq, sql } from 'drizzle-orm';

export const prerender = false;

// GET - List all payouts with filtering
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
    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status') || 'all';

    const offset = (page - 1) * limit;
    const db = getDb(env.DATABASE_URL);

    // Get payouts with affiliate details
    let payoutsQuery = db
      .select({
        id: affiliatePayout.id,
        amount: affiliatePayout.amount,
        currency: affiliatePayout.currency,
        status: affiliatePayout.status,
        payoutMethod: affiliatePayout.payoutMethod,
        payoutDetails: affiliatePayout.payoutDetails,
        transactionReference: affiliatePayout.transactionReference,
        affiliateNotes: affiliatePayout.affiliateNotes,
        adminNotes: affiliatePayout.adminNotes,
        requestedAt: affiliatePayout.requestedAt,
        processedAt: affiliatePayout.processedAt,
        affiliateId: affiliatePayout.affiliateId,
        affiliateName: user.name,
        affiliateEmail: user.email,
      })
      .from(affiliatePayout)
      .leftJoin(user, eq(affiliatePayout.affiliateId, user.id))
      .orderBy(desc(affiliatePayout.requestedAt))
      .limit(limit)
      .offset(offset);

    let payouts;
    if (status !== 'all') {
      payouts = await payoutsQuery.where(eq(affiliatePayout.status, status as any));
    } else {
      payouts = await payoutsQuery;
    }

    // Get counts by status
    const statusCounts = await db
      .select({
        status: affiliatePayout.status,
        count: sql<number>`count(*)`,
      })
      .from(affiliatePayout)
      .groupBy(affiliatePayout.status);

    const counts = {
      all: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      failed: 0,
    };

    statusCounts.forEach((s) => {
      counts[s.status as keyof typeof counts] = Number(s.count);
      counts.all += Number(s.count);
    });

    return new Response(
      JSON.stringify({
        payouts,
        counts,
        pagination: {
          page,
          limit,
          total: counts.all,
          totalPages: Math.ceil(counts.all / limit),
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin payouts error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch payouts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
