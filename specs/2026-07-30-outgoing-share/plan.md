# Plan — Outgoing Share (Roadmap Phase 1)

See [requirements.md](requirements.md) for scope and decisions this plan implements.

## 1. State tracking

1.1 Add a `hasUserImage` flag in `app.js`, defaulting to `false`.
1.2 Set it to `true` at the end of: the file-input change handler, the gallery item click handler, and the inbound share-target consumer — each only after their image has successfully loaded.

## 2. Feature detection & button rendering

2.1 On script load, detect Web Share file support (`navigator.share` exists, `navigator.canShare` exists and reports `true` for a representative file).
2.2 Add the Share button markup to `index.html`, hidden by default.
2.3 Reveal the button once support is confirmed **and** `hasUserImage` is `true` (whichever condition settles last).

## 3. Styling

3.1 Add a small icon-button style in `css/style.css` (using the existing `--theme`/`--foreground`/`--bubble-theme` custom properties), visually distinct from `.pill-button`, positioned within the header.
3.2 Confirm it degrades sensibly across the existing responsive breakpoints (768px column layout, 480px, and the `window-controls-overlay` compact titlebar).

## 4. Share action

4.1 Implement a helper that resolves the current image source into a `File` object, covering: data URL (file input), blob URL (gallery/file-handling/share-target loads), and static gallery asset path.
4.2 Wire the button's click handler to build the `File` and call `navigator.share({ files: [file], title, text })` with the agreed title/text copy.
4.3 Handle `AbortError` (silent) vs. other errors (console log only), per requirements.md decision 5.

## 5. Accessibility

5.1 Add an `aria-label` describing the button's action (e.g. "Share this image").
5.2 Check colour contrast of the new icon/button against both `css/light.css` and `css/dark.css` themes.

## 6. Docs

6.1 Update `CLAUDE.md`'s architecture notes and PWA-policy status section to describe outgoing share.
6.2 Update `specs/tech-stack.md`'s FUGU capability list to move outgoing Web Share from "not yet implemented" to "implemented."

## 7. Verification

7.1 Automate what can be automated (Playwright): button hidden on default image, visible after each of the three "user-loaded" paths, hidden when `canShare` is stubbed as unsupported, header show/hide still works with the button present, at each breakpoint and theme.
7.2 Manually verify the actual native share sheet on at least one real device/browser combination that supports it, since headless automation cannot drive the OS share sheet itself.
