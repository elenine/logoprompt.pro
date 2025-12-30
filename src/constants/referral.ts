/**
 * Referral System Utilities
 * Handles referral tracking via cookies
 */

import {
  REFERRAL_LINKS,
  DEFAULT_DIRECT_URL,
  REFERRAL_COOKIE_NAME,
  REFERRAL_EXPIRY_DAYS,
} from './referralLinks';

/**
 * Set referral cookie with 30-day expiry
 */
export function setReferralCookie(refCode: string): void {
  if (typeof document === 'undefined') return;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + REFERRAL_EXPIRY_DAYS);
  document.cookie = `${REFERRAL_COOKIE_NAME}=${encodeURIComponent(refCode)};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get referral code from cookie
 */
export function getReferralCode(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === REFERRAL_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Get direct ad URL based on referral code
 * Falls back to default URL if no referral or invalid referral
 */
export function getDirectAdUrl(refCode?: string | null): string {
  if (refCode && REFERRAL_LINKS[refCode]) {
    return REFERRAL_LINKS[refCode];
  }
  return DEFAULT_DIRECT_URL;
}

/**
 * Initialize referral tracking from URL param
 * Call this on page load to capture ref param and store in cookie
 */
export function initReferralTracking(): string {
  if (typeof window === 'undefined') return DEFAULT_DIRECT_URL;

  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');

  // If ref param exists, store it in cookie
  if (refParam) {
    setReferralCookie(refParam);
    return getDirectAdUrl(refParam);
  }

  // Otherwise check existing cookie
  const existingRef = getReferralCode();
  return getDirectAdUrl(existingRef);
}
