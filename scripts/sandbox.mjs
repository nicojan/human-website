#!/usr/bin/env node
/**
 * sandbox.mjs — workaround for Astro + project paths containing '#'.
 *
 * Astro's content-collection sync and Vite's module resolver URL-encode
 * the project path. A literal '#' in the path (from the parent directory
 * "# Human,") becomes '%23' in the URL, and later URL parsers treat it as
 * a fragment delimiter, which truncates the path mid-way and produces
 * EISDIR errors.
 *
 * Workaround: mirror the project into /tmp/human-build (no '#') and run
 * the Astro command there. Build output in dist/ is rsynced back into the
 * source tree.
 *
 * Usage:
 *   node scripts/sandbox.mjs build          # runs `astro build` in /tmp
 *   node scripts/sandbox.mjs dev            # runs `astro dev` in /tmp
 *   node scripts/sandbox.mjs check          # runs `astro check` in /tmp
 *   node scripts/sandbox.mjs -- <args>      # passes args through to astro
 *
 * The source tree stays canonical; /tmp is a mirror.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = resolve(process.cwd());
const DEST = '/tmp/human-build';
const args = process.argv.slice(2).filter((a) => a !== '--');
const astroCmd = args[0] ?? 'build';
const astroArgs = args.slice(1);

function run(cmd, cmdArgs, opts = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, cmdArgs, { stdio: 'inherit', ...opts });
    child.on('exit', (code) => (code === 0 ? resolvePromise() : reject(new Error(`${cmd} exited ${code}`))));
    child.on('error', reject);
  });
}

async function rsyncIn() {
  mkdirSync(DEST, { recursive: true });
  await run('rsync', [
    '-a',
    '--delete',
    '--exclude', 'node_modules',
    '--exclude', 'dist',
    '--exclude', '.astro',
    '--exclude', '.git',
    '--exclude', '*.zip',
    `${SRC}/`,
    `${DEST}/`,
  ]);
}

async function installIfNeeded() {
  const hasNodeModules = existsSync(`${DEST}/node_modules`);
  if (hasNodeModules) return;
  console.log('[sandbox] Installing dependencies in /tmp/human-build (one-time)');
  await run('npm', ['install'], { cwd: DEST });
}

async function rsyncDistBack() {
  if (!existsSync(`${DEST}/dist`)) return;
  await run('rsync', [
    '-a',
    '--delete',
    `${DEST}/dist/`,
    `${SRC}/dist/`,
  ]);
}

console.log(`[sandbox] Mirroring ${SRC} -> ${DEST}`);
await rsyncIn();
await installIfNeeded();

// For dev, we want to exec-replace (Ctrl-C passes through). For build/check,
// we run then sync dist back.
if (astroCmd === 'dev') {
  await run('npx', ['astro', 'dev', ...astroArgs], { cwd: DEST });
} else {
  await run('npx', ['astro', astroCmd, ...astroArgs], { cwd: DEST });
  if (astroCmd === 'build') {
    console.log('[sandbox] Syncing dist/ back to source tree');
    await rsyncDistBack();
  }
}
