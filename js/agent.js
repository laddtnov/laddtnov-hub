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
    triggers: ['react', 'vue', 'angular', 'framework', 'next', 'vite', 'webpack', 'bundler', 'build step', 'why not'],
    response: `WHY NO FRAMEWORK?\nDeliberate choice to master fundamentals first.\nEvery animation, state update, and DOM operation in this portfolio is hand-written — that builds real understanding of what frameworks abstract away.\nReact is on the roadmap. The fundamentals aren't going anywhere.`,
  },
  {
    triggers: ['canvas', 'three', 'webgl', 'solar', 'orrery', '3d', 'three.js'],
    response: `WHY CANVAS OVER THREE.JS?\nOrrery is a top-down 2D orbital simulation — Three.js would be architectural overkill with a significant bundle cost for no visual gain.\nCanvas gives pixel-level control with zero overhead. Right tool, right job — not the most impressive-sounding one.`,
  },
  {
    triggers: ['go', 'golang', 'backend', 'node', 'express', 'api', 'server', 'fly', 'fly.io'],
    response: `WHY GO FOR THE BACKEND?\nGo compiles to a tiny binary, starts cold in milliseconds, and handles concurrency without an event loop to reason about.\nThe contact API on Fly.io is a single binary with no runtime dependencies. For a stateless JSON endpoint that sends email, that's the right call.`,
  },
  {
    triggers: ['vercel', 'deploy', 'host', 'hosting', 'netlify', 'cloud'],
    response: `DEPLOY ARCHITECTURE:\n► Frontend — Vercel (CDN edge, zero config, instant preview URLs)\n► Backend API — Fly.io (Go binary, Dublin region, ~15ms latency)\nSplit deploy keeps the frontend static and fast while the API scales independently.`,
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
    response: `CAREER TIMELINE:\n► 2013–2016 — Junior Sysadmin, Financial & Corporate Services, Moscow\n► 2022–2025 — Social Support Assistant + web tooling, Germany\n► Nov 2025–present — Digital Designer & Frontend Developer, Remote\n\nFrontend since 2024. Every project is built from scratch — no templates, no copy-paste.`,
  },
  {
    triggers: ['social support', 'germany', 'community', 'support', 'non-tech'],
    response: `GERMANY CHAPTER (2022–2025):\nSocial Support Assistant at a community services organisation.\nBeyond client-facing work, Vladyslav built internal language-management and administration web tools as a project assistant — frontend work inside a non-tech role.\nAlso where his German reached B2/C1.`,
  },
  {
    triggers: ['education', 'degree', 'university', 'bachelor', 'computer science', 'study', 'studied'],
    response: `EDUCATION:\nBachelor's Degree — Computer Science & Automated Systems\nMoscow · 2011–2016\n\nAdditional certifications (Ireland, 2026):\n► Safe Pass — SOLAS Ireland\n► Manual Handling\n► Food HACCP`,
  },
  {
    triggers: ['language', 'speak', 'multilingual', 'english', 'german', 'spanish', 'ukrainian', 'russian'],
    response: `LANGUAGES:\n► English — C1\n► German — B2/C1\n► Spanish — B1\n► Ukrainian — Native\n► Russian — Native\n\nFive languages. International experience in Germany and Ireland. Fluency in English and German is production-ready.`,
  },
  {
    triggers: ['certification', 'safe pass', 'certificate', 'solas', 'haccp', 'manual handling'],
    response: `CERTIFICATIONS (Ireland, 2026):\n► Safe Pass — SOLAS Ireland\n► Manual Handling\n► Food HACCP\n\nThese were earned while building a portfolio at night after arriving in Ireland with no local track record. Adaptability over comfort.`,
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
    response: `SUBJECT FILE: VLADYSLAV NOVYTSKIY\n► Frontend Developer & Digital Designer based in Drogheda, Ireland 🇮🇪\n► Ukrainian-born 🇺🇦 — carries that identity with pride\n► BSc Computer Science (Moscow, 2011–2016)\n► Former sysadmin turned digital designer turned frontend developer\n► Fluent in 5 languages\n► Building cyberpunk UIs and interactive experiences from scratch`,
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

/* ── Employer interview mode ─────────────────────────────── */

const CHALLENGES = [
  {
    question: `You list JavaScript as "Learning" on your CV.\nThat's not exactly confidence-inspiring for a production role.\nMake your case.`,
    answer: `Fair challenge.\n"Learning" is honest — I've been writing JavaScript for under two years. But in that time I've shipped 7 projects from scratch: a real-time orbital simulation, a finance dashboard, a chess engine, a book tracker.\nNo framework doing the heavy lifting. Every DOM update, every event, every state change — hand-written.\nI'd rather be honest about my timeline than inflate it and waste your time.`,
  },
  {
    question: `Your portfolio has zero React. Most of our job listings require it.\nWhy should we even be having this conversation?`,
    answer: `Because I understand *why* React exists, not just how to use it.\nI've managed state, reconciled UI with data, and handled async flows — without a framework to do it for me. That's the harder skill.\nReact syntax takes a week. Understanding the problems it solves takes much longer. I've already done the hard part.\nI'm also actively learning it — TimeFlow in the portfolio is React + Vite.`,
  },
  {
    question: `Sysadmin in Moscow. Social support in Germany. Frontend developer in Ireland.\nThat's three completely different careers. How do we know you won't pivot again in 18 months?`,
    answer: `Each chapter built on the last — it wasn't random.\nSysadmin gave me infrastructure thinking, debugging under pressure, and discipline.\nGermany forced fluency in two more languages and cultural adaptability.\nFrontend is where all of it converges: technical problem-solving, visual design, and communication.\nThis isn't a pivot — it's a convergence. I'm not done building.`,
  },
  {
    question: `You built your solar system in Canvas instead of Three.js.\nEvery serious 3D project uses Three.js or WebGL. Doesn't that show a gap in your toolkit?`,
    answer: `Orrery is a top-down 2D orbital simulation.\nThree.js is a 3D scene graph — it would add a 600KB dependency and a full render pipeline to a project that never needs a Z axis.\nChoosing Three.js there would show I reach for brand names, not solutions.\nIf the brief calls for 3D, I'll use Three.js. This brief didn't.`,
  },
  {
    question: `No Webpack, no Vite, no build step on this portfolio.\nThat's not how professional teams ship. Isn't this just avoiding complexity you don't know?`,
    answer: `The opposite. I know what a build step does — I chose not to add one where it adds no value.\nThis portfolio is static HTML, CSS, and ES modules. No transpilation needed. No dependency graph to maintain. Instant deploy, zero config drift, nothing to break in CI.\nWhen a project needs a build step — like TimeFlow with JSX — it has one. I match the tool to the problem.`,
  },
  {
    question: `You have 2 years of frontend experience.\nI can hire someone with 5. Give me one reason not to.`,
    answer: `Two years of deliberate, from-scratch practice versus five years of working inside a framework that makes decisions for you.\nEvery project in this portfolio is auditable — you can read every line and ask me why it's there.\nI can't give you five years. I can give you someone who understands the fundamentals, ships clean code, and has crossed cultural and linguistic barriers most candidates haven't.\nWhat specifically are you trying to de-risk?`,
  },
  {
    question: `Your CV shows Safe Pass and Food HACCP certifications.\nThat's not what I expect to see on a developer's CV.\nExplain yourself.`,
    answer: `I arrived in Ireland without a local portfolio or network.\nI took whatever work was available while building projects every night and weekend.\nThose certifications show one thing: I don't wait for ideal conditions. I adapt, I execute, and I build in parallel.\nThat's exactly the attitude you want in a junior developer on a deadline.`,
  },
  {
    question: `Last question. Why this portfolio? Why the cyberpunk aesthetic, the neon glows, the terminal fonts?\nDoes this actually reflect how you'd work on a real product team?`,
    answer: `It reflects how I think about craft.\nThe aesthetic is intentional — every choice from the scanlines to the CSS variables is documented and deliberate. This portfolio is the spec and the implementation at the same time.\nOn a product team I'd match the design system and follow the constraints. But you'd get a developer who thinks about *why* every visual and interaction decision exists, not just whether it builds.\nThe aesthetic is mine. The discipline is transferable.`,
  },
];

const SUGGESTIONS = [
  'What are his skills?',
  'Show me projects',
  'Is he available to hire?',
  'How to contact?',
  'Who is Vladyslav?',
];

const FALLBACK = `QUERY NOT FOUND IN DATABASE.\nTry asking about skills, projects, experience, education, languages, or background.\nOr type "challenge me" to enter employer interview mode.`;

const GREETING = `SYSTEM ONLINE. V-10026 READY.\nI'm Vladyslav's AI agent — ask me about his skills, projects, or how to get in touch.\nType "challenge me" if you want to interview him directly.`;

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
  prefix.textContent = type === 'bot' ? 'V-10026' : type === 'employer' ? 'EMPLOYER' : 'YOU';

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
  let interviewMode = false;
  let challengeIndex = 0;

  function rand() {
    return crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMsg(text, type) {
    const msg = createMsg(text, type);
    messages.append(msg);
    scrollBottom();
  }

  function botReply(text, type = 'bot') {
    const typing = createTyping();
    messages.append(typing);
    scrollBottom();
    const delay = 600 + rand() * 400;
    setTimeout(() => {
      typing.remove();
      addMsg(text, type);
    }, delay);
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

    const challengeChip = document.createElement('button');
    challengeChip.className = 'agent-chip agent-chip--challenge';
    challengeChip.textContent = 'CHALLENGE ME →';
    challengeChip.type = 'button';
    challengeChip.addEventListener('click', () => {
      clearSuggestions();
      startInterview();
    });
    suggs.append(challengeChip);
  }

  function startInterview() {
    interviewMode = true;
    challengeIndex = 0;
    botReply(
      `SWITCHING TO EMPLOYER MODE.\nI'll ask you the hard questions. Answer for Vladyslav.\nYou have ${CHALLENGES.length} challenges ahead. Let's begin.`
    );
    setTimeout(fireNextChallenge, 1400 + rand() * 400);
  }

  function fireNextChallenge() {
    if (challengeIndex >= CHALLENGES.length) {
      interviewMode = false;
      botReply(`INTERVIEW COMPLETE.\nAll ${CHALLENGES.length} challenges passed.\nImpressed? Use the contact form or email Vladyslav directly.`);
      setTimeout(showSuggestions, 900);
      return;
    }
    const challenge = CHALLENGES[challengeIndex];
    botReply(challenge.question, 'employer');
  }

  function handleInterviewReply() {
    if (challengeIndex >= CHALLENGES.length) return;
    const answer = CHALLENGES[challengeIndex].answer;
    challengeIndex++;
    setTimeout(() => {
      botReply(answer);
      if (challengeIndex < CHALLENGES.length) {
        setTimeout(fireNextChallenge, 1200 + rand() * 600);
      } else {
        setTimeout(() => {
          interviewMode = false;
          botReply(`INTERVIEW COMPLETE.\nAll ${CHALLENGES.length} challenges passed.\nImpressed? Use the contact form or email Vladyslav directly.`);
          setTimeout(showSuggestions, 900);
        }, 1000);
      }
    }, 800 + rand() * 400);
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    clearSuggestions();
    addMsg(text, 'user');

    const lower = text.toLowerCase();

    if (!interviewMode && (lower.includes('challenge') || lower.includes('interview') || lower.includes('test me') || lower.includes('hard question'))) {
      startInterview();
      return;
    }

    if (interviewMode) {
      handleInterviewReply();
      return;
    }

    const faqMatch = matchFAQ(text);
    botReply(faqMatch || FALLBACK);
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
