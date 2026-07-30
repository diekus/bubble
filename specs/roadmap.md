# Roadmap

High-level implementation order only. Each phase should be small enough to ship as its own focused change. When a phase starts, follow [prompts/phase.md](../prompts/phase.md): branch, gather feature specs, and create `specs/YYYY-MM-DD-feature-name/` with `plan.md`, `requirements.md` and `validation.md`, all synced against [mission.md](mission.md) and this roadmap.

## Phase 0 — Baseline (shipped)

The current state of the app, kept here as the reference point for everything below: 360° image viewer (file picker + demo gallery), installable manifest, service worker with offline fallback, file handling and web share target, light/dark theming, `window-controls-overlay`, and the double-tap/click menu with fade transition and hint.

## Phase 1 — Outgoing share

Add a "Share" action that sends the currently loaded image out to other apps via the Web Share API. This complements the existing share *target* (receiving), which only covers the inbound direction today. No backend required. The share should load bubble on the receivers end with the image data from the sender's picture to be decoded and loaded into their device for viewing. 

## Phase 2 — Gallery permalinks

Let a URL deep-link directly to a specific demo gallery image (e.g. a `?gallery=<id>` query param that calls `loadImageFromUrl()` on load). Purely client-side routing — no backend required, since gallery images already ship with the app.

## Phase 3 — Decide: shareable links for user images

A decision/spike phase, not a build phase. Sharing a *user-loaded* image via a link (not just demo gallery images) means someone else must be able to fetch that image, which the current fully-static, no-backend architecture ([tech-stack.md](tech-stack.md)) cannot do on its own. Before building anything, decide and document the approach — e.g. a minimal backend/object storage, a peer-to-peer transfer, or scoping this out entirely — and record the decision in `tech-stack.md`.

## Phase 4 — Shareable links for user images

Build whichever approach Phase 3 settled on.

## Phase 5 — Hotspot data model and rendering

Let a single image carry point-of-interest markers (position, label, optional link), rendered as hotspots in the A-Frame scene. Static and viewer-only at this stage — no authoring UI, no navigation yet.

## Phase 6 — Hotspot authoring UX

Let a user place and edit hotspots on the currently loaded image from within bubble, rather than needing hand-authored data.

## Phase 7 — Guided tours

Let a hotspot jump to another image, chaining images into a navigable sequence/tour built from the hotspot foundation in Phases 5–6.

## Phase 8 — 360° video support

Extend the viewer to play equirectangular video sources, not just static images, reusing the existing load pipeline and the offline/precache story as far as is feasible for video.
