#!/usr/bin/env node
/**
 * humanize.mjs — hash-stamper for humanized markdown content.
 *
 * Actual humanization is performed by Claude Code via the mcp-humanizer
 * MCP tools at author time. This script is the bookkeeper: it walks
 * src/content/ **\/*.md, SHAs each body, and writes `humanized_sha` back
 * into the frontmatter so we can tell at a glance whether a file has been
 * humanized since its body last changed.
 *
 * Modes:
 *   --stamp  (default) — rewrite humanized_sha to match current body SHA.
 *                        Use after Claude finishes rewriting a file.
 *   --check            — exit non-zero if any file's humanized_sha is stale
 *                        or missing. Use in CI / pre-commit.
 *
 * Usage:
 *   node scripts/humanize.mjs              # stamps all MD files
 *   node scripts/humanize.mjs --check      # CI mode
 *   node scripts/humanize.mjs path/to.md   # single file
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join, relative } from 'node:path';
import matter from 'gray-matter';

const ROOT = resolve(process.cwd());
const CONTENT_ROOT = resolve(ROOT, 'src/content');

const args = process.argv.slice(2);
const CHECK_MODE = args.includes('--check');
const EXPLICIT_PATHS = args.filter((a) => !a.startsWith('--'));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

async function resolveFiles() {
  if (EXPLICIT_PATHS.length > 0) {
    const files = [];
    for (const p of EXPLICIT_PATHS) {
      const abs = resolve(ROOT, p);
      const s = await stat(abs);
      if (s.isDirectory()) files.push(...(await walk(abs)));
      else if (abs.endsWith('.md')) files.push(abs);
    }
    return files;
  }
  return walk(CONTENT_ROOT);
}

function sha(body) {
  return createHash('sha256').update(body).digest('hex');
}

async function processFile(filepath) {
  const raw = await readFile(filepath, 'utf8');
  const parsed = matter(raw);
  const currentSha = sha(parsed.content);
  const stampedSha = parsed.data.humanized_sha;
  const rel = relative(ROOT, filepath);

  if (stampedSha === currentSha) {
    return { file: rel, status: 'ok' };
  }

  if (CHECK_MODE) {
    return {
      file: rel,
      status: stampedSha ? 'stale' : 'unstamped',
      current: currentSha.slice(0, 12),
      stamped: stampedSha?.slice(0, 12) ?? '(missing)',
    };
  }

  parsed.data.humanized_sha = currentSha;
  const updated = matter.stringify(parsed.content, parsed.data);
  await writeFile(filepath, updated, 'utf8');
  return { file: rel, status: stampedSha ? 'restamped' : 'stamped' };
}

const files = await resolveFiles();
const results = [];
for (const f of files) {
  results.push(await processFile(f));
}

const byStatus = results.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] ?? 0) + 1;
  return acc;
}, {});

console.log(`Scanned ${results.length} file(s) — ${JSON.stringify(byStatus)}`);

if (CHECK_MODE) {
  const failing = results.filter((r) => r.status !== 'ok');
  if (failing.length > 0) {
    console.error('\nFiles needing re-humanization (body changed since last stamp):');
    for (const r of failing) {
      console.error(`  - ${r.file}   [${r.status}] current=${r.current} stamped=${r.stamped}`);
    }
    process.exit(1);
  }
} else {
  const changed = results.filter((r) => r.status === 'stamped' || r.status === 'restamped');
  if (changed.length > 0) {
    for (const r of changed) {
      console.log(`  stamped: ${r.file}`);
    }
  }
}
