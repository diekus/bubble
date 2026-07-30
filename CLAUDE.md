# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Bubble is a client-side 360° image viewer PWA. It has no build step, no bundler, and no package.json — it's plain HTML, CSS and JavaScript served as static files, plus [A-Frame](https://aframe.io/) (loaded via CDN in [index.html](index.html)) for rendering the equirectangular image onto a sky sphere.

## Running / testing locally

There is no build or test tooling in this repo. To work on it, just serve the directory root with any static file server (the service worker registers relative to `/`, so opening `index.html` directly via `file://` will not register it correctly). For example, from the repo root:

```
npx serve .
# or
python -m http.server 8080
```

There are no lint or test commands configured.

## Architecture

- [index.html](index.html) — page shell. Defines the `<a-scene>`/`<a-sky id="sky">` A-Frame elements that display the 360° image, the header with the file picker and gallery button used to load a new image, and the gallery bottom-sheet overlay.
- [gallery-data.js](gallery-data.js) — single source of truth for the demo gallery: a `GALLERY_IMAGES` array of `{ title, src, alt }`. Loaded both as a page `<script>` (so `app.js` can read the global) and via `importScripts()` in `service-worker.js` (so every gallery image gets offline-precached automatically). **Add new demo images only here** — nowhere else needs touching.
- [app.js](app.js) — all application logic, in one file:
  - Wires the file `<input>` to a `FileReader`, converting the chosen image to a data URL and setting it as the `<a-sky>` element's `src`.
  - `loadImageFromUrl()` sets the sky's image from a URL; used on load to pick a default start image (`images/start.jpg` or `images/start-dark.jpg`) based on `prefers-color-scheme`, and reused by both the file input and the gallery picker.
  - The demo gallery is a bottom-sheet overlay (`#galleryOverlay`) toggled by `openGallery()`/`closeGallery()`: it renders one button per `GALLERY_IMAGES` entry into `#galleryGrid`, animates in via the `.open` class (see CSS), and uses the `inert` attribute on `header`/`main` while open as a zero-JS focus trap (rather than manually trapping Tab). Closes on the close button, scrim click, or `Escape`.
  - Header visibility is toggled by double-click (desktop) or double-tap (mobile, detected manually via a `touchend` timestamp delta), via the `.hidden` class.
- CSS is split by theme rather than using a single stylesheet with media-query overrides inline:
  - [css/style.css](css/style.css) — layout/structure, references theme values only via CSS custom properties (`--color-bg`, `--color-fg`, `--color-bg-trans`, `--color-theme`, `--color-theme-hover`).
  - [css/dark.css](css/dark.css) / [css/light.css](css/light.css) — define those custom properties for each scheme; loaded conditionally in `index.html` via `media="(prefers-color-scheme: …)"` on the `<link>` tag. When adding new themeable values, define them in both files, not in `style.css`.
- [manifest.json](manifest.json) + [service-worker.js](service-worker.js) — PWA install/offline support:
  - `service-worker.js` precaches the app shell under `CACHE_NAME` (`css/`, `app.js`, `gallery-data.js`, every path in `GALLERY_IMAGES`, [offline.html](offline.html)), serves cache-first with network fallback, and falls back to `offline.html` for failed navigations. It also intercepts `POST /share-target/` to store an incoming shared image in a separate, version-independent `SHARE_CACHE` (`bubble-share-target`) and redirects to `/?shared=1`.
  - Bump `CACHE_NAME` (e.g. `v3` → `v4`) whenever the precached file list changes, so existing installs pick up the new list — the `activate` handler purges old versions automatically.
  - `manifest.json` declares `file_handlers` (opening an image file with bubble launches it with that image loaded) and `share_target` (receiving an image shared from another app). [app.js](app.js) consumes both: `window.launchQueue` for file handling, and the `?shared=1` query param + `SHARE_CACHE` lookup for share target.
- No JS framework, no TypeScript, no module bundler — keep additions as plain scripts/globals consistent with the existing style.

## PWA tech-stack guidance

The authoritative tech-stack policy for this project is [prompts/pwa.md](prompts/pwa.md) — read it in full before doing PWA-related work. Summary of its non-negotiables:

- Vanilla HTML/CSS/JS only, no frameworks (React/Vue/Angular); if repeatable elements are needed, use Web Components rather than a framework.
- Must comply with accessibility standards (WCAG), be responsive on desktop and mobile, and support light/dark automatically via the system theme — no manual theme switch UX.
- Must have a web app manifest (with name, short_name, icons) and a service worker, and meet installability criteria as much as possible.
- Must provide an offline fallback (a default "404"/offline page) for uncached resources, and the service worker should keep basic functionality working offline where possible — ask the user what counts as "basic functionality" for a given feature before building offline support for it.
- New "advanced" web capabilities (FUGU: file handling, web share/share-target, protocol handling, badging, shortcuts, launch_handler, url handling, device posture, etc.) should only be added after asking whether they're relevant to the requested functionality — don't add them speculatively.
- Cutting-edge CSS/JS features must degrade gracefully with an explicit fallback (e.g. `grid` as the fallback for `grid-lanes`; `window-controls-overlay` should always be implemented with content rendering normally at the top as the fallback).
- Every image needs an `alt` attribute; check colour contrast in CSS where relevant.

Status against this policy (last reviewed 2026-07-30):

- Offline fallback: [offline.html](offline.html) is precached and served for any failed navigation request; the service worker's `activate` handler also purges stale precache versions (keeping `SHARE_CACHE` intact).
- The `urlsToCache` path mismatch is fixed — paths now match the real `css/` directory.
- FUGU capabilities implemented: **file handling** and **web share target** (both were requested when asked, per the policy's "ask before adding" rule) — see the architecture note above. Other FUGU capabilities (protocol handling, badging, shortcuts, launch_handler, url handling, device posture) are still deliberately not implemented; ask before adding any of them.
- `window-controls-overlay` is declared in `display_override` and has a compact-titlebar CSS block in [css/style.css](css/style.css) under `@media (display-mode: window-controls-overlay)`; unsupported browsers simply never match that query, which is the fallback.
- `grid-lanes` is not implemented: it isn't a stable/shipped CSS feature as of writing, and the current two-region layout doesn't need masonry-style placement. Plain `grid` (already in use) satisfies the fallback requirement. Revisit if the layout grows more complex or the feature ships.

## Conventions

- Standard HTML/CSS/JS only — do not introduce a framework (React/Vue/Angular) or build tooling without explicit instruction.
- British English spelling in any written copy/UI text.
