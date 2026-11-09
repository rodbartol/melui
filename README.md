# Introduction to Melui

Melui. A small UI toolkit. Plain CSS.

## Use

```html
<link rel="stylesheet" href="mel.ui/src/index.css" />
```

## Theme

Light or dark follows the system. To force one:

```html
<html data-theme="dark"></html>
```

To use a sample theme, load it after Melui and name it on any element:

```html
<link rel="stylesheet" href="mel.ui/dist/themes/japan-fish.css" />
<html data-ui-theme="japan-fish"></html>
```

Themes: `japan-fish`, `mono`, `loud` (see `docs/themes.html`). Each sets tokens only. Load the theme's fonts from Google Fonts yourself.

To change colours, override tokens:

```css
:root {
  --ui-color-accent: hotpink;
  --ui-color-light-tint: lightblue; /* light on surfaces in dark mode */
}
```

## How it works (ITCSS)

CSS is stacked from general to specific. Each layer can override the ones above it.

| #   | Layer      | File                | Does                                     |
| --- | ---------- | ------------------- | ---------------------------------------- |
| 1   | Settings   | `src/tokens/`       | Colours, spacing, fonts. Variables only. |
| 2   | Generic    | `src/reset.css`     | Removes browser differences.             |
| 3   | Elements   | `src/base.css`      | Styles plain HTML tags.                  |
| 4   | Objects    | `src/layout/`       | Arranges things. No looks.               |
| 5   | Components | `src/components/`   | Card, forms, actions, feedback, structure. |
| 6   | Materials  | `src/materials.css` | What components are made of.             |
| 7   | Elevation  | `src/elevation.css` | How high they sit, and states on Z.      |
| 8   | Utilities  | `src/utilities.css` | One-job helpers. Always win.             |

Your app's own CSS beats all of them.

## Docs site

`npm run build` also makes the docs site in `dist/site/` (open `dist/site/index.html`). It is built with Melui, with a theme switcher, and published to GitHub Pages by `.github/workflows/pages.yml` on every push to `init`. Turn Pages on once: Settings → Pages → Source: GitHub Actions.

## Build

```bash
npm run build
```

Makes `dist/melui.css` (one file), `dist/themes/` (sample themes), `dist/docs/` (demo pages that open anywhere) and `dist/site/` (the docs site).

## Folders

- `src/`: the toolkit
- `docs/`: demo pages (source)
- `dist/`: built files
