# Tuner API, v0

What a tuner run needs: `finetune()` and its options, the controls, the tuner's Copy formats and what the panel remembers. Baking is in `bake.md`; how the inspector looks and behaves is in `panel.md`.

## finetune(options)

One call makes one panel. It returns nothing.

| option | default | what it does |
| --- | --- | --- |
| `id` | `"finetune"` | Panel title and the localStorage key `finetune:tuner:<id>` (its own prefix, so an id like `theme` or `styles` can't clash with finetune's own keys; values kept under the old `finetune:<id>` move over on the next load). Calling again with the same `id` replaces that panel. |
| `key` | `"d"` | Hotkey for **Hide UI** (Figma's Minimize UI). Several calls on one page share the one Hide UI (each call's key toggles it once), and every call's controls panel shows and hides with the inspector, whichever way it comes back. Ignored while focus is in an input, textarea, select or contenteditable, and while Cmd, Ctrl or Alt is held. |
| `target` | `":root"` | Selector the CSS variables are written on. Every match gets them. |
| `controls` | `{}` | Key to control. A key starting with `--` is the CSS custom property it writes. Any other key only reaches `onChange`. |
| `presets` | `{}` | Name to values. A preset sets the keys it names and leaves the rest. |
| `onChange` | none | Called with every value: once when the panel mounts, then after each change. |
| `layout` | none | The site's decided grid, as the page's own Horizontal layout: `{ count, gutter, margin }` (stretched columns; `align: "left" / "center" / "right"` with `offset` and `width` for packed ones). It wins over a CSS grid read from the page and shows under "From the page" in Styles; without it, and with no CSS grid, the panel says "Layout not defined." (her call, 2026-10-15: a site has its grid even where no CSS grid draws it). |
| `fontNames` | none | Display names for the Fonts popover, as Figma shows them: `{ "<family the page registers>": "<name>" }`, e.g. `{ neueMontreal: "PP Neue Montreal" }`. A key can be the family with next/font's hash or not (`neueMontreal` also names `__neueMontreal_8f3a2c`). Labels only: a pick still writes the registered family, so Copy and the bake don't change. Several calls add to one list. Without it, the popover reads a name off the family's font files, then off the family (see `panel.md`). |
| `help` | `true` | Help and resources, Figma's ? button in the bottom right corner: hover says "Help and resources"; click opens a menu of Keyboard shortcuts (a sheet along the bottom of the window listing the ways to show and hide finetune, a key used this visit lit in the mode's colour) and User guide (`docs/GUIDE.md` on GitHub). `false` leaves it off, for a page with its own help. It shows, dims (T) and hides (D, E) with the panels. |
| `open` | `true` | Whether the inspector and toolbar show on load. `false` starts them hidden, for a page where the hotkey or a button opens them. |

It mounts as soon as the page has a body, so the call can sit in `<head>` or at the end of `<body>`.

`finetune.toggle()` shows or hides the inspector and toolbar together (the hotkey only does Hide UI, keeping the Hide UI button); `finetune.toggle(true)` and `finetune.toggle(false)` set them. Use it for a page's own "open the panel" button, or to hide them when a single-page app leaves the page.

`finetune.remove(id)` takes that tuner's panel and hotkey off the page. A tuner belongs to the page that declared it: in an app that changes pages without a reload, call it when the page goes away. Until then its panel stays hidden on any page where its `target` matches nothing.

`finetune.reset()` forgets every saved edit and reloads the page as written, the same as the panel's Reset. Just before it reloads, it fires `finetune:reset` on `window`: a page with state of its own (its own controls, its own localStorage) listens for it and resets that too, so one Reset clears everything.

Mark a page's own controls (its nav, its buttons) with `data-finetune-ui`: the inspector never selects them, and they keep working while it's open. Never put it on the content she wants to edit, or nothing in it can be selected.

## Controls

Every control takes `type`, `value` and `label` (default: its key).

### range

A slider plus a number field you can type in.

| option | default |
| --- | --- |
| `value` | `min` |
| `min` | `0` |
| `max` | `100` |
| `step` | `1` |
| `unit` | `""` |

Writes `value + unit`. No unit means a bare number, which is right for unitless line-height and for values used inside `calc()`. The number field accepts values past `min` and `max`; the slider stops at them.

### select

A button grid, never a dropdown.

| option | default |
| --- | --- |
| `value` | the first option |
| `options` | `[]` |
| `cols` | `4` |

Options are plain values or `{ label, value }`, so a button can read "H1 36" while writing `h1`. Writes the chosen option's value. A label stays on one line: `cols` is the most columns, and the grid takes fewer when the widest label won't fit one, so every button keeps the same width and height.

### toggle

| option | default |
| --- | --- |
| `value` | `false` |
| `on` | `1` |
| `off` | `0` |

Writes `on` when true and `off` when false.

### color

Chips plus a hex field.

| option | default |
| --- | --- |
| `value` | `"#000000"` |
| `chips` | `[]` |

Hex only: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`. The field takes a value with or without the `#`.

### text

| option | default |
| --- | --- |
| `value` | `""` |

For copy. Give it a key without `--` and apply it in `onChange`.

## Copy formats

**Copy JSON** is the values object. Raw values: numbers stay numbers, toggles stay `true` or `false`, no units. `onChange`-only keys are included.

```json
{
  "--hero-size": 40.6,
  "--hero-weight": 400,
  "--hero-leading": 1.12,
  "--hero-tracking": -0.02,
  "--hero-ink": "#F6F4EF",
  "--hero-italic": false,
  "eyebrow": "Meta · Redesign",
  "speed": 1
}
```

**Copy CSS** is a block for the `target` selector, `--` keys only, written exactly as the panel writes them: units added, toggles as their `on` or `off`.

```css
:root {
  --hero-size: 40.6px;
  --hero-weight: 400;
  --hero-leading: 1.12;
  --hero-tracking: -0.02em;
  --hero-ink: #F6F4EF;
  --hero-italic: normal;
}
```

If the browser blocks the clipboard, the panel shows the text in a box to copy by hand.

## What the panel remembers

The last values per `id`, in localStorage under `finetune:tuner:<id>`. On load, a stored key that no longer matches a control is dropped, and a stored value that no longer fits its control falls back to the schema. **Reset** returns every control to its `value`. finetune never writes to disk.
