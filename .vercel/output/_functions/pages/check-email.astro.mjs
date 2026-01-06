import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$CheckEmail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CheckEmail;
  const email = Astro2.url.searchParams.get("email");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Check Your Email - LogoPrompt.pro", "description": "Verify your email to complete registration", "data-astro-cid-zwwvwkzp": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="auth-page" data-astro-cid-zwwvwkzp> <div class="auth-container" data-astro-cid-zwwvwkzp> <div class="auth-card" data-astro-cid-zwwvwkzp> <div class="icon" data-astro-cid-zwwvwkzp> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-zwwvwkzp> <rect width="20" height="16" x="2" y="4" rx="2" data-astro-cid-zwwvwkzp></rect> <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" data-astro-cid-zwwvwkzp></path> </svg> </div> <h1 data-astro-cid-zwwvwkzp>Check Your Email</h1> <p class="message" data-astro-cid-zwwvwkzp>
We've sent a verification email to
${email ? renderTemplate`<strong data-astro-cid-zwwvwkzp>${email}</strong>` : "your email address"}.
</p> <p class="instructions" data-astro-cid-zwwvwkzp>
Click the link in the email to verify your account and complete registration.
</p> <div class="tips" data-astro-cid-zwwvwkzp> <p class="tip-title" data-astro-cid-zwwvwkzp>Didn't receive the email?</p> <ul data-astro-cid-zwwvwkzp> <li data-astro-cid-zwwvwkzp>Check your spam or junk folder</li> <li data-astro-cid-zwwvwkzp>Make sure you entered the correct email</li> <li data-astro-cid-zwwvwkzp>Wait a few minutes and try again</li> </ul> </div> <div class="actions" data-astro-cid-zwwvwkzp> <a href="/login" class="secondary-btn" data-astro-cid-zwwvwkzp>Back to Login</a> </div> </div> </div> </main> ` })} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/check-email.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/check-email.astro";
const $$url = "/check-email";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CheckEmail,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
