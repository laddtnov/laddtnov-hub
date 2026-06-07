# Laddtnov Portfolio

Cyberpunk-style front-end portfolio built with semantic HTML5, modular CSS, and vanilla JavaScript (ES modules). Features a project explorer, interactive settings panel, Konami Easter egg, Web Audio synth sounds, and a custom neon cursor — all without a single framework.

[![Live Demo](https://img.shields.io/badge/Live-laddtnov.xyz-00f2ff?style=for-the-badge&logo=vercel&logoColor=000000)](https://laddtnov.xyz/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=000000)](https://developer.mozilla.org/docs/Web/JavaScript)
[![WCAG](https://img.shields.io/badge/WCAG-AA%20Improved-ff00ff?style=for-the-badge)](https://www.w3.org/WAI/)
[![Mobile](https://img.shields.io/badge/Mobile-Responsive-00f2ff?style=for-the-badge)](https://developer.mozilla.org/docs/Web/CSS/CSS_media_queries)
[![SEO](https://img.shields.io/badge/SEO-JSON--LD%20%2B%20Sitemap-9d00ff?style=for-the-badge)](https://schema.org/)
[![No Framework](https://img.shields.io/badge/Framework-None-ff00ff?style=for-the-badge)](https://laddtnov.xyz/)
[![Web Audio](https://img.shields.io/badge/Web%20Audio-API%20Synth-9d00ff?style=for-the-badge)](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
[![Self-Hosted Fonts](https://img.shields.io/badge/Fonts-Self--Hosted%20woff2-00f2ff?style=for-the-badge)](https://developer.mozilla.org/docs/Web/CSS/@font-face)
[![Scroll Progress](https://img.shields.io/badge/Scroll-Progress%20Bar-ff00ff?style=for-the-badge)](https://laddtnov.xyz/)
[![Easter Egg](https://img.shields.io/badge/Easter%20Egg-Konami%20Code-9d00ff?style=for-the-badge)](https://laddtnov.xyz/)
[![404](https://img.shields.io/badge/404-Branded%20Page-00f2ff?style=for-the-badge)](https://laddtnov.xyz/404)

![Portfolio Hero](docs/screenshots/hero.png)

## Live

→ **[laddtnov.xyz](https://laddtnov.xyz/)**

## Features

### UI & Aesthetics
- Neon glow, glitch accents, CRT scanlines, and a cyber-grid background
- Ukrainian flag stripe at the top — a subtle piece of identity
- Fully responsive: hamburger nav, touch targets, 320px → 4K
- Custom neon cursor (desktop only) — enlarges to ring on interactive elements
- Typewriter effect on hero tagline; skips under `prefers-reduced-motion`
- CRT intensity, motion level, and sound toggles in a floating settings panel

### Project Explorer
- Filter by category (Games / Tools / Productivity / Experiments) with live counts
- Sort by newest / oldest / name
- Inspect modal with project details, tech stack, and live link
- Full keyboard focus trap inside modal (WCAG 2.4.3)
- `aria-live` region announces filter results to screen readers

### Personality
- **Konami Easter egg** — `↑↑↓↓←→←→BA` triggers a glitching "ACCESS GRANTED" overlay
- **Web Audio synth sounds** — no audio files; pure `OscillatorNode` blips per interaction
- **Copy-email button** — copies `novytskiyvladislav@proton.me`, shows `Copied!` in green for 2s

### Technical
- Branded `404.html` — "SIGNAL LOST" with flickering code, scanlines, and UA flag stripe
- GitHub live stats pulled from the API (repos / followers / stars) shown in About
- JSON-LD Person schema, `robots.txt`, and `sitemap.xml` for SEO
- Self-hosted fonts (`assets/fonts/`) — no Google Fonts dependency
- OG image compressed from 672KB PNG → 13.7KB WebP (48× smaller)
- Lazy-loaded project thumbnails with async decoding

### Accessibility (WCAG)
- `aria-pressed` on filter buttons, `aria-live` on filter results
- `prefers-reduced-motion` respected at OS and manual toggle levels
- Focus trap in project modal; focus restored to trigger on close
- `<fieldset>` + `<legend>` for all button groups
- Reduced-motion disables `dot-blink`, `glitch-shake`, and typewriter

## Stack

| Layer | Tech |
|-------|------|
| Markup | HTML5 (semantic, ARIA) |
| Styles | CSS3 (modular files, custom properties) |
| Logic | Vanilla JS (ES modules, event bus) |
| Fonts | Self-hosted woff2 — Orbitron, Rajdhani, Share Tech Mono |
| Audio | Web Audio API (`OscillatorNode`, `GainNode`) |
| Data | GitHub REST API, localStorage analytics |
| Deploy | Netlify / custom domain |

## Project Structure

```
laddtnov-hub/
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── base.css          # CSS variables + @font-face
│   ├── navbar.css
│   ├── welcome.css
│   ├── about.css
│   ├── projects.css
│   ├── skills.css
│   ├── contact.css
│   ├── components.css    # cursor, typewriter, easter egg, settings
│   └── responsive.css
├── js/
│   ├── main.js           # boot order
│   ├── events.js         # event bus
│   ├── motion.js         # prefers-reduced-motion
│   ├── ui.js             # typewriter, cursor, GitHub stats, copy-email
│   ├── projects.js       # explorer: filter, sort, modal, focus trap
│   ├── settings.js       # CRT / motion / sound toggles
│   ├── easter-egg.js     # Konami code overlay
│   ├── sounds.js         # Web Audio synth blips
│   └── analytics.js      # localStorage event recording
├── assets/
│   ├── avatar.svg
│   ├── favicon.svg
│   ├── og-image.webp     # 1200×630, 13.7 KB
│   ├── fonts/            # self-hosted woff2
│   │   ├── orbitron.woff2
│   │   ├── rajdhani-300.woff2
│   │   ├── rajdhani-400.woff2
│   │   ├── rajdhani-600.woff2
│   │   └── share-tech-mono.woff2
│   └── thumbnails/
│       ├── solar-system-thumb.svg
│       ├── libra-thumb.svg
│       ├── growflow-thumb.svg
│       ├── timeflow-thumb.svg
│       └── glass-chess-thumb.svg
└── docs/
    └── screenshots/
        └── hero.png
```

## Featured Projects

| Project | Type | Description | Link |
|---------|------|-------------|------|
| **Orrery** | 3D Simulation | Solar system with Fallout-style terminal and positional audio | [orrery.laddtnov.xyz](https://orrery.laddtnov.xyz/) |
| **Libra** | Tool | Book tracker with terminal UI, progress stats, and reading streaks | [libra.laddtnov.xyz](https://libra.laddtnov.xyz/) |
| **Breach OS** | Game | Cyberpunk memory card game with missions and neon effects | [breachos.laddtnov.xyz](https://breachos.laddtnov.xyz/) |
| **Cogsworth** | Game | Steampunk Sudoku with rank system, survival mode, and PWA install | [cogsworth.laddtnov.xyz](https://cogsworth.laddtnov.xyz/) |
| **GrowFlow** | Tool | Personal finance tracker with Chart.js dashboard | [growflow.laddtnov.xyz](https://growflow.laddtnov.xyz/) |
| **TimeFlow** | Productivity | React + Vite appointment tracker with weekly calendar view | [timeflow.laddtnov.xyz](https://timeflow.laddtnov.xyz/) |
| **Vitrum** | Game | Glassmorphism chess with smooth drag animations | [vitrum.bynov.one](https://vitrum.bynov.one/) |

## Quick Start

```bash
git clone https://github.com/laddtnov/laddtnov-hub.git
cd laddtnov-hub
open index.html   # or use Live Server in your editor
```

No build step. No dependencies. No `node_modules`.

## Contact

- GitHub: [@laddtnov](https://github.com/laddtnov)
- LinkedIn: [linkedin.com/in/laddtnov](https://www.linkedin.com/in/laddtnov/)
- Email: [novytskiyvladislav@proton.me](mailto:novytskiyvladislav@proton.me)
