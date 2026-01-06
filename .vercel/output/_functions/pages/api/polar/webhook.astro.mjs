import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { u as updateSubscriptionStatus, a as upsertSubscription } from '../../../chunks/subscription_DYV9wkn-.mjs';
import { m as mapPolarStatus } from '../../../chunks/polar_Bmby_5Jl.mjs';
import { i as isValidProductId } from '../../../chunks/subscription-config_B0RIRObH.mjs';
import { g as getEnv } from '../../../chunks/env_BlcyOfWY.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  const env = getEnv();
  const webhookSecret = env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET is not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }
  const body = await context.request.text();
  let webhookPayload;
  try {
    webhookPayload = validateEvent(body, context.request.headers, webhookSecret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error("Webhook verification failed:", error.message);
      return new Response("Invalid webhook signature", { status: 403 });
    }
    throw error;
  }
  const eventType = webhookPayload.type;
  console.log(`Received Polar webhook: ${eventType}`);
  try {
    switch (eventType) {
      case "subscription.created":
      case "subscription.updated":
      case "subscription.active": {
        const subscription = webhookPayload.data;
        const userId = subscription.customer?.externalId;
        const productId = subscription.productId || subscription.product?.id;
        if (!userId) {
          console.error("No userId (externalId) in subscription webhook");
          return new Response("Missing userId", { status: 400 });
        }
        if (!productId) {
          console.error("No productId in subscription webhook");
          return new Response("Missing productId", { status: 400 });
        }
        if (!isValidProductId(productId)) {
          console.log(`Ignoring webhook for unknown product: ${productId}`);
          return new Response("OK", { status: 200 });
        }
        const status = mapPolarStatus(subscription.status);
        await upsertSubscription(env.DATABASE_URL, {
          userId,
          polarSubscriptionId: subscription.id,
          polarCustomerId: subscription.customerId || subscription.customer?.id,
          polarProductId: productId,
          status,
          currentPeriodStart: subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart) : void 0,
          currentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : void 0,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
        });
        console.log(
          `Subscription ${eventType} for user ${userId}: ${subscription.id} -> ${status}`
        );
        break;
      }
      case "subscription.canceled":
      case "subscription.revoked": {
        const subscription = webhookPayload.data;
        await updateSubscriptionStatus(
          env.DATABASE_URL,
          subscription.id,
          "cancelled",
          /* @__PURE__ */ new Date()
        );
        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }
      case "checkout.updated": {
        const checkout = webhookPayload.data;
        if (checkout.status !== "succeeded") {
          console.log(`Checkout not succeeded: ${checkout.status}`);
          return new Response("OK", { status: 200 });
        }
        console.log(`Checkout succeeded: ${checkout.id}`);
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
