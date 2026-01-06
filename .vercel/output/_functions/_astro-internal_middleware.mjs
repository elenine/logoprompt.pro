import { d as defineMiddleware, s as sequence } from './chunks/index_CtcvICsL.mjs';
import { g as getAuthFromEnv } from './chunks/auth_B81ErrSU.mjs';
import { g as getUserSubscription } from './chunks/subscription_DYV9wkn-.mjs';
import { g as getEnv, a as getDb, u as user } from './chunks/env_BlcyOfWY.mjs';
import { eq } from 'drizzle-orm';
import './chunks/astro-designed-error-pages_DLMZlkTs.mjs';
import './chunks/astro/server_DgYwtGrl.mjs';

const protectedRoutes = ["/profile", "/subscription"];
const adminRoutes = ["/admin"];
const onRequest$1 = defineMiddleware(async (context, next) => {
  context.locals.session = null;
  context.locals.user = null;
  context.locals.subscription = null;
  context.locals.isSubscribed = false;
  context.locals.isAdmin = false;
  const env = getEnv();
  try {
    const auth = getAuthFromEnv(env);
    const session = await auth.api.getSession({
      headers: context.request.headers
    });
    context.locals.session = session;
    context.locals.user = session?.user ?? null;
    if (session?.user?.id) {
      const db = getDb(env.DATABASE_URL);
      try {
        const userDetails = await db.select({
          isAdmin: user.isAdmin
        }).from(user).where(eq(user.id, session.user.id)).limit(1);
        if (userDetails[0]) {
          context.locals.isAdmin = userDetails[0].isAdmin;
        }
        const sub = await getUserSubscription(env.DATABASE_URL, session.user.id);
        if (sub) {
          const isActive = sub.status === "active" && (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > /* @__PURE__ */ new Date());
          context.locals.subscription = {
            id: sub.id,
            status: sub.status,
            currentPeriodEnd: sub.currentPeriodEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false
          };
          context.locals.isSubscribed = isActive;
        }
      } catch (subError) {
        console.error("User/Subscription check error:", subError);
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    context.locals.session = null;
    context.locals.user = null;
  }
  const pathname = context.url.pathname;
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!context.locals.session) {
      return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
    if (!context.locals.isAdmin) {
      return context.redirect("/");
    }
  }
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !context.locals.session) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
