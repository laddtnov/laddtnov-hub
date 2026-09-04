// Run: node --test js/
//
// agent.js is a browser ES module and this repo deliberately has no package.json,
// so Node would treat a bare `.js` import as CommonJS. Loading the source through
// a data: URL imports it as ESM without adding a build step or renaming the file.
// agent.js has no imports of its own and no top-level DOM access, so this is safe.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// agent.js reads localStorage lazily inside functions, never at import, so a
// stub defined here is enough — no jsdom, no package.json.
const store = new Map();
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  clear: () => store.clear(),
};

const source = readFileSync(new URL('./agent.js', import.meta.url), 'utf8');
const { matchFAQ, answer, agentMisses } = await import(
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

test('an unanswered question is recorded, an answered one is not', () => {
  localStorage.clear();

  answer('What is your tech stack?');            // matches
  answer('what is your favourite pizza');        // does not

  const misses = agentMisses();
  assert.equal(misses.length, 1, 'only the unmatched question should be logged');
  assert.equal(misses[0].question, 'what is your favourite pizza');
  assert.equal(misses[0].count, 1);
});

test('repeat misses are counted, not appended, and sort by demand', () => {
  localStorage.clear();

  answer('do you do devops');
  answer('do you do devops');
  answer('do you do devops');
  answer('do you like kubernetes');

  const misses = agentMisses();
  assert.equal(misses.length, 2);
  assert.deepEqual(misses[0], { question: 'do you do devops', count: 3 }, 'most-asked first');
  assert.equal(misses[1].count, 1);
});

test('the log is bounded so it cannot grow without limit', () => {
  localStorage.clear();

  for (let i = 0; i < 200; i++) answer(`unanswerable question number ${i}`);

  assert.equal(agentMisses().length, 50, 'distinct questions are capped at MISS_LIMIT');
});

test('answer() still returns FALLBACK text on a miss', () => {
  localStorage.clear();
  assert.match(answer('completely unrelated gibberish'), /QUERY NOT FOUND IN DATABASE/);
});

test('a broken localStorage never breaks the reply', () => {
  const real = globalThis.localStorage;
  globalThis.localStorage = {
    getItem() { throw new Error('SecurityError: private mode'); },
    setItem() { throw new Error('QuotaExceededError'); },
  };
  try {
    assert.match(answer('something nobody asked'), /QUERY NOT FOUND/, 'reply must survive storage failure');
    assert.deepEqual(agentMisses(), [], 'reading a broken store yields an empty list, not a throw');
  } finally {
    globalThis.localStorage = real;
  }
});
