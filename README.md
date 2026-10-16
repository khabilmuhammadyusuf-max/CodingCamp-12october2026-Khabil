# Life Dashboard 🗂️

A clean, responsive To-Do List Life Dashboard built with vanilla HTML, CSS, and JavaScript.

## Features

### Required (MVP)
- **Greeting** — Time-aware greeting (Good Morning/Afternoon/Evening/Night) with live clock and date
- **Focus Timer** — 25-minute Pomodoro timer with Start, Pause, and Reset buttons
- **To-Do List** — Add, edit, mark done, delete tasks — all saved to LocalStorage
- **Quick Links** — Add/remove shortcut buttons to favorite websites, saved to LocalStorage

### Challenges Implemented
- ✅ **Light / Dark Mode** — Toggle with the 🌙/☀️ button in the top-right corner; preference is saved
- ✅ **Custom Name in Greeting** — Click "✏️ Edit Name" to set your name and see it in the greeting
- ✅ **Prevent Duplicate Tasks** — Adding or editing a task with an identical name (case-insensitive) is blocked with a warning

## How to Run

Just open `index.html` in any modern browser — no build step, no server required.

```
index.html   ← open this
style.css    ← styles (auto-loaded)
app.js       ← logic  (auto-loaded)
```

## Tech Stack
- HTML5
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (ES2020, LocalStorage)
