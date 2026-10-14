/*
  finetune v0.1.0 · MIT · https://github.com/monica-makes/finetune
  Sliders for the last 10% of a design: tune in the browser, copy the values,
  bake them into code.

  A classic script on purpose, not an ES module: Chrome blocks module imports
  on file://, and most prototypes are opened straight from Finder.
*/
(function () {
  "use strict";

  /* ==========================================================================
     PANEL LOOK
     The whole look lives in this block; to change it, change only this block.
     .ft-inspector, .ft-pop (the color picker) and .ft-tip: the real design,
     in progress. The container
     follows pen.dev; everything inside follows Figma UI3.
     .ft-panel: the controls panel, still a plain placeholder.
     ========================================================================== */
  const PANEL_LOOK = `
/* The panel's colours, on everything of finetune's own that sits on the page, so none takes the page's colours. */
.ft-inspector, .ft-toolbar, .ft-ui {
  --ft-i-bg: #F8F8F8;
  --ft-i-border: #E3E3E3;
  --ft-i-line: #E6E6E6;
  --ft-i-field: rgba(0, 0, 0, 0.05);
  --ft-i-hover: rgba(0, 0, 0, 0.06);
  --ft-i-stroke: rgba(0, 0, 0, 0.14);
  --ft-i-focus: #0D99FF;
  --ft-i-text: rgba(0, 0, 0, 0.9);
  --ft-i-text-2: rgba(0, 0, 0, 0.5);
}
.ft-inspector {
  position: fixed; top: 12px; right: 12px; z-index: 2147483646;
  width: 240px; max-height: calc(100vh - 24px); overflow: hidden auto;
  background: var(--ft-i-bg); border: 1px solid var(--ft-i-border); border-radius: 8px;
  color: var(--ft-i-text);
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  cursor: default; user-select: none;
}
.ft-inspector[hidden] { display: none; }
.ft-inspector *, .ft-inspector *::before, .ft-inspector *::after { box-sizing: border-box; }
.ft-inspector :where(button, input) {
  font: inherit; letter-spacing: inherit; color: inherit;
  margin: 0; padding: 0; border: 0; background: none; outline: none;
}
/* The panel's top row: Undo, Redo and Reset at the left, Hide UI over its right end. */
.ft-top {
  position: sticky; top: 0; z-index: 1; display: flex; padding: 12px 8px 8px;
  background: var(--ft-i-bg); border-bottom: 1px solid var(--ft-i-line);
}
/* Hide UI sits over the right end of the panel's top row (the panel is 12 from the right with a 1px border; the
   row is 12 from the top and 8 in), outside the panel so it stays when the panel goes. The -5px margin under
   the 4px padding and 1px border keeps the icon where it is when the box shows. */
.ft-ui {
  position: fixed; top: 25px; right: 21px; z-index: 2147483646; display: flex; margin: -5px; padding: 4px;
  border: 1px solid transparent; border-radius: 8px; color: var(--ft-i-text); cursor: default; user-select: none;
}
.ft-ui[hidden] { display: none; }
.ft-ui :where(button) { margin: 0; padding: 0; border: 0; background: none; color: inherit; outline: none; font: inherit; }
.ft-ui[data-min] { background: var(--ft-i-bg); border-color: var(--ft-i-border); }
.ft-actions { display: flex; }
/* Every floating box (the panel, the toolbar, this bar, popovers, menus, the toast) has the panel's 8px corners;
   a cell inside one sits 4px in, so its corners are 4px.
   Design and Motion, at the bottom of the window like Figma's toolbar: one bar of cells, each with its icon
   and its name; the chosen one sits in a cell of its own with the blue icon. It takes the page's theme:
   light on a light page, Figma's dark on a dark one (data-theme, set from the page's background). */
.ft-modes {
  --ft-m-bg: #FFFFFF; --ft-m-text: rgba(0, 0, 0, 0.7); --ft-m-on: rgba(0, 0, 0, 0.9); --ft-m-cell: rgba(0, 0, 0, 0.06);
  --ft-m-hover: rgba(0, 0, 0, 0.04); --ft-m-icon: #0D99FF;
  position: fixed; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; gap: 4px; padding: 4px;
  border-radius: 8px; background: var(--ft-m-bg);
  box-shadow: 0 0 0.5px rgba(0, 0, 0, 0.18), 0 3px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.ft-modes[data-theme="dark"] {
  --ft-m-bg: #2C2C2C; --ft-m-text: rgba(255, 255, 255, 0.8); --ft-m-on: #FFFFFF; --ft-m-cell: #1E1E1E;
  --ft-m-hover: rgba(255, 255, 255, 0.06); --ft-m-icon: #7CC4F8;
}
.ft-modes-btn {
  display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px 0 6px; border-radius: 4px;
  color: var(--ft-m-text);
}
.ft-modes-btn svg { display: block; width: 20px; height: 20px; }
.ft-modes-btn:hover { background: var(--ft-m-hover); }
.ft-modes-btn[aria-selected="true"] { background: var(--ft-m-cell); color: var(--ft-m-on); }
.ft-modes-btn[aria-selected="true"] svg { color: var(--ft-m-icon); }
.ft-icon-btn:disabled { opacity: 0.4; pointer-events: none; }
.ft-toast {
  position: fixed; left: 50%; bottom: 24px; z-index: 2147483647; transform: translateX(-50%);
  padding: 8px 12px; border-radius: 8px; background: #1E1E1E; color: #FFFFFF; pointer-events: none;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-toast[hidden] { display: none; }
.ft-pane[hidden] { display: none; }
/* The last divider would sit on the panel's own border and read as a double line. Motion is empty, so
   there the top row's divider is the last one. */
.ft-pane > .ft-section:last-child, .ft-chosen > .ft-section:last-child { border-bottom: 0; }
.ft-inspector[data-tab="motion"] .ft-top { border-bottom: 0; }
.ft-section { padding: 0 8px 12px 16px; border-bottom: 1px solid var(--ft-i-line); }
.ft-section-head { display: flex; align-items: center; justify-content: space-between; height: 40px; font-weight: 550; }
.ft-fills { display: flex; flex-direction: column; gap: 8px; }
.ft-icon-btn { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 5px; }
.ft-icon-btn:hover { background: var(--ft-i-hover); }
.ft-icon-btn svg { display: block; width: 16px; height: 16px; }
.ft-fill-row { display: flex; align-items: center; gap: 8px; }
.ft-fill-actions { display: flex; flex: none; }
/* Once any row has a remove button, rows without one keep its gap so every field is the same width. */
.ft-fills:has(.ft-fill-remove) .ft-fill-row:not(:has(.ft-fill-remove)) .ft-fill-actions::before { content: ""; width: 24px; }
.ft-fill {
  display: flex; flex: 1; min-width: 0; height: 24px; border-radius: 5px;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px transparent;
}
.ft-fill:hover { box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-fill:has(input:focus) { box-shadow: inset 0 0 0 1px var(--ft-i-focus); }
.ft-fill-color { position: relative; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; padding-left: 5px; }
.ft-swatch {
  flex: none; width: 14px; height: 14px; border-radius: 2px;
  background:
    linear-gradient(90deg, var(--ft-c) 50%, transparent 50%),
    linear-gradient(var(--ft-ca), var(--ft-ca)),
    repeating-conic-gradient(#D9D9D9 0 25%, #FFFFFF 0 50%) 0 0 / 6px 6px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}
.ft-hex, .ft-alpha { width: 100%; min-width: 0; height: 24px; }
.ft-fill-alpha {
  display: flex; align-items: center; flex: none; width: 52px; padding: 0 8px;
  border-left: 1px solid var(--ft-i-bg);
}
.ft-fill:hover .ft-fill-alpha { border-left-color: var(--ft-i-stroke); }
.ft-fill:has(input:focus) .ft-fill-alpha { border-left-color: var(--ft-i-focus); }
.ft-pct { color: var(--ft-i-text-2); }
.ft-fill-row.is-hidden .ft-fill-color, .ft-fill-row.is-hidden .ft-fill-alpha > * { opacity: 0.4; }
/* An effect's row: its settings, its type, then remove and the eye, as in Figma. */
.ft-fx-type { flex: 1; }
.ft-fx-row.is-hidden > .ft-icon-btn, .ft-fx-row.is-hidden .ft-fx-type { opacity: 0.4; }
.ft-stroke { display: flex; flex-direction: column; gap: 8px; }
/* The layer's kind, read from the code (Group, Text, Image, Vector, SVG, Box), and its element, as Figma's
   header names the layer; Figma's tools on that line are left out. */
.ft-kind { display: flex; align-items: baseline; gap: 8px; min-width: 0; padding: 12px 8px 12px 16px; border-bottom: 1px solid var(--ft-i-line); }
.ft-kind-name { flex: none; font-weight: 550; }
.ft-kind-el { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ft-i-text-2); }
/* A section with nothing under its head (Fill, Stroke or Effects before the +) is just the head, as in Figma. */
.ft-section:has(> .ft-section-head + :is(.ft-fills, .ft-stroke):empty:last-child) { padding-bottom: 0; }
.ft-section > :is(.ft-fills, .ft-stroke):empty { display: none; }

/* Inside the panel, overlays stack in a set order over its rows (a faded row, at 40% opacity, is a layer
   of its own and would otherwise paint over them): popovers, then the color picker opened from one, then menus. */
.ft-pop {
  position: fixed; z-index: 2; width: 240px; background: #FFFFFF; border-radius: 8px;
  box-shadow: 0 0 0.5px rgba(0, 0, 0, 0.15), 0 5px 12px rgba(0, 0, 0, 0.13), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.ft-pop[hidden] { display: none; }
/* A part a popover leaves out (a box's Adjustments have no fit or preview); its own display would show it. */
.ft-pop-body > [hidden] { display: none !important; }
.ft-pop.ft-picker-pop { z-index: 3; }
.ft-pop-head {
  display: flex; align-items: center; justify-content: space-between;
  height: 40px; padding: 0 8px 0 16px; border-bottom: 1px solid var(--ft-i-line); font-weight: 550;
}
.ft-pop-body { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
.ft-sv {
  position: relative; height: 208px; border-radius: 2px; touch-action: none;
  background: linear-gradient(to top, #000000, transparent), linear-gradient(to right, #FFFFFF, var(--ft-hue));
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.ft-pop-tools { display: flex; align-items: center; gap: 12px; }
.ft-sliders { display: flex; flex-direction: column; gap: 16px; flex: 1; min-width: 0; }
.ft-track { position: relative; height: 12px; border-radius: 6px; touch-action: none; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06); }
.ft-hue { background: linear-gradient(90deg, #F00 0%, #FF0 16.67%, #0F0 33.33%, #0FF 50%, #00F 66.67%, #F0F 83.33%, #F00 100%); }
.ft-alpha-track {
  background:
    linear-gradient(90deg, transparent, var(--ft-c)),
    repeating-conic-gradient(#D9D9D9 0 25%, #FFFFFF 0 50%) 0 0 / 8px 8px;
}
.ft-knob {
  position: absolute; top: 50%; left: calc(6px + var(--ft-x, 0) * (100% - 12px));
  width: 14px; height: 14px; border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%); background: var(--ft-k);
  box-shadow: inset 0 0 0 3px #FFFFFF, 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
}
.ft-sv-knob {
  top: calc(var(--ft-y, 0) * 100%); left: calc(var(--ft-x, 0) * 100%);
  width: 12px; height: 12px;
  box-shadow: inset 0 0 0 2px #FFFFFF, 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
}
.ft-pop-row { display: flex; gap: 8px; }
.ft-channels { display: flex; flex: 1; min-width: 0; }
.ft-channel { flex: 1; min-width: 0; height: 24px; padding-left: 8px; }
.ft-channel + .ft-channel { border-left: 1px solid var(--ft-i-bg); }
.ft-fill:hover .ft-channel + .ft-channel { border-left-color: var(--ft-i-stroke); }
.ft-fill:has(input:focus) .ft-channel + .ft-channel { border-left-color: var(--ft-i-focus); }
.ft-select {
  display: flex; align-items: center; justify-content: space-between; gap: 4px;
  height: 24px; padding: 0 4px 0 8px; border: 1px solid var(--ft-i-line); border-radius: 5px;
}
.ft-select:hover { border-color: var(--ft-i-stroke); }
.ft-mode { flex: none; min-width: 54px; }
.ft-menu {
  position: fixed; z-index: 4; min-width: 104px; max-height: calc(100vh - 16px); overflow-y: auto; padding: 8px;
  background: #1E1E1E; color: #FFFFFF; border-radius: 8px;
  box-shadow: 0 0 0.5px rgba(0, 0, 0, 0.15), 0 5px 12px rgba(0, 0, 0, 0.13), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.ft-menu[hidden] { display: none; }
.ft-menu-item {
  display: flex; align-items: center; gap: 4px; width: 100%; height: 24px;
  padding: 0 16px 0 4px; border-radius: 5px; text-align: left; white-space: nowrap;
}
.ft-menu-item:hover { background: #0D99FF; }
.ft-menu-check { display: grid; place-items: center; width: 16px; height: 16px; }
.ft-menu-check svg { display: block; width: 12px; height: 12px; }
.ft-menu-heading { padding: 6px 8px 4px 24px; font-size: 11px; color: rgba(255, 255, 255, 0.5); white-space: nowrap; }
.ft-menu-heading:not(:first-child) { margin-top: 4px; }
.ft-menu-trash { display: grid; place-items: center; flex: none; width: 20px; height: 20px; margin: 0 -12px 0 auto; padding-left: 8px; opacity: 0; }
.ft-menu-item:hover .ft-menu-trash { opacity: 1; }
.ft-menu-trash svg { display: block; width: 12px; height: 12px; }
.ft-caret { display: grid; place-items: center; width: 16px; height: 16px; color: var(--ft-i-text-2); }
.ft-caret svg { display: block; width: 10px; height: 10px; }

.ft-tip {
  position: fixed; z-index: 2147483647; pointer-events: none;
  padding: 4px 8px; border-radius: 5px; background: #1E1E1E; color: #FFFFFF;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.ft-tip[hidden] { display: none; }
.ft-tip-key { margin-left: 8px; color: rgba(255, 255, 255, 0.5); }
.ft-tip::before {
  content: ""; position: absolute; top: -4px; left: calc(var(--ft-caret, 50%) - 4px);
  border-style: solid; border-width: 0 4px 4px; border-color: transparent transparent #1E1E1E;
}
.ft-tip[data-side="right"]::before {
  top: calc(50% - 4px); left: -5px;
  border-width: 4px 5px 4px 0; border-color: transparent #1E1E1E transparent transparent;
}

.ft-toolbar {
  position: fixed; top: 12px; left: 12px; z-index: 2147483646;
  display: flex; flex-direction: column; padding: 8px;
  background: var(--ft-i-bg); border: 1px solid var(--ft-i-border); border-radius: 8px;
  color: var(--ft-i-text); cursor: default; user-select: none;
}
.ft-toolbar[hidden] { display: none; }
.ft-toolbar, .ft-toolbar * { box-sizing: border-box; }
.ft-toolbar :where(button) { margin: 0; padding: 0; border: 0; background: none; color: inherit; outline: none; }
.ft-tool { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 5px; }
.ft-tool:hover { background: var(--ft-i-hover); }
.ft-tool[aria-pressed="true"] { background: rgba(0, 0, 0, 0.08); }
.ft-tool svg { display: block; width: 20px; height: 20px; }

.ft-type { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-right: 32px; }
.ft-span2 { grid-column: 1 / -1; }
.ft-dd, .ft-num-field {
  display: flex; align-items: center; min-width: 0; height: 24px; border-radius: 5px;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px transparent;
}
.ft-dd { justify-content: space-between; gap: 4px; padding: 0 4px 0 8px; text-align: left; }
.ft-dd-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-dd:hover, .ft-num-field:hover { box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-num-field:has(input:focus) { box-shadow: inset 0 0 0 1px var(--ft-i-focus); }
.ft-field-icon { display: grid; place-items: center; flex: none; width: 24px; height: 24px; color: var(--ft-i-text-2); }
.ft-field-icon svg { display: block; width: 12px; height: 12px; }
.ft-field-letter { color: var(--ft-i-text); }
.ft-num-input { flex: 1; min-width: 0; height: 24px; padding-left: 8px; }
.ft-field-icon + .ft-num-input { padding-left: 0; }
.ft-field-caret { display: grid; place-items: center; flex: none; width: 20px; height: 24px; color: var(--ft-i-text-2); }
.ft-field-caret svg { display: block; width: 10px; height: 10px; }
.ft-labeled { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
/* Figma's property labels are smaller than its values: Inter at 9.5px, measured off a Figma screenshot. */
.ft-field-label { color: var(--ft-i-text-2); font-size: 9.5px; }
.ft-type-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
/* Figma's segmented boxes: each button its own grey cell, 1px apart so the panel shows between them, the
   group's outer corners rounded. Hover darkens a cell; the chosen one is white. */
.ft-seg { display: flex; gap: 1px; height: 24px; }
.ft-seg-btn { display: grid; place-items: center; flex: 1; height: 24px; background: var(--ft-i-field); }
.ft-seg-btn:first-child { border-radius: 5px 0 0 5px; }
.ft-seg-btn:last-child { border-radius: 0 5px 5px 0; }
.ft-seg-btn:hover { background: rgba(0, 0, 0, 0.1); }
.ft-seg-btn[aria-pressed="true"] { background: #FFFFFF; box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-seg-btn svg { display: block; width: 16px; height: 16px; }
.ft-head-actions, .ft-btn-group { display: flex; }
/* Figma's layout guides: drawn over the page, one layer each, never in the way of a click. */
.ft-guides { position: fixed; inset: 0; z-index: 2147483644; pointer-events: none; }
.ft-inspector[hidden] ~ .ft-guides, .ft-inspector[hidden] ~ .ft-panel { display: none; }
.ft-guides > div { position: absolute; inset: 0; box-sizing: border-box; }
.ft-guide-list { display: flex; flex-direction: column; gap: 8px; }
.ft-guide { display: flex; flex-direction: column; gap: 8px; }
.ft-guide-row { display: flex; align-items: center; gap: 8px; }
/* Full width of the section. */
.ft-guide-align { display: flex; flex-direction: column; gap: 4px; }
.ft-type.ft-guide-set { margin-right: 0; }
/* No layout yet: a warning, then a way to add one. */
.ft-guide-empty { display: flex; flex-direction: column; gap: 8px; }
.ft-guide-warn { display: flex; align-items: center; gap: 6px; color: var(--ft-i-text-2); }
.ft-guide-warn svg { display: block; flex: none; width: 16px; height: 16px; }
/* Save as style: where it applies, two buttons in place. */
.ft-pop.ft-save-pop { width: auto; }
.ft-save-body { display: flex; flex-direction: column; gap: 6px; padding: 8px; }
/* Plain until she points at one, as in Figma's option lists: no choice looks picked before she's touched it. */
.ft-choice { height: 28px; padding: 0 12px; border-radius: 5px; background: none; text-align: left; white-space: nowrap; }
.ft-choice:hover { background: var(--ft-i-field); }
/* Figma's secondary button: white, a hairline border, the + left of a centered label. */
.ft-choice.ft-choice-icon {
  display: flex; align-items: center; justify-content: center; gap: 4px; height: 24px; padding: 0 8px;
  background: #FFFFFF; box-shadow: inset 0 0 0 1px var(--ft-i-line); font-weight: 500;
}
.ft-choice.ft-choice-icon:hover { background: var(--ft-i-hover); box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-choice-icon svg { display: block; width: 12px; height: 12px; }
.ft-seg-act .ft-seg-btn:active { background: #FFFFFF; box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-guide-row > .ft-dd { flex: 1; }
.ft-dd-static, .ft-dd-static:hover { box-shadow: none; }
.ft-guide-row.is-hidden > .ft-dd, .ft-guide-row.is-hidden > .ft-guide-icon { opacity: 0.4; }
.ft-pop-body.ft-guide-fields { display: grid; grid-template-columns: 56px 1fr; align-items: center; gap: 8px; }
.ft-guide-pop .ft-pop-head .ft-dd { background: none; }
.ft-guide-pop .ft-fill-actions { display: none; }
.ft-num-input:disabled { color: var(--ft-i-text-2); }
.ft-with-action { display: flex; align-items: center; gap: 8px; margin-right: -32px; }
.ft-with-action > .ft-type-pair { flex: 1; min-width: 0; }
.ft-icon-btn[aria-pressed="true"] { background: rgba(13, 153, 255, 0.12); color: #0D99FF; }
.ft-swatch.ft-thumb { background: #FFFFFF center / cover no-repeat; }
.ft-fill-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-dd.ft-fit { align-self: flex-start; width: 112px; background: none; box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-dd.ft-fit:hover { box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-img-preview {
  position: relative; display: block; width: 100%; height: 208px; overflow: hidden; border-radius: 2px;
  background: repeating-conic-gradient(#EDEDED 0 25%, #FFFFFF 0 50%) 0 0 / 16px 16px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.ft-img-preview img { display: block; width: 100%; height: 100%; object-fit: contain; }
/* Replace image, a dark button over the middle of the preview (after Figma's "Make an image"); the whole
   preview is the button, so a click anywhere on it picks a file. */
.ft-img-replace {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center;
  height: 32px; padding: 0 12px; border-radius: 8px; white-space: nowrap; pointer-events: none;
  background: rgba(44, 44, 44, 0.9); color: #FFFFFF; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}
.ft-img-preview:hover .ft-img-replace { background: rgba(30, 30, 30, 0.95); }
.ft-adjust { display: grid; grid-template-columns: 76px 1fr; align-items: center; row-gap: 12px; }
.ft-adjust-label { color: var(--ft-i-text-2); }
.ft-adj-track {
  position: relative; height: 16px; border-radius: 8px; touch-action: none;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px var(--ft-i-line);
}
/* Off zero, the track fills in from the middle to the knob, as in Figma. */
.ft-adj-fill {
  position: absolute; top: 0; bottom: 0; pointer-events: none; background: var(--ft-i-focus);
  left: calc(8px + var(--ft-lo, 0.5) * (100% - 16px)); width: calc(var(--ft-span, 0) * (100% - 16px));
}
.ft-adj-knob {
  position: absolute; top: 50%; left: calc(8px + var(--ft-x, 0.5) * (100% - 16px));
  width: 16px; height: 16px; border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%); background: #FFFFFF;
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
}

.ft-hover-box, .ft-sel-box {
  position: fixed; z-index: 2147483645; box-sizing: border-box; pointer-events: none;
  border: 1px solid #0D99FF;
}
.ft-hover-box[hidden], .ft-sel-box[hidden] { display: none; }
/* Figma's marquee: drag on the page to select what the box touches. */
.ft-marquee { position: fixed; z-index: 2147483645; box-sizing: border-box; pointer-events: none; border: 1px solid #0D99FF; background: rgba(13, 153, 255, 0.08); }
.ft-marquee[hidden] { display: none; }
.ft-handle {
  position: absolute; width: 7px; height: 7px; box-sizing: border-box;
  background: #FFFFFF; border: 1px solid #0D99FF;
}
.ft-nw { left: -4px; top: -4px; }
.ft-ne { right: -4px; top: -4px; }
.ft-sw { left: -4px; bottom: -4px; }
.ft-se { right: -4px; bottom: -4px; }
.ft-sel-box.is-editing .ft-handle { display: none; }
/* A corner drags to resize: a 15px target around the 7px square. Only one layer that isn't turned resizes. */
.ft-handle { pointer-events: auto; }
.ft-handle::before { content: ""; position: absolute; inset: -4px; }
html.ft-moving .ft-sel-box .ft-nw, html.ft-moving .ft-sel-box .ft-se { cursor: nwse-resize; }
html.ft-moving .ft-sel-box .ft-ne, html.ft-moving .ft-sel-box .ft-sw { cursor: nesw-resize; }
.ft-sel-box.no-resize .ft-handle { display: none; }
.ft-size-label {
  position: absolute; left: 50%; top: calc(100% + 6px); transform: translateX(-50%);
  padding: 0 4px; border-radius: 3px; background: #0D99FF; color: #FFFFFF; white-space: nowrap;
  font: 500 11px/16px "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
html.ft-moving body *:not(input) { cursor: default; }
html.ft-moving [data-ft-editing], html.ft-moving [data-ft-editing] * { cursor: text; }
[data-ft-editing] { outline: none; }

.ft-panel {
  position: fixed; top: 16px; left: 16px; z-index: 2147483647;
  width: 280px; max-height: calc(100vh - 32px); overflow: auto;
  background: #1c1c1c; color: #e8e8e8;
  border: 1px solid #3a3a3a; border-radius: 8px;
  font: 12px/1.4 "Inter", system-ui, -apple-system, sans-serif;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.ft-panel[hidden] { display: none; }
.ft-panel *, .ft-panel *::before, .ft-panel *::after { box-sizing: border-box; }
.ft-panel button, .ft-panel input, .ft-panel textarea { font: inherit; color: inherit; margin: 0; }
.ft-head {
  padding: 8px 12px; border-bottom: 1px solid #3a3a3a;
  font-weight: 600; cursor: grab; user-select: none; touch-action: none;
}
.ft-head:active { cursor: grabbing; }
.ft-body { padding: 4px 12px; }
.ft-row { padding: 6px 0; }
.ft-label { margin-bottom: 4px; color: #a0a0a0; }
.ft-line { display: flex; gap: 8px; align-items: center; }
.ft-line input[type="range"] { flex: 1; min-width: 0; }
.ft-num { width: 72px; }
.ft-field { width: 100%; }
.ft-panel input[type="number"], .ft-panel input[type="text"], .ft-panel textarea {
  background: #111; border: 1px solid #3a3a3a; border-radius: 4px; padding: 3px 6px;
}
.ft-grid { display: grid; gap: 4px; }
.ft-btn {
  background: #2a2a2a; border: 1px solid #3a3a3a; border-radius: 4px;
  padding: 4px 6px; cursor: pointer;
}
.ft-btn:hover { background: #333; }
.ft-btn[aria-pressed="true"] { background: #e8e8e8; color: #111; border-color: #e8e8e8; }
.ft-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.ft-chip { width: 20px; height: 20px; padding: 0; border: 1px solid #3a3a3a; border-radius: 50%; cursor: pointer; }
.ft-chip[aria-pressed="true"] { outline: 2px solid #e8e8e8; outline-offset: 1px; }
.ft-presets, .ft-foot { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px 12px; border-top: 1px solid #3a3a3a; }
.ft-out {
  display: block; width: calc(100% - 24px); height: 120px; margin: 0 12px 12px;
  resize: vertical;
}
.ft-out[hidden] { display: none; }
`;
  /* ============================ END PANEL LOOK ============================ */

  const STYLE_ID = "finetune-look";
  const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
  // id -> teardown, so calling finetune() again with the same id replaces that panel.
  const live = {};

  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const same = (a, b) => String(a) === String(b);
  const isNum = (v) => typeof v === "number" && isFinite(v);
  const isCss = (k) => k.slice(0, 2) === "--";

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function button(cls, text, onClick) {
    const b = el("button", cls, text);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }

  // Fills in every default once, so the rest of the file never checks for missing options.
  function normalize(key, c) {
    if (!c || typeof c !== "object") {
      console.warn('finetune: "' + key + '" is not a control and was skipped.');
      return null;
    }
    const n = Object.assign({}, c, { label: c.label != null ? String(c.label) : key });
    switch (c.type) {
      case "range":
        n.min = isNum(c.min) ? c.min : 0;
        n.max = isNum(c.max) ? c.max : 100;
        n.step = isNum(c.step) && c.step > 0 ? c.step : 1;
        n.unit = c.unit != null ? String(c.unit) : "";
        n.value = isNum(c.value) ? c.value : n.min;
        return n;
      case "select":
        n.options = (c.options || []).map((o) =>
          o !== null && typeof o === "object"
            ? { label: String(o.label != null ? o.label : o.value), value: o.value }
            : { label: String(o), value: o }
        );
        n.cols = isNum(c.cols) && c.cols > 0 ? Math.round(c.cols) : 4;
        if (c.value === undefined) n.value = n.options.length ? n.options[0].value : "";
        return n;
      case "toggle":
        n.value = !!c.value;
        n.on = own(c, "on") ? c.on : 1;
        n.off = own(c, "off") ? c.off : 0;
        return n;
      case "color":
        n.chips = (c.chips || []).filter((h) => HEX.test(h));
        n.value = HEX.test(c.value) ? c.value : "#000000";
        return n;
      case "text":
        n.value = c.value != null ? String(c.value) : "";
        return n;
      default:
        console.warn('finetune: "' + key + '" has unknown type "' + c.type + '" and was skipped.');
        return null;
    }
  }

  // A stored value only comes back if it still fits its control; anything else falls back to the schema.
  function fits(c, v) {
    switch (c.type) {
      case "range": return isNum(v);
      case "select": return c.options.some((o) => same(o.value, v));
      case "toggle": return typeof v === "boolean";
      case "color": return typeof v === "string" && HEX.test(v);
      case "text": return typeof v === "string";
    }
    return false;
  }

  function cssValue(c, v) {
    if (c.type === "range") return v + c.unit;
    if (c.type === "toggle") return String(v ? c.on : c.off);
    return String(v);
  }

  function decimals(step) {
    const s = String(step);
    const i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  }

  function typing(t) {
    return !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }

  // Phosphor icons (MIT), regular weight, inlined so the file stays dependency-free. The toolbar's two
  // (copy, floppyDisk) are Light, so at 20px their line (0.94px) weighs what Regular's does at the
  // panel's 16px (1px). Undo and redo sit 8 units low (half a pixel at 16px): their ink spans 32 to 208,
  // so drawn as is they ride above the middle of the button. The flips and the
  // guide alignments are Lucide (ISC, lucide.dev, v1.56.0) at stroke 1.5, a weight under Lucide's default;
  // the alignments' bars are filled with no stroke around them (her call), their alignment line stays a stroke.
  // The selection's top / middle / bottom (alignTop, alignVCenter, alignBottom) are drawn the same way.
  // Lucide names a flip by its axis, so Flip horizontal is flip-vertical-2 and the other way round. Rotate 90°
  // is Lucide's rotate-cw-square too, the nearest to Figma's turned square.
  const ICON = {
    angle: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M96,72a8,8,0,0,1,8-8A104.11,104.11,0,0,1,208,168a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88A8,8,0,0,1,96,72ZM240,192H80V32a8,8,0,0,0-16,0V64H32a8,8,0,0,0,0,16H64V200a8,8,0,0,0,8,8H240a8,8,0,0,0,0-16Z"/></svg>',
    arrowClockwise: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
    refresh: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
    drop: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"/></svg>',
    checkerboard: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-12.69,88L136,60.69V48h12.69L208,107.32V120ZM136,83.31,172.69,120H136Zm72,1.38L171.31,48H208ZM120,48v72H48V48ZM107.31,208,48,148.69V136H60.69L120,195.31V208ZM120,172.69,83.31,136H120Zm-72-1.38L84.69,208H48ZM208,208H136V136h72v72Z"/></svg>',
    frameCorners: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,80v32a8,8,0,0,1-16,0V88H160a8,8,0,0,1,0-16h32A8,8,0,0,1,200,80ZM96,168H72V144a8,8,0,0,0-16,0v32a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16ZM232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z"/></svg>',
    linkSimple: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z"/></svg>',
    floppyDisk: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M217.9,73.42,182.58,38.1a13.9,13.9,0,0,0-9.89-4.1H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V83.31A13.9,13.9,0,0,0,217.9,73.42ZM170,210H86V152a2,2,0,0,1,2-2h80a2,2,0,0,1,2,2Zm40-2a2,2,0,0,1-2,2H182V152a14,14,0,0,0-14-14H88a14,14,0,0,0-14,14v58H48a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H172.69a2,2,0,0,1,1.41.58L209.42,81.9a2,2,0,0,1,.58,1.41ZM158,72a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h56A6,6,0,0,1,158,72Z"/></svg>',
    undo: '<svg viewBox="0 -8 256 256" fill="currentColor" aria-hidden="true"><path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z"/></svg>',
    redo: '<svg viewBox="0 -8 256 256" fill="currentColor" aria-hidden="true"><path d="M170.34,130.34,204.69,96H88a48,48,0,0,0,0,96h88a8,8,0,0,1,0,16H88A64,64,0,0,1,88,80H204.69L170.34,45.66a8,8,0,0,1,11.32-11.32l48,48a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32-11.32Z"/></svg>',
    warning: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/></svg>',
    trash: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>',
    bookmark: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z"/></svg>',
    sun: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/></svg>',
    slidersHorizontal: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z"/></svg>',
    pencilRuler: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H160V176h24a8,8,0,0,0,0-16H160V136h24a8,8,0,0,0,0-16H160V96h24a8,8,0,0,0,0-16H160V48h48V208ZM77.66,26.34a8,8,0,0,0-11.32,0l-32,32A8,8,0,0,0,32,64V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V64a8,8,0,0,0-2.34-5.66ZM48,176V80H64v96ZM80,80H96v96H80ZM72,43.31,92.69,64H51.31ZM48,208V192H96v16Z"/></svg>',
    play: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"/></svg>',
    shapes: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M71.59,61.47a8,8,0,0,0-15.18,0l-40,120A8,8,0,0,0,24,192h80a8,8,0,0,0,7.59-10.53ZM35.1,176,64,89.3,92.9,176ZM208,76a52,52,0,1,0-52,52A52.06,52.06,0,0,0,208,76Zm-88,0a36,36,0,1,1,36,36A36,36,0,0,1,120,76Zm104,68H136a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h88a8,8,0,0,0,8-8V152A8,8,0,0,0,224,144Zm-8,56H144V160h72Z"/></svg>',
    rows: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,136H48a16,16,0,0,0-16,16v40a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V152A16,16,0,0,0,208,136Zm0,56H48V152H208v40Zm0-144H48A16,16,0,0,0,32,64v40a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V64A16,16,0,0,0,208,48Zm0,56H48V64H208v40Z"/></svg>',
    columns: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M104,32H64A16,16,0,0,0,48,48V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,104,32Zm0,176H64V48h40ZM192,32H152a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,192,32Zm0,176H152V48h40Z"/></svg>',
    gridFour: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,80H136V56h64ZM120,56v64H56V56ZM56,136h64v64H56Zm144,64H136V136h64v64Z"/></svg>',
    sidebarSimple: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z"/></svg>',
    copy: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,34H88a6,6,0,0,0-6,6V82H40a6,6,0,0,0-6,6V216a6,6,0,0,0,6,6H168a6,6,0,0,0,6-6V174h42a6,6,0,0,0,6-6V40A6,6,0,0,0,216,34ZM162,210H46V94H162Zm48-48H174V88a6,6,0,0,0-6-6H94V46H210Z"/></svg>',
    textAlignLeft: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,48H168a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm176,24H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm-48,40H40a8,8,0,0,0,0,16H168a8,8,0,0,0,0-16Z"/></svg>',
    textAlignCenter: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64ZM64,96a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Zm152,40H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm-24,40H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z"/></svg>',
    textAlignRight: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64ZM216,96H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,40H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,40H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
    textAlignJustify: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64ZM216,96H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,40H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,40H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
    arrowLineUp: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,138.34a8,8,0,0,1-11.32,11.32L136,91.31V224a8,8,0,0,1-16,0V91.31L61.66,149.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0ZM216,32H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
    arrowsInLineVertical: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM122.34,101.66a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32L136,76.69V16a8,8,0,0,0-16,0V76.69L101.66,58.34A8,8,0,0,0,90.34,69.66Zm11.32,52.68a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L120,179.31V240a8,8,0,0,0,16,0V179.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"/></svg>',
    arrowLineDown: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M50.34,117.66a8,8,0,0,1,11.32-11.32L120,164.69V32a8,8,0,0,1,16,0V164.69l58.34-58.35a8,8,0,0,1,11.32,11.32l-72,72a8,8,0,0,1-11.32,0ZM216,208H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
    arrowLineRight: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M189.66,122.34a8,8,0,0,1,0,11.32l-72,72a8,8,0,0,1-11.32-11.32L164.69,136H32a8,8,0,0,1,0-16H164.69L106.34,61.66a8,8,0,0,1,11.32-11.32ZM216,32a8,8,0,0,0-8,8V216a8,8,0,0,0,16,0V40A8,8,0,0,0,216,32Z"/></svg>',
    article: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM184,96a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,96Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128Zm0,32a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,160Z"/></svg>',
    arrowsVertical: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M165.66,194.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,212.69V43.31L101.66,61.66A8,8,0,0,1,90.34,50.34l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32L136,43.31V212.69l18.34-18.35A8,8,0,0,1,165.66,194.34Z"/></svg>',
    arrowsHorizontal: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M237.66,133.66l-32,32a8,8,0,0,1-11.32-11.32L212.69,136H43.31l18.35,18.34a8,8,0,0,1-11.32,11.32l-32-32a8,8,0,0,1,0-11.32l32-32a8,8,0,0,1,11.32,11.32L43.31,120H212.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,237.66,133.66Z"/></svg>',
    check: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>',
    plus: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>',
    minus: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/></svg>',
    eye: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>',
    eyeClosed: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z"/></svg>',
    x: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
    eyedropper: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,67.3a35.79,35.79,0,0,0-11.26-25.66c-14-13.28-36.72-12.78-50.62,1.13L142.8,62.2a24,24,0,0,0-33.14.77l-9,9a16,16,0,0,0,0,22.64l2,2.06-51,51a39.75,39.75,0,0,0-10.53,38l-8,18.41A13.68,13.68,0,0,0,36,219.3a15.92,15.92,0,0,0,17.71,3.35L71.23,215a39.89,39.89,0,0,0,37.06-10.75l51-51,2.06,2.06a16,16,0,0,0,22.62,0l9-9a24,24,0,0,0,.74-33.18l19.75-19.87A35.75,35.75,0,0,0,224,67.3ZM97,193a24,24,0,0,1-24,6,8,8,0,0,0-5.55.31l-18.1,7.91L57,189.41a8,8,0,0,0,.25-5.75A23.88,23.88,0,0,1,63,159l51-51,33.94,34ZM202.13,82l-25.37,25.52a8,8,0,0,0,0,11.3l4.89,4.89a8,8,0,0,1,0,11.32l-9,9L112,83.26l9-9a8,8,0,0,1,11.31,0l4.89,4.89a8,8,0,0,0,11.33,0l24.94-25.09c7.81-7.82,20.5-8.18,28.29-.81a20,20,0,0,1,.39,28.7Z"/></svg>',
    caretDown: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
    guideStyles: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M80,40a40,40,0,1,0,40,40A40,40,0,0,0,80,40Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,80,104Zm96,16a40,40,0,1,0-40-40A40,40,0,0,0,176,120Zm0-64a24,24,0,1,1-24,24A24,24,0,0,1,176,56ZM80,136a40,40,0,1,0,40,40A40,40,0,0,0,80,136Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,80,200Zm96-64a40,40,0,1,0,40,40A40,40,0,0,0,176,136Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,176,200Z"/></svg>',
    flipHorizontal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 14v2"/><path d="M12 20v2"/><path d="M12 2v2"/><path d="M12 8v2"/><path d="M20.288 16.703A1 1 0 0022 16V8a1 1 0 00-1.712-.703l-3.99 3.991a1 1 0 00-.001 1.424z"/><path d="M3.712 16.703A1 1 0 012 16V8a1 1 0 011.712-.703l3.99 3.991a1 1 0 01.001 1.424z"/></svg>',
    flipVertical: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 12H8"/><path d="M16 12h-2"/><path d="M22 12h-2"/><path d="M4 12H2"/><path d="M7.298 20.288A1 1 0 008 22h8a1 1 0 00.703-1.712l-3.991-3.99a1 1 0 00-1.424-.001z"/><path d="M7.298 3.712A1 1 0 018 2h8a1 1 0 01.703 1.712l-3.991 3.99a1 1 0 01-1.424.001z"/></svg>',
    rotateSquare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5H6a2 2 0 0 0-2 2v3"/><path d="m9 8 3-3-3-3"/><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/></svg>',
    alignLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect fill="currentColor" stroke="none" width="9" height="6" x="6" y="14" rx="2"/><rect fill="currentColor" stroke="none" width="16" height="6" x="6" y="4" rx="2"/><path d="M2 2v20"/></svg>',
    alignHCenter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v20"/><path fill="currentColor" stroke="none" d="M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4"/><path fill="currentColor" stroke="none" d="M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4"/><path fill="currentColor" stroke="none" d="M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1"/><path fill="currentColor" stroke="none" d="M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1"/></svg>',
    alignRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect fill="currentColor" stroke="none" width="16" height="6" x="2" y="4" rx="2"/><rect fill="currentColor" stroke="none" width="9" height="6" x="9" y="14" rx="2"/><path d="M22 22V2"/></svg>',
    alignTop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect fill="currentColor" stroke="none" width="6" height="16" x="4" y="6" rx="2"/><rect fill="currentColor" stroke="none" width="6" height="9" x="14" y="6" rx="2"/><path d="M22 2H2"/></svg>',
    alignVCenter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h20"/><path fill="currentColor" stroke="none" d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"/><path fill="currentColor" stroke="none" d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4"/><path fill="currentColor" stroke="none" d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1"/><path fill="currentColor" stroke="none" d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1"/></svg>',
    alignBottom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect fill="currentColor" stroke="none" width="6" height="16" x="4" y="2" rx="2"/><rect fill="currentColor" stroke="none" width="6" height="9" x="14" y="9" rx="2"/><path d="M22 22H2"/></svg>',
  };


  // Tooltips behave like Figma's: a short wait the first time, then instant
  // while moving between buttons.
  let tipEl = null;
  let tipTimer = 0;
  let tipWarmUntil = 0;

  function showTip(target) {
    const text = target.getAttribute("data-ft-tip");
    if (!text || !target.isConnected) return;
    if (!tipEl) {
      tipEl = el("div", "ft-tip");
      document.body.appendChild(tipEl);
    }
    tipEl.textContent = text;
    const key = target.getAttribute("data-ft-tip-key");
    if (key) tipEl.appendChild(el("span", "ft-tip-key", key));
    tipEl.hidden = false;
    const r = target.getBoundingClientRect();
    // In a vertical bar the tip sits beside the button, so it never covers the next one.
    if (target.getAttribute("data-ft-tip-side") === "right") {
      tipEl.setAttribute("data-side", "right");
      tipEl.style.left = r.right + 6 + "px";
      tipEl.style.top = r.top + r.height / 2 - tipEl.offsetHeight / 2 + "px";
      return;
    }
    tipEl.removeAttribute("data-side");
    const cx = r.left + r.width / 2;
    const left = Math.min(Math.max(8, cx - tipEl.offsetWidth / 2), window.innerWidth - tipEl.offsetWidth - 8);
    tipEl.style.left = left + "px";
    tipEl.style.top = r.bottom + 6 + "px";
    // The box shifts to stay on screen; the caret keeps pointing at the button.
    tipEl.style.setProperty("--ft-caret", cx - left + "px");
  }

  function hideTip() {
    clearTimeout(tipTimer);
    if (tipEl && !tipEl.hidden) {
      tipEl.hidden = true;
      tipWarmUntil = performance.now() + 300;
    }
  }

  function withTip(target) {
    target.addEventListener("pointerenter", () => {
      clearTimeout(tipTimer);
      if (performance.now() < tipWarmUntil) showTip(target);
      else tipTimer = setTimeout(() => showTip(target), 500);
    });
    target.addEventListener("pointerleave", hideTip);
    target.addEventListener("pointerdown", hideTip);
  }

  function iconButton(svg, tip, onClick) {
    const b = button("ft-icon-btn", null, onClick);
    b.innerHTML = svg;
    b.setAttribute("data-ft-tip", tip);
    b.setAttribute("aria-label", tip);
    withTip(b);
    return b;
  }

  function toFill(css) {
    const m = /rgba?\(([^)]+)\)/.exec(css || "");
    if (!m) return null;
    const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    const a = p.length > 3 ? p[3] : 1;
    if (!(a > 0)) return null;
    const hex = p.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
    return { hex: hex.toUpperCase(), opacity: Math.round(a * 100), visible: true };
  }

  function parseHex(v) {
    const s = String(v).trim().replace(/^#/, "");
    if (/^[0-9a-f]{3}$/i.test(s)) return s.split("").map((c) => c + c).join("").toUpperCase();
    if (/^[0-9a-f]{6}$/i.test(s)) return s.toUpperCase();
    return null;
  }

  function rgba(f) {
    const n = parseInt(f.hex, 16);
    return "rgba(" + (n >> 16) + ", " + ((n >> 8) & 255) + ", " + (n & 255) + ", " + f.opacity / 100 + ")";
  }

  // One fill layer: swatch, hex, opacity, eye, remove. Fields commit on Enter or blur,
  // Escape puts the old value back, and a click selects the whole field, as in Figma.
  // No onRemove (the base layer): an empty slot keeps the rows lined up.
  // The swatch opens the inspector's color picker for this layer.
  // opts: noun names the row in its tips ("fill", "stroke"); noEye leaves out the eye, for a color that
  // belongs to something with its own (an effect's).
  function fillRow(layer, onChange, onRemove, picker, opts) {
    const noun = (opts && opts.noun) || "fill";
    const row = el("div", "ft-fill-row");
    const field = el("div", "ft-fill");
    const color = el("div", "ft-fill-color");
    const swatch = button("ft-swatch", null, () => picker.toggle(layer, row, swatch, (hex, opacity) => {
      layer.hex = hex;
      layer.opacity = opacity;
      draw();
      onChange();
    }));
    // Keeps focus (and the blue focus stroke) off the field when the swatch is clicked.
    swatch.addEventListener("pointerdown", (e) => e.preventDefault());
    const hex = el("input", "ft-hex");
    hex.type = "text";
    hex.spellcheck = false;
    const opacity = el("div", "ft-fill-alpha");
    const alpha = el("input", "ft-alpha");
    alpha.type = "text";
    alpha.inputMode = "numeric";
    const eye = iconButton(ICON.eye, "Hide " + noun, () => {
      layer.visible = !layer.visible;
      draw();
      onChange();
    });

    function draw(force) {
      swatch.style.setProperty("--ft-c", "#" + layer.hex);
      swatch.style.setProperty("--ft-ca", rgba(layer));
      if (force || document.activeElement !== hex) hex.value = layer.hex;
      if (force || document.activeElement !== alpha) alpha.value = String(layer.opacity);
      row.classList.toggle("is-hidden", !layer.visible);
      eye.innerHTML = layer.visible ? ICON.eye : ICON.eyeClosed;
      const tip = (layer.visible ? "Hide " : "Show ") + noun;
      eye.setAttribute("data-ft-tip", tip);
      eye.setAttribute("aria-label", tip);
    }

    // As with the number fields, leaving a field unchanged records nothing.
    hex.addEventListener("blur", () => {
      const v = parseHex(hex.value);
      if (v && v !== layer.hex) {
        layer.hex = v;
        onChange();
      }
      draw(true);
    });
    alpha.addEventListener("blur", () => {
      const v = parseFloat(alpha.value);
      const o = Math.min(100, Math.max(0, Math.round(v)));
      if (isNum(v) && o !== layer.opacity) {
        layer.opacity = o;
        onChange();
      }
      draw(true);
    });
    [hex, alpha].forEach((input) => {
      input.addEventListener("pointerdown", (e) => {
        if (document.activeElement === input) return;
        e.preventDefault();
        input.focus();
        input.select();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        else if (e.key === "Escape") {
          draw(true);
          input.blur();
        }
      });
    });

    color.append(swatch, hex);
    opacity.append(alpha, el("span", "ft-pct", "%"));
    field.append(color, opacity);
    const actions = el("div", "ft-fill-actions");
    // Eye stays pinned to the right edge (under the + ); remove sits left of it.
    if (onRemove) {
      const minus = iconButton(ICON.minus, "Remove " + noun, () => onRemove(layer, row));
      minus.classList.add("ft-fill-remove");
      actions.append(minus);
    }
    if (!(opts && opts.noEye)) actions.append(eye);
    row.append(field, actions);
    draw(true);
    return row;
  }

  function hexToHsv(hex) {
    const n = parseInt(hex, 16);
    const r = (n >> 16) / 255;
    const g = ((n >> 8) & 255) / 255;
    const b = (n & 255) / 255;
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
  }

  function hsvToHex(c) {
    const f = (n) => {
      const k = (n + c.h / 60) % 6;
      return c.v - c.v * c.s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    return [f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  const clamp01 = (x) => Math.min(1, Math.max(0, x));

  // Drag across a square or a slider. inset keeps a slider's knob inside its rounded ends.
  function dragArea(area, inset, onMove) {
    area.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      area.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const r = area.getBoundingClientRect();
        onMove(
          clamp01((ev.clientX - r.left - inset) / (r.width - inset * 2)),
          clamp01((ev.clientY - r.top) / r.height)
        );
      };
      const end = () => {
        area.removeEventListener("pointermove", move);
        area.removeEventListener("pointerup", end);
        area.removeEventListener("pointercancel", end);
      };
      move(e);
      area.addEventListener("pointermove", move);
      area.addEventListener("pointerup", end);
      area.addEventListener("pointercancel", end);
    });
  }

  // A Figma field: a click selects all of it, Enter or blur commits, Escape puts the old value back.
  function editable(input, show, commit) {
    let shown = "";
    input.addEventListener("focus", () => { shown = input.value; });
    input.addEventListener("pointerdown", (e) => {
      if (document.activeElement === input) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
      else if (e.key === "Escape") {
        show(true);
        input.blur();
      }
    });
    input.addEventListener("blur", () => {
      // Only a typed change commits: clicking into a field and out again records nothing.
      if (input.value !== shown) commit(input.value);
      show(false);
    });
  }

  const hexRgb = (hex) => {
    const n = parseInt(hex, 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  };
  const rgbHex = (c) => c.map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, "0")).join("").toUpperCase();

  function rgbToHsl(rgb) {
    const [r, g, b] = rgb.map((x) => x / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const l = (max + min) / 2;
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [(h * 60 + 360) % 360, d ? (d / (1 - Math.abs(2 * l - 1))) * 100 : 0, l * 100];
  }

  function hslToRgb([h, s, l]) {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [f(0), f(8), f(4)].map((x) => x * 255);
  }

  // OKLCH by way of OKLab (Björn Ottosson's matrices). L and C are CSS percents: C 100% is 0.4.
  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

  function rgbToOklch(rgb) {
    const [r, g, b] = rgb.map((x) => toLinear(x / 255));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    const C = Math.hypot(A, B);
    return [L * 100, (C / 0.4) * 100, C < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360];
  }

  // A color outside sRGB is clipped to it, since the page fill is sRGB.
  function oklchToRgb([L, C, H]) {
    L /= 100;
    C = (C / 100) * 0.4;
    const A = C * Math.cos((H * Math.PI) / 180);
    const B = C * Math.sin((H * Math.PI) / 180);
    const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
    const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
    const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map((c) => fromLinear(Math.min(1, Math.max(0, c))) * 255);
  }

  // The picker's formats. Each three-field mode reads its values off a hex and writes
  // typed values back to one; max clamps each field. HSB reads the picker's own state.
  const MODE_NAMES = ["Hex", "RGB", "HSL", "HSB", "OKLCH"];
  const MODES = {
    RGB: { max: [255, 255, 255], read: hexRgb, write: rgbHex },
    HSL: { max: [360, 100, 100], read: (hex) => rgbToHsl(hexRgb(hex)), write: (c) => rgbHex(hslToRgb(c)) },
    HSB: { max: [360, 100, 100] },
    OKLCH: { max: [100, 100, 360], read: (hex) => rgbToOklch(hexRgb(hex)), write: (c) => rgbHex(oklchToRgb(c)) },
  };

  function caret() {
    const c = el("span", "ft-caret");
    c.innerHTML = ICON.caretDown;
    return c;
  }

  // Figma's color picker, one per inspector: the saturation and brightness square,
  // hue and opacity sliders, the eyedropper, the format menu, and the value and opacity fields.
  function makePicker(root) {
    let layer = null;
    let anchor = null;
    let pick = null;
    let hsv = { h: 0, s: 0, v: 0 };
    let mode = "Hex";
    let inputs = [];

    const pop = el("div", "ft-pop ft-picker-pop");
    pop.hidden = true;

    const head = el("div", "ft-pop-head");
    head.append(el("span", null, "x"), iconButton(ICON.x, "Close", close));

    const sv = el("div", "ft-sv");
    const svKnob = el("div", "ft-knob ft-sv-knob");
    sv.appendChild(svKnob);
    const hue = el("div", "ft-track ft-hue");
    const hueKnob = el("div", "ft-knob");
    hue.appendChild(hueKnob);
    const alphaTrack = el("div", "ft-track ft-alpha-track");
    const alphaKnob = el("div", "ft-knob");
    alphaTrack.appendChild(alphaKnob);
    const sliders = el("div", "ft-sliders");
    sliders.append(hue, alphaTrack);
    const tools = el("div", "ft-pop-tools");
    tools.append(iconButton(ICON.eyedropper, "Pick color", () => {
      if (!window.EyeDropper) return;
      new window.EyeDropper().open().then((r) => {
        const v = parseHex(r.sRGBHex);
        if (v && layer) setHex(v);
      }, () => {});
    }), sliders);

    const alphaIn = el("input", "ft-alpha");
    alphaIn.type = "text";
    alphaIn.inputMode = "numeric";
    const channels = el("div", "ft-channels");
    const alphaPart = el("div", "ft-fill-alpha");
    alphaPart.append(alphaIn, el("span", "ft-pct", "%"));
    const field = el("div", "ft-fill");
    field.append(channels, alphaPart);
    const modeLabel = el("span", null, mode);
    const modeBtn = button("ft-select ft-mode", null, () => (menu.hidden ? openMenu() : closeMenu()));
    modeBtn.append(modeLabel, caret());
    const fields = el("div", "ft-pop-row");
    fields.append(modeBtn, field);

    const body = el("div", "ft-pop-body");
    body.append(sv, tools, fields);

    const menu = el("div", "ft-menu");
    menu.hidden = true;

    pop.append(head, body, menu);
    root.appendChild(pop);

    // One field for Hex, three for the other formats. Rebuilt when the format changes.
    function buildChannels() {
      channels.textContent = "";
      inputs = (mode === "Hex" ? [0] : [0, 1, 2]).map(() => {
        const input = el("input", "ft-channel");
        input.type = "text";
        input.spellcheck = false;
        if (mode !== "Hex") input.inputMode = "decimal";
        editable(input, draw, commitChannels);
        channels.appendChild(input);
        return input;
      });
    }

    function commitChannels() {
      if (!layer) return;
      if (mode === "Hex") {
        const h = parseHex(inputs[0].value);
        if (h) setHex(h);
        return;
      }
      const v = inputs.map((i) => parseFloat(i.value));
      if (!v.every(isNum)) return;
      const c = v.map((x, i) => Math.min(MODES[mode].max[i], Math.max(0, x)));
      if (mode === "HSB") {
        hsv = { h: Math.min(c[0], 359.9), s: c[1] / 100, v: c[2] / 100 };
        apply(hsvToHex(hsv), layer.opacity);
      } else {
        setHex(MODES[mode].write(c));
      }
    }

    function setMode(name) {
      mode = name;
      modeLabel.textContent = name;
      buildChannels();
      draw(true);
    }

    // Figma's dark menu, opened with the current format sitting over the button.
    function openMenu() {
      menu.textContent = "";
      MODE_NAMES.forEach((name) => {
        const item = button("ft-menu-item", null, () => {
          setMode(name);
          closeMenu();
        });
        const check = el("span", "ft-menu-check");
        if (name === mode) check.innerHTML = ICON.check;
        item.append(check, el("span", null, name));
        menu.appendChild(item);
      });
      menu.hidden = false;
      const r = modeBtn.getBoundingClientRect();
      const top = r.top - 8 - MODE_NAMES.indexOf(mode) * 24;
      menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 8)) + "px";
      menu.style.top = Math.max(8, Math.min(top, window.innerHeight - menu.offsetHeight - 8)) + "px";
    }

    function closeMenu() {
      menu.hidden = true;
    }

    buildChannels();

    // A grey has no hue of its own; keep the last one so the hue slider doesn't jump.
    function fromHex(hex) {
      const next = hexToHsv(hex);
      if (!next.s || !next.v) next.h = hsv.h;
      return next;
    }

    function apply(hex, opacity) {
      pick(hex, opacity);
      draw();
    }

    function setHex(hex) {
      hsv = fromHex(hex);
      apply(hex, layer.opacity);
    }

    function draw(force) {
      if (!layer) return;
      const hex = "#" + layer.hex;
      const pure = "hsl(" + hsv.h + ", 100%, 50%)";
      sv.style.setProperty("--ft-hue", pure);
      svKnob.style.setProperty("--ft-x", hsv.s);
      svKnob.style.setProperty("--ft-y", 1 - hsv.v);
      svKnob.style.setProperty("--ft-k", hex);
      hueKnob.style.setProperty("--ft-x", hsv.h / 360);
      hueKnob.style.setProperty("--ft-k", pure);
      alphaTrack.style.setProperty("--ft-c", hex);
      alphaKnob.style.setProperty("--ft-x", layer.opacity / 100);
      alphaKnob.style.setProperty("--ft-k", rgba(layer));
      const values = mode === "Hex"
        ? [layer.hex]
        : (mode === "HSB" ? [hsv.h, hsv.s * 100, hsv.v * 100] : MODES[mode].read(layer.hex)).map((x) => String(Math.round(x)));
      inputs.forEach((input, i) => {
        if (force || document.activeElement !== input) input.value = values[i];
      });
      if (force || document.activeElement !== alphaIn) alphaIn.value = String(layer.opacity);
    }

    dragArea(sv, 0, (x, y) => {
      hsv.s = x;
      hsv.v = 1 - y;
      apply(hsvToHex(hsv), layer.opacity);
    });
    dragArea(hue, 6, (x) => {
      hsv.h = Math.min(x * 360, 359.9);
      apply(hsvToHex(hsv), layer.opacity);
    });
    dragArea(alphaTrack, 6, (x) => apply(layer.hex, Math.round(x * 100)));
    editable(alphaIn, draw, (v) => {
      const a = parseFloat(v);
      if (isNum(a) && layer) apply(layer.hex, Math.min(100, Math.max(0, Math.round(a))));
    });

    function open(l, row, swatch, onPick) {
      layer = l;
      anchor = swatch;
      pick = onPick;
      hsv = fromHex(l.hex);
      pop.hidden = false;
      draw(true);
      // Just left of the panel, level with the row, kept on screen.
      const r = row.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
      pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
    }

    function close() {
      if (!layer) return;
      // Closing commits whatever is being typed, as Figma does.
      if (pop.contains(document.activeElement)) document.activeElement.blur();
      closeMenu();
      pop.hidden = true;
      layer = anchor = pick = null;
    }

    // Closes on a click anywhere else, or Escape (the format menu first, if it's open).
    // The swatch that opened the picker toggles it instead.
    document.addEventListener("pointerdown", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !modeBtn.contains(e.target)) closeMenu();
      if (!layer || pop.contains(e.target) || anchor.contains(e.target)) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !layer || typing(e.target)) return;
      // Handled: the selection's own Escape leaves this one alone.
      e.preventDefault();
      if (!menu.hidden) closeMenu();
      else close();
    });

    return {
      toggle(l, row, swatch, onPick) {
        if (layer === l) close();
        else open(l, row, swatch, onPick);
      },
      // Called after any change, so edits made in the row show in the picker too.
      sync() {
        if (!layer) return;
        if (layer.hex !== hsvToHex(hsv)) hsv = fromHex(layer.hex);
        draw();
      },
      closeFor(l) {
        if (layer === l) close();
      },
    };
  }

  // The inspector is one per page, however many finetune() calls there are.
  // With nothing selected it shows the page, as Figma does.
  let inspector = null;
  let toolbar = null;
  let selection = null;
  // Set by the inspector: shows a selected element's sections, or the page when given null.
  let showInPanel = () => {};
  // Set by the inspector: redraws the selection's numbers after the element changes size.
  let refreshPanel = () => {};

  // Left toolbar, after pen.dev's: Copy the changes for the bake skill, Save them so a reload keeps
  // them. They're actions, not tools, so neither stays pressed. (Reset sits in the panel's top row, Hide UI
  // at its right.)
  function makeToolbar(hotkey) {
    const bar = el("div", "ft-toolbar");
    const actions = [
      ["copy", "Copy changes", copyChanges],
      ["floppyDisk", "Save changes in this browser", saveNow],
    ].map(([icon, name, onClick]) => {
      const b = button("ft-tool", null, onClick);
      b.innerHTML = ICON[icon];
      b.setAttribute("aria-label", name);
      b.setAttribute("data-ft-tip", name);
      b.setAttribute("data-ft-tip-side", "right");
      withTip(b);
      return b;
    });
    bar.append(...actions);
    document.body.appendChild(bar);
    uiBox = el("div", "ft-ui");
    uiButton = iconButton(ICON.sidebarSimple, "Hide UI", toggleUi);
    uiButton.setAttribute("data-ft-tip-key", hotkey.toUpperCase());
    uiBox.appendChild(uiButton);
    document.body.appendChild(uiBox);
    return bar;
  }

  // Hide UI, as Figma's Minimize UI: the panel, the toolbar, the grid and the selection go at once, leaving
  // only this button, in a small box where it sat, to bring them back. The hotkey (T), ⌘\ and ⇧⌘\ (Figma's
  // Show/Hide UI and Minimize UI; Ctrl on Windows) do the same. From fully hidden (open: false,
  // finetune.toggle(false)) it shows everything.
  let minimized = false;
  let uiButton = null;
  let uiBox = null;
  function drawUiButton() {
    if (!uiButton) return;
    const name = minimized ? "Show UI" : "Hide UI";
    uiButton.setAttribute("data-ft-tip", name);
    uiButton.setAttribute("aria-label", name);
    uiBox.toggleAttribute("data-min", minimized);
    uiBox.hidden = inspector.hidden && !minimized;
  }
  function toggleUi() {
    if (!inspector) return;
    if (inspector.hidden && !minimized) return showPanel(true);
    minimized = !minimized;
    inspector.hidden = toolbar.hidden = minimized;
    selection.sync();
    hideTip();
    drawUiButton();
  }
  window.addEventListener("keydown", (e) => {
    if (!(e.metaKey || e.ctrlKey) || e.altKey || e.code !== "Backslash" || typing(e.target)) return;
    e.preventDefault();
    toggleUi();
  });

  // Text means an element with words of its own, not just inside its children.
  const hasText = (e) => Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
  // [data-finetune-ui] marks a page's own controls (its nav, its buttons): never selected, and they keep
  // working while the inspector is open.
  const isUi = (t) => !t || !t.closest || !!t.closest(".ft-inspector, .ft-toolbar, .ft-ui, .ft-tip, .ft-toast, .ft-sel-box, .ft-hover-box, .ft-marquee, [data-finetune-ui]");

  // Figma's layout guide, columns: bands stretched between margins, or packed to a side (or the middle)
  // at a set width, an offset from that side.
  const GUIDE_ALIGN = [["stretch", "Stretch"], ["left", "Left"], ["center", "Center"], ["right", "Right"]];
  // The usual layout: 12 stretched columns, 40 margin, 20 gutter; Figma's red at 10%.
  const newGuide = () => ({
    type: "columns", visible: true, color: { hex: "FF0000", opacity: 10, visible: true },
    count: 12, align: "stretch", width: 0, offset: 40, gutter: 20,
  });
  function validGuide(g) {
    return !!g && g.type === "columns" && typeof g.visible === "boolean"
      && !!g.color && /^[0-9A-F]{6}$/.test(g.color.hex) && isNum(g.color.opacity)
      && ["count", "width", "offset", "gutter"].every((k) => isNum(g[k]) && g[k] >= 0)
      && g.count >= 1 && GUIDE_ALIGN.some(([a]) => a === g.align);
  }
  const copyGuides = (list) => list.map((g) => Object.assign({}, g, { color: Object.assign({}, g.color) }));
  // A style's name, from its numbers: "12 col · 20 gutter · 50 margin".
  const styleName = (g) => g.count + " col · " + g.gutter + " gutter · " + (g.align === "stretch" ? g.offset + " margin"
    : g.width + " wide · " + (g.align === "center" ? "centered" : g.align + " " + g.offset));

  // Her horizontal-layout styles, for every page or just this one. A style library, not a page edit:
  // kept in the browser the moment she saves one, not with Save.
  const STYLES_ALL = "finetune:styles";
  const STYLES_PAGE = "finetune:styles:" + location.pathname;
  function loadStyles(key) {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      return Array.isArray(raw) ? raw.filter((st) => st && typeof st.name === "string" && validGuide(st.guide)) : [];
    } catch (e) {
      return [];
    }
  }
  function storeStyles(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }
  const guideName = (g) => "Columns (" + g.count + ")";

  // Every edit made in the panel, kept in memory until Save puts it in localStorage (per page) so a
  // reload brings it back, and copied out as a list for the bake skill to write into the code.
  // Never written to disk.
  // Figma's image adjustments, -100 to 100 each; zero is untouched.
  const NO_ADJUST = { exposure: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0 };
  // Figma's Stroke and Effects. They're kept on the entry as the panel shows them (as adjust is) and written
  // to the element as CSS: a stroke is an outline, which never moves the layout as a border would; the
  // shadows are box-shadow, Layer blur is filter, Background blur is backdrop-filter. Blurs are Figma's
  // numbers, twice the CSS blur radius.
  const STROKE_AT = [["inside", "Inside"], ["center", "Center"], ["outside", "Outside"]];
  const EFFECT_TYPES = [["inner", "Inner shadow"], ["drop", "Drop shadow"], ["layer", "Layer blur"], ["background", "Background blur"]];
  const isShadow = (fx) => fx.type === "drop" || fx.type === "inner";
  // Figma's new effect: a drop shadow, 0 4, blur 4, black at 25%.
  const newEffect = () => ({ type: "drop", visible: true, x: 0, y: 4, blur: 4, spread: 0, hex: "000000", opacity: 25 });
  const EDITS_KEY = "finetune:edits:" + location.pathname;
  let edits = loadEdits();

  // Anything stored in a shape this file no longer writes is dropped, not trusted.
  function loadEdits() {
    const out = { page: null, elements: {}, guides: [], groups: [] };
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(EDITS_KEY));
    } catch (e) {
      return out;
    }
    if (!raw || typeof raw !== "object") return out;
    if (Array.isArray(raw.page) && raw.page.length && raw.page.every((l) =>
      l && /^[0-9A-F]{6}$/.test(l.hex) && isNum(l.opacity) && typeof l.visible === "boolean")) {
      out.page = raw.page.map((l) => ({ hex: l.hex, opacity: l.opacity, visible: l.visible }));
    }
    // One horizontal layout at a time.
    if (Array.isArray(raw.guides)) out.guides = raw.guides.filter(validGuide).slice(0, 1);
    if (Array.isArray(raw.groups)) {
      out.groups = raw.groups.filter((g) => Array.isArray(g) && g.length > 1 && g.every((sel) => typeof sel === "string"));
    }
    if (raw.elements && typeof raw.elements === "object") {
      Object.keys(raw.elements).forEach((sel) => {
        const e = raw.elements[sel];
        if (!e || typeof e.styles !== "object" || !e.styles) return;
        const styles = {};
        Object.keys(e.styles).forEach((p) => { if (typeof e.styles[p] === "string") styles[p] = e.styles[p]; });
        const entry = { styles };
        if (typeof e.html === "string") entry.html = e.html;
        if (e.adjust && typeof e.adjust === "object") {
          const adjust = Object.assign({}, NO_ADJUST);
          Object.keys(NO_ADJUST).forEach((k) => { if (isNum(e.adjust[k])) adjust[k] = e.adjust[k]; });
          entry.adjust = adjust;
        }
        const paint = (c) => !!c && /^[0-9A-F]{6}$/.test(c.hex) && isNum(c.opacity) && typeof c.visible === "boolean";
        // null is a stroke she removed from the page's own.
        if (e.stroke === null) entry.stroke = null;
        else if (paint(e.stroke) && STROKE_AT.some(([at]) => at === e.stroke.position) && isNum(e.stroke.weight)) {
          entry.stroke = { hex: e.stroke.hex, opacity: e.stroke.opacity, visible: e.stroke.visible, position: e.stroke.position, weight: e.stroke.weight };
        }
        if (Array.isArray(e.effects)) {
          entry.effects = e.effects.filter((fx) => paint(fx) && EFFECT_TYPES.some(([t]) => t === fx.type)
            && ["x", "y", "blur", "spread"].every((k) => isNum(fx[k])))
            .map((fx) => ({ type: fx.type, visible: fx.visible, x: fx.x, y: fx.y, blur: fx.blur, spread: fx.spread, hex: fx.hex, opacity: fx.opacity }));
        }
        if (e.src && typeof e.src.name === "string" && /^data:image\//.test(e.src.data)) {
          entry.src = { name: e.src.name, data: e.src.data };
        }
        out.elements[sel] = entry;
      });
    }
    return out;
  }

  // Nothing is saved until she presses Save; a reload before that drops the unsaved edits.
  function saveNow() {
    try {
      localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
      const n = editCount();
      toast(n ? "Saved " + n + (n === 1 ? " change" : " changes") : "Saved");
    } catch (e) {
      // Storage blocked or full (a large swapped-in image): edits still show, they just won't survive a reload.
      toast("Couldn't save: storage is blocked or full");
    }
  }

  function copyChanges() {
    const n = editCount();
    if (!n) return toast("No changes to copy");
    copyText(changesText()).then((ok) => {
      toast(ok ? "Copied " + n + (n === 1 ? " change" : " changes") + ". Paste into Claude Code and say bake." : "Couldn't reach the clipboard");
    });
  }

  // Forget every saved edit and reload the page as written. A page with state of its own (its own
  // controls, its own storage) hears "finetune:reset" on window first, so one Reset clears everything.
  function resetEdits() {
    window.dispatchEvent(new CustomEvent("finetune:reset"));
    try {
      localStorage.removeItem(EDITS_KEY);
    } catch (e) {
      // Nothing stored to clear.
    }
    location.reload();
  }

  const editCount = () => Object.keys(edits.elements).length + (edits.page ? 1 : 0) + edits.groups.length;

  // A short selector that finds the element again after a reload: as few steps as stay
  // unique, each a tag, its first class, and a position when siblings share both.
  function selectorFor(t) {
    if (t.id) return "#" + CSS.escape(t.id);
    const steps = [];
    for (let e = t; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      let step = e.tagName.toLowerCase();
      if (e.classList.length) step += "." + CSS.escape(e.classList[0]);
      const kin = Array.from(e.parentElement.children).filter((s) => s.tagName === e.tagName);
      if (kin.filter((s) => s.matches(step)).length > 1) step += ":nth-of-type(" + (kin.indexOf(e) + 1) + ")";
      steps.unshift(step);
      const found = document.querySelectorAll(steps.join(" > "));
      if (found.length === 1 && found[0] === t) return steps.join(" > ");
    }
    return "body > " + steps.join(" > ");
  }

  // What the page had before finetune touched each element (inline style values, words, image source),
  // so undoing past the first edit puts back exactly what was there.
  const originals = {};
  function originalOf(t) {
    const sel = selectorFor(t);
    return originals[sel] || (originals[sel] = { styles: {} });
  }

  // Undo and redo, as in Figma. A step is the whole set of edits once a change settles (a drag, a scrub
  // or a burst of typing is one step); hover previews never count (quiet). Going back hands the step to
  // the inspector, which puts the page and the panel where it had them.
  const history = { past: [], future: [], now: null, timer: 0, quiet: 0 };
  let applyEdits = () => {};
  let historyChanged = () => {};
  let finishTyping = () => {};
  const snapshot = () => JSON.stringify(edits);
  function noteChange() {
    if (history.quiet || history.now == null) return;
    clearTimeout(history.timer);
    history.timer = setTimeout(commitStep, 250);
    historyChanged();
  }
  function commitStep() {
    clearTimeout(history.timer);
    history.timer = 0;
    const now = snapshot();
    if (now !== history.now) {
      history.past.push(history.now);
      history.now = now;
      history.future = [];
    }
    historyChanged();
  }
  function startHistory() {
    clearTimeout(history.timer);
    history.timer = 0;
    history.now = snapshot();
    historyChanged();
  }
  function step(from, to) {
    finishTyping();
    if (history.timer) commitStep();
    if (!from.length) return;
    to.push(history.now);
    history.now = from.pop();
    history.quiet++;
    applyEdits(JSON.parse(history.now));
    history.quiet--;
    historyChanged();
  }
  const undo = () => step(history.past, history.future);
  const redo = () => step(history.future, history.past);

  function record(target, change) {
    const sel = selectorFor(target);
    const entry = edits.elements[sel] || { styles: {} };
    change(entry);
    if (Object.keys(entry.styles).length || entry.html != null || entry.adjust || entry.src || "stroke" in entry || entry.effects) edits.elements[sel] = entry;
    else delete edits.elements[sel];
    noteChange();
  }

  // Exposure, Contrast and Saturation are CSS
  // filters; Temperature, Tint, Highlights and Shadows have none, so they run through an SVG
  // filter kept in one hidden svg on the page, one per image.
  const toneId = (sel) => {
    let h = 0;
    for (let i = 0; i < sel.length; i++) h = (h * 31 + sel.charCodeAt(i)) | 0;
    return "ft-tone-" + (h >>> 0).toString(36);
  };
  const hasTone = (a) => !!(a.temperature || a.tint || a.highlights || a.shadows);
  let filterDefs = null;

  function toneMarkup(id, a) {
    // Warm adds red and takes blue; a positive tint takes green, toward magenta.
    const r = 1 + 0.15 * (a.temperature / 100);
    const b = 1 - 0.15 * (a.temperature / 100);
    const g = 1 - 0.15 * (a.tint / 100);
    // A tone curve that keeps black and white where they are and moves the darks and lights.
    const curve = [];
    for (let i = 0; i <= 16; i++) {
      const x = i / 16;
      const y = x + 0.6 * (a.shadows / 100) * x * (1 - x) * (1 - x) + 0.6 * (a.highlights / 100) * x * x * (1 - x);
      curve.push(+Math.min(1, Math.max(0, y)).toFixed(4));
    }
    const table = curve.join(" ");
    const matrix = [r, 0, 0, 0, 0, 0, g, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, 1, 0].map((n) => +n.toFixed(4)).join(" ");
    return '<filter id="' + id + '" color-interpolation-filters="sRGB">'
      + '<feColorMatrix type="matrix" values="' + matrix + '"/>'
      + '<feComponentTransfer><feFuncR type="table" tableValues="' + table + '"/>'
      + '<feFuncG type="table" tableValues="' + table + '"/><feFuncB type="table" tableValues="' + table + '"/>'
      + "</feComponentTransfer></filter>";
  }

  function setToneFilter(id, a) {
    if (!filterDefs) {
      // Sized to nothing, not display: none, which would switch its filters off.
      filterDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      filterDefs.setAttribute("width", "0");
      filterDefs.setAttribute("height", "0");
      filterDefs.setAttribute("aria-hidden", "true");
      filterDefs.style.position = "absolute";
      document.body.appendChild(filterDefs);
    }
    const old = filterDefs.querySelector("#" + id);
    if (old) old.remove();
    if (hasTone(a)) filterDefs.insertAdjacentHTML("beforeend", toneMarkup(id, a));
  }

  function adjustFilter(id, a) {
    const parts = [];
    if (a.exposure) parts.push("brightness(" + +Math.pow(2, a.exposure / 100).toFixed(3) + ")");
    if (a.contrast) parts.push("contrast(" + +(1 + a.contrast / 100).toFixed(3) + ")");
    if (a.saturation) parts.push("saturate(" + +(1 + a.saturation / 100).toFixed(3) + ")");
    if (hasTone(a)) parts.push("url(#" + id + ")");
    return parts.join(" ");
  }

  function adjustOf(target) {
    const entry = edits.elements[selectorFor(target)];
    return Object.assign({}, NO_ADJUST, entry && entry.adjust);
  }

  function setAdjust(target, a) {
    setToneFilter(toneId(selectorFor(target)), a);
    record(target, (entry) => {
      if (Object.keys(a).some((k) => a[k])) entry.adjust = Object.assign({}, a);
      else delete entry.adjust;
    });
    writeFilter(target);
  }

  // What the page itself gives a property: the value under any edit (its own inline value, if it had one).
  // read is the property to read back, when the one written is a shorthand.
  function ownValue(t, prop, read) {
    const o = originalOf(t);
    const now = t.style.getPropertyValue(prop);
    const orig = prop in o.styles ? o.styles[prop] : now;
    const get = () => getComputedStyle(t).getPropertyValue(read || prop).trim();
    if (orig === now) return get();
    if (orig) t.style.setProperty(prop, orig);
    else t.style.removeProperty(prop);
    const v = get();
    if (now) t.style.setProperty(prop, now);
    else t.style.removeProperty(prop);
    return v;
  }

  // Nothing to write hands the property back to the page, unless the page has one of its own: then it's
  // switched off, so what she removed stays removed.
  function setOrNone(t, prop, css) {
    if (css) return setStyle(t, prop, css);
    const own = ownValue(t, prop);
    setStyle(t, prop, own && own !== "none" ? "none" : "");
  }

  const entryOf = (t) => edits.elements[selectorFor(t)];
  const figmaBlur = (cssBlur) => Math.round(parseFloat(cssBlur) * 2 * 10) / 10;

  // One filter carries the adjustments and Layer blur. Without either it goes back to the page's own,
  // unless that one blurs and she's been editing the effects (she took its blur out).
  function writeFilter(t) {
    const sel = selectorFor(t);
    const entry = edits.elements[sel];
    const a = Object.assign({}, NO_ADJUST, entry && entry.adjust);
    const on = ((entry && entry.effects) || []).filter((fx) => fx.visible);
    // On anything SVG (the outer <svg> too) drop shadows are filter functions, so they follow the drawing's
    // shape, not its box; they go before the blur, so the blur takes them with it.
    const drops = t instanceof SVGElement ? on.filter((fx) => fx.type === "drop").map((fx) => "drop-shadow(" + fx.x + "px " + fx.y + "px " + fx.blur / 2 + "px " + rgba(fx) + ")") : [];
    const blurs = on.filter((fx) => fx.type === "layer").map((fx) => "blur(" + fx.blur / 2 + "px)");
    const css = [adjustFilter(toneId(sel), a)].concat(drops, blurs).filter(Boolean).join(" ");
    if (css || !(entry && entry.effects) || !/blur\(|drop-shadow\(/.test(ownValue(t, "filter"))) setStyle(t, "filter", css);
    else setStyle(t, "filter", "none");
  }

  // The stroke the panel shows: hers, or the page's own outline.
  function strokeOf(t) {
    const entry = entryOf(t);
    if (entry && "stroke" in entry) return entry.stroke && Object.assign({}, entry.stroke);
    if (inSvg(t)) {
      const p = svgPaint(t, "stroke");
      const w = parseFloat(getComputedStyle(t).strokeWidth) || 0;
      return p.kind === "color" && w ? Object.assign(p.layer, { position: "center", weight: w }) : null;
    }
    const cs = getComputedStyle(t);
    const w = parseFloat(cs.outlineWidth) || 0;
    const c = cs.outlineStyle === "none" || !w ? null : toFill(cs.outlineColor);
    if (!c) return null;
    const off = parseFloat(cs.outlineOffset) || 0;
    return Object.assign(c, { position: off <= -w + 0.01 ? "inside" : off < -0.01 ? "center" : "outside", weight: w });
  }

  function setStroke(t, st) {
    if (inSvg(t)) {
      const own = ownValue(t, "stroke");
      record(t, (entry) => {
        if (st) entry.stroke = Object.assign({}, st);
        else if (own !== "none") entry.stroke = null;
        else delete entry.stroke;
      });
      if (st) {
        writeSvgPaint(t, "stroke", st);
        setStyle(t, "stroke-width", st.weight + "px");
      } else {
        clearSvgPaint(t, "stroke");
        setStyle(t, "stroke-width", "");
      }
      return;
    }
    const pageHas = ownValue(t, "outline", "outline-style") !== "none";
    record(t, (entry) => {
      if (st) entry.stroke = Object.assign({}, st);
      else if (pageHas) entry.stroke = null;
      else delete entry.stroke;
    });
    if (st && st.visible && st.weight > 0) {
      const off = st.position === "inside" ? -st.weight : st.position === "center" ? -st.weight / 2 : 0;
      setStyle(t, "outline", st.weight + "px solid " + rgba(st));
      setStyle(t, "outline-offset", off ? off + "px" : "");
    } else {
      setStyle(t, "outline", pageHas ? "none" : "");
      setStyle(t, "outline-offset", "");
    }
  }

  // Top-level commas only: a color's own commas stay inside its parentheses.
  function splitTop(v) {
    const out = [];
    let depth = 0;
    let cur = "";
    for (const ch of String(v || "")) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (ch === "," && !depth) {
        out.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  // The effects the panel shows: hers, or the page's own shadows and blurs.
  function effectsOf(t) {
    const entry = entryOf(t);
    if (entry && entry.effects) return entry.effects.map((fx) => Object.assign({}, fx));
    const cs = getComputedStyle(t);
    const out = [];
    if (t instanceof SVGElement) {
      // drop-shadow()'s blur reaches twice as far as box-shadow's, so Figma's number is double it.
      (cs.filter.match(/drop-shadow\((?:[^()]|\([^()]*\))*\)/g) || []).forEach((one) => {
        const c = toFill(one);
        const n = (one.replace(/rgba?\([^)]*\)/g, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
        if (c && n.length >= 2) out.push(Object.assign(newEffect(), { x: n[0], y: n[1], blur: figmaBlur(n[2] || 0), hex: c.hex, opacity: c.opacity }));
      });
      const blur = /(?:^|\s)blur\(([\d.]+)px\)/.exec(cs.filter);
      if (blur) out.push(Object.assign(newEffect(), { type: "layer", blur: figmaBlur(blur[1]) }));
      return out;
    }
    if (cs.boxShadow !== "none") {
      splitTop(cs.boxShadow).forEach((one) => {
        const c = toFill(one);
        const n = (one.replace(/rgba?\([^)]*\)/g, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
        if (!c || n.length < 2) return;
        out.push(Object.assign(newEffect(), { type: /\binset\b/.test(one) ? "inner" : "drop", x: n[0], y: n[1], blur: n[2] || 0, spread: n[3] || 0, hex: c.hex, opacity: c.opacity }));
      });
    }
    const layer = /blur\(([\d.]+)px\)/.exec(cs.filter);
    if (layer) out.push(Object.assign(newEffect(), { type: "layer", blur: figmaBlur(layer[1]) }));
    const back = /blur\(([\d.]+)px\)/.exec(cs.backdropFilter || cs.webkitBackdropFilter || "");
    if (back) out.push(Object.assign(newEffect(), { type: "background", blur: figmaBlur(back[1]) }));
    return out;
  }

  // The top row paints on top, as in Figma: the first shadow in box-shadow.
  function setEffects(t, list) {
    const svg = t instanceof SVGElement;
    const pageHas = svg ? /blur\(|drop-shadow\(/.test(ownValue(t, "filter"))
      : ownValue(t, "box-shadow") !== "none" || /blur\(/.test(ownValue(t, "filter")) || ownValue(t, "backdrop-filter") !== "none";
    record(t, (entry) => {
      if (list.length || pageHas) entry.effects = list.map((fx) => Object.assign({}, fx));
      else delete entry.effects;
    });
    if (svg) return writeFilter(t);
    const on = list.filter((fx) => fx.visible);
    const shadows = on.filter(isShadow).map((fx) => (fx.type === "inner" ? "inset " : "") + fx.x + "px " + fx.y + "px " + fx.blur + "px " + fx.spread + "px " + rgba(fx));
    setOrNone(t, "box-shadow", shadows.join(", "));
    writeFilter(t);
    const back = on.filter((fx) => fx.type === "background").map((fx) => "blur(" + fx.blur / 2 + "px)").join(" ");
    // The prefixed one first, the standard one last: a build that merges the pair keeps the last.
    setOrNone(t, "-webkit-backdrop-filter", back);
    setOrNone(t, "backdrop-filter", back);
  }

  // Every style the panel changes goes through here, so it shows live and is remembered.
  // Inline text (a span) ignores translate, rotate, scale, width and height. Figma's text is a box, so
  // the first box edit makes it inline-block; that's recorded too, so it bakes with the edit.
  function boxed(target) {
    // An image, a video or anything SVG already takes a move and a size as it is.
    if (target instanceof SVGElement || /^(IMG|VIDEO|CANVAS|IFRAME|EMBED|OBJECT)$/.test(target.tagName)) return;
    if (getComputedStyle(target).display === "inline") setStyle(target, "display", "inline-block");
  }

  // What a layer is, read from the code, 1:1. Inside an <svg>, a shape (or a g of them) is a vector, and words
  // are text; the <svg> itself sits on the page like a box. Everything else is a box (a group when it holds
  // other elements), text, or an image.
  const SHAPES = /^(path|rect|circle|ellipse|line|polyline|polygon|g|use)$/;
  function outerSvg(t) {
    let r = t && t.closest && t.closest("svg");
    while (r && r.parentElement && r.parentElement.closest("svg")) r = r.parentElement.closest("svg");
    return r || null;
  }
  const inSvg = (t) => t instanceof SVGElement && outerSvg(t) !== t;
  const isSvgRoot = (t) => t instanceof SVGSVGElement && !inSvg(t);
  // An icon set (Phosphor, Lucide) paints with currentColor, so its color is the <svg>'s CSS color.
  const paintsWithColor = (svg) => [svg, ...svg.querySelectorAll("*")].some((e) => ["fill", "stroke"].some((p) =>
    /currentcolor/i.test(e.getAttribute(p) || "") || /currentcolor/i.test(e.style.getPropertyValue(p))));
  // A line icon (Lucide's kind) is drawn with strokes, whose weight it sets once on the <svg>.
  const strokedIcon = (svg) => [...svg.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect")]
    .some((e) => getComputedStyle(e).stroke !== "none" && parseFloat(getComputedStyle(e).strokeWidth) > 0);
  const isVector = (t) => inSvg(t) && !hasText(t) && SHAPES.test(t.tagName);

  // A move on screen, in the units a translate on t is counted in: px for the page, but inside an SVG the user
  // units of its parent, which a viewBox can scale (a 256 viewBox drawn at 24px makes a unit about a tenth of a px).
  function localDelta(t, dx, dy) {
    const p = inSvg(t) && t.parentNode && t.parentNode.getScreenCTM ? t.parentNode.getScreenCTM() : null;
    const det = p ? p.a * p.d - p.b * p.c : 0;
    if (!det) return [dx, dy];
    return [(p.d * dx - p.c * dy) / det, (-p.b * dx + p.a * dy) / det];
  }

  // A shape inside an SVG turns and flips around its own middle, as in Figma, not the SVG's corner.
  function turnInPlace(t) {
    if (!inSvg(t) || t.style.transformBox === "fill-box") return;
    setStyle(t, "transform-box", "fill-box");
    setStyle(t, "transform-origin", "center");
  }

  // The CSS width and height that give t this outer size: offsetWidth counts padding and border, and width
  // doesn't, unless box-sizing is border-box.
  function boxCss(t, w, h) {
    const cs = getComputedStyle(t);
    if (cs.boxSizing === "border-box") return [w, h];
    const n = (k) => parseFloat(cs[k]) || 0;
    return [
      Math.max(0, w - n("paddingLeft") - n("paddingRight") - n("borderLeftWidth") - n("borderRightWidth")),
      Math.max(0, h - n("paddingTop") - n("paddingBottom") - n("borderTopWidth") - n("borderBottomWidth")),
    ];
  }

  // A layer's size before its own rotation, as Figma shows it: a vector's geometry, an element's box.
  function sizeOf(t) {
    if (isVector(t)) return vectorSize(t);
    const r = t.getBoundingClientRect();
    return { w: t.offsetWidth != null ? t.offsetWidth : r.width, h: t.offsetHeight != null ? t.offsetHeight : r.height };
  }

  // Sets that size as the code would: a vector's geometry, an element's width and height. null leaves one as is.
  function setSize(t, w, h) {
    if (isVector(t)) {
      const now = vectorSize(t);
      return setVectorSize(t, w != null ? w : now.w, h != null ? h : now.h);
    }
    boxed(t);
    const [cw, ch] = boxCss(t, w || 0, h || 0);
    if (w != null) setStyle(t, "width", Math.round(cw * 10) / 10 + "px");
    if (h != null) setStyle(t, "height", Math.round(ch * 10) / 10 + "px");
  }

  // A vector's size on screen before its own rotation: its geometry through everything that draws it.
  function vectorSize(t) {
    const bb = t.getBBox();
    const m = t.getScreenCTM();
    const sx = (m && Math.hypot(m.a, m.b)) || 1;
    const sy = (m && Math.hypot(m.c, m.d)) || 1;
    return { w: bb.width * sx, h: bb.height * sy, sx, sy };
  }

  const round1 = (n) => Math.round(n * 10) / 10;
  // A vector's new size on screen, written as the code would: a rect's width and height, a circle's r, an
  // ellipse's rx and ry; any other shape scales, its stroke kept at its weight. Its top-left stays put.
  function setVectorSize(t, w, h) {
    const now = vectorSize(t);
    if (!now.w || !now.h) return;
    const before = t.getBoundingClientRect();
    const tag = t.tagName.toLowerCase();
    const uw = w / now.sx;
    const uh = h / now.sy;
    if (tag === "rect") {
      setStyle(t, "width", round1(uw) + "px");
      setStyle(t, "height", round1(uh) + "px");
    } else if (tag === "circle") setStyle(t, "r", round1(Math.max(uw, uh) / 2) + "px");
    else if (tag === "ellipse") {
      setStyle(t, "rx", round1(uw / 2) + "px");
      setStyle(t, "ry", round1(uh / 2) + "px");
    } else {
      const cs = getComputedStyle(t);
      const sc = cs.scale === "none" ? [1, 1] : cs.scale.trim().split(/\s+/).map(parseFloat);
      const cx = sc[0];
      const cy = sc.length > 1 ? sc[1] : sc[0];
      turnInPlace(t);
      if (tag !== "g" && tag !== "use") setStyle(t, "vector-effect", "non-scaling-stroke");
      setStyle(t, "scale", Math.round(cx * (w / now.w) * 1000) / 1000 + " " + Math.round(cy * (h / now.h) * 1000) / 1000);
    }
    const after = t.getBoundingClientRect();
    if (Math.abs(before.left - after.left) > 0.05 || Math.abs(before.top - after.top) > 0.05) nudge(t, before.left - after.left, before.top - after.top);
  }

  // An SVG paint (fill or stroke): a color, as the panel's layer (its -opacity folded in), "none", or a
  // gradient or pattern from the code, which the panel shows but doesn't edit.
  function svgPaint(t, prop) {
    const cs = getComputedStyle(t);
    const v = cs.getPropertyValue(prop).trim();
    if (/^url\(/.test(v)) return { kind: "server" };
    const c = v && v !== "none" ? toFill(v) : null;
    if (!c) return { kind: "none" };
    const o = parseFloat(cs.getPropertyValue(prop + "-opacity"));
    if (isNum(o) && o < 1) c.opacity = Math.round(c.opacity * o);
    return { kind: "color", layer: c };
  }

  // A paint shown is its color (its -opacity back to 1 if the page set one, or the two would multiply); a
  // hidden one is transparent, so the shape can still be clicked.
  function writeSvgPaint(t, prop, layer) {
    setStyle(t, prop, layer.visible ? rgba(layer) : "transparent");
    const own = parseFloat(ownValue(t, prop + "-opacity"));
    setStyle(t, prop + "-opacity", isNum(own) && own !== 1 ? "1" : "");
  }

  // Removing a paint: none, unless the page's own is already none.
  function clearSvgPaint(t, prop) {
    setStyle(t, prop, ownValue(t, prop) === "none" ? "" : "none");
    setStyle(t, prop + "-opacity", "");
  }

  function setStyle(target, prop, value) {
    const o = originalOf(target);
    if (!(prop in o.styles)) o.styles[prop] = target.style.getPropertyValue(prop);
    if (value) target.style.setProperty(prop, value);
    else target.style.removeProperty(prop);
    record(target, (entry) => {
      if (value) entry.styles[prop] = value;
      else delete entry.styles[prop];
    });
  }

  function restoreEdits() {
    Object.keys(edits.elements).forEach((sel) => {
      let t = null;
      try {
        t = document.querySelector(sel);
      } catch (e) {
        return;
      }
      if (!t || isUi(t)) return;
      const entry = edits.elements[sel];
      const o = originalOf(t);
      if (entry.html != null && !("html" in o)) o.html = t.innerHTML;
      if (entry.src && !("src" in o)) Object.assign(o, { src: t.getAttribute("src"), srcset: t.getAttribute("srcset") });
      Object.keys(entry.styles).forEach((p) => { if (!(p in o.styles)) o.styles[p] = t.style.getPropertyValue(p); });
      if (entry.html != null) t.innerHTML = entry.html;
      if (entry.src) {
        t.removeAttribute("srcset");
        t.src = entry.src.data;
      }
      if (entry.adjust) setToneFilter(toneId(sel), entry.adjust);
      Object.keys(entry.styles).forEach((p) => t.style.setProperty(p, entry.styles[p]));
    });
  }

  // The page's fill is what paints behind everything: the body, unless a wrapper with a background
  // of its own covers the whole window (an app's <main>), then that one, or the edit wouldn't show.
  let pageEl = null;
  function pageCanvas() {
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.clientHeight;
    for (const e of document.elementsFromPoint(w - 1, h - 1)) {
      if (e === document.body || e === document.documentElement) break;
      if (isUi(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.width >= w - 1 && r.height >= h - 1 && toFill(getComputedStyle(e).backgroundColor)) return e;
    }
    return document.body;
  }

  // The page fill as one CSS background: the top layer first, the bottom one as the color.
  function pageBackground(layers) {
    const shown = layers.filter((l) => l.visible).map((l) => (l.opacity === 100 ? "#" + l.hex : rgba(l)));
    if (!shown.length) return "transparent";
    return shown.slice(0, -1).map((c) => "linear-gradient(" + c + ", " + c + ")").concat(shown.slice(-1)).join(", ");
  }

  // The list the bake skill reads: the file, then one line per changed element.
  function changesText() {
    const lines = [];
    // A wrapper that paints the page is named, so the bake writes its background, not the body's.
    const pageName = pageEl && pageEl !== document.body ? "page (" + selectorFor(pageEl) + ")" : "page";
    if (edits.page) lines.push([pageName, "background: " + pageBackground(edits.page)]);
    Object.keys(edits.elements).forEach((sel) => {
      const e = edits.elements[sel];
      const parts = Object.keys(e.styles).map((p) => p + ": " + e.styles[p]);
      if (e.html != null) parts.push("text: " + e.html);
      if (e.src) parts.push('src: new image "' + e.src.name + '", chosen from her computer');
      if (parts.length) lines.push([sel, parts.join("; ")]);
      // The SVG filter its url() points at, for the bake to put in the page.
      if (e.adjust && hasTone(e.adjust)) lines.push([sel + " svg", toneMarkup(toneId(sel), e.adjust)]);
    });
    // A group: the layers the bake wraps in one new layer in the code.
    edits.groups.forEach((g, i) => lines.push(["group " + (i + 1), g.join(", ")]));
    const width = Math.max.apply(null, lines.map((l) => l[0].length)) + 2;
    return "finetune changes · " + decodeURIComponent(location.pathname) + "\n"
      + lines.map(([sel, decl]) => sel.padEnd(width) + decl).join("\n");
  }

  let toastEl = null;
  let toastTimer = 0;
  function toast(text) {
    if (!toastEl) {
      toastEl = el("div", "ft-toast");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 1800);
  }

  // The clipboard API, or the older copy command when it's blocked (some file:// setups).
  function copyText(text) {
    const byCommand = () => {
      const area = el("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true, byCommand);
    }
    return Promise.resolve(byCommand());
  }

  // Move tool, as in Figma: hover outlines, a click selects, a double-click (or Enter)
  // edits the text in place, Escape steps back out. Works on elements already on the page.
  function makeSelection() {
    const hoverBox = el("div", "ft-hover-box");
    const selBox = el("div", "ft-sel-box");
    ["ft-nw", "ft-ne", "ft-sw", "ft-se"].forEach((c) => selBox.appendChild(el("span", "ft-handle " + c)));
    // Figma's size label under the selection.
    const sizeLabel = el("span", "ft-size-label");
    selBox.appendChild(sizeLabel);
    const marquee = el("div", "ft-marquee");
    hoverBox.hidden = true;
    selBox.hidden = true;
    marquee.hidden = true;
    document.body.append(hoverBox, selBox, marquee);
    // One layer, or two or more: a group, or what shift-clicks gathered.
    let selected = null;
    let many = [];
    let group = null;
    // The group she double-clicked into: inside it, its layers select one at a time.
    let inside = null;
    let editing = null;
    let before = "";
    // While layers are being dragged, hover outlines stay off.
    let moving = false;

    const active = () => !!inspector && !inspector.hidden;
    // The page itself (the body, or the wrapper that paints the page) is the canvas, as in Figma: clicking
    // it selects nothing and shows the Page panel.
    const pickable = (t) => (t && t !== document.body && t !== document.documentElement && t !== pageEl && !isUi(t) ? t : null);

    // Groups are the code's own containers, 1:1, so a page keeps the structure its code has. A click picks the
    // outermost layer under the pointer below the level she's in: the page, until she double-clicks into a
    // group (scope). Wrappers that only hold the page (as big as the window, or display: contents) are passed
    // through, as Figma passes through a top-level frame. Double-click goes one level in, ⌘-click (Ctrl) picks
    // the deepest layer, Escape steps back out.
    let scope = null;
    const passThrough = (e) => {
      if (e === pageEl) return true;
      if (getComputedStyle(e).display === "contents") return true;
      const r = e.getBoundingClientRect();
      return r.width >= document.documentElement.clientWidth - 1 && r.height >= window.innerHeight - 1;
    };
    // The layers from the page down to t, outermost first, wrappers that only hold the page left out.
    function levelOf(t) {
      const chain = [];
      for (let e = t; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
        if (e === t || !passThrough(e)) chain.unshift(e);
      }
      return chain;
    }
    // What a click on target picks, and the level that leaves her in.
    function levelPick(target, deep) {
      const t = pickable(target);
      if (!t) return { pick: null, scope: null };
      const chain = levelOf(t);
      const i = scope ? chain.indexOf(scope) : -1;
      if (deep) return { pick: t, scope: chain[chain.length - 2] || null };
      if (i < 0) return { pick: chain[0], scope: null };
      if (chain[i + 1]) return { pick: chain[i + 1], scope };
      return { pick: t, scope: chain[i - 1] || null };
    }
    // A click picks a layer's whole group, unless she's inside that group.
    function unitOf(t) {
      const g = t && groupOf(t);
      return g && g !== inside ? { list: groupMembers(g), g } : null;
    }
    const current = () => (selected ? [selected] : many);

    function frameRect(b, r) {
      b.style.left = r.left + "px";
      b.style.top = r.top + "px";
      b.style.width = r.width + "px";
      b.style.height = r.height + "px";
    }

    // One layer, not turned, not words inside an SVG: anything else hides the corners (her call: leave out
    // what would be finicky).
    function resizable(t) {
      if (!t || editing || (inSvg(t) && !isVector(t))) return false;
      const cs = getComputedStyle(t);
      if (cs.rotate !== "none" && parseFloat(cs.rotate)) return false;
      const m = /matrix\(([^)]+)\)/.exec(cs.transform);
      if (m) {
        const [, b, c] = m[1].split(",").map(parseFloat);
        if (Math.abs(b) > 1e-6 || Math.abs(c) > 1e-6) return false;
      }
      return true;
    }

    function place() {
      selBox.classList.toggle("no-resize", !(selected && resizable(selected)));
      if (selected) {
        frameRect(selBox, selected.getBoundingClientRect());
        // offsetWidth is the size before any rotation, as Figma shows it; SVG elements have none.
        const r = selected.getBoundingClientRect();
        const w = selected.offsetWidth != null ? selected.offsetWidth : r.width;
        const h = selected.offsetHeight != null ? selected.offsetHeight : r.height;
        sizeLabel.textContent = Math.round(w) + " × " + Math.round(h);
      } else if (many.length) {
        const u = unionRect(many);
        frameRect(selBox, u);
        sizeLabel.textContent = Math.round(u.width) + " × " + Math.round(u.height);
      }
    }
    function moved() {
      place();
      refreshPanel();
    }
    const sizes = new ResizeObserver(moved);

    function show(one, list, g) {
      stopEditing();
      current().forEach((t) => sizes.unobserve(t));
      selected = one;
      many = list;
      group = g;
      const now = current();
      selBox.hidden = !now.length;
      hoverBox.hidden = true;
      now.forEach((t) => sizes.observe(t));
      if (now.length) place();
      showInPanel(selected || (many.length ? many : null), group ? "group" : "selected");
    }
    // After an undo or redo: the same layers, redrawn, as a group if they still are one.
    function reshow() {
      inside = null;
      const one = selected;
      const list = many.slice();
      if (one) show(one, [], null);
      else if (list.length) {
        const sels = list.map(selectorFor);
        show(null, list, edits.groups.find((g) => g.length === sels.length && g.every((x) => sels.includes(x))) || null);
      } else showInPanel(null);
    }
    finishTyping = () => stopEditing();

    function select(t) {
      if (t === selected && !many.length) return;
      show(t, [], null);
    }
    function selectMany(list, g) {
      if (list.length < 2) return select(list[0] || null);
      show(null, list, g || null);
    }

    // A set of layers as the selection: a group if it's exactly one, else "N selected". No change, no redraw.
    function pick(next) {
      const now = current();
      if (next.length === now.length && next.every((t) => now.includes(t))) return;
      const sels = next.map(selectorFor);
      const g = edits.groups.find((gr) => gr.length === sels.length && gr.every((s) => sels.includes(s)));
      selectMany(next, g);
    }

    // Figma's marquee: a drag that starts on the page draws a box and selects every layer it touches
    // (a group as one), live; shift keeps what was selected. A click without a drag clears it.
    function startMarquee(e) {
      const x0 = e.clientX;
      const y0 = e.clientY;
      const base = e.shiftKey ? current().slice() : [];
      let dragging = false;
      const move = (ev) => {
        if (!dragging && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 3) return;
        if (!dragging) {
          dragging = true;
          inside = null;
          hoverBox.hidden = true;
        }
        const r = { left: Math.min(x0, ev.clientX), top: Math.min(y0, ev.clientY), right: Math.max(x0, ev.clientX), bottom: Math.max(y0, ev.clientY) };
        frameRect(marquee, { left: r.left, top: r.top, width: r.right - r.left, height: r.bottom - r.top });
        marquee.hidden = false;
        const touches = (b) => b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top;
        const hit = pageUnits().filter((u) => u.some((t) => touches(t.getBoundingClientRect()))).flat();
        pick(base.concat(hit.filter((h) => !base.includes(h))));
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        marquee.hidden = true;
        if (!dragging && !e.shiftKey) select(null);
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // Figma's move: a press on a layer that turns into a drag moves the whole selection with the pointer,
    // as a translate on each layer (a layer inside another selected one rides along with it). The drag is
    // one undo step. onClick runs instead when the press ends without a drag.
    function startMove(e, onClick) {
      const x0 = e.clientX;
      const y0 = e.clientY;
      let list = null;
      let starts = null;
      const move = (ev) => {
        if (!list) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 3) return;
          const now = current();
          list = now.filter((t) => !now.some((o) => o !== t && o.contains(t)));
          moving = true;
          hoverBox.hidden = true;
          history.quiet++;
          list.forEach(boxed);
          starts = list.map((t) => String(t.style.translate || "").trim().split(/\s+/).map(parseFloat));
        }
        const dx = ev.clientX - x0;
        const dy = ev.clientY - y0;
        list.forEach((t, i) => {
          const [lx, ly] = localDelta(t, dx, dy);
          const tx = Math.round(((starts[i][0] || 0) + lx) * 10) / 10;
          const ty = Math.round(((starts[i][1] || 0) + ly) * 10) / 10;
          setStyle(t, "translate", tx || ty ? tx + "px " + ty + "px" : "");
        });
        moved();
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        if (!list) return onClick && onClick();
        moving = false;
        history.quiet--;
        noteChange();
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // Figma's resize: drag a corner of the selected layer. The opposite corner stays put, Shift keeps the
    // proportions (an image always keeps them), and the new size is written as the code would (its width and
    // height, or a vector's geometry). The drag is one undo step.
    function startResize(e, handle) {
      const t = selected;
      if (!t || !resizable(t)) return;
      const corner = ["nw", "ne", "sw", "se"].find((c) => handle.classList.contains("ft-" + c));
      const west = corner[1] === "w";
      const north = corner[0] === "n";
      const x0 = e.clientX;
      const y0 = e.clientY;
      const start = sizeOf(t);
      const r0 = t.getBoundingClientRect();
      const anchor = { x: west ? r0.right : r0.left, y: north ? r0.bottom : r0.top };
      let started = false;
      const move = (ev) => {
        if (!started) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 2) return;
          started = moving = true;
          hoverBox.hidden = true;
          history.quiet++;
        }
        let w = Math.max(1, start.w + (west ? -1 : 1) * (ev.clientX - x0));
        let h = Math.max(1, start.h + (north ? -1 : 1) * (ev.clientY - y0));
        if (ev.shiftKey || t.tagName === "IMG") {
          const k = Math.max(w / start.w, h / start.h);
          w = start.w * k;
          h = start.h * k;
        }
        setSize(t, Math.round(w), Math.round(h));
        const r = t.getBoundingClientRect();
        const dx = anchor.x - (west ? r.right : r.left);
        const dy = anchor.y - (north ? r.bottom : r.top);
        if (Math.abs(dx) >= 0.05 || Math.abs(dy) >= 0.05) nudge(t, dx, dy);
        moved();
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        if (!started) return;
        moving = false;
        history.quiet--;
        noteChange();
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // ⌘G: the selected layers become one group (a layer in one group at a time, so grouping takes
    // it out of any other). ⌘⇧G: the group goes, its layers stay selected.
    function groupSelection() {
      const list = current();
      if (list.length < 2) return toast("Select two or more layers to group");
      const sels = list.map(selectorFor);
      edits.groups = edits.groups.map((g) => g.filter((s) => !sels.includes(s))).filter((g) => g.length > 1);
      edits.groups.push(sels);
      inside = null;
      show(null, list, sels);
      noteChange();
      toast("Grouped " + list.length + " layers");
    }
    function ungroup() {
      if (!group) return toast("Select a group to ungroup");
      edits.groups = edits.groups.filter((g) => g !== group);
      const list = many.slice();
      show(null, list, null);
      noteChange();
      toast("Ungrouped " + list.length + " layers");
    }

    // Double-click puts the caret where you clicked; Enter selects all the text.
    function startEditing(t, x, y) {
      editing = t;
      before = t.innerHTML;
      t.setAttribute("contenteditable", "plaintext-only");
      t.setAttribute("data-ft-editing", "");
      selBox.classList.add("is-editing");
      t.focus();
      const sel = window.getSelection();
      const at = x == null || !document.caretRangeFromPoint ? null : document.caretRangeFromPoint(x, y);
      sel.removeAllRanges();
      if (at && t.contains(at.startContainer)) sel.addRange(at);
      else {
        const all = document.createRange();
        all.selectNodeContents(t);
        sel.addRange(all);
      }
    }

    function stopEditing() {
      if (!editing) return;
      const t = editing;
      t.removeAttribute("contenteditable");
      t.removeAttribute("data-ft-editing");
      window.getSelection().removeAllRanges();
      selBox.classList.remove("is-editing");
      editing = null;
      if (t.innerHTML === before) return;
      const o = originalOf(t);
      if (!("html" in o)) o.html = before;
      record(t, (entry) => { entry.html = t.innerHTML; });
    }

    // Hover outlines what a click would pick: a group as one box.
    document.addEventListener("pointermove", (e) => {
      const t = active() && !editing && !moving && marquee.hidden ? levelPick(e.target, e.metaKey || e.ctrlKey).pick : null;
      const unit = unitOf(t);
      const over = unit ? unit.list : t ? [t] : [];
      const now = current();
      hoverBox.hidden = !over.length || over.every((o) => now.includes(o));
      if (!hoverBox.hidden) frameRect(hoverBox, unionRect(over));
    }, { passive: true });

    // mousedown, not pointerdown: preventing it is what stops the page starting a text selection.
    document.addEventListener("mousedown", (e) => {
      const handle = e.target && e.target.closest && e.target.closest(".ft-handle");
      if (handle && active() && e.button === 0) {
        e.preventDefault();
        e.stopPropagation();
        return startResize(e, handle);
      }
      if (!active() || e.button !== 0 || isUi(e.target)) return;
      if (editing && editing.contains(e.target)) return;
      e.preventDefault();
      const lp = levelPick(e.target, e.metaKey || e.ctrlKey);
      const t = lp.pick;
      scope = lp.scope;
      if (inside && !(t && groupOf(t) === inside)) inside = null;
      if (!t) return startMarquee(e);
      const unit = unitOf(t);
      const picked = unit ? unit.list : t ? [t] : [];
      // Shift adds what's clicked, or takes it back out, as in Figma.
      if (e.shiftKey) {
        const now = current().slice();
        const has = picked.every((p) => now.includes(p));
        return pick(has ? now.filter((n) => !picked.includes(n)) : now.concat(picked.filter((p) => !now.includes(p))));
      }
      const pickIt = () => (unit ? show(null, unit.list, unit.g) : select(t));
      // A press inside a bigger selection keeps it, so it drags as one; as in Figma, a click without a drag
      // then narrows it to what was clicked.
      const now = current();
      if (now.length > picked.length && picked.every((p) => now.includes(p))) return startMove(e, pickIt);
      pickIt();
      startMove(e);
    }, true);

    // While the inspector is open, the page's own links and buttons don't fire.
    document.addEventListener("click", (e) => {
      if (!active() || isUi(e.target) || (editing && editing.contains(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);

    document.addEventListener("dblclick", (e) => {
      if (!active() || editing || isUi(e.target)) return;
      const deepest = pickable(e.target);
      if (!deepest) return;
      const t = levelPick(e.target).pick;
      // Into a group, as in Figma: the first double-click selects the layer under the pointer.
      const g = groupOf(t);
      if (g && g !== inside) {
        inside = g;
        return select(t);
      }
      // Into a container: one level down, toward what's under the pointer.
      if (t !== deepest) {
        const chain = levelOf(deepest);
        scope = t;
        return select(chain[chain.indexOf(t) + 1] || deepest);
      }
      if (!hasText(t)) return;
      select(t);
      startEditing(t, e.clientX, e.clientY);
    }, true);

    document.addEventListener("keydown", (e) => {
      if (!active() || e.defaultPrevented) return;
      if (editing) {
        if (e.key === "Escape") {
          e.preventDefault();
          stopEditing();
        }
        return;
      }
      if (typing(e.target)) return;
      // Figma's ⌘Z and ⌘⇧Z (Ctrl on Windows); a field or text being typed in keeps its own.
      if ((e.metaKey || e.ctrlKey) && !e.altKey && String(e.key).toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      // Figma's ⌘G and ⌘⇧G (Ctrl on Windows).
      if ((e.metaKey || e.ctrlKey) && !e.altKey && String(e.key).toLowerCase() === "g") {
        e.preventDefault();
        if (e.shiftKey) ungroup();
        else groupSelection();
        return;
      }
      if (!current().length) return;
      if (e.key === "Escape") {
        // Out a level: from a layer inside a group to the group, then to nothing.
        if (selected && inside && groupOf(selected) === inside) {
          const g = inside;
          inside = null;
          return show(null, groupMembers(g), g);
        }
        inside = null;
        if (scope) {
          const up = scope;
          const chain = levelOf(up);
          scope = chain[chain.length - 2] || null;
          return select(up);
        }
        select(null);
      } else if (e.key === "Enter" && selected && hasText(selected)) {
        e.preventDefault();
        startEditing(selected);
      }
    });

    window.addEventListener("scroll", () => {
      place();
      hoverBox.hidden = true;
    }, true);
    window.addEventListener("resize", place);
    document.addEventListener("input", moved, true);

    function sync() {
      document.documentElement.classList.toggle("ft-moving", active());
      if (!active()) {
        hoverBox.hidden = true;
        inside = scope = null;
        select(null);
      }
    }
    sync();

    return { sync, refresh: place, reshow };
  }

  const WEIGHT_NAMES = {
    100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular", 500: "Medium",
    600: "Semi Bold", 700: "Bold", 800: "Extra Bold", 900: "Black",
  };
  const unquote = (s) => String(s).trim().replace(/^["']|["']$/g, "");

  // Only fonts the page actually loads, plus whatever the element uses now.
  function pageFamilies(current) {
    const set = new Set([current]);
    if (document.fonts) document.fonts.forEach((f) => set.add(unquote(f.family)));
    return Array.from(set);
  }

  // A variable font ("100 900") offers every hundred in its range.
  function familyWeights(family) {
    const ws = new Set();
    if (document.fonts) document.fonts.forEach((f) => {
      if (unquote(f.family) !== family) return;
      const [lo, hi] = String(f.weight).split(/\s+/).map(Number);
      if (isNum(hi)) for (let w = 100; w <= 900; w += 100) { if (w >= lo && w <= hi) ws.add(w); }
      else if (isNum(lo)) ws.add(lo);
    });
    return ws.size ? Array.from(ws).sort((a, b) => a - b) : [100, 200, 300, 400, 500, 600, 700, 800, 900];
  }

  // Figma's dark dropdown menu, shared by the panel's dropdowns: opens with the current
  // item over its button, one at a time, closes on a pick, a click elsewhere, or Escape.
  // An onHover previews each item as the pointer passes over it; onHover(null) puts it back,
  // so a menu that closes without a pick leaves the page as it was.
  function makeMenu(root) {
    const menu = el("div", "ft-menu");
    menu.hidden = true;
    root.appendChild(menu);
    let anchor = null;
    let hover = null;

    function close() {
      menu.hidden = true;
      anchor = null;
      if (hover) hover(null);
      hover = null;
    }

    document.addEventListener("pointerdown", (e) => {
      if (anchor && !menu.contains(e.target) && !anchor.contains(e.target)) close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !anchor) return;
      e.preventDefault();
      close();
    });

    return {
      close,
      toggle(btn, items, current, onPick, onHover) {
        if (anchor === btn) return close();
        if (hover) hover(null);
        anchor = btn;
        hover = onHover || null;
        // Read at leave time: a pick may have closed the menu (and dropped the preview) first.
        menu.onpointerleave = () => { if (hover) hover(null); };
        menu.textContent = "";
        items.forEach((it) => {
          // A heading names the items under it; it isn't one.
          if (it.heading) {
            menu.appendChild(el("div", "ft-menu-heading", it.label));
            return;
          }
          const item = button("ft-menu-item", null, () => {
            close();
            onPick(it.value);
          });
          if (hover) item.addEventListener("pointerenter", () => hover(it.value));
          const check = el("span", "ft-menu-check");
          if (same(it.value, current)) check.innerHTML = ICON.check;
          item.append(check, el("span", null, it.label));
          // An item that can be deleted shows a trash can on hover.
          if (it.remove) {
            const trash = el("span", "ft-menu-trash");
            trash.innerHTML = ICON.trash;
            trash.setAttribute("aria-label", "Delete");
            trash.addEventListener("click", (e) => {
              e.stopPropagation();
              it.remove();
            });
            item.appendChild(trash);
          }
          menu.appendChild(item);
        });
        menu.hidden = false;
        const r = btn.getBoundingClientRect();
        const i = items.findIndex((it) => same(it.value, current));
        // Kept on screen: a button near the right edge opens its menu leftward. With no current item it
        // opens below the button, so nothing starts under the pointer (and a preview menu stays still).
        menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 8)) + "px";
        const top = i < 0 ? r.bottom + 4 : r.top - 8 - i * 24;
        menu.style.top = Math.max(8, Math.min(top, window.innerHeight - menu.offsetHeight - 8)) + "px";
      },
    };
  }

  function dropdown(onClick) {
    const btn = button("ft-dd", null, () => onClick(btn));
    const label = el("span", "ft-dd-label");
    btn.append(label, caret());
    return { btn, label };
  }

  function numField(icon, tip) {
    const wrap = el("div", "ft-num-field");
    if (icon) {
      const i = el("span", "ft-field-icon");
      // An svg, or a letter like Figma's W and H.
      if (icon.charAt(0) === "<") i.innerHTML = icon;
      else {
        i.textContent = icon;
        i.classList.add("ft-field-letter");
      }
      if (tip) {
        i.setAttribute("data-ft-tip", tip);
        withTip(i);
      }
      wrap.appendChild(i);
    }
    const input = el("input", "ft-num-input");
    input.type = "text";
    input.spellcheck = false;
    wrap.appendChild(input);
    return {
      wrap,
      input,
      set(v, force) {
        if (force || document.activeElement !== input) input.value = String(v);
      },
    };
  }

  // Figma's image modes as object-fit. Crop shows the image at its own size, cut by the box;
  // Stretch is the web's default, which Figma doesn't have.
  const FITS = [["cover", "Fill"], ["contain", "Fit"], ["none", "Crop"], ["fill", "Stretch"]];
  const ADJUSTMENTS = [
    ["exposure", "Exposure"], ["contrast", "Contrast"], ["saturation", "Saturation"],
    ["temperature", "Temperature"], ["tint", "Tint"], ["highlights", "Highlights"], ["shadows", "Shadows"],
  ];

  // Figma's image popover, one per inspector: the fill mode, a preview you click to choose
  // another image, and the adjustment sliders (centered at 0; double-click one to reset it).
  function makeImagePop(root, menu, onChange) {
    let target = null;
    let anchor = null;
    let adjust = null;

    const pop = el("div", "ft-pop");
    pop.hidden = true;
    const head = el("div", "ft-pop-head");
    const title = el("span", null, "Image");
    head.append(title, iconButton(ICON.x, "Close", close));

    const fitLabel = (v) => (FITS.find((f) => f[0] === v) || [v, v])[1];
    const mode = dropdown((btn) => {
      menu.toggle(btn, FITS.map(([value, label]) => ({ label, value })), getComputedStyle(target).objectFit, (v) => {
        setStyle(target, "object-fit", v);
        draw();
        onChange();
      });
    });
    mode.btn.classList.add("ft-fit");

    const preview = button("ft-img-preview", null, () => file.click());
    preview.setAttribute("aria-label", "Replace image");
    const previewImg = el("img");
    previewImg.alt = "";
    preview.append(previewImg, el("span", "ft-img-replace", "Replace image"));
    const file = el("input");
    file.type = "file";
    file.accept = "image/*";
    file.hidden = true;
    // The new image goes in as a data URL so it survives a reload; the bake asks where the file lives.
    file.addEventListener("change", () => {
      const f = file.files && file.files[0];
      const t = target;
      file.value = "";
      if (!f || !t) return;
      const reader = new FileReader();
      reader.onload = () => {
        const o = originalOf(t);
        if (!("src" in o)) Object.assign(o, { src: t.getAttribute("src"), srcset: t.getAttribute("srcset") });
        t.removeAttribute("srcset");
        t.src = String(reader.result);
        record(t, (entry) => { entry.src = { name: f.name, data: String(reader.result) }; });
        draw();
        onChange();
      };
      reader.readAsDataURL(f);
    });

    const sliders = el("div", "ft-adjust");
    const tracks = {};
    ADJUSTMENTS.forEach(([key, label]) => {
      const track = el("div", "ft-adj-track");
      track.append(el("div", "ft-adj-fill"), el("div", "ft-adj-knob"));
      const set = (v) => {
        adjust[key] = v;
        setAdjust(target, adjust);
        draw();
        onChange();
      };
      // A small detent at 0, so the middle is easy to land on.
      dragArea(track, 8, (x) => {
        const v = Math.round(x * 200 - 100);
        set(Math.abs(v) <= 2 ? 0 : v);
      });
      track.addEventListener("dblclick", () => set(0));
      tracks[key] = track;
      sliders.append(el("span", "ft-adjust-label", label), track);
    });

    const body = el("div", "ft-pop-body");
    body.append(mode.btn, preview, sliders);
    pop.append(head, body, file);
    root.appendChild(pop);

    function draw() {
      if (!target) return;
      if (target.tagName === "IMG") {
        previewImg.src = target.currentSrc || target.src;
        mode.label.textContent = fitLabel(getComputedStyle(target).objectFit);
      }
      ADJUSTMENTS.forEach(([key]) => {
        const x = (adjust[key] + 100) / 200;
        tracks[key].style.setProperty("--ft-x", x);
        tracks[key].style.setProperty("--ft-lo", Math.min(x, 0.5));
        tracks[key].style.setProperty("--ft-span", Math.abs(x - 0.5));
      });
    }

    function open(t, row, thumb) {
      target = t;
      anchor = thumb;
      adjust = adjustOf(t);
      // For a box it's just the sliders, applied to the whole element.
      const img = t.tagName === "IMG";
      title.textContent = img ? "Image" : "Adjustments";
      mode.btn.hidden = preview.hidden = !img;
      pop.hidden = false;
      draw();
      // Just left of the panel, level with the row, kept on screen.
      const r = row.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
      pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
    }

    function close() {
      if (!target) return;
      menu.close();
      pop.hidden = true;
      target = anchor = null;
    }

    // Closes on a click anywhere else, or Escape. The thumbnail that opened it toggles it instead.
    document.addEventListener("pointerdown", (e) => {
      if (!target || pop.contains(e.target) || anchor.contains(e.target) || e.target.closest(".ft-menu")) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !target || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      close();
    });

    return {
      close,
      toggle(t, row, thumb) {
        if (target === t) close();
        else open(t, row, thumb);
      },
    };
  }

  // Leaving Stretch, the bands keep the width they had, as in Figma.
  function setGuideAlign(g, align) {
    if (g.align === "stretch" && align !== "stretch") {
      const span = document.documentElement.clientWidth;
      g.width = Math.max(1, Math.round((span - 2 * g.offset - (g.count - 1) * g.gutter) / g.count));
    }
    g.align = align;
  }

  // Groups, as in Figma (⌘G, ⌘⇧G): each is a list of its layers' selectors, saved with Save and copied
  // for the bake, which wraps them in a real layer in the code. The live page is never rewrapped: moving
  // a React page's elements under a new parent breaks it, so a group here is how they select and move.
  const groupMembers = (g) => g.map((sel) => {
    try {
      return document.querySelector(sel);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
  function groupOf(t) {
    const sel = selectorFor(t);
    return edits.groups.find((g) => g.includes(sel)) || null;
  }

  // The box around several layers, in window coordinates.
  function unionRect(list) {
    const rs = list.map((t) => t.getBoundingClientRect());
    const left = Math.min(...rs.map((r) => r.left));
    const top = Math.min(...rs.map((r) => r.top));
    const right = Math.max(...rs.map((r) => r.right));
    const bottom = Math.max(...rs.map((r) => r.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  // A move by dx, dy as a translate, recorded like one typed into the Position fields.
  function nudge(t, dx, dy) {
    [dx, dy] = localDelta(t, dx, dy);
    const cur = String(t.style.translate || "").trim().split(/\s+/).map(parseFloat);
    const tx = Math.round(((cur[0] || 0) + dx) * 10) / 10;
    const ty = Math.round(((cur[1] || 0) + dy) * 10) / 10;
    boxed(t);
    setStyle(t, "translate", tx || ty ? tx + "px " + ty + "px" : "");
  }

  // "All items" for the guide alignments: what she could select (text, images, boxes with a fill),
  // outermost only, so a card moves with the words inside it.
  function pageItems() {
    const all = Array.from(document.body.querySelectorAll("*")).filter((e) => {
      if (e === pageEl || isUi(e) || inSvg(e) || e.closest(".ft-guides, .ft-hover-box, .ft-sel-box, .ft-marquee, .ft-panel")) return false;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(e).visibility === "hidden") return false;
      return hasText(e) || e.tagName === "IMG" || e instanceof SVGSVGElement || !!toFill(getComputedStyle(e).backgroundColor);
    });
    return all.filter((e) => !all.some((o) => o !== e && o.contains(e)));
  }

  // The grid the page's code already has, read as a horizontal layout: its widest CSS grid with four or
  // more equal columns, at least half the window wide (a two-column list is content, not the page's grid).
  // Count and gutter are the grid's own; equal margins read as Stretch, otherwise Left with an offset.
  function pageGrid() {
    const W = document.documentElement.clientWidth;
    let best = null;
    for (const e of document.body.querySelectorAll("*")) {
      if (isUi(e) || e.closest(".ft-guides, .ft-panel")) continue;
      const cs = getComputedStyle(e);
      if (cs.display !== "grid" && cs.display !== "inline-grid") continue;
      const tracks = cs.gridTemplateColumns.split(/\s+/).map(parseFloat).filter(isNum);
      if (tracks.length < 4) continue;
      const avg = tracks.reduce((a, b) => a + b, 0) / tracks.length;
      if (tracks.some((t) => Math.abs(t - avg) > 1)) continue;
      const r = e.getBoundingClientRect();
      if (r.width < W / 2 || (best && r.width <= best.r.width)) continue;
      best = { e, r, cs, n: tracks.length, w: avg };
    }
    if (!best) return null;
    const { r, cs } = best;
    const left = r.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
    const right = r.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
    const g = Object.assign(newGuide(), { count: best.n, gutter: Math.round(parseFloat(cs.columnGap) || 0) });
    if (Math.abs(left - (W - right)) <= 1) Object.assign(g, { align: "stretch", offset: Math.round(left) });
    else Object.assign(g, { align: "left", offset: Math.round(left), width: Math.round(best.w) });
    return g;
  }

  // A guide's column edges across the window, as drawn.
  function guideEdges(g) {
    const span = document.documentElement.clientWidth;
    const n = g.count;
    const stretch = g.align === "stretch";
    const w = stretch ? (span - 2 * g.offset - (n - 1) * g.gutter) / n : g.width;
    const total = n * w + (n - 1) * g.gutter;
    const start = stretch ? g.offset : g.align === "center" ? (span - total) / 2
      : g.align === "right" ? span - g.offset - total : g.offset;
    const starts = [];
    const ends = [];
    for (let i = 0; i < n; i++) {
      starts.push(start + i * (w + g.gutter));
      ends.push(start + i * (w + g.gutter) + w);
    }
    return { starts, ends };
  }

  // What the guide alignments move: each group as one, then every other item on its own.
  function pageUnits() {
    const groups = edits.groups.map(groupMembers).filter((m) => m.length);
    const grouped = groups.flat();
    const loose = pageItems().filter((t) => !grouped.some((m) => m === t || m.contains(t) || t.contains(m)));
    return groups.concat(loose.map((t) => [t]));
  }

  const nearest = (list, v) => list.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  const ALIGN_WORD = { left: "left", right: "right", hcenter: "horizontally" };

  // Align items to nearest column: each item's left or right edge snaps to the nearest column edge;
  // horizontally puts each item in the middle of the page instead. Every move is recorded.
  function alignAll(g, how) {
    const W = document.documentElement.clientWidth;
    pageUnits().forEach((unit) => {
      const r = unionRect(unit);
      const dx = how === "left" ? nearest(guideEdges(g).starts, r.left) - r.left
        : how === "right" ? nearest(guideEdges(g).ends, r.right) - r.right
          : W / 2 - (r.left + r.width / 2);
      if (Math.abs(dx) >= 0.05) unit.forEach((t) => nudge(t, dx, 0));
    });
    toast("Align all items " + ALIGN_WORD[how]);
  }

  // Figma's Alignment for a selection: every layer lines up on an edge or the middle of the selection's box.
  // A selected group moves as one; a selection that is just one group lines up its own layers. A layer inside
  // another selected one rides along with it. Every move is recorded.
  function alignSelection(list, how) {
    const top = list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
    const groups = edits.groups.map(groupMembers).filter((m) => m.length > 1 && m.every((t) => top.includes(t)));
    const grouped = groups.flat();
    const units = groups.length === 1 && grouped.length === top.length ? top.map((t) => [t])
      : groups.concat(top.filter((t) => !grouped.includes(t)).map((t) => [t]));
    alignTo(units, unionRect(top), how);
  }

  // One layer lines up inside its parent, as in Figma's frame: the parent's box inside its border and
  // padding (a display: contents parent has no box, so its own parent counts).
  function alignToParent(t, how) {
    let p = t.parentElement;
    while (p && p !== document.body && getComputedStyle(p).display === "contents") p = p.parentElement;
    if (!p) return;
    const r = p.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const px = (k) => parseFloat(cs[k]) || 0;
    const left = r.left + px("borderLeftWidth") + px("paddingLeft");
    const right = r.right - px("borderRightWidth") - px("paddingRight");
    const top = r.top + px("borderTopWidth") + px("paddingTop");
    const bottom = r.bottom - px("borderBottomWidth") - px("paddingBottom");
    alignTo([[t]], { left, right, top, bottom, width: right - left, height: bottom - top }, how);
  }

  function alignTo(units, box, how) {
    units.forEach((unit) => {
      const r = unionRect(unit);
      const dx = how === "left" ? box.left - r.left
        : how === "hcenter" ? box.left + box.width / 2 - (r.left + r.width / 2)
          : how === "right" ? box.right - r.right : 0;
      const dy = how === "top" ? box.top - r.top
        : how === "vcenter" ? box.top + box.height / 2 - (r.top + r.height / 2)
          : how === "bottom" ? box.bottom - r.bottom : 0;
      if (Math.abs(dx) >= 0.05 || Math.abs(dy) >= 0.05) unit.forEach((t) => nudge(t, dx, dy));
    });
  }

  // A group's items in one column or one row, in order, with the gaps between them; null when they overlap both
  // ways (then there's no single spacing to set).
  function stackOf(items) {
    const rs = items.map((t) => ({ t, r: t.getBoundingClientRect() })).filter((x) => x.r.width || x.r.height);
    if (rs.length < 2) return null;
    const run = (axis) => {
      const lo = axis === "y" ? "top" : "left";
      const hi = axis === "y" ? "bottom" : "right";
      const sorted = rs.slice().sort((a, b) => a.r[lo] - b.r[lo]);
      if (!sorted.every((x, i) => !i || x.r[lo] >= sorted[i - 1].r[hi] - 0.5)) return null;
      return { axis, items: sorted.map((x) => x.t), gaps: sorted.slice(1).map((x, i) => x.r[lo] - sorted[i].r[hi]) };
    };
    return run("y") || run("x");
  }

  // Sets every gap in the stack to n by moving each item after the first (so the ones below move down too).
  // Each move is an ordinary edit.
  function setStackGap(stack, n) {
    const y = stack.axis === "y";
    let edge = null;
    stack.items.forEach((t, i) => {
      if (i) {
        const r = t.getBoundingClientRect();
        const d = edge + n - (y ? r.top : r.left);
        if (Math.abs(d) >= 0.05) nudge(t, y ? 0 : d, y ? d : 0);
      }
      const r2 = t.getBoundingClientRect();
      edge = y ? r2.bottom : r2.right;
    });
  }

  // What the page itself says for a property, written back only where it differs (so a value that matches the
  // code leaves no edit behind).
  function setUnlessOwn(t, prop, value) {
    setStyle(t, prop, ownValue(t, prop) === value ? "" : value);
  }

  function guideLayer(g) {
    const d = el("div");
    const c = rgba(g.color);
    const start = g.align === "left";
    const end = g.align === "right";
    d.style.display = "flex";
    d.style.justifyContent = end ? "flex-end" : g.align === "center" ? "center" : "flex-start";
    d.style.gap = g.gutter + "px";
    const pad = (a, b) => "0 " + b + "px 0 " + a + "px";
    d.style.padding = g.align === "stretch" ? pad(g.offset, g.offset) : pad(start ? g.offset : 0, end ? g.offset : 0);
    for (let i = 0; i < g.count; i++) {
      const band = el("div");
      band.style.background = c;
      band.style.flex = g.align === "stretch" ? "1" : "none";
      if (g.align !== "stretch") band.style.width = g.width + "px";
      d.appendChild(band);
    }
    return d;
  }

  // A number field for one of a guide's values. Live: each keystroke redraws the guide, so 16 and 20 can
  // be compared as fast as they're typed. Its Escape listener goes before editable's, so the old value
  // comes back before the field resets.
  function guideNum(g, key, min, whole, onChange) {
    const f = numField(null);
    f.set(g[key], true);
    let start = g[key];
    const parse = (v) => (whole ? Math.round(parseFloat(v)) : parseFloat(v));
    f.input.addEventListener("focus", () => { start = g[key]; });
    f.input.addEventListener("input", () => {
      const n = parse(f.input.value);
      if (!isNum(n) || n < min) return;
      g[key] = n;
      onChange();
    });
    f.input.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      g[key] = start;
      onChange();
    });
    editable(f.input, (force) => f.set(g[key], force), (v) => {
      const n = parse(v);
      if (!isNum(n) || n < min) return;
      g[key] = n;
      onChange();
    });
    return f.wrap;
  }

  // Figma's layout guide settings, from the guide's icon: its color. (Its layout is in the panel.)
  function makeGuidePop(root, menu, picker, onChange) {
    let g = null;
    let anchor = null;
    const pop = el("div", "ft-pop ft-guide-pop");
    pop.hidden = true;
    const head = el("div", "ft-pop-head");
    head.append(el("span", null, "Columns"), iconButton(ICON.x, "Close", close));
    const body = el("div", "ft-pop-body ft-guide-fields");
    pop.append(head, body);
    root.appendChild(pop);

    function build() {
      body.replaceChildren(el("span", "ft-field-label", "Color"), fillRow(g.color, onChange, null, picker));
    }

    function open(guide, rowEl, icon) {
      g = guide;
      anchor = icon;
      pop.hidden = false;
      build();
      // Just left of the panel, level with the row, kept on screen.
      const r = rowEl.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
      pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
    }

    function close() {
      if (!g) return;
      if (pop.contains(document.activeElement)) document.activeElement.blur();
      picker.closeFor(g.color);
      menu.close();
      pop.hidden = true;
      g = anchor = null;
    }

    // Closes on a click anywhere else, or Escape. Its own menus and the color picker count as inside;
    // the icon that opened it toggles it instead.
    document.addEventListener("pointerdown", (e) => {
      if (!g || pop.contains(e.target) || anchor.contains(e.target) || e.target.closest(".ft-menu, .ft-pop")) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !g || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      close();
    });

    return {
      close,
      closeFor(guide) {
        if (g === guide) close();
      },
      toggle(guide, rowEl, icon) {
        if (g === guide) close();
        else open(guide, rowEl, icon);
      },
    };
  }

  // Figma's effect settings, one per inspector: X and Y, Blur, Spread and Color for a shadow, Blur for a blur.
  function makeEffectPop(root, menu, picker) {
    let fx = null;
    let anchor = null;
    let onChange = null;
    const pop = el("div", "ft-pop ft-guide-pop");
    pop.hidden = true;
    const head = el("div", "ft-pop-head");
    const title = el("span");
    head.append(title, iconButton(ICON.x, "Close", close));
    const body = el("div", "ft-pop-body ft-guide-fields");
    pop.append(head, body);
    root.appendChild(pop);

    function num(key, letter, min) {
      const f = numField(letter);
      const show = (force) => f.set(fx[key], force);
      editable(f.input, show, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || (min != null && n < min)) return;
        fx[key] = Math.round(n * 10) / 10;
        onChange();
      });
      show(true);
      return f.wrap;
    }

    function build() {
      title.textContent = EFFECT_TYPES.find(([t]) => t === fx.type)[1];
      const label = (text) => el("span", "ft-field-label", text);
      if (!isShadow(fx)) return body.replaceChildren(label("Blur"), num("blur", null, 0));
      const xy = el("div", "ft-type-pair");
      xy.append(num("x", "X"), num("y", "Y"));
      body.replaceChildren(
        label("Position"), xy,
        label("Blur"), num("blur", null, 0),
        ...(noSpread ? [] : [label("Spread"), num("spread")]),
        label("Color"), fillRow(fx, () => onChange(), null, picker, { noEye: true })
      );
    }

    // noSpread: a vector's drop shadow is a drop-shadow(), which has no spread.
    let noSpread = false;
    function open(effect, rowEl, icon, change, vector) {
      fx = effect;
      anchor = icon;
      onChange = change;
      noSpread = !!vector;
      pop.hidden = false;
      build();
      // Just left of the panel, level with the row, kept on screen.
      const r = rowEl.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
      pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
    }

    function close() {
      if (!fx) return;
      if (pop.contains(document.activeElement)) document.activeElement.blur();
      picker.closeFor(fx);
      menu.close();
      pop.hidden = true;
      fx = anchor = onChange = null;
    }

    // Closes on a click anywhere else, or Escape. Its own menus and the color picker count as inside;
    // the icon that opened it toggles it instead.
    document.addEventListener("pointerdown", (e) => {
      if (!fx || pop.contains(e.target) || anchor.contains(e.target) || e.target.closest(".ft-menu, .ft-pop")) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !fx || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      close();
    });

    return {
      close,
      toggle(effect, rowEl, icon, change, vector) {
        if (fx === effect) close();
        else open(effect, rowEl, icon, change, vector);
      },
    };
  }

  function makeInspector() {
    // Shown on load, like Figma's panel.
    const root = el("div", "ft-inspector");

    // Undo and redo the latest change, as in Figma (also ⌘Z and ⌘⇧Z); Reset goes back to the code. They sit
    // at the left of the panel's top row; Hide UI is at its right.
    const undoBtn = iconButton(ICON.undo, "Undo", undo);
    const redoBtn = iconButton(ICON.redo, "Redo", redo);
    const actions = el("div", "ft-actions");
    actions.append(undoBtn, redoBtn, iconButton(ICON.refresh, "Reset to the code's last presets", resetEdits));
    const top = el("div", "ft-top");
    top.appendChild(actions);
    // Design and Motion, as Figma's Design and Prototype, in a bar at the bottom of the window. It lives in the
    // panel, so it hides with it. Motion is empty for now.
    const designPane = el("div", "ft-pane");
    const modes = el("div", "ft-modes");
    const modeBtns = [["design", "Design", "pencilRuler"], ["motion", "Motion", "play"]].map(([name, label, icon]) => {
      const b = button("ft-modes-btn", null, () => {
        modeBtns.forEach((m) => m.setAttribute("aria-selected", String(m === b)));
        root.setAttribute("data-tab", name);
        designPane.hidden = name !== "design";
      });
      b.innerHTML = ICON[icon];
      b.appendChild(el("span", null, label));
      b.setAttribute("aria-selected", String(name === "design"));
      return b;
    });
    modes.append(...modeBtns);
    root.setAttribute("data-tab", "design");
    // The bar's theme follows the page: dark when what paints behind everything is dark. Checked again when
    // the page switches theme (an attribute or class on html or body, or the system's setting) and when its
    // fill is edited.
    function themeModes() {
      // An edited page fill paints as gradients over a transparent color, so read its top layer instead.
      const bg = edits.page ? layers.find((l) => l.visible)
        : [pageEl, document.body, document.documentElement].map((e) => e && toFill(getComputedStyle(e).backgroundColor)).find(Boolean);
      const n = bg ? parseInt(bg.hex, 16) : 0xffffff;
      const lum = (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
      modes.setAttribute("data-theme", lum < 0.5 ? "dark" : "light");
    }
    const themeWatch = new MutationObserver(() => themeModes());
    [document.documentElement, document.body].forEach((e) => themeWatch.observe(e, { attributes: true, attributeFilter: ["class", "data-theme", "style"] }));
    if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", themeModes);
    historyChanged = () => {
      undoBtn.disabled = !history.past.length && !history.timer;
      redoBtn.disabled = !history.future.length;
    };

    // A page fill saved from an earlier visit comes back; the bottom layer is the base.
    pageEl = pageCanvas();
    // The page's own fill (before any paint), for undoing back to it.
    const pageOwn = {
      layer: toFill(getComputedStyle(pageEl).backgroundColor)
        || toFill(getComputedStyle(document.body).backgroundColor)
        || { hex: "FFFFFF", opacity: 100, visible: true },
      color: pageEl.style.backgroundColor,
      image: pageEl.style.backgroundImage,
    };
    const layers = edits.page ? edits.page.map((l) => Object.assign({}, l)) : [
      toFill(getComputedStyle(pageEl).backgroundColor)
        || toFill(getComputedStyle(document.body).backgroundColor)
        || toFill(getComputedStyle(document.documentElement).backgroundColor)
        || { hex: "FFFFFF", opacity: 100, visible: true },
    ];
    const picker = makePicker(root);

    // Fills stack like Figma's: the top row paints on top.
    function paint() {
      const shown = layers.filter((l) => l.visible).map((l) => "linear-gradient(" + rgba(l) + ", " + rgba(l) + ")");
      pageEl.style.backgroundColor = "transparent";
      pageEl.style.backgroundImage = shown.length ? shown.join(", ") : "none";
      picker.sync();
      themeModes();
    }

    function paintAndSave() {
      paint();
      edits.page = layers.map((l) => Object.assign({}, l));
      noteChange();
    }

    function remove(layer, row) {
      picker.closeFor(layer);
      layers.splice(layers.indexOf(layer), 1);
      row.remove();
      paintAndSave();
    }

    const page = el("div", "ft-section");
    const head = el("div", "ft-section-head");
    const list = el("div", "ft-fills");
    head.append(el("span", null, "Page"), iconButton(ICON.plus, "Add fill", () => {
      const layer = { hex: "000000", opacity: 20, visible: true };
      layers.unshift(layer);
      list.prepend(fillRow(layer, paintAndSave, remove, picker));
      paintAndSave();
    }));
    // The bottom row is the base: no remove.
    const drawRows = () => list.replaceChildren(...layers.map((l, i) => fillRow(l, paintAndSave, i === layers.length - 1 ? null : remove, picker)));
    drawRows();
    if (edits.page) paint();
    page.append(head, list);

    const menu = makeMenu(root);
    const imagePop = makeImagePop(root, menu, () => changed(false));

    // Horizontal layout: one columns layout at a time (Figma's layout guide). With none saved for the page,
    // it starts as the page's own grid when its code has one (pageGrid), ready to tweak. Its row's icon opens its
    // color, the eye shows or hides it, and its fields and alignment sit under it. Save keeps it; Copy
    // never includes it. The header saves it as a style, or applies a saved one.
    const guides = edits.guides;
    if (!guides.length) {
      const own = pageGrid();
      if (own) guides.push(own);
    }
    const overlay = el("div", "ft-guides");
    const guideSec = el("div", "ft-section");
    const guideHead = el("div", "ft-section-head");
    const guideList = el("div", "ft-guide-list");

    // Styles: the page's own grid first ("From the page", so a tweak can always go back to it), then hers,
    // under "This page" and "All pages". Hovering one shows it on the page, a click applies it, leaving
    // the menu puts hers back; a saved style's trash can deletes it.
    function openStyles() {
      guidePop.close();
      const entries = [[STYLES_PAGE, "This page"], [STYLES_ALL, "All pages"]]
        .map(([key, heading]) => ({ key, heading, list: loadStyles(key) }));
      const flat = [];
      const items = [];
      const own = pageGrid();
      if (own) {
        items.push({ heading: true, label: "From the page" }, { label: "Page grid · " + styleName(own), value: 0 });
        flat.push({ name: "Page grid", guide: own });
      }
      entries.forEach(({ key, heading, list }) => {
        if (!list.length) return;
        items.push({ heading: true, label: heading });
        list.forEach((st, i) => {
          items.push({ label: st.name, value: flat.length, remove: () => {
            const now = loadStyles(key);
            now.splice(i, 1);
            storeStyles(key, now);
            toast("Deleted style: " + st.name);
            menu.close();
            openStyles();
          } });
          flat.push(st);
        });
      });
      if (!flat.length) items.push({ heading: true, label: "No saved styles yet" });
      let before = null;
      const use = (list) => {
        guides.splice(0, guides.length, ...copyGuides(list));
        drawGuides();
      };
      menu.toggle(styleBtn, items, null, (v) => use([flat[v].guide]), (v) => {
        history.quiet++;
        if (v == null) {
          if (before) use(before);
          before = null;
        } else {
          if (!before) before = copyGuides(guides);
          use([flat[v].guide]);
        }
        history.quiet--;
      });
    }
    const styleBtn = iconButton(ICON.guideStyles, "Styles", openStyles);

    // Save as style: two buttons in place, for every page or just this one. Named from its numbers;
    // the same numbers aren't saved twice.
    const savePop = el("div", "ft-pop ft-save-pop");
    savePop.hidden = true;
    const closeSave = () => { savePop.hidden = true; };
    function saveStyle(key) {
      closeSave();
      const g = guides[0];
      if (!g) return;
      const name = styleName(g);
      const list = loadStyles(key);
      if (list.some((st) => st.name === name)) return toast("Already saved: " + name);
      list.push({ name, guide: copyGuides([g])[0] });
      toast(storeStyles(key, list) ? "Saved style: " + name : "Couldn't save: storage is blocked or full");
    }
    const saveBody = el("div", "ft-save-body");
    saveBody.append(
      button("ft-choice", "Apply to all pages", () => saveStyle(STYLES_ALL)),
      button("ft-choice", "Just this page", () => saveStyle(STYLES_PAGE))
    );
    savePop.appendChild(saveBody);
    const saveBtn = iconButton(ICON.bookmark, "Save as style", () => {
      if (!savePop.hidden) return closeSave();
      menu.close();
      savePop.hidden = false;
      // Under the button, its right edge on the button's, kept on screen.
      const r = saveBtn.getBoundingClientRect();
      savePop.style.left = Math.max(8, r.right - savePop.offsetWidth) + "px";
      savePop.style.top = Math.min(r.bottom + 6, window.innerHeight - savePop.offsetHeight - 8) + "px";
    });
    document.addEventListener("pointerdown", (e) => {
      if (!savePop.hidden && !savePop.contains(e.target) && !saveBtn.contains(e.target)) closeSave();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || savePop.hidden || e.defaultPrevented) return;
      e.preventDefault();
      closeSave();
    });
    root.appendChild(savePop);

    const guideActions = el("div", "ft-head-actions");
    guideActions.append(styleBtn, saveBtn);
    guideHead.append(el("span", null, "Horizontal layout"), guideActions);
    guideSec.append(guideHead, guideList);
    const guidePop = makeGuidePop(root, menu, picker, () => drawGuides());
    const effectPop = makeEffectPop(root, menu, picker);
    let guideRows = [];

    // No layout yet: say so, and offer the usual one to start from (12 columns).
    const guideEmpty = el("div", "ft-guide-empty");
    const guideWarn = el("div", "ft-guide-warn");
    guideWarn.innerHTML = ICON.warning;
    guideWarn.appendChild(el("span", null, "Layout not defined."));
    const addLayout = button("ft-choice ft-choice-icon", null, () => {
      guides.push(newGuide());
      drawGuides();
    });
    const plus = el("span");
    plus.innerHTML = ICON.plus;
    addLayout.append(plus, el("span", null, "Add layout"));
    guideEmpty.append(guideWarn, addLayout);

    // Under each guide, Figma's alignment buttons, as actions: pressed, they align every item, then
    // spring back.
    const ACROSS = [["left", "alignLeft", "Align left"], ["hcenter", "alignHCenter", "Align horizontally"], ["right", "alignRight", "Align right"]];
    const alignSeg = (g) => actionSeg(ACROSS, (how) => alignAll(g, how));
    // Figma's Alignment row: across, then up and down.
    const alignRow = (act) => {
      const row = el("div", "ft-type-pair");
      row.append(
        actionSeg([["left", "alignLeft", "Align left"], ["hcenter", "alignHCenter", "Align horizontal centers"], ["right", "alignRight", "Align right"]], act),
        actionSeg([["top", "alignTop", "Align top"], ["vcenter", "alignVCenter", "Align vertical centers"], ["bottom", "alignBottom", "Align bottom"]], act),
      );
      return row;
    };
    // A row of one-shot buttons that spring back, each with a Figma-style tooltip.
    function actionSeg(items, act) {
      const seg = el("div", "ft-seg ft-seg-act");
      items.forEach(([how, icon, tip]) => {
        const b = button("ft-seg-btn", null, () => act(how));
        b.innerHTML = ICON[icon];
        b.setAttribute("data-ft-tip", tip);
        b.setAttribute("aria-label", tip);
        withTip(b);
        seg.appendChild(b);
      });
      return seg;
    }

    // A columns guide's layout fields, as in Figma: Count, Type, Width (Auto when stretched), Margin
    // (stretched) or Offset (packed to a side), Gutter. A new Type rebuilds them.
    function guideFields(box, g, onChange) {
      const align = dropdown((btn) => menu.toggle(btn, GUIDE_ALIGN.map(([value, label]) => ({ label, value })), g.align, (v) => {
        setGuideAlign(g, v);
        onChange();
        guideFields(box, g, onChange);
      }));
      align.label.textContent = (GUIDE_ALIGN.find(([a]) => a === g.align) || [])[1];
      let width = guideNum(g, "width", 1, false, onChange);
      if (g.align === "stretch") {
        const auto = numField(null);
        auto.input.value = "Auto";
        auto.input.disabled = true;
        width = auto.wrap;
      }
      // Rows: Count across both columns; Type | Width; Margin (or Offset) | Gutter.
      const items = [labeled("Count", guideNum(g, "count", 1, true, onChange), true), labeled("Type", align.btn), labeled("Width", width)];
      if (g.align === "stretch") items.push(labeled("Margin", guideNum(g, "offset", 0, false, onChange)));
      else if (g.align !== "center") items.push(labeled("Offset", guideNum(g, "offset", 0, false, onChange)));
      items.push(labeled("Gutter", guideNum(g, "gutter", 0, false, onChange)));
      box.replaceChildren(...items);
    }

    function guideRow(g) {
      const rowEl = el("div", "ft-guide-row");
      // Its color, as a swatch (as in Figma): it opens the color settings.
      const icon = iconButton("", "Color settings", () => guidePop.toggle(g, rowEl, icon));
      icon.classList.add("ft-guide-icon");
      const swatch = el("span", "ft-swatch");
      icon.appendChild(swatch);
      // One kind of guide, so its name is a label, not a menu.
      const name = el("div", "ft-dd ft-dd-static");
      const label = el("span", "ft-dd-label");
      name.appendChild(label);
      const eye = iconButton(ICON.eye, "Hide grid", () => {
        g.visible = !g.visible;
        drawGuides();
      });
      rowEl.append(icon, name, eye);
      const group = el("div", "ft-guide");
      const alignBox = el("div", "ft-guide-align");
      alignBox.append(el("div", "ft-field-label", "Align items to nearest column"), alignSeg(g));
      const fields = el("div", "ft-type ft-guide-set");
      guideFields(fields, g, () => drawGuides());
      group.append(rowEl, fields, alignBox);
      return { g, group, rowEl, label, eye, swatch };
    }

    // The row is kept while it's the same layout, so its open color stays anchored to it.
    function drawGuides() {
      if (!guides.length) {
        guideRows = [];
        if (guideList.firstChild !== guideEmpty) guideList.replaceChildren(guideEmpty);
      } else if (guideRows.length !== guides.length || guideRows.some((r, i) => r.g !== guides[i])) {
        guideRows = guides.map(guideRow);
        guideList.replaceChildren(...guideRows.map((r) => r.group));
      }
      saveBtn.disabled = !guides.length;
      guideRows.forEach((r) => {
        const { g, rowEl, label, eye, swatch } = r;
        label.textContent = guideName(g);
        swatch.style.setProperty("--ft-c", "#" + g.color.hex);
        swatch.style.setProperty("--ft-ca", rgba(g.color));
        const tip = g.visible ? "Hide grid" : "Show grid";
        eye.innerHTML = g.visible ? ICON.eye : ICON.eyeClosed;
        eye.setAttribute("data-ft-tip", tip);
        eye.setAttribute("aria-label", tip);
        rowEl.classList.toggle("is-hidden", !g.visible);
      });
      overlay.replaceChildren(...guides.filter((g) => g.visible).map(guideLayer));
      noteChange();
    }
    drawGuides();
    let fillLayers = [];
    const chosen = el("div", "ft-chosen");
    let textLayer = null;
    // Each section's redraw. Any edit redraws them all, since one change (a bigger
    // font size) can move another section's numbers (the height).
    let draws = [];
    function changed(force) {
      draws.forEach((d) => d(force));
      if (selection) selection.refresh();
    }
    refreshPanel = () => changed(false);

    function section(title) {
      const s = el("div", "ft-section");
      const head = el("div", "ft-section-head");
      head.append(el("span", null, title));
      s.appendChild(head);
      return s;
    }

    function labeled(text, child, wide) {
      const wrap = el("div", "ft-labeled" + (wide ? " ft-span2" : ""));
      wrap.append(el("div", "ft-field-label", text), child);
      return wrap;
    }

    // A segmented control: one choice pressed at a time, each with a Figma-style tooltip.
    function segmented(options, apply) {
      const seg = el("div", "ft-seg");
      const btns = options.map(([value, icon, tip]) => {
        const b = button("ft-seg-btn", null, () => {
          apply(value);
          changed(true);
        });
        b.innerHTML = ICON[icon];
        b.setAttribute("data-ft-tip", tip);
        b.setAttribute("aria-label", tip);
        withTip(b);
        seg.appendChild(b);
        return [value, b];
      });
      return {
        seg,
        set: (now) => btns.forEach(([value, b]) => b.setAttribute("aria-pressed", String(value === now))),
      };
    }

    // Position, as in Figma: X and Y on the page, rotation, rotate 90 and the flips. They use
    // the translate, rotate and scale properties, so the page's own layout is left alone.
    function position(target) {
      const s = section("Position");
      const nums = (v) => String(v || "").trim().split(/\s+/).map(parseFloat);
      const read = () => {
        const r = target.getBoundingClientRect();
        const cs = getComputedStyle(target);
        const sc = cs.scale === "none" ? [1, 1] : nums(cs.scale);
        return {
          x: Math.round(r.left + window.scrollX),
          y: Math.round(r.top + window.scrollY),
          rot: cs.rotate === "none" ? 0 : parseFloat(cs.rotate) || 0,
          sx: sc[0],
          sy: sc.length > 1 ? sc[1] : sc[0],
        };
      };
      const moveBy = (dx, dy) => nudge(target, dx, dy);
      const setRot = (deg) => {
        const d = Math.round((((deg % 360) + 360) % 360) * 10) / 10;
        boxed(target);
        turnInPlace(target);
        setStyle(target, "rotate", d ? d + "deg" : "");
      };
      const setScale = (sx, sy) => {
        boxed(target);
        turnInPlace(target);
        setStyle(target, "scale", sx === 1 && sy === 1 ? "" : sx + " " + sy);
      };

      const x = numField("X");
      const y = numField("Y");
      editable(x.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) moveBy(n - read().x, 0);
      });
      editable(y.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) moveBy(0, n - read().y);
      });
      // Clockwise is positive, as in CSS, so the number bakes straight into a rotate.
      const rot = numField(ICON.angle, "Rotation");
      editable(rot.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) setRot(n);
      });
      const turns = actionSeg([["rotate", "rotateSquare", "Rotate 90° right"], ["flipH", "flipHorizontal", "Flip horizontal"], ["flipV", "flipVertical", "Flip vertical"]], (how) => {
        const now = read();
        if (how === "rotate") setRot(now.rot + 90);
        else if (how === "flipH") setScale(-now.sx, now.sy);
        else setScale(now.sx, -now.sy);
        changed(true);
      });
      const toParent = (how) => {
        alignToParent(target, how);
        changed(true);
      };

      const xy = el("div", "ft-type-pair");
      xy.append(x.wrap, y.wrap);
      const rotRow = el("div", "ft-type-pair");
      rotRow.append(rot.wrap, turns);
      const grid = el("div", "ft-type");
      grid.append(labeled("Alignment", alignRow(toParent), true), labeled("Position", xy, true), labeled("Rotation", rotRow, true));
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        x.set(now.x, force);
        y.set(now.y, force);
        rot.set(Math.round(now.rot * 10) / 10 + "°", force);
      });
      return s;
    }

    // Two or more layers, as in Figma: "Group" or "N selected", and X and Y for where they sit together.
    // A move moves every layer by the same amount, each recorded, so the bake keeps them together.
    function setSection(list, isGroup) {
      const s = section("Position");
      const read = () => {
        const u = unionRect(list);
        return { x: Math.round(u.left + window.scrollX), y: Math.round(u.top + window.scrollY) };
      };
      const x = numField("X");
      const y = numField("Y");
      // Measured once, then every layer moves by that much.
      editable(x.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n)) return;
        const d = n - read().x;
        list.forEach((t) => nudge(t, d, 0));
      });
      editable(y.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n)) return;
        const d = n - read().y;
        list.forEach((t) => nudge(t, 0, d));
      });
      const xy = el("div", "ft-type-pair");
      xy.append(x.wrap, y.wrap);
      const act = (how) => {
        alignSelection(list, how);
        changed();
      };
      const grid = el("div", "ft-type");
      grid.append(labeled("Alignment", alignRow(act), true), labeled("Position", xy, true));
      // A group's Spacing, when its layers sit in one column or row: the ones after the first move.
      const st = isGroup ? stackOf(list) : null;
      if (st) {
        const spacing = numField(st.axis === "x" ? ICON.arrowsHorizontal : ICON.arrowsVertical, "Spacing");
        editable(spacing.input, changed, (v) => {
          const n = parseFloat(v);
          const now = stackOf(list);
          if (isNum(n) && now) setStackGap(now, n);
        });
        grid.appendChild(labeled("Spacing", spacing.wrap));
        draws.push((force) => {
          const now = stackOf(list);
          spacing.set(!now ? "" : now.gaps.every((g) => Math.abs(g - now.gaps[0]) < 0.5) ? Math.round(now.gaps[0]) : "Mixed", force);
        });
      }
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        x.set(now.x, force);
        y.set(now.y, force);
      });
      return s;
    }

    function setOpacity(target, n) {
      setStyle(target, "opacity", String(Math.min(100, Math.max(0, Math.round(n))) / 100));
    }

    // Hiding clears to the page's own visibility first, and only forces visible if the page hid it.
    function toggleHidden(target) {
      if (getComputedStyle(target).visibility === "hidden") {
        setStyle(target, "visibility", "");
        if (getComputedStyle(target).visibility === "hidden") setStyle(target, "visibility", "visible");
      } else {
        setStyle(target, "visibility", "hidden");
      }
    }

    const BLENDS = [
      ["normal", "Normal"], ["darken", "Darken"], ["multiply", "Multiply"], ["color-burn", "Color burn"],
      ["lighten", "Lighten"], ["screen", "Screen"], ["color-dodge", "Color dodge"], ["overlay", "Overlay"],
      ["soft-light", "Soft light"], ["hard-light", "Hard light"], ["difference", "Difference"],
      ["exclusion", "Exclusion"], ["hue", "Hue"], ["saturation", "Saturation"], ["color", "Color"],
      ["luminosity", "Luminosity"],
    ];

    // Appearance, as in Figma: show or hide, blend mode, opacity, corner radius.
    function appearance(target) {
      const s = section("Appearance");
      // Inside an SVG only a rect has corners (its rx and ry), in its own units.
      const rect = inSvg(target) && target.tagName.toLowerCase() === "rect";
      const corners = (!inSvg(target) && !isSvgRoot(target)) || rect;
      const read = () => {
        const cs = getComputedStyle(target);
        return {
          hidden: cs.visibility === "hidden",
          blend: cs.mixBlendMode,
          opacity: Math.round(parseFloat(cs.opacity) * 100),
          radius: rect ? Math.round((parseFloat(cs.rx) || parseFloat(cs.ry) || 0) * vectorSize(target).sx) : Math.round(parseFloat(cs.borderTopLeftRadius) || 0),
        };
      };
      const eye = iconButton(ICON.eye, "Hide", () => {
        toggleHidden(target);
        changed(true);
      });
      const blend = iconButton(ICON.drop, "Blend mode", () => {
        menu.toggle(blend, BLENDS.map(([value, label]) => ({ label, value })), read().blend, (v) => {
          setStyle(target, "mix-blend-mode", v === "normal" ? "" : v);
          changed(true);
        });
      });
      const actions = el("div", "ft-head-actions");
      actions.append(eye, blend);
      // Adjustments, the image's seven sliders, on any layer but text: a box's apply to the whole element, an
      // image's open its image popover (where Figma keeps them). Like Blend mode, it opens something and never
      // stays pressed (her call).
      let adjustBtn = null;
      if (!hasText(target)) {
        adjustBtn = iconButton(ICON.slidersHorizontal, "Adjustments", () => imagePop.toggle(target, s, adjustBtn));
        actions.appendChild(adjustBtn);
      }
      s.firstChild.appendChild(actions);

      const opacity = numField(ICON.checkerboard, "Opacity");
      const radius = numField(ICON.frameCorners, "Corner radius");
      editable(opacity.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) setOpacity(target, n);
      });
      editable(radius.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        if (!rect) return setStyle(target, "border-radius", n + "px");
        const u = round1(n / vectorSize(target).sx) + "px";
        setStyle(target, "rx", u);
        setStyle(target, "ry", u);
      });
      const grid = el("div", "ft-type");
      grid.appendChild(labeled("Opacity", opacity.wrap));
      if (corners) grid.appendChild(labeled("Corner radius", radius.wrap));
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        eye.innerHTML = now.hidden ? ICON.eyeClosed : ICON.eye;
        eye.setAttribute("data-ft-tip", now.hidden ? "Show" : "Hide");
        eye.setAttribute("aria-label", now.hidden ? "Show" : "Hide");
        opacity.set(now.opacity + "%", force);
        radius.set(now.radius, force);
      });
      return s;
    }

    // An image's fill, as in Figma: its thumbnail, "Image", opacity and the eye. The thumbnail
    // opens the image popover. For an img the fill is the element, so opacity and the eye
    // are the same ones Appearance shows.
    function imageFill(target) {
      const s = section("Fill");
      const row = el("div", "ft-fill-row");
      const field = el("div", "ft-fill");
      const color = el("div", "ft-fill-color");
      const thumb = button("ft-swatch ft-thumb", null, () => imagePop.toggle(target, row, thumb));
      thumb.addEventListener("pointerdown", (e) => e.preventDefault());
      color.append(thumb, el("span", "ft-fill-name", "Image"));
      const alphaPart = el("div", "ft-fill-alpha");
      const alpha = el("input", "ft-alpha");
      alpha.type = "text";
      alpha.inputMode = "numeric";
      alphaPart.append(alpha, el("span", "ft-pct", "%"));
      editable(alpha, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) setOpacity(target, n);
      });
      field.append(color, alphaPart);
      const eye = iconButton(ICON.eye, "Hide fill", () => {
        toggleHidden(target);
        changed(true);
      });
      const actions = el("div", "ft-fill-actions");
      actions.append(eye);
      row.append(field, actions);
      const list = el("div", "ft-fills");
      list.appendChild(row);
      s.appendChild(list);
      draws.push((force) => {
        const cs = getComputedStyle(target);
        const hidden = cs.visibility === "hidden";
        thumb.style.backgroundImage = "url(" + JSON.stringify(target.currentSrc || target.src) + ")";
        if (force || document.activeElement !== alpha) alpha.value = String(Math.round(parseFloat(cs.opacity) * 100));
        row.classList.toggle("is-hidden", hidden);
        eye.innerHTML = hidden ? ICON.eyeClosed : ICON.eye;
        eye.setAttribute("data-ft-tip", hidden ? "Show fill" : "Hide fill");
      });
      return s;
    }

    // A box's fill is its background color, on the same row and picker as the page.
    // A box with none gets Figma's + to add one.
    function boxFill(target) {
      const s = section("Fill");
      const list = el("div", "ft-fills");
      const show = (layer) => {
        fillLayers.push(layer);
        list.appendChild(fillRow(layer, () => {
          setStyle(target, "background-color", layer.visible ? rgba(layer) : "transparent");
          picker.sync();
        }, null, picker));
      };
      const now = toFill(getComputedStyle(target).backgroundColor);
      if (now) show(now);
      else {
        const add = iconButton(ICON.plus, "Add fill", () => {
          add.remove();
          const layer = { hex: "FFFFFF", opacity: 100, visible: true };
          setStyle(target, "background-color", rgba(layer));
          show(layer);
        });
        s.firstChild.appendChild(add);
      }
      s.appendChild(list);
      return s;
    }

    // A vector's fill is its SVG fill: a color on the same row and picker as a box's, the + when it has none
    // (Figma's light grey), or the code's gradient or pattern, shown but not edited here.
    function vectorFill(target) {
      const s = section("Fill");
      const list = el("div", "ft-fills");
      s.appendChild(list);
      const paint = svgPaint(target, "fill");
      const add = iconButton(ICON.plus, "Add fill", () => {
        add.remove();
        const layer = { hex: "D9D9D9", opacity: 100, visible: true };
        writeSvgPaint(target, "fill", layer);
        show(layer);
      });
      function show(layer) {
        fillLayers.push(layer);
        list.appendChild(fillRow(layer, () => {
          writeSvgPaint(target, "fill", layer);
          picker.sync();
        }, (l, row) => {
          picker.closeFor(l);
          row.remove();
          clearSvgPaint(target, "fill");
          s.firstChild.appendChild(add);
        }, picker));
      }
      if (paint.kind === "color") show(paint.layer);
      else if (paint.kind === "server") list.appendChild(el("div", "ft-field-label", "A gradient or pattern from the code"));
      else s.firstChild.appendChild(add);
      return s;
    }

    // An icon's fill is its color: the <svg>'s CSS color, which its shapes paint with (currentColor).
    function iconFill(target) {
      const s = section("Fill");
      const layer = toFill(getComputedStyle(target).color) || { hex: "000000", opacity: 100, visible: true };
      fillLayers.push(layer);
      const list = el("div", "ft-fills");
      list.appendChild(fillRow(layer, () => {
        setStyle(target, "color", layer.visible ? rgba(layer) : "transparent");
        picker.sync();
      }, null, picker));
      s.appendChild(list);
      return s;
    }

    // A line icon's stroke is its weight: stroke-width on the <svg>, which its shapes take (its color is the
    // icon's Fill). In the icon's own units, as its code writes it (Lucide's 2 in a 24 viewBox).
    function iconStroke(target) {
      const s = section("Stroke");
      const shape = [...target.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect")].find((e) => getComputedStyle(e).stroke !== "none");
      const weight = numField(ICON.textAlignJustify, "Weight");
      const show = (force) => weight.set(Math.round(parseFloat(getComputedStyle(shape || target).strokeWidth) * 100) / 100, force);
      editable(weight.input, show, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        setStyle(target, "stroke-width", ownValue(target, "stroke-width") === String(n) ? "" : String(n));
      });
      show(true);
      draws.push(show);
      const grid = el("div", "ft-type");
      grid.appendChild(labeled("Weight", weight.wrap));
      s.appendChild(grid);
      return s;
    }

    // Stroke, as in Figma: one paint, where it sits (inside, centered on or outside the edge) and its weight.
    // A layer with none gets the + to add one.
    function strokeSection(target) {
      const s = section("Stroke");
      const body = el("div", "ft-stroke");
      s.appendChild(body);
      let st = strokeOf(target);
      const add = iconButton(ICON.plus, "Add stroke", () => {
        st = { hex: "000000", opacity: 100, visible: true, position: inSvg(target) ? "center" : "inside", weight: 1 };
        setStroke(target, st);
        build();
      });
      const put = () => {
        setStroke(target, st);
        picker.sync();
      };
      function build() {
        body.replaceChildren();
        if (!st) return s.firstChild.appendChild(add);
        add.remove();
        fillLayers.push(st);
        const list = el("div", "ft-fills");
        list.appendChild(fillRow(st, put, () => {
          picker.closeFor(st);
          st = null;
          setStroke(target, null);
          build();
        }, picker, { noun: "stroke" }));
        // SVG draws a stroke centered on the path, so a vector's has only Center.
        const ats = inSvg(target) ? STROKE_AT.filter(([v]) => v === "center") : STROKE_AT;
        const at = dropdown((btn) => menu.toggle(btn, ats.map(([value, label]) => ({ label, value })), st.position, (v) => {
          st.position = v;
          put();
          build();
        }));
        at.label.textContent = STROKE_AT.find(([v]) => v === st.position)[1];
        const weight = numField(ICON.textAlignJustify, "Weight");
        const show = (force) => weight.set(st.weight, force);
        editable(weight.input, show, (v) => {
          const n = parseFloat(v);
          if (!isNum(n) || n < 0) return;
          st.weight = Math.round(n * 10) / 10;
          put();
        });
        show(true);
        const grid = el("div", "ft-type");
        grid.append(labeled("Position", at.btn), labeled("Weight", weight.wrap));
        body.append(list, grid);
      }
      build();
      return s;
    }

    // Effects, as in Figma: shadows and blurs, the top row painting on top. The + adds a drop shadow
    // at the top; the sun opens an effect's settings.
    function effectsSection(target) {
      const s = section("Effects");
      const list = el("div", "ft-fills");
      s.appendChild(list);
      const fxs = effectsOf(target);
      const put = () => setEffects(target, fxs);
      s.firstChild.appendChild(iconButton(ICON.plus, "Add effect", () => {
        fxs.unshift(newEffect());
        put();
        build();
      }));
      function row(fx) {
        const r = el("div", "ft-fill-row ft-fx-row");
        r.classList.toggle("is-hidden", !fx.visible);
        // Anything SVG gets what a filter can draw: Drop shadow and Layer blur, with no spread.
        const svgFx = target instanceof SVGElement;
        const gear = iconButton(ICON.sun, "Effect settings", () => effectPop.toggle(fx, r, gear, put, svgFx));
        const types = svgFx ? EFFECT_TYPES.filter(([t]) => t === "drop" || t === "layer") : EFFECT_TYPES;
        const type = dropdown((btn) => menu.toggle(btn, types.map(([value, label]) => ({ label, value })), fx.type, (v) => {
          fx.type = v;
          put();
          build();
        }));
        type.label.textContent = EFFECT_TYPES.find(([t]) => t === fx.type)[1];
        type.btn.classList.add("ft-fx-type");
        const eye = iconButton(fx.visible ? ICON.eye : ICON.eyeClosed, fx.visible ? "Hide effect" : "Show effect", () => {
          fx.visible = !fx.visible;
          put();
          build();
        });
        const minus = iconButton(ICON.minus, "Remove effect", () => {
          fxs.splice(fxs.indexOf(fx), 1);
          put();
          build();
        });
        const actions = el("div", "ft-fill-actions");
        actions.append(minus, eye);
        r.append(gear, type.btn, actions);
        return r;
      }
      function build() {
        effectPop.close();
        list.replaceChildren(...fxs.map(row));
      }
      build();
      return s;
    }

    // Layout, as in Figma: Resizing (text only) and Dimensions, labelled W and H, with the
    // lock that keeps proportions (on for images, as in Figma).
    // Edits go on the element as inline styles, so they show live.
    function layout(target) {
      const s = section("Layout");
      let locked = target.tagName === "IMG";
      const vector = isVector(target);
      // Words inside an SVG sit on a baseline, with no box to size.
      const fixed = inSvg(target) && !vector;
      const read = () => {
        // The size before any rotation, as Figma shows it: a vector's from its geometry, an <svg>'s from its box.
        const r = target.getBoundingClientRect();
        const v = vector ? vectorSize(target) : null;
        return {
          w: Math.round(v ? v.w : target.offsetWidth != null ? target.offsetWidth : r.width),
          h: Math.round(v ? v.h : target.offsetHeight != null ? target.offsetHeight : r.height),
          resizing: target.style.width === "max-content" ? "hug" : target.style.height ? "fixed" : "auto",
        };
      };
      // A new size, as the code writes it: a vector's geometry, anything else its width and height.
      const resize = (nw, nh) => setSize(target, nw, nh);
      const resizing = segmented([
        ["hug", "arrowLineRight", "Auto width"],
        ["auto", "textAlignJustify", "Auto height"],
        ["fixed", "article", "Fixed size"],
      ], (v) => {
        boxed(target);
        const r = target.getBoundingClientRect();
        setStyle(target, "width", v === "hug" ? "max-content" : Math.round(r.width) + "px");
        setStyle(target, "height", v === "fixed" ? Math.round(r.height) + "px" : "");
      });
      const w = numField("W");
      const h = numField("H");
      editable(w.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        const now = read();
        const nh = locked && now.w ? Math.round((n * now.h) / now.w) : null;
        resize(n, vector ? (nh != null ? nh : now.h) : nh);
      });
      editable(h.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        const now = read();
        const nw = locked && now.h ? Math.round((n * now.w) / now.h) : null;
        resize(vector ? (nw != null ? nw : now.w) : nw, n);
      });
      w.input.disabled = h.input.disabled = fixed;
      const lock = iconButton(ICON.linkSimple, "Constrain proportions", () => {
        locked = !locked;
        changed(true);
      });

      const dims = el("div", "ft-type-pair");
      dims.append(w.wrap, h.wrap);
      const dimsRow = el("div", "ft-with-action");
      dimsRow.append(dims, lock);
      const grid = el("div", "ft-type");
      if (hasText(target) && !inSvg(target)) grid.appendChild(labeled("Resizing", resizing.seg, true));

      // A group (a container in the code) shows its Flow and its Spacing, read from its CSS and written back
      // as CSS: Vertical and Horizontal are flex in a column or a row, Freeform is no flex. Grid shows only on a
      // grid, which isn't made here. Spacing is the gap on a flex or grid; on anything else, when the children
      // sit in one column or row, it moves the ones after the first, so the ones below move too.
      const container = !(target instanceof SVGElement) && !hasText(target) && target.children.length > 0;
      const flowOf = () => {
        const cs = getComputedStyle(target);
        if (/grid/.test(cs.display)) return "grid";
        if (/flex/.test(cs.display)) return /column/.test(cs.flexDirection) ? "vertical" : "horizontal";
        return "free";
      };
      const items = () => Array.from(target.children).filter((c) => {
        const cs = getComputedStyle(c);
        return !isUi(c) && cs.display !== "none" && cs.position !== "fixed";
      });
      const px = (v) => (v === "normal" ? 0 : parseFloat(v) || 0);
      const gapOf = () => {
        const cs = getComputedStyle(target);
        const flow = flowOf();
        if (flow === "vertical") return { css: "row-gap", axis: "y", n: px(cs.rowGap) };
        if (flow === "horizontal") return { css: "column-gap", axis: "x", n: px(cs.columnGap) };
        if (flow === "grid") return { css: "gap", axis: "y", n: px(cs.rowGap) === px(cs.columnGap) ? px(cs.rowGap) : null };
        const st = stackOf(items());
        if (!st) return null;
        return { stack: st, axis: st.axis, n: st.gaps.every((g) => Math.abs(g - st.gaps[0]) < 0.5) ? Math.round(st.gaps[0]) : null };
      };
      let flow = null;
      let spacing = null;
      if (container) {
        const now = flowOf();
        const opts = [["free", "shapes", "Freeform"], ["vertical", "rows", "Vertical layout"], ["horizontal", "columns", "Horizontal layout"]];
        if (now === "grid") opts.push(["grid", "gridFour", "Grid"]);
        flow = segmented(opts, (v) => {
          if (v === "grid" || v === flowOf()) return;
          const own = ownValue(target, "display");
          if (v === "free") {
            setStyle(target, "display", /flex|grid/.test(own) ? "block" : "");
            setStyle(target, "flex-direction", "");
          } else {
            setStyle(target, "display", /flex/.test(own) ? "" : "flex");
            setUnlessOwn(target, "flex-direction", v === "vertical" ? "column" : "row");
          }
          // The spacing's axis can change with the flow.
          if (selection) selection.reshow();
        });
        grid.appendChild(labeled("Flow", flow.seg, true));
        const g = gapOf();
        if (g) {
          spacing = numField(g.axis === "x" ? ICON.arrowsHorizontal : ICON.arrowsVertical, "Spacing");
          editable(spacing.input, changed, (v) => {
            const n = parseFloat(v);
            const now2 = gapOf();
            if (!isNum(n) || !now2) return;
            if (now2.css) setStyle(target, now2.css, Math.max(0, n) + "px");
            else setStackGap(now2.stack, n);
          });
        }
      }
      grid.appendChild(labeled("Dimensions", dimsRow, true));
      if (spacing) grid.appendChild(labeled("Spacing", spacing.wrap));
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        resizing.set(now.resizing);
        w.set(now.w, force);
        h.set(now.h, force);
        lock.setAttribute("aria-pressed", String(locked));
        if (flow) flow.set(flowOf());
        if (spacing) {
          const g = gapOf();
          spacing.set(!g ? "" : g.n == null ? "Mixed" : Math.round(g.n), force);
        }
      });
      return s;
    }

    // Typography, as in Figma: family, weight, size, line height, letter spacing, alignment.
    function typography(target) {
      const s = section("Typography");

      const read = () => {
        const cs = getComputedStyle(target);
        const size = parseFloat(cs.fontSize);
        return {
          family: unquote(cs.fontFamily.split(",")[0]),
          weight: Math.round(parseFloat(cs.fontWeight)) || 400,
          size,
          leading: cs.lineHeight === "normal" ? "Auto" : String(Math.round(parseFloat(cs.lineHeight) * 10) / 10),
          // Shown as a percent of the size, as Figma does.
          tracking: cs.letterSpacing === "normal" ? 0 : Math.round((parseFloat(cs.letterSpacing) / size) * 1000) / 10,
          // Inside an SVG, alignment is text-anchor.
          align: inSvg(target) ? { start: "left", middle: "center", end: "right" }[cs.textAnchor] || ""
            : { start: "left", left: "left", center: "center", end: "right", right: "right" }[cs.textAlign] || "",
          // Figma's vertical alignment maps to align-content, which block elements honor in current browsers.
          valign: { start: "top", "flex-start": "top", normal: "top", center: "middle", end: "bottom", "flex-end": "bottom" }[cs.alignContent] || "",
        };
      };

      // Keep the weight if the family has it; otherwise the nearest one it does.
      const weightIn = (f, w) => familyWeights(f).reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
      // Figma's hover preview: the text wears each family the pointer passes over, saving nothing.
      // The inline values it had are kept here to put back.
      let before = null;
      const family = dropdown((btn) => {
        const now = read();
        menu.toggle(btn, pageFamilies(now.family).map((f) => ({ label: f, value: f })), now.family, (f) => {
          setStyle(target, "font-family", '"' + f + '"');
          const w = weightIn(f, now.weight);
          if (w !== now.weight) setStyle(target, "font-weight", String(w));
          changed(true);
        }, (f) => {
          if (f == null) {
            if (!before) return;
            target.style.fontFamily = before.family;
            target.style.fontWeight = before.weight;
            before = null;
            return;
          }
          if (!before) before = { family: target.style.fontFamily, weight: target.style.fontWeight };
          const w = weightIn(f, now.weight);
          target.style.fontFamily = '"' + f + '"';
          target.style.fontWeight = w === now.weight ? before.weight : String(w);
        });
      });
      family.btn.classList.add("ft-span2");
      const weight = dropdown((btn) => {
        const now = read();
        const items = familyWeights(now.family).map((w) => ({ label: WEIGHT_NAMES[w] || String(w), value: w }));
        menu.toggle(btn, items, now.weight, (w) => {
          setStyle(target, "font-weight", String(w));
          changed(true);
        });
      });
      const size = numField(null);
      // Figma's size presets, from the caret in the size field.
      const sizeCaret = button("ft-field-caret", null, () => {
        const sizes = [10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128];
        menu.toggle(sizeCaret, sizes.map((s) => ({ label: String(s), value: s })), Math.round(read().size), (s) => {
          setStyle(target, "font-size", s + "px");
          changed(true);
        });
      });
      sizeCaret.innerHTML = ICON.caretDown;
      size.wrap.appendChild(sizeCaret);
      const leading = numField(ICON.arrowsVertical, "Line height");
      const tracking = numField(ICON.arrowsHorizontal, "Letter spacing");

      const align = segmented([
        ["left", "textAlignLeft", "Align left"],
        ["center", "textAlignCenter", "Align center"],
        ["right", "textAlignRight", "Align right"],
      ], (v) => {
        if (inSvg(target)) return setStyle(target, "text-anchor", { left: "start", center: "middle", right: "end" }[v]);
        boxed(target);
        setStyle(target, "text-align", v);
      });
      const valign = segmented([
        ["top", "arrowLineUp", "Align top"],
        ["middle", "arrowsInLineVertical", "Align middle"],
        ["bottom", "arrowLineDown", "Align bottom"],
      ], (v) => {
        boxed(target);
        setStyle(target, "align-content", { top: "start", middle: "center", bottom: "end" }[v]);
      });

      function draw(force) {
        const now = read();
        // A preview resizes the text, which redraws the panel; the labels stay on the real font.
        if (!before) {
          family.label.textContent = now.family;
          weight.label.textContent = WEIGHT_NAMES[now.weight] || String(now.weight);
        }
        size.set(Math.round(now.size * 10) / 10, force);
        leading.set(now.leading, force);
        tracking.set(now.tracking + "%", force);
        align.set(now.align);
        valign.set(now.valign);
      }
      draws.push(draw);

      // Bare numbers are px for size and line height, and percent for letter spacing, as in Figma.
      editable(size.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n) && n > 0) setStyle(target, "font-size", n + "px");
      });
      editable(leading.input, changed, (v) => {
        const s = String(v).trim().toLowerCase();
        const n = parseFloat(s);
        if (s === "auto") setStyle(target, "line-height", "normal");
        else if (isNum(n) && n >= 0) setStyle(target, "line-height", s.endsWith("%") ? n + "%" : n + "px");
      });
      editable(tracking.input, changed, (v) => {
        const t = String(v).trim().toLowerCase();
        const n = parseFloat(t);
        if (isNum(n)) setStyle(target, "letter-spacing", t.endsWith("px") ? n + "px" : n / 100 + "em");
      });

      const alignRow = el("div", "ft-type-pair");
      alignRow.appendChild(align.seg);
      if (!inSvg(target)) alignRow.appendChild(valign.seg);

      const grid = el("div", "ft-type");
      grid.append(
        family.btn, weight.btn, size.wrap,
        labeled("Line height", leading.wrap), labeled("Letter spacing", tracking.wrap),
        labeled("Alignment", alignRow, true)
      );
      s.appendChild(grid);
      return s;
    }

    // The text's color, on the same fill row and picker as the page. One fill: CSS text has one color.
    function textFill(target) {
      const s = section("Fill");
      // Words inside an SVG are painted by fill, not color.
      const svg = inSvg(target);
      const paint = svg ? svgPaint(target, "fill") : null;
      textLayer = (svg ? paint.layer : toFill(getComputedStyle(target).color)) || { hex: "000000", opacity: 100, visible: true };
      const layer = textLayer;
      const list = el("div", "ft-fills");
      list.appendChild(fillRow(layer, () => {
        if (svg) writeSvgPaint(target, "fill", layer);
        else setStyle(target, "color", layer.visible ? rgba(layer) : "transparent");
        picker.sync();
      }, null, picker));
      s.appendChild(list);
      return s;
    }

    // The layer's kind, read from the code, and the element it is (its tag and first class or id).
    function kindLine(t) {
      const tag = t.tagName.toLowerCase();
      const kind = hasText(t) ? "Text" : tag === "img" ? "Image" : t instanceof SVGSVGElement ? "SVG"
        : isVector(t) ? (tag === "g" ? "Group" : "Vector") : t.children.length ? "Group" : "Box";
      const row = el("div", "ft-kind");
      row.append(el("span", "ft-kind-name", kind), el("span", "ft-kind-el", tag + (t.id ? "#" + t.id : t.classList.length ? "." + t.classList[0] : "")));
      return row;
    }

    // The same line for several layers: "Group" for a ⌘G group, "N selected" otherwise. Neither is an element
    // in the code (the bake wraps a group's layers in a new one), so there's no element name (her call).
    function kindLineMany(list, isGroup) {
      const row = el("div", "ft-kind");
      row.appendChild(el("span", "ft-kind-name", isGroup ? "Group" : list.length + " selected"));
      return row;
    }

    // Figma's order: Position, Layout, Appearance, then Typography and the text's Fill for
    // text, the image's Fill for an img, the background Fill for anything else, then Stroke and Effects.
    showInPanel = (target, kind) => {
      menu.close();
      imagePop.close();
      if (textLayer) picker.closeFor(textLayer);
      fillLayers.forEach((l) => picker.closeFor(l));
      textLayer = null;
      fillLayers = [];
      draws = [];
      chosen.textContent = "";
      guidePop.close();
      effectPop.close();
      page.hidden = guideSec.hidden = !!target;
      if (!target) return;
      if (Array.isArray(target)) {
        chosen.append(kindLineMany(target, kind === "group"), setSection(target, kind === "group"));
        changed(true);
        return;
      }
      chosen.append(kindLine(target), position(target), layout(target), appearance(target));
      // Text gets no Stroke or Effects (her call); everything else gets both, after its Fill, as in Figma.
      if (hasText(target)) chosen.append(typography(target), textFill(target));
      else if (isSvgRoot(target) && paintsWithColor(target)) {
        // An icon: its color, a line icon's weight, and effects that follow its shape. No box stroke.
        chosen.appendChild(iconFill(target));
        if (strokedIcon(target)) chosen.appendChild(iconStroke(target));
        chosen.appendChild(effectsSection(target));
      } else chosen.append(target.tagName === "IMG" ? imageFill(target) : isVector(target) ? vectorFill(target) : boxFill(target), strokeSection(target), effectsSection(target));
      changed(true);
    };

    // Undo / redo: elements back to the step's styles, words and images (or the page's own), then the page
    // fill, the guides, the groups, and the panel for whatever is selected.
    applyEdits = (next) => {
      const sels = new Set(Object.keys(edits.elements).concat(Object.keys(next.elements)));
      sels.forEach((sel) => {
        let t = null;
        try {
          t = document.querySelector(sel);
        } catch (e) {
          return;
        }
        if (!t) return;
        const a = edits.elements[sel] || { styles: {} };
        const b = next.elements[sel] || { styles: {} };
        const o = originals[sel] || { styles: {} };
        new Set(Object.keys(a.styles).concat(Object.keys(b.styles))).forEach((prop) => {
          const v = prop in b.styles ? b.styles[prop] : o.styles[prop] || "";
          if (v) t.style.setProperty(prop, v);
          else t.style.removeProperty(prop);
        });
        if (a.html !== b.html) {
          const h = b.html != null ? b.html : o.html;
          if (h != null) t.innerHTML = h;
        }
        if (JSON.stringify(a.src) !== JSON.stringify(b.src)) {
          if (b.src) {
            t.removeAttribute("srcset");
            t.src = b.src.data;
          } else if ("src" in o) {
            if (o.srcset != null) t.setAttribute("srcset", o.srcset);
            if (o.src != null) t.setAttribute("src", o.src);
          }
        }
        if (JSON.stringify(a.adjust) !== JSON.stringify(b.adjust)) setToneFilter(toneId(sel), b.adjust || NO_ADJUST);
      });
      edits.elements = next.elements;
      edits.groups = next.groups;

      layers.forEach((l) => picker.closeFor(l));
      edits.page = next.page;
      if (next.page) {
        layers.splice(0, layers.length, ...next.page.map((l) => Object.assign({}, l)));
        paint();
      } else {
        layers.splice(0, layers.length, Object.assign({}, pageOwn.layer));
        pageEl.style.backgroundColor = pageOwn.color;
        pageEl.style.backgroundImage = pageOwn.image;
      }
      drawRows();

      guidePop.close();
      edits.guides.splice(0, edits.guides.length, ...next.guides);
      drawGuides();
      if (selection) selection.reshow();
    };

    // Chosen first: it's empty while the page's sections show, and they hide while it's full, so either way
    // the last shown section is a last child (see the double-line rule in PANEL LOOK).
    designPane.append(chosen, page, guideSec);
    root.append(top, designPane, modes);
    themeModes();
    // After the panel, so the overlay hides with it (.ft-inspector[hidden] ~ .ft-guides).
    document.body.append(root, overlay);
    return root;
  }

  function finetune(opts) {
    opts = opts || {};
    const id = String(opts.id || "finetune");
    const hotkey = String(opts.key || "t").toLowerCase();
    const target = opts.target || ":root";
    const presets = opts.presets || {};
    const onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    const storeKey = "finetune:" + id;

    if (live[id]) live[id]();

    const ctl = {};
    Object.keys(opts.controls || {}).forEach((k) => {
      const n = normalize(k, opts.controls[k]);
      if (n) ctl[k] = n;
    });
    const keys = Object.keys(ctl);

    const values = {};
    keys.forEach((k) => { values[k] = ctl[k].value; });
    const stored = load();
    keys.forEach((k) => {
      if (!own(stored, k) || !fits(ctl[k], stored[k])) return;
      values[k] = ctl[k].type === "select"
        ? ctl[k].options.find((o) => same(o.value, stored[k])).value
        : stored[k];
    });

    function load() {
      try {
        const raw = JSON.parse(localStorage.getItem(storeKey));
        return raw && typeof raw === "object" ? raw : {};
      } catch (e) {
        return {};
      }
    }

    function save() {
      try {
        localStorage.setItem(storeKey, JSON.stringify(values));
      } catch (e) {
        // Storage blocked: tuning still works, it just isn't remembered.
      }
    }

    function apply() {
      const els = document.querySelectorAll(target);
      keys.forEach((k) => {
        if (!isCss(k)) return;
        const v = cssValue(ctl[k], values[k]);
        els.forEach((e) => e.style.setProperty(k, v));
      });
      if (onChange) onChange(Object.assign({}, values));
    }

    function css() {
      const lines = keys.filter(isCss).map((k) => "  " + k + ": " + cssValue(ctl[k], values[k]) + ";");
      return target + " {\n" + lines.join("\n") + "\n}";
    }

    const sync = {}; // key -> redraws that control from values[key]

    function set(k, v) {
      values[k] = v;
      sync[k]();
      apply();
      save();
    }

    function refresh() {
      keys.forEach((k) => sync[k]());
      apply();
      save();
    }

    function row(k) {
      const c = ctl[k];
      const r = el("div", "ft-row");
      r.appendChild(el("div", "ft-label", c.label));

      if (c.type === "range") {
        const line = el("div", "ft-line");
        const slider = el("input");
        slider.type = "range";
        slider.min = c.min;
        slider.max = c.max;
        slider.step = c.step;
        // No min or max on the number: typing past the slider's ends is allowed.
        const num = el("input", "ft-num");
        num.type = "number";
        num.step = c.step;
        const dp = decimals(c.step);
        // Slider steps can land on float noise (0.30000000000000004); round to the step's precision.
        slider.addEventListener("input", () => set(k, Number(parseFloat(slider.value).toFixed(dp))));
        num.addEventListener("input", () => {
          const v = parseFloat(num.value);
          if (isNum(v)) set(k, v);
        });
        num.addEventListener("blur", () => sync[k]());
        sync[k] = () => {
          slider.value = values[k];
          if (document.activeElement !== num) num.value = values[k];
        };
        line.append(slider, num);
        r.appendChild(line);
      } else if (c.type === "select") {
        const grid = el("div", "ft-grid");
        grid.style.gridTemplateColumns = "repeat(" + c.cols + ", minmax(0, 1fr))";
        const btns = c.options.map((o) => grid.appendChild(button("ft-btn", o.label, () => set(k, o.value))));
        sync[k] = () => btns.forEach((b, i) => b.setAttribute("aria-pressed", String(same(c.options[i].value, values[k]))));
        r.appendChild(grid);
      } else if (c.type === "toggle") {
        const line = el("label", "ft-line");
        const box = el("input");
        box.type = "checkbox";
        const state = el("span");
        box.addEventListener("change", () => set(k, box.checked));
        sync[k] = () => {
          box.checked = !!values[k];
          state.textContent = String(values[k] ? c.on : c.off);
        };
        line.append(box, state);
        r.appendChild(line);
      } else if (c.type === "color") {
        const chips = el("div", "ft-chips");
        const dots = c.chips.map((hex) => {
          const b = chips.appendChild(button("ft-chip", null, () => set(k, hex)));
          b.style.background = hex;
          b.title = hex;
          b.setAttribute("aria-label", hex);
          return b;
        });
        const field = el("input", "ft-field");
        field.type = "text";
        field.spellcheck = false;
        field.addEventListener("input", () => {
          let v = field.value.trim();
          if (v && v[0] !== "#") v = "#" + v;
          if (HEX.test(v)) set(k, v);
        });
        field.addEventListener("blur", () => sync[k]());
        sync[k] = () => {
          const now = String(values[k]).toLowerCase();
          dots.forEach((b, i) => b.setAttribute("aria-pressed", String(c.chips[i].toLowerCase() === now)));
          if (document.activeElement !== field) field.value = values[k];
        };
        if (dots.length) r.appendChild(chips);
        r.appendChild(field);
      } else {
        const field = el("input", "ft-field");
        field.type = "text";
        field.addEventListener("input", () => set(k, field.value));
        sync[k] = () => {
          if (document.activeElement !== field) field.value = values[k];
        };
        r.appendChild(field);
      }
      return r;
    }

    const panel = el("div", "ft-panel");
    panel.hidden = true;
    panel.setAttribute("data-finetune", id);
    const head = el("div", "ft-head", id);
    const body = el("div", "ft-body");
    keys.forEach((k) => body.appendChild(row(k)));
    panel.append(head, body);

    const names = Object.keys(presets);
    if (names.length) {
      const bar = el("div", "ft-presets");
      names.forEach((name) => bar.appendChild(button("ft-btn", name, () => {
        const p = presets[name] || {};
        Object.keys(p).forEach((k) => { if (own(ctl, k)) values[k] = p[k]; });
        refresh();
      })));
      panel.appendChild(bar);
    }

    const out = el("textarea", "ft-out");
    out.hidden = true;
    out.readOnly = true;

    function copy(btn, label, text) {
      out.hidden = true;
      const copied = () => {
        btn.textContent = "Copied";
        setTimeout(() => { btn.textContent = label; }, 1200);
      };
      // Clipboard blocked (permissions, some file:// setups): show the text to copy by hand.
      const byHand = () => {
        out.value = text;
        out.hidden = false;
        out.focus();
        out.select();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(copied, byHand);
      } else {
        byHand();
      }
    }

    const foot = el("div", "ft-foot");
    const copyJson = button("ft-btn", "Copy JSON", () => copy(copyJson, "Copy JSON", JSON.stringify(values, null, 2)));
    const copyCss = button("ft-btn", "Copy CSS", () => copy(copyCss, "Copy CSS", css()));
    const reset = button("ft-btn", "Reset", () => {
      keys.forEach((k) => { values[k] = ctl[k].value; });
      refresh();
    });
    foot.append(copyJson, copyCss, reset);
    panel.append(foot, out);

    // Dragged by the header only, so every control below it stays clickable.
    head.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const box = panel.getBoundingClientRect();
      const dx = e.clientX - box.left;
      const dy = e.clientY - box.top;
      const move = (ev) => {
        const x = Math.min(Math.max(0, ev.clientX - dx), Math.max(0, window.innerWidth - box.width));
        const y = Math.min(Math.max(0, ev.clientY - dy), Math.max(0, window.innerHeight - head.offsetHeight));
        panel.style.left = x + "px";
        panel.style.top = y + "px";
        panel.style.right = "auto";
      };
      const end = () => {
        head.removeEventListener("pointermove", move);
        head.removeEventListener("pointerup", end);
        head.removeEventListener("pointercancel", end);
      };
      head.setPointerCapture(e.pointerId);
      head.addEventListener("pointermove", move);
      head.addEventListener("pointerup", end);
      head.addEventListener("pointercancel", end);
    });

    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || typing(e.target)) return;
      if (String(e.key).toLowerCase() !== hotkey) return;
      toggleUi();
      // The controls panel (when this call has controls) shows with the toolbar; minimized, it hides with
      // the inspector (CSS).
      if (keys.length) panel.hidden = toolbar.hidden;
    }
    window.addEventListener("keydown", onKey);

    keys.forEach((k) => sync[k]());

    function mount() {
      if (!document.getElementById(STYLE_ID)) {
        const style = el("style");
        style.id = STYLE_ID;
        style.textContent = PANEL_LOOK;
        document.head.appendChild(style);
      }
      const first = !inspector;
      if (first) {
        inspector = makeInspector();
        toolbar = makeToolbar(hotkey);
        selection = makeSelection();
        // open: false starts it hidden, for a page where something else (a button, the hotkey) opens it.
        if (opts.open === false) showPanel(false);
      }
      // The controls panel: on the page when the call has controls (the inspector alone otherwise), shown and
      // hidden with the inspector (the hotkey, open: false).
      if (keys.length) {
        document.body.appendChild(panel);
        panel.hidden = inspector.hidden;
      }
      apply();
      // After apply, so the page's own onChange doesn't write over a saved edit.
      if (first) {
        restoreEdits();
        startHistory();
      }
    }
    // Called from <head>, the body isn't there yet; wait for it.
    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount, { once: true });

    live[id] = () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("DOMContentLoaded", mount);
      panel.remove();
      delete live[id];
    };
  }

  // Shows or hides the inspector and toolbar together; no argument flips them.
  function showPanel(show) {
    if (!inspector) return;
    inspector.hidden = show === undefined ? !inspector.hidden : !show;
    toolbar.hidden = inspector.hidden;
    minimized = false;
    selection.sync();
    hideTip();
    drawUiButton();
  }

  // finetune.toggle() for a page's own button; finetune.toggle(false) hides it, say when the page goes away.
  finetune.toggle = showPanel;
  // finetune.reset() for a page's own Reset button: the same as the panel's.
  finetune.reset = resetEdits;
  window.finetune = finetune;
})();
