import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import * as adminSchema from './schema-admin';

// Combined schema for drizzle
const combinedSchema = { ...schema, ...adminSchema };

let db: ReturnType<typeof drizzle<typeof combinedSchema>> | null = null;

export function getDb(databaseUrl: string) {
  if (!db) {
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema: combinedSchema });
  }
  return db;
}

export { schema, adminSchema };
