import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321',
});

export const { signIn, signOut, signUp, useSession } = authClient;
