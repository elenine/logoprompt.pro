/**
 * Social Media Copy Template Constants
 * Used when copying prompts with search=true parameter
 */

export const SOCIAL_COPY_CONFIG = {
  /** Site URL for call-to-action */
  siteUrl: 'logoprompt.pro',

  /** Site name for branding */
  siteName: 'LogoPrompt.pro',

  /** Default hashtags for social media posts */
  hashtags: [
    '#AILogo',
    '#LogoDesign',
    '#AIArt',
    '#LogoPrompt',
    '#AIGenerated',
    '#GraphicDesign',
    '#Branding',
    '#DesignInspiration',
  ] as string[],

  /** Call-to-action messages */
  callToAction: {
    wantMore: 'Want more prompts like this?',
    visit: 'Visit',
  },

  /** LocalStorage key for persisting social copy mode */
  storageKey: 'logoprompt_social_copy_mode',
} as const;

/**
 * Advertisement Configuration
 */
export const AD_CONFIG = {
  /** Master switch to enable/disable all advertisements */
  showAdvertisement: true,

  /** Show direct URL advertisement (opens on copy actions) */
  showDirectAd: true,

  /** Show banner advertisements */
  showBannerAd: true,

  /** Direct advertisement URL (opens on copy actions) */
  directAdUrl: 'https://publishoccur.com/p9djddyx9b?key=e66de2e88ddcac3038ea9158b805f474',

  /** SessionStorage key for tracking click count */
  clickCountKey: 'logoprompt_ad_click_count',

  /**
   * Show ad on every Nth click
   * Value of 2 means show on every 2nd click (2nd, 4th, 6th...)
   * Value of 3 means show on every 3rd click (3rd, 6th, 9th...)
   */
  showAdOnEveryNthClick: 5,

  /** Banner ad configuration */
  bannerAd: {
    key: '882d73406cd815f47161aad7e2526995',
    format: 'iframe',
    height: 90,
    width: 728,
    scriptUrl: 'https://www.highperformanceformat.com/882d73406cd815f47161aad7e2526995/invoke.js',
  },
} as const;

/**
 * Check if user is on a mobile device
 * @returns true if on mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth <= 768;
}

/**
 * Check if direct ad should be shown based on click count
 * Shows ad on every Nth click (configurable via showAdOnEveryNthClick)
 * @returns true if ad should be shown
 */
export function shouldShowDirectAd(): boolean {
  if (!AD_CONFIG.showAdvertisement) return false;
  if (!AD_CONFIG.showDirectAd) return false;
  // Don't show direct ads on mobile devices
  if (isMobileDevice()) return false;
  if (typeof window === 'undefined') return false;

  // Get current click count from sessionStorage
  const currentCount = parseInt(sessionStorage.getItem(AD_CONFIG.clickCountKey) || '0', 10);
  // Increment the count
  const newCount = currentCount + 1;
  // Save the new count
  sessionStorage.setItem(AD_CONFIG.clickCountKey, newCount.toString());

  // Show ad on every Nth click based on config
  return newCount % AD_CONFIG.showAdOnEveryNthClick === 0;
}

/**
 * Check if banner ads should be shown
 * @returns true if banner ads should be shown
 */
export function shouldShowBannerAd(): boolean {
  return AD_CONFIG.showAdvertisement && AD_CONFIG.showBannerAd;
}

/**
 * Generates a social media formatted copy text
 * @param prompt - The logo generation prompt
 * @param model - Optional model name to include as hashtag and label
 * @returns Formatted string for social media sharing
 */
export function formatSocialCopy(prompt: string, model?: string): string {
  const { hashtags, callToAction, siteUrl } = SOCIAL_COPY_CONFIG;

  // Build hashtags string, optionally including model-specific tag
  const allHashtags = [...hashtags];
  if (model) {
    // Convert model name to hashtag format (remove spaces, capitalize)
    const modelHashtag = `#${model.replace(/\s+/g, '')}`;
    allHashtags.unshift(modelHashtag);
  }

  const hashtagsString = allHashtags.join(' ');

  // Include model name on separate line if available
  const modelLine = model ? `model: ${model}` : '';

  return `prompt: ${prompt}

${modelLine}

${hashtagsString}

${callToAction.wantMore} ${callToAction.visit} ${siteUrl}`;
}

/**
 * Template for social media copy (for reference)
 *
 * Format:
 * ---
 * prompt: [PROMPT TEXT]
 * model: [MODEL NAME]
 *
 * #[Model] #AILogo #LogoDesign #AIArt #LogoPrompt #AIGenerated #GraphicDesign #Branding #DesignInspiration
 *
 * Want more prompts like this? Visit logoprompt.pro
 * ---
 */
