/**
 * Referral Links Configuration
 * Maps referral codes to their direct ad URLs
 *
 * To add a new referral partner:
 * 1. Add entry: 'referral_code': 'https://their-ad-link.com/path'
 * 2. Share link: https://logoprompt.pro?ref=referral_code
 */

export const REFERRAL_LINKS: Record<string, string> = {
  // Example entries - replace with actual referral partners
  // 'partner1': 'https://example.com/ad/partner1',
  // 'john_doe': 'https://adnetwork.com/123456',
  // 'influencer_x': 'https://adnetwork.com/789012',
};

/** Default direct ad URL (used when no referral or invalid referral) */
export const DEFAULT_DIRECT_URL = 'https://otieu.com/4/9338001';

/** Cookie name for storing referral code */
export const REFERRAL_COOKIE_NAME = 'logoprompt_ref';

/** Cookie expiry in days */
export const REFERRAL_EXPIRY_DAYS = 30;
