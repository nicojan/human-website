/*
 * i18n.ts — helpers for locale-aware URLs and translation pairing.
 */
import type { Locale } from '@i18n/strings';
import { DEFAULT_LOCALE } from '@i18n/strings';

/**
 * Resolve the current locale from a URL pathname. Defaults to `en` for any
 * path that does not start with `/zh/`.
 */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en';
}

/**
 * Build a URL in the target locale for a given canonical path.
 * `path` should be the EN-canonical path (e.g. '/about', '/blog/welcome').
 * Returns '/zh/about', '/zh/blog/welcome', etc. for the ZH locale.
 */
export function localisedUrl(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === '/index' ? '/' : clean;
  return clean === '/' ? '/zh/' : `/zh${clean}`;
}

/**
 * Strip the `/zh` prefix from a pathname, returning the canonical EN path.
 */
export function canonicalPath(pathname: string): string {
  if (pathname === '/zh' || pathname === '/zh/') return '/';
  if (pathname.startsWith('/zh/')) return pathname.slice(3);
  return pathname;
}

/**
 * Return the sibling-locale URL for the current path.
 */
export function alternateLocaleUrl(pathname: string): string {
  const current = localeFromPath(pathname);
  const canonical = canonicalPath(pathname);
  return localisedUrl(canonical, current === 'en' ? 'zh' : 'en');
}

/**
 * hreflang entries for <head>.
 */
export function hreflangEntries(pathname: string): Array<{ href: string; hreflang: string }> {
  const canonical = canonicalPath(pathname);
  const enUrl = localisedUrl(canonical, 'en');
  const zhUrl = localisedUrl(canonical, 'zh');
  return [
    { href: enUrl, hreflang: 'en-CA' },
    { href: zhUrl, hreflang: 'zh-Hant' },
    { href: enUrl, hreflang: 'x-default' },
  ];
}
