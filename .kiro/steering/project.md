# Life Dashboard — Project Steering

## Overview

A single-page personal dashboard built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no backend. All state is persisted to `localStorage`.

## Project Structure

```
├── index.html          # Single HTML entry point
├── css/
│   └── style.css       # All styles; uses CSS custom properties for light/dark theming
├── js/
│   └── script.js       # All application logic (was app.js)
├── README.md
└── .kiro/
    └── steering/
        └── project.md  # This file
```

## Features

- **Clock & Greeting** — Live clock with time-of-day greeting that updates every second. Greeting personalises with a stored name.
- **Custom Name** — Stored in `localStorage` (`ld_name`). Editable via a modal with backdrop-click and Enter-key support.
- **Light/Dark Theme** — Toggled by a header button; preference stored in `localStorage` (`ld_theme`). Applied via a `data-theme` attribute on `<html>`.
- **Focus Timer (Pomodoro)** — Configurable countdown (1–99 min). Fires a browser `Notification` on completion if permission is granted. Timer state is not persisted across page reloads by design.
- **To-Do List** — Full CRUD (add, toggle done, edit, delete). Duplicate detection is case-insensitive. Supports four sort modes: default insertion order, A→Z, Z→A, done-last. Stored in `localStorage` (`ld_todos`).
- **Quick Links** — Add labelled URLs that render as favicon chips. Auto-prepends `https://` if the scheme is missing. Favicons fetched from Google's favicon service. Stored in `localStorage` (`ld_links`).

## localStorage Keys

| Key               | Value                        |
|-------------------|------------------------------|
| `ld_theme`        | `"light"` or `"dark"`        |
| `ld_name`         | User's display name (string) |
| `ld_todos`        | JSON array of todo objects   |
| `ld_links`        | JSON array of link objects   |
| `ld_timer_minutes`| Last-used timer duration     |

## Coding Conventions

- `'use strict'` at the top of `script.js`.
- All DOM mutations go through render functions (`renderTodos`, `renderLinks`, `renderTimer`, `renderName`) — no ad-hoc direct DOM writes outside them.
- User-supplied strings are always passed through `escapeHtml()` before being written into `innerHTML`.
- IDs for todos and links are generated with `uid()` (`Date.now()` + random suffix) — collision-safe for single-user local use.
- No external dependencies. No bundler required.

## Development

Open `index.html` directly in a browser. There is no build step.

For live-reload during development, any static file server works:

```bash
npx serve .
# or
python -m http.server
```
