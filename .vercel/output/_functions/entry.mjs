import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DgsTNa9o.mjs';
import { manifest } from './manifest_ZiN8lJr6.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/users.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/admin/users/_id_.astro.mjs');
const _page5 = () => import('./pages/api/admin/users.astro.mjs');
const _page6 = () => import('./pages/api/auth/_---all_.astro.mjs');
const _page7 = () => import('./pages/api/polar/checkout.astro.mjs');
const _page8 = () => import('./pages/api/polar/portal.astro.mjs');
const _page9 = () => import('./pages/api/polar/webhook.astro.mjs');
const _page10 = () => import('./pages/api/referral/get-url.astro.mjs');
const _page11 = () => import('./pages/api/user/subscription-status.astro.mjs');
const _page12 = () => import('./pages/check-email.astro.mjs');
const _page13 = () => import('./pages/contact.astro.mjs');
const _page14 = () => import('./pages/flyers.astro.mjs');
const _page15 = () => import('./pages/forgot-password.astro.mjs');
const _page16 = () => import('./pages/login.astro.mjs');
const _page17 = () => import('./pages/offline.astro.mjs');
const _page18 = () => import('./pages/partners.astro.mjs');
const _page19 = () => import('./pages/privacy.astro.mjs');
const _page20 = () => import('./pages/products.astro.mjs');
const _page21 = () => import('./pages/profile.astro.mjs');
const _page22 = () => import('./pages/reset-password.astro.mjs');
const _page23 = () => import('./pages/signup.astro.mjs');
const _page24 = () => import('./pages/subscription/success.astro.mjs');
const _page25 = () => import('./pages/subscription.astro.mjs');
const _page26 = () => import('./pages/terms.astro.mjs');
const _page27 = () => import('./pages/verify-email.astro.mjs');
const _page28 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.16.6_@types+node@22.19.3_@vercel+functions@2.2.13_rollup@4.54.0_tsx@4.21.0_type_08e6021276f4b5981f78405342a857c6/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/users.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/admin/users/[id].ts", _page4],
    ["src/pages/api/admin/users.ts", _page5],
    ["src/pages/api/auth/[...all].ts", _page6],
    ["src/pages/api/polar/checkout.ts", _page7],
    ["src/pages/api/polar/portal.ts", _page8],
    ["src/pages/api/polar/webhook.ts", _page9],
    ["src/pages/api/referral/get-url.ts", _page10],
    ["src/pages/api/user/subscription-status.ts", _page11],
    ["src/pages/check-email.astro", _page12],
    ["src/pages/contact.astro", _page13],
    ["src/pages/flyers.astro", _page14],
    ["src/pages/forgot-password.astro", _page15],
    ["src/pages/login.astro", _page16],
    ["src/pages/offline.astro", _page17],
    ["src/pages/partners.astro", _page18],
    ["src/pages/privacy.astro", _page19],
    ["src/pages/products.astro", _page20],
    ["src/pages/profile.astro", _page21],
    ["src/pages/reset-password.astro", _page22],
    ["src/pages/signup.astro", _page23],
    ["src/pages/subscription/success.astro", _page24],
    ["src/pages/subscription/index.astro", _page25],
    ["src/pages/terms.astro", _page26],
    ["src/pages/verify-email.astro", _page27],
    ["src/pages/index.astro", _page28]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "4302c251-4065-4c31-a156-a8547aa22928",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
