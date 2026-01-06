/**
 * Referral Links Configuration
 * Referral codes and their direct ad URLs are stored here.
 * To add a new referral partner, add their code and URL to REFERRAL_LINKS.
 */

/** Default direct ad URL (used when no referral or invalid referral) */
export const DEFAULT_DIRECT_URL = 'https://otieu.com/4/9338001';

/** Cookie name for storing referral code */
export const REFERRAL_COOKIE_NAME = 'logoprompt_ref';

/** Cookie expiry in days */
export const REFERRAL_EXPIRY_DAYS = 30;

/**
 * Referral links map: referral code -> direct ad URL
 *
 * HOW TO ADD A NEW REFERRAL PARTNER:
 * 1. Choose a unique referral code (e.g., 'techblog', 'designer_joe')
 * 2. Get the direct ad URL from your ad network
 * 3. Add an entry below: 'code': 'https://ad-network-url...',
 *
 * The referral link format is: https://logoprompt.pro?ref=CODE
 * Example: https://logoprompt.pro?ref=techblog
 */
export const REFERRAL_LINKS: Record<string, string> = {
  // Sample referral partners - replace with your actual partners
  'techblog': 'https://publishoccur.com/p9djddyx9b?key=e66de2e88ddcac3038ea9158b805f474',
  'designweekly': 'https://otieu.com/4/9338002',
  'logoinsider': 'https://otieu.com/4/9338003',
  'creativepro': 'https://asanka.com',
};

/**
 * Get the direct ad URL for a referral code
 * Returns DEFAULT_DIRECT_URL if code is not found
 */
export function getDirectAdUrlFromCode(refCode: string | null | undefined): string {
  if (!refCode) {
    return DEFAULT_DIRECT_URL;
  }
  return REFERRAL_LINKS[refCode] ?? DEFAULT_DIRECT_URL;
}
