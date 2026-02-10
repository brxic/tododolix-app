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
- `electron/` Electron shell (desktop runtime + packaging)
- `capacitor.config.ts` Capacitor config (mobile runtime bridge)
- `public/` shared static assets

## Tech Stack

- Angular
- Tailwind CSS
- Electron (desktop app packaging)
- Capacitor (mobile app packaging / Android bridge)
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

For Android builds:
- Android Studio
- Android SDK + platform tools
- JDK 17+

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

## Mobile Workflows (Android via Capacitor)

### First-time setup

1. Build mobile web assets:

```bash
npm run mobile:build
```

2. Add Android platform once:

```bash
npm run mobile:android:add
```

### Daily development flow

1. Rebuild and sync web assets into Android project:

```bash
npm run mobile:android:sync
```

2. Open Android Studio project:

```bash
npm run mobile:android:open
```

3. Run from Android Studio on emulator/device.

Optional CLI run (if Android toolchain/device is configured):

```bash
npm run mobile:android:run
```

### Mobile web-only preview

```bash
npm run start:mobile
```

Open: `http://localhost:4200`

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
npm run mobile:android:add
npm run mobile:android:sync
npm run mobile:android:open
npm run mobile:android:run
```

## Build Output Paths

- Desktop web output: `dist/tododolix-basil`
- Mobile web output: `dist/tododolix-mobile/browser`

## Data Storage

Data is local by default:
- No cloud sync enabled by default
- Mobile and desktop therefore maintain separate local datasets

## Notes

- Electron is the desktop runtime.
- Capacitor is the mobile runtime bridge.
- If this environment cannot access your npm registry, run `npm install` in a network-enabled environment before using Capacitor commands.
