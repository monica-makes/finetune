# finetune: plan for v0

Sliders for the last 10% of a design. Tune values live in the browser, copy them out, bake them into code, delete the panel.

## Why this repo exists

Every tuner in the portfolio so far was built by hand for one job and deleted once its values were baked into a `*.config.ts` or `globals.css`: the case-study "d" panel (4,000 lines), the VR surface "4" panel, the gradient lab tuner, JourneyCopyTuner, and thirty-odd dev-only `/api/*` "save to code" routes. The same parts got rebuilt every time: a draggable panel, a slider row with a readout, a token button grid, color chips with a hex field, presets, localStorage, "copy tokens", "save to code".

finetune is those parts written once, in one file, with the bake step built in, plus a Claude Code skill so a session reaches for it instead of re-deriving it.

## Name

**finetune.** The last pass on anything: an instrument, a model, a design. The base is already good; the last few values decide whether it feels right. For readers at AI companies the word lands twice, since fine-tuning a model and fine-tuning a layout are the same move. It is also the word the portfolio's own notes already use for this ("debug/finetune font").

Names inside the repo, all lowercase: repo `finetune`, library `src/finetune.js`, function `finetune()`, skill `finetune`, the two verbs are **tune** and **bake**, hotkey default `t`.

## What v0 is

The simplest version that is useful on a real prototype:

- One file, `src/finetune.js`. No dependencies, no build step. It is a classic script (`<script src="finetune.js">`) that sets `window.finetune`, so it runs from an HTML file opened straight from Finder. (Not an ES module: Chrome blocks module imports on `file://`, and that is how most prototypes get opened.) An ES module entry comes with the React hook in v1.
- One call, `finetune({...})`, declares the controls. Each control's key is the CSS custom property it writes (`--hero-size`), so the schema is also the output format. Keys without `--` only reach `onChange`, for JavaScript values like an animation speed or a line of copy.
- Five control types, the ones the old tuners actually used: `range` (slider plus a typeable number), `select` (a button grid for token vocabularies, never a dropdown), `toggle`, `color` (chips plus a hex field), `text`.
- Values apply live as CSS variables on `:root` or on a `target` selector, and through `onChange(values)`.
- Getting values out: **Copy JSON** (the values object, pastes into a config), **Copy CSS** (a `:root { ... }` block, pastes into a stylesheet), **Reset**, named **presets**. The panel remembers its last values per `id` in localStorage.
- Panel: floating, draggable by its header, toggled by a hotkey, hidden until pressed. Its look lives in one fenced block at the top of the file, a placeholder until the real panel design lands.
- A Claude Code skill (`skills/finetune/SKILL.md`) that covers the two requests: "add a tuner for X" (wire a `finetune()` call with a schema; no bespoke panel code) and "bake the tuner" (take the pasted values, write them where the committed value lives, remove the call).

Not in v0, on purpose: a React hook, a save-to-file endpoint, URL-hash sharing of a tuned state, the select-an-element mode. See "Later".

## Folder structure

```
finetune/
├── README.md                    what it is, quick start, controls, bake, the skill
├── LICENSE                      MIT
├── CLAUDE.md                    rules for Claude Code sessions in this repo
├── package.json                 name, version 0.1.0, license, no dependencies
├── .gitignore                   node_modules, .DS_Store, .claude/worktrees
├── src/
│   └── finetune.js               the whole library: panel look (fenced block), controls, apply, copy
├── demos/
│   └── index.html               a hero lockup tuned end to end; opens from file://, no server
├── skills/
│   └── finetune/
│       ├── SKILL.md             Claude Code: when to use it, "add a tuner", "bake"
│       └── references/
│           └── api.md           every option with its default, the Copy formats, the bake checklist
└── docs/
    └── PLAN.md                  this file, once the scaffold lands
```

Install the skill with `cp -r skills/finetune ~/.claude/skills/finetune`, or a symlink so it tracks the repo. For prototypes outside this repo, once it is on GitHub, the script tag can point at `https://cdn.jsdelivr.net/gh/monica-makes/finetune@main/src/finetune.js`.

## The API, v0

```html
<script src="../src/finetune.js"></script>
<script>
finetune({
  id: "hero",                 // panel title and the localStorage key
  key: "t",                   // hotkey that shows and hides the panel
  target: ":root",            // where the CSS variables are written; any selector
  controls: {
    "--hero-size":     { type: "range",  value: 40.6, min: 24, max: 96, step: 0.1, unit: "px", label: "size" },
    "--hero-weight":   { type: "select", value: 400, options: [300, 400, 500, 600], label: "weight" },
    "--hero-leading":  { type: "range",  value: 1.12, min: 0.9, max: 1.6, step: 0.01, label: "leading" },
    "--hero-tracking": { type: "range",  value: -0.02, min: -0.05, max: 0.05, step: 0.001, unit: "em", label: "tracking" },
    "--hero-ink":      { type: "color",  value: "#F6F4EF", chips: ["#F6F4EF", "#1C1914", "#C08562", "#C3D1CF"], label: "ink" },
    "--hero-italic":   { type: "toggle", value: false, on: "italic", off: "normal", label: "italic" },
    "eyebrow":         { type: "text",   value: "Meta · Redesign", label: "eyebrow" },   // no "--": onChange only
    "speed":           { type: "range",  value: 1, min: 0.25, max: 3, step: 0.05, label: "speed" },
  },
  presets: {
    committed: { "--hero-size": 40.6, "--hero-weight": 400, "--hero-leading": 1.12, "--hero-tracking": -0.02 },
  },
  onChange(values) {
    document.querySelector(".eyebrow").textContent = values.eyebrow;
  },
});
</script>
```

Rules the implementation follows:

- `select` renders as a button grid (`cols`, default 4). Options can be plain values or `{ label, value }`, so a token can read "H1 36" while writing `h1`.
- `range` writes `value + unit`. No unit means a bare number, which is right for unitless line-height and for custom properties used inside `calc()`.
- `toggle` writes `on` when true and `off` when false (defaults `1` and `0`).
- `text` is for copy. Give it a key without `--` and apply it in `onChange`.
- Copy CSS writes the `target` selector: `:root { --hero-size: 40.6px; ... }`. Copy JSON writes `{ "--hero-size": 40.6, ... }`, `onChange`-only keys included.
- Reset returns every control to its `value`. A preset sets the keys it names and leaves the rest.
- localStorage holds the last values under `finetune:<id>`. A stored key that no longer matches a control is dropped.
- The hotkey is ignored while focus is in an input, textarea or contenteditable.
- If the clipboard call is blocked, the panel shows the text in a textarea to copy by hand.
- The library never writes to disk and never persists beyond localStorage. Bake is a separate, deliberate step.

## Bake

Bake means: take the values the panel has, put them where the committed value lives, remove the panel.

By hand: Copy CSS into the stylesheet's `:root` (or Copy JSON into the config object), delete the `finetune()` call and the script tag.

With the skill: paste the Copy JSON output into the Claude Code session and say "bake the hero tuner". The skill finds the committed home of each key, writes the value, removes the call and the script tag, and lists every file and line it touched before asking to commit.

## README outline

1. **Title and tagline.** `finetune`. Sliders for the last 10% of a design: tune in the browser, copy the values, bake them into code.
2. **What it does.** Four sentences and the loop: declare → tune → copy → bake.
3. **Why not Tweakpane, lil-gui or Leva.** Those tune JavaScript objects for developers. This writes design tokens as CSS variables, snaps to token vocabularies instead of free pickers, has a path back into committed code, and is meant to be driven by Claude Code.
4. **Quick start.** The script tag, the one call, press the key. Under ten lines.
5. **Controls.** A table: range, select, toggle, color, text; what each takes.
6. **Where values go.** CSS variables on `:root` or a target; `onChange` for everything else.
7. **Getting values out.** Copy JSON, Copy CSS, reset, presets, what the panel remembers.
8. **Bake.** What it means, by hand and with the skill.
9. **With Claude Code.** Install the skill, the two phrases, what it will and won't touch.
10. **Panel design.** Placeholder for now; the look lives in one block in `finetune.js`; replaced when the design lands.
11. **Roadmap.** v0: this. v1: React hook for Next.js, dev-only save-to-file endpoint, URL-hash sharing. v2: select-an-element mode (press the key, click any unit, its panel opens).
12. **Inspiration.** liquidGL's helper GUI and its option naming, llm-council-skill's shape (a skill folder with scripts and references), Figma's property panel.
13. **License.** MIT.

## Later, not v0

- `useTrimpot()` React hook for the Next.js portfolio, same schema, plus an ES module entry.
- A dev-only save-to-file endpoint (the old `/api/*` idiom), so bake can be a button.
- URL-hash codec carrying only the diffs from defaults, so a tuned state can be sent as a link (the gradient lab had this).
- Select-an-element mode: press the key, every `[data-tune]` unit gets a dashed hit box, click one and its panel opens (the "d" mode).
- The panel's real design.

## Open

The panel's look is undecided. v0 ships a plain placeholder in one block so the design can drop in without touching the controls.
