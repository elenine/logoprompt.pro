import { defineMiddleware } from 'astro:middleware';
import { getAuthFromEnv } from '@/lib/auth';
import { getUserSubscription } from '@/lib/subscription';

const protectedRoutes = ['/profile', '/subscription'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize auth and subscription state to null
  context.locals.session = null;
  context.locals.user = null;
  context.locals.subscription = null;
  context.locals.isSubscribed = false;

  const env = context.locals.runtime?.env;

  // Skip auth for static assets and non-protected routes in prerender
  if (!env) {
    return next();
  }

  try {
    const auth = getAuthFromEnv(env);
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    // Store session in locals for access in pages
    context.locals.session = session;
    context.locals.user = session?.user ?? null;

    // Get subscription status if user is authenticated
    if (session?.user?.id) {
      try {
        const sub = await getUserSubscription(env.DATABASE_URL, session.user.id);
        if (sub) {
          const isActive =
            sub.status === 'active' &&
            (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());

          context.locals.subscription = {
            id: sub.id,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
          };
          context.locals.isSubscribed = isActive;
        }
      } catch (subError) {
        console.error('Subscription check error:', subError);
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    context.locals.session = null;
    context.locals.user = null;
  }

  // Protect routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    context.url.pathname.startsWith(route)
  );

  if (isProtectedRoute && !context.locals.session) {
    const redirectUrl = `/login?redirect=${encodeURIComponent(context.url.pathname)}`;
    return context.redirect(redirectUrl);
  }

  return next();
});
