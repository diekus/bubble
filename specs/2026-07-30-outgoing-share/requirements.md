# Requirements — Outgoing Share (Roadmap Phase 1)

## Context

[roadmap.md](../roadmap.md) Phase 1: add a "Share" action that sends the currently loaded image out to other apps via the Web Share API, complementing the existing inbound share target (image shared *into* bubble from another app, already implemented via `share_target` in the manifest and the `/share-target/` handler in the service worker). The share should be able to land the receiver in bubble with the image decoded and loaded for viewing, when the receiver picks bubble off their OS share sheet.

## Scope

- Add outgoing share for the currently displayed image using the Web Share API's file-sharing capability: `navigator.share({ files, title, text })`.
- Only available for **user-loaded images**: chosen via the file input, chosen from the demo gallery, opened via OS file handling ("Open with"), or received via the inbound share target. **Not** available for the default start image shown before the user has loaded anything.
- The share payload includes a title/text (e.g. "360° photo from bubble") alongside the image file, so it reads sensibly even if opened outside bubble.
- No backend. Purely client-side — the OS Share Sheet does the transfer; if the recipient picks bubble, bubble's existing inbound `share_target` flow takes over from there.

## Out of scope (this phase)

- Any link/URL-based sharing mechanism — that's [roadmap.md](../roadmap.md) Phases 2-4 (gallery permalinks, and the shareable-link decision/build for user images).
- Treating gallery-selected images differently from file-picked images — both count as "user-loaded" for this phase.
- Any custom success/confirmation UI beyond what `navigator.share()`'s promise naturally gives — no toast, no history of shares.

## Decisions

1. **Button style & placement**: a small icon-only button, not a third pill-button. Lives in the header alongside "Select Image"/"Gallery" so it inherits the header's existing show/hide behaviour (double-tap/click toggle, fade transition, auto-hide on gallery selection) instead of needing its own visibility logic.
2. **Feature detection**: on load, detect Web Share file support. If unsupported, the button is never rendered — no disabled state, no download fallback. Per [tech-stack.md](../tech-stack.md)'s graceful-degradation rule, absence of support here just means the feature doesn't exist for that browser, not a broken state.
3. **"User-loaded" state tracking**: a single `hasUserImage` flag, false by default, set true by the file-input change handler, the gallery item click handler, the file-handling (`launchQueue`) consumer, and the inbound share-target consumer, each after their image successfully loads.
4. **Source of shareable bytes**: whatever is currently set as `<a-sky>`'s `src` must be resolved to a `File`/`Blob` at share-time — it may already be a data URL, a blob URL, or a static gallery asset path, and each case needs handling.
5. **Error/cancel handling**: `AbortError` (user cancelled the native share sheet) is swallowed silently, not treated as an error. Any other rejection is logged to the console; no custom error UI this phase.

## Alignment with parent specs

- **[mission.md](../mission.md)**: keeps "no upload to a server you don't control" true — the OS handles the transfer, bubble never touches a server.
- **[tech-stack.md](../tech-stack.md)**: no backend added; stays within the "No backend, by default" non-negotiable. Its FUGU capability list should be updated once this ships to move outgoing Web Share from "not yet implemented" to "implemented."
- **[roadmap.md](../roadmap.md)**: this is Phase 1 only — it deliberately does not attempt the link-based sharing in Phases 3-4.
