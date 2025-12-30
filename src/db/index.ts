import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(databaseUrl: string) {
  if (!db) {
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  }
  return db;
}

export { schema };
