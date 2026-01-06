export { renderers } from '../../../renderers.mjs';

const DEFAULT_DIRECT_URL = "https://otieu.com/4/9338001";
const REFERRAL_LINKS = {
  // Sample referral partners - replace with your actual partners
  "techblog": "https://publishoccur.com/p9djddyx9b?key=e66de2e88ddcac3038ea9158b805f474",
  "designweekly": "https://otieu.com/4/9338002",
  "logoinsider": "https://otieu.com/4/9338003",
  "creativepro": "https://publishoccur.com/abc123?key=sample_key_here"
};
function getDirectAdUrlFromCode(refCode) {
  if (!refCode) {
    return DEFAULT_DIRECT_URL;
  }
  return REFERRAL_LINKS[refCode] ?? DEFAULT_DIRECT_URL;
}

const prerender = false;
const GET = async (context) => {
  const refCode = context.url.searchParams.get("ref");
  const url = getDirectAdUrlFromCode(refCode);
  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
