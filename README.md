# finetune

Sliders for the last 10% of a design: tune in the browser, copy the values, bake them into code.

**[Live demo](https://monica-makes.github.io/finetune/demos/)** · press <kbd>T</kbd> to open the panel.

## What it does

finetune puts a small floating panel on any HTML page. You declare the values you want to tune, and each control writes a CSS custom property live as you drag. When it looks right, you copy the values out as JSON or CSS. Then you bake them into the committed code and delete the panel.

**declare → tune → copy → bake**

## Why not Tweakpane, lil-gui or Leva

Those tune JavaScript objects for developers. finetune is for design tokens:

- It writes CSS variables, so the schema is also the output format.
- It snaps to token vocabularies (a button grid of your type scale, chips of your colors) instead of free pickers.
- It has a path back into committed code: Copy JSON, Copy CSS, and a bake step.
- It is meant to be driven by Claude Code, through the skill in `skills/finetune`.

## Quick start

```html
<script src="https://cdn.jsdelivr.net/gh/monica-makes/finetune@main/src/finetune.js"></script>
<script>
  finetune({
    id: "hero",
    controls: {
      "--hero-size": { type: "range", value: 40, min: 24, max: 96, unit: "px" },
    },
  });
</script>
```

Open the page and press <kbd>T</kbd>. Anything that reads `var(--hero-size)` updates as you drag. It works from a file opened straight from Finder, no server. [`demos/index.html`](demos/index.html) is a full example.

## Controls

| type | writes | takes |
| --- | --- | --- |
| `range` | `value + unit` | `min`, `max`, `step`, `unit`. A slider plus a number you can type. |
| `select` | the chosen option | `options` as plain values or `{ label, value }`, `cols`. A button grid, never a dropdown. |
| `toggle` | `on` or `off` | `on` and `off` (default `1` and `0`). |
| `color` | a hex | `chips`. Chips plus a hex field. |
| `text` | the text | For copy. Use a key without `--` and apply it in `onChange`. |

Every control takes `value` and `label`. All options and their defaults: [skills/finetune/references/api.md](skills/finetune/references/api.md).

## Where values go

A key that starts with `--` is a CSS custom property. finetune writes it on `target` (default `:root`; any selector works), so any CSS that reads it updates live.

A key without `--` never touches CSS. It only reaches `onChange(values)`, which gets every value on load and after every change. Use it for JavaScript values like an animation speed or a line of copy.

## Getting values out

- **Copy JSON** copies the values object, `onChange`-only keys included: `{ "--hero-size": 40.6, ... }`. Paste it into a config.
- **Copy CSS** copies a block for the target: `:root { --hero-size: 40.6px; ... }`. Paste it into a stylesheet.
- **Reset** puts every control back to its `value`.
- **Presets** set the keys they name and leave the rest.

The panel remembers its last values per `id` in localStorage. A stored key that no longer matches a control is dropped. If the browser blocks the clipboard, the panel shows the text so you can copy it by hand.

## Bake

Bake means: take the values the panel has, put them where the committed value lives, and remove the panel. finetune itself never writes to disk.

- **By hand.** Paste Copy CSS into the stylesheet's `:root` (or Copy JSON into the config object). Then delete the `finetune()` call and its script tag.
- **With the skill.** Paste the Copy JSON into a Claude Code session and say "bake the hero tuner".

## With Claude Code

Install the skill once, from the repo folder:

```bash
mkdir -p ~/.claude/skills && ln -s "$PWD/skills/finetune" ~/.claude/skills/finetune
```

The symlink keeps the skill in step with the repo. `cp -r skills/finetune ~/.claude/skills/finetune` works too.

Then two phrases:

- **"Add a tuner for X."** Claude writes one `finetune()` call with one control per value you named, keys named after the CSS variables they write. No custom panel code, nothing you didn't name.
- **"Bake the hero tuner."** Paste the Copy JSON first. Claude writes each value where it lives, removes the call and the script tag, lists every file and line it touched, and asks before committing.

## Panel design

The panel is a plain placeholder for now. Its whole look lives in one block at the top of `src/finetune.js`, marked PANEL LOOK, so the real design can replace it without touching the controls.

## Roadmap

- **v0**, this: one script, five controls, copy, presets, the skill.
- **v1**: a React hook for Next.js, a dev-only save-to-file endpoint, URL-hash sharing of a tuned state.
- **v2**: select-an-element mode. Press the key, click any unit on the page, and its panel opens.

## Inspiration

- [liquidGL](https://github.com/naughtyduk/liquidGL)'s helper GUI and its option naming.
- llm-council-skill's shape: a skill folder with scripts and references.
- Figma's property panel.

## License

MIT. See [LICENSE](LICENSE).
