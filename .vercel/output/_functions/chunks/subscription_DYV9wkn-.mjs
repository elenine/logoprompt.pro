import { eq } from 'drizzle-orm';
import { a as getDb, s as subscription } from './env_BlcyOfWY.mjs';

async function getUserSubscription(databaseUrl, userId) {
  const db = getDb(databaseUrl);
  const result = await db.select().from(subscription).where(eq(subscription.userId, userId)).limit(1);
  return result[0] || null;
}
async function getSubscriptionByPolarId(databaseUrl, polarSubscriptionId) {
  const db = getDb(databaseUrl);
  const result = await db.select().from(subscription).where(eq(subscription.polarSubscriptionId, polarSubscriptionId)).limit(1);
  return result[0] || null;
}
async function hasActiveSubscription(databaseUrl, userId) {
  const sub = await getUserSubscription(databaseUrl, userId);
  if (!sub) return false;
  if (sub.status !== "active") return false;
  if (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < /* @__PURE__ */ new Date()) {
    return false;
  }
  return true;
}
async function upsertSubscription(databaseUrl, data) {
  const db = getDb(databaseUrl);
  const now = /* @__PURE__ */ new Date();
  const existingByPolarId = data.polarSubscriptionId ? await getSubscriptionByPolarId(databaseUrl, data.polarSubscriptionId) : null;
  if (existingByPolarId) {
    await db.update(subscription).set({
      status: data.status,
      polarCustomerId: data.polarCustomerId || existingByPolarId.polarCustomerId,
      polarProductId: data.polarProductId || existingByPolarId.polarProductId,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      checkoutId: data.checkoutId,
      metadata: data.metadata,
      updatedAt: now
    }).where(eq(subscription.id, existingByPolarId.id));
    return existingByPolarId.id;
  }
  const existingByUser = await getUserSubscription(databaseUrl, data.userId);
  if (existingByUser) {
    await db.update(subscription).set({
      polarSubscriptionId: data.polarSubscriptionId,
      polarCustomerId: data.polarCustomerId,
      polarProductId: data.polarProductId,
      status: data.status,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      checkoutId: data.checkoutId,
      metadata: data.metadata,
      updatedAt: now
    }).where(eq(subscription.id, existingByUser.id));
    return existingByUser.id;
  }
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
    updatedAt: now
  });
  return id;
}
async function updateSubscriptionStatus(databaseUrl, polarSubscriptionId, status, cancelledAt) {
  const db = getDb(databaseUrl);
  await db.update(subscription).set({
    status,
    cancelledAt,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(subscription.polarSubscriptionId, polarSubscriptionId));
}

export { upsertSubscription as a, getUserSubscription as g, hasActiveSubscription as h, updateSubscriptionStatus as u };
