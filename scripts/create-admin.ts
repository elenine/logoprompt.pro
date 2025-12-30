/**
 * Admin User Management Script
 *
 * This script can:
 * 1. Create a new admin user with email/password
 * 2. Promote an existing user to admin
 *
 * Usage:
 *   # Create new admin user
 *   pnpm admin:create --email admin@example.com --password yourpassword --name "Admin User"
 *
 *   # Promote existing user to admin
 *   pnpm admin:promote --email existing@example.com
 *
 *   # List all admin users
 *   pnpm admin:list
 *
 * Environment:
 *   DATABASE_URL must be set in .env or as environment variable
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { createHash, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

// Import schema
import { user, account } from '../src/db/schema';

const scryptAsync = promisify(scrypt);

// Parse command line arguments
function parseArgs(): {
  action: 'create' | 'promote' | 'list' | 'demote';
  email?: string;
  password?: string;
  name?: string;
} {
  const args = process.argv.slice(2);
  const result: ReturnType<typeof parseArgs> = { action: 'list' };

  // Determine action from first arg or script name
  if (args[0] === '--create' || args[0] === 'create') {
    result.action = 'create';
    args.shift();
  } else if (args[0] === '--promote' || args[0] === 'promote') {
    result.action = 'promote';
    args.shift();
  } else if (args[0] === '--demote' || args[0] === 'demote') {
    result.action = 'demote';
    args.shift();
  } else if (args[0] === '--list' || args[0] === 'list') {
    result.action = 'list';
    args.shift();
  }

  // Parse remaining arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' || args[i] === '-e') {
      result.email = args[++i];
    } else if (args[i] === '--password' || args[i] === '-p') {
      result.password = args[++i];
    } else if (args[i] === '--name' || args[i] === '-n') {
      result.name = args[++i];
    }
  }

  return result;
}

/**
 * Hash password using the same algorithm as better-auth
 * better-auth uses scrypt with specific parameters
 */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Generate a UUID
 */
function generateId(): string {
  return crypto.randomUUID();
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('Error: DATABASE_URL environment variable is not set');
    console.error('Please set it in your .env file or as an environment variable');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  const args = parseArgs();

  switch (args.action) {
    case 'list': {
      console.log('\n📋 Admin Users:\n');
      const admins = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        })
        .from(user)
        .where(eq(user.isAdmin, true));

      if (admins.length === 0) {
        console.log('  No admin users found.\n');
      } else {
        admins.forEach((admin, index) => {
          console.log(`  ${index + 1}. ${admin.name} <${admin.email}>`);
          console.log(`     ID: ${admin.id}`);
          console.log(`     Created: ${admin.createdAt.toISOString()}\n`);
        });
      }
      break;
    }

    case 'create': {
      if (!args.email || !args.password) {
        console.error('Error: --email and --password are required for create action');
        console.error('Usage: pnpm admin:create --email admin@example.com --password yourpassword --name "Admin User"');
        process.exit(1);
      }

      const name = args.name || 'Admin';

      // Check if user already exists
      const existing = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, args.email))
        .limit(1);

      if (existing.length > 0) {
        console.error(`Error: User with email ${args.email} already exists`);
        console.error('Use --promote to make an existing user an admin');
        process.exit(1);
      }

      // Hash password
      const hashedPassword = await hashPassword(args.password);
      const userId = generateId();
      const accountId = generateId();

      // Create user
      await db.insert(user).values({
        id: userId,
        name: name,
        email: args.email,
        emailVerified: true, // Admin users are pre-verified
        isAdmin: true,
        isAffiliate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create credential account
      await db.insert(account).values({
        id: accountId,
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('\n✅ Admin user created successfully!\n');
      console.log(`   Email: ${args.email}`);
      console.log(`   Name: ${name}`);
      console.log(`   ID: ${userId}`);
      console.log('\n   You can now log in at /login with these credentials.\n');
      break;
    }

    case 'promote': {
      if (!args.email) {
        console.error('Error: --email is required for promote action');
        console.error('Usage: pnpm admin:promote --email user@example.com');
        process.exit(1);
      }

      // Find user
      const existingUser = await db
        .select({ id: user.id, name: user.name, isAdmin: user.isAdmin })
        .from(user)
        .where(eq(user.email, args.email))
        .limit(1);

      if (existingUser.length === 0) {
        console.error(`Error: User with email ${args.email} not found`);
        process.exit(1);
      }

      if (existingUser[0].isAdmin) {
        console.log(`User ${args.email} is already an admin`);
        process.exit(0);
      }

      // Update user to admin
      await db
        .update(user)
        .set({ isAdmin: true, updatedAt: new Date() })
        .where(eq(user.email, args.email));

      console.log('\n✅ User promoted to admin successfully!\n');
      console.log(`   Email: ${args.email}`);
      console.log(`   Name: ${existingUser[0].name}`);
      console.log(`   ID: ${existingUser[0].id}\n`);
      break;
    }

    case 'demote': {
      if (!args.email) {
        console.error('Error: --email is required for demote action');
        console.error('Usage: pnpm admin:demote --email user@example.com');
        process.exit(1);
      }

      // Find user
      const existingUser = await db
        .select({ id: user.id, name: user.name, isAdmin: user.isAdmin })
        .from(user)
        .where(eq(user.email, args.email))
        .limit(1);

      if (existingUser.length === 0) {
        console.error(`Error: User with email ${args.email} not found`);
        process.exit(1);
      }

      if (!existingUser[0].isAdmin) {
        console.log(`User ${args.email} is not an admin`);
        process.exit(0);
      }

      // Remove admin status
      await db
        .update(user)
        .set({ isAdmin: false, updatedAt: new Date() })
        .where(eq(user.email, args.email));

      console.log('\n✅ Admin status removed successfully!\n');
      console.log(`   Email: ${args.email}`);
      console.log(`   Name: ${existingUser[0].name}\n`);
      break;
    }
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
