import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const isSubscribed = context.locals.isSubscribed ?? false;
  const user = context.locals.user;

  return new Response(
    JSON.stringify({
      isSubscribed,
      isLoggedIn: !!user,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
