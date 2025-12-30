import { defineMiddleware } from 'astro:middleware';
import { getAuthFromEnv } from '@/lib/auth';

const protectedRoutes = ['/profile'];

export const onRequest = defineMiddleware(async (context, next) => {
  // Initialize auth state to null
  context.locals.session = null;
  context.locals.user = null;

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
