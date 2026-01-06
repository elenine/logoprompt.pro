import { c as createPolar } from '../../../chunks/polar_Bmby_5Jl.mjs';
import { g as getUserSubscription } from '../../../chunks/subscription_DYV9wkn-.mjs';
import { g as getEnv } from '../../../chunks/env_BlcyOfWY.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const env = getEnv();
  const user = context.locals.user;
  if (!user) {
    return context.redirect("/login?redirect=/subscription");
  }
  const subscription = await getUserSubscription(env.DATABASE_URL, user.id);
  if (!subscription?.polarCustomerId) {
    return context.redirect("/subscription?error=no_subscription");
  }
  try {
    const polar = createPolar(env.POLAR_ACCESS_TOKEN);
    const customerSession = await polar.customerSessions.create({
      customerId: subscription.polarCustomerId
    });
    return context.redirect(customerSession.customerPortalUrl);
  } catch (error) {
    console.error("Portal redirect error:", error);
    return context.redirect("/subscription?error=portal_failed");
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
