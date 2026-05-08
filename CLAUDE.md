# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Low-cal Lightbox (`lc-lightbox`) is a zero-dependency web component that
displays images in a fullscreen modal using the native HTML `<dialog>`
element. It uses Shadow DOM for encapsulation and is published as an ES module
to npm.

## Commands

- **Build**: `npm run build` — copies source files into the `lc-lightbox/`
  distribution directory via `src/build.bash`
- **Dev server**: Uses DDEV (`ddev start`) — serves the PHP demo page at
  `public/index.php`
- **Package**: `npm pack lc-lightbox/` (trailing slash required)
- **Publish**: `npm publish lc-lightbox`
- **Tests**: None configured

## Architecture

The entire component is a single file: `src/lc-lightbox.js` (~150 lines).

- **Class**: `LCLightbox` extends `HTMLElement`, registered as `<lc-lightbox>`
- **Shadow DOM**: `mode: "open"` — contains a `<slot>` for the thumbnail and a
  `<dialog>` for the fullscreen view
- **Template system**: Users can override the default template by providing
  `<template id="low-cal-template">` in the document
- **CSS custom properties**: `--image-border-width` and `--dialog-padding`
- **Observed attributes**: `src`, `min-width`, `disabled`, `debug`

The build is just file copying (no transpilation or bundling). The component is
published as-is.

## Project Structure

- `src/lc-lightbox.js` — the source component
- `src/build.bash` — build script (copies files to `lc-lightbox/`)
- `lc-lightbox/` — generated distribution package (gitignored)
- `public/` — DDEV-served demo page with test images
- `public/lc-lightbox.js` — symlink to `src/lc-lightbox.js`

## Key Conventions

- Pure vanilla JS (ES2022+), no TypeScript, no bundler, no framework
- No external dependencies — keep it that way
- The component uses `@starting-style` for CSS fade transitions
- Mobile handling: component disables itself when viewport < `min-width`
  (default 640px), checked only at page load
