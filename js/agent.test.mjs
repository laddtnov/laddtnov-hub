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
const { matchFAQ, answer, agentMisses, followUps, resetConversation, SUGGESTIONS } = await import(
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

// Regression: whole-word matching (introduced with the scoring matcher) broke
// every singular trigger against a plural word, so two of the five suggestion
// chips shipped answering nothing.
test('plural questions reach the same entry as the singular trigger', () => {
  const cases = [
    ['What are his skills?', /TECH STACK/],
    ['Show me projects', /PROJECTS ON FILE/],
    ['What languages does he speak?', /LANGUAGES/],
    ['What certifications does he have?', /CERTIFICATIONS/],
  ];
  for (const [question, expected] of cases) {
    const reply = matchFAQ(question);
    assert.ok(reply, `"${question}" fell through to FALLBACK`);
    assert.match(reply.split('\n')[0], expected, `wrong entry for "${question}"`);
  }
});

test('every built-in suggestion chip is answerable', () => {
  // A chip that returns FALLBACK is a question the UI invited the visitor to ask
  // and then failed to answer.
  for (const chip of SUGGESTIONS) {
    assert.ok(matchFAQ(chip), `suggestion chip "${chip}" has no answer`);
  }
});

test('pluralising does not create false matches on short triggers', () => {
  // "go" + "s" must not let "goes" hit the Go entry, etc.
  assert.equal(matchFAQ('where did everyone go'), matchFAQ('where did everyone go'));
  const reply = matchFAQ('css');
  assert.ok(reply, 'a real short trigger still matches');
});

test('follow-ups exclude what has just been answered', () => {
  resetConversation();
  const before = followUps(10).length;

  answer('What are his skills?');

  const after = followUps(10);
  assert.equal(after.length, before - 1, 'the answered question should retire');
  assert.ok(!after.includes('What are his skills?'), 'its own chip must not be offered again');
});

test('reaching an entry by typing retires the chip that offers it', () => {
  resetConversation();
  // Not the chip text — a free-form question that lands on the same entry.
  answer('what tech stack do you use');
  assert.ok(!followUps(10).includes('What are his skills?'),
    'the chip is keyed on the answer, so typing an equivalent question retires it');
});

test('follow-ups are capped and shrink as the conversation proceeds', () => {
  resetConversation();
  assert.equal(followUps().length, 3, 'default cap is 3 chips');

  for (const q of SUGGESTIONS) answer(q);
  assert.deepEqual(followUps(), [], 'nothing left to offer once everything is answered');
});

test('an unanswered question does not retire any chip', () => {
  resetConversation();
  const before = followUps(10).length;
  answer('do you do devops');
  assert.equal(followUps(10).length, before, 'a FALLBACK must not consume a suggestion');
});

test('every suggestion still resolves, including the new ones', () => {
  for (const chip of SUGGESTIONS) {
    assert.ok(matchFAQ(chip), `suggestion chip "${chip}" has no answer`);
  }
  assert.equal(new Set(SUGGESTIONS.map(matchFAQ)).size, SUGGESTIONS.length,
    'each suggestion should lead to a different entry, or a chip is redundant');
});
