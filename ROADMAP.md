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
- [ ] #20 — `dot-blink` / `glitch-shake` animations not stopped by manual motion toggle (WCAG 2.2.2)
- [x] #21 — No `aria-live` region for filter results (WCAG 4.1.3)
- [ ] #22 — Filter row may overflow at 320px viewport (WCAG 1.4.10)
- [ ] #23 — Modal focus trap needs cross-browser verification (WCAG 2.4.3)

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
- [ ] Konami code Easter egg — `↑↑↓↓←→←→BA` triggers a cyberpunk secret (glitch screen, hidden message, or matrix rain)
- [ ] Custom cursor — glowing neon crosshair or dot following the mouse (desktop only)
- [ ] Typewriter effect on hero tagline — characters type in one by one, blinking cursor at end
- [ ] Click sound effects — subtle sci-fi UI blips on buttons, toggleable via existing settings panel

## Story & Authenticity
- [ ] "Currently learning" widget — small card in About section showing what you're studying right now (e.g. "Go · Backend basics")
- [x] Ukrainian flag accent — neon-treated 6px stripe at top of page (blue `#1a6fff` + yellow `#ffe135` with glow, sits above navbar)
- [ ] Project devlog line — one sentence per project card explaining what you learned building it

## Technical Flex
- [ ] Branded 404 page — "ACCESS DENIED" or "SIGNAL LOST" cyberpunk error page
- [ ] GitHub live stats — fetch real commit/repo count via GitHub API, display in About section
- [ ] Copy-email button — click to copy address, shows `[ COPIED ]` confirmation animation

## Discoverability / SEO
- [ ] `robots.txt` — basic crawl rules
- [ ] JSON-LD Person schema — helps Google understand who you are
- [ ] `sitemap.xml` — one file, better indexing

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
