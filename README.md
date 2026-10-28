# Daily Creator

Generates a formatted daily message / standup report. Svelte 5 + TypeScript + Vite, installable as an offline-capable PWA. Everything runs in the browser; there is no backend.

## Run

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build + service worker in dist/
bun run check      # svelte-check (type check)
bun run test       # output-format tests for src/lib/daily.ts
```

## Layout

- `src/lib/daily.ts` – pure business logic (message format, day suffix, durations)
- `src/lib/app.svelte.ts` – reactive app state (form, history, theme, persistence)
- `src/lib/storage.ts` – localStorage helpers (keys `daily_creator_*`, unchanged from v1)
- `src/components/` – UI components

`.env.example` lists variables from the original AI Studio template; the app does not read any of them.
