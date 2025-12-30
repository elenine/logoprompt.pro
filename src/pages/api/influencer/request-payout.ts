import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user, subscription, influencerPayout } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const prerender = false;

const EARNING_PER_SUBSCRIBER = 0.5;
const MINIMUM_PAYOUT = 5; // Minimum $5 to request payout

export const POST: APIRoute = async (context) => {
  const currentUser = context.locals.user;

  if (!currentUser) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
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
    const db = getDb(env.DATABASE_URL);

    // Check if user is an influencer
    const influencer = await db
      .select({
        isInfluencer: user.isInfluencer,
        referralCode: user.referralCode,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1);

    if (!influencer[0]?.isInfluencer || !influencer[0]?.referralCode) {
      return new Response(
        JSON.stringify({ error: 'Not an influencer' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const referralCode = influencer[0].referralCode;

    // Get referred users count
    const referredUsers = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.referredBy, referralCode));

    const referredUserIds = referredUsers.map((u) => u.id);

    // Get active subscribers count
    let activeSubscribers = 0;
    if (referredUserIds.length > 0) {
      const subscriptions = await db
        .select({
          userId: subscription.userId,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
        })
        .from(subscription)
        .where(sql`${subscription.userId} IN ${referredUserIds}`);

      activeSubscribers = subscriptions.filter(
        (s) =>
          s.status === 'active' &&
          (!s.currentPeriodEnd || new Date(s.currentPeriodEnd) > new Date())
      ).length;
    }

    // Get completed and pending payouts
    const payoutTotals = await db
      .select({
        status: influencerPayout.status,
        total: sql<string>`SUM(${influencerPayout.amount})`,
      })
      .from(influencerPayout)
      .where(eq(influencerPayout.influencerId, currentUser.id))
      .groupBy(influencerPayout.status);

    const totalPaidOut = parseFloat(
      payoutTotals.find((p) => p.status === 'completed')?.total || '0'
    );
    const totalPending = parseFloat(
      payoutTotals.find((p) => p.status === 'pending')?.total || '0'
    );

    // Calculate available balance
    const totalEarned = activeSubscribers * EARNING_PER_SUBSCRIBER;
    const availableBalance = Math.max(0, totalEarned - totalPaidOut - totalPending);

    if (availableBalance < MINIMUM_PAYOUT) {
      return new Response(
        JSON.stringify({
          error: `Minimum payout is $${MINIMUM_PAYOUT}. Current balance: $${availableBalance.toFixed(2)}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a pending payout record
    const payoutId = crypto.randomUUID();
    await db.insert(influencerPayout).values({
      id: payoutId,
      influencerId: currentUser.id,
      amount: availableBalance.toFixed(2),
      status: 'pending',
      requestedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        payoutId,
        amount: availableBalance,
        message: 'Payout request created',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Request payout error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to request payout' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
