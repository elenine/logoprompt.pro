CREATE TYPE "public"."payout_method" AS ENUM('paypal', 'bank_transfer');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'failed');--> statement-breakpoint
CREATE TABLE "admin_activity_log" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_id" text NOT NULL,
	"action" text NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"details" jsonb,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_earning" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_id" text NOT NULL,
	"referred_user_id" text NOT NULL,
	"subscription_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"is_paid_out" boolean DEFAULT false NOT NULL,
	"payout_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_payout" (
	"id" text PRIMARY KEY NOT NULL,
	"affiliate_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"payout_method" "payout_method" NOT NULL,
	"payout_details" jsonb NOT NULL,
	"processed_by" text,
	"processed_at" timestamp,
	"transaction_reference" text,
	"affiliate_notes" text,
	"admin_notes" text,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_payout_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"payout_method" "payout_method" DEFAULT 'paypal' NOT NULL,
	"country" text DEFAULT 'other' NOT NULL,
	"paypal_email" text,
	"bank_name" text,
	"bank_branch" text,
	"bank_account_number" text,
	"bank_account_name" text,
	"minimum_payout" numeric(10, 2) DEFAULT '5.00',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "affiliate_payout_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "referral_link" (
	"id" text PRIMARY KEY NOT NULL,
	"referral_code" text NOT NULL,
	"direct_ad_url" text NOT NULL,
	"affiliate_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"description" text,
	"click_count" numeric(10, 0) DEFAULT '0',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_link_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
ALTER TABLE "admin_activity_log" ADD CONSTRAINT "admin_activity_log_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_earning" ADD CONSTRAINT "affiliate_earning_affiliate_id_user_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_earning" ADD CONSTRAINT "affiliate_earning_referred_user_id_user_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_earning" ADD CONSTRAINT "affiliate_earning_payout_id_affiliate_payout_id_fk" FOREIGN KEY ("payout_id") REFERENCES "public"."affiliate_payout"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_payout" ADD CONSTRAINT "affiliate_payout_affiliate_id_user_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_payout" ADD CONSTRAINT "affiliate_payout_processed_by_user_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_payout_settings" ADD CONSTRAINT "affiliate_payout_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_link" ADD CONSTRAINT "referral_link_affiliate_id_user_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;