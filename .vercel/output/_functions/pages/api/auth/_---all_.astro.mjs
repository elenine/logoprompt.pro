import { g as getAuthFromEnv } from '../../../chunks/auth_B81ErrSU.mjs';
import { g as getEnv } from '../../../chunks/env_BlcyOfWY.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const ALL = async (context) => {
  const env = getEnv();
  const auth = getAuthFromEnv(env);
  return auth.handler(context.request);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
