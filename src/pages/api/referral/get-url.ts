import type { APIRoute } from 'astro';
import { getDirectAdUrlFromCode } from '@/constants/referralLinks';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const refCode = context.url.searchParams.get('ref');

  // Get the direct ad URL from const file
  const url = getDirectAdUrlFromCode(refCode);

  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
