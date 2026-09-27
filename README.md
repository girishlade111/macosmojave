# macOS Mojave — Web Desktop Simulator

A pixel-styled recreation of the **macOS Mojave desktop**, running entirely in your browser. Boot it up, log in, and explore a working desktop environment: draggable windows, a functional Dock, Finder, Safari, Terminal, System Preferences, Control Center, Spotlight search, and more — no Apple hardware required.

## What it does

- Boots through a **macOS-style boot screen** into a **login screen**
- Drops you onto a simulated **macOS Mojave desktop** with menu bar, Dock, and desktop icons
- Opens **draggable, resizable windows** for built-in apps:
  - **Finder** — browse a virtual file system
  - **Safari** — simulated browser window
  - **Terminal** — interactive terminal with commands
  - **System Preferences** — tweak simulated settings
  - **PDF reader** — view documents in-window
- **Spotlight search** (`⌘ + Space`-style overlay)
- **Control Center**, **Notification Center**, and Apple-menu bar
- **Context menus** on right-click, just like the real desktop

## Features

- Fully client-side macOS Mojave desktop simulation
- Window manager: drag, focus, minimize, and close windows
- Login screen + boot sequence animation
- Theme/UX details inspired by Mojave (translucency, Dock magnification feel)
- Recharts-powered visualizations in some panels
- Dark-mode-friendly Mojave aesthetic

## Tech stack

- **Next.js** 15 (App Router) — statically exported
- **React** 19
- **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI primitives)
- **Recharts** for charts
- **lucide-react** icons

## Quick start

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and wait for the boot sequence.

### Build (static export)

```bash
npm run build
```

This produces a static site in the `out/` directory (via `output: 'export'` in `next.config.mjs`).

## Project structure

```
├── app/                  # Next.js App Router (single desktop page + layout)
├── components/
│   ├── macos-desktop.tsx # Desktop shell (windows, icons, wallpaper)
│   ├── boot-screen.tsx   # Boot animation
│   ├── login-screen.tsx  # Login screen
│   ├── dock.tsx          # The Dock
│   ├── menu-bar.tsx      # Top menu bar
│   ├── finder-window.tsx / safari-window.tsx / terminal-window.tsx / ...
│   ├── control-center/   # Control Center toggles
│   ├── notification-center/
│   ├── spotlight-search/
│   ├── context-menu/
│   └── ui/               # shadcn/ui primitives
├── contexts/             # Desktop state (windows, settings)
├── lib/                  # Utilities
├── types/                # TypeScript types
└── public/               # Static assets (wallpapers, icons)
```

## Environment variables

None required. Everything runs client-side with no backend.

## Deployment notes

- Fully static — deploy the `out/` directory to any static host.
- `next.config.mjs` includes `output: 'export'` and `basePath: '/macosmojave'` for the GitHub Pages subpath deployment. Remove `basePath` when deploying to a domain root.

## Live demo

**https://girishlade111.github.io/macosmojave/**

---

Built by Girish Lade — https://ladestack.in
