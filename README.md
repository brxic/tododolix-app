# Tododolix

Tododolix is a ToDo app with **two product surfaces in one repository**:
- `desktop`: optimized for mouse workflows, wide layouts, and focused planning
- `mobile`: optimized for quick capture and on-the-go usage

Both versions share the same core logic (tasks, status flow, reminder rules) while keeping platform-specific UI and source trees.

## Intention

The project follows three goals:
1. **Clear focus**: capture, prioritize, and complete tasks quickly.
2. **Pragmatic product development**: optimize mobile and desktop independently without splitting into separate repos.
3. **Local data ownership**: data stays local on each device by default.

## Project Structure

- `src-mobile/` Mobile Angular app
- `src-desktop/` Desktop Angular app
- `electron/` Electron shell for desktop packaging
- `public/` shared static assets
- `scripts/` utility scripts (e.g. icon generation)

## Tech Stack

- Angular
- Tailwind CSS (via `@import "tailwindcss"`)
- Electron (desktop packaging)
- Local persistence via `localStorage`

## Core Features

- Create, edit, archive, and restore tasks
- Status flow: `open -> in-progress -> done`
- Drag & drop ordering for active tasks
- Color and priority tagging
- Smart quick input in create/edit modal (parsing date/time/priority/color)
- Configuration page:
  - Language (DE/EN)
  - Theme (Light/Dark/System)
  - Time format (24h/12h)
- Task page filters:
  - Time: All / Today / Morning / Afternoon / Week
  - Priority: All / High / Medium / Low

## Reminder Logic (Current)

Reminders are derived from existing task data:
- No reminders for `done` or `archived`
- Priority-based pre-reminders
- Short-notice tasks are handled with condensed reminder timing
- End-time reminders when a valid range exists (`endTime > start`)
- Priority-aware reminder wording

Note: notifications currently rely on browser notifications.

## Local Setup

### Requirements

- Node.js (current LTS recommended)
- npm

### Install

```bash
npm install
```

## Development Commands

### Mobile

```bash
npm run start:mobile
npm run build:mobile
npm run test:mobile
```

### Desktop (Web)

```bash
npm run start:desktop
npm run build:desktop
npm run test:desktop
```

### Electron Desktop

```bash
npm run generate:icon
npm run electron:win

```

## Build Outputs

- Desktop build: `dist/tododolix-basil`
- Mobile build: `dist/tododolix-mobile`

## Data Storage

Tasks are stored locally:
- No cloud sync by default
- Mobile and desktop therefore maintain separate local data states

## Product Principles (Current)

- Avoid unnecessary over-automation
- Prefer user control (e.g. no aggressive forced presets)
- UI can differ by platform while behavior stays consistent

## Natural Next Steps

- Native Android integration via Capacitor
- Optional sync mode (opt-in)
- Additional desktop power-user features and shortcuts
