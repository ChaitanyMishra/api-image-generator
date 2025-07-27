# Performance Optimization Instructions

## 1. Remove Unused CSS
- Install PurgeCSS:
  ```sh
  npm install -g purgecss
  ```
- Run PurgeCSS to generate a clean CSS file:
  ```sh
  purgecss --config purgecss.config.js
  ```
- Replace `<link rel="stylesheet" href="imageGen.css">` with `<link rel="stylesheet" href="imageGen.purged.css">` in your HTML.

## 2. Minify JavaScript
- Install Terser:
  ```sh
  npm install terser
  ```
- Run the minify script:
  ```sh
  node minify.js
  ```
- Replace `<script src="imageGen.js" defer></script>` with `<script src="imageGen.min.js" defer></script>` in your HTML.

## 3. Remove Unused FontAwesome
- Only import the icons you use, or use SVGs for individual icons.

## 4. Remove Legacy JS
- Audit your JS for polyfills and legacy code. Remove anything not needed for modern browsers.

## 5. Bundle and Tree-shake
- For larger projects, use Webpack or esbuild to bundle and tree-shake your JS.

## 6. Enable Compression and Caching
- Already enabled in your Express server.

## 7. Test with Lighthouse
- After these steps, re-run Lighthouse for improved scores.
