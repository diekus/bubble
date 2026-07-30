# Validation — Outgoing Share (Roadmap Phase 1)

How to know the implementation succeeded and can be merged. Check against [requirements.md](requirements.md) and [plan.md](plan.md).

## Functional checks

- [ ] On the default start image (before any user action), the Share button is not visible.
- [ ] After choosing an image via the file input, the Share button becomes visible (on browsers with file-sharing support).
- [ ] After picking an image from the demo gallery, the Share button becomes visible.
- [ ] After opening bubble via OS file handling ("Open with" / double-click on an image file), the Share button becomes visible.
- [ ] After receiving an image via the inbound share target (`?shared=1` flow), the Share button becomes visible.
- [ ] Clicking Share on a supported browser opens the native OS share sheet with the current image attached, plus the title/text.
- [ ] Cancelling the native share sheet produces no error state.
- [ ] With `navigator.canShare` stubbed to report no file support, the button is not rendered at all — not present in the DOM, not just hidden via CSS.

## Non-functional checks

- [ ] The button has an `aria-label` and is reachable/operable via keyboard.
- [ ] Contrast of the new icon/button meets WCAG in both light and dark themes.
- [ ] No build step, framework, or backend was introduced.
- [ ] The header's existing show/hide behaviour (double-tap/click toggle, fade transition, auto-hide on gallery selection) still works correctly with the new button present, at each breakpoint (desktop, ≤768px, ≤480px) and in `window-controls-overlay` mode.
- [ ] `CACHE_NAME` in `service-worker.js` is bumped only if the precached file list actually changed (e.g. a new icon asset was added).

## Docs

- [ ] `CLAUDE.md`'s architecture and PWA-policy status sections describe the new outgoing-share capability.
- [ ] `specs/tech-stack.md`'s FUGU capability list moves outgoing Web Share from "not yet implemented" to "implemented."

## Merge readiness

- [ ] All functional and non-functional checks above pass, verified on both a desktop and a mobile viewport, in both light and dark themes.
- [ ] No console errors introduced.
- [ ] Diff reviewed against `requirements.md` — no unrequested scope (link-sharing, confirmation UI, etc.) crept in.
