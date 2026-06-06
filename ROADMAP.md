# Portfolio Roadmap

## Fix immediately
- [ ] Replace LinkedIn placeholder URL (`linkedin.com/in/yourprofile` → real profile)
- [ ] Rewrite hero tagline — make it specific ("Front-end dev specializing in interactive UI and game-style experiences")
- [ ] Delete `styles.css` at root — dead file, not linked anywhere

## Accessibility / WCAG fixes (tracked as GitHub issues)
- [x] #10 — Filter buttons missing `aria-pressed` state (WCAG 4.1.2)
- [x] #11 — Skill progress bars missing `role="progressbar"` + aria value attributes (WCAG 1.3.1)
- [x] #12 — "Inspect" buttons have no project-specific aria-label (WCAG 2.4.6)
- [x] #13 — Decorative arrow icons (→ ↓) in contact buttons not hidden from screen readers (WCAG 1.1.1)
- [x] #14 — `glitch-skew` navbar animation not stopped by manual motion toggle (WCAG 2.3.1)
- [x] #15 — `.project-metrics` colour at 60% opacity fails contrast for small text (WCAG 1.4.3)
- [ ] #17 — `nav-toggle-bar` empty spans missing `aria-hidden` (WCAG 1.1.1)
- [ ] #18 — `title-bracket` decorative `[` `]` spans not hidden from screen readers (WCAG 1.1.1)
- [ ] #19 — Nav "Download CV ↓" arrow character read aloud (WCAG 1.1.1)
- [ ] #20 — `dot-blink` / `glitch-shake` animations not stopped by manual motion toggle (WCAG 2.2.2)
- [ ] #21 — No `aria-live` region for filter results (WCAG 4.1.3)
- [ ] #22 — Filter row may overflow at 320px viewport (WCAG 1.4.10)
- [ ] #23 — Modal focus trap needs cross-browser verification (WCAG 2.4.3)

## High recruiter impact
- [ ] Real project thumbnails — custom screenshots of each project, replace stock photos and placeholders
- [ ] About/bio section — 2-3 sentences between hero and projects: who you are, what you build, what you're looking for
- [ ] Hero photo or cyberpunk-styled avatar — makes the site feel personal, not generic
- [ ] Rewrite hero tagline to be specific to your stack and style

## High showcase impact
- [ ] Focus trap in project modal — tab should cycle inside the dialog, not behind it
- [ ] `scroll-behavior: smooth` on `html` element
- [ ] Open Graph image — one good `og:image` screenshot; compress `Screenshot-1.png` (currently 684KB → target WebP < 100KB)
- [ ] Favicon — missing from repo
- [ ] Project-specific overlay text — replace generic "TERMINAL READY" with something meaningful per project (e.g. "REACT APP", "PWA", "VANILLA JS")
- [ ] Scroll entrance animations — staggered fade-in on projects/skills as they enter viewport
- [ ] "Latest" or "New" badge on the two most recent projects

## Polish & UX
- [ ] Back-to-top button — useful after scrolling through 7 project cards on mobile
- [ ] Project count badge next to each filter button (e.g. "TOOLS (4)")
- [ ] Replace skill progress bars with a badge/tag grid grouped by category (Languages, Frameworks, Tools) — progress % without context is misleading
- [ ] Pause `cyber-grid` background animation when tab is not visible (Page Visibility API) — saves battery
- [ ] Dark/light mode toggle (settings module is wired — could add a theme option)
- [ ] Contact form — lower friction for recruiters than mailto link

## Performance
- [ ] Compress `Screenshot-1.png` (684KB) → WebP, used as og:image
- [ ] Consider making the portfolio itself PWA-installable (you already built Cogsworth as a PWA)

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
