import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://forhuman.ca',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-CA',
          'zh-hant': 'zh-Hant',
        },
      },
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-hant'],
    routing: {
      // English at /, Traditional Chinese at /zh-hant/*
      prefixDefaultLocale: false,
    },
  },

  trailingSlash: 'ignore',

  build: {
    format: 'directory',
  },

  adapter: cloudflare()
});