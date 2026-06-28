const FAQ = [
  {
    triggers: ['hello', 'hi', 'hey', 'sup', 'yo', 'greet', 'start', 'hola'],
    response: `HELLO, OPERATOR.\nI'm V-10026 — Vladyslav's AI agent.\nI can tell you about his skills, projects, background, or how to get in touch.\nWhat would you like to know?`,
  },
  {
    triggers: ['skill', 'tech', 'stack', 'know', 'use', 'html', 'css', 'javascript', 'code', 'coding', 'program'],
    response: `TECH STACK ACCESSED:\n► HTML5 / CSS3 (Advanced Animations)\n► JavaScript ES6+ (primary language)\n► Go — backend API on Fly.io\n► Canvas API / Web Audio API\n► UI/UX Design — Digital Illustration, Branding\n► Git / GitHub / Vercel\n► PWA / Service Workers`,
  },
  {
    triggers: ['react', 'vue', 'angular', 'framework', 'next', 'vite', 'webpack', 'bundler', 'build step'],
    response: `WHY NO FRAMEWORK?\nDeliberate choice to master fundamentals first.\nEvery animation, state update, and DOM operation in this portfolio is hand-written — that builds real understanding of what frameworks abstract away.\nReact is on the roadmap. The fundamentals aren't going anywhere.`,
  },
  {
    triggers: ['canvas', 'three', 'webgl', 'solar', 'orrery', '3d', 'three.js'],
    response: `WHY CANVAS OVER THREE.JS?\nOrrery is a top-down 2D orbital simulation — Three.js would add a heavy 3D scene graph for no visual gain.\nCanvas gives pixel-level control with zero overhead. Right tool, right job.`,
  },
  {
    triggers: ['go', 'golang', 'backend', 'node', 'express', 'api', 'server', 'fly', 'fly.io'],
    response: `WHY GO FOR THE BACKEND?\nGo compiles to a tiny binary, starts cold in milliseconds, and handles concurrency cleanly.\nThe contact API on Fly.io is a single binary with no runtime dependencies — perfect for a stateless JSON endpoint.`,
  },
  {
    triggers: ['vercel', 'deploy', 'host', 'hosting', 'cloud'],
    response: `DEPLOY ARCHITECTURE:\n► Frontend — Vercel (CDN edge, zero config, instant preview URLs)\n► Backend API — Fly.io (Go binary, Dublin region)\nSplit deploy keeps the frontend static and fast while the API scales independently.`,
  },
  {
    triggers: ['project', 'built', 'made', 'build', 'game', 'app', 'portfolio'],
    response: `PROJECTS ON FILE:\n► Orrery — HTML5 Canvas solar system with orbital mechanics & Fallout-style terminal\n► Breach OS — cyberpunk memory card game with mission system\n► Cogsworth — steampunk Sudoku PWA with survival mode\n► Libra — book tracker with progress metrics & genre categories\n► GrowFlow — personal finance dashboard with Chart.js\n► TimeFlow — React + Vite appointment tracker\n► Vitrum — glassmorphism chess with smooth drag\n\nUse the project filter above to explore them all.`,
  },
  {
    triggers: ['design', 'ui', 'ux', 'illustration', 'branding', 'visual', 'figma', 'aesthetic'],
    response: `DESIGN BACKGROUND:\nVladyslav has a formal UI/UX and Digital Illustration background — not just a developer who "does design".\n► UI/UX Design\n► Digital Illustration\n► Visual Ideation & Branding\nEvery project in this portfolio is designed from scratch — no templates, no Bootstrap.`,
  },
  {
    triggers: ['sysadmin', 'system admin', 'infrastructure', 'network', 'hardware', 'moscow', 'it admin', 'it background'],
    response: `IT / SYSADMIN BACKGROUND:\nJunior System Administrator at a Financial & Corporate Services firm in Moscow (2013–2016).\n► Administered enterprise IT systems under production pressure\n► Configured and maintained corporate infrastructure\n► Generated compliance reports and managed service documentation\nThat foundation makes debugging and infrastructure decisions second nature.`,
  },
  {
    triggers: ['experience', 'year', 'long', 'senior', 'junior', 'level', 'since', 'history', 'career'],
    response: `CAREER TIMELINE:\n► 2013–2016 — Junior Sysadmin, Financial & Corporate Services, Moscow\n► 2022–2025 — Social Support Assistant + web tooling, Germany\n► Nov 2025 — Started learning HTML & CSS\n► Mar 2026 — First project shipped\n► Nov 2025–present — Digital Designer & Frontend Developer, Remote\n\nEvery project is built from scratch — no templates, no copy-paste.`,
  },
  {
    triggers: ['social support', 'germany', 'community', 'support'],
    response: `GERMANY CHAPTER (2022–2025):\nSocial Support Assistant at a community services organisation.\nBeyond client-facing work, Vladyslav built internal language-management and administration web tools as a project assistant — frontend work inside a non-tech role.\nAlso where his German reached B2/C1.`,
  },
  {
    triggers: ['education', 'degree', 'university', 'bachelor', 'computer science', 'study', 'studied'],
    response: `EDUCATION:\nBachelor's Degree — Computer Science & Automated Systems\nMoscow · 2011–2016\n\nAdditional certifications (Ireland, 2026):\n► Safe Pass — SOLAS Ireland\n► Manual Handling\n► Food HACCP`,
  },
  {
    triggers: ['language', 'speak', 'multilingual', 'english', 'german', 'spanish', 'ukrainian', 'russian'],
    response: `LANGUAGES:\n► English — C1\n► German — B2/C1\n► Spanish — B1\n► Ukrainian — Native\n► Russian — Native\n\nFive languages. International experience in Germany and Ireland.`,
  },
  {
    triggers: ['certification', 'safe pass', 'certificate', 'solas', 'haccp', 'manual handling'],
    response: `CERTIFICATIONS (Ireland, 2026):\n► Safe Pass — SOLAS Ireland\n► Manual Handling\n► Food HACCP\n\nEarned while building a portfolio at night after arriving in Ireland. Adaptability over comfort.`,
  },
  {
    triggers: ['contact', 'reach', 'email', 'message', 'talk', 'connect', 'touch'],
    response: `CONTACT PROTOCOLS:\n► Email: novytskiyvladislav@proton.me\n► LinkedIn: vladyslav-novytskyi-32ab8b416\n► GitHub: @laddtnov\n\nOr use the contact form on this page.`,
  },
  {
    triggers: ['hire', 'hiring', 'available', 'job', 'freelance', 'role', 'opportunity', 'recruit', 'open'],
    response: `AVAILABILITY STATUS: OPEN\nVladyslav is open to frontend roles, freelance projects, and remote opportunities worldwide.\nPreferred: remote-first, creative or product-focused teams.\n\nBest route: contact form on this page or email directly.`,
  },
  {
    triggers: ['cv', 'resume', 'download', 'pdf'],
    response: `CV AVAILABLE FOR DOWNLOAD.\nClick the "Download CV ↓" button in the nav bar at the top, or find it in the contact section below.`,
  },
  {
    triggers: ['who', 'about', 'vladyslav', 'laddtnov', 'background', 'story', 'yourself'],
    response: `SUBJECT FILE: VLADYSLAV NOVYTSKIY\n► Frontend Developer & Digital Designer based in Drogheda, Ireland 🇮🇪\n► Ukrainian-born 🇺🇦 — carries that identity with pride\n► BSc Computer Science (Moscow, 2011–2016)\n► Former sysadmin turned digital designer turned frontend developer\n► Started HTML & CSS in November 2025 — first project shipped March 2026\n► Fluent in 5 languages`,
  },
  {
    triggers: ['ukraine', 'ukrainian', 'flag', '🇺🇦'],
    response: `ORIGIN: UKRAINE 🇺🇦\nVladyslav is from Ukraine — you'll find the blue and yellow stripe woven into the design of this very page. Identity embedded in the code.`,
  },
  {
    triggers: ['location', 'where', 'country', 'based', 'live', 'remote', 'ireland', 'drogheda'],
    response: `LOCATION: Drogheda, Co. Louth, Ireland 🇮🇪\nFully remote-capable. Open to positions worldwide.\nCurrently on Irish ground — available immediately.`,
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

const FALLBACK = `QUERY NOT FOUND IN DATABASE.\nTry asking about skills, projects, experience, education, languages, or background.\nOr use the contact form below to reach Vladyslav directly.`;

const GREETING = `SYSTEM ONLINE. V-10026 READY.\nI'm Vladyslav's AI agent — ask me about his skills, projects, or how to get in touch.`;

function matchFAQ(input) {
  const lower = input.toLowerCase();
  for (const entry of FAQ) {
    if (entry.triggers.some(t => lower.includes(t))) return entry.response;
  }
  return null;
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
        botReply(matchFAQ(s) || FALLBACK);
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
    botReply(matchFAQ(text) || FALLBACK);
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
