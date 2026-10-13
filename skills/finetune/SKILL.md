---
name: finetune
description: Use whenever a prototype needs sliders or pickers to tune values live in the browser, or a finetune tuner's values need to be baked into code.
---

# finetune

finetune is one classic script, `src/finetune.js`, that puts a floating panel of controls on a page. Each control's key is the CSS custom property it writes. Keys without `--` only reach `onChange`. It also has a Figma-style inspector for editing what's already on the page: select an element, retype it, restyle it. This skill covers three requests and nothing else.

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
   - A `<selector> svg` line is the SVG filter that element's `filter: url(#ft-tone-…)` points at (image Temperature, Tint, Highlights, Shadows). Put that `<filter>` in one hidden `<svg width="0" height="0" style="position:absolute">` in the page, never `display: none` (that turns filters off).
4. A line you can't place with confidence: don't guess. List it and ask.
5. Don't touch `finetune()` calls or the script tag; the inspector stays until she asks to remove it.
6. List every file and line touched, then tell her to press Reset (at the right of the panel's Design header) so the page shows the baked code, not the saved edits.
7. Ask before committing. Do not commit until she says yes.
