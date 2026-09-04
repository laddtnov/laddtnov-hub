// Run: node --test js/
//
// agent.js is a browser ES module and this repo deliberately has no package.json,
// so Node would treat a bare `.js` import as CommonJS. Loading the source through
// a data: URL imports it as ESM without adding a build step or renaming the file.
// agent.js has no imports of its own and no top-level DOM access, so this is safe.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./agent.js', import.meta.url), 'utf8');
const { matchFAQ } = await import(
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
);

const firstLine = (answer) => answer?.split('\n')[0] ?? null;

// The bug this file exists to catch: "yo" matched inside "you"/"your" and "hi"
// inside "ethic", so the greeting entry answered almost every question.
test('a question containing "you" does not get the greeting', () => {
  for (const question of [
    'Do you know React?',
    'Where do you live?',
    'How do I contact you?',
    'Are you available for hire?',
    'Do you have a good work ethic?',
  ]) {
    assert.doesNotMatch(
      firstLine(matchFAQ(question)) ?? '',
      /HELLO, OPERATOR/,
      `"${question}" was hijacked by the greeting entry`
    );
  }
});

test('questions route to the right entry', () => {
  const cases = [
    ['What is your tech stack?', /TECH STACK/],
    ['Do you know React?', /WHY NO FRAMEWORK/],
    ['Are you available for hire?', /AVAILABILITY STATUS/],
    ['Can I see your CV?', /CV AVAILABLE/],
    ['How do I contact you?', /CONTACT PROTOCOLS/],
    ['Tell me about your education', /EDUCATION/],
    ['What projects have you built?', /PROJECTS ON FILE/],
  ];
  for (const [question, expected] of cases) {
    assert.match(firstLine(matchFAQ(question)) ?? '', expected, `wrong entry for "${question}"`);
  }
});

test('actual greetings still reach the greeting entry', () => {
  for (const greeting of ['hello', 'hi', 'hey there', 'yo', 'Hi!']) {
    assert.match(firstLine(matchFAQ(greeting)) ?? '', /HELLO, OPERATOR/, `"${greeting}" should greet`);
  }
});

test('multi-word triggers still match as a phrase', () => {
  assert.match(firstLine(matchFAQ('what was your system admin role?')) ?? '', /IT \/ SYSADMIN/);
});

test('unknown input falls through to null so the caller can use FALLBACK', () => {
  assert.equal(matchFAQ('what is the airspeed velocity of an unladen swallow'), null);
});
