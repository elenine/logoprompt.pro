import { eq, and } from 'drizzle-orm';
import { getDb } from '@/db';
import { subscription, user } from '@/db/schema';

type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';

interface UpsertSubscriptionData {
  userId: string;
  polarSubscriptionId: string;
  polarCustomerId?: string;
  polarProductId?: string;
  status: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  checkoutId?: string;
  metadata?: Record<string, unknown>;
}

export async function getUserSubscription(databaseUrl: string, userId: string) {
  const db = getDb(databaseUrl);
  const result = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function getSubscriptionByPolarId(
  databaseUrl: string,
  polarSubscriptionId: string
) {
  const db = getDb(databaseUrl);
  const result = await db
    .select()
    .from(subscription)
    .where(eq(subscription.polarSubscriptionId, polarSubscriptionId))
    .limit(1);
  return result[0] || null;
}

export async function hasActiveSubscription(
  databaseUrl: string,
  userId: string
): Promise<boolean> {
  const sub = await getUserSubscription(databaseUrl, userId);
  if (!sub) return false;
  if (sub.status !== 'active') return false;
  if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < new Date()) {
    return false;
  }
  return true;
}

export async function upsertSubscription(
  databaseUrl: string,
  data: UpsertSubscriptionData
) {
  const db = getDb(databaseUrl);
  const now = new Date();

  // Check if subscription exists by polarSubscriptionId
  const existingByPolarId = data.polarSubscriptionId
    ? await getSubscriptionByPolarId(databaseUrl, data.polarSubscriptionId)
    : null;

  if (existingByPolarId) {
    // Update existing subscription
    await db
      .update(subscription)
      .set({
        status: data.status,
        polarCustomerId: data.polarCustomerId || existingByPolarId.polarCustomerId,
        polarProductId: data.polarProductId || existingByPolarId.polarProductId,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        checkoutId: data.checkoutId,
        metadata: data.metadata,
        updatedAt: now,
      })
      .where(eq(subscription.id, existingByPolarId.id));
    return existingByPolarId.id;
  }

  // Check if user has any existing subscription
  const existingByUser = await getUserSubscription(databaseUrl, data.userId);

  if (existingByUser) {
    // Update existing user subscription
    await db
      .update(subscription)
      .set({
        polarSubscriptionId: data.polarSubscriptionId,
        polarCustomerId: data.polarCustomerId,
        polarProductId: data.polarProductId,
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd,
        checkoutId: data.checkoutId,
        metadata: data.metadata,
        updatedAt: now,
      })
      .where(eq(subscription.id, existingByUser.id));
    return existingByUser.id;
  }

  // Create new subscription
  const id = crypto.randomUUID();
  await db.insert(subscription).values({
    id,
    userId: data.userId,
    polarSubscriptionId: data.polarSubscriptionId,
    polarCustomerId: data.polarCustomerId,
    polarProductId: data.polarProductId,
    status: data.status,
    currentPeriodStart: data.currentPeriodStart,
    currentPeriodEnd: data.currentPeriodEnd,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    checkoutId: data.checkoutId,
    metadata: data.metadata,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateSubscriptionStatus(
  databaseUrl: string,
  polarSubscriptionId: string,
  status: SubscriptionStatus,
  cancelledAt?: Date
) {
  const db = getDb(databaseUrl);
  await db
    .update(subscription)
    .set({
      status,
      cancelledAt,
      updatedAt: new Date(),
    })
    .where(eq(subscription.polarSubscriptionId, polarSubscriptionId));
}

export async function getUserWithSubscription(databaseUrl: string, userId: string) {
  const db = getDb(databaseUrl);
  const result = await db
    .select({
      user: user,
      subscription: subscription,
    })
    .from(user)
    .leftJoin(subscription, eq(user.id, subscription.userId))
    .where(eq(user.id, userId))
    .limit(1);
  return result[0] || null;
}
