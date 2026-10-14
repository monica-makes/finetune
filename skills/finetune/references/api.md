# finetune API, v0

## finetune(options)

One call makes one panel. It returns nothing.

| option | default | what it does |
| --- | --- | --- |
| `id` | `"finetune"` | Panel title and the localStorage key `finetune:<id>`. Calling again with the same `id` replaces that panel. |
| `key` | `"t"` | Hotkey for **Hide UI** (Figma's Minimize UI): hides the panel, the toolbar, the Design / Motion bar, the grid and the selection at once, leaving only the Hide UI button (at the right of the panel's top row) in a small box where it sat, to bring them back; from fully hidden (`open: false`) it shows everything. Figma's ⌘\ and ⇧⌘\ (Ctrl on Windows) do the same, and the toolbar's tooltip shows the key. Ignored while focus is in an input, textarea, select or contenteditable, and while Cmd, Ctrl or Alt is held. |
| `target` | `":root"` | Selector the CSS variables are written on. Every match gets them. |
| `controls` | `{}` | Key to control. A key starting with `--` is the CSS custom property it writes. Any other key only reaches `onChange`. |
| `presets` | `{}` | Name to values. A preset sets the keys it names and leaves the rest. |
| `onChange` | none | Called with every value: once when the panel mounts, then after each change. |
| `open` | `true` | Whether the inspector and toolbar show on load. `false` starts them hidden, for a page where the hotkey or a button opens them. |

It mounts as soon as the page has a body, so the call can sit in `<head>` or at the end of `<body>`.

`finetune.toggle()` shows or hides the inspector and toolbar together (the hotkey only does Hide UI, keeping the Hide UI button); `finetune.toggle(true)` and `finetune.toggle(false)` set them. Use it for a page's own "open the panel" button, or to hide them when a single-page app leaves the page.

`finetune.reset()` forgets every saved edit and reloads the page as written, the same as the panel's Reset. Just before it reloads, it fires `finetune:reset` on `window`: a page with state of its own (its own controls, its own localStorage) listens for it and resets that too, so one Reset clears everything.

Mark a page's own controls (its nav, its buttons) with `data-finetune-ui`: the inspector never selects them, and they keep working while it's open. Never put it on the content she wants to edit, or nothing in it can be selected.

## The inspector

- **Toolbar** (left): Copy changes and Save (its tooltip reads "Save changes in this browser"). **Hide UI** (the hotkey, T by default, or ⌘\ / ⇧⌘\) sits at the right of the panel's top row; hidden, it stays in place as a small box of its own. The top row stays put when the panel scrolls. Every floating box (panel, toolbar, bar, popovers, menus) has 8px corners. They're actions, so none stays pressed. Hovering one shows its name. **Reset to the code's last presets** sits in the panel's top row, after Undo and Redo. **Design** and **Motion** (Figma's Design and Prototype) sit in a bar at the bottom of the window, as Figma's toolbar does, each with its icon and name. The bar takes the page's theme: light on a light page, Figma's dark on a dark one (read from what paints the page, and again when html or body change class, `data-theme` or style, or the system theme flips); Design shows everything below, Motion is empty for now. The bar hides with the panel.
- **Nothing saves on its own.** Edits show live but stay in memory until Save puts them in localStorage (per page, `finetune:edits:<path>`). A reload before Save drops them. Reset forgets the saved ones and reloads the page as written.
- **Undo and redo** sit at the left of the panel's top row, before Reset (also ⌘Z and ⌘⇧Z, Ctrl on Windows; a field or text being typed in keeps its own). Each change is one step once it settles, so a drag, a color scrub or a burst of typing undoes as one; hover previews never count. Undoing past the first edit puts back exactly what the page had. Steps last for the visit; Save keeps the result, not the history.
- **Copy changes** copies the list the bake reads (below). It copies what's on screen, saved or not.
- **Page** (nothing selected, or a click on the page itself): the page fill, plus **Horizontal layout** (Figma's layout guide, as columns): one layout at a time. It starts as **the page's own grid** when the code has one: the widest CSS grid with four or more equal columns, at least half the window wide, read as count, gutter (`column-gap`) and margins (equal margins are Stretch, otherwise Left with an offset). That's the default; every field can be tweaked, and Styles keeps it at the top under "From the page" to go back to. A layout she saved for the page wins over it. With neither, it shows a warning, "Layout not defined.", and **Add layout** (the usual 12 stretched columns, 40 margin, 20 gutter, in red at 10%). Its row reads "Columns (12)": the swatch shows its color and opens the color settings, the eye shows or hides it. Under the row sit its fields: Count (the full width), Type (Stretch, or packed Left / Center / Right), Width (Auto when stretched), Margin (stretched) or Offset (packed), and Gutter; typing redraws the columns on every keystroke (Escape puts the old value back). The header's **Save as style** (bookmark) asks, in place, **Apply to all pages** or **Just this page**, and saves the layout named from its numbers ("12 col · 20 gutter · 50 margin"; the same numbers aren't saved twice). **Styles** (four circles) lists hers under "This page" and "All pages" (empty until she saves one): hovering one shows it on the page, a click applies it, leaving the menu puts hers back, and a style's trash can deletes it. Styles are kept in the browser the moment they're saved (`finetune:styles` for every page, `finetune:styles:<path>` for one), not with Save. Under the fields sits **Align items to nearest column**: left, horizontally and right. Each button is an action that springs back: it moves every item on the page (what she could select, outermost only), snapping its edge to the nearest column edge, or for horizontally putting it in the middle of the page, then toasts "Align all items left" (or right, horizontally). Those moves are ordinary edits (`translate`), so Copy and the bake carry them. The layout itself is saved with Save but never copied: it's for placing things, not a change to bake.
- **The page itself is the canvas.** The body, or a wrapper that paints the whole window (an app's `<main>`), is never selected; clicking it shows Page, and the Page fill paints it.
- **Fonts preview on hover**: the selected text wears each family the pointer passes over in the font menu. Leaving the menu or pressing Escape puts it back; only a click changes it.
- **Stroke and Effects** (any layer but text, her call), as in Figma, after Fill. **Stroke**: + adds one (black, Inside, 1); its row has the color, opacity, eye and remove, then Position (Inside, Center, Outside) and Weight. It's written as an `outline` (Inside and Center by a negative `outline-offset`), so it never moves the layout; the page's own outline shows as its stroke, a CSS border doesn't. **Effects**: + adds a drop shadow at the top (0 4, blur 4, black at 25%); each row has the sun (its settings: X and Y, Blur, Spread and Color for a shadow, Blur for a blur), the type (Inner shadow, Drop shadow, Layer blur, Background blur), remove and the eye. The top row paints on top. Shadows are `box-shadow`, Layer blur is `filter: blur()`, Background blur is `backdrop-filter` (with its `-webkit-` twin). Blurs are Figma's numbers, twice the CSS radius. The page's own shadows and blurs show as effects. Removing one the page had writes `none`, so it stays removed. **Adjustments** (the sliders icon in Appearance, on any layer but text) are an image's seven sliders: on a box they apply to the whole element, in the same `filter`; on an image the icon opens its image popover, where Figma keeps them. Images are handled like any other object: select, drag, align, corner radius, opacity, Stroke and Effects. An image's Fill thumbnail opens its image popover: the fit (Fill, Fit, Crop, Stretch: `object-fit`), the preview with a **Replace image** button over it (picks a file from her computer; it shows at once, Save keeps it in the browser's storage, which holds about 5MB, and Copy lists it as `src: new image "name"`), and the seven sliders.
- **Position, as in Figma:** Alignment, X and Y, and Rotation with Rotate 90° right and the two flips. For one layer, Alignment lines it up inside its parent, the parent's box inside its border and padding, as Figma lines a layer up in its frame. Each click is one undo step, and the moves are ordinary `translate` edits.
- **Groups are the code's containers, 1:1** (her rule: true to code over Figma). A click picks the outermost layer under the pointer below the level she's in: the page, until she double-clicks into a group. Wrappers that only hold the page (window-sized, or `display: contents`) are passed through, as Figma passes through a top-level frame. Double-click goes one level in (then, on words, edits them); **⌘-click** (Ctrl) picks the deepest layer; Escape steps back out a level. The hover outline shows what a click would pick. A single layer's panel opens with its **kind**, read from the code (Group: it holds other elements; Text; Image; Vector; SVG; Box), and its element (`nav.hl-links`); Figma's tools on that line are left out. A ⌘G group reads just "Group" and several layers "N selected": neither is an element in the code yet, so there's no name (the bake wraps a group's layers in a new element). Their section below is Position, as in Figma.
- **A group's Layout** adds **Flow** (Freeform, Vertical, Horizontal; Grid shows only on a CSS grid, which isn't made here), written as `display: flex` + `flex-direction`, or no flex for Freeform, and **Spacing**: the `gap` on a flex or grid (`row-gap` for Vertical, `column-gap` for Horizontal), or, when the children sit in one column or row on anything else, a move of each child after the first so every gap is the value (the ones below move down too). A ⌘G group gets the same Spacing between its layers.
- **Resizing, as in Figma:** drag a corner of the selected layer. The opposite corner stays put, Shift keeps the proportions (an image always keeps them), and the drag is one undo step. It's written as `width` / `height` (the CSS size for that outer size, padding and border counted), or a vector's own geometry. Only one layer that isn't rotated shows the corners (the rest would be finicky).
- **Vectors** (SVG shapes: path, rect, circle, ellipse, line, polyline, polygon, g, use) are objects with what SVG can do. A click picks the outer `<svg>` (kind SVG, handled like a box); double-click goes in. Moves are `translate` in the SVG's own units (a viewBox can scale them), so a 50px drag moves 50px on screen. Rotate and flip set `transform-box: fill-box` + `transform-origin: center` so the shape turns in place. Size: a rect's `width` / `height`, a circle's `r`, an ellipse's `rx` / `ry`, anything else `scale` with `vector-effect: non-scaling-stroke` so its stroke keeps its weight; the top-left stays put. Corner radius only on a rect (`rx` / `ry`). **Fill** is the SVG `fill` (+ adds Figma's D9D9D9; a gradient or pattern from the code shows but isn't edited); **Stroke** is `stroke` + `stroke-width`, always Center (SVG draws it centered); **Effects** are only Drop shadow and Layer blur, as `filter: drop-shadow()` (half Figma's blur: drop-shadow's reaches twice as far) and `blur()`. Words inside an SVG are text: their color is `fill`, their alignment `text-anchor`, and they have no box to size. **Icons**: an `<svg>` whose shapes paint with `currentColor` (Phosphor's, Lucide's) shows its color as its **Fill** (the svg's CSS `color`), a line icon's **Stroke** as just its **Weight** (`stroke-width` on the svg, in the icon's own units: Lucide's 2), and no Corner radius or box stroke. Any `<svg>`'s **Effects** are Drop shadow and Layer blur as `filter`s, so a shadow follows the drawing, not its box. An icon's weight or which icon it is are props in the code (Phosphor's `weight`), not CSS, so the panel doesn't change them.
- **Dragging moves, as in Figma.** Press on a layer and drag: it's selected and follows the pointer, and so does the rest of the selection when she presses inside one (a group moves as one; a layer inside another selected layer rides along with it). Each layer's move is a `translate`, so it's an ordinary edit: the Position fields follow it live, the whole drag is one undo step, and Copy and the bake carry it. A press inside a bigger selection that ends without a drag narrows the selection to what she clicked. Shift-click never drags.
- **Groups, as in Figma.** Shift-click adds a layer to the selection or takes it out. A drag that starts on the page draws a marquee and selects every layer it touches, live (a group as one); shift-drag adds to the selection, and a click without a drag clears it. **⌘G** (Ctrl+G) groups the selection; **⌘⇧G** ungroups it and leaves its layers selected. A click on any layer in a group selects the whole group (the hover outlines it as one); double-click goes into the group and selects that layer, double-click again edits its text, and Escape steps back out a level. Two or more selected show "Group" or "N selected" with **Alignment** (Figma's six: Align left, horizontal centers, right, top, vertical centers, bottom; each lines the layers up on an edge or the middle of the selection's box, a selected group moves as one, and a selection that is just one group lines up its own layers; each click is one undo step, and the moves are ordinary `translate` edits) and X and Y, which move them all together, and Align items to nearest column moves a group as one. The live page is never rewrapped (that breaks a React page): a group is how layers select and move here, saved with Save, and Copy lists it as `group N  a, b, c` for the bake to wrap in a real layer.
- **Inline text** (a span) ignores move, rotate, flip and size, so the first of those edits also sets `display: inline-block` on it. That's in the changes list too.
- **Fields only commit a typed change.** Clicking into a field and out again records nothing.

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
