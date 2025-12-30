import { pgTable, text, timestamp, boolean, pgEnum, numeric, jsonb } from 'drizzle-orm/pg-core';
import { user } from './schema';

/**
 * Admin & Affiliate System Schema
 * Separate schema for admin functionality, affiliate management, and payouts
 */

// Payout method enum
export const payoutMethodEnum = pgEnum('payout_method', [
  'paypal',
  'bank_transfer',
]);

// Payout status enum
export const payoutStatusEnum = pgEnum('payout_status', [
  'pending',
  'processing',
  'completed',
  'cancelled',
  'failed',
]);

// Referral links table - stores affiliate referral codes and their ad URLs
export const referralLink = pgTable('referral_link', {
  id: text('id').primaryKey(),
  referralCode: text('referral_code').notNull().unique(),
  directAdUrl: text('direct_ad_url').notNull(),
  // If null, this is the default/fallback link
  affiliateId: text('affiliate_id').references(() => user.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').notNull().default(true),
  description: text('description'), // Optional description for admin reference
  clickCount: numeric('click_count', { precision: 10, scale: 0 }).default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Affiliate payout settings - stores affiliate payout preferences
export const affiliatePayoutSettings = pgTable('affiliate_payout_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  // Payout method preference
  payoutMethod: payoutMethodEnum('payout_method').notNull().default('paypal'),
  // Country for determining available payout methods
  country: text('country').notNull().default('other'),
  // PayPal details
  paypalEmail: text('paypal_email'),
  // Bank transfer details (for Sri Lanka)
  bankName: text('bank_name'),
  bankBranch: text('bank_branch'),
  bankAccountNumber: text('bank_account_number'),
  bankAccountName: text('bank_account_name'),
  // Minimum payout threshold
  minimumPayout: numeric('minimum_payout', { precision: 10, scale: 2 }).default('5.00'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Affiliate payout requests - tracks all payout requests
export const affiliatePayout = pgTable('affiliate_payout', {
  id: text('id').primaryKey(),
  affiliateId: text('affiliate_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  status: payoutStatusEnum('status').notNull().default('pending'),
  payoutMethod: payoutMethodEnum('payout_method').notNull(),
  // Payout details snapshot at time of request
  payoutDetails: jsonb('payout_details').notNull(), // {paypalEmail} or {bankName, bankAccount, etc}
  // Admin handling
  processedBy: text('processed_by').references(() => user.id, { onDelete: 'set null' }),
  processedAt: timestamp('processed_at'),
  // Transaction reference (PayPal transaction ID, bank reference, etc)
  transactionReference: text('transaction_reference'),
  // Notes
  affiliateNotes: text('affiliate_notes'),
  adminNotes: text('admin_notes'),
  // Timestamps
  requestedAt: timestamp('requested_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Affiliate earnings log - tracks monthly earnings per affiliate
export const affiliateEarning = pgTable('affiliate_earning', {
  id: text('id').primaryKey(),
  affiliateId: text('affiliate_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  // The referred user's subscription that generated this earning
  referredUserId: text('referred_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  subscriptionId: text('subscription_id'),
  // Earning details
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  // Period this earning is for
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  // Whether this earning has been included in a payout
  isPaidOut: boolean('is_paid_out').notNull().default(false),
  payoutId: text('payout_id').references(() => affiliatePayout.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Admin activity log - tracks admin actions for audit
export const adminActivityLog = pgTable('admin_activity_log', {
  id: text('id').primaryKey(),
  adminId: text('admin_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // e.g., 'make_affiliate', 'process_payout', 'update_referral_link'
  targetType: text('target_type').notNull(), // e.g., 'user', 'payout', 'referral_link'
  targetId: text('target_id').notNull(),
  details: jsonb('details'), // Additional action details
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
