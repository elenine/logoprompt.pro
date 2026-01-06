import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead, n as Fragment, h as addAttribute } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                          */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$ResetPassword = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ResetPassword;
  const token = Astro2.url.searchParams.get("token");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Reset Password - LogoPrompt.pro", "description": "Set a new password for your LogoPrompt.pro account", "data-astro-cid-oiuorpsm": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="auth-page" data-astro-cid-oiuorpsm> <div class="auth-container" data-astro-cid-oiuorpsm> <div class="auth-card" data-astro-cid-oiuorpsm> ${!token ? renderTemplate`<div class="error-state" data-astro-cid-oiuorpsm> <h1 data-astro-cid-oiuorpsm>Invalid Link</h1> <p data-astro-cid-oiuorpsm>This password reset link is invalid or has expired.</p> <a href="/forgot-password" class="submit-btn" data-astro-cid-oiuorpsm>Request New Link</a> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-oiuorpsm": true }, { "default": async ($$result3) => renderTemplate` <h1 data-astro-cid-oiuorpsm>Reset Password</h1> <p class="subtitle" data-astro-cid-oiuorpsm>Enter your new password</p> <form id="reset-form" class="auth-form" data-astro-cid-oiuorpsm> <input type="hidden" id="token"${addAttribute(token, "value")} data-astro-cid-oiuorpsm> <div class="form-group" data-astro-cid-oiuorpsm> <label for="password" data-astro-cid-oiuorpsm>New Password</label> <input type="password" id="password" name="password" required autocomplete="new-password" placeholder="Minimum 8 characters" minlength="8" data-astro-cid-oiuorpsm> </div> <div class="form-group" data-astro-cid-oiuorpsm> <label for="confirmPassword" data-astro-cid-oiuorpsm>Confirm Password</label> <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password" placeholder="Confirm your password" minlength="8" data-astro-cid-oiuorpsm> </div> <button type="submit" class="submit-btn" data-astro-cid-oiuorpsm> <span class="btn-text" data-astro-cid-oiuorpsm>Reset Password</span> <span class="btn-loading" style="display: none;" data-astro-cid-oiuorpsm>Resetting...</span> </button> <div id="form-error" class="form-error" style="display: none;" data-astro-cid-oiuorpsm></div> </form> ` })}`} </div> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/reset-password.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/reset-password.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/reset-password.astro";
const $$url = "/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResetPassword,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
