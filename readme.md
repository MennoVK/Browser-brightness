# Brightness

A browser extension that adds brightness control to websites. The extension
uses Vite for its build and `webextension-polyfill` for browser-independent
extension APIs.

## Development

1. Install dependencies with `pnpm install`.
2. Run `pnpm dev` to serve the popup during development.
3. Run `pnpm build` to create the unpacked extension in `dist/` and
   `Browser-brightness.zip`.
4. Load `dist/` as an unpacked extension in Chrome. In Firefox, install
   `Browser-brightness.zip` from the Add-ons Manager. Firefox release builds
   only install signed add-ons; submit the ZIP to Mozilla Add-ons for signing
   before distributing it as a permanent Firefox install.

The content script is built as a bundled IIFE because extension content scripts
are loaded as classic scripts, while the popup is bundled as a Vite page.

![popup preview](https://github.com/MennoVK/Chrome-brightness/blob/master/screenshots/popup.png?raw=true)

## Store

[Chrome Web Store](https://chromewebstore.google.com/detail/brightness/gjkclppdklmglkoilofecjmmajaaggae)
