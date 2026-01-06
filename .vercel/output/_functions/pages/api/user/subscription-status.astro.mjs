export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const isSubscribed = context.locals.isSubscribed ?? false;
  const user = context.locals.user;
  return new Response(
    JSON.stringify({
      isSubscribed,
      isLoggedIn: !!user
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
