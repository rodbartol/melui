# Introduction to Melui

Melui. A small UI toolkit. Plain CSS.

## Use

```html
<link rel="stylesheet" href="mel.ui/src/index.css" />

<button class="ui-btn" data-variant="primary">Save</button>
```

## Theme

Light or dark follows the system. To force one:

```html
<html data-theme="dark"></html>
```

To change colours, override tokens:

```css
:root {
  --ui-color-accent: hotpink;
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
| 5   | Components | `src/components/`   | Buttons and more.                        |
| 6   | Utilities  | `src/utilities.css` | One-job helpers. Always win.             |

Your app's own CSS beats all of them.

## Build

```bash
npm run build
```

Makes `dist/mel.ui.css` (one file) and `dist/docs/` (demo pages that open anywhere).

## Folders

- `src/`: the toolkit
- `docs/`: demo pages (source)
- `dist/`: built files
