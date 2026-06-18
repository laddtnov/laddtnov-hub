const FAQ = [
  {
    triggers: ['hello', 'hi', 'hey', 'sup', 'yo', 'greet', 'start', 'hola'],
    response: `HELLO, OPERATOR.\nI'm V-10026 — Vladyslav's AI agent.\nI can tell you about his skills, projects, background, or how to get in touch.\nWhat would you like to know?`,
  },
  {
    triggers: ['skill', 'tech', 'stack', 'language', 'know', 'use', 'html', 'css', 'javascript', 'go', 'react', 'vite', 'code', 'coding', 'program'],
    response: `TECH STACK ACCESSED:\n► HTML5 / CSS3 / JavaScript ES6+\n► Go (backend API)\n► React + Vite\n► Canvas API / Web Audio API\n► PWA / Service Workers\n► Deployed via Vercel + Fly.io`,
  },
  {
    triggers: ['project', 'work', 'built', 'made', 'build', 'game', 'app', 'portfolio'],
    response: `PROJECTS ON FILE:\n► Orrery — 3D solar system simulation\n► Breach OS — cyberpunk memory card game\n► Cogsworth — steampunk Sudoku PWA\n► Libra — book tracker with terminal UI\n► GrowFlow — personal finance dashboard\n► TimeFlow — React appointment tracker\n► Vitrum — glassmorphism chess\n\nUse the project filter above to explore them all.`,
  },
  {
    triggers: ['contact', 'reach', 'email', 'message', 'talk', 'connect', 'touch'],
    response: `CONTACT PROTOCOLS:\n► Email: novytskiyvladislav@proton.me\n► LinkedIn: vladyslav-novytskyi-32ab8b416\n► GitHub: @laddtnov\n\nOr use the contact form on this page.`,
  },
  {
    triggers: ['hire', 'hiring', 'available', 'job', 'work', 'freelance', 'role', 'opportunity', 'recruit', 'open'],
    response: `AVAILABILITY STATUS: OPEN\nVladyslav is open to frontend roles, freelance projects, and remote opportunities worldwide.\n\nBest way to reach out: use the contact form or email directly.`,
  },
  {
    triggers: ['cv', 'resume', 'download', 'pdf'],
    response: `CV AVAILABLE FOR DOWNLOAD.\nClick the "Download CV ↓" button in the nav bar at the top, or find it in the contact section below.`,
  },
  {
    triggers: ['who', 'about', 'vladyslav', 'laddtnov', 'background', 'story', 'yourself'],
    response: `SUBJECT FILE: VLADYSLAV NOVYTSKIY\n► Self-taught front-end developer from Ukraine 🇺🇦\n► Currently building a new life abroad\n► Coding since 2024 — hobby turned passion\n► Loves cyberpunk aesthetics, interactive UIs, and game dev\n► Everything in this portfolio was built for the love of it.`,
  },
  {
    triggers: ['ukraine', 'ukrainian', 'flag', 'kyiv', 'ua', '🇺🇦'],
    response: `ORIGIN: UKRAINE 🇺🇦\nVladyslav is from Ukraine and carries that identity with pride — you'll spot the blue and yellow stripe woven into the design of this very page.`,
  },
  {
    triggers: ['location', 'where', 'country', 'based', 'live', 'remote'],
    response: `LOCATION: Currently based abroad (originally from Ukraine 🇺🇦).\nFully remote — open to positions worldwide.`,
  },
  {
    triggers: ['experience', 'year', 'long', 'senior', 'junior', 'level', 'since'],
    response: `EXPERIENCE LEVEL:\nSelf-taught since 2024 — junior/mid level.\nSpecialises in vanilla JS, cyberpunk UIs, PWAs, and interactive web experiences.\nCurrently learning Go for backend work.`,
  },
  {
    triggers: ['link', 'github', 'linkedin', 'social', 'profile'],
    response: `SOCIAL LINKS:\n► GitHub: github.com/laddtnov\n► LinkedIn: in/vladyslav-novytskyi-32ab8b416\n► Live site: laddtnov.xyz`,
  },
];

const SUGGESTIONS = [
  'What are his skills?',
  'Show me projects',
  'Is he available to hire?',
  'How to contact?',
  'Who is Vladyslav?',
];

const FALLBACK = `QUERY NOT FOUND IN DATABASE.\nTry asking about skills, projects, contact info, availability, or background.\nOr use the contact form below to reach Vladyslav directly.`;

const GREETING = `SYSTEM ONLINE. V-10026 READY.\nI'm Vladyslav's AI agent — ask me about his skills, projects, or how to get in touch.`;

function matchFAQ(input) {
  const lower = input.toLowerCase();
  for (const entry of FAQ) {
    if (entry.triggers.some(t => lower.includes(t))) {
      return entry.response;
    }
  }
  return FALLBACK;
}

function createMsg(text, type) {
  const wrap = document.createElement('div');
  wrap.className = `agent-msg agent-msg--${type}`;

  const prefix = document.createElement('span');
  prefix.className = 'agent-msg__prefix';
  prefix.textContent = type === 'bot' ? 'V-10026' : 'YOU';

  const bubble = document.createElement('div');
  bubble.className = 'agent-msg__bubble';
  bubble.textContent = text;

  wrap.append(prefix, bubble);
  return wrap;
}

function createTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'agent-msg agent-msg--bot agent-typing';

  const bubble = document.createElement('div');
  bubble.className = 'agent-msg__bubble';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'agent-typing-dot';
    bubble.append(dot);
  }
  wrap.append(bubble);
  return wrap;
}

export function initAgent() {
  const widget   = document.getElementById('agent-widget');
  const toggle   = document.getElementById('agent-toggle');
  const panel    = document.getElementById('agent-panel');
  const closeBtn = document.getElementById('agent-close');
  const messages = document.getElementById('agent-messages');
  const input    = document.getElementById('agent-input');
  const sendBtn  = document.getElementById('agent-send');
  const suggs    = document.getElementById('agent-suggestions');

  if (!widget) return;

  let open = false;

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMsg(text, type) {
    const msg = createMsg(text, type);
    messages.append(msg);
    scrollBottom();
  }

  function botReply(text) {
    const typing = createTyping();
    messages.append(typing);
    scrollBottom();
    const jitter = (crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF) * 400;
    setTimeout(() => {
      typing.remove();
      addMsg(text, 'bot');
    }, 600 + jitter);
  }

  function clearSuggestions() {
    suggs.innerHTML = '';
  }

  function showSuggestions() {
    clearSuggestions();
    SUGGESTIONS.forEach(s => {
      const chip = document.createElement('button');
      chip.className = 'agent-chip';
      chip.textContent = s;
      chip.type = 'button';
      chip.addEventListener('click', () => {
        clearSuggestions();
        addMsg(s, 'user');
        botReply(matchFAQ(s));
      });
      suggs.append(chip);
    });
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    clearSuggestions();
    addMsg(text, 'user');
    botReply(matchFAQ(text));
  }

  function openPanel() {
    open = true;
    panel.setAttribute('open', '');
    document.body.classList.add('agent-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close AI agent chat');
    if (!messages.children.length) {
      addMsg(GREETING, 'bot');
      setTimeout(showSuggestions, 800);
    }
    setTimeout(() => input.focus(), 50);
  }

  function closePanel() {
    open = false;
    panel.removeAttribute('open');
    document.body.classList.remove('agent-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open AI agent chat');
    toggle.focus();
  }

  toggle.addEventListener('click', () => (open ? closePanel() : openPanel()));
  closeBtn.addEventListener('click', closePanel);

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
    if (e.key === 'Escape') closePanel();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closePanel();
  });
}
