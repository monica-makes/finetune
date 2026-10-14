---
name: finetune
description: Use whenever a prototype needs sliders or pickers to tune values live in the browser, or a finetune tuner's values need to be baked into code.
---

# finetune

finetune is one classic script, `src/finetune.js`, that puts a floating panel of controls on a page. Each control's key is the CSS custom property it writes. Keys without `--` only reach `onChange`. It also has a Figma-style inspector for editing what's already on the page: select an element, retype it, restyle it, tune its animations. This skill covers three requests and nothing else.

Every option and default, the two Copy formats and the bake checklist: `references/api.md`.

## "Add a tuner for X"

Write a `finetune()` schema for the values she named. Nothing else.

1. Find where each named value lives now: a CSS custom property (usually in a stylesheet's `:root`) or a value in a config or script.
2. If a named value is hard-coded and not a custom property yet, say so and ask before turning it into one.
3. Load the library once with a classic script tag, never `type="module"`:
   - inside this repo, a relative path to `src/finetune.js`;
   - anywhere else, `https://cdn.jsdelivr.net/gh/monica-makes/finetune@main/src/finetune.js`.
4. Write one `finetune({ ... })` call:
   - `id` named after the thing being tuned (`"hero"`).
   - One control per named value. No extra controls, no presets unless asked.
   - Each key is the CSS custom property it writes (`--hero-size`). A JavaScript-only value (a speed, a line of copy) gets a key without `--` and is applied in `onChange`.
   - `value` is the committed value today, so the panel opens on what ships.
   - Type: a number is `range` (with `min`, `max`, `step`, `unit` around the current value); a token vocabulary is `select` (a button grid, never a dropdown); on/off is `toggle`; a color is `color` with chips from the colors the project already uses; copy is `text`.
5. No bespoke panel code, no styling, no wrappers around the panel. The look lives in the library's PANEL LOOK block.
6. Tell her the id and the hotkey. Stop.

## "Bake the <id> tuner"

She pastes the panel's Copy JSON. Follow the bake checklist in `references/api.md`:

1. Find the `finetune()` call with that `id`.
2. Write each value where its committed value lives, in that file's format: a `range` gets its `unit`, a `toggle` writes its `on` or `off`. Skip values that already match.
3. A key with no committed home: don't invent one. List it and ask.
4. Remove the `finetune()` call, code that only fed it, and the script tag that loads `finetune.js` (keep the tag if another `finetune()` call on the page still uses it).
5. List every file and line touched.
6. Ask before committing. Do not commit until she says yes.

## "Bake" with a finetune changes list

She pastes what the toolbar's Copy changes button copied. It looks like:

```
finetune changes · /Users/monicalin/Projects/finetune/demos/index.html
page        background: #1E1E1E
h1          font-size: 44px; letter-spacing: -0.014em
p.eyebrow   text: Meta · Redesign 2
```

The first line names the page that was edited. Each line after it is a selector, then what changed on that element: CSS declarations, and `text:` for words retyped in place (it's the element's new inner HTML). `page` is the page fill, written as one CSS `background`. `page (main.app)` means a full-page wrapper paints the page, so the fill is that element's background, not the body's.

1. Open the page named on the first line and the stylesheets it uses.
2. For each declaration, find where that property's committed value lives for that element: a custom property it reads that belongs to this page (declared in the page's own stylesheet, or a tuner's `--` key: `font-size: var(--hero-size)` means write `--hero-size`), else the rule that sets it, else add it to the rule that best matches the selector. For `page`, the `body` background, or the named wrapper's.
   - Never redefine a shared design token (declared in the project's global stylesheet, read across pages). That changes every page. Point this element at another token instead, or ask.
   - If the project's rules say a kind of value comes from tokens (colours often do), write the token whose value matches exactly on that element. Check what it resolves to there, theme included, not just its declaration. If none matches, list the line and ask, naming the nearest tokens and what each resolves to on that element.
   - `translate: X Y` is a move, always measured from where the code places the element now. If the element is placed with `left` / `top` (or custom properties feeding them), add X to its left and Y to its top there and write no translate. Other numbers that restate the current position (an old tuner's values, notes) are the starting point, not a conflict. Otherwise keep the translate.
   - `display: inline-block` came with a move, rotate, flip or resize of inline text, which ignores those otherwise. Keep it if any of them stays in the code.
3. For `text:`, replace that element's words in the HTML. If the words come from script (an `onChange`, a config value), change them there instead.
   - `group N  a, b, c` means she grouped those layers (Figma's ⌘G). Wrap them in one new element in the code, a layer of its own, where the first of them sits in the markup; name it for what it holds (ask if unsure). If they're placed with `left` / `top`, the new layer takes their shared top-left and each one's `left` / `top` becomes relative to it, so nothing moves on screen. Bake their own lines (moves, styles) first, then wrap.
   - `src: new image "name"` means she picked a different image from her computer. Ask where that file lives (or where to put it), then point the `src` at it.
   - `outline` / `outline-offset` are a Stroke (an outline, so it never moves the layout; Inside is a negative offset). `box-shadow` is the Drop and Inner shadows, `filter: blur()` is Layer blur and `backdrop-filter` is Background blur (written as `-webkit-backdrop-filter` first, then `backdrop-filter`; keep that order). On a box, `filter` also carries its Adjustments. `none` means she removed something the page had.
   - `overflow: hidden` / `visible` on a container is Clip content (Figma's checkbox).
   - `border-radius` (or `border-top-left-radius` and the other longhands, for independent corners) is Corner radius. `corner-shape: superellipse(k)` came with Corner smoothing, and its radii are already scaled for it; if the project's rules limit squircles or superellipse corners to some components, check before baking it elsewhere and ask. `mix-blend-mode` is the Blend mode row.
   - A group's Flow and Spacing are its own CSS: `display: flex` + `flex-direction` (or `display: block` for Freeform when the code had flex), and `gap` / `row-gap` / `column-gap`. Spacing on anything that isn't flex or grid comes as `translate` moves of the children, baked like any move.
   - `width` / `height` from a resize are the CSS size (padding and border already taken off for `content-box`).
   - On an SVG shape, `fill`, `stroke`, `stroke-width`, `r`, `rx`, `ry` and a rect's `width` / `height` are its own paint and geometry: write them as CSS on that shape, or change the matching attribute where the SVG is inline markup. `translate` inside an SVG is in its user units, not screen px. `transform-box: fill-box` + `transform-origin: center` came with a rotate, flip or resize (keep them while any of those stays); `vector-effect: non-scaling-stroke` came with a `scale` resize. `filter: drop-shadow()` is its Drop shadow (on an `<svg>` too, so it follows the drawing). `color` on an `<svg>` is an icon's color (its shapes paint with currentColor): write it where the icon gets its color (a class, or the component's `color` prop). `stroke-width` on an `<svg>` is a line icon's weight, unitless in its own units (Lucide's `strokeWidth` prop).
   - A `<selector> svg` line is the SVG filter that element's `filter: url(#ft-tone-…)` points at (image Temperature, Tint, Highlights, Shadows). Put that `<filter>` in one hidden `<svg width="0" height="0" style="position:absolute">` in the page, never `display: none` (that turns filters off).
   - `component <Name> (<element>, N on the page)` is a change to the component itself, so every instance changes: write it where the component styles the element it renders (its CSS rule or class, in the component's file or the stylesheet it uses), never at a place it's used. `<selector> (this <Name> only)` is one instance's own change (an Override, a move, its words): write it where that instance is used in the code (a class or style passed to it, or a modifier class on it), not in the component. If the component doesn't pass a class or style through to its element, say so and ask before changing the component.
   - `animation-name`, `animation-duration`, `-delay`, `-timing-function`, `-iteration-count`, `-direction` and `-fill-mode` are lists, one value per animation in the element's `animation-name` order. Write each into the rule's `animation` shorthand or longhands, whichever the code uses, matched by name.
   - An `animate() <properties>` line is a JavaScript animation (`element.animate()`) she tuned in Motion: "on <selector> and N more, called from <function>()" says where it runs, then each change as was → now (duration, delay, easing, iterations, direction, fill; "delay per layer" is a stagger, in the order the layers start; "keyframe N" is that keyframe's value). Find the `.animate(` call in the source (the function named, the keyframes shown as "was") and change its options and keyframes there. A stagger written as a formula (`delay: i * 50`) changes its step. If you can't find the call, list the line and ask.
   - A `@keyframes <name> (new)` line is an animation she added from Motion's generic list (Dissolve, Slide in...): add that `@keyframes` to the stylesheet the element's rule lives in, as given (its body is the keyframes, her changes included). The element lines that run it carry its `animation-*`.
   - A `@keyframes <name> <key>` line (`@keyframes hl-rise 0%`) is a keyframe she changed in Motion (its direction, distance, scale, rotation or opacity): write those declarations into that keyframe of that `@keyframes` (`0%` is `from`, `100%` is `to`), where the code defines it. Every layer using those keyframes changes with it; if another page or component uses them too, name it and ask first.
4. A line you can't place with confidence: don't guess. List it and ask.
5. Don't touch `finetune()` calls or the script tag; the inspector stays until she asks to remove it.
6. List every file and line touched, then tell her to press Reset (in the panel's top row, after Undo and Redo) so the page shows the baked code, not the saved edits.
7. Ask before committing. Do not commit until she says yes.
