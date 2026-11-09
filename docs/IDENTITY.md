# Melui Identity

**Neutral surfaces, real materials, true depth.**

Melui is a class-based CSS toolkit for apps and websites, with a neutral palette, made to be themed. It stays out of sight, so the product's identity shows, not Melui's. What makes it different is physical: components are made of materials, sit at a height, and speak through symbols.

Each section is marked Decided, Proposed or Open.

## Personality (Decided)

- **Quiet, not sterile.** Neutral by default. Materials and soft shadow add warmth.
- **Compact.** Dense spacing, efficient layouts. Controls grow on touch devices so fingers can hit them: 44px at medium size.
- **Layered.** Components lift, float and overlap, even outside their containers.
- **Symbolic.** Icons and pictures lead. Labels are short but always present.

## Model (Decided)

Every component combines four independent properties. Changing one never forces a change to another.

- **Material:** what it's made of.
- **Elevation:** how high it sits.
- **Symbol:** what it signifies.
- **Placement:** where it sits and next to what.

Example: a card can be paper, raised and overlapping a header, or glass, floating and grouped with others.

## Materials (Decided)

Texture means materials. A material is a full surface recipe: fill, texture, edge, and how it reacts to light. Users can make their own.

The set is solid, glass, paper and ink:

- **Solid** (default): flat, plain fill, thin border.
- **Glass:** see-through, blurs what's behind.
- **Paper:** light, fine grain.
- **Ink:** dark, bold, nearly flat.

Under light (dark mode):

- Paper reveals its texture: it shows more as it rises.
- Glass stays see-through at every height.
- Ink and solid only brighten.

How they're used:

- Add `ui-material-<name>` to any element, e.g. `ui-material-paper`.
- A material applies only to the element with the class. Children keep their own material.
- Ink is always dark, in both modes: everything inside it uses the dark tokens.
- Texture only darkens (fine specks), so text keeps AAA contrast on every material.
- Glass turns solid when blur isn't supported or the user asks for less transparency.
- Users can add their own: any class named `ui-material-<name>` with the same settings.

## Elevation (Decided)

The Z axis is central. Height shows importance and interaction, never decoration.

Only the element that is the primary focus may stick out of its container or overlap others. In focus, like a modal in use, it can fully cover other elements.

States move on Z:

| State | Depth |
| --- | --- |
| Hover | Lifts one level |
| Pressed | Sinks to the surface |
| Selected | Stays raised |
| Disabled | Goes flat, loses its material |

Levels, low to high: Sunken (inputs) · Base (page) · Raised (cards) · Floating (menus) · Overlay (dialogs) · Top (toasts). Higher means a larger, softer shadow.

Levels are relative. An element sits on the surface below it, so in dark mode it catches its own level's light plus that surface's: a raised button in a dialog is brighter than the dialog. Light stops at the top level's, so text keeps AAA. Dialogs and popovers start again from the page.

## Dark mode (Decided)

**Light mode: objects cast shadows. Dark mode: objects catch light.**

Dark mode flips the depth cues, not the colours. You look down into depth, and light falls on components.

- The higher a surface sits, the brighter it gets.
- Shadow remains beneath, so overlap stays clear.
- Grays have a cool blue hue in both modes.
- The light is tinted. The tint is its own setting, separate from the accent colour.

## Symbols and placement (Decided)

- Icons and pictures lead; text supports them.
- Labels are minimal but required. No control is icon-only.
- A button with an icon is a **symbol button**: the icon leads, a short visible label always follows.
- Meaning comes from how the user places elements: grouping, order, proximity, layering.

## Principle (Decided)

**Neutral defaults, expressive mechanisms.** Minimal look, wide range of options.

## Motion and icons (Decided)

- **Motion:** on the slower side, but not too slow. Lifting and sinking should feel deliberate, never sluggish. Durations: fast 160ms, normal 280ms, slow 420ms.
- **Icons:** filled, not outline. Three sizes: small, medium, large. Bring your own icon set; Melui ships none.

## Contrast (Decided)

Higher contrast than usual. Text meets WCAG AAA (7:1) on every material and level. Borders and depth cues should read just as clearly.

## Status colours (Decided)

Status is the only place Melui uses colour by default. The four roles come from one palette (Japan Fish), muted and slightly dusty, so they sit calmly on neutral surfaces.

| Role | Fill | Text on fill |
| --- | --- | --- |
| Success | Sage `#A0CBAD` | Navy `#00012A` |
| Warning | Mustard `#FCC560` | Navy `#00012A` |
| Info | Dusty blue `#8FB1BE` | Navy `#00012A` |
| Danger | Brick red `#A42400` | White |

- Fills are the same in both modes.
- Danger uses a darker vermilion than the palette's `#D53302`, because no text meets AAA on the original. The original stays available as `red-600` for icons, borders and charts.
- Each role also has a soft background and a text colour for it. All pairs meet AAA.

## Browsers (Decided)

Baseline 2024 and newer: Chrome and Edge 123, Safari 17.5, Firefox 120. This is what `oklch()`, `color-mix()`, `light-dark()` and `@layer` need. No fallbacks for older browsers. Glass turns solid where blur isn't supported (see Materials).

## Class naming (Decided in part)

Each property gets its own prefix, written in full:

- Material: `ui-material-<name>`, e.g. `ui-material-paper`.
- Elevation: `ui-elevation-<level>`, e.g. `ui-elevation-raised`.
- Component: `ui-<component>`, e.g. `ui-card`.
- Part of a component: `ui-<component>-<part>`, single dash, e.g. `ui-card-symbol`.
- Variant or size of a component: the same shape, e.g. `ui-button-accent`, `ui-button-sm`, `ui-menu-end`.
- Placement: `ui-overlap-<side>`, e.g. `ui-overlap-start`. It pulls the element over its neighbour by a token amount, and only the element in focus may use it.

## Card (Decided)

- Default: solid material, raised elevation.
- Parts: `ui-card-symbol` (icon or picture, leads), `ui-card-title`, `ui-card-text`, `ui-card-actions` (symbol buttons or links, at the end).
- No meta or status part for now.

## Roadmap (Decided)

Basic components in four phases. Each phase proves something about the model before the next builds on it. Every component is plain CSS on native HTML: behaviour (opening, closing, switching) is the app's job, or the browser's (`<dialog>`, `popover`, `<details>`).

Budget: about 0.5 KB gzipped per component keeps all of them inside 15 KB.

### Phase 1: Core (proves the model) (done)

| Component | Class | Built on | Default | Notes |
| --- | --- | --- | --- | --- |
| Card | `ui-card` | any element | solid, raised | Parts: symbol, title, text, actions |
| Symbol button | `ui-button` | `<button>`, `<a>`, `<summary>` | solid, raised | Variants `-accent`, `-danger`; sizes `-sm`, `-lg` |
| Menu | `ui-menu` | `<details>` with `ui-menu-list` and `ui-menu-item` | solid, floating | The button stays lifted while open. `ui-menu-end` aligns it to the end. |
| Dialog | `ui-dialog` | `<dialog>` | solid, overlay | The card's parts (`ui-dialog-title` and so on). Opens as a popover with no JavaScript, or as a modal with `showModal()`. |

- A menu is positioned in its container, so an ancestor with `overflow: hidden` clips it. When anchor positioning reaches Baseline, menus can move to the top layer.
- Closing a menu on an outside click or Escape is the app's job.
- The danger fill doesn't catch light in dark mode (`--ui-state-catch: 0`), so white text keeps AAA.

### Phase 2: Forms (the sunken level) (done)

| Component | Class | Built on | Default | Notes |
| --- | --- | --- | --- | --- |
| Field | `ui-field` | wrapper or `<fieldset>` | none | Parts: `ui-field-label` (required), `ui-field-hint`, `ui-field-error` |
| Text input, text area | `ui-input` | `<input>`, `<textarea>` | solid, sunken | Focus lifts it to base |
| Select | `ui-select` | wrapper around `<select>` | solid, sunken | The wrapper draws the chevron |
| Checkbox, radio | `ui-choice` | `<label>` around `<input>` | solid, sunken | The label is the class, so a control can't lose its label. Checked fills with the accent. |
| Switch | `ui-choice` | `<label>` around `<input type=checkbox role=switch>` | solid, sunken | Thumb is raised and slides |

- A control's edge is strong (3:1) on every material. Invalid (`:user-invalid` or `aria-invalid`) turns it danger.
- Components override a material for a state through `--ui-state-fill` and `--ui-state-edge`.

### Phase 3: Feedback (status colours) (done)

| Component | Class | Built on | Default | Notes |
| --- | --- | --- | --- | --- |
| Badge | `ui-badge` | `<span>` | flat, neutral | Status fills with navy or white text. Optional icon. |
| Notice | `ui-notice` | `<div role=status>` | flat, status soft | Parts: symbol, title, text, actions. All text in the status's `-text` colour (AAA). |
| Toast | `ui-toast` | `popover="manual"` | solid, top | Same parts. In the end corner; several stack in `ui-toasts`. A status colours only the symbol. |
| Tooltip | `ui-tooltip` | wrapper with `ui-tooltip-text` | ink, top | Extra detail only, never a label. Shows on hover after a delay, at once on keyboard focus. |
| Progress | `ui-progress` | `<progress>` | sunken track | Accent or status fill. With no value, a segment slides. |

- Status variants: `-success`, `-warning`, `-danger`, `-info` on badge, notice, toast and progress.
- Badges and notices are flat: they aren't interactive, so they have no height.
- The tooltip is positioned in its wrapper (like the menu) and aligned to the control's start edge. Hiding it on Escape is the app's job.
- Showing, timing and hiding toasts is the app's job.

### Phase 4: Navigation and structure (done)

| Component | Class | Built on | Default | Notes |
| --- | --- | --- | --- | --- |
| Tabs, segmented control | `ui-tabs`, `ui-tab` | buttons with `aria-selected` or `aria-pressed`, or labels around radios | sunken track | Tabs are flat; the selected one stays raised, in place. Radios need no JavaScript. |
| Toolbar | `ui-toolbar` | wrapper with `role=toolbar` | glass, floating | Groups symbol buttons; `ui-toolbar-divider` between groups |
| List | `ui-list`, `ui-list-item` | `<ul>`, `<ol>` | none | Parts: symbol, title, text, actions. Link rows are flat until hovered, focused or current, then raised. |
| Avatar | `ui-avatar` | `<img>` or initials | solid, raised | Sizes `-sm`, `-lg` |
| Drawer | `ui-dialog ui-dialog-drawer` | `<dialog>` | solid, overlay | A dialog from the end edge, full height; `ui-dialog-drawer-start` for the start edge |

- Tabs and list rows stay in place when they lift (`--_lift: 0`), since they sit in a track or a list.
- A label around a checked radio or checkbox counts as selected, so a `label.ui-card` around a checkbox is a selectable card.
- Switching tab panels is the app's job.

### Phase 5: Themes and docs site (done)

Proves the success test and gives Melui its showcase.

**Three sample themes**, each a single CSS file that only overrides `--ui-*` tokens. No component CSS: if a theme needs any to look distinct, Melui's defaults are too strong.

| Theme | Accent | Surfaces and material | Shape | Type | Status colours |
| --- | --- | --- | --- | --- | --- |
| Japan Fish | Navy, vermilion and sage | Paper | Soft | A serif | The current Japan Fish set |
| Mono | Strict black and white | Solid | Square corners | A monospace | Near greyscale |
| Loud | Hot magenta | Glass | Big radii | A heavy grotesk | Vivid |

- Every theme still meets AAA for all text, in light and dark mode.
- Fonts are named in tokens and loaded from Google Fonts by the page that uses the theme. Melui itself still ships no fonts.
- A theme applies to `[data-ui-theme="<name>"]`, so a page or any part of it can switch.

- Built: `src/themes/japan-fish.css`, `mono.css`, `loud.css`. Every text pair meets AAA (7:1) and every focus ring and control edge 3:1, in light and dark, measured on the rendered pixels of every surface, level and material.
- What themes needed from Melui, now part of it: token rules run on any `[data-ui-theme]` element, so derived tokens follow a theme on part of a page; a default material (`--ui-material-default-*`) a theme can point at paper or glass; `--ui-color-accent-text` for the accent as text or a thin mark, for a light accent like Loud's magenta.

**One sample app screen**, the pond tracker (toolbar, tabs, cards, list, form, toast), rendered once per theme side by side. Only the theme differs.

**Docs site**, built with Melui:

- Multi-page: Home, Identity, Tokens, one page per component group (Card, Forms, Actions, Feedback, Structure), Themes.
- Navigation uses Melui's own components (drawer, list, tabs).
- Neutral Melui by default, with a theme switcher (a segmented control) that re-themes the whole site live.
- Built into `dist/` and published to GitHub Pages by a workflow.
- Built: `site/` holds the layout, home page and site CSS; `npm run build` makes `dist/site/` from them, the demo pages in `docs/` and this document. `.github/workflows/pages.yml` publishes it on every push to `init`.

## Docs (Decided)

The docs site is built with Melui and is its showcase: materials and depth are shown on the real thing. See Phase 5.

## Success test (Decided)

Keep three sample themes side by side, for example Japan Fish, a monochrome brand and a loud brand. If any two look like siblings, Melui's defaults are too strong.

## Name (Decided)

"Melui" is just a name: short, soft and easy to say. No hidden meaning. The logo is a simple wordmark.

## High contrast (Decided)

Switches on with either OS signal: `prefers-contrast: more` or `forced-colors: active`.

- Borders replace shadows, so every level keeps a visible edge.
- Glass and paper turn solid.

## Versioning (Decided)

Tokens and classes are the public API. Renaming or removing a semantic token (`--ui-color-*` and the other non-`ref` tokens) or a `ui-*` class is a major change. Changing a value, such as a colour or a spacing step, is minor. Primitives (`--ui-ref-*`) are internal and can change in any release.

## Performance (Decided)

The full CSS stays under 15 KB, minified and gzipped (3.3 KB today). Textures are tiny inline SVG noise, never image files.

## Contributions (Decided)

Proposal first. Anyone can suggest a component or material by opening an issue that describes it against this document: its material, elevation, symbol and placement. Code comes only after the proposal is accepted. Every contribution follows the Decided sections above.

A new component must:

- Work with any material and any elevation. Changing one never forces a change to another.
- Use semantic tokens only: no `--ui-ref-*`, raw colours, raw `z-index` or shadows.
- Stay inside the 15 KB budget and Baseline 2024.
- Move states on Z: hover lifts, press sinks, as in Elevation.

A new built-in material must:

- Give the full recipe: fill, texture, edge and how it reacts to light, in both light and dark mode.
- Fall back to solid in high contrast and when disabled.
- Be clearly different from solid, glass, paper and ink.

Not accepted:

- **Decorative depth:** shadows or overlap that don't mean importance or interaction.
- **Brand look:** colours, fonts or shapes that make Melui recognisable. Melui stays neutral.
- **JavaScript:** Melui is plain CSS. Behaviour, like opening and closing, is the app's job.
