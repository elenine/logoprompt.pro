import type { APIRoute } from 'astro';
import { getAuthFromEnv } from '@/lib/auth';
import { getEnv } from '@/lib/env';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const env = getEnv();
  const auth = getAuthFromEnv(env);
  return auth.handler(context.request);
};
