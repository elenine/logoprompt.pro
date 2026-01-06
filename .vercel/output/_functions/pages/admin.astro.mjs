import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../chunks/Layout_D32kDI1K.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (!user || !Astro2.locals.isAdmin) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Dashboard - LogoPrompt.pro", "description": "Admin dashboard", "data-astro-cid-u2h3djql": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="admin-page" data-astro-cid-u2h3djql> <div class="admin-container" data-astro-cid-u2h3djql> <header class="admin-header" data-astro-cid-u2h3djql> <h1 data-astro-cid-u2h3djql>Admin Dashboard</h1> <p class="welcome" data-astro-cid-u2h3djql>Welcome, ${user.name}</p> </header> <div class="stats-grid" id="stats-grid" data-astro-cid-u2h3djql> <div class="stat-card loading" data-astro-cid-u2h3djql> <div class="stat-icon users" data-astro-cid-u2h3djql> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u2h3djql> <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" data-astro-cid-u2h3djql></path> <circle cx="9" cy="7" r="4" data-astro-cid-u2h3djql></circle> <path d="M23 21v-2a4 4 0 0 0-3-3.87" data-astro-cid-u2h3djql></path> <path d="M16 3.13a4 4 0 0 1 0 7.75" data-astro-cid-u2h3djql></path> </svg> </div> <div class="stat-content" data-astro-cid-u2h3djql> <span class="stat-value" id="total-users" data-astro-cid-u2h3djql>-</span> <span class="stat-label" data-astro-cid-u2h3djql>Total Users</span> </div> </div> <div class="stat-card loading" data-astro-cid-u2h3djql> <div class="stat-icon subscriptions" data-astro-cid-u2h3djql> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u2h3djql> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" data-astro-cid-u2h3djql></rect> <line x1="16" y1="2" x2="16" y2="6" data-astro-cid-u2h3djql></line> <line x1="8" y1="2" x2="8" y2="6" data-astro-cid-u2h3djql></line> <line x1="3" y1="10" x2="21" y2="10" data-astro-cid-u2h3djql></line> </svg> </div> <div class="stat-content" data-astro-cid-u2h3djql> <span class="stat-value" id="active-subscriptions" data-astro-cid-u2h3djql>-</span> <span class="stat-label" data-astro-cid-u2h3djql>Active Subscriptions</span> </div> </div> </div> <nav class="admin-nav" data-astro-cid-u2h3djql> <a href="/admin/users" class="nav-card" data-astro-cid-u2h3djql> <div class="nav-icon" data-astro-cid-u2h3djql> <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u2h3djql> <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" data-astro-cid-u2h3djql></path> <circle cx="9" cy="7" r="4" data-astro-cid-u2h3djql></circle> <path d="M23 21v-2a4 4 0 0 0-3-3.87" data-astro-cid-u2h3djql></path> <path d="M16 3.13a4 4 0 0 1 0 7.75" data-astro-cid-u2h3djql></path> </svg> </div> <h2 data-astro-cid-u2h3djql>User Management</h2> <p data-astro-cid-u2h3djql>View all users and their subscriptions</p> </a> </nav> <div class="admin-footer" data-astro-cid-u2h3djql> <a href="/profile" class="back-link" data-astro-cid-u2h3djql>Back to Profile</a> </div> </div> </main> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/admin/index.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
