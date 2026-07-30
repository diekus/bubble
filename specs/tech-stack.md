# Tech stack

This is the HOW. It governs every implementation decision in bubble. The authoritative source for the PWA policy below is [prompts/pwa.md](../prompts/pwa.md) — read it in full before doing PWA-related work; this document summarises it and records how bubble currently complies.

## Non-negotiables

- **Vanilla HTML, CSS and JavaScript only.** No React, Vue, Angular or any other framework, and no build step or bundler. If repeatable UI elements are needed, use Web Components rather than reaching for a framework.
- **Accessible.** Must comply with WCAG. Every image needs an `alt` attribute. Check colour contrast in CSS where relevant.
- **Responsive.** Optimised for both desktop and mobile.
- **Light/dark automatic.** Follows the system theme via `prefers-color-scheme` — no in-app theme switch UX.
- **Installable PWA.** A web app manifest (name, short_name, icons) and a service worker are required, and the app should meet installability criteria as much as possible.
- **Offline-capable.** A default offline/"404" fallback must be shown for uncached resources, and the service worker should keep basic functionality working offline wherever possible. When planning a feature's offline behaviour, ask what "basic functionality" means for that feature rather than assuming.
- **Graceful degradation.** Cutting-edge CSS/JS features must ship with an explicit fallback (e.g. `grid` as the fallback for `grid-lanes`; `window-controls-overlay` must always render normally at the top when unsupported).
- **No backend, by default.** Bubble ships today as fully static files with no server-side component. Any future feature that seems to need a backend (see the sharing/distribution roadmap) must treat that as a decision to make explicitly and document here, not something to add quietly.

## Advanced web capabilities (FUGU)

New advanced capabilities (protocol handling, file handling, web share/share-target, badging, shortcuts, launch_handler, url handling, device posture, etc.) are only added after asking whether they're relevant to the requested functionality — never speculatively.

Implemented so far, both added after being asked for:

- **File handling** (`file_handlers` in the manifest + `window.launchQueue` in `app.js`) — opening an image file from the OS ("Open with" / double-click) launches bubble with it loaded.
- **Web share target** (`share_target` in the manifest + the service worker's `/share-target/` POST handler) — an image shared from another app is handed to bubble via a dedicated cache and loaded on next launch.
- **Outgoing Web Share** (`#shareButton` in `app.js`) — sends the currently loaded image out to other apps via `navigator.share({ files })`, feature-detected so it only appears where file sharing is supported, and only once the user has loaded an image of their own (not the default start image). Shipped as [roadmap.md](roadmap.md) Phase 1 — see `specs/2026-07-30-outgoing-share/` for the full spec.

Not yet implemented, and not to be added without asking first: protocol handling, badging, shortcuts, launch_handler, url handling, device posture.

## Current architecture

- [index.html](../index.html) — page shell: the `<a-scene>`/`<a-sky id="sky">` A-Frame elements that render the equirectangular image, the header (file picker, gallery button, outgoing-share button, menu hint), and the gallery bottom-sheet overlay.
- [app.js](../app.js) — all application logic, as plain scripts/globals (no modules, no bundler):
  - File input → `FileReader` → data URL → set as `<a-sky>` `src`.
  - `loadImageFromUrl()` is the single entry point for changing the displayed image; used by the file input, the default start image, the demo gallery, file handling, and the share target.
  - Demo gallery bottom sheet, toggled via `openGallery()`/`closeGallery()`, using the `inert` attribute as a zero-JS focus trap.
  - Header show/hide (double-click on desktop, double-tap on mobile) with a fade transition and a small "double tap/click to show/hide menu" hint; the header also auto-hides when a gallery image is selected.
  - Outgoing share: `#shareButton` is only unhidden once `canShareFiles` (feature-detected via `navigator.canShare`) and `hasUserImage` are both true; `getCurrentImageFile()` fetches whatever's on `<a-sky>`'s `src` and hands it to `navigator.share()`.
- [gallery-data.js](../gallery-data.js) — single source of truth for the demo gallery (`GALLERY_IMAGES`), consumed both as a page `<script>` and via `importScripts()` in the service worker so every gallery image is precached automatically.
- CSS is split by theme rather than one stylesheet with inline media queries:
  - [css/style.css](../css/style.css) — layout/structure, referencing theme values only via CSS custom properties.
  - [css/dark.css](../css/dark.css) / [css/light.css](../css/light.css) — define those custom properties per scheme, loaded conditionally via `media="(prefers-color-scheme: …)"`.
- [manifest.json](../manifest.json) + [service-worker.js](../service-worker.js) — installability, offline precaching (cache-first with network fallback, falling back to [offline.html](../offline.html) for failed navigations), and the FUGU capabilities above. `CACHE_NAME` is bumped whenever the precached file list changes.
- `window-controls-overlay` is declared in `display_override` with a compact-titlebar CSS block; unsupported browsers simply never match that media query, which is the fallback.
- `grid-lanes` is not implemented: not yet a stable/shipped CSS feature, and the current layout doesn't need masonry-style placement. Plain `grid` (already in use) satisfies the fallback requirement — revisit if the layout grows more complex.

## Testing

- No build or test tooling is configured. Serve the directory root with any static file server for local work (the service worker registers relative to `/`, so `file://` won't register it correctly).
- There are no automated tests. Verify changes by hand: check WCAG compliance, colour contrast, that every image has `alt`, and that the feature degrades gracefully where it touches a cutting-edge API.
