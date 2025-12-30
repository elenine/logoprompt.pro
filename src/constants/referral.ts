/**
 * Referral System Utilities
 * Handles referral tracking via cookies and fetches URLs from database
 */

import {
  DEFAULT_DIRECT_URL,
  REFERRAL_COOKIE_NAME,
  REFERRAL_EXPIRY_DAYS,
} from './referralLinks';

// Cache for direct ad URLs
const urlCache = new Map<string, string>();

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
 * Fetch direct ad URL from API based on referral code
 * Falls back to default URL if no referral or invalid referral
 */
export async function getDirectAdUrl(refCode?: string | null): Promise<string> {
  // If no ref code, return default
  if (!refCode) {
    return DEFAULT_DIRECT_URL;
  }

  // Check cache first
  if (urlCache.has(refCode)) {
    return urlCache.get(refCode)!;
  }

  try {
    const response = await fetch(`/api/referral/get-url?ref=${encodeURIComponent(refCode)}`);
    if (!response.ok) {
      return DEFAULT_DIRECT_URL;
    }
    const data = await response.json();
    const url = data.url || DEFAULT_DIRECT_URL;

    // Cache the result
    urlCache.set(refCode, url);

    return url;
  } catch (error) {
    console.error('Failed to fetch referral URL:', error);
    return DEFAULT_DIRECT_URL;
  }
}

/**
 * Initialize referral tracking from URL param (async version)
 * Call this on page load to capture ref param and store in cookie
 */
export async function initReferralTracking(): Promise<string> {
  if (typeof window === 'undefined') return DEFAULT_DIRECT_URL;

  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');

  // If ref param exists, store it in cookie
  if (refParam) {
    setReferralCookie(refParam);
    return await getDirectAdUrl(refParam);
  }

  // Otherwise check existing cookie
  const existingRef = getReferralCode();
  return await getDirectAdUrl(existingRef);
}

/**
 * Sync version that returns default URL immediately
 * Use initReferralTracking() for async version
 */
export function initReferralTrackingSync(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const refParam = urlParams.get('ref');

  // If ref param exists, store it in cookie
  if (refParam) {
    setReferralCookie(refParam);
  }
}
