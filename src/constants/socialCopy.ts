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

  /** Advertisement URL to open on copy actions */
  adUrl: 'https://otieu.com/4/9338001',
} as const;

/**
 * Generates a social media formatted copy text
 * @param prompt - The logo generation prompt
 * @param model - Optional model name to include as hashtag
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

  return `prompt: ${prompt}

${hashtagsString}

${callToAction.wantMore} ${callToAction.visit} ${siteUrl}`;
}

/**
 * Template for social media copy (for reference)
 *
 * Format:
 * ---
 * prompt: [PROMPT TEXT]
 *
 * #AILogo #LogoDesign #AIArt #LogoPrompt #AIGenerated #GraphicDesign #Branding #DesignInspiration
 *
 * Want more prompts like this? Visit logoprompt.pro
 * ---
 */
