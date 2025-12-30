import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user, subscription } from '@/db/schema';
import { affiliatePayout, affiliatePayoutSettings, referralLink } from '@/db/schema-admin';
import { eq, and, sql } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// Earning per active subscriber per month
const EARNING_PER_SUBSCRIBER = 0.5;

export const GET: APIRoute = async (context) => {
  const currentUser = context.locals.user;

  if (!currentUser || !context.locals.isAffiliate) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const env = getEnv();

  try {
    const db = getDb(env.DATABASE_URL);

    // Get affiliate's referral code
    const affiliate = await db
      .select({ referralCode: user.referralCode })
      .from(user)
      .where(eq(user.id, currentUser.id))
      .limit(1);

    if (!affiliate[0]?.referralCode) {
      return new Response(
        JSON.stringify({ error: 'No referral code assigned' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const referralCode = affiliate[0].referralCode;

    // Get all users referred by this affiliate
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

    // Get payout totals
    const payoutTotals = await db
      .select({
        status: affiliatePayout.status,
        total: sql<string>`COALESCE(SUM(${affiliatePayout.amount}), 0)`,
      })
      .from(affiliatePayout)
      .where(eq(affiliatePayout.affiliateId, currentUser.id))
      .groupBy(affiliatePayout.status);

    const totalPaidOut = parseFloat(
      payoutTotals.find((p) => p.status === 'completed')?.total || '0'
    );
    const totalPending = parseFloat(
      payoutTotals.find((p) => p.status === 'pending')?.total || '0'
    ) + parseFloat(
      payoutTotals.find((p) => p.status === 'processing')?.total || '0'
    );

    // Calculate total earned
    const totalEarned = activeSubscribers * EARNING_PER_SUBSCRIBER;
    const availableBalance = Math.max(0, totalEarned - totalPaidOut - totalPending);

    // Check if payout settings are configured
    const payoutSettings = await db
      .select()
      .from(affiliatePayoutSettings)
      .where(eq(affiliatePayoutSettings.userId, currentUser.id))
      .limit(1);

    const hasPayoutSettings = !!payoutSettings[0]?.paypalEmail || !!payoutSettings[0]?.bankAccountNumber;

    // Get referral link verification status
    const referralLinkData = await db
      .select({
        isVerified: referralLink.isVerified,
        isActive: referralLink.isActive,
        directAdUrl: referralLink.directAdUrl,
      })
      .from(referralLink)
      .where(eq(referralLink.referralCode, referralCode))
      .limit(1);

    const linkInfo = referralLinkData[0] || null;

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
        hasPayoutSettings,
        referrals: referralList,
        directLink: linkInfo ? {
          url: linkInfo.directAdUrl,
          isVerified: linkInfo.isVerified,
          isActive: linkInfo.isActive,
        } : null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Affiliate stats error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
