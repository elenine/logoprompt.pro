ALTER TABLE "user" DROP CONSTRAINT "user_referral_code_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "is_affiliate";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "referral_code";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "referred_by";