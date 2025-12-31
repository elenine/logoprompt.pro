import { defineMiddleware } from 'astro:middleware';
import { getAuthFromEnv } from '@/lib/auth';
import { getUserSubscription } from '@/lib/subscription';
import { getDb } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getEnv } from '@/lib/env';

// Routes that require authentication
const protectedRoutes = ['/profile', '/subscription'];
// Routes that require admin access
const adminRoutes = ['/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize auth and subscription state to null
  context.locals.session = null;
  context.locals.user = null;
  context.locals.subscription = null;
  context.locals.isSubscribed = false;
  context.locals.isAdmin = false;

  const env = getEnv();

  try {
    const auth = getAuthFromEnv(env);
    const session = await auth.api.getSession({
      headers: context.request.headers,
    });

    // Store session in locals for access in pages
    context.locals.session = session;
    context.locals.user = session?.user ?? null;

    // Get user details and subscription status if user is authenticated
    if (session?.user?.id) {
      const db = getDb(env.DATABASE_URL);

      try {
        // Get user admin status
        const userDetails = await db
          .select({
            isAdmin: user.isAdmin,
          })
          .from(user)
          .where(eq(user.id, session.user.id))
          .limit(1);

        if (userDetails[0]) {
          context.locals.isAdmin = userDetails[0].isAdmin;
        }

        // Get subscription status
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
        console.error('User/Subscription check error:', subError);
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    context.locals.session = null;
    context.locals.user = null;
  }

  const pathname = context.url.pathname;

  // Check admin routes - require both auth and admin status
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!context.locals.session) {
      return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    if (!context.locals.isAdmin) {
      return context.redirect('/');
    }
  }

  // Check protected routes - require auth only
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !context.locals.session) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  return next();
});
