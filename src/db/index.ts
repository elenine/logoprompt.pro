import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Ensure your .env file exists and contains DATABASE_URL, ' +
        'or that the environment variable is set in your deployment environment.'
    );
  }
  if (!db) {
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  }
  return db;
}

export { schema };
