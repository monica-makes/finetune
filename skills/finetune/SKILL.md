---
name: finetune
description: Use whenever a prototype needs sliders or pickers to tune values live in the browser, a finetune tuner's values need to be baked into code, or a pasted message starts "Bake these finetune changes" (the inspector's Copy changes list, which asks for the bake itself).
---

# finetune

`src/finetune.js` is one classic script. A `finetune()` call adds a tuner panel; each control's key is the CSS custom property it writes, and a key without `--` only reaches `onChange`. The page also gets an inspector, whose Copy changes button copies a list of edits to bake. This skill does three jobs and nothing else. Each job names the one reference it needs; read only that one.

## 1. Add a tuner (or just put finetune on a page)

Reference: `references/tuner-api.md` (every option, control and default).

1. Asked only to put finetune on a page: the inspector only, no tuner and no controls unless she names values to tune. Load the library (step 4), call `finetune({ id: "<page>" })` with no `controls`, then do steps 7 and 8.
2. Find where each named value lives now: a CSS custom property (usually in a stylesheet's `:root`) or a value in a config or script.
3. If a named value is hard-coded and not a custom property yet, say so and ask before turning it into one.
4. Load the library once with a classic script tag, never `type="module"`:
   - inside this repo, a relative path to `src/finetune.js`;
   - anywhere else, `https://cdn.jsdelivr.net/gh/monica-makes/finetune@main/src/finetune.js`.
5. Write one `finetune({ ... })` call:
   - `id` named after the thing being tuned (`"hero"`).
   - One control per named value. No extra controls, no presets unless asked.
   - Each key is the CSS custom property it writes (`--hero-size`). A JavaScript-only value (a speed, a line of copy) gets a key without `--` and is applied in `onChange`.
   - `value` is the committed value today, so the panel opens on what ships.
   - Type: a number is `range` (with `min`, `max`, `step`, `unit` around the current value); a token vocabulary is `select` (a button grid, never a dropdown); on/off is `toggle`; a color is `color` with chips from the colors the project already uses; copy is `text`.
6. No bespoke panel code, no styling, no wrappers around the panel. The look lives in the library's PANEL LOOK block.
7. In an app that changes pages without a reload (Next.js, React Router), call `finetune.remove(id)` and `finetune.toggle(false)` when the page goes away.
8. Tell her the id (for a tuner) and the hotkey (D). Stop.

## 2. Bake a tuner

She pastes a tuner panel's Copy JSON. Reference: `references/bake.md`, "Bake a tuner" (the full checklist).

1. Find the `finetune()` call with that `id`.
2. Write each value where its committed value lives, in that file's format: a `range` gets its `unit`, a `toggle` writes its `on` or `off`. Skip values that already match.
3. A key with no committed home: don't invent one. List it and ask.
4. Remove the `finetune()` call, code that only fed it, and the script tag that loads `finetune.js` (keep the tag if another `finetune()` call on the page still uses it).
5. List every file and line touched.
6. Ask before committing. Do not commit until she says yes.

## 3. Bake the inspector's changes list

She pastes what Copy changes copied, with nothing else to say: the paste is the ask. Its first line asks for the bake (`Bake these finetune changes into the code with the finetune skill:`); then the header `finetune changes · <page path> · <width>×<height>`, the page's theme when it has one, then one line per changed element, each ending its first column with ` @ file:line` when the dev build records where the element is written. Reference: `references/bake.md`, from "The changes list" to the end.

1. Read that part of `bake.md` before touching code. Every kind of line has its rule there: where a value goes, tokens, `translate` moves, groups and a group's auto layout (wrap in a new element), container auto layout, deletes, duplicates (a `duplicate of <selector>` line: copy the original's element in the code, right after it, once the original's own lines are baked; the rest of the line is the copy's own edits), ungroups (take the wrapper out, keep its children in its place, carry over what they inherited from it; ask first if it had a look of its own, a tag that means something or is a component, or sat in a grid or flex row), new images, strokes and effects (`-webkit-backdrop-filter` first, then `backdrop-filter`), corners, sizes (a resize's `/* <selector>: <property>: <value> ... */` notes: a pinned axis, an added `object-fit: cover`, an added `align-self: start`), K scales (a `scaled f x (K)` comment line; a single-length token becomes `calc(<token> * f)`, never a whole list), styles defined in code (a `var(--x)` colour is that token, and a `text style .x` note means add the class, never the values behind either), SVG, components and motion.
2. Open the page named on the header line (a file path, or a route: the file its router renders, mapped for React Router, Next and TanStack in step 1 of "Bake the changes list") and the stylesheets it uses, and each line's `@` file (no `@`: find the element by its selector's classes, same step). No such line: ask which page. A `changed at Npx wide` / `changed in dark` note or a `columns a-b of N` note under a line changes where it goes (see "The changes list"). An `(item "Team", 2 of 3)` part names one item of a React list: write it for that item (its data), not the shared JSX, unless every item has a line with the same change. A `component X variant=v` line goes into that variant's cva entry, not the base string; `; k inside Y` means k of its instances are rendered by component Y and change with it. A `not found, the page changed` note followed by commented-out lines is an edit that no longer matches the page (its values are those lines), and a `built in code` note is words the code computes: list either and ask. An `its words were` note: check the element is the one she meant.
3. Bake the design she ended with, not the moves that got there ("Bake the design, not the moves" in `bake.md`): big moves become layout in the markup, deleted labels retyped into values stay label + value, one set gets one rule, earlier passes a later line covers are dropped; show the plan first when it restructures markup. Then bake each line by its rule. Never redefine a shared design token, and never write a `:nth-of-type()` edit into the rule its siblings share. On a Tailwind project, write utilities in the element's `className`, replacing the one on the same property rather than appending (a `className` passed to a component wins only through a tailwind-merge `cn`), tokens first, at the breakpoint and theme the edit was seen in ("Tailwind projects" in `bake.md`).
4. A line you can't place with confidence: don't guess. List it and ask.
5. Leave `finetune()` calls and the script tag in place (the one exception, a tuner's `value`, is step 5 of "Bake the changes list").
6. List every file and line touched, then tell her to press Reset, and a tuner panel's Reset if its `value` changed (step 6 there).
7. Ask before committing. Do not commit until she says yes.
