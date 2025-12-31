/**
 * Referral Links Configuration
 * Referral links are now stored in the database and managed via admin panel.
 * This file contains only the constants needed for referral tracking.
 */

/** Default direct ad URL (used when no referral or invalid referral) */
export const DEFAULT_DIRECT_URL = 'https://publishoccur.com/p9djddyx9b?key=e66de2e88ddcac3038ea9158b805f474';

/** Cookie name for storing referral code */
export const REFERRAL_COOKIE_NAME = 'logoprompt_ref';

/** Cookie expiry in days */
export const REFERRAL_EXPIRY_DAYS = 30;
