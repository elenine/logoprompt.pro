import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const session = Astro2.locals.session;
  if (session) {
    const redirect = Astro2.url.searchParams.get("redirect") || "/profile";
    return Astro2.redirect(redirect);
  }
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login - LogoPrompt.pro", "description": "Sign in to your LogoPrompt.pro account", "data-astro-cid-sgpqyurt": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="auth-page" data-astro-cid-sgpqyurt> <div class="auth-container" data-astro-cid-sgpqyurt> <div class="auth-card" data-astro-cid-sgpqyurt> <h1 data-astro-cid-sgpqyurt>Welcome Back</h1> <p class="subtitle" data-astro-cid-sgpqyurt>Sign in to access your profile</p> ${error && renderTemplate`<div class="error-message" data-astro-cid-sgpqyurt> ${error === "auth_failed" ? "Authentication failed. Please try again." : error} </div>`} <button id="google-signin" class="google-btn" type="button" data-astro-cid-sgpqyurt> <svg viewBox="0 0 24 24" width="20" height="20" data-astro-cid-sgpqyurt> <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" data-astro-cid-sgpqyurt></path> <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" data-astro-cid-sgpqyurt></path> <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" data-astro-cid-sgpqyurt></path> <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" data-astro-cid-sgpqyurt></path> </svg> <span data-astro-cid-sgpqyurt>Continue with Google</span> </button> <div class="divider" data-astro-cid-sgpqyurt> <span data-astro-cid-sgpqyurt>or</span> </div> <form id="login-form" class="auth-form" data-astro-cid-sgpqyurt> <div class="form-group" data-astro-cid-sgpqyurt> <label for="email" data-astro-cid-sgpqyurt>Email</label> <input type="email" id="email" name="email" required autocomplete="email" placeholder="you@example.com" data-astro-cid-sgpqyurt> </div> <div class="form-group" data-astro-cid-sgpqyurt> <label for="password" data-astro-cid-sgpqyurt>Password</label> <input type="password" id="password" name="password" required autocomplete="current-password" placeholder="Enter your password" data-astro-cid-sgpqyurt> </div> <button type="submit" class="submit-btn" data-astro-cid-sgpqyurt> <span class="btn-text" data-astro-cid-sgpqyurt>Sign In</span> <span class="btn-loading" style="display: none;" data-astro-cid-sgpqyurt>Signing in...</span> </button> <div id="form-error" class="form-error" style="display: none;" data-astro-cid-sgpqyurt></div> </form> <div class="auth-links" data-astro-cid-sgpqyurt> <a href="/forgot-password" data-astro-cid-sgpqyurt>Forgot password?</a> </div> <p class="auth-switch" data-astro-cid-sgpqyurt>
Don't have an account? <a href="/signup" data-astro-cid-sgpqyurt>Sign up</a> </p> <p class="terms-notice" data-astro-cid-sgpqyurt>
By signing in, you agree to our
<a href="/terms" data-astro-cid-sgpqyurt>Terms of Service</a> and
<a href="/privacy" data-astro-cid-sgpqyurt>Privacy Policy</a> </p> </div> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/login.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/login.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
