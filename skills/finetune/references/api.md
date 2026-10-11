# finetune API, v0

## finetune(options)

One call makes one panel. It returns nothing.

| option | default | what it does |
| --- | --- | --- |
| `id` | `"finetune"` | Panel title and the localStorage key `finetune:<id>`. Calling again with the same `id` replaces that panel. |
| `key` | `"t"` | Hotkey that shows and hides the panel. Ignored while focus is in an input, textarea, select or contenteditable, and while Cmd, Ctrl or Alt is held. |
| `target` | `":root"` | Selector the CSS variables are written on. Every match gets them. |
| `controls` | `{}` | Key to control. A key starting with `--` is the CSS custom property it writes. Any other key only reaches `onChange`. |
| `presets` | `{}` | Name to values. A preset sets the keys it names and leaves the rest. |
| `onChange` | none | Called with every value: once when the panel mounts, then after each change. |

The panel starts hidden. It mounts as soon as the page has a body, so the call can sit in `<head>` or at the end of `<body>`.

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

Options are plain values or `{ label, value }`, so a button can read "H1 36" while writing `h1`. Writes the chosen option's value.

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

The last values per `id`, in localStorage under `finetune:<id>`. On load, a stored key that no longer matches a control is dropped, and a stored value that no longer fits its control falls back to the schema. **Reset** returns every control to its `value`. finetune never writes to disk.

## Bake checklist

1. Get the tuner's Copy JSON.
2. Find the `finetune()` call with that `id`.
3. For each key, find where the committed value lives: the custom property's declaration in the stylesheet (usually `:root`), or the config value. For a key without `--`, wherever that value is used (markup, config, a script constant).
4. Write the new value in that file's format. `range`: add the control's `unit`. `toggle`: write `on` or `off`. Skip values that already match.
5. A key with no committed home: don't invent one. List it and ask.
6. Remove the `finetune()` call, any code that only fed it, and the script tag that loads `finetune.js` unless another `finetune()` call on the page still uses it.
7. List every file and line touched.
8. Ask before committing.
