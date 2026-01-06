import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../../chunks/Layout_D32kDI1K.mjs';
/* empty css                                      */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$Success = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Success;
  const user = Astro2.locals.user;
  const checkoutId = Astro2.url.searchParams.get("checkout_id");
  if (!user) {
    return Astro2.redirect("/login");
  }
  if (!checkoutId) {
    return Astro2.redirect("/subscription");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Subscription Activated - LogoPrompt.pro", "description": "Your Pro subscription is now active", "data-astro-cid-2whzkge2": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="success-page" data-astro-cid-2whzkge2> <div class="success-container" data-astro-cid-2whzkge2> <div class="success-card" data-astro-cid-2whzkge2> <div class="success-icon" data-astro-cid-2whzkge2> <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-2whzkge2> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-astro-cid-2whzkge2></path> <polyline points="22 4 12 14.01 9 11.01" data-astro-cid-2whzkge2></polyline> </svg> </div> <h1 data-astro-cid-2whzkge2>Welcome to Pro!</h1> <p class="subtitle" data-astro-cid-2whzkge2>Your subscription has been activated successfully.</p> <div class="benefits" data-astro-cid-2whzkge2> <p data-astro-cid-2whzkge2>You now have access to:</p> <ul data-astro-cid-2whzkge2> <li data-astro-cid-2whzkge2> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-2whzkge2> <polyline points="20 6 9 17 4 12" data-astro-cid-2whzkge2></polyline> </svg>
Ad-free browsing experience
</li> <li data-astro-cid-2whzkge2> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-2whzkge2> <polyline points="20 6 9 17 4 12" data-astro-cid-2whzkge2></polyline> </svg>
Priority access to new features
</li> </ul> </div> <div class="actions" data-astro-cid-2whzkge2> <a href="/" class="primary-btn" data-astro-cid-2whzkge2>Browse Gallery</a> <a href="/subscription" class="secondary-btn" data-astro-cid-2whzkge2>Manage Subscription</a> </div> </div> </div> </main> ` })} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/subscription/success.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/subscription/success.astro";
const $$url = "/subscription/success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Success,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
