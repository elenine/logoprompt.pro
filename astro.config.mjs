// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://logoprompt.pro',
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true
  }),
  integrations: [
    sitemap({
      lastmod: new Date(),
      // Exclude private/admin pages from sitemap
      filter: (page) => {
        const excludePatterns = [
          '/admin',
          '/login',
          '/signup',
          '/profile',
          '/forgot-password',
          '/reset-password',
          '/offline',
          '/subscription/success',
          '/creatives', // Old page, removed
        ];
        return !excludePatterns.some(pattern => page.includes(pattern));
      },
      // Custom serialization for priorities
      serialize: (item) => {
        const url = item.url;
        // High priority for main gallery pages
        if (url === 'https://logoprompt.pro/' ||
            url.endsWith('/products/') ||
            url.endsWith('/nature/') ||
            url.endsWith('/people/')) {
          return { ...item, changefreq: 'daily', priority: 1.0 };
        }
        // Medium priority for info pages
        if (url.includes('/about') || url.includes('/contact') || url.includes('/partners')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }
        // Lower priority for legal/policy pages
        if (url.includes('/privacy') || url.includes('/terms')) {
          return { ...item, changefreq: 'yearly', priority: 0.3 };
        }
        // Default for subscription
        if (url.includes('/subscription')) {
          return { ...item, changefreq: 'monthly', priority: 0.5 };
        }
        return { ...item, changefreq: 'weekly', priority: 0.5 };
      },
    }),
  ],
});
