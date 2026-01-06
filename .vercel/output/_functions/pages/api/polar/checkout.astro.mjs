import { c as createPolar } from '../../../chunks/polar_Bmby_5Jl.mjs';
import { S as SUBSCRIPTION_PLAN } from '../../../chunks/subscription-config_B0RIRObH.mjs';
import { h as hasActiveSubscription } from '../../../chunks/subscription_DYV9wkn-.mjs';
import { g as getEnv } from '../../../chunks/env_BlcyOfWY.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  const env = getEnv();
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const isSubscribed = await hasActiveSubscription(env.DATABASE_URL, user.id);
  if (isSubscribed) {
    return new Response(
      JSON.stringify({ error: "You already have an active subscription" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  try {
    const polar = createPolar(env.POLAR_ACCESS_TOKEN);
    const siteUrl = env.SITE_URL || "http://localhost:4321";
    const checkout = await polar.checkouts.create({
      products: [SUBSCRIPTION_PLAN.polarProductId],
      customerExternalId: user.id,
      customerEmail: user.email,
      successUrl: `${siteUrl}/subscription/success?checkout_id={CHECKOUT_ID}`,
      metadata: {
        type: "subscription",
        userId: user.id
      }
    });
    return new Response(
      JSON.stringify({
        checkoutUrl: checkout.url,
        checkoutId: checkout.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create checkout" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
