import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                        */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$VerifyEmail = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$VerifyEmail;
  const token = Astro2.url.searchParams.get("token");
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Verify Email - LogoPrompt.pro", "description": "Verify your email address", "data-astro-cid-lxcpjv43": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="auth-page" data-astro-cid-lxcpjv43> <div class="auth-container" data-astro-cid-lxcpjv43> <div class="auth-card" data-astro-cid-lxcpjv43> ${error ? renderTemplate`<div class="result-state error" data-astro-cid-lxcpjv43> <div class="icon" data-astro-cid-lxcpjv43> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-lxcpjv43> <circle cx="12" cy="12" r="10" data-astro-cid-lxcpjv43></circle> <line x1="15" y1="9" x2="9" y2="15" data-astro-cid-lxcpjv43></line> <line x1="9" y1="9" x2="15" y2="15" data-astro-cid-lxcpjv43></line> </svg> </div> <h1 data-astro-cid-lxcpjv43>Verification Failed</h1> <p data-astro-cid-lxcpjv43>The verification link is invalid or has expired.</p> <a href="/login" class="submit-btn" data-astro-cid-lxcpjv43>Go to Login</a> </div>` : !token ? renderTemplate`<div class="result-state" data-astro-cid-lxcpjv43> <div class="icon checking" data-astro-cid-lxcpjv43> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-lxcpjv43> <path d="M12 2a10 10 0 1 0 10 10H12V2z" data-astro-cid-lxcpjv43></path> </svg> </div> <h1 data-astro-cid-lxcpjv43>Invalid Link</h1> <p data-astro-cid-lxcpjv43>This verification link is invalid.</p> <a href="/login" class="submit-btn" data-astro-cid-lxcpjv43>Go to Login</a> </div>` : renderTemplate`<div id="verifying" class="result-state" data-astro-cid-lxcpjv43> <div class="icon checking" data-astro-cid-lxcpjv43> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-lxcpjv43> <circle cx="12" cy="12" r="10" data-astro-cid-lxcpjv43></circle> <polyline points="12 6 12 12 16 14" data-astro-cid-lxcpjv43></polyline> </svg> </div> <h1 data-astro-cid-lxcpjv43>Verifying Email...</h1> <p data-astro-cid-lxcpjv43>Please wait while we verify your email address.</p> </div>`} <div id="success" class="result-state success" style="display: none;" data-astro-cid-lxcpjv43> <div class="icon" data-astro-cid-lxcpjv43> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-lxcpjv43> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" data-astro-cid-lxcpjv43></path> <polyline points="22 4 12 14.01 9 11.01" data-astro-cid-lxcpjv43></polyline> </svg> </div> <h1 data-astro-cid-lxcpjv43>Email Verified!</h1> <p data-astro-cid-lxcpjv43>Your email has been verified successfully.</p> <a href="/login" class="submit-btn" data-astro-cid-lxcpjv43>Sign In</a> </div> <div id="error" class="result-state error" style="display: none;" data-astro-cid-lxcpjv43> <div class="icon" data-astro-cid-lxcpjv43> <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-lxcpjv43> <circle cx="12" cy="12" r="10" data-astro-cid-lxcpjv43></circle> <line x1="15" y1="9" x2="9" y2="15" data-astro-cid-lxcpjv43></line> <line x1="9" y1="9" x2="15" y2="15" data-astro-cid-lxcpjv43></line> </svg> </div> <h1 data-astro-cid-lxcpjv43>Verification Failed</h1> <p id="error-message" data-astro-cid-lxcpjv43>The verification link is invalid or has expired.</p> <a href="/login" class="submit-btn" data-astro-cid-lxcpjv43>Go to Login</a> </div> </div> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/verify-email.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/verify-email.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/verify-email.astro";
const $$url = "/verify-email";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VerifyEmail,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
