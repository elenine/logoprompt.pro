import type { APIRoute } from 'astro';
import { getDb } from '@/db';
import { user, subscription } from '@/db/schema';
import { affiliatePayout, affiliatePayoutSettings } from '@/db/schema-admin';
import { eq, and, sql } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

export const prerender = false;

// Earning per active subscriber per month
const EARNING_PER_SUBSCRIBER = 0.5;
const MINIMUM_PAYOUT = 5.0;

export const POST: APIRoute = async (context) => {
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

    // Check if payout settings are configured
    const settings = await db
      .select()
      .from(affiliatePayoutSettings)
      .where(eq(affiliatePayoutSettings.userId, currentUser.id))
      .limit(1);

    if (!settings[0]) {
      return new Response(
        JSON.stringify({ error: 'Please configure your payout settings first' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payoutSettings = settings[0];

    // Validate payout method has required details
    if (payoutSettings.payoutMethod === 'paypal' && !payoutSettings.paypalEmail) {
      return new Response(
        JSON.stringify({ error: 'PayPal email is not configured' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (payoutSettings.payoutMethod === 'bank_transfer') {
      if (!payoutSettings.bankAccountNumber || !payoutSettings.bankName || !payoutSettings.bankAccountName) {
        return new Response(
          JSON.stringify({ error: 'Bank details are not fully configured' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

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
      .select({ id: user.id })
      .from(user)
      .where(eq(user.referredBy, referralCode));

    const referredUserIds = referredUsers.map((u) => u.id);

    // Count active subscribers
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

      activeSubscribers = subscriptions.filter((s) => {
        return s.status === 'active' &&
          (!s.currentPeriodEnd || new Date(s.currentPeriodEnd) > new Date());
      }).length;
    }

    // Calculate total earnings
    const totalEarned = activeSubscribers * EARNING_PER_SUBSCRIBER;

    // Get existing payouts
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

    // Calculate available balance
    const availableBalance = Math.max(0, totalEarned - totalPaidOut - totalPending);

    if (availableBalance < MINIMUM_PAYOUT) {
      return new Response(
        JSON.stringify({
          error: `Minimum payout amount is $${MINIMUM_PAYOUT.toFixed(2)}. Your available balance is $${availableBalance.toFixed(2)}.`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build payout details based on method
    let payoutDetails: Record<string, string> = {};
    if (payoutSettings.payoutMethod === 'paypal') {
      payoutDetails = {
        method: 'paypal',
        email: payoutSettings.paypalEmail!,
      };
    } else {
      payoutDetails = {
        method: 'bank_transfer',
        country: payoutSettings.country || 'other',
        bankName: payoutSettings.bankName!,
        bankBranch: payoutSettings.bankBranch || '',
        accountNumber: payoutSettings.bankAccountNumber!,
        accountName: payoutSettings.bankAccountName!,
      };
    }

    // Create payout request
    const payoutId = crypto.randomUUID();
    await db.insert(affiliatePayout).values({
      id: payoutId,
      affiliateId: currentUser.id,
      amount: availableBalance.toFixed(2),
      payoutMethod: payoutSettings.payoutMethod,
      status: 'pending',
      payoutDetails: JSON.stringify(payoutDetails),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        payoutId,
        amount: availableBalance,
        method: payoutSettings.payoutMethod,
        message: `Payout request for $${availableBalance.toFixed(2)} has been submitted successfully.`,
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
