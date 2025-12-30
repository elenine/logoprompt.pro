import type { APIRoute } from 'astro';
import { createPolar } from '@/lib/polar';
import { SUBSCRIPTION_PLAN, isValidProductId } from '@/lib/subscription-config';
import { hasActiveSubscription } from '@/lib/subscription';
import { getEnv } from '@/lib/env';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const env = getEnv();
  const user = context.locals.user;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if user already has active subscription
  const isSubscribed = await hasActiveSubscription(env.DATABASE_URL, user.id);
  if (isSubscribed) {
    return new Response(
      JSON.stringify({ error: 'You already have an active subscription' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const polar = createPolar(env.POLAR_ACCESS_TOKEN);
    const siteUrl = env.SITE_URL || 'http://localhost:4321';

    const checkout = await polar.checkouts.create({
      products: [SUBSCRIPTION_PLAN.polarProductId],
      customerExternalId: user.id,
      customerEmail: user.email,
      successUrl: `${siteUrl}/subscription/success?checkout_id={CHECKOUT_ID}`,
      metadata: {
        type: 'subscription',
        userId: user.id,
      },
    });

    return new Response(
      JSON.stringify({
        checkoutUrl: checkout.url,
        checkoutId: checkout.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Checkout creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create checkout' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
