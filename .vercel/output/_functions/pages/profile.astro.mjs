import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Profile;
  const user = Astro2.locals.user;
  Astro2.locals.session;
  const subscription = Astro2.locals.subscription;
  const isSubscribed = Astro2.locals.isSubscribed;
  if (!user) {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Profile - LogoPrompt.pro", "description": "Your LogoPrompt.pro profile", "data-astro-cid-wwes6yjo": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="profile-page" data-astro-cid-wwes6yjo> <div class="profile-container" data-astro-cid-wwes6yjo> <div class="profile-card" data-astro-cid-wwes6yjo> <div class="profile-header" data-astro-cid-wwes6yjo> ${user.image ? renderTemplate`<img${addAttribute(user.image, "src")}${addAttribute(user.name, "alt")} class="avatar" data-astro-cid-wwes6yjo>` : renderTemplate`<div class="avatar-placeholder" data-astro-cid-wwes6yjo> ${user.name?.charAt(0).toUpperCase() || "U"} </div>`} <div class="profile-info" data-astro-cid-wwes6yjo> <h1 data-astro-cid-wwes6yjo>${user.name}</h1> <p class="email" data-astro-cid-wwes6yjo>${user.email}</p> ${!user.emailVerified && renderTemplate`<span class="unverified-badge" data-astro-cid-wwes6yjo>Email not verified</span>`} </div> </div> <div class="profile-section" data-astro-cid-wwes6yjo> <h2 data-astro-cid-wwes6yjo>Account Details</h2> <div class="detail-row" data-astro-cid-wwes6yjo> <span class="label" data-astro-cid-wwes6yjo>Email</span> <span class="value" data-astro-cid-wwes6yjo>${user.email}</span> </div> <div class="detail-row" data-astro-cid-wwes6yjo> <span class="label" data-astro-cid-wwes6yjo>Email Verified</span> <span class="value" data-astro-cid-wwes6yjo>${user.emailVerified ? "Yes" : "No"}</span> </div> <div class="detail-row" data-astro-cid-wwes6yjo> <span class="label" data-astro-cid-wwes6yjo>Member Since</span> <span class="value" data-astro-cid-wwes6yjo>${new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span> </div> </div> <div class="profile-section subscription-section" data-astro-cid-wwes6yjo> <h2 data-astro-cid-wwes6yjo>Subscription</h2> ${isSubscribed ? renderTemplate`<div class="subscription-active" data-astro-cid-wwes6yjo> <div class="subscription-badge" data-astro-cid-wwes6yjo>Pro</div> <div class="subscription-info" data-astro-cid-wwes6yjo> <p class="subscription-status" data-astro-cid-wwes6yjo>Active subscription</p> ${subscription?.currentPeriodEnd && renderTemplate`<p class="subscription-renew" data-astro-cid-wwes6yjo> ${subscription.cancelAtPeriodEnd ? "Expires" : "Renews"} on ${new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} </p>`} </div> <a href="/subscription" class="manage-link" data-astro-cid-wwes6yjo>Manage</a> </div>` : renderTemplate`<div class="subscription-inactive" data-astro-cid-wwes6yjo> <p data-astro-cid-wwes6yjo>You're on the free plan with ads.</p> <a href="/subscription" class="upgrade-btn" data-astro-cid-wwes6yjo>Upgrade to Pro</a> </div>`} </div> <div class="profile-actions" data-astro-cid-wwes6yjo> <a href="/" class="secondary-btn" data-astro-cid-wwes6yjo>Browse Gallery</a> <button id="signout-btn" class="signout-btn" type="button" data-astro-cid-wwes6yjo>
Sign Out
</button> </div> </div> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/profile.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/profile.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
