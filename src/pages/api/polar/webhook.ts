import type { APIRoute } from 'astro';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { upsertSubscription, updateSubscriptionStatus } from '@/lib/subscription';
import { mapPolarStatus } from '@/lib/polar';
import { isValidProductId } from '@/lib/subscription-config';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;

  if (!env) {
    return new Response('Server configuration error', { status: 500 });
  }

  const webhookSecret = env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('POLAR_WEBHOOK_SECRET is not configured');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get raw body for signature verification
  const body = await context.request.text();

  // Verify webhook signature
  let webhookPayload: any;
  try {
    webhookPayload = validateEvent(body, context.request.headers, webhookSecret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error('Webhook verification failed:', error.message);
      return new Response('Invalid webhook signature', { status: 403 });
    }
    throw error;
  }

  const eventType = webhookPayload.type;
  console.log(`Received Polar webhook: ${eventType}`);

  try {
    switch (eventType) {
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.active': {
        const subscription = webhookPayload.data;
        const userId = subscription.customer?.externalId;
        const productId = subscription.productId || subscription.product?.id;

        if (!userId) {
          console.error('No userId (externalId) in subscription webhook');
          return new Response('Missing userId', { status: 400 });
        }

        if (!productId) {
          console.error('No productId in subscription webhook');
          return new Response('Missing productId', { status: 400 });
        }

        // Validate this is our subscription product
        if (!isValidProductId(productId)) {
          console.log(`Ignoring webhook for unknown product: ${productId}`);
          return new Response('OK', { status: 200 });
        }

        const status = mapPolarStatus(subscription.status);

        await upsertSubscription(env.DATABASE_URL, {
          userId,
          polarSubscriptionId: subscription.id,
          polarCustomerId: subscription.customerId || subscription.customer?.id,
          polarProductId: productId,
          status,
          currentPeriodStart: subscription.currentPeriodStart
            ? new Date(subscription.currentPeriodStart)
            : undefined,
          currentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : undefined,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        });

        console.log(
          `Subscription ${eventType} for user ${userId}: ${subscription.id} -> ${status}`
        );
        break;
      }

      case 'subscription.canceled':
      case 'subscription.revoked': {
        const subscription = webhookPayload.data;

        await updateSubscriptionStatus(
          env.DATABASE_URL,
          subscription.id,
          'cancelled',
          new Date()
        );

        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      case 'checkout.updated': {
        const checkout = webhookPayload.data;

        // Only process successful checkouts
        if (checkout.status !== 'succeeded') {
          console.log(`Checkout not succeeded: ${checkout.status}`);
          return new Response('OK', { status: 200 });
        }

        // Subscription checkouts are handled by subscription webhooks
        console.log(`Checkout succeeded: ${checkout.id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
