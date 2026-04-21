# Content authoring

Three collections live in `src/content/`. They all use the same workflow: write
the English file, write the Chinese pair, run the humaniser, commit.

## Collections at a glance

| Collection | Path pattern | Schema (Zod) |
|---|---|---|
| `blog` | `src/content/blog/<lang>/<slug>.md` | title, summary, date, author (default "Nico Jan"), tags, draft, lang, pair_key |
| `useful_words` | `src/content/useful_words/<lang>/<slug>.md` | term, pronunciation?, definition, example?, etymology?, related, lang, pair_key |
| `faq` | `src/content/faq/<lang>/<slug>.md` | question, category, order, lang, pair_key |

`pair_key` is the cross-language identifier. The English and Chinese files for
the same entry share a `pair_key`. The `slug` (filename) usually matches
`pair_key` for clarity.

## Adding a blog post

1. Pick a slug. Lowercase, kebab-case, descriptive. Example: `why-the-comma`.

2. Create `src/content/blog/en/<slug>.md`:

   ```markdown
   ---
   title: "Why Human, starts with a comma."
   summary: "The punctuation isn't a typo. It's the whole idea."
   date: 2026-04-20
   author: "Nico Jan"
   lang: en
   pair_key: why-the-comma
   tags:
     - brand
     - teaching
   ---

   First paragraph of the post.

   Second paragraph.
   ```

3. Run the body through the mcp-humanizer:
   - For a substantial post, call `humanizer_get_guide` (content_type:
     `prose`) and apply every dimension.
   - For a short note, `humanizer_get_summary` is enough.
   - Avoid em-dashes, AI-flagged vocabulary, three-item parallel lists,
     hedging clichés, and the "not just X but also Y" pattern.

4. Create the Chinese pair at `src/content/blog/zh/<slug>.md` with the same
   `pair_key`. Mirror section-level structure; do not translate word-for-word.
   Use the writer-MCP's tone calibrations (`get_tone_for_context`) and
   the Chinese style guide before drafting.

5. Stamp the humanized SHA on both files:

   ```bash
   npm run humanize
   ```

6. Verify the build still passes:

   ```bash
   npm run build
   ```

7. Commit:

   ```bash
   git add src/content/blog/en/<slug>.md src/content/blog/zh/<slug>.md
   git commit -m "content(blog): add '<slug>' post in both locales"
   ```

## Adding a Useful Words entry

Same flow as a blog post, with these differences:

- The body of the markdown is optional — short context is fine. The card
  pulls `term`, `definition`, `example`, `etymology` from frontmatter.
- For Chinese entries, the `term` should be the Chinese word with optional
  pinyin in parentheses, and `pronunciation` can hold the English equivalent
  (acts as a cross-reference).
- The collection sorts alphabetically by `term`. There is no manual ordering.

Example English entry:

```markdown
---
term: "Close reading"
pronunciation: "/kloʊs ˈriː.dɪŋ/"
definition: "Slowing down in front of a text until you start noticing what you'd miss at regular speed."
example: "A close reading of the first paragraph showed every sentence used 'to be' except the last."
etymology: "From the New Critics of the mid-20th century."
lang: en
pair_key: close-reading
---

Optional longer context paragraph.
```

## Adding an FAQ

Same flow. Frontmatter only — no body needed if the answer is one paragraph.
The body content (markdown) becomes the answer revealed when the user opens
the disclosure.

```markdown
---
question: "How do I book?"
category: "booking"
order: 50
lang: en
pair_key: how-do-i-book
---

Email, WhatsApp, Instagram, or WeChat. Any of them works.
```

`order` controls the display sequence (low → high). Categories are not
displayed currently but reserved for future filtering. Conventional categories:
`audience`, `format`, `pricing`, `booking`, `tests`, `language`.

## The humaniser, in plainer terms

The humaniser is a tool, not a censor. It catches the patterns that signal a
draft was AI-written rather than human-written. The fixes are usually:

- Cut **em-dashes** (`—`). Use commas, semicolons, or periods.
- Replace inflated verbs (`leverages`, `utilises`, `facilitates`) with plain
  ones (`uses`, `helps`).
- Vary sentence length. Mix fragments with longer sentences.
- Avoid stacking three-item parallel lists in adjacent sentences.
- Drop hedge phrases like "generally speaking", "arguably", "it's worth
  noting that".
- Don't say "x, not y" if you can just say x.
- Use first-person where natural. Nico writes as "I". The collective is "we".

A pre-commit / CI check via `npm run humanize:check` will fail if a file's
content has been edited but `humanized_sha` wasn't refreshed.

## Drafts

Set `draft: true` in the frontmatter to keep an entry out of the production
build but in the source tree. Currently only `blog` honours `draft` (the
collection index filter excludes drafts). FAQ and Useful Words don't yet
support draft mode; treat them as immediately-public when committed.

## Common mistakes

- **Forgetting the Chinese pair.** Without both files, the language switcher
  on a deep page falls back to the locale index. That's not always what you
  want.
- **`pair_key` typos** between EN and ZH files. The pair won't link if they
  differ even by one character.
- **Editing the body without re-running `npm run humanize`.** CI catches this,
  but it's faster to do it locally before committing.
- **Including em-dashes in the body.** They're an AI tell. The humaniser will
  flag them every time.
