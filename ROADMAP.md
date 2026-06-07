# Portfolio Roadmap

## Fix immediately
- [x] Replace LinkedIn placeholder URL — already set to `laddtnov`
- [x] Rewrite hero tagline — make it specific ("Crafting interactive experiences at the intersection of design and code.")
- [x] Delete `styles.css` at root — removed (8-line dead file, never linked)
- [x] Replace Formspree placeholder: activated with form ID `xojzejvr`

## Accessibility / WCAG fixes (tracked as GitHub issues)
- [x] #10 — Filter buttons missing `aria-pressed` state (WCAG 4.1.2)
- [x] #11 — Skill progress bars missing `role="progressbar"` + aria value attributes (WCAG 1.3.1)
- [x] #12 — "Inspect" buttons have no project-specific aria-label (WCAG 2.4.6)
- [x] #13 — Decorative arrow icons (→ ↓) in contact buttons not hidden from screen readers (WCAG 1.1.1)
- [x] #14 — `glitch-skew` navbar animation not stopped by manual motion toggle (WCAG 2.3.1)
- [x] #15 — `.project-metrics` colour at 60% opacity fails contrast for small text (WCAG 1.4.3)
- [x] #17 — `nav-toggle-bar` empty spans missing `aria-hidden` (WCAG 1.1.1)
- [x] #18 — `title-bracket` decorative `[` `]` spans not hidden from screen readers (WCAG 1.1.1)
- [x] #19 — Nav "Download CV ↓" arrow character read aloud (WCAG 1.1.1)
- [x] #20 — `dot-blink` / `glitch-shake` animations not stopped by manual motion toggle (WCAG 2.2.2)
- [x] #21 — No `aria-live` region for filter results (WCAG 4.1.3)
- [x] #22 — Filter row may overflow at 320px viewport — horizontal scroll at ≤360px (WCAG 1.4.10)
- [x] #23 — Modal focus trap — Tab/Shift+Tab trapped inside dialog, focus restored on close (WCAG 2.4.3)

## High recruiter impact
- [ ] Real project thumbnails — custom screenshots of each project, replace stock photos and placeholders
- [x] Libra thumbnail — redesigned as book tracker UI (open book, stats panel, bookshelf, bookmark ribbon)
- [x] About/bio section — rewritten to reflect genuine hobbyist background; removed hire/freelance framing
- [x] Hero photo or cyberpunk-styled avatar — SVG avatar created at `assets/avatar.svg`
- [x] Rewrite hero tagline to be specific to your stack and style

## High showcase impact
- [ ] Focus trap in project modal — tab should cycle inside the dialog, not behind it
- [x] `scroll-behavior: smooth` on `html` element
- [ ] Open Graph image — one good `og:image` screenshot; compress `Screenshot-1.png` (currently 684KB → target WebP < 100KB)
- [x] Favicon — `assets/favicon.svg` (neon-L on dark bg)
- [x] Project-specific overlay text — each project now shows its type (3D SIMULATION, BOOK TRACKER, CARD GAME, SUDOKU PWA, REACT APP, FINANCE TOOL, CHESS GAME)
- [x] Scroll entrance animations — IntersectionObserver fade-in on project tiles, skill categories, about section
- [x] "Latest" or "New" badge on the two most recent projects — TimeFlow and GrowFlow

## Polish & UX
- [x] Back-to-top button — shows after 400px scroll, fixed bottom-right
- [x] Project count badge next to each filter button (e.g. "TOOLS 4") — injected dynamically by JS
- [x] Replace skill progress bars with a badge/tag grid grouped by category (Languages, Frameworks & Tools, CSS & Design, Workflow)
- [x] Pause `cyber-grid` background animation when tab is not visible (Page Visibility API)
- [ ] Dark/light mode toggle (settings module is wired — could add a theme option)
- [x] Contact form — Formspree-powered form (replace YOUR_FORM_ID placeholder to activate)

## Performance
- [ ] Compress `Screenshot-1.png` (684KB) → WebP, used as og:image
- [ ] Consider making the portfolio itself PWA-installable (you already built Cogsworth as a PWA)

## Personality & Fun
- [x] Konami code Easter egg — `↑↑↓↓←→←→BA` triggers glitching "ACCESS GRANTED" overlay with personal message + Слава Україні
- [x] Custom cursor — neon cyan dot (desktop/fine-pointer only), enlarges to ring on interactive elements
- [x] Typewriter effect on hero tagline — types in at 36ms/char, blinking cursor stays; skipped under reduced motion
- [x] Click sound effects — Web Audio API synth blips, SOUND toggle added to settings panel (OFF by default)

## Story & Authenticity
- [x] "Currently learning" widget — purple card in About: JS Fundamentals · Arguments Objects & Rest Parameters · via freeCodeCamp
- [x] Ukrainian flag accent — neon-treated 6px stripe at top of page (blue `#1a6fff` + yellow `#ffe135` with glow, sits above navbar)
- [x] Project devlog line — monospace purple left-border line on every project card explaining what was learned

## Technical Flex
- [x] Branded 404 page — "SIGNAL LOST" cyberpunk error page with flickering 404, scanlines, UA stripe, `[ RETURN HOME ]` button
- [x] GitHub live stats — fetch repos, followers, total stars from GitHub API; shown in About section (hidden if API fails)
- [x] Copy-email button — clicks copies `novytskiyvladislav@proton.me`, shows `Copied!` in green for 2s then reverts

## Discoverability / SEO
- [ ] `robots.txt` — basic crawl rules
- [ ] JSON-LD Person schema — helps Google understand who you are
- [ ] `sitemap.xml` — one file, better indexing

## Content Depth (future projects)
- [ ] Individual project pages — dedicated `/projects/libra`, `/projects/cogsworth` etc. with full case study, screenshots, challenges, lessons learned
- [ ] "What I learned" section per project card — one honest sentence about the key skill gained
- [ ] Learning timeline — visual journey from first line of code to now; shows growth, not just results
- [ ] "What I'm building next" teaser — one card at the bottom of projects showing the upcoming idea; keeps portfolio feeling alive

## Personal Growth Tracking
- [ ] Skills progress over time — replace static badges with a simple "added in [year]" tag so visitors see you're still learning
- [ ] Achievements wall — small unlockable badges (e.g. "First PWA", "First Canvas project", "First React app"); fun and shows range
- [ ] Language toggle 🇺🇦 / 🇬🇧 — Ukrainian and English versions of bio and project descriptions

## Engagement & Community
- [ ] Devlog / blog section — short posts about what you built and why; even 3-4 posts makes a huge difference
- [ ] GitHub activity graph — embed real contribution graph or a styled equivalent; shows you code regularly
- [ ] Share button per project — copy link to that project's anchor; easy for visitors to share specific work

## Technical Maturity
- [ ] Error monitoring — Sentry free tier; know when something breaks in production
- [ ] CV / print mode — `@media print` stylesheet that renders a clean single-page CV from the portfolio content
- [ ] Automated Lighthouse CI — GitHub Action that runs Lighthouse on every PR and posts the score; keeps quality high as you add projects
- [ ] Go backend experiment — replace Formspree with a small self-written Go handler; shows full-stack ambition

## Completed
- [x] Modular CSS architecture
- [x] Project filter / sort / modal (explorer)
- [x] Event bus
- [x] Motion preference (OS-level + manual toggle)
- [x] CRT intensity toggle
- [x] Floating cyberpunk settings panel
- [x] Analytics (localStorage event recording)
- [x] Hero CTA buttons
- [x] Impact metrics on project cards
- [x] Content polish (Breach OS tags, Cogsworth title)
- [x] Custom domain links (vitrum.bynov.one, cogsworth.laddtnov.xyz)
- [x] Renamed Glass Chess → Vitrum, Breach Engine → Cogsworth
- [x] GrowFlow project added (finance tracker)
- [x] TimeFlow project added (React + Vite appointment tracker)
- [x] GEA776 replaced with TimeFlow
- [x] Mobile responsive — hamburger nav, touch targets, landscape breakpoint
- [x] PRODUCTIVITY filter category
- [x] README: Mobile badge, project descriptions, accurate file tree
