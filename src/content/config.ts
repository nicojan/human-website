/*
 * config.ts — content collection schemas.
 * Each collection has a `lang` and a `pair_key` so translations stay linked.
 * `humanized_sha` records the SHA of the humanized body and prevents double-runs.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const LOCALE = z.enum(['en', 'zh']);

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().default('Nico Jan'),
    lang: LOCALE,
    pair_key: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    humanized_sha: z.string().optional(),
  }),
});

const useful_words = defineCollection({
  loader: glob({ base: './src/content/useful_words', pattern: '**/*.md' }),
  schema: z.object({
    term: z.string(),
    pronunciation: z.string().optional(),
    definition: z.string(),
    example: z.string().optional(),
    etymology: z.string().optional(),
    related: z.array(z.string()).default([]),
    lang: LOCALE,
    pair_key: z.string(),
    humanized_sha: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '**/*.md' }),
  schema: z.object({
    question: z.string(),
    category: z.string().default('general'),
    order: z.number().default(100),
    lang: LOCALE,
    pair_key: z.string(),
    humanized_sha: z.string().optional(),
  }),
});

export const collections = { blog, useful_words, faq };
