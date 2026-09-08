// Run: node --test csp.test.mjs
//
// The CSP in vercel.json allows the one executable inline script in index.html
// by SHA-256 hash. Editing that script — even its whitespace — invalidates the
// hash, and the browser then blocks it silently: the page still renders, it just
// flashes the wrong theme before settings.js catches up. This test turns that
// silent failure into a loud one.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const config = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'));

const csp = config.headers
  .flatMap((rule) => rule.headers)
  .find((header) => header.key === 'Content-Security-Policy').value;

// Executable inline scripts only. <script type="application/ld+json"> is data,
// never executed, and browsers do not apply script-src to it — verified in a
// browser, where a deliberately wrong hash reported exactly one violation.
function executableInlineScripts(source) {
  return [...source.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => !/type\s*=\s*["'](?!text\/javascript)/i.test(attrs))
    .map(([, , body]) => body);
}

const sha256 = (body) => `sha256-${createHash('sha256').update(body).digest('base64')}`;

test('every executable inline script is allowed by a hash in the CSP', () => {
  const scripts = executableInlineScripts(html);
  assert.ok(scripts.length > 0, 'expected at least one inline script to guard');

  for (const body of scripts) {
    const hash = sha256(body);
    assert.ok(
      csp.includes(hash),
      `index.html contains an inline script the CSP does not allow.\n` +
        `Add this to script-src in vercel.json:\n  '${hash}'\n` +
        `Script starts: ${body.trim().slice(0, 70)}…`
    );
  }
});

test('the CSP carries no hash for a script that no longer exists', () => {
  const live = new Set(executableInlineScripts(html).map(sha256));
  // capture group, not match[0] — match[0] would include the surrounding quotes
  for (const [, hash] of csp.matchAll(/'(sha256-[A-Za-z0-9+/=]+)'/g)) {
    assert.ok(live.has(hash), `stale hash in vercel.json, no inline script matches: ${hash}`);
  }
});

test('the policy still covers every origin the site talks to', () => {
  // Derived from a real page load: the CDN stylesheet, the GitHub stats fetch,
  // the contact API, and the contribution-chart image.
  const required = [
    ['style-src', 'https://cdn.jsdelivr.net'],
    ['connect-src', 'https://api.github.com'],
    ['connect-src', 'https://laddtnov-hub-contact.fly.dev'],
    ['img-src', 'https://ghchart.rshah.org'],
  ];
  for (const [directive, origin] of required) {
    const section = csp.split(';').map((s) => s.trim()).find((s) => s.startsWith(directive));
    assert.ok(section, `${directive} missing from the CSP`);
    assert.ok(section.includes(origin), `${directive} must allow ${origin}`);
  }
});

test('the contact API origin matches what contact.js actually calls', () => {
  const contactJs = readFileSync(new URL('./js/contact.js', import.meta.url), 'utf8');
  const origin = new URL(contactJs.match(/const API_URL = '([^']+)'/)[1]).origin;
  assert.ok(csp.includes(origin), `connect-src must allow ${origin}, the API contact.js posts to`);
});

test('the dangerous escapes are absent from script-src', () => {
  const scriptSrc = csp.split(';').map((s) => s.trim()).find((s) => s.startsWith('script-src'));
  assert.ok(!scriptSrc.includes("'unsafe-inline'"), "script-src must not fall back to 'unsafe-inline'");
  assert.ok(!scriptSrc.includes("'unsafe-eval'"), "script-src must not allow 'unsafe-eval'");
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /frame-ancestors 'none'/);
});
