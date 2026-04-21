import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://forhuman.ca',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-CA',
          zh: 'zh-Hant',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      // English at /, Chinese at /zh/
      prefixDefaultLocale: false,
    },
  },
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
