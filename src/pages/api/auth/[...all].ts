import type { APIRoute } from 'astro';
import { getAuthFromEnv } from '@/lib/auth';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const env = context.locals.runtime?.env;

  if (!env) {
    return new Response('Server configuration error', { status: 500 });
  }

  const auth = getAuthFromEnv(env);
  return auth.handler(context.request);
};
