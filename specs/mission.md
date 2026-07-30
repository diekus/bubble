# Mission

## What is bubble

Bubble is a 360° (equirectangular) media viewer. It runs as an installable Progressive Web App with no build step, no bundler and no backend — plain HTML, CSS and JavaScript, plus A-Frame for rendering the image onto a sky sphere.

## Why we're building it

An easy and convenient way to view and share 360° pictures.

Most 360° viewers require uploading your photo to a third-party service, creating an account, or installing a heavyweight native app. Bubble should be the opposite: open it, load an image (from disk, from the OS share sheet, from "Open with", or from the built-in demo gallery), and look around — instantly, on any device, without a sign-up and without your photo leaving your device unless you choose to share it.

## Goals

- Make viewing a 360° photo as frictionless as possible, on both desktop and mobile.
- Work fully offline once installed, including a usable fallback when a resource isn't cached.
- Feel native: installable, themed to the system's light/dark mode, integrated with OS-level file and share flows.
- Stay approachable to contribute to — plain web standards, no framework or build step to learn first.

## Non-goals

- **No native app wrapper.** Bubble stays a PWA — no Electron, Capacitor, or app-store-only packaging. Reach comes from the open web, not app stores.

## Stakeholders / audience

Bubble is a public, open-source project. It isn't scoped to a single maintainer's personal use — anyone should be able to find it, install it, use it to view and share their own 360° images, and contribute back.

## Success looks like

- Someone with a 360° photo (from a phone, a 360° camera, or shared to them) can view it in bubble in under a few seconds, with no account and no upload to a server they don't control.
- The app installs cleanly, works offline, and respects the user's system theme without any in-app toggle.
- The project stays easy enough to read and extend that new contributors can ship a small feature without first learning a framework or build pipeline.
