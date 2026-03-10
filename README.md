# Tododolix

Tododolix is a ToDo app with **two product surfaces in one repository**:
- `desktop`: optimized for mouse workflows, wider layouts, and focused planning
- `mobile`: optimized for quick capture and on-the-go usage

Both versions share the same core behavior (task model, status flow, reminder logic), but use platform-specific UI.

## Product Intention

The project is built around three principles:
1. **Fast task flow**: capture, prioritize, execute, archive.
2. **One repo, two UXs**: desktop and mobile can evolve independently without splitting codebases.
3. **User-first control**: avoid over-automation and keep important decisions in user hands.

## Architecture

- `src-desktop/` Desktop Angular app source
- `src-mobile/` Mobile Angular app source
- `site/` Landing page + `/app` auto device redirect
- `electron/` Electron shell (desktop runtime + packaging)
- `public/` shared static assets
- `public-mobile/manifest.webmanifest` Mobile PWA manifest
- `public-desktop/manifest.webmanifest` Desktop PWA manifest

## Tech Stack

- Angular
- Tailwind CSS
- Angular Service Worker (PWA)
- Electron (desktop app packaging)
- Local persistence with `localStorage`

## Current Core Features

- Create / edit / archive / restore tasks
- Status flow: `open -> in-progress -> done`
- Drag & drop ordering (active tasks)
- Priority + color tags
- Quick input parsing in create/edit modal
- Config page:
  - Language (DE/EN)
  - Theme (Light/Dark/System)
  - Time format (24h/12h)
- Task filters:
  - Time: All / Today / Morning / Afternoon / Week
  - Priority: All / High / Medium / Low

## Reminder Logic (Current)

- No reminders for `done` or `archived`
- Priority-based reminder timing
- Short-notice tasks are handled with condensed timing
- End-time reminders when a valid range exists (`endTime > start`)
- Priority-aware reminder wording

## Prerequisites

- Node.js (current LTS recommended)
- npm

## Install

```bash
npm install
```

## Desktop Workflows

### 1) Run Desktop UI in browser

```bash
npm run start:desktop
```

Open: `http://localhost:4200`

### 2) Run Desktop app via Electron (dev)

```bash
npm run electron:dev
```

### 3) Build Desktop web bundle

```bash
npm run build:desktop
```

### 4) Package Desktop app (Electron)

```bash
npm run electron:dist
```

Windows target only:

```bash
npm run electron:win
```

## Mobile Web Workflows

```bash
npm run start:mobile
```

Open: `http://localhost:4200`

## Production Web/PWA Deploy

Create a deploy-ready folder with landing page + auto device routing + both app builds:

```bash
npm run build:web
```

Result:

- `dist/web/index.html` -> landing page
- `dist/web/app/index.html` -> auto route to mobile/desktop
- `dist/web/app/mobile/` -> mobile app (PWA)
- `dist/web/app/desktop/` -> desktop app (PWA)
- `dist/web/_redirects` -> SPA fallback rules for Netlify-style hosts

Local preview without `npx`:

```bash
npm run preview:web
```

Open: `http://localhost:8080`

## All Relevant Commands

```bash
npm run start:desktop
npm run build:desktop
npm run test:desktop
npm run electron:dev
npm run electron:dist

npm run start:mobile
npm run mobile:build
npm run test:mobile

npm run build:web:desktop
npm run build:web:mobile
npm run assemble:web
npm run build:web
npm run preview:web
```

## Build Output Paths

- Desktop web output: `dist/tododolix-basil`
- Mobile web output: `dist/tododolix-mobile`
- Combined deploy bundle: `dist/web`

## Data Storage

Data is local by default:
- No cloud sync enabled by default
- Mobile and desktop therefore maintain separate local datasets

## Notes

- Electron is the desktop runtime.
- Mobile is delivered as web/PWA surface.
- Desktop can be delivered as web/PWA and additionally as Electron `.exe`.
