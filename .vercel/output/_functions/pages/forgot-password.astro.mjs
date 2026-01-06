import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                           */
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$ForgotPassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Forgot Password - LogoPrompt.pro", "description": "Reset your LogoPrompt.pro password", "data-astro-cid-sjxci7tl": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="auth-page" data-astro-cid-sjxci7tl> <div class="auth-container" data-astro-cid-sjxci7tl> <div class="auth-card" data-astro-cid-sjxci7tl> <h1 data-astro-cid-sjxci7tl>Forgot Password</h1> <p class="subtitle" data-astro-cid-sjxci7tl>Enter your email and we'll send you a reset link</p> <form id="forgot-form" class="auth-form" data-astro-cid-sjxci7tl> <div class="form-group" data-astro-cid-sjxci7tl> <label for="email" data-astro-cid-sjxci7tl>Email</label> <input type="email" id="email" name="email" required autocomplete="email" placeholder="you@example.com" data-astro-cid-sjxci7tl> </div> <button type="submit" class="submit-btn" data-astro-cid-sjxci7tl> <span class="btn-text" data-astro-cid-sjxci7tl>Send Reset Link</span> <span class="btn-loading" style="display: none;" data-astro-cid-sjxci7tl>Sending...</span> </button> <div id="form-error" class="form-error" style="display: none;" data-astro-cid-sjxci7tl></div> <div id="form-success" class="form-success" style="display: none;" data-astro-cid-sjxci7tl></div> </form> <p class="auth-switch" data-astro-cid-sjxci7tl>
Remember your password? <a href="/login" data-astro-cid-sjxci7tl>Sign in</a> </p> </div> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/forgot-password.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/forgot-password.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/forgot-password.astro";
const $$url = "/forgot-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ForgotPassword,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
