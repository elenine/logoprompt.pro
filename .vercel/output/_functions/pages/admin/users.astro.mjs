import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DgYwtGrl.mjs';
import { $ as $$Layout } from '../../chunks/Layout_D32kDI1K.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://logoprompt.pro");
const prerender = false;
const $$Users = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Users;
  if (!Astro2.locals.isAdmin) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "User Management - Admin", "description": "Manage users", "data-astro-cid-asi4dl7j": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="admin-page" data-astro-cid-asi4dl7j> <div class="admin-container" data-astro-cid-asi4dl7j> <header class="page-header" data-astro-cid-asi4dl7j> <div class="header-left" data-astro-cid-asi4dl7j> <a href="/admin" class="back-btn" data-astro-cid-asi4dl7j>&larr; Back</a> <h1 data-astro-cid-asi4dl7j>User Management</h1> </div> <div class="header-actions" data-astro-cid-asi4dl7j> <input type="text" id="search-input" placeholder="Search users..." class="search-input" data-astro-cid-asi4dl7j> <select id="filter-select" class="filter-select" data-astro-cid-asi4dl7j> <option value="all" data-astro-cid-asi4dl7j>All Users</option> <option value="admins" data-astro-cid-asi4dl7j>Admins Only</option> <option value="subscribed" data-astro-cid-asi4dl7j>Subscribed Only</option> </select> </div> </header> <div class="table-container" data-astro-cid-asi4dl7j> <table class="data-table" data-astro-cid-asi4dl7j> <thead data-astro-cid-asi4dl7j> <tr data-astro-cid-asi4dl7j> <th data-astro-cid-asi4dl7j>User</th> <th data-astro-cid-asi4dl7j>Status</th> <th data-astro-cid-asi4dl7j>Subscription</th> <th data-astro-cid-asi4dl7j>Joined</th> <th data-astro-cid-asi4dl7j>Actions</th> </tr> </thead> <tbody id="users-tbody" data-astro-cid-asi4dl7j> <tr data-astro-cid-asi4dl7j> <td colspan="5" class="loading-state" data-astro-cid-asi4dl7j>Loading users...</td> </tr> </tbody> </table> </div> <div class="pagination" id="pagination" data-astro-cid-asi4dl7j></div> </div> </main>  <div id="edit-modal" class="modal" style="display: none;" data-astro-cid-asi4dl7j> <div class="modal-backdrop" data-astro-cid-asi4dl7j></div> <div class="modal-content" data-astro-cid-asi4dl7j> <h2 data-astro-cid-asi4dl7j>Edit User</h2> <form id="edit-form" data-astro-cid-asi4dl7j> <input type="hidden" id="edit-user-id" data-astro-cid-asi4dl7j> <div class="form-group" data-astro-cid-asi4dl7j> <label data-astro-cid-asi4dl7j>Name</label> <input type="text" id="edit-name" readonly class="readonly-input" data-astro-cid-asi4dl7j> </div> <div class="form-group" data-astro-cid-asi4dl7j> <label data-astro-cid-asi4dl7j>Email</label> <input type="email" id="edit-email" readonly class="readonly-input" data-astro-cid-asi4dl7j> </div> <div class="form-group checkbox-group" data-astro-cid-asi4dl7j> <label data-astro-cid-asi4dl7j> <input type="checkbox" id="edit-is-admin" data-astro-cid-asi4dl7j> <span data-astro-cid-asi4dl7j>Is Admin</span> </label> </div> <div class="modal-actions" data-astro-cid-asi4dl7j> <button type="button" class="btn-secondary" id="cancel-edit" data-astro-cid-asi4dl7j>Cancel</button> <button type="submit" class="btn-primary" data-astro-cid-asi4dl7j>Save Changes</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/admin/users.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/admin/users.astro", void 0);

const $$file = "/Users/asankagayashan/Documents/e9-projects/logoprompt.pro/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Users,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
