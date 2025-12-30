import type { APIRoute } from 'astro';
import { createPolar } from '@/lib/polar';
import { getUserSubscription } from '@/lib/subscription';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;
  const user = context.locals.user;

  if (!env) {
    return new Response('Server configuration error', { status: 500 });
  }

  if (!user) {
    return context.redirect('/login?redirect=/subscription');
  }

  // Get user subscription to find polar customer ID
  const subscription = await getUserSubscription(env.DATABASE_URL, user.id);

  if (!subscription?.polarCustomerId) {
    return context.redirect('/subscription?error=no_subscription');
  }

  try {
    const polar = createPolar(env.POLAR_ACCESS_TOKEN);

    const customerSession = await polar.customerSessions.create({
      customerId: subscription.polarCustomerId,
    });

    return context.redirect(customerSession.customerPortalUrl);
  } catch (error: any) {
    console.error('Portal redirect error:', error);
    return context.redirect('/subscription?error=portal_failed');
  }
};
