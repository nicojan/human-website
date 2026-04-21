/*
 * i18n.ts — helpers for working with bilingual content.
 *
 * The site is bilingual on every URL (no /zh/ route tree). This module
 * mostly exists to keep pair_key lookups tidy. It intentionally exports
 * nothing locale-related; every page shows both languages.
 */
import type { CollectionEntry } from 'astro:content';

type Collection = 'blog' | 'faq' | 'useful_words';

export interface BilingualPair<C extends Collection> {
  pair_key: string;
  en?: CollectionEntry<C>;
  zh?: CollectionEntry<C>;
}

/**
 * Group collection entries by pair_key so each pair can render as one
 * bilingual unit. Entries without a partner in the other language still
 * render — the missing side is simply absent.
 */
export function groupByPairKey<C extends Collection>(
  entries: CollectionEntry<C>[],
): BilingualPair<C>[] {
  const byKey = new Map<string, BilingualPair<C>>();
  for (const entry of entries) {
    const key = entry.data.pair_key;
    const existing = byKey.get(key) ?? { pair_key: key };
    if (entry.data.lang === 'en') existing.en = entry;
    else if (entry.data.lang === 'zh') existing.zh = entry;
    byKey.set(key, existing);
  }
  return [...byKey.values()];
}
