import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
import { S as SUBSCRIPTION_PLAN } from '../chunks/subscription-config_B0RIRObH.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  const subscription = Astro2.locals.subscription;
  const isSubscribed = Astro2.locals.isSubscribed;
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pro Subscription - LogoPrompt.pro", "description": "Subscribe to Pro for an ad-free experience", "data-astro-cid-u7ybu2ip": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="subscription-page" data-astro-cid-u7ybu2ip> <div class="subscription-container" data-astro-cid-u7ybu2ip> ${error && renderTemplate`<div class="error-banner" data-astro-cid-u7ybu2ip> ${error === "no_subscription" && "No active subscription found."} ${error === "portal_failed" && "Failed to open subscription portal. Please try again."} </div>`} ${isSubscribed ? renderTemplate`<div class="subscription-card active" data-astro-cid-u7ybu2ip> <div class="status-badge" data-astro-cid-u7ybu2ip>Active</div> <h1 data-astro-cid-u7ybu2ip>You're a Pro Member!</h1> <p class="subtitle" data-astro-cid-u7ybu2ip>Thank you for supporting LogoPrompt.pro</p> <div class="subscription-details" data-astro-cid-u7ybu2ip> <div class="detail-row" data-astro-cid-u7ybu2ip> <span class="label" data-astro-cid-u7ybu2ip>Status</span> <span class="value status-active" data-astro-cid-u7ybu2ip>${subscription?.status}</span> </div> ${subscription?.currentPeriodEnd && renderTemplate`<div class="detail-row" data-astro-cid-u7ybu2ip> <span class="label" data-astro-cid-u7ybu2ip> ${subscription.cancelAtPeriodEnd ? "Expires on" : "Renews on"} </span> <span class="value" data-astro-cid-u7ybu2ip> ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </span> </div>`} ${subscription?.cancelAtPeriodEnd && renderTemplate`<div class="cancel-notice" data-astro-cid-u7ybu2ip>
Your subscription will not renew after the current period.
</div>`} </div> <div class="benefits" data-astro-cid-u7ybu2ip> <h3 data-astro-cid-u7ybu2ip>Your Benefits</h3> <ul data-astro-cid-u7ybu2ip> ${SUBSCRIPTION_PLAN.features.map((feature) => renderTemplate`<li data-astro-cid-u7ybu2ip> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u7ybu2ip> <polyline points="20 6 9 17 4 12" data-astro-cid-u7ybu2ip></polyline> </svg> ${feature} </li>`)} </ul> </div> <a href="/api/polar/portal" class="manage-btn" data-astro-cid-u7ybu2ip>
Manage Subscription
</a> </div>` : renderTemplate`<div class="subscription-card" data-astro-cid-u7ybu2ip> <div class="plan-badge" data-astro-cid-u7ybu2ip>Pro</div> <h1 data-astro-cid-u7ybu2ip>${SUBSCRIPTION_PLAN.name}</h1> <p class="subtitle" data-astro-cid-u7ybu2ip>${SUBSCRIPTION_PLAN.description}</p> <div class="price" data-astro-cid-u7ybu2ip> <span class="amount" data-astro-cid-u7ybu2ip>$${SUBSCRIPTION_PLAN.price.monthly}</span> <span class="period" data-astro-cid-u7ybu2ip>/month</span> </div> <div class="features" data-astro-cid-u7ybu2ip> <h3 data-astro-cid-u7ybu2ip>What you get</h3> <ul data-astro-cid-u7ybu2ip> ${SUBSCRIPTION_PLAN.features.map((feature) => renderTemplate`<li data-astro-cid-u7ybu2ip> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u7ybu2ip> <polyline points="20 6 9 17 4 12" data-astro-cid-u7ybu2ip></polyline> </svg> ${feature} </li>`)} </ul> </div> ${user ? renderTemplate`<button id="subscribe-btn" class="subscribe-btn" type="button" data-astro-cid-u7ybu2ip> <span class="btn-text" data-astro-cid-u7ybu2ip>Subscribe Now</span> <span class="btn-loading" style="display: none;" data-astro-cid-u7ybu2ip>Processing...</span> </button>` : renderTemplate`<a href="/login?redirect=/subscription" class="subscribe-btn" data-astro-cid-u7ybu2ip>
Sign in to Subscribe
</a>`} <div id="checkout-error" class="checkout-error" style="display: none;" data-astro-cid-u7ybu2ip></div> <p class="terms-notice" data-astro-cid-u7ybu2ip>
By subscribing, you agree to our
<a href="/terms" data-astro-cid-u7ybu2ip>Terms of Service</a>.
            Cancel anytime.
</p> </div>`} <a href="/" class="back-link" data-astro-cid-u7ybu2ip> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u7ybu2ip> <line x1="19" y1="12" x2="5" y2="12" data-astro-cid-u7ybu2ip></line> <polyline points="12 19 5 12 12 5" data-astro-cid-u7ybu2ip></polyline> </svg>
Back to Gallery
</a> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/subscription/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/subscription/index.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/subscription/index.astro";
const $$url = "/subscription";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
