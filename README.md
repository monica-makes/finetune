# finetune

Whether you're fine-tuning a Figma design or a website made by AI, the last tweaks are easiest by eye. finetune puts Figma's Design panel on your live page, so you can make those tweaks in the browser after handoff. Every edit bakes back into the code.

## The loop

**select → edit → Copy → bake**

1. **Select** a layer on the page, as you would on a Figma canvas. Click, shift-click, drag a marquee, double-click to go in.
2. **Edit** it in the panel: text, fills, strokes, effects, layout and auto layout, and motion. The page is the preview, so you see each change as you make it.
3. **Copy** (the toolbar's Copy, or ⇧⌘E) copies a list of every change, one line per layer.
4. **Bake.** Paste the list into Claude Code and say "bake". The skill writes each change where it lives in your code, then lists every file and line it touched.

Edits show live but stay in memory until you press Save, which keeps them in this browser. Reset forgets them and reloads the page as written, so after a bake, Reset shows you the code.

## Quick start

```html
<script src="https://cdn.jsdelivr.net/gh/monica-makes/finetune@main/src/finetune.js"></script>
<script>
  finetune({ id: "home" });
</script>
```

Open the page and the panel shows. <kbd>D</kbd> hides the panel and its overlays and brings them back (⌘\ does too, as in Figma). <kbd>⌥⌘T</kbd> flips the panel between light and dark. It works from a file opened straight from Finder, no server. [`demos/index.html`](demos/index.html) is a full example.

Two things for an app:

- In an app that changes pages without a reload (Next.js, React Router), call `finetune.remove(id)` and `finetune.toggle(false)` when the page goes away.
- Put `data-finetune-ui` on the page's own controls (its nav, its buttons), so finetune never selects them and they keep working while it's open.

The panel is set in Inter, like Figma's. If your page doesn't load Inter, finetune loads it once from Google Fonts while it's open; nothing else on your page changes.

All options: [skills/finetune/references/tuner-api.md](skills/finetune/references/tuner-api.md). How the inspector behaves: [skills/finetune/references/panel.md](skills/finetune/references/panel.md).

## With Claude Code

Install the skill once, from the repo folder:

```bash
mkdir -p ~/.claude/skills && ln -s "$PWD/skills/finetune" ~/.claude/skills/finetune
```

The symlink keeps the skill in step with the repo. `cp -r skills/finetune ~/.claude/skills/finetune` works too.

Then:

- **"Put finetune on this page."** Claude adds the script tag and one `finetune()` call. Nothing else.
- **"Bake"**, with the Copy list pasted. Claude writes each change into the code, lists every file and line it touched, and asks before committing.
- **"Add a tuner for X"** and **"Bake the hero tuner"** are for token tuners (below).

## What maps one-to-one to code

finetune only edits what's already on the page, and every edit is plain CSS on that element, written as longhands. That's why it bakes cleanly. Text is its new words, fills and colors are their CSS colors, shadows are `box-shadow`, auto layout is `display: flex` with its gap, padding and alignment, and motion is the `animation-*` properties, the `@keyframes` and the options of an `element.animate()` call.

A few things land a little differently, because CSS works differently from Figma:

- **Moves become `translate`.** Dragging, nudging, X and Y, and the align buttons all write the element's `translate`. If the code places it with `left` / `top`, the bake folds the move in there instead.
- **A ⌘G group adds a wrapper.** finetune never rewraps your live page (that breaks React), so a group only exists in the panel until the bake wraps its layers in a new element. A group with auto layout bakes as a new `div` with the flex on it. Until then it always hugs its layers, and the layers after it don't make room for it yet.
- **Gap can't go negative.** CSS has no negative gap. Spacing on a layer without auto layout can, because there it's moves.
- **A stroke is an `outline`**, so it never moves the layout. A CSS `border` in your code doesn't show as a stroke.
- **Delete hides the layer.** The bake takes it out of the code.
- **Inline text gets `display: inline-block`** the first time you move, turn or resize it, since inline text ignores those otherwise.
- **Blurs are Figma's numbers**, twice the CSS radius.
- **Corner smoothing is CSS `corner-shape`**, with the radii scaled to match Figma's curve. Not every browser draws it yet.
- **A replaced image** shows right away, but the bake asks where the file should live.
- **An icon's weight, or which icon it is,** is a prop in your code, not CSS, so the panel leaves those alone.
- **Never copied:** the layout grid (it's for placing things) and Motion's playback speed (it's for watching slowly).

## Motion: what it can tune

The inspector's Motion tab tunes animations the code already has, so you can describe one to Claude Code and then get its timing right by eye. It reads them from the page:

- **CSS animations** (`@keyframes` and the `animation` properties). Layers that run the same keyframes are one group, tuned together, with a stagger.
- **JavaScript animations made with `element.animate()`**, the browser's own animation call, and libraries built on it. finetune watches every call, so an edit also applies to the next time the page runs it. The bake changes the call's options in your code.
- **CSS animations that haven't started yet**, waiting on a class the page adds later (on scroll, on a click). Play adds that class, so you don't have to scroll to see them.

It can also add a CSS animation to anything on the page (an element, a text, a group): pick one of the page's own `@keyframes`, or one of Figma's generic ones (Dissolve, Move in, Move out, Push, Slide in, Slide out), then tune it. A generic one is added to the page as a new `@keyframes`, and the bake adds it to your code.

What it can't tune:

- **Libraries that animate frame by frame themselves**, like GSAP or most of Motion for React (Framer Motion). They change a style on every frame and leave no animation for the browser to read: no duration, no easing.
- **An animation that starts some other way** (a hover, an attribute, a class on a page it can't see) until it has started.
- **CSS transitions.** Motion is for animations; transitions stay in the code.

## Token tuners

Sometimes you want a few sliders for values you're still deciding, like a hero's size or a brand color. Pass `controls` and finetune adds a small panel of them. Each control writes a CSS custom property live as you drag.

```js
finetune({
  id: "hero",
  controls: {
    "--hero-size": { type: "range", value: 40, min: 24, max: 96, unit: "px" },
  },
});
```

Anything that reads `var(--hero-size)` updates as you drag.

### Controls

| type | writes | takes |
| --- | --- | --- |
| `range` | `value + unit` | `min`, `max`, `step`, `unit`. A slider plus a number you can type. |
| `select` | the chosen option | `options` as plain values or `{ label, value }`, `cols`. A button grid, never a dropdown. |
| `toggle` | `on` or `off` | `on` and `off` (default `1` and `0`). |
| `color` | a hex | `chips`. Chips plus a hex field. |
| `text` | the text | For copy. Use a key without `--` and apply it in `onChange`. |

Every control takes `value` and `label`. All options and their defaults: [skills/finetune/references/tuner-api.md](skills/finetune/references/tuner-api.md).

### Where values go

A key that starts with `--` is a CSS custom property. finetune writes it on `target` (default `:root`; any selector works), so any CSS that reads it updates live.

A key without `--` never touches CSS. It only reaches `onChange(values)`, which gets every value on load and after every change. Use it for JavaScript values like an animation speed or a line of copy.

### Getting values out

- **Copy JSON** copies the values object, `onChange`-only keys included: `{ "--hero-size": 40.6, ... }`. Paste it into a config.
- **Copy CSS** copies a block for the target: `:root { --hero-size: 40.6px; ... }`. Paste it into a stylesheet.
- **Reset** puts every control back to its `value`.
- **Presets** set the keys they name and leave the rest.

The panel remembers its last values per `id` in localStorage. A stored key that no longer matches a control is dropped. If the browser blocks the clipboard, the panel shows the text so you can copy it by hand.

### Bake a tuner

Bake means: take the values the panel has, put them where the committed value lives, and remove the panel. finetune itself never writes to disk.

- **By hand.** Paste Copy CSS into the stylesheet's `:root` (or Copy JSON into the config object). Then delete the `finetune()` call and its script tag.
- **With the skill.** Ask Claude Code to "add a tuner for X" and it writes one `finetune()` call with one control per value you named. When it looks right, paste the Copy JSON and say "bake the hero tuner".

### Why not Tweakpane, lil-gui or Leva

Those tune JavaScript objects for developers. finetune's tuners are for design tokens:

- They write CSS variables, so the schema is also the output format.
- They snap to token vocabularies (a button grid of your type scale, chips of your colors) instead of free pickers.
- They have a path back into committed code: Copy JSON, Copy CSS, and a bake step.
- They're meant to be driven by Claude Code, through the skill in `skills/finetune`.

The closest tools each cover part of this. [Knobs](https://github.com/yairEO/knobs) binds a floating panel to CSS variables, but has no token snapping and no way back into code. [Tweakcn](https://tweakcn.com) edits CSS variables and copies the CSS out, but only for shadcn's theme, on its own site rather than on your page.

## Panel design

It's built from Figma's own component library, [UI3: Figma's UI Kit](https://www.figma.com/design/sAdoR4tEPh4cSbicxGYzUA/UI3--Figma-s-UI-Kit--Community-): its colours (light and dark), icons and type, so the panel stays consistent with the tool most designers already know. It follows your system's theme; ⌥⌘T (Ctrl+Alt+T on Windows) flips it.

The whole look lives in one block at the top of `src/finetune.js`, marked PANEL LOOK. The tuners' panel is still a plain placeholder there.

## Roadmap

- **Today**: one script with the Design panel (select, edit, Copy, bake), Motion, token tuners, and the skill.
- **Next**: a React hook for Next.js, a dev-only save-to-file endpoint, URL-hash sharing of a tuned state.
- **Noted**: a way to turn the how-to tips off for good, for people who already know them (today a tip's × hides it for the session or for this browser).

## Inspiration

- [liquidGL](https://github.com/naughtyduk/liquidGL)'s helper GUI and its option naming.
- llm-council-skill's shape: a skill folder with scripts and references.
- Figma's property panel.

## License

MIT. See [LICENSE](LICENSE).
