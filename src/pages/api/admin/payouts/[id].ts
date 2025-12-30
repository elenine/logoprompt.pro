import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { affiliatePayout, adminActivityLog } from '@/db/schema-admin';
import { eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// GET - Get single payout details
export const GET: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const payoutId = context.params.id;
    if (!payoutId) {
      return new Response(
        JSON.stringify({ error: 'Payout ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);
    const payout = await db
      .select()
      .from(affiliatePayout)
      .where(eq(affiliatePayout.id, payoutId))
      .limit(1);

    if (!payout[0]) {
      return new Response(
        JSON.stringify({ error: 'Payout not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ payout: payout[0] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin get payout error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch payout' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PATCH - Update payout status (process, complete, cancel)
export const PATCH: APIRoute = async (context) => {
  if (!context.locals.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const payoutId = context.params.id;
    if (!payoutId) {
      return new Response(
        JSON.stringify({ error: 'Payout ID required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const { status, transactionReference, adminNotes } = body;

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = getDb(env.DATABASE_URL);

    // Check if payout exists
    const existingPayout = await db
      .select()
      .from(affiliatePayout)
      .where(eq(affiliatePayout.id, payoutId))
      .limit(1);

    if (!existingPayout[0]) {
      return new Response(
        JSON.stringify({ error: 'Payout not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const adminUser = context.locals.user;

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      if (status === 'completed' || status === 'cancelled' || status === 'failed') {
        updateData.processedAt = new Date();
        updateData.processedBy = adminUser?.id || null;
      }
    }

    if (transactionReference !== undefined) {
      updateData.transactionReference = transactionReference;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    // Update payout
    await db
      .update(affiliatePayout)
      .set(updateData)
      .where(eq(affiliatePayout.id, payoutId));

    // Log admin action
    if (adminUser) {
      await db.insert(adminActivityLog).values({
        id: crypto.randomUUID(),
        adminId: adminUser.id,
        action: 'update_payout',
        targetType: 'payout',
        targetId: payoutId,
        details: { previousStatus: existingPayout[0].status, newStatus: status, ...updateData },
        ipAddress: context.request.headers.get('x-forwarded-for') || null,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payout updated' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin update payout error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update payout' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
