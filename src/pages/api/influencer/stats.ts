import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user, subscription, influencerPayout } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const prerender = false;

// Earning per active subscriber per month
const EARNING_PER_SUBSCRIBER = 0.5;

export const GET: APIRoute = async (context) => {
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

    // Get all users referred by this influencer
    const referredUsers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.referredBy, referralCode));

    // Get subscription status for each referred user
    const referredUserIds = referredUsers.map((u) => u.id);

    let subscriptions: Array<{
      userId: string;
      status: string;
      currentPeriodEnd: Date | null;
    }> = [];

    if (referredUserIds.length > 0) {
      subscriptions = await db
        .select({
          userId: subscription.userId,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
        })
        .from(subscription)
        .where(sql`${subscription.userId} IN ${referredUserIds}`);
    }

    // Create a map of userId to subscription
    const subscriptionMap = new Map(subscriptions.map((s) => [s.userId, s]));

    // Build referral list with subscription status
    const referralList = referredUsers.map((u) => {
      const sub = subscriptionMap.get(u.id);
      const isActive =
        sub?.status === 'active' &&
        (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        joinedAt: u.createdAt,
        isSubscribed: isActive,
        subscriptionStatus: sub?.status || 'none',
      };
    });

    // Count active subscribers
    const activeSubscribers = referralList.filter((r) => r.isSubscribed).length;

    // Get completed payouts
    const completedPayouts = await db
      .select({
        totalPaid: sql<string>`COALESCE(SUM(${influencerPayout.amount}), 0)`,
      })
      .from(influencerPayout)
      .where(
        and(
          eq(influencerPayout.influencerId, currentUser.id),
          eq(influencerPayout.status, 'completed')
        )
      );

    // Get pending payouts
    const pendingPayouts = await db
      .select({
        totalPending: sql<string>`COALESCE(SUM(${influencerPayout.amount}), 0)`,
      })
      .from(influencerPayout)
      .where(
        and(
          eq(influencerPayout.influencerId, currentUser.id),
          eq(influencerPayout.status, 'pending')
        )
      );

    const totalPaidOut = parseFloat(completedPayouts[0]?.totalPaid || '0');
    const totalPending = parseFloat(pendingPayouts[0]?.totalPending || '0');

    // Calculate total earned (active subscribers * rate)
    // This is a simplified calculation - in production you'd track monthly earnings
    const totalEarned = activeSubscribers * EARNING_PER_SUBSCRIBER;

    // Available balance = total earned - paid out - pending
    const availableBalance = Math.max(0, totalEarned - totalPaidOut - totalPending);

    return new Response(
      JSON.stringify({
        referralCode,
        totalReferrals: referredUsers.length,
        activeSubscribers,
        earningPerSubscriber: EARNING_PER_SUBSCRIBER,
        totalEarned,
        totalPaidOut,
        pendingPayout: totalPending,
        availableBalance,
        referrals: referralList,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Influencer stats error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
