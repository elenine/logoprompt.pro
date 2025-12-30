// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://logoprompt.pro',
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    resolve: {
      // Required for better-auth to work with Cloudflare
      alias: import.meta.env.PROD ? {
        'crypto': 'node:crypto',
      } : {},
    },
  },
});
