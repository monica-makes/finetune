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
  width: 242px; max-height: calc(100vh - 24px); overflow: hidden auto; overscroll-behavior: none;
  background: var(--ft-i-bg); border: 1px solid var(--ft-i-border); border-radius: 8px;
  color: var(--ft-i-text);
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  cursor: default; user-select: none;
}
.ft-inspector[hidden] { display: none; }
/* The panel's scrollbar floats over its content, as Figma's does, so the content keeps its 240 when it scrolls: the
   browser's own is hidden and finetune draws the thumb (drawThumb). The thumb is a 4px pill, 2px in from the panel's
   right edge and 4px from its top and bottom: an 8px element with a clear 2px border all round (an 8px target to
   drag, its ends rounding evenly), on a track 2px in at each end. It rides a zero-height sticky rail at the top. */
.ft-inspector { scrollbar-width: none; }
.ft-inspector::-webkit-scrollbar { display: none; }
.ft-scroll-rail { position: sticky; top: 0; z-index: 2; height: 0; pointer-events: none; }
.ft-scroll-thumb {
  position: absolute; top: 0; right: 0; width: 8px; border: 2px solid transparent; border-radius: 4px;
  background: rgba(0, 0, 0, 0.2); background-clip: padding-box; pointer-events: auto; touch-action: none;
}
.ft-scroll-thumb[hidden] { display: none; }
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
   a cell inside one sits 4px in, so its corners are 4px (the Design / Motion bar's sit 6px in, her call).
   Design and Motion, at the bottom of the window like Figma's toolbar: one bar of cells, each with its icon
   and its name; the chosen one is filled with the accent, its icon and name white, as Figma's selected tool
   (blue, pink in Motion). It takes the page's theme: light on a light page, Figma's dark on a dark
   one (data-theme, set from the page's background). */
.ft-modes {
  --ft-m-bg: #FFFFFF; --ft-m-text: rgba(0, 0, 0, 0.7);
  --ft-m-hover: rgba(0, 0, 0, 0.04); --ft-m-sel: #0D99FF;
  position: fixed; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; gap: 4px; padding: 6px;
  border-radius: 8px; background: var(--ft-m-bg);
  box-shadow: 0 0 0.5px rgba(0, 0, 0, 0.18), 0 3px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.ft-modes[data-theme="dark"] {
  --ft-m-bg: #2C2C2C; --ft-m-text: rgba(255, 255, 255, 0.8);
  --ft-m-hover: rgba(255, 255, 255, 0.06); --ft-m-sel: #0C8CE9;
}
.ft-modes-btn {
  display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px 0 6px; border-radius: 4px;
  color: var(--ft-m-text);
}
.ft-modes-btn svg { display: block; width: 20px; height: 20px; }
.ft-modes-btn:hover { background: var(--ft-m-hover); }
.ft-modes-btn[aria-selected="true"] { background: var(--ft-m-sel); color: #FFFFFF; }
.ft-icon-btn:disabled { opacity: 0.4; pointer-events: none; }
/* The toast sits above the Design / Motion bar, spaced as Figma's (40 tall, 16 in, 12 between the words and its
   buttons) in finetune's colors. One with an action (Reset's Undo) takes clicks, has Figma's close button after it,
   and fades out. */
.ft-toast {
  position: fixed; left: 50%; bottom: 64px; z-index: 2147483647; transform: translateX(-50%);
  display: flex; align-items: center; gap: 12px; min-height: 40px; box-sizing: border-box;
  padding: 0 16px; border-radius: 8px; background: #1E1E1E; color: #FFFFFF; pointer-events: none;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  transition: opacity 0.4s;
}
.ft-toast[hidden] { display: none; }
.ft-toast.has-action { padding: 0 8px 0 16px; pointer-events: auto; }
.ft-toast-actions { display: flex; align-items: center; gap: 8px; }
.ft-toast.is-fading { opacity: 0; }
.ft-toast-btn {
  height: 24px; margin: 0; padding: 0 8px; border: 0; border-radius: 5px; background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF; font: inherit; letter-spacing: inherit; cursor: default;
}
.ft-toast-btn:hover { background: rgba(255, 255, 255, 0.2); }
.ft-toast-close {
  display: grid; place-items: center; width: 24px; height: 24px; margin: 0; padding: 0; border: 0; border-radius: 5px;
  background: none; color: rgba(255, 255, 255, 0.7); cursor: default;
}
.ft-toast-close:hover { background: rgba(255, 255, 255, 0.12); color: #FFFFFF; }
.ft-toast-close svg { display: block; width: 16px; height: 16px; }
.ft-pane[hidden] { display: none; }
/* The last divider would sit on the panel's own border and read as a double line. */
.ft-pane > .ft-section:last-child, .ft-chosen > .ft-section:last-child, .ft-chosen > .ft-kind:last-child { border-bottom: 0; }
/* The same when the sections after it are hidden (Motion's Not started yet, with nothing waiting). */
.ft-pane > .ft-section:not([hidden]):not(:has(~ :not([hidden]):not(:empty))) { border-bottom: 0; }
.ft-section { padding: 0 8px 16px 16px; border-bottom: 1px solid var(--ft-i-line); }
/* Figma's rows start 4 under a section's 40px title. A labeled first row does it with its label (below). */
.ft-section > .ft-section-head + :not(.ft-type), .ft-section > .ft-section-head + .ft-type > :first-child:not(.ft-labeled) { margin-top: 4px; }
.ft-section-head { display: flex; align-items: center; justify-content: space-between; height: 40px; font-weight: 550; }
.ft-fills { display: flex; flex-direction: column; gap: 8px; }
.ft-icon-btn { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 5px; }
.ft-icon-btn:hover { background: var(--ft-i-hover); }
.ft-icon-btn svg { display: block; width: 16px; height: 16px; }
.ft-fill-row { display: flex; align-items: center; gap: 8px; }
.ft-fill-actions { display: flex; flex: none; gap: 4px; }
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
/* Figma's header: 48 tall, its name 13px on a 22px line. */
.ft-kind { display: flex; align-items: baseline; gap: 8px; min-width: 0; padding: 13px 8px 13px 16px; border-bottom: 1px solid var(--ft-i-line); }
.ft-kind-name { flex: none; font-weight: 550; font-size: 13px; line-height: 22px; }
.ft-kind-el { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ft-i-text-2); }
.ft-kind-count { margin-left: auto; color: var(--ft-i-text-2); }
/* A component's line: its name, what an edit reaches, then Override across the width (pressed while it's on). */
.ft-kind-comp { flex-direction: column; align-items: stretch; gap: 4px; }
.ft-kind-comp .ft-kind-el { white-space: normal; }
.ft-choice.ft-override { margin-top: 8px; }
.ft-choice.ft-override[aria-pressed="true"], .ft-choice.ft-override[aria-pressed="true"]:hover { background: rgba(151, 71, 255, 0.12); color: #9747FF; box-shadow: none; }
/* A section with nothing under its head (Fill, Stroke or Effects before the +) is just the head, as in Figma. */
.ft-section:has(> .ft-section-head + :is(.ft-fills, .ft-stroke):empty:last-child) { padding-bottom: 0; }
.ft-section > :is(.ft-fills, .ft-stroke):empty { display: none; }

/* Inside the panel, overlays stack in a set order over its rows (a faded row, at 40% opacity, is a layer
   of its own and would otherwise paint over them): popovers, then the color picker opened from one, then menus. */
.ft-pop {
  position: fixed; z-index: 2; width: 240px; background: #FFFFFF; border-radius: 12px;
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
  position: relative; height: 208px; border-radius: 4px; touch-action: none;
  background: linear-gradient(to top, #000000, transparent), linear-gradient(to right, #FFFFFF, var(--ft-hue));
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.ft-pop-tools { display: flex; align-items: center; gap: 12px; }
/* Figma's picker (measured): 16px tracks 12 apart, 12 between the square, the sliders and the hex row. */
.ft-sliders { display: flex; flex-direction: column; gap: 12px; flex: 1; min-width: 0; }
.ft-pop.ft-picker-pop .ft-pop-body { gap: 12px; }
.ft-track { position: relative; height: 16px; border-radius: 8px; touch-action: none; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06); }
.ft-hue { background: linear-gradient(90deg, #F00 0%, #FF0 16.67%, #0F0 33.33%, #0FF 50%, #00F 66.67%, #F0F 83.33%, #F00 100%); }
.ft-alpha-track {
  background:
    linear-gradient(90deg, transparent, var(--ft-c)),
    repeating-conic-gradient(#D9D9D9 0 25%, #FFFFFF 0 50%) 0 0 / 8px 8px;
}
.ft-knob {
  position: absolute; top: 50%; left: calc(8px + var(--ft-x, 0) * (100% - 16px));
  width: 16px; height: 16px; border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%); background: var(--ft-k);
  box-shadow: inset 0 0 0 4px #FFFFFF, 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
}
.ft-sv-knob {
  top: calc(var(--ft-y, 0) * 100%); left: calc(var(--ft-x, 0) * 100%);
  width: 16px; height: 16px;
  box-shadow: inset 0 0 0 4px #FFFFFF, 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
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
  background: #1E1E1E; color: #FFFFFF; border-radius: 12px;
  box-shadow: 0 0 0.5px rgba(0, 0, 0, 0.15), 0 5px 12px rgba(0, 0, 0, 0.13), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.ft-menu[hidden] { display: none; }
.ft-menu-item {
  display: flex; align-items: center; gap: 4px; width: 100%; height: 24px;
  padding: 0 8px 0 4px; border-radius: 5px; text-align: left; white-space: nowrap;
}
.ft-menu-item:hover { background: #0D99FF; }
.ft-menu-check { display: grid; place-items: center; width: 16px; height: 16px; }
.ft-menu-check svg { display: block; width: 12px; height: 12px; }
.ft-menu-heading { padding: 6px 8px 4px 24px; font-size: 11px; color: rgba(255, 255, 255, 0.5); white-space: nowrap; }
.ft-menu-heading:not(:first-child) { margin-top: 4px; }
/* A line between a menu's parts, as Figma's: Motion's coded animations above, its generic ones below. */
.ft-menu-divider { height: 1px; margin: 7px -8px; background: rgba(255, 255, 255, 0.12); }
.ft-menu-trash { display: grid; place-items: center; flex: none; width: 20px; height: 20px; margin: 0 -4px 0 auto; padding-left: 8px; opacity: 0; }
.ft-menu-item:hover .ft-menu-trash { opacity: 1; }
.ft-menu-trash svg { display: block; width: 12px; height: 12px; }
/* Layout guide styles (Figma's): a heading per part and a row per style, Delete on a row's hover. */
.ft-styles-list { max-height: min(360px, calc(100vh - 80px)); overflow-y: auto; overscroll-behavior: none; padding: 8px 0; }
.ft-styles-heading { display: flex; align-items: center; height: 32px; padding: 0 16px; font-weight: 550; }
.ft-style-row { display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 8px 0 16px; cursor: default; }
.ft-style-row:hover { background: var(--ft-i-hover); }
.ft-style-row > svg { display: block; flex: none; width: 16px; height: 16px; }
.ft-style-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-style-trash { opacity: 0; }
.ft-style-row:hover .ft-style-trash, .ft-style-trash:focus-visible { opacity: 1; }
.ft-styles-empty { padding: 8px 16px; color: var(--ft-i-text-2); }
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
.ft-tip[data-side="top"]::before {
  top: auto; bottom: -4px; border-width: 4px 4px 0; border-color: #1E1E1E transparent transparent;
}
.ft-tip[data-side="right"]::before {
  top: calc(50% - 4px); left: -5px;
  border-width: 4px 5px 4px 0; border-color: transparent #1E1E1E transparent transparent;
}

.ft-toolbar {
  position: fixed; top: 12px; left: 12px; z-index: 2147483646;
  display: flex; flex-direction: column; gap: 4px; padding: 8px;
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
/* Figma's rhythm (its own panel, measured): a label is 9px on a 14px line; two fields with a label between them sit
   24 apart (6 above the label, 14 for it, 4 below); a labeled first row's field sits 60 under the section's top. */
.ft-labeled > .ft-field-label { margin-top: 2px; }
.ft-type > .ft-labeled { margin-top: -4px; }
.ft-type:has(> .ft-labeled:first-child) { padding-top: 4px; }
/* After a row without a label, Figma's labeled row sits 2 lower (26 between the fields). Cells in a row line up on
   their fields. */
.ft-type { align-items: end; }
.ft-type > :not(.ft-labeled):not(:empty) + .ft-labeled { margin-top: -2px; }
.ft-stroke > .ft-type { margin-top: -2px; }
/* Figma's property labels are smaller than its values: Inter at 9.5px, measured off a Figma screenshot. */
.ft-field-label { color: var(--ft-i-text-2); font-size: 9px; line-height: 14px; font-weight: 500; }
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
/* A toggle that's on, or a button whose menu or popover is open, stays highlighted until it's off, as in Figma
   (her call, 2026-10-14): blue in Design, pink in Motion. */
.ft-icon-btn[aria-pressed="true"], .ft-icon-btn.is-open { background: rgba(13, 153, 255, 0.12); color: #0D99FF; }
html.ft-motion .ft-icon-btn[aria-pressed="true"], html.ft-motion .ft-icon-btn.is-open { background: rgba(255, 36, 189, 0.12); color: #FF24BD; }
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
/* Figma's: a white knob with the fill's color in its middle, and a small white dot marking zero. */
.ft-adj-knob {
  position: absolute; z-index: 1; top: 50%; left: calc(8px + var(--ft-x, 0.5) * (100% - 16px));
  width: 16px; height: 16px; border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%); background: radial-gradient(circle, var(--ft-i-focus) 0 3px, #FFFFFF 3.5px);
  box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
}
.ft-adj-track::after {
  content: ""; position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; margin: -2px 0 0 -2px;
  border-radius: 50%; background: #FFFFFF; pointer-events: none;
}
/* Figma's inline slider (Opacity, Corner radius, Corner smoothing): after the number, in the same field, a thin
   track filled from the left to a white knob. */
.ft-slider-field .ft-num-input { flex: none; width: 44px; }
.ft-slide-box {
  display: flex; align-items: center; flex: 1; min-width: 0; height: 24px; padding: 0 10px;
  border-left: 1px solid var(--ft-i-bg); touch-action: none;
}
.ft-num-field:hover .ft-slide-box { border-left-color: var(--ft-i-stroke); }
.ft-slide { position: relative; flex: 1; height: 4px; border-radius: 2px; background: rgba(0, 0, 0, 0.1); }
.ft-slide-fill { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--ft-x, 0) * 100%); border-radius: 2px; background: var(--ft-i-focus); }
.ft-slide-knob {
  position: absolute; z-index: 1; top: 50%; left: calc(var(--ft-x, 0) * 100%); width: 12px; height: 12px; border-radius: 50%;
  transform: translate(-50%, -50%); background: #FFFFFF; box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.25);
}
.ft-with-action > .ft-num-field { flex: 1; min-width: 0; }
/* Independent corners: two rows of two, under Corner radius, in its columns (Figma's). */
.ft-corners { display: flex; flex-direction: column; gap: 8px; }
.ft-corners[hidden] { display: none; }
.ft-action-gap { flex: none; width: 24px; }
/* Corner smoothing: Figma's popover, its slider marked at iOS's 60%. */
.ft-smooth-row { display: flex; align-items: center; gap: 8px; }
.ft-smooth-row > .ft-slide-box { height: 36px; padding: 0 8px; border-left: 0; }
.ft-smooth-row > .ft-num-field { flex: none; width: 44px; }
/* Its slider, as Figma's: a 16px pill in the field color with a hairline, a 16px knob, the iOS dot on it. */
.ft-smooth-row .ft-slide { height: 16px; border-radius: 8px; background: var(--ft-i-field); box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-smooth-row .ft-slide-fill { width: calc(8px + var(--ft-x, 0) * (100% - 16px)); border-radius: 8px; opacity: clamp(0, calc(var(--ft-x, 0) * 1000), 1); }
.ft-smooth-row .ft-slide-knob { left: calc(8px + var(--ft-x, 0) * (100% - 16px)); width: 16px; height: 16px; }
.ft-smooth-row .ft-slide-mark, .ft-smooth-row .ft-slide-note { left: calc(8px + 0.6 * (100% - 16px)); }
.ft-smooth-row .ft-slide-note { top: 20px; }
.ft-slide-mark { position: absolute; top: 50%; left: 60%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: rgba(0, 0, 0, 0.3); }
.ft-slide-note { position: absolute; top: 8px; left: 60%; transform: translateX(-50%); color: var(--ft-i-text-2); font-size: 9.5px; line-height: 12px; }
/* Motion: the layer's keyframe animations, and, with nothing selected, the page's animated layers.
   Its accent is Motion's pink (see html.ft-motion below). */
/* Figma's curve editor: the unit square, with room above and below for the curves that overshoot. */
.ft-curve { display: block; width: 100%; height: auto; border-radius: 2px; background: var(--ft-i-field); touch-action: none; }
.ft-curve-box { fill: #FFFFFF; stroke: var(--ft-i-line); }
.ft-curve-arm { stroke: rgba(0, 0, 0, 0.3); }
.ft-curve-line { fill: none; stroke: #FF24BD; stroke-width: 1.5; }
.ft-curve-knob { fill: #FFFFFF; stroke: #FF24BD; }
/* Figma's Interactions list: one row per animation, its name and duration; the open one is picked. */
.ft-anim-rows { display: flex; flex-direction: column; gap: 2px; }
.ft-anim-row { display: flex; align-items: center; gap: 8px; width: 100%; height: 32px; padding: 0 8px; border-radius: 5px; text-align: left; }
.ft-anim-row:hover { background: var(--ft-i-hover); }
.ft-anim-row[aria-pressed="true"] { background: rgba(255, 36, 189, 0.12); }
.ft-anim-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-anim-row > .ft-icon-btn { margin-right: -4px; }
.ft-anim-meta { flex: none; max-width: 50%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ft-i-text-2); }
/* An animation's settings open in the panel under its row, laid out as Figma's Interaction popover: a label
   column, then the control, in groups split by a line that runs the panel's width, as its sections' do. */
.ft-anim-settings { margin: 8px -8px 0 -16px; border-top: 1px solid var(--ft-i-line); }
.ft-anim-settings:last-child { margin-bottom: -16px; }
.ft-anim-settings:not(:last-child) { margin-bottom: 8px; border-bottom: 1px solid var(--ft-i-line); }
/* Each group of settings, as Figma's untitled stacks: its first row 12 under the line, 16 under its last row. */
.ft-anim-group { display: grid; grid-template-columns: 72px minmax(0, 1fr); align-items: center; gap: 8px 0; padding: 12px 8px 16px 16px; border-bottom: 1px solid var(--ft-i-line); }
.ft-anim-group:last-child { border-bottom: 0; }
.ft-anim-group > .ft-span2 { grid-column: 1 / -1; }
.ft-anim-group > [hidden] { display: none; }
.ft-anim-label { color: var(--ft-i-text-2); }
/* Playback speed, at the top of Motion: Alignment's segmented cells, spread across the row, with words. */
/* Playback speed is a section like the rest: its name in the 40px title band, the speeds 4 under it. */
.ft-speed { padding-top: 0; }
/* Its label reads as a section's title: 11px, 550, the panel's text. */
.ft-speed-label { display: flex; align-items: center; height: 40px; font-weight: 550; }
.ft-speed .ft-seg-btn { font-size: 11px; }
/* A dropdown's leading icon: an easing's own curve. */
.ft-dd-icon { display: grid; place-items: center; flex: none; width: 16px; height: 16px; margin-left: -4px; color: var(--ft-i-text-2); }
.ft-dd-icon svg { display: block; width: 12px; height: 12px; }
.ft-dd-icon + .ft-dd-label { flex: 1; }
/* Figma's checkbox row (Clip content): the box, then its label. Checked, the box takes the text's color. */
.ft-check-row { display: flex; align-items: center; gap: 8px; height: 24px; text-align: left; }
.ft-check { display: grid; place-items: center; width: 16px; height: 16px; border-radius: 3px; box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-check-row:hover .ft-check { background: var(--ft-i-hover); }
.ft-check-row[aria-checked="true"] .ft-check { box-shadow: inset 0 0 0 1px var(--ft-i-text); }
.ft-check svg { display: block; width: 12px; height: 12px; }
/* Motion's accent: pink where Design uses its blue (the selection, focus, the bar's chosen cell, and Motion's
   own rows and curve above), so it's clear which mode is on. html.ft-motion is set while Motion shows. */
html.ft-motion .ft-inspector { --ft-i-focus: #FF24BD; }
html.ft-motion .ft-modes { --ft-m-sel: #FF24BD; }
html.ft-motion .ft-modes[data-theme="dark"] { --ft-m-sel: #E61BA8; }
html.ft-motion .ft-hover-box, html.ft-motion .ft-sel-box, html.ft-motion .ft-handle { border-color: #FF24BD; }
html.ft-motion .ft-menu-item:hover { background: #FF24BD; }
/* A layer with no animation: one full-width button to add one (Figma's secondary button). */
.ft-choice.ft-add-anim { width: 100%; }

.ft-hover-box, .ft-sel-box {
  position: fixed; z-index: 2147483645; box-sizing: border-box; pointer-events: none;
  border: 1px solid #0D99FF;
}
.ft-hover-box[hidden], .ft-sel-box[hidden] { display: none; }
/* Figma's marquee: drag on the page to select what the box touches. */
.ft-marquee { position: fixed; z-index: 2147483645; box-sizing: border-box; pointer-events: none; border: 1px solid #0D99FF; background: rgba(13, 153, 255, 0.08); }
.ft-marquee[hidden] { display: none; }
/* In Motion, every layer with motion on screen is outlined in pink, so what can be tuned is plain to see. */
.ft-marks { position: fixed; inset: 0; z-index: 2147483644; pointer-events: none; }
.ft-marks[hidden] { display: none; }
.ft-mark { position: absolute; box-sizing: border-box; border: 1px solid rgba(255, 36, 189, 0.5); }
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
/* Figma's spacing: 8 below the selection, 6 either side of the numbers. */
.ft-size-label {
  position: absolute; left: 50%; top: calc(100% + 8px); transform: translateX(-50%);
  padding: 0 6px; border-radius: 3px; background: #0D99FF; color: #FFFFFF; white-space: nowrap;
  font: 500 11px/16px "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
/* A component (componentOf), as Figma shows one: its outline, corners and size label in Figma's component purple,
   and its name with the component mark over its top left. Design only; Motion keeps its own accent. */
.ft-sel-box.is-comp, .ft-hover-box.is-comp, .ft-sel-box.is-comp .ft-handle { border-color: #9747FF; }
.ft-sel-box.is-comp .ft-size-label { background: #9747FF; }
.ft-comp-label {
  position: absolute; left: -1px; bottom: calc(100% + 4px); display: flex; align-items: center; gap: 4px;
  color: #9747FF; white-space: nowrap; font: 500 11px/16px "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-comp-label[hidden] { display: none; }
.ft-comp-label svg { display: block; width: 12px; height: 12px; }
html.ft-moving body *:not(input) { cursor: default; }
html.ft-moving [data-ft-editing], html.ft-moving [data-ft-editing] * { cursor: text; }
[data-ft-editing] { outline: none; }
/* A layer being read or dragged runs no transitions, so an edit lands at once (see still()). */
[data-ft-still], [data-ft-still] * { transition: none !important; }

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
  // Flow's four (flowFree, flowVertical, flowHorizontal, flowGrid) are drawn after Figma's: small rounded squares
  // scattered, stacked with a down arrow, side by side over a right arrow, and two by two. They're drawn at 16, the
  // size they show at, with a 1px line on half pixels, so every edge lands on a whole pixel; the squares are 5 across
  // with 2 between.
  // Lucide names a flip by its axis, so Flip horizontal is flip-vertical-2 and the other way round. Rotate 90°
  // is Lucide's rotate-cw-square too, the nearest to Figma's turned square.
  const ICON = {
    angle: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M96,72a8,8,0,0,1,8-8A104.11,104.11,0,0,1,208,168a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88A8,8,0,0,1,96,72ZM240,192H80V32a8,8,0,0,0-16,0V64H32a8,8,0,0,0,0,16H64V200a8,8,0,0,0,8,8H240a8,8,0,0,0,0-16Z"/></svg>',
    arrowClockwise: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
    refresh: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
    drop: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"/></svg>',
    checkerboard: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-12.69,88L136,60.69V48h12.69L208,107.32V120ZM136,83.31,172.69,120H136Zm72,1.38L171.31,48H208ZM120,48v72H48V48ZM107.31,208,48,148.69V136H60.69L120,195.31V208ZM120,172.69,83.31,136H120Zm-72-1.38L84.69,208H48ZM208,208H136V136h72v72Z"/></svg>',
    frameCorners: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,80v32a8,8,0,0,1-16,0V88H160a8,8,0,0,1,0-16h32A8,8,0,0,1,200,80ZM96,168H72V144a8,8,0,0,0-16,0v32a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16ZM232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z"/></svg>',
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
    pause: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,32H160a16,16,0,0,0-16,16V208a16,16,0,0,0,16,16h40a16,16,0,0,0,16-16V48A16,16,0,0,0,200,32Zm0,176H160V48h40ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Zm0,176H56V48H96Z"/></svg>',
    arrowLeft: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"/></svg>',
    arrowRight: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>',
    arrowDown: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
    arrowUp: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z"/></svg>',
    ruler: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M235.32,73.37,182.63,20.69a16,16,0,0,0-22.63,0L20.68,160a16,16,0,0,0,0,22.63l52.69,52.68a16,16,0,0,0,22.63,0L235.32,96A16,16,0,0,0,235.32,73.37ZM84.68,224,32,171.31l32-32,26.34,26.35a8,8,0,0,0,11.32-11.32L75.31,128,96,107.31l26.34,26.35a8,8,0,0,0,11.32-11.32L107.31,96,128,75.31l26.34,26.35a8,8,0,0,0,11.32-11.32L139.31,64l32-32L224,84.69Z"/></svg>',
    timer: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm0,176a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,216ZM173.66,90.34a8,8,0,0,1,0,11.32l-40,40a8,8,0,0,1-11.32-11.32l40-40A8,8,0,0,1,173.66,90.34ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"/></svg>',
    hourglass: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M211.18,196.56,139.57,128l71.61-68.56a1.59,1.59,0,0,1,.13-.13A16,16,0,0,0,200,32H56A16,16,0,0,0,44.7,59.31l.12.13L116.43,128,44.82,196.56l-.12.13A16,16,0,0,0,56,224H200a16,16,0,0,0,11.32-27.31A1.59,1.59,0,0,1,211.18,196.56ZM56,48h0v0Zm144,0-72,68.92L56,48ZM56,208l72-68.92L200,208Z"/></svg>',
    repeat: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M24,128A72.08,72.08,0,0,1,96,56H204.69L194.34,45.66a8,8,0,0,1,11.32-11.32l24,24a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32-11.32L204.69,72H96a56.06,56.06,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56.06,56.06,0,0,1-56,56H51.31l10.35-10.34a8,8,0,0,0-11.32-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.32-11.32L51.31,200H160a72.08,72.08,0,0,0,72-72A8,8,0,0,0,224,120Z"/></svg>',
    replay: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"/></svg>',
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
    // A layout guide's columns, for a style's row (Figma's), drawn at 16 on whole pixels as the Flow icons.
    columns: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="1"/><path d="M6.5 2.5v11M9.5 2.5v11"/></svg>',
    // Figma's Lock aspect ratio: a rounded square with two corner brackets inside, drawn at 16 on whole pixels.
    lockRatio: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="2"/><path d="M5.5 8V5.5H8M10.5 8v2.5H8"/></svg>',
    // Figma's instance mark, one diamond: Override (this instance only).
    instance: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M8 2l6 6-6 6-6-6z"/></svg>',
    // Figma's component mark: four diamonds.
    component: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1l3 3-3 3-3-3z"/><path d="M4 5l3 3-3 3-3-3z"/><path d="M12 5l3 3-3 3-3-3z"/><path d="M8 9l3 3-3 3-3-3z"/></svg>',
    // A checkbox's tick, heavier than the menus' check, as Figma's.
    tick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
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
    flowFree: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="4" height="4" rx="1"/><rect x="9.5" y="3.5" width="4" height="4" rx="1"/><rect x="3.5" y="9.5" width="4" height="4" rx="1"/></svg>',
    flowVertical: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="4" height="4" rx="1"/><rect x="2.5" y="9.5" width="4" height="4" rx="1"/><path d="M11.5 2.5v11"/><path d="M9 11l2.5 2.5L14 11"/></svg>',
    flowHorizontal: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="4" height="4" rx="1"/><rect x="9.5" y="2.5" width="4" height="4" rx="1"/><path d="M2.5 11.5h11"/><path d="M11 9l2.5 2.5L11 14"/></svg>',
    flowGrid: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="4" height="4" rx="1"/><rect x="9.5" y="2.5" width="4" height="4" rx="1"/><rect x="2.5" y="9.5" width="4" height="4" rx="1"/><rect x="9.5" y="9.5" width="4" height="4" rx="1"/></svg>',
    cornerTL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17v-6a4 4 0 0 1 4-4h6"/></svg>',
    cornerTR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h6a4 4 0 0 1 4 4v6"/></svg>',
    cornerBL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7v6a4 4 0 0 0 4 4h6"/></svg>',
    cornerBR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 7v6a4 4 0 0 1-4 4H7"/></svg>',
    sliders: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M64,105V40a8,8,0,0,0-16,0v65a32,32,0,0,0,0,62v49a8,8,0,0,0,16,0V167a32,32,0,0,0,0-62Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,56,152Zm80-95V40a8,8,0,0,0-16,0V57a32,32,0,0,0,0,62v97a8,8,0,0,0,16,0V119a32,32,0,0,0,0-62Zm-8,47a16,16,0,1,1,16-16A16,16,0,0,1,128,104Zm104,64a32.06,32.06,0,0,0-24-31V40a8,8,0,0,0-16,0v97a32,32,0,0,0,0,62v17a8,8,0,0,0,16,0V199A32.06,32.06,0,0,0,232,168Zm-32,16a16,16,0,1,1,16-16A16,16,0,0,1,200,184Z"/></svg>',
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
    // Above the button when it sits at the bottom of the window (the Design / Motion bar), else below it.
    const above = target.getAttribute("data-ft-tip-side") === "top";
    if (above) tipEl.setAttribute("data-side", "top");
    else tipEl.removeAttribute("data-side");
    const cx = r.left + r.width / 2;
    const left = Math.min(Math.max(8, cx - tipEl.offsetWidth / 2), window.innerWidth - tipEl.offsetWidth - 8);
    tipEl.style.left = left + "px";
    tipEl.style.top = (above ? r.top - 6 - tipEl.offsetHeight : r.bottom + 6) + "px";
    // The box shifts to stay on screen; the caret keeps pointing at the button.
    tipEl.style.setProperty("--ft-caret", cx - left + "px");
  }

  // A shortcut's keys as the tooltip shows them: Mac's symbols on a Mac, words elsewhere.
  const MAC = /Mac|iPhone|iPad/.test(navigator.platform || "");
  const KEYS = { mod: MAC ? "⌘" : "Ctrl+", alt: MAC ? "⌥" : "Alt+", shift: MAC ? "⇧" : "Shift+" };

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
      eye.setAttribute("aria-pressed", String(!layer.visible));
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
      close,
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
      ["copy", "Copy changes and prompt", copyChanges, KEYS.shift + KEYS.mod + "E"],
      ["floppyDisk", "Save changes in this browser", saveNow, KEYS.alt + KEYS.mod + "S"],
    ].map(([icon, name, onClick, keys]) => {
      const b = button("ft-tool", null, onClick);
      b.innerHTML = ICON[icon];
      b.setAttribute("aria-label", name);
      b.setAttribute("data-ft-tip", name);
      if (keys) b.setAttribute("data-ft-tip-key", keys);
      b.setAttribute("data-ft-tip-side", "right");
      withTip(b);
      return b;
    });
    bar.append(...actions);
    document.body.appendChild(bar);
    uiBox = el("div", "ft-ui");
    uiButton = iconButton(ICON.sidebarSimple, "Hide UI", toggleUi);
    uiButton.setAttribute("data-ft-tip-key", KEYS.mod + "\\");
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

  // Components, as Figma's instances: an element is one when a component in the code renders it as its one
  // outermost element (a React component's single root), or when it's a custom element (a web component). Its
  // name is the one the code gives it. React's names, and where each element was written, come from its
  // development build, so a production build shows none. A run of components can start at one element (an icon
  // library's Envelope renders its own IconBase, which renders the svg): the outermost one written in the page's
  // code is it. Components written in node_modules (the framework's own, around a page) are passed over.
  const COMPONENT_TAGS = [0, 1, 11, 14, 15]; // React's function, class, forwardRef, memo and simple memo fibers
  const HOST_TAGS = [5, 26, 27]; // an element, a hoisted one, html / head / body
  const typeName = (t) => (!t ? "" : typeof t === "function" ? t.displayName || t.name || ""
    : typeof t === "object" ? t.displayName || typeName(t.render) || typeName(t.type) : "");
  const fiberOf = (e) => {
    const k = Object.keys(e).find((key) => key.slice(0, 13) === "__reactFiber$");
    return k ? e[k] : null;
  };
  // Where the code wrote this fiber's element: React 18's recorded file, or React 19's creation stack, its first
  // frame past React's own call. "" when the build doesn't say.
  function writtenAt(f) {
    if (f._debugSource && f._debugSource.fileName) return f._debugSource.fileName;
    const stack = f._debugStack && f._debugStack.stack;
    if (!stack) return "";
    return stack.split("\n").slice(1).find((l) => !/jsx|createElement|fakeJSXCallSite/.test(l)) || "";
  }
  const inPageCode = (where) => !!where && !/node_modules|<anonymous>/.test(where);
  // A component is one layer only when it renders exactly one outermost element (no fragment of several).
  function oneRoot(f) {
    let n = 0;
    const walk = (c) => {
      for (; c && n < 2; c = c.sibling) {
        if (HOST_TAGS.includes(c.tag) || (c.tag === 6 && String(c.memoizedProps).trim())) n++;
        else if (c.tag !== 4) walk(c.child);
      }
    };
    walk(f.child);
    return n === 1;
  }
  const components = new WeakMap();
  function componentOf(e) {
    if (!e || e.nodeType !== 1) return "";
    if (components.has(e)) return components.get(e);
    let name = "";
    const fiber = fiberOf(e);
    let found = false;
    for (let p = fiber && fiber.return; p && !HOST_TAGS.includes(p.tag); p = p.return) {
      if (!COMPONENT_TAGS.includes(p.tag)) continue;
      if (!inPageCode(writtenAt(p))) {
        if (found) break;
        continue;
      }
      found = true;
      const n = typeName(p.elementType) || typeName(p.type);
      if (n && oneRoot(p)) name = n;
    }
    if (!name && e.localName.includes("-") && window.customElements && customElements.get(e.localName)) name = e.localName;
    components.set(e, name);
    return name;
  }
  // A component's instances on the page, found once per selection (the selection clears this).
  const instanceCache = new Map();
  function instancesOf(name) {
    if (!instanceCache.has(name)) instanceCache.set(name, Array.from(document.querySelectorAll("*")).filter((e) => !isUi(e) && componentOf(e) === name));
    return instanceCache.get(name);
  }
  // Where an edit to a component instance goes, as in Figma: to every instance (the component's own look), unless
  // she overrode this one, or it places this one (a move, a turn, a flip), which is always this one's. Design only.
  const PLACEMENT = ["translate", "rotate", "scale", "transform-box", "transform-origin"];
  function sharedComponent(t, prop) {
    if (document.documentElement.classList.contains("ft-motion") || PLACEMENT.includes(prop)) return "";
    const name = componentOf(t);
    return name && !edits.overrides.includes(selectorFor(t)) ? name : "";
  }

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
  // Reset's Undo (see resetEdits): what it threw away, and what to load once instead of what Save stored.
  const RESET_KEY = "finetune:reset-undo:" + location.pathname;
  const RESTORE_KEY = "finetune:restore:" + location.pathname;
  let restored = false;
  let edits = loadEdits();

  // Anything stored in a shape this file no longer writes is dropped, not trusted.
  function loadEdits() {
    const out = { page: null, elements: {}, guides: [], groups: [], keyframes: {}, waapi: {}, newKeyframes: {}, components: {}, overrides: [] };
    let raw = null;
    try {
      // Reset's Undo loads what showed before it, once; otherwise what Save stored.
      let undone = null;
      try {
        undone = sessionStorage.getItem(RESTORE_KEY);
        if (undone != null) sessionStorage.removeItem(RESTORE_KEY);
      } catch (e) {
        undone = null;
      }
      restored = undone != null;
      raw = JSON.parse(undone != null ? undone : localStorage.getItem(EDITS_KEY));
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
    // The @keyframes she added from Motion's generic list: name, then the preset and its rule's body.
    if (raw.newKeyframes && typeof raw.newKeyframes === "object") {
      Object.keys(raw.newKeyframes).forEach((name) => {
        const k = raw.newKeyframes[name];
        if (k && typeof k.body === "string" && /^[\w-]+$/.test(name)) out.newKeyframes[name] = { preset: String(k.preset || ""), body: k.body };
      });
    }
    // JavaScript animation edits, each with what the code said (see waapiEdit).
    if (raw.waapi && typeof raw.waapi === "object") {
      const obj = (o) => (o && typeof o === "object" ? o : {});
      Object.keys(raw.waapi).forEach((key) => {
        const w = raw.waapi[key];
        if (!w || typeof w !== "object" || typeof w.label !== "string") return;
        out.waapi[key] = {
          label: w.label, hint: typeof w.hint === "string" ? w.hint : "", sels: Array.isArray(w.sels) ? w.sels.filter((x) => typeof x === "string") : [],
          code: obj(w.code), timing: obj(w.timing), delays: obj(w.delays), frames: obj(w.frames),
        };
      });
    }
    // Keyframe edits: name, then keyframe, then declarations, all strings.
    if (raw.keyframes && typeof raw.keyframes === "object") {
      Object.keys(raw.keyframes).forEach((name) => {
        const frames = raw.keyframes[name];
        if (!frames || typeof frames !== "object") return;
        const keep = {};
        Object.keys(frames).forEach((key) => {
          const decl = frames[key];
          if (!decl || typeof decl !== "object") return;
          const d = {};
          Object.keys(decl).forEach((p) => { if (typeof decl[p] === "string" && decl[p]) d[p] = decl[p]; });
          if (Object.keys(d).length) keep[key] = d;
        });
        if (Object.keys(keep).length) out.keyframes[name] = keep;
      });
    }
    if (Array.isArray(raw.groups)) {
      out.groups = raw.groups.filter((g) => Array.isArray(g) && g.length > 1 && g.every((sel) => typeof sel === "string"));
    }
    // Component edits (every instance's), by the component's name, and the instances she overrode, by selector.
    if (raw.components && typeof raw.components === "object") {
      Object.keys(raw.components).forEach((name) => {
        const c = raw.components[name];
        if (!c || typeof c.styles !== "object" || !c.styles) return;
        const styles = {};
        Object.keys(c.styles).forEach((p) => { if (typeof c.styles[p] === "string" && c.styles[p]) styles[p] = c.styles[p]; });
        if (Object.keys(styles).length) out.components[name] = { styles };
      });
    }
    if (Array.isArray(raw.overrides)) out.overrides = raw.overrides.filter((sel) => typeof sel === "string");
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

  // An action that can be undone says so in a toast with Undo, for 10 seconds.
  const undoToast = (text, run) => toast(text, { label: "Undo", run }, 10000);

  // Nothing is saved until she presses Save; a reload before that drops the unsaved edits. Its Undo puts back what
  // the browser had stored before (nothing, or the last save); the edits on the page stay as they are.
  function saveNow() {
    let before = null;
    try {
      before = localStorage.getItem(EDITS_KEY);
      localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
    } catch (e) {
      // Storage blocked or full (a large swapped-in image): edits still show, they just won't survive a reload.
      return toast("Couldn't save: storage is blocked or full");
    }
    const n = editCount();
    historyChanged();
    undoToast(n ? "Saved " + n + (n === 1 ? " change" : " changes") : "Saved", () => {
      try {
        if (before == null) localStorage.removeItem(EDITS_KEY);
        else localStorage.setItem(EDITS_KEY, before);
      } catch (e) {
        // Storage blocked: the save stands.
      }
      historyChanged();
      toast("Save undone");
    });
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
  // Reset keeps what it throws away (what Save stored, and what showed, saved or not) for the next load in this
  // tab, so the toast after the reload can offer Undo. Undo hands it back: what Save stored goes back in storage,
  // and what showed loads once more (RESTORE_KEY), so unsaved edits come back unsaved.
  function resetEdits() {
    window.dispatchEvent(new CustomEvent("finetune:reset"));
    try {
      // Anything to bring back: an edit (a layout grid included) or something Save stored.
      const saved = localStorage.getItem(EDITS_KEY);
      const had = saved != null || editCount() > 0 || edits.guides.length > 0;
      sessionStorage.setItem(RESET_KEY, JSON.stringify({ saved, live: snapshot(), had }));
    } catch (e) {
      // No session storage: Reset still works, just without Undo.
    }
    try {
      localStorage.removeItem(EDITS_KEY);
    } catch (e) {
      // Nothing stored to clear.
    }
    location.reload();
  }
  // Whether Reset has anything to put back: an edit on the page now, or something Save stored.
  function canReset() {
    if (editCount() > 0) return true;
    try {
      return localStorage.getItem(EDITS_KEY) != null;
    } catch (e) {
      return false;
    }
  }
  // After the load: Reset's toast, with Undo for 10 seconds; or, after Undo, that the edits are back.
  function afterReset() {
    if (restored) return toast("Your edits are back");
    let stash = null;
    try {
      stash = JSON.parse(sessionStorage.getItem(RESET_KEY));
      sessionStorage.removeItem(RESET_KEY);
    } catch (e) {
      return;
    }
    if (!stash) return;
    // With nothing changed there's nothing to undo, and the toast says so.
    if (!stash.had) return toast("No edits to reset: the page already matches the code", null, 4000);
    const undo = {
      label: "Undo",
      run() {
        try {
          if (stash.saved != null) localStorage.setItem(EDITS_KEY, stash.saved);
          sessionStorage.setItem(RESTORE_KEY, stash.live);
        } catch (e) {
          return toast("Couldn't undo: storage is blocked");
        }
        location.reload();
      },
    };
    toast("Your edits were reset to what's in the code", undo, 10000);
    undoReset = undo.run;
    historyChanged();
    setTimeout(() => {
      undoReset = null;
      historyChanged();
    }, 10400);
  }

  const editCount = () => Object.keys(edits.elements).length + (edits.page ? 1 : 0) + edits.groups.length + Object.keys(edits.keyframes).length + Object.keys(edits.waapi).length + Object.keys(edits.components).length;

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
  // Right after a Reset (while its toast shows), Undo, ⌘Z included, undoes the Reset: there's nothing before it in
  // this visit's history.
  let undoReset = null;
  const undo = () => (undoReset && !history.past.length ? undoReset() : step(history.past, history.future));
  const redo = () => step(history.future, history.past);

  function record(target, change) {
    const sel = selectorFor(target);
    const entry = edits.elements[sel] || { styles: {} };
    change(entry);
    if (Object.keys(entry.styles).length || entry.html != null || entry.adjust || entry.src || "stroke" in entry || entry.effects) edits.elements[sel] = entry;
    else delete edits.elements[sel];
    noteChange();
  }

  // A layer with data-ft-still (and what's inside it) runs no transitions, so an edit made while reading or
  // dragging lands at once. Counted, so a read inside a drag doesn't switch it off early.
  const stills = new Map();
  function still(t, on) {
    const n = (stills.get(t) || 0) + (on ? 1 : -1);
    if (n > 0) {
      stills.set(t, n);
      t.setAttribute("data-ft-still", "");
    } else {
      stills.delete(t);
      t.removeAttribute("data-ft-still");
    }
  }
  // Resolves styles now, so a change made while still lands without starting a transition.
  const flush = () => void document.documentElement.offsetWidth;

  // Whether a layer's code gives it motion: a CSS animation, or a JavaScript one (element.animate()). Its key is its
  // animations as the code gives them (CSS names, JavaScript keyframes); its label, their names.
  const cssNames = (e) => splitTop(getComputedStyle(e).animationName).filter((n) => n !== "none");
  const motionKey = (e) => cssNames(e).concat(waapiOf(e).map((en) => en.key)).join(" | ");
  const motionLabel = (e) => cssNames(e).concat(waapiOf(e).map((en) => en.label)).join(", ");
  const hasMotion = (e) => !!motionKey(e);
  // Motion's groups, read from the code: layers that run the same animations ("the intro rises in" over three
  // lines) are one group, outlined, picked and tuned as one; a layer with an animation of its own is a group of
  // one. Read again at most every second unless asked fresh.
  let motionCache = null;
  let motionAt = -Infinity;
  function motionGroups(fresh) {
    const now = performance.now();
    if (motionCache && !fresh && now - motionAt < 1000) return motionCache;
    discoverWaapi();
    const byKey = new Map();
    for (const e of document.body.querySelectorAll("*")) {
      if (e === pageEl || isUi(e) || e.closest(".ft-guides, .ft-panel, .ft-marks")) continue;
      const key = motionKey(e);
      if (!key) continue;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(e);
    }
    motionAt = now;
    return (motionCache = Array.from(byKey.values()));
  }
  const motionGroupOf = (t) => motionGroups().find((g) => g.includes(t)) || motionGroups(true).find((g) => g.includes(t)) || [t];

  // A CSS time as ms ("0.3s", ".3s", "300ms"); a bare number is ms, as the panel shows times.
  function toMs(v) {
    const s = String(v).trim().toLowerCase();
    const n = parseFloat(s);
    if (!isNum(n)) return NaN;
    return s.endsWith("ms") ? n : s.endsWith("s") ? n * 1000 : n;
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
  // It's read with transitions off, or it would read where a transition starts, not where it lands (a transition
  // property itself is read as it is: switching transitions off would change it).
  function ownValue(t, prop, read) {
    const get = () => getComputedStyle(t).getPropertyValue(read || prop).trim();
    const hold = !/^(transition|animation)/.test(read || prop);
    const o = originalOf(t);
    const now = t.style.getPropertyValue(prop);
    const orig = prop in o.styles ? o.styles[prop] : now;
    if (orig === now) return get();
    if (hold) still(t, true);
    if (orig) t.style.setProperty(prop, orig);
    else t.style.removeProperty(prop);
    const v = get();
    if (now) t.style.setProperty(prop, now);
    else t.style.removeProperty(prop);
    flush();
    if (hold) still(t, false);
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
    const shared = sharedComponent(target, prop);
    if (shared) return setComponentStyle(shared, prop, value);
    const o = originalOf(target);
    if (!(prop in o.styles)) o.styles[prop] = target.style.getPropertyValue(prop);
    if (value) target.style.setProperty(prop, value);
    else target.style.removeProperty(prop);
    record(target, (entry) => {
      if (value) entry.styles[prop] = value;
      else delete entry.styles[prop];
    });
  }

  // An edit to a component: on every instance of it (but one that overrides that property), recorded once.
  function setComponentStyle(name, prop, value) {
    instancesOf(name).forEach((t) => {
      if ((edits.elements[selectorFor(t)] || { styles: {} }).styles[prop] != null) return;
      const o = originalOf(t);
      if (!(prop in o.styles)) o.styles[prop] = t.style.getPropertyValue(prop);
      if (value) t.style.setProperty(prop, value);
      else t.style.removeProperty(prop);
    });
    const entry = edits.components[name] || { styles: {} };
    if (value) entry.styles[prop] = value;
    else delete entry.styles[prop];
    if (Object.keys(entry.styles).length) edits.components[name] = entry;
    else delete edits.components[name];
    noteChange();
  }

  function restoreEdits() {
    const added = edits.newKeyframes;
    edits.newKeyframes = {};
    paintNewKeyframes(added);
    edits.newKeyframes = added;
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
    // Saved component edits, on every instance but where one overrides that property.
    Object.keys(edits.components).forEach((name) => {
      const styles = edits.components[name].styles;
      instancesOf(name).forEach((t) => {
        const own = (edits.elements[selectorFor(t)] || { styles: {} }).styles;
        const o = originalOf(t);
        Object.keys(styles).forEach((p) => {
          if (own[p] != null) return;
          if (!(p in o.styles)) o.styles[p] = t.style.getPropertyValue(p);
          t.style.setProperty(p, styles[p]);
        });
      });
    });
    // Saved keyframe edits, written over what the code had (kept first).
    const saved = edits.keyframes;
    edits.keyframes = {};
    paintKeyframes(saved);
    edits.keyframes = saved;
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
    // A component's own look, changed on every instance of it: named, with the element it renders and how many.
    Object.keys(edits.components).forEach((name) => {
      const styles = edits.components[name].styles;
      const all = instancesOf(name);
      const root = all[0] ? " (" + all[0].localName + (all[0].classList.length ? "." + all[0].classList[0] : "") + ", " + all.length + " on the page)" : "";
      lines.push(["component " + name + root, Object.keys(styles).map((p) => p + ": " + styles[p]).join("; ")]);
    });
    Object.keys(edits.elements).forEach((sel) => {
      const e = edits.elements[sel];
      const parts = Object.keys(e.styles).map((p) => p + ": " + e.styles[p]);
      if (e.html != null) parts.push("text: " + e.html);
      if (e.src) parts.push('src: new image "' + e.src.name + '", chosen from her computer');
      // On a component instance, the layer's own edits are this instance's only (an override, a move, its words).
      let t = null;
      try {
        t = document.querySelector(sel);
      } catch (e) {
        t = null;
      }
      const comp = t ? componentOf(t) : "";
      if (parts.length) lines.push([comp ? sel + " (this " + comp + " only)" : sel, parts.join("; ")]);
      // The SVG filter its url() points at, for the bake to put in the page.
      if (e.adjust && hasTone(e.adjust)) lines.push([sel + " svg", toneMarkup(toneId(sel), e.adjust)]);
    });
    // A group: the layers the bake wraps in one new layer in the code.
    edits.groups.forEach((g, i) => lines.push(["group " + (i + 1), g.join(", ")]));
    // A keyframe she changed, in the page's @keyframes: every animation using them changes with it.
    // A @keyframes she added from the generic list: new to the code, so it's listed whole (her edits included).
    Object.keys(edits.newKeyframes).forEach((name) => {
      const rule = pageKeyframes().get(name);
      const body = rule ? Array.from(rule.cssRules).map((k) => k.cssText).join(" ") : edits.newKeyframes[name].body;
      lines.push(["@keyframes " + name + " (new)", body]);
    });
    Object.keys(edits.keyframes).filter((name) => !edits.newKeyframes[name]).forEach((name) => Object.keys(edits.keyframes[name]).forEach((key) => {
      const decl = edits.keyframes[name][key];
      lines.push(["@keyframes " + name + " " + key, Object.keys(decl).map((p) => p + ": " + decl[p]).join("; ")]);
    }));
    // A JavaScript animation: its element.animate() call, the layers it runs on (and the function that calls it,
    // when the browser names it), then each change from what the code says, as "was → now".
    Object.keys(edits.waapi).forEach((key) => {
      const w = edits.waapi[key];
      const code = w.code || {};
      const ct = code.timing || {};
      const cd = code.delays || {};
      const fmt = (f, v) => (v == null ? "?" : f === "duration" || f === "delay" ? v + "ms" : String(v));
      const parts = Object.keys(w.timing).map((f) => f + " " + fmt(f, ct[f]) + " → " + fmt(f, w.timing[f]));
      if (Object.keys(w.delays).length) {
        const was = w.sels.map((x) => fmt("delay", cd[x]));
        const now = w.sels.map((x) => fmt("delay", x in w.delays ? w.delays[x] : cd[x]));
        parts.push("delay per layer " + was.join(", ") + " → " + now.join(", "));
      }
      Object.keys(w.frames).forEach((i) => Object.keys(w.frames[i]).forEach((p) => {
        parts.push("keyframe " + i + " " + p + " " + fmt(p, ((code.frames || [])[i] || {})[p]) + " → " + fmt(p, w.frames[i][p]));
      }));
      if (!parts.length) return;
      const where = (w.sels.length > 1 ? w.sels[0] + " and " + (w.sels.length - 1) + " more" : w.sels[0] || "?") + (w.hint ? ", called from " + w.hint + "()" : "");
      lines.push(["animate() " + w.label, "on " + where + ": " + parts.join("; ")]);
    });
    const width = Math.max.apply(null, lines.map((l) => l[0].length)) + 2;
    return "finetune changes · " + decodeURIComponent(location.pathname) + "\n"
      + lines.map(([sel, decl]) => sel.padEnd(width) + decl).join("\n");
  }

  let toastEl = null;
  let toastTimer = 0;
  // action: a button on the toast ({ label, run }); ms: how long it stays (1.8 seconds unless said). It fades out.
  function toast(text, action, ms) {
    if (!toastEl) {
      toastEl = el("div", "ft-toast");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.toggle("has-action", !!action);
    toastEl.classList.remove("is-fading");
    if (action) {
      const actions = el("div", "ft-toast-actions");
      const close = button("ft-toast-close", null, () => {
        clearTimeout(toastTimer);
        toastEl.hidden = true;
      });
      close.innerHTML = ICON.x;
      close.setAttribute("aria-label", "Close");
      close.setAttribute("data-ft-tip", "Close");
      withTip(close);
      actions.append(button("ft-toast-btn", action.label, () => {
        toastEl.hidden = true;
        action.run();
      }), close);
      toastEl.appendChild(actions);
    }
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.add("is-fading");
      toastTimer = setTimeout(() => { toastEl.hidden = true; }, 400);
    }, ms || 1800);
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
    // A component's name over its top left (componentOf).
    const compLabel = el("span", "ft-comp-label");
    const compName = el("span");
    compLabel.innerHTML = ICON.component;
    compLabel.appendChild(compName);
    compLabel.hidden = true;
    selBox.appendChild(compLabel);
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
      selBox.classList.toggle("no-resize", motion() || !(selected && resizable(selected)));
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
      // Motion's selection has no label: the size is Design's.
      sizeLabel.hidden = motion();
      const comp = !motion() && selected ? componentOf(selected) : "";
      selBox.classList.toggle("is-comp", !!comp);
      compLabel.hidden = !comp;
      if (comp) compName.textContent = comp;
    }
    function moved() {
      place();
      refreshPanel();
    }
    const sizes = new ResizeObserver(moved);

    // A layer moving on its own (a transition, an animation, a replay): the selection follows it each frame, and
    // the panel's numbers catch up when it lands.
    let following = 0;
    const busy = () => current().some((t) => t.getAnimations({ subtree: true }).some((a) => a.playState === "running"));
    function follow() {
      if (following) return;
      const tick = () => {
        place();
        if (busy()) following = requestAnimationFrame(tick);
        else {
          following = 0;
          moved();
        }
      };
      following = requestAnimationFrame(tick);
    }
    ["transitionrun", "animationstart"].forEach((type) => document.addEventListener(type, (e) => {
      if (current().some((t) => t === e.target || t.contains(e.target))) follow();
    }, true));

    function show(one, list, g) {
      instanceCache.clear();
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
      if (busy()) follow();
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
          // A layer with a transition would trail the pointer; it follows it instead.
          list.forEach((t) => still(t, true));
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
        flush();
        list.forEach((t) => still(t, false));
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
          still(t, true);
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
        flush();
        still(t, false);
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
      undoToast("Grouped " + list.length + " layers", undo);
    }
    function ungroup() {
      if (!group) return toast("Select a group to ungroup");
      edits.groups = edits.groups.filter((g) => g !== group);
      const list = many.slice();
      show(null, list, null);
      noteChange();
      undoToast("Ungrouped " + list.length + " layers", undo);
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

    // In Motion a click finds the nearest layer with motion under the pointer (its whole group); anything else is
    // picked as in Design, so an animation can be added to it. A press only selects (no moves, marquee, resizing or
    // text editing: those are Design's).
    const motion = () => inspector.getAttribute("data-tab") === "motion";
    function motionPick(target) {
      for (let e = pickable(target); e && e !== document.body; e = e.parentElement) {
        if (e !== pageEl && !isUi(e) && hasMotion(e)) return e;
      }
      return null;
    }
    // A set of layers as the selection: one, several, or none.
    function selectLayers(list) {
      inside = scope = null;
      if (list.length > 1) pick(list);
      else select(list[0] || null);
    }
    // Back in Motion, a selection with motion becomes its whole group; one without stays, ready for one to be added.
    function tabChanged() {
      const now = current();
      if (motion() && now.length && now.every(hasMotion)) selectLayers(motionGroupOf(now[0]));
      place();
      drawMarks();
    }

    // Motion's outlines: one box per group (around all its layers) on screen, following them each frame while
    // Motion shows. The groups are read again every second, so one the page starts later (a class set on click)
    // gets its box too.
    const marks = el("div", "ft-marks");
    marks.hidden = true;
    document.body.appendChild(marks);
    let marked = [];
    let markedAt = -Infinity;
    let markLoop = 0;
    function drawMarks() {
      const on = active() && motion();
      marks.hidden = !on;
      if (!on) {
        cancelAnimationFrame(markLoop);
        markLoop = 0;
        markedAt = -Infinity;
        return;
      }
      if (markLoop) return;
      const tick = (now) => {
        if (!active() || !motion()) return drawMarks();
        if (now - markedAt > 1000) {
          markedAt = now;
          marked = motionGroups(true);
          while (marks.children.length < marked.length) marks.appendChild(el("div", "ft-mark"));
          while (marks.children.length > marked.length) marks.lastChild.remove();
        }
        marked.forEach((g, i) => {
          const r = unionRect(g);
          marks.children[i].hidden = !r.width && !r.height;
          frameRect(marks.children[i], r);
        });
        markLoop = requestAnimationFrame(tick);
      };
      markLoop = requestAnimationFrame(tick);
    }

    // Hover outlines what a click would pick: a group as one box.
    document.addEventListener("pointermove", (e) => {
      const live = active() && !editing && !moving && marquee.hidden;
      const moving_ = live && motion() ? motionPick(e.target) : null;
      const t = !live ? null : moving_ || levelPick(e.target, e.metaKey || e.ctrlKey).pick;
      const unit = moving_ ? { list: motionGroupOf(moving_) } : unitOf(t);
      const over = unit ? unit.list : t ? [t] : [];
      const now = current();
      hoverBox.hidden = !over.length || over.every((o) => now.includes(o));
      if (!hoverBox.hidden) frameRect(hoverBox, unionRect(over));
      hoverBox.classList.toggle("is-comp", !motion() && over.length === 1 && !!componentOf(over[0]));
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
      if (motion()) {
        // Something with motion picks its group; anything else is picked as in Design (the outermost layer below
        // the level she's in, a group as one), so an animation can be added to it.
        const m = motionPick(e.target);
        if (m) return selectLayers(motionGroupOf(m));
        const lp = levelPick(e.target, e.metaKey || e.ctrlKey);
        if (!lp.pick) return selectLayers([]);
        const unit = unitOf(lp.pick);
        if (unit) return show(null, unit.list, unit.g);
        return select(lp.pick);
      }
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
      if (!active() || editing || isUi(e.target) || motion()) return;
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
      } else if (e.key === "Enter" && selected && hasText(selected) && !motion()) {
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
      drawMarks();
    }
    sync();

    return { sync, refresh: place, reshow, selectLayers, tabChanged };
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
      if (anchor) anchor.classList.remove("is-open");
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
        if (anchor) anchor.classList.remove("is-open");
        anchor = btn;
        btn.classList.add("is-open");
        hover = onHover || null;
        // Read at leave time: a pick may have closed the menu (and dropped the preview) first.
        menu.onpointerleave = () => { if (hover) hover(null); };
        menu.textContent = "";
        items.forEach((it) => {
          // A heading names the items under it; it isn't one. A divider is a line between parts.
          if (it.heading) {
            menu.appendChild(el("div", "ft-menu-heading", it.label));
            return;
          }
          if (it.divider) {
            menu.appendChild(el("div", "ft-menu-divider"));
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
        // The current item sits over the button (measured, so headings and dividers above it count).
        const checked = i < 0 ? null : menu.querySelectorAll(".ft-menu-item")[items.slice(0, i).filter((it) => !it.heading && !it.divider).length];
        const top = !checked ? r.bottom + 4 : r.top - checked.offsetTop;
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
      thumb.classList.add("is-open");
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
      anchor.classList.remove("is-open");
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
    undoToast("Align all items " + ALIGN_WORD[how], undo);
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
      icon.classList.add("is-open");
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
      anchor.classList.remove("is-open");
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
      icon.classList.add("is-open");
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
      anchor.classList.remove("is-open");
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

  // Figma's easings, as the CSS each is: the keywords, then its back curves as cubic-beziers.
  const EASINGS = [
    ["linear", "Linear"], ["ease", "Ease"], ["ease-in", "Ease in"], ["ease-out", "Ease out"], ["ease-in-out", "Ease in and out"],
    ["cubic-bezier(0.3, -0.05, 0.7, -0.5)", "Ease in back"], ["cubic-bezier(0.45, 1.45, 0.8, 1)", "Ease out back"],
    ["cubic-bezier(0.7, -0.4, 0.4, 1.4)", "Ease in and out back"],
  ];
  const KEYWORD_BEZIER = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1] };
  // An easing as its four cubic-bezier numbers, or null for one that isn't a curve (steps(), linear()).
  function bezierOf(v) {
    const s = String(v || "").trim().toLowerCase();
    if (KEYWORD_BEZIER[s]) return KEYWORD_BEZIER[s].slice();
    const m = /^cubic-bezier\(([^)]*)\)$/.exec(s);
    const n = m ? m[1].split(",").map(parseFloat) : [];
    return n.length === 4 && n.every(isNum) ? n : null;
  }
  const sameEase = (a, b) => {
    const x = bezierOf(a);
    const y = bezierOf(b);
    return x && y ? x.every((n, i) => Math.abs(n - y[i]) < 1e-3) : String(a).trim() === String(b).trim();
  };
  // A preset's name, Custom for any other curve, or the value itself (steps(4)).
  const easeName = (v) => (EASINGS.find(([e]) => sameEase(e, v)) || [null, bezierOf(v) ? "Custom" : String(v)])[1];

  // An easing's own curve as a 12px glyph, as Figma draws one in front of the easing's name. A curve that
  // overshoots is drawn squeezed into the box; one that isn't a curve (steps(), linear()) is a straight line.
  function curveGlyph(v) {
    const b = bezierOf(v) || [0, 0, 1, 1];
    const X = (x) => 2 + x * 12;
    const Y = (y) => 14 - (Math.min(1.5, Math.max(-0.5, y)) + 0.5) / 2 * 12;
    return '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><path d="M'
      + X(0) + " " + Y(0) + "C" + X(b[0]) + " " + Y(b[1]) + " " + X(b[2]) + " " + Y(b[3]) + " " + X(1) + " " + Y(1) + '"/></svg>';
  }

  // Figma's curve editor: the unit square with room above and below for curves that overshoot, and its two
  // handles to drag (x from 0 to 1, as CSS requires; y from -0.5 to 1.5). set() shows a value (a value that
  // isn't a curve hides it); a drag hands the new cubic-bezier to onDrag.
  function curveEditor(onDrag) {
    let value = null;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 208 208");
    svg.setAttribute("class", "ft-curve");
    const part = (tag, cls) => {
      const e = document.createElementNS(NS, tag);
      e.setAttribute("class", cls);
      svg.appendChild(e);
      return e;
    };
    // The unit square sits in the middle, 192 by 96, with room for y from -0.5 to 1.5.
    const X = (x) => 8 + x * 192;
    const Y = (y) => 8 + (1.5 - y) * 96;
    const box = part("rect", "ft-curve-box");
    [["x", 8], ["y", 56], ["width", 192], ["height", 96]].forEach(([k, v]) => box.setAttribute(k, v));
    const arms = [part("line", "ft-curve-arm"), part("line", "ft-curve-arm")];
    const curve = part("path", "ft-curve-line");
    const knobs = [part("circle", "ft-curve-knob"), part("circle", "ft-curve-knob")];
    knobs.forEach((k) => k.setAttribute("r", "5"));

    function set(v) {
      value = v;
      const b = bezierOf(v);
      svg.style.display = b ? "" : "none";
      if (!b) return;
      const ends = [[0, 0], [1, 1]];
      curve.setAttribute("d", "M" + X(0) + " " + Y(0) + "C" + X(b[0]) + " " + Y(b[1]) + " " + X(b[2]) + " " + Y(b[3]) + " " + X(1) + " " + Y(1));
      [0, 1].forEach((i) => {
        arms[i].setAttribute("x1", X(ends[i][0]));
        arms[i].setAttribute("y1", Y(ends[i][1]));
        arms[i].setAttribute("x2", X(b[i * 2]));
        arms[i].setAttribute("y2", Y(b[i * 2 + 1]));
        knobs[i].setAttribute("cx", X(b[i * 2]));
        knobs[i].setAttribute("cy", Y(b[i * 2 + 1]));
      });
    }

    knobs.forEach((k, i) => k.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      k.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const r = svg.getBoundingClientRect();
        const px = ((ev.clientX - r.left) / r.width) * 208;
        const py = ((ev.clientY - r.top) / r.height) * 208;
        const b = bezierOf(value) || KEYWORD_BEZIER.ease.slice();
        b[i * 2] = Math.round(clamp01((px - 8) / 192) * 100) / 100;
        b[i * 2 + 1] = Math.round(Math.min(1.5, Math.max(-0.5, 1.5 - (py - 8) / 96)) * 100) / 100;
        set("cubic-bezier(" + b.join(", ") + ")");
        onDrag(value);
      };
      const end = () => {
        k.removeEventListener("pointermove", move);
        k.removeEventListener("pointerup", end);
        k.removeEventListener("pointercancel", end);
      };
      k.addEventListener("pointermove", move);
      k.addEventListener("pointerup", end);
      k.addEventListener("pointercancel", end);
    }));
    return { el: svg, set };
  }

  // The page's @keyframes by name (and the ones she added from Motion's generic list, in finetune-keyframes). When
  // two sheets define one, the last wins, as in CSS.
  function pageKeyframes() {
    const found = new Map();
    const walk = (rules) => {
      for (const r of rules) {
        if (r instanceof CSSKeyframesRule) found.set(r.name, r);
        else if (r.cssRules && !(r instanceof CSSStyleRule)) walk(r.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode && sheet.ownerNode.id === STYLE_ID) continue;
      try {
        walk(sheet.cssRules);
      } catch (e) {
        // Another origin's sheet can't be read.
      }
    }
    return found;
  }

  // Motion's generic animations, as Figma lists them (Instant and Smart animate have no CSS of their own). Each
  // moves up or fades; Direction and Distance turn it afterwards. Picking one adds a new @keyframes to the page
  // (finetune-keyframes), named for it ("slide-in", or "slide-in-2" when taken), kept in edits.newKeyframes; Copy
  // lists it whole, for the bake to add to the code.
  const PRESETS = [
    ["dissolve", "Dissolve", "from { opacity: 0; }"],
    ["move-in", "Move in", "from { transform: translateY(100%); }"],
    ["move-out", "Move out", "to { transform: translateY(-100%); }"],
    ["push", "Push", "from { opacity: 0; transform: translateY(100%); }"],
    ["slide-in", "Slide in", "from { opacity: 0; transform: translateY(24px); }"],
    ["slide-out", "Slide out", "to { opacity: 0; transform: translateY(-24px); }"],
  ];
  let newSheet = null;
  function putNewKeyframes(name, body) {
    if (!newSheet) {
      newSheet = el("style");
      newSheet.id = "finetune-keyframes";
      document.head.appendChild(newSheet);
    }
    const rules = newSheet.sheet.cssRules;
    for (let i = rules.length - 1; i >= 0; i--) if (rules[i].name === name) newSheet.sheet.deleteRule(i);
    if (body != null) newSheet.sheet.insertRule("@keyframes " + name + " { " + body + " }", rules.length);
  }
  // Adds a generic animation to the page as a @keyframes of its own, and gives back its name.
  function addPreset(id) {
    const preset = PRESETS.find(([p]) => p === id);
    const taken = pageKeyframes();
    let name = id;
    for (let n = 2; taken.has(name); n++) name = id + "-" + n;
    putNewKeyframes(name, preset[2]);
    edits.newKeyframes[name] = { preset: id, body: preset[2] };
    noteChange();
    return name;
  }
  // Puts finetune's added @keyframes where next says (undo, redo, a reload).
  function paintNewKeyframes(next) {
    Object.keys(edits.newKeyframes).forEach((name) => { if (!next[name]) putNewKeyframes(name, null); });
    Object.keys(next).forEach((name) => { if (!edits.newKeyframes[name]) putNewKeyframes(name, next[name].body); });
  }

  // Keyframe edits are written into the page's own @keyframes (so every animation using them follows, as the
  // code would) and kept as edits: edits.keyframes[name][keyText][prop]. What the code had is kept the first
  // time a declaration is touched, for undo and for typing the code's value back.
  const keyframeOriginals = {};
  function keyframeOriginal(name, key, prop) {
    const kf = pageKeyframes().get(name);
    const one = kf && kf.findRule(key);
    const at = (keyframeOriginals[name] = keyframeOriginals[name] || {});
    const props = (at[key] = at[key] || {});
    if (!(prop in props)) props[prop] = one ? one.style.getPropertyValue(prop) : "";
    return props[prop];
  }
  function writeKeyframe(name, key, prop, value) {
    const kf = pageKeyframes().get(name);
    const one = kf && kf.findRule(key);
    if (!one) return;
    if (value) one.style.setProperty(prop, value);
    else one.style.removeProperty(prop);
  }
  function setKeyframe(name, key, prop, value) {
    const orig = keyframeOriginal(name, key, prop);
    writeKeyframe(name, key, prop, value || orig);
    const frames = edits.keyframes[name] || {};
    const decl = frames[key] || {};
    if (value && value !== orig) decl[prop] = value;
    else delete decl[prop];
    if (Object.keys(decl).length) frames[key] = decl;
    else delete frames[key];
    if (Object.keys(frames).length) edits.keyframes[name] = frames;
    else delete edits.keyframes[name];
    noteChange();
  }
  // Puts the page's @keyframes where next says (what the code had for anything next leaves out).
  function paintKeyframes(next) {
    const names = new Set(Object.keys(edits.keyframes).concat(Object.keys(next)));
    names.forEach((name) => {
      const a = edits.keyframes[name] || {};
      const b = next[name] || {};
      new Set(Object.keys(a).concat(Object.keys(b))).forEach((key) => {
        const pa = a[key] || {};
        const pb = b[key] || {};
        new Set(Object.keys(pa).concat(Object.keys(pb))).forEach((prop) => {
          const orig = keyframeOriginal(name, key, prop);
          writeKeyframe(name, key, prop, pb[prop] || orig);
        });
      });
    });
  }

  // What a keyframe does, read from its translate, scale and rotate (the properties, or the transform's
  // functions) and its opacity. An aspect it sets in a way the panel can't turn (a var(), a calc(), a skewed or
  // uneven scale) reads null and isn't offered.
  const FN = /([a-z0-9-]+)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gi;
  const fnsOf = (v) => [...String(v || "").matchAll(FN)].map((m) => ({ fn: m[1].toLowerCase(), args: m[2].split(/\s*,\s*|\s+/).filter(Boolean) }));
  const fnText = (f) => f.fn + "(" + f.args.join(", ") + ")";
  function lengthOf(v) {
    const m = /^(-?(?:\d+\.?\d*|\.\d+))([a-z%]*)$/i.exec(String(v).trim());
    return m ? { n: parseFloat(m[1]), u: m[2] || "px" } : null;
  }
  const lengthText = (l) => (l.n ? +l.n.toFixed(3) + l.u : "0");
  // Two lengths along one axis add up only in one unit (a zero takes the other's).
  const addLength = (a, b) => (!a || !b ? null : !a.n ? b : !b.n ? a : a.u === b.u ? { n: a.n + b.n, u: a.u } : null);
  function degreesOf(v) {
    const m = /^(-?(?:\d+\.?\d*|\.\d+))(deg|turn|rad|grad)?$/i.exec(String(v).trim());
    if (!m) return null;
    const n = parseFloat(m[1]);
    const u = (m[2] || "deg").toLowerCase();
    return u === "turn" ? n * 360 : u === "rad" ? (n * 180) / Math.PI : u === "grad" ? n * 0.9 : n;
  }
  function keyframeParts(style) {
    const out = {};
    const tf = style.getPropertyValue("transform").trim();
    const fns = tf && tf !== "none" ? fnsOf(tf) : [];
    const tp = style.getPropertyValue("translate").trim();
    if (tp && tp !== "none") {
      const a = tp.split(/\s+/);
      const x = lengthOf(a[0]);
      const y = a[1] ? lengthOf(a[1]) : { n: 0, u: "px" };
      out.move = x && y ? { x, y } : null;
      out.moveBy = "translate";
    } else {
      const ts = fns.filter((f) => /^translate(x|y|3d)?$/.test(f.fn));
      if (ts.length) {
        let x = { n: 0, u: "px" };
        let y = { n: 0, u: "px" };
        ts.forEach((f) => {
          const a = f.args.map(lengthOf);
          if (f.fn === "translatex") x = addLength(x, a[0]);
          else if (f.fn === "translatey") y = addLength(y, a[0]);
          else {
            x = addLength(x, a[0]);
            if (f.args[1]) y = addLength(y, a[1]);
          }
        });
        out.move = x && y ? { x, y } : null;
        out.moveBy = "transform";
      }
    }
    const sp = style.getPropertyValue("scale").trim();
    if (sp && sp !== "none") {
      const a = sp.split(/\s+/).map(parseFloat);
      out.scale = a.every(isNum) && (a.length < 2 || a[0] === a[1]) ? a[0] : null;
      out.scaleBy = "scale";
    } else {
      const ss = fns.filter((f) => /^scale(x|y|3d)?$/.test(f.fn));
      if (ss.length) {
        const a = ss[0].args.map(parseFloat);
        out.scale = ss.length === 1 && ss[0].fn === "scale" && a.every(isNum) && (a.length < 2 || a[0] === a[1]) ? a[0] : null;
        out.scaleBy = "transform";
      }
    }
    const rp = style.getPropertyValue("rotate").trim();
    if (rp && rp !== "none") {
      out.rotate = rp.split(/\s+/).length === 1 ? degreesOf(rp) : null;
      out.rotateBy = "rotate";
    } else {
      const rs = fns.filter((f) => /^rotate(z)?$/.test(f.fn));
      if (rs.length) {
        out.rotate = rs.length === 1 ? degreesOf(rs[0].args[0]) : null;
        out.rotateBy = "transform";
      }
    }
    const op = style.getPropertyValue("opacity").trim();
    if (op) {
      const n = parseFloat(op);
      out.opacity = isNum(n) ? (op.endsWith("%") ? n / 100 : n) : null;
    }
    return out;
  }
  // Writes one aspect of one keyframe back the way the code wrote it: its own property, or its transform function.
  // A frame reads and writes its own declarations (read(prop), write(prop, value)): a CSS keyframe in the page's
  // @keyframes, or a JavaScript animation's keyframe.
  function writePart(f, aspect, value) {
    const by = f.parts[aspect + "By"];
    if (aspect === "opacity") return f.write("opacity", String(+value.toFixed(3)));
    if (by !== "transform") {
      const css = aspect === "move" ? lengthText(value.x) + " " + lengthText(value.y)
        : aspect === "rotate" ? +value.toFixed(2) + "deg" : String(+value.toFixed(3));
      return f.write(by, css);
    }
    const fns = fnsOf(f.read("transform"));
    const mine = aspect === "move" ? /^translate(x|y|3d)?$/ : aspect === "scale" ? /^scale(x|y|3d)?$/ : /^rotate(z)?$/;
    const at = fns.findIndex((fn) => mine.test(fn.fn));
    const next = aspect === "move" ? { fn: "translate", args: [lengthText(value.x), lengthText(value.y)] }
      : aspect === "scale" ? { fn: "scale", args: [String(+value.toFixed(3))] } : { fn: "rotate", args: [+value.toFixed(2) + "deg"] };
    const kept = fns.filter((fn) => !mine.test(fn.fn));
    kept.splice(at < 0 ? kept.length : at, 0, next);
    f.write("transform", kept.map(fnText).join(" "));
  }

  // A @keyframes as frames: each keyframe's offset, and its declarations read from and written into the page's rule.
  function cssFrames(name) {
    const rule = pageKeyframes().get(name);
    if (!rule) return null;
    return [...rule.cssRules].map((kf) => ({
      at: offsetOf(kf.keyText),
      read: (p) => kf.style.getPropertyValue(p),
      write: (p, v) => setKeyframe(name, kf.keyText, p, v),
    }));
  }

  // What a set of keyframes does as a whole, for the panel to offer only what applies (a fade has no direction; a roll
  // left has one): which way it moves and how far, and its biggest scale, turn and fade. A move goes from its
  // first keyframe to its last (a missing end is where the layer sits), or out to its farthest keyframe and back.
  const DIRS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  const offsetOf = (key) => {
    const k = String(key).split(",")[0].trim().toLowerCase();
    return k === "from" ? 0 : k === "to" ? 100 : parseFloat(k);
  };
  function keyframesInfo(list) {
    if (!list) return null;
    const frames = list.map((f) => Object.assign({}, f, { parts: keyframeParts({ getPropertyValue: f.read }) }))
      .sort((a, b) => a.at - b.at);
    const info = { frames };
    const has = (aspect) => frames.filter((f) => aspect in f.parts);
    const zero = { x: { n: 0, u: "px" }, y: { n: 0, u: "px" } };
    const moving = has("move");
    if (moving.length && moving.every((f) => f.parts.move)) {
      const at = (o) => { const f = frames.find((g) => g.at === o && g.parts.move); return f ? f.parts.move : zero; };
      const sub = (a, b) => ({ x: addLength(a.x, { n: -b.x.n, u: b.x.u }), y: addLength(a.y, { n: -b.y.n, u: b.y.u }) });
      const start = at(0);
      let v = sub(at(100), start);
      if (v.x && v.y && !v.x.n && !v.y.n) {
        const far = moving.reduce((a, b) => (Math.max(Math.abs(b.parts.move.x.n), Math.abs(b.parts.move.y.n)) > Math.max(Math.abs(a.parts.move.x.n), Math.abs(a.parts.move.y.n)) ? b : a));
        v = sub(far.parts.move, start);
      }
      if (v.x && v.y && (v.x.n || v.y.n)) {
        const across = Math.abs(v.x.n) >= Math.abs(v.y.n);
        const d = across ? v.x : v.y;
        info.direction = across ? (d.n < 0 ? "left" : "right") : d.n < 0 ? "up" : "down";
        info.distance = { n: Math.abs(d.n), u: d.u };
      }
    }
    // The keyframe(s) farthest from rest (scale 1, no turn, opacity 1), which a field edits together.
    const farthest = (aspect, rest) => {
      const list = has(aspect);
      if (!list.length || list.some((f) => f.parts[aspect] == null)) return;
      const far = list.reduce((a, b) => (Math.abs(b.parts[aspect] - rest) > Math.abs(a.parts[aspect] - rest) ? b : a));
      if (Math.abs(far.parts[aspect] - rest) < 1e-6) return;
      info[aspect] = { value: far.parts[aspect], frames: list.filter((f) => Math.abs(f.parts[aspect] - far.parts[aspect]) < 1e-6) };
    };
    farthest("scale", 1);
    farthest("rotate", 0);
    farthest("opacity", 1);
    return info;
  }
  // Turns every keyframe's move from one direction to another, keeping its distance: along the same axis it
  // flips, across it swaps the axes.
  function turnMoves(info, to) {
    const [fx, fy] = DIRS[info.direction];
    const [tx, ty] = DIRS[to];
    info.frames.forEach((f) => {
      const m = f.parts.move;
      if (!m || (!m.x.n && !m.y.n)) return;
      const s = (l, k) => ({ n: l.n * k, u: l.u });
      const next = fx && tx ? { x: s(m.x, fx * tx), y: m.y } : fy && ty ? { x: m.x, y: s(m.y, fy * ty) }
        : fy ? { x: s(m.y, fy * tx), y: s(m.x, fy * tx) } : { x: s(m.y, fx * ty), y: s(m.x, fx * ty) };
      writePart(f, "move", next);
    });
  }
  // Scales every keyframe's move so the whole move covers this distance, in its unit.
  function scaleMoves(info, n) {
    const k = info.distance.n ? n / info.distance.n : 0;
    info.frames.forEach((f) => {
      const m = f.parts.move;
      if (!m || (!m.x.n && !m.y.n)) return;
      writePart(f, "move", { x: { n: m.x.n * k, u: m.x.u }, y: { n: m.y.n * k, u: m.y.u } });
    });
  }

  // JavaScript animations: element.animate(), the browser's own animation call (and libraries built on it).
  // finetune wraps animate() to see every call, so the animation is listed, outlined, replayed, slowed down and
  // tuned as a CSS one is, and her edits apply to every later call too: tuning survives the page running it
  // again. One running from before finetune loaded is found through getAnimations(). Libraries that move things
  // frame by frame themselves (GSAP, most of Motion for React) leave no animation to read, so they aren't here.
  // An animation is known by its keyframes as the code gives them (or its id): the same keyframes on several layers
  // (a staggered list) are one animation, a group.
  const waapi = new Map();
  const knownAnims = new WeakSet();
  // Set by the inspector: gives a new call the playback speed while its layer is being watched.
  let afterAnimate = () => {};
  const camel = (p) => p.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
  function cleanFrame(k) {
    const f = { offset: k.computedOffset };
    if (k.easing && k.easing !== "linear") f.easing = k.easing;
    if (k.composite && k.composite !== "auto") f.composite = k.composite;
    Object.keys(k).forEach((p) => {
      if (!["offset", "computedOffset", "easing", "composite"].includes(p)) f[p] = k[p];
    });
    return f;
  }
  const codeTiming = (t) => ({
    duration: isNum(t.duration) ? t.duration : 0, delay: t.delay || 0, easing: t.easing || "linear",
    iterations: t.iterations === Infinity ? "infinite" : t.iterations, direction: t.direction || "normal",
    fill: !t.fill || t.fill === "auto" ? "none" : t.fill,
  });
  const propsOf = (frames) => [...new Set(frames.flatMap((f) => Object.keys(f).filter((p) => !["offset", "easing", "composite"].includes(p))))];
  // The nearest named function that made the call (past finetune, anonymous callbacks and the browser's own
  // forEach and the like): a hint for the bake to find the call.
  function callerOf(stack) {
    for (const line of String(stack || "").split("\n").slice(1, 12)) {
      if (/finetune/.test(line)) continue;
      const m = /at (?:async )?([\w$.]+) \(/.exec(line);
      if (!m || /^(Array|NodeList|HTMLCollection|Map|Set|Promise|Function|HTML\w*Element|Element)\./.test(m[1])) continue;
      return m[1].replace(/^Object\./, "");
    }
    return null;
  }
  // Her edits over what the code gave: timing (a staggered layer's delay is its own), and keyframe values by index.
  function editedTiming(code, ed, sel) {
    const t = Object.assign({}, code, ed && ed.timing);
    if (ed && ed.delays && sel in ed.delays) t.delay = ed.delays[sel];
    if (t.iterations === "infinite") t.iterations = Infinity;
    return t;
  }
  const editedFrames = (frames, ed) => frames.map((f, i) => Object.assign({}, f, ed && ed.frames && ed.frames[i]));
  function noteAnim(el, anim, frames, timing, id, stack) {
    const key = id ? "id:" + id : JSON.stringify(frames);
    let entry = waapi.get(key);
    if (!entry) {
      entry = { key, label: id || propsOf(frames).join(", "), hint: callerOf(stack), frames, targets: new Map() };
      waapi.set(key, entry);
    }
    entry.targets.set(el, { anim, timing });
    knownAnims.add(anim);
    return entry;
  }
  if (window.Element && Element.prototype.animate && !Element.prototype.animate.finetune) {
    const native = Element.prototype.animate;
    const animate = function (keyframes, options) {
      let plan = null;
      try {
        if (!isUi(this)) {
          const effect = new KeyframeEffect(null, keyframes, options);
          const id = options && typeof options === "object" && options.id ? String(options.id) : "";
          plan = { frames: effect.getKeyframes().map(cleanFrame), timing: codeTiming(effect.getTiming()), id, stack: new Error().stack };
        }
      } catch (e) {
        plan = null;
      }
      let kf = keyframes;
      let opts = options;
      const ed = plan && edits.waapi[plan.id ? "id:" + plan.id : JSON.stringify(plan.frames)];
      if (ed) {
        kf = editedFrames(plan.frames, ed);
        opts = Object.assign(typeof options === "number" ? {} : Object.assign({}, options), editedTiming(plan.timing, ed, selectorFor(this)));
      }
      const anim = native.call(this, kf, opts);
      if (plan) {
        try {
          noteAnim(this, anim, plan.frames, plan.timing, plan.id, plan.stack);
          afterAnimate();
        } catch (e) {
          // Listing it is a nicety; the page's animation runs regardless.
        }
      }
      return anim;
    };
    animate.finetune = true;
    Element.prototype.animate = animate;
  }
  // Puts a JavaScript animation's edits (or, with none, what the code said) on its running copies.
  function applyWaapi(entry) {
    const ed = edits.waapi[entry.key];
    entry.targets.forEach((tg, el) => {
      try {
        tg.anim.effect.updateTiming(editedTiming(tg.timing, ed, selectorFor(el)));
        tg.anim.effect.setKeyframes(editedFrames(entry.frames, ed));
      } catch (e) {
        // A value the browser won't take; the animation keeps what it had.
      }
    });
  }
  // Finds JavaScript animations running from before finetune loaded, and drops layers the page took away.
  function discoverWaapi() {
    document.getAnimations().forEach((a) => {
      if (knownAnims.has(a) || a instanceof CSSAnimation || a instanceof CSSTransition) return;
      const el = a.effect && a.effect.target;
      if (!(el instanceof Element) || isUi(el)) return;
      const entry = noteAnim(el, a, a.effect.getKeyframes().map(cleanFrame), codeTiming(a.effect.getTiming()), a.id || "", "");
      if (edits.waapi[entry.key]) applyWaapi(entry);
    });
    waapi.forEach((entry) => entry.targets.forEach((tg, el) => {
      if (!el.isConnected) entry.targets.delete(el);
    }));
  }
  // The JavaScript animations a layer runs.
  const waapiOf = (e) => Array.from(waapi.values()).filter((en) => en.targets.has(e));
  // Her edit record for a JavaScript animation, made on its first edit with what the code said, so Copy can name
  // the call and the bake can find it: edits.waapi[key] = { label, hint, sels, code: { timing, delays, frames },
  // timing, delays, frames }.
  function waapiEdit(entry) {
    let ed = edits.waapi[entry.key];
    if (!ed) {
      const delays = {};
      let timing = {};
      entry.targets.forEach((tg, el) => {
        delays[selectorFor(el)] = tg.timing.delay;
        timing = tg.timing;
      });
      ed = edits.waapi[entry.key] = { label: entry.label, hint: entry.hint || "", sels: Object.keys(delays), code: { timing, delays, frames: entry.frames }, timing: {}, delays: {}, frames: {} };
    }
    return ed;
  }

  // CSS animations the page's stylesheets give layers that aren't running them yet: the rule needs a class the
  // page adds later (on scroll, on a click). A rule counts when its selector, less one of its classes, matches
  // layers on this page; that class is what starts it, on the layers that hold it in the selector. Rules for other
  // pages, or started by a state finetune can't set (a hover, an attribute), aren't listed.
  const allOf = (sel) => {
    try {
      return Array.from(document.querySelectorAll(sel));
    } catch (e) {
      return [];
    }
  };
  // A selector's compounds and the combinators between them, at its top level.
  function compoundsOf(sel) {
    const parts = [];
    const joins = [];
    let cur = "";
    let depth = 0;
    for (let i = 0; i < sel.length; i++) {
      const ch = sel[i];
      if (ch === "(" || ch === "[") depth++;
      else if (ch === ")" || ch === "]") depth--;
      if (!depth && /[\s>+~]/.test(ch)) {
        let comb = " ";
        while (i < sel.length && /[\s>+~]/.test(sel[i])) {
          if (!/\s/.test(sel[i])) comb = sel[i];
          i++;
        }
        i--;
        if (cur) {
          parts.push(cur);
          joins.push(comb);
          cur = "";
        }
        continue;
      }
      cur += ch;
    }
    if (cur) parts.push(cur);
    return { parts, joins };
  }
  const joinCompounds = (parts, joins, upTo) => parts.slice(0, upTo + 1)
    .map((p, i) => (!i ? "" : joins[i - 1] === " " ? " " : " " + joins[i - 1] + " ") + p).join("");
  function waitingAnimations() {
    const out = [];
    const seen = new Set();
    const consider = (r, names) => splitTop(r.selectorText).forEach((sel) => {
      if (/:(hover|active|focus|focus-visible|focus-within|checked|target)(?![\w-])/.test(sel)) return;
      const plain = sel.replace(/::?(before|after|marker|placeholder|selection|backdrop)(?![\w-])/g, "");
      if (allOf(plain).length) return;
      const { parts, joins } = compoundsOf(plain);
      for (let c = parts.length - 1; c >= 0; c--) {
        for (const m of parts[c].matchAll(/\.((?:\\.|[\w-])+)/g)) {
          const relaxedPart = parts[c].replace(m[0], "");
          if (!relaxedPart) continue;
          const relaxed = parts.slice();
          relaxed[c] = relaxedPart;
          const animated = allOf(joinCompounds(relaxed, joins, relaxed.length - 1)).filter((e) => !isUi(e));
          if (!animated.length) continue;
          const holder = joinCompounds(relaxed, joins, c);
          const cls = m[1].replace(/\\(.)/g, "$1");
          const id = names.join(", ") + "|" + cls + "|" + holder;
          if (!seen.has(id)) {
            seen.add(id);
            out.push({ names, cls, on: allOf(holder).filter((e) => !isUi(e)), animated });
          }
          return;
        }
      }
    });
    const walk = (rules) => {
      for (const r of rules) {
        if (r instanceof CSSStyleRule) {
          const names = splitTop(r.style.getPropertyValue("animation-name")).filter((n) => n && n !== "none");
          if (names.length) consider(r, names);
        } else if (r.cssRules && !(r instanceof CSSKeyframesRule)) walk(r.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode && /^finetune-/.test(sheet.ownerNode.id || "")) continue;
      try {
        walk(sheet.cssRules);
      } catch (e) {
        // Another origin's sheet can't be read.
      }
    }
    return out;
  }

  function makeInspector() {
    // Shown on load, like Figma's panel.
    const root = el("div", "ft-inspector");

    // Undo and redo the latest change, as in Figma (also ⌘Z and ⌘⇧Z); Reset goes back to the code. They sit
    // at the left of the panel's top row; Hide UI is at its right.
    const undoBtn = iconButton(ICON.undo, "Undo", undo);
    const redoBtn = iconButton(ICON.redo, "Redo", redo);
    undoBtn.setAttribute("data-ft-tip-key", KEYS.mod + "Z");
    redoBtn.setAttribute("data-ft-tip-key", KEYS.shift + KEYS.mod + "Z");
    const actions = el("div", "ft-actions");
    // Reset is off with nothing to reset: no edit on the page and nothing Save stored.
    const resetBtn = iconButton(ICON.refresh, "Reset to the code's last presets", resetEdits);
    actions.append(undoBtn, redoBtn, resetBtn);
    const top = el("div", "ft-top");
    top.appendChild(actions);
    // Design and Motion, as Figma's Design and Prototype, in a bar at the bottom of the window. It lives in the
    // panel, so it hides with it.
    const designPane = el("div", "ft-pane");
    const motionPane = el("div", "ft-pane");
    motionPane.hidden = true;
    const modes = el("div", "ft-modes");
    const modeBtns = [["design", "Design", "pencilRuler"], ["motion", "Motion", "play"]].map(([name, label, icon]) => {
      const b = button("ft-modes-btn", null, () => {
        modeBtns.forEach((m) => m.setAttribute("aria-selected", String(m === b)));
        root.setAttribute("data-tab", name);
        menu.close();
        picker.close();
        imagePop.close();
        guidePop.close();
        effectPop.close();
        designPane.hidden = name !== "design";
        motionPane.hidden = name !== "motion";
        document.documentElement.classList.toggle("ft-motion", name === "motion");
        drawMotion();
        applySpeed();
        if (selection) selection.tabChanged();
      });
      b.innerHTML = ICON[icon];
      b.appendChild(el("span", null, label));
      // Figma's ⌥8 and ⌥9 for its Design and Prototype panels.
      b.setAttribute("data-ft-tip", label);
      b.setAttribute("data-ft-tip-key", KEYS.alt + (name === "design" ? "8" : "9"));
      b.setAttribute("data-ft-tip-side", "top");
      withTip(b);
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
      undoBtn.disabled = !history.past.length && !history.timer && !undoReset;
      redoBtn.disabled = !history.future.length;
      resetBtn.disabled = !canReset();
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

    // Styles, as Figma's Layout guide styles (titled "Active layout guides", her name): a popover just left of the
    // panel, with a close, no search. The page's own grid first ("From the page", so a tweak can always go back to it), then hers, under "This page"
    // and "All pages". Hovering a row shows it on the page, a click applies it, leaving the list puts hers back; a
    // saved style's row shows Delete on hover, where Figma's shows Edit style.
    const stylesPop = el("div", "ft-pop ft-styles-pop");
    stylesPop.hidden = true;
    const stylesHead = el("div", "ft-pop-head");
    stylesHead.append(el("span", null, "Active layout guides"), iconButton(ICON.x, "Close", () => closeStyles()));
    const stylesList = el("div", "ft-styles-list");
    stylesPop.append(stylesHead, stylesList);
    root.appendChild(stylesPop);
    let before = null;
    const use = (list) => {
      guides.splice(0, guides.length, ...copyGuides(list));
      drawGuides();
    };
    // A preview isn't an edit: it puts the guides back (null) or shows one, outside the undo history.
    function preview(guide) {
      history.quiet++;
      if (!guide) {
        if (before) use(before);
        before = null;
      } else {
        if (!before) before = copyGuides(guides);
        use([guide]);
      }
      history.quiet--;
    }
    stylesList.addEventListener("pointerleave", () => preview(null));
    function closeStyles() {
      if (stylesPop.hidden) return;
      preview(null);
      stylesPop.hidden = true;
      styleBtn.classList.remove("is-open");
    }
    function styleRow(name, guide, remove) {
      const row = el("div", "ft-style-row");
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      const pick = () => {
        preview(null);
        use([guide]);
        closeStyles();
      };
      row.addEventListener("click", pick);
      row.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        pick();
      });
      row.addEventListener("pointerenter", () => preview(guide));
      row.insertAdjacentHTML("beforeend", ICON.columns);
      row.appendChild(el("span", "ft-style-name", name));
      if (remove) {
        const trash = iconButton(ICON.trash, "Delete style", remove);
        trash.classList.add("ft-style-trash");
        trash.addEventListener("click", (e) => e.stopPropagation());
        row.appendChild(trash);
      }
      return row;
    }
    function drawStyles() {
      const rows = [];
      const own = pageGrid();
      if (own) rows.push(el("div", "ft-styles-heading", "From the page"), styleRow("Page grid · " + styleName(own), own));
      [[STYLES_PAGE, "This page"], [STYLES_ALL, "All pages"]].forEach(([key, heading]) => {
        const list = loadStyles(key);
        if (!list.length) return;
        rows.push(el("div", "ft-styles-heading", heading));
        list.forEach((st, i) => rows.push(styleRow(st.name, st.guide, () => {
          const now = loadStyles(key);
          now.splice(i, 1);
          storeStyles(key, now);
          undoToast("Deleted style", () => {
            const back = loadStyles(key);
            back.splice(i, 0, st);
            storeStyles(key, back);
            if (!stylesPop.hidden) drawStyles();
          });
          preview(null);
          drawStyles();
        })));
      });
      if (!rows.length) rows.push(el("div", "ft-styles-empty", "No saved styles yet"));
      stylesList.replaceChildren(...rows);
    }
    function openStyles() {
      if (!stylesPop.hidden) return closeStyles();
      guidePop.close();
      menu.close();
      closeSave();
      drawStyles();
      stylesPop.hidden = false;
      styleBtn.classList.add("is-open");
      // Just left of the panel, level with the button, kept on screen (as the other popovers).
      const r = styleBtn.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      stylesPop.style.left = Math.max(8, panel.left - 8 - stylesPop.offsetWidth) + "px";
      stylesPop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - stylesPop.offsetHeight - 8)) + "px";
    }
    // Closes on a click anywhere else, or Escape; the button toggles it.
    document.addEventListener("pointerdown", (e) => {
      if (stylesPop.hidden || stylesPop.contains(e.target) || styleBtn.contains(e.target)) return;
      closeStyles();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || stylesPop.hidden || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      closeStyles();
    });
    const styleBtn = iconButton(ICON.guideStyles, "Styles", openStyles);

    // Save as style: two buttons in place, for every page or just this one. Named from its numbers;
    // the same numbers aren't saved twice.
    const savePop = el("div", "ft-pop ft-save-pop");
    savePop.hidden = true;
    const closeSave = () => {
      savePop.hidden = true;
      saveBtn.classList.remove("is-open");
    };
    function saveStyle(key) {
      closeSave();
      const g = guides[0];
      if (!g) return;
      const name = styleName(g);
      const list = loadStyles(key);
      if (list.some((st) => st.name === name)) return toast("Already saved");
      list.push({ name, guide: copyGuides([g])[0] });
      if (!storeStyles(key, list)) return toast("Couldn't save: storage is blocked or full");
      undoToast("Saved style", () => storeStyles(key, loadStyles(key).filter((st) => st.name !== name)));
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
      saveBtn.classList.add("is-open");
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
        actionSeg([["left", "alignLeft", "Align left", KEYS.alt + "A"], ["hcenter", "alignHCenter", "Align horizontal centers", KEYS.alt + "H"], ["right", "alignRight", "Align right", KEYS.alt + "D"]], act),
        actionSeg([["top", "alignTop", "Align top", KEYS.alt + "W"], ["vcenter", "alignVCenter", "Align vertical centers", KEYS.alt + "V"], ["bottom", "alignBottom", "Align bottom", KEYS.alt + "S"]], act),
      );
      return row;
    };
    // A row of one-shot buttons that spring back, each with a Figma-style tooltip.
    function actionSeg(items, act) {
      const seg = el("div", "ft-seg ft-seg-act");
      items.forEach(([how, icon, tip, keys]) => {
        const b = button("ft-seg-btn", null, () => act(how));
        b.innerHTML = ICON[icon];
        b.setAttribute("data-ft-tip", tip);
        b.setAttribute("aria-label", tip);
        if (keys) b.setAttribute("data-ft-tip-key", keys);
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
      // Rows: Count in one column, alone on its row; Type | Width; Margin (or Offset) | Gutter.
      const items = [labeled("Count", guideNum(g, "count", 1, true, onChange)), el("div"), labeled("Type", align.btn), labeled("Width", width)];
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
        eye.setAttribute("aria-pressed", String(!g.visible));
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
      const turns = actionSeg([["rotate", "rotateSquare", "Rotate 90° right"], ["flipH", "flipHorizontal", "Flip horizontal", KEYS.shift + "H"], ["flipV", "flipVertical", "Flip vertical", KEYS.shift + "V"]], (how) => {
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

    // Figma's corner smoothing as CSS, fitted against Figma's own curve (her notes, 2026-09-27): at smoothing s the
    // radius is written R × m and corner-shape superellipse(k); the fields show R. Straight lines in between.
    const SMOOTH = [[0, 1, 1], [0.6, 1.195, 1.32], [0.8, 1.56, 1.75], [1, 2, 2]];
    function smoothMap(x, from, to) {
      for (let i = 1; i < SMOOTH.length; i++) {
        const a = SMOOTH[i - 1];
        const b = SMOOTH[i];
        if (x <= b[from] || i === SMOOTH.length - 1) return a[to] + clamp01((x - a[from]) / (b[from] - a[from])) * (b[to] - a[to]);
      }
      return SMOOTH[0][to];
    }
    const CORNERS = [["top-left", "cornerTL", "Top left"], ["top-right", "cornerTR", "Top right"], ["bottom-left", "cornerBL", "Bottom left"], ["bottom-right", "cornerBR", "Bottom right"]];

    // Figma's inline slider in a number field: drag it to set the value between min and max(); draw() follows it.
    function slideIn(f, min, max, get, set) {
      f.wrap.classList.add("ft-slider-field");
      const box = el("div", "ft-slide-box");
      const line = el("div", "ft-slide");
      line.append(el("div", "ft-slide-fill"), el("div", "ft-slide-knob"));
      box.appendChild(line);
      f.wrap.appendChild(box);
      dragArea(box, 10, (x) => {
        set(Math.round(min + x * (max() - min)));
        changed(false);
      });
      return () => {
        const m = max();
        line.style.setProperty("--ft-x", clamp01((get() - min) / ((m - min) || 1)));
      };
    }

    // Figma's Corner smoothing popover: a slider from 0 to 100% with iOS's 60% marked, and the % field.
    const smoothPop = (() => {
      let get = null;
      let set = null;
      let anchor = null;
      const pop = el("div", "ft-pop");
      pop.hidden = true;
      const head = el("div", "ft-pop-head");
      head.append(el("span", null, "Corner smoothing"), iconButton(ICON.x, "Close", close));
      const box = el("div", "ft-slide-box");
      const line = el("div", "ft-slide");
      line.append(el("div", "ft-slide-fill"), el("div", "ft-slide-mark"), el("div", "ft-slide-note", "iOS"), el("div", "ft-slide-knob"));
      box.appendChild(line);
      const field = numField(null);
      const row = el("div", "ft-smooth-row");
      row.append(box, field.wrap);
      const body = el("div", "ft-pop-body");
      body.appendChild(row);
      pop.append(head, body);
      root.appendChild(pop);
      const draw = (force) => {
        const s = get();
        line.style.setProperty("--ft-x", s);
        field.set(Math.round(s * 100) + "%", force);
      };
      dragArea(box, 8, (x) => {
        set(Math.round(x * 100) / 100);
        draw();
      });
      editable(field.input, (force) => draw(force), (v) => {
        const n = parseFloat(v);
        if (isNum(n)) set(Math.min(100, Math.max(0, n)) / 100);
      });
      function open(btn, rowEl, g, s) {
        get = g;
        set = (v) => {
          s(v);
          changed(false);
        };
        anchor = btn;
        btn.classList.add("is-open");
        pop.hidden = false;
        draw(true);
        // Just left of the panel, level with the row, kept on screen.
        const r = rowEl.getBoundingClientRect();
        const panel = root.getBoundingClientRect();
        pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
        pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
      }
      function close() {
        if (!anchor) return;
        if (pop.contains(document.activeElement)) document.activeElement.blur();
        anchor.classList.remove("is-open");
        pop.hidden = true;
        anchor = get = set = null;
      }
      document.addEventListener("pointerdown", (e) => {
        if (!anchor || pop.contains(e.target) || anchor.contains(e.target)) return;
        close();
      }, true);
      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || !anchor || e.defaultPrevented || typing(e.target)) return;
        e.preventDefault();
        close();
      });
      return {
        close,
        toggle(btn, rowEl, g, s) {
          if (anchor === btn) close();
          else {
            close();
            open(btn, rowEl, g, s);
          }
        },
      };
    })();

    // Appearance, as Figma's: Opacity (the number and a slider, the eye at its end), Corner radius (the number and a
    // slider; the button at its end opens each corner, then Corner smoothing), and Blend mode. Adjustments sit in its
    // header.
    function appearance(target) {
      const s = section("Appearance");
      // Inside an SVG only a rect has corners (its rx and ry, one radius), in its own units.
      const rect = inSvg(target) && target.tagName.toLowerCase() === "rect";
      const corners = (!inSvg(target) && !isSvgRoot(target)) || rect;
      const hidden = () => getComputedStyle(target).visibility === "hidden";
      const opacityOf = () => Math.round(parseFloat(getComputedStyle(target).opacity) * 100);
      // Smoothing, read back from corner-shape; the four radii as she typed them (the code's ÷ m).
      const smoothing = () => {
        const v = getComputedStyle(target).getPropertyValue("corner-shape").trim();
        const m = /superellipse\(([\d.]+)\)/.exec(v);
        return clamp01(smoothMap(v === "squircle" ? 2 : m ? parseFloat(m[1]) : 1, 2, 0));
      };
      const radii = () => {
        if (rect) {
          const cs = getComputedStyle(target);
          const r = Math.round((parseFloat(cs.rx) || parseFloat(cs.ry) || 0) * vectorSize(target).sx * 10) / 10;
          return [r, r, r, r];
        }
        const cs = getComputedStyle(target);
        const m = smoothMap(smoothing(), 0, 1);
        return CORNERS.map(([c]) => Math.round(((parseFloat(cs.getPropertyValue("border-" + c + "-radius")) || 0) / m) * 10) / 10);
      };
      // Writes the four radii and the smoothing as the code would: one border-radius when they match, else each
      // corner's; each radius × m, and corner-shape superellipse(k) (none at 0%).
      function writeCorners(rs, sm) {
        if (rect) {
          const u = round1(rs[0] / vectorSize(target).sx) + "px";
          setStyle(target, "rx", u);
          setStyle(target, "ry", u);
          return;
        }
        const m = smoothMap(sm, 0, 1);
        const px = rs.map((r) => round1(Math.max(0, r) * m) + "px");
        if (px.every((x) => x === px[0])) {
          CORNERS.forEach(([c]) => setStyle(target, "border-" + c + "-radius", ""));
          setStyle(target, "border-radius", px[0]);
        } else {
          setStyle(target, "border-radius", "");
          CORNERS.forEach(([c], i) => setStyle(target, "border-" + c + "-radius", px[i]));
        }
        const shape = sm > 0.005 ? "superellipse(" + +smoothMap(sm, 0, 2).toFixed(2) + ")" : "";
        // Chrome reads round back as superellipse(1).
        setStyle(target, "corner-shape", shape || (/^(round|superellipse\(1\)|)$/.test(ownValue(target, "corner-shape")) ? "" : "round"));
      }

      const blend = dropdown((btn) => {
        // In Figma's groups, a line between them: normal, darken, lighten, contrast, difference, color.
        const breaks = ["darken", "lighten", "overlay", "difference", "hue"];
        menu.toggle(btn, BLENDS.flatMap(([value, label]) => (breaks.includes(value) ? [{ divider: true }] : []).concat({ label, value })), getComputedStyle(target).mixBlendMode, (v) => {
          setStyle(target, "mix-blend-mode", v === "normal" ? "" : v);
          changed(true);
        });
      });
      const blendIcon = el("span", "ft-dd-icon");
      blendIcon.innerHTML = ICON.drop;
      blend.btn.prepend(blendIcon);
      // Adjustments, the image's seven sliders, on any layer but text: a box's apply to the whole element, an
      // image's open its image popover (where Figma keeps them).
      if (!hasText(target)) {
        const actions = el("div", "ft-head-actions");
        const adjustBtn = iconButton(ICON.slidersHorizontal, "Adjustments", () => imagePop.toggle(target, s, adjustBtn));
        actions.appendChild(adjustBtn);
        s.firstChild.appendChild(actions);
      }

      const eye = iconButton(ICON.eye, "Hide", () => {
        toggleHidden(target);
        changed(true);
      });
      eye.setAttribute("data-ft-tip-key", KEYS.shift + KEYS.mod + "H");
      const opacity = numField(ICON.checkerboard, "Opacity");
      opacity.wrap.querySelector(".ft-field-icon").setAttribute("data-ft-tip-key", "1–0");
      editable(opacity.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) setOpacity(target, n);
      });
      const drawOpacity = slideIn(opacity, 0, () => 100, opacityOf, (n) => setOpacity(target, n));
      const opacityRow = el("div", "ft-with-action");
      opacityRow.append(opacity.wrap, eye);
      const grid = el("div", "ft-type");
      grid.appendChild(labeled("Opacity", opacityRow, true));

      let split = false;
      const draws2 = [];
      if (corners) {
        const radius = numField(ICON.frameCorners, "Corner radius");
        const all = (n) => writeCorners([n, n, n, n], smoothing());
        editable(radius.input, changed, (v) => {
          const n = parseFloat(v);
          if (isNum(n) && n >= 0) all(n);
        });
        const shortSide = () => {
          const sz = sizeOf(target);
          return Math.max(1, Math.round(Math.min(sz.w, sz.h) / 2));
        };
        const drawRadius = slideIn(radius, 0, shortSide, () => Math.max(...radii()), all);
        const radiusRow = el("div", "ft-with-action");
        radiusRow.appendChild(radius.wrap);
        // Each corner, then Corner smoothing: open when the corners differ, as Figma opens them.
        const each = el("div", "ft-span2 ft-corners");
        if (!rect) {
          split = new Set(radii()).size > 1;
          const toggle = iconButton(ICON.frameCorners, "Independent corners", () => {
            split = !split;
            each.hidden = !split;
            toggle.setAttribute("aria-pressed", String(split));
          });
          toggle.setAttribute("aria-pressed", String(split));
          radiusRow.appendChild(toggle);
          const fields = CORNERS.map(([c, icon, tip], i) => {
            const f = numField(ICON[icon], tip);
            editable(f.input, changed, (v) => {
              const n = parseFloat(v);
              if (!isNum(n) || n < 0) return;
              const rs = radii();
              rs[i] = n;
              writeCorners(rs, smoothing());
            });
            draws2.push((force) => f.set(radii()[i], force));
            return f;
          });
          const top = el("div", "ft-with-action");
          const topPair = el("div", "ft-type-pair");
          topPair.append(fields[0].wrap, fields[1].wrap);
          top.append(topPair, el("span", "ft-action-gap"));
          const bottom = el("div", "ft-with-action");
          const bottomPair = el("div", "ft-type-pair");
          bottomPair.append(fields[2].wrap, fields[3].wrap);
          const smooth = iconButton(ICON.sliders, "Corner smoothing", () => smoothPop.toggle(smooth, bottom, smoothing, (v) => writeCorners(radii(), v)));
          bottom.append(bottomPair, smooth);
          each.append(top, bottom);
          each.hidden = !split;
        } else radiusRow.appendChild(el("span", "ft-action-gap"));
        grid.appendChild(labeled("Corner radius", radiusRow, true));
        if (!rect) grid.appendChild(each);
        draws2.push((force) => {
          const rs = radii();
          radius.set(rs.every((r) => r === rs[0]) ? rs[0] : "Mixed", force);
          drawRadius();
        });
      }
      grid.appendChild(labeled("Blend mode", blend.btn, true));
      s.appendChild(grid);
      draws.push((force) => {
        const off = hidden();
        eye.innerHTML = off ? ICON.eyeClosed : ICON.eye;
        eye.setAttribute("data-ft-tip", off ? "Show" : "Hide");
        eye.setAttribute("aria-label", off ? "Show" : "Hide");
        // A hidden layer's eye stays highlighted, as any toggle that's on.
        eye.setAttribute("aria-pressed", String(off));
        opacity.set(opacityOf() + "%", force);
        drawOpacity();
        const mode = getComputedStyle(target).mixBlendMode;
        blend.label.textContent = (BLENDS.find(([v]) => v === mode) || [mode, mode])[1];
        draws2.forEach((d) => d(force));
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
        eye.setAttribute("aria-pressed", String(hidden));
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
        eye.setAttribute("aria-pressed", String(!fx.visible));
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
      const lock = iconButton(ICON.lockRatio, "Constrain proportions", () => {
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
      // grid, which isn't made here. Spacing is the gap on a flex or grid (a grid's two gaps side by side, across
      // then down); on anything else, when the children sit in one column or row, it moves the ones after the first,
      // so the ones below move too.
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
        if (flow === "grid") return { grid: true, x: px(cs.columnGap), y: px(cs.rowGap) };
        const st = stackOf(items());
        if (!st) return null;
        return { stack: st, axis: st.axis, n: st.gaps.every((g) => Math.abs(g - st.gaps[0]) < 0.5) ? Math.round(st.gaps[0]) : null };
      };
      let flow = null;
      let spacing = null;
      let spacingY = null;
      if (container) {
        const now = flowOf();
        const opts = [["free", "flowFree", "Freeform"], ["vertical", "flowVertical", "Vertical layout"], ["horizontal", "flowHorizontal", "Horizontal layout"]];
        if (now === "grid") opts.push(["grid", "flowGrid", "Grid"]);
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
        if (g && g.grid) {
          spacing = numField(ICON.arrowsHorizontal, "Horizontal spacing");
          spacingY = numField(ICON.arrowsVertical, "Vertical spacing");
          [[spacing, "column-gap"], [spacingY, "row-gap"]].forEach(([f, css]) => editable(f.input, changed, (v) => {
            const n = parseFloat(v);
            if (isNum(n)) setStyle(target, css, Math.max(0, n) + "px");
          }));
        } else if (g) {
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
      // Clip content, as Figma's frames have it, on a container: its overflow, hidden (clipped) or visible. Checking
      // writes hidden, unchecking visible; landing back on what the code says takes the edit off.
      let clip = null;
      const clipped = () => {
        const cs = getComputedStyle(target);
        return cs.overflowX !== "visible" || cs.overflowY !== "visible";
      };
      if (container) {
        const box = el("span", "ft-check");
        clip = button("ft-check-row ft-span2", null, () => {
          const next = clipped() ? "visible" : "hidden";
          setStyle(target, "overflow", ownValue(target, "overflow", "overflow-x") === next ? "" : next);
          changed(true);
        });
        clip.setAttribute("role", "checkbox");
        clip.append(box, el("span", null, "Clip content"));
        draws.push(() => {
          const on = clipped();
          clip.setAttribute("aria-checked", String(on));
          box.innerHTML = on ? ICON.tick : "";
        });
      }
      if (spacingY) {
        const gaps = el("div", "ft-type-pair");
        gaps.append(spacing.wrap, spacingY.wrap);
        grid.appendChild(labeled("Spacing", gaps, true));
      } else if (spacing) grid.appendChild(labeled("Spacing", spacing.wrap));
      // Clip content ends the section, as in Figma.
      if (clip) grid.appendChild(clip);
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
          if (g && g.grid) {
            spacing.set(Math.round(g.x), force);
            spacingY.set(Math.round(g.y), force);
          } else spacing.set(!g ? "" : g.n == null ? "Mixed" : Math.round(g.n), force);
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
      const comp = document.documentElement.classList.contains("ft-motion") ? "" : componentOf(t);
      if (comp) return componentLine(t, comp);
      const tag = t.tagName.toLowerCase();
      const kind = hasText(t) ? "Text" : tag === "img" ? "Image" : t instanceof SVGSVGElement ? "SVG"
        : isVector(t) ? (tag === "g" ? "Group" : "Vector") : t.children.length ? "Group" : "Box";
      const row = el("div", "ft-kind");
      row.append(el("span", "ft-kind-name", kind), el("span", "ft-kind-el", tag + (t.id ? "#" + t.id : t.classList.length ? "." + t.classList[0] : "")));
      if (kind === "Group") row.appendChild(itemCount(Array.from(t.children).filter((c) => !isUi(c)).length));
      return row;
    }

    // A component, as Figma's instance: its name, what an edit reaches, and Override, which makes this one's edits
    // its own (Figma's override) instead of every instance's. Pressed again, edits reach every instance again.
    function componentLine(t, name) {
      const sel = selectorFor(t);
      const on = edits.overrides.includes(sel);
      const row = el("div", "ft-kind ft-kind-comp");
      const override = button("ft-choice ft-choice-icon ft-add-anim ft-override", null, () => {
        const i = edits.overrides.indexOf(sel);
        if (i < 0) edits.overrides.push(sel);
        else edits.overrides.splice(i, 1);
        noteChange();
        showInPanel(shown, shownKind);
      });
      override.setAttribute("aria-pressed", String(on));
      const mark = el("span");
      mark.innerHTML = ICON.instance;
      override.append(mark, el("span", null, "Override"));
      row.append(el("span", "ft-kind-name", name), el("span", "ft-kind-el", on ? "Editing only this " + name + "." : "Editing every " + name + "."), override);
      return row;
    }

    // How many items a group holds, on the right of its kind line, in the kind's own type.
    function itemCount(n) {
      return el("span", "ft-kind-name ft-kind-count", n + (n === 1 ? " item" : " items"));
    }

    // A motion group's line: Group and how many layers run its animation (they aren't one element in the code).
    function motionGroupLine(list) {
      const row = el("div", "ft-kind");
      row.append(el("span", "ft-kind-name", "Group"), el("span", "ft-kind-el", list.length + " layers · " + motionLabel(list[0])));
      return row;
    }

    // The same line for several layers: "Group" for a ⌘G group, "N selected" otherwise. Neither is an element
    // in the code (the bake wraps a group's layers in a new one), so there's no element name (her call).
    function kindLineMany(list, isGroup) {
      const row = el("div", "ft-kind");
      row.appendChild(el("span", "ft-kind-name", isGroup ? "Group" : list.length + " selected"));
      if (isGroup) row.appendChild(itemCount(list.length));
      return row;
    }

    // Motion, as Figma's Prototype tab, true to the code: for one layer its Animation; with nothing selected, the
    // page's Animations. Several layers show their kind line only: motion is set one layer at a time. Drawn while
    // the tab shows.
    const motionChosen = el("div", "ft-chosen");
    let shown = null;
    let shownKind = null;
    function drawMotion() {
      motionChosen.textContent = "";
      animsSec.hidden = !!shown;
      waitSec.hidden = true;
      speedSec.hidden = true;
      applySpeed();
      if (motionPane.hidden) return;
      const t = shown;
      if (!t) return drawPageAnims();
      const layers = Array.isArray(t) ? t : [t];
      // Layers that run the same animations (or none yet: a ⌘G group, or one picked to add one to) are tuned as one
      // unit; several that run different ones show their kind line only.
      const key = motionKey(layers[0]);
      if (layers.length > 1 && !layers.every((e) => motionKey(e) === key)) return motionChosen.appendChild(kindLineMany(layers, shownKind === "group"));
      // The kind line first, then Playback speed (while there's an animation to watch), then Animation.
      motionChosen.appendChild(layers.length === 1 ? kindLine(layers[0]) : key ? motionGroupLine(layers) : kindLineMany(layers, shownKind === "group"));
      speedSec.hidden = !key;
      motionChosen.append(speedSec, animationSection(layers));
    }

    // A time in ms, as Figma shows it; "0.3s" and "300ms" both type in.
    function msField(get, set, icon, tip) {
      const f = numField(icon || null, tip);
      // A group whose layers differ reads Mixed.
      const show = (force) => {
        const v = get();
        f.set(isNum(v) ? Math.round(v) + "ms" : "Mixed", force);
      };
      editable(f.input, show, (v) => {
        const n = toMs(v);
        if (isNum(n) && n >= 0) set(Math.round(n));
      });
      show(true);
      return f.wrap;
    }

    const PLAYBACKS = [["normal", "Normal"], ["reverse", "Reverse"], ["alternate", "Alternate"], ["alternate-reverse", "Alternate reverse"]];
    const FILLS = [["none", "None"], ["forwards", "Forwards"], ["backwards", "Backwards"], ["both", "Both"]];
    const MOVES = [["left", "arrowLeft", "Left"], ["right", "arrowRight", "Right"], ["down", "arrowDown", "Down"], ["up", "arrowUp", "Up"]];
    const labelOf = (opts, v) => (opts.find(([x]) => x === v) || [v, v])[1];

    // One animation's settings, in the panel under its row, laid out as Figma's Interaction popover: which
    // @keyframes play; what they do, only where it applies (Direction and Distance when they move, Scale, Rotation,
    // Opacity when they scale, turn or fade); its easing (with the curve editor for a custom curve), duration and
    // delay (and a group's stagger); its iterations, playback and fill mode. The layers themselves are the preview:
    // every edit replays them. Timing edits are the layers' animation-* properties; what the keyframes do is written
    // into the page's @keyframes, so every layer using them follows, as the code would.
    function animSettings(a) {
      let custom = false;
      const body = el("div", "ft-anim-settings");
      const label = (text) => el("span", "ft-anim-label", text);
      const group = (...kids) => {
        const g = el("div", "ft-anim-group");
        g.append(...kids);
        return g;
      };
      // Keyframe edits change the page; then the fields redraw and the layers play again, so the change shows.
      const after = () => {
        changed(false);
        a.replay();
        build();
      };
    // A value the layers of a group don't share reads Mixed; picking one sets it on them all.
      const pick = (p, opts) => {
        const d = dropdown((btn) => menu.toggle(btn, opts.map(([value, l]) => ({ label: l, value })), a.get(p), (v) => {
          a.put(p, v);
          build();
        }));
        d.label.textContent = a.get(p) == null ? "Mixed" : labelOf(opts, a.get(p));
        return d.btn;
      };
      // A number field that commits a parsed value; show gives what it reads.
      const num = (icon, tip, show, commit) => {
        const f = numField(icon, tip);
        editable(f.input, (force) => f.set(show(), force), (v) => {
          const n = parseFloat(v);
          if (isNum(n)) commit(n, String(v));
        });
        f.set(show(), true);
        return f.wrap;
      };

      function build() {
        const name = a.first("animation-name");
        // A CSS animation can play other @keyframes of the page's; a JavaScript one's keyframes are in its call,
        // so its name is a label.
        let which = null;
        if (a.swap) {
          which = dropdown((btn) => menu.toggle(btn, keyframeChoices(), name, (v) => {
            a.put("animation-name", keyframesFrom(v));
            build();
          }));
        } else {
          which = { btn: el("div", "ft-dd ft-dd-static"), label: el("span", "ft-dd-label") };
          which.btn.appendChild(which.label);
        }
        which.label.textContent = name;
        const what = [label("Keyframes"), which.btn];
        const info = a.info();
        if (info && info.direction) {
          const dir = segmented(MOVES, (v) => {
            if (v !== info.direction) turnMoves(info, v);
            after();
          });
          dir.set(info.direction);
          what.push(label("Direction"), dir.seg, label("Distance"), num(ICON.ruler, "Distance",
            () => lengthText(info.distance), (n) => {
              if (n >= 0) scaleMoves(info, n);
              after();
            }));
        }
        if (info && info.scale) {
          what.push(label("Scale"), num(null, null, () => +info.scale.value.toFixed(3), (n) => {
            info.scale.frames.forEach((f) => writePart(f, "scale", n));
            after();
          }));
        }
        if (info && info.rotate) {
          what.push(label("Rotation"), num(ICON.angle, "Rotation", () => +info.rotate.value.toFixed(1) + "°", (n) => {
            info.rotate.frames.forEach((f) => writePart(f, "rotate", n));
            after();
          }));
        }
        if (info && info.opacity) {
          what.push(label("Opacity"), num(ICON.checkerboard, "Opacity", () => Math.round(info.opacity.value * 100) + "%", (n) => {
            info.opacity.frames.forEach((f) => writePart(f, "opacity", Math.min(100, Math.max(0, n)) / 100));
            after();
          }));
        }

        // Easing: Figma's presets and Custom bezier, the curve in front of the name. A custom curve shows its
        // editor; dragging it redraws the name, the curve and the preview, not the whole popover.
        const ease = a.get("animation-timing-function") || a.first("animation-timing-function");
        const easeDd = dropdown((btn) => menu.toggle(btn, EASINGS.map(([v, l]) => ({ label: l, value: v })).concat([{ label: "Custom bezier", value: "custom" }]),
          easeName(ease) === "Custom" ? "custom" : (EASINGS.find(([e]) => sameEase(e, ease)) || [])[0], (v) => {
            custom = v === "custom";
            const b = bezierOf(ease) || KEYWORD_BEZIER.ease;
            a.put("animation-timing-function", custom ? "cubic-bezier(" + b.join(", ") + ")" : v);
            build();
          }));
        const glyph = el("span", "ft-dd-icon");
        easeDd.btn.prepend(glyph);
        const drawEase = (v, mixed) => {
          glyph.innerHTML = curveGlyph(v);
          easeDd.label.textContent = mixed ? "Mixed" : custom ? "Custom" : easeName(v);
        };
        drawEase(ease, a.get("animation-timing-function") == null);
        const curve = curveEditor((v) => {
          a.put("animation-timing-function", v);
          drawEase(v);
        });
        curve.el.classList.add("ft-span2");
        curve.set(ease);
        if (!(custom || easeName(ease) === "Custom")) curve.el.style.display = "none";
        const timing = [label("Easing"), easeDd.btn, curve.el,
          label("Duration"), msField(() => toMs(a.get("animation-duration")), (n) => { a.put("animation-duration", n + "ms"); build(); }, ICON.timer, "Duration")];
        // One layer has its Delay. A group has when it starts (its first layer's delay; typing shifts them all) and
        // its Stagger, the step from one layer to the next in the order they start (typing spaces them evenly;
        // Mixed when the code's steps aren't even).
        const delays = a.delays();
        if (delays.length < 2) {
          timing.push(label("Delay"), msField(() => a.delays()[0], (n) => { a.setDelays([n]); build(); }, ICON.hourglass, "Delay"));
        } else {
          const step = () => {
            const ds = a.delays();
            const steps = ds.slice(1).map((d, k) => d - ds[k]);
            return steps.every((x) => Math.abs(x - steps[0]) < 0.5) ? steps[0] : NaN;
          };
          timing.push(
            label("Delay"), msField(() => a.delays()[0], (n) => {
              const ds = a.delays();
              a.setDelays(ds.map((d) => Math.max(0, d + n - ds[0])));
              build();
            }, ICON.hourglass, "Delay"),
            label("Stagger"), msField(step, (n) => {
              const ds = a.delays();
              a.setDelays(ds.map((d, k) => ds[0] + k * n));
              build();
            }, ICON.arrowsHorizontal, "Stagger")
          );
        }

        // Iterations: a number, or ∞ ("infinite" types in too).
        const iter = numField(ICON.repeat, "Iterations");
        const showIter = (force) => {
          const v = a.get("animation-iteration-count");
          iter.set(v == null ? "Mixed" : v === "infinite" ? "∞" : v, force);
        };
        editable(iter.input, showIter, (v) => {
          const typed = String(v).trim().toLowerCase();
          const n = parseFloat(typed);
          if (typed === "∞" || typed === "infinite") a.put("animation-iteration-count", "infinite");
          else if (isNum(n) && n >= 0) a.put("animation-iteration-count", String(n));
          else return;
          build();
        });
        showIter(true);
        const runs = [label("Iterations"), iter.wrap, label("Playback"), pick("animation-direction", PLAYBACKS), label("Fill mode"), pick("animation-fill-mode", FILLS)];
        body.replaceChildren(group(...what), group(...timing), group(...runs));
      }

      build();
      return body;
    }

    // Animation: the keyframe animations (CSS animation) of one layer, or of a group of layers that run the same
    // ones (as the code has them: "the intro rises in" over three lines is one group), one row each, as Figma lists
    // a layer's interactions: its @keyframes name and duration. A row opens its settings under it (animSettings),
    // one at a time, and closes them again; with one animation they start open. An edit goes to
    // every layer of the group. Play, Pause and Replay in the header drive the page's animations only (a group's
    // together, so its stagger plays); they're not edits.
    // The animations to pick from: the page's own @keyframes first, then, under a line, Figma's generic ones.
    function keyframeChoices() {
      const own = Array.from(pageKeyframes().keys()).filter((n) => !edits.newKeyframes[n]).map((n) => ({ label: n, value: n }));
      // Headed as she named them: the page's own under "Your tokens", the generic ones under "Presets".
      const presets = [{ heading: true, label: "Presets" }].concat(PRESETS.map(([id, label]) => ({ label, value: "preset:" + id })));
      return own.length ? [{ heading: true, label: "Your tokens" }].concat(own, [{ divider: true }], presets) : presets;
    }
    // A pick's @keyframes name: the page's own, or a generic one added to the page for it.
    const keyframesFrom = (v) => (String(v).slice(0, 7) === "preset:" ? addPreset(v.slice(7)) : v);
    // Adds a CSS animation to the layers (a group's all at once, so they move as one unit) with Figma's default
    // timing, ease out over 300ms, filling both ends so it holds its start and its end. Each layer's animation-*
    // lists get one more entry, after any it runs.
    function addAnimation(layers, choice) {
      const name = keyframesFrom(choice);
      const ADD = [["animation-name", name], ["animation-duration", "300ms"], ["animation-timing-function", "ease-out"], ["animation-delay", "0ms"],
        ["animation-iteration-count", "1"], ["animation-direction", "normal"], ["animation-fill-mode", "both"]];
      layers.forEach((t) => {
        const cs = getComputedStyle(t);
        const names = splitTop(cs.animationName);
        const has = names.some((n) => n !== "none");
        const lists = ADD.map(([p, v]) => {
          if (!has) return [p, v];
          const cur = splitTop(cs.getPropertyValue(p));
          return [p, names.map((n, j) => cur[j % cur.length]).concat(v).join(", ")];
        });
        lists.forEach(([p, v]) => setStyle(t, p, v));
      });
      motionGroups(true);
      showInPanel(shown, shownKind);
    }

    function animationSection(layers) {
      const names = splitTop(getComputedStyle(layers[0]).animationName);
      const css = names.some((n) => n !== "none");
      // The JavaScript animations every layer of the group runs.
      const js = waapiOf(layers[0]).filter((en) => layers.every((t) => en.targets.has(t)));
      const s = section("Animation");
      // Nothing yet: one button to add a CSS animation, picked from the page's own and Figma's generic ones.
      if (!css && !js.length) {
        const add = button("ft-choice ft-choice-icon ft-add-anim", null, () => menu.toggle(add, keyframeChoices(), null, (v) => addAnimation(layers, v)));
        const plus = el("span");
        plus.innerHTML = ICON.plus;
        add.append(plus, el("span", null, "Add CSS animation"));
        s.appendChild(add);
        return s;
      }
      const jsAnims = () => js.flatMap((en) => layers.map((t) => en.targets.get(t)).filter(Boolean).map((tg) => tg.anim));
      const anims = () => layers.flatMap((t) => t.getAnimations().filter((x) => x.animationName)).concat(jsAnims());
      // Plays the animations again from the start, together, so a group's stagger plays. A CSS one-shot that has
      // finished is no longer in getAnimations(), so each layer's name is switched off, then all are put back at
      // once (each inline value goes back as it was, so nothing is edited); a JavaScript one plays its own again.
      function restart() {
        if (css) {
          const was = layers.map((t) => t.style.getPropertyValue("animation-name"));
          layers.forEach((t) => t.style.setProperty("animation-name", "none"));
          void document.documentElement.offsetWidth;
          layers.forEach((t, k) => {
            if (was[k]) t.style.setProperty("animation-name", was[k]);
            else t.style.removeProperty("animation-name");
          });
        }
        jsAnims().forEach((x) => {
          x.cancel();
          x.play();
        });
        // A restarted CSS animation is a new one, at 1×: it takes the playback speed again.
        applySpeed();
        drawPlay();
      }
      // An edit replays the animation, so a one-shot that already ran shows the change; a burst of edits (a
      // curve being dragged) replays once it settles.
      let soon = 0;
      const replaySoon = () => {
        clearTimeout(soon);
        soon = setTimeout(restart, 250);
      };
      // Play resumes a paused animation, or plays a finished one again.
      const playBtn = iconButton(ICON.pause, "Pause", () => {
        const as = anims();
        const running = as.some((x) => x.playState === "running");
        if (running) as.forEach((x) => x.pause());
        else if (as.some((x) => x.playState === "paused")) as.forEach((x) => x.play());
        else restart();
        drawPlay();
      });
      function drawPlay() {
        const running = anims().some((x) => x.playState === "running");
        const tip = running ? "Pause" : "Play";
        playBtn.innerHTML = running ? ICON.pause : ICON.play;
        playBtn.setAttribute("data-ft-tip", tip);
        playBtn.setAttribute("aria-label", tip);
      }
      const replayBtn = iconButton(ICON.replay, "Replay", restart);
      const actions = el("div", "ft-head-actions");
      actions.append(playBtn, replayBtn);
      s.firstChild.appendChild(actions);
      const list = el("div", "ft-anim-rows");
      // One row per animation, as Figma lists a layer's interactions: its name and duration. A row opens its
      // settings under it, one at a time, and closes them again. adapter() makes what animSettings reads.
      function addRow(draw, adapter) {
        const name = el("span", "ft-anim-name");
        const meta = el("span", "ft-anim-meta");
        let open = null;
        const row = button("ft-anim-row", null, () => {
          const was = open;
          list.querySelectorAll(".ft-anim-settings").forEach((x) => x.remove());
          list.querySelectorAll(".ft-anim-row").forEach((x) => x.setAttribute("aria-pressed", "false"));
          open = null;
          if (was) return;
          row.setAttribute("aria-pressed", "true");
          open = animSettings(adapter(() => {
            changed(false);
            draw(name, meta);
            replaySoon();
          }));
          row.after(open);
        });
        row.append(name, meta);
        draw(name, meta);
        list.appendChild(row);
      }

      // A CSS animation: one value per animation in each layer's animation-* lists, repeated to the number of names
      // as CSS does. Edits are those longhands; what it does is its @keyframes in the page.
      const listOf = (t, p) => {
        const v = splitTop(getComputedStyle(t).getPropertyValue(p));
        return names.map((n, j) => v[j % v.length]);
      };
      names.forEach((n, i) => {
        if (n === "none") return;
        const valueAt = (t, p) => listOf(t, p)[i];
        // What the group's layers share for p, or null when they differ.
        const agreed = (p) => {
          const vs = layers.map((t) => valueAt(t, p));
          return vs.every((v) => v === vs[0]) ? vs[0] : null;
        };
        // The layers in the order they start: by delay, then by where they sit in the code.
        const order = () => layers.map((t, k) => ({ t, k, d: toMs(valueAt(t, "animation-delay")) || 0 })).sort((x, y) => x.d - y.d || x.k - y.k);
        addRow((name, meta) => {
          name.textContent = valueAt(layers[0], "animation-name");
          const dur = agreed("animation-duration");
          meta.textContent = dur == null ? "Mixed" : Math.round(toMs(dur)) + "ms";
        }, (edited) => ({
          swap: true,
          get: agreed,
          first: (p) => valueAt(layers[0], p),
          put: (p, v) => {
            layers.forEach((t) => {
              const now = listOf(t, p);
              now[i] = v;
              setStyle(t, p, now.join(", "));
            });
            if (p === "animation-name") names[i] = v;
            edited();
          },
          delays: () => order().map((o) => o.d),
          setDelays: (ds) => {
            order().forEach((o, k) => {
              const now = listOf(o.t, "animation-delay");
              now[i] = Math.round(ds[k]) + "ms";
              setStyle(o.t, "animation-delay", now.join(", "));
            });
            edited();
          },
          info: () => keyframesInfo(cssFrames(valueAt(layers[0], "animation-name"))),
          replay: replaySoon,
        }));
      });

      // A JavaScript animation: its timing read off each layer's running copy, written as edits finetune puts on
      // those copies and on every later call; what it does is its keyframes as the call gave them.
      const READ = {
        "animation-duration": (tm) => (isNum(tm.duration) ? tm.duration : 0) + "ms",
        "animation-delay": (tm) => (tm.delay || 0) + "ms",
        "animation-timing-function": (tm) => tm.easing,
        "animation-iteration-count": (tm) => (tm.iterations === Infinity ? "infinite" : String(tm.iterations)),
        "animation-direction": (tm) => tm.direction,
        "animation-fill-mode": (tm) => (tm.fill === "auto" ? "none" : tm.fill),
      };
      const FIELD = {
        "animation-duration": ["duration", toMs], "animation-delay": ["delay", toMs], "animation-timing-function": ["easing", String],
        "animation-iteration-count": ["iterations", (v) => (v === "infinite" ? "infinite" : parseFloat(v))],
        "animation-direction": ["direction", String], "animation-fill-mode": ["fill", String],
      };
      js.forEach((en) => {
        const copies = () => layers.map((t) => ({ t, tg: en.targets.get(t) })).filter((x) => x.tg);
        const valueAt = (x, p) => (p === "animation-name" ? en.label : READ[p](x.tg.anim.effect.getTiming()));
        const agreed = (p) => {
          const vs = copies().map((x) => valueAt(x, p));
          return vs.length && vs.every((v) => v === vs[0]) ? vs[0] : null;
        };
        const order = () => copies().map((x, k) => ({ x, k, d: x.tg.anim.effect.getTiming().delay || 0 })).sort((p, q) => p.d - q.d || p.k - q.k);
        const changedJs = (edited) => {
          applyWaapi(en);
          noteChange();
          edited();
        };
        addRow((name, meta) => {
          name.textContent = en.label;
          const dur = agreed("animation-duration");
          meta.textContent = "JS · " + (dur == null ? "Mixed" : Math.round(toMs(dur)) + "ms");
        }, (edited) => ({
          get: agreed,
          first: (p) => (copies()[0] ? valueAt(copies()[0], p) : null),
          put: (p, v) => {
            if (!FIELD[p]) return;
            waapiEdit(en).timing[FIELD[p][0]] = FIELD[p][1](v);
            changedJs(edited);
          },
          delays: () => order().map((o) => o.d),
          setDelays: (ds) => {
            const ed = waapiEdit(en);
            order().forEach((o, k) => { ed.delays[selectorFor(o.x.t)] = Math.round(ds[k]); });
            changedJs(edited);
          },
          info: () => keyframesInfo(editedFrames(en.frames, edits.waapi[en.key]).map((k, i) => ({
            at: (k.offset || 0) * 100,
            read: (p) => (k[camel(p)] == null ? "" : String(k[camel(p)])),
            write: (p, v) => {
              const ed = waapiEdit(en);
              (ed.frames[i] = ed.frames[i] || {})[camel(p)] = v;
              applyWaapi(en);
              noteChange();
            },
          }))),
          replay: replaySoon,
        }));
      });

      // With one animation there's nothing to choose between: its settings start open.
      const rows = list.querySelectorAll(".ft-anim-row");
      if (rows.length === 1) rows[0].click();
      s.appendChild(list);
      drawPlay();
      // Play and Pause follow the animations as they start and end; the listeners go with the section.
      const follow = () => {
        if (!s.isConnected) {
          layers.forEach((t) => {
            t.removeEventListener("animationstart", follow);
            t.removeEventListener("animationend", follow);
          });
          return;
        }
        drawPlay();
      };
      layers.forEach((t) => {
        t.addEventListener("animationstart", follow);
        t.addEventListener("animationend", follow);
      });
      return s;
    }

    // With nothing selected: every animation on the page as the code has them now (CSS, and JavaScript ones it has
    // seen run), so the ones she described (to Claude Code, say) are easy to find, and under it the CSS ones that
    // haven't started yet. Each row leads with what's animating (the component: its class, or its layers'), then
    // the animation it runs. A click selects it.
    const animsSec = section("Animations");
    const animList = el("div", "ft-anim-rows");
    animsSec.appendChild(animList);
    const waitSec = section("Not started yet");
    const waitList = el("div", "ft-anim-rows");
    waitSec.appendChild(waitList);
    // A layer by its class (the one its group's layers don't all share, so three lines read apart), its id, or tag.
    function layerNames(list) {
      const shared = list.length > 1 ? Array.from(list[0].classList).filter((c) => list.every((e) => e.classList.contains(c))) : [];
      return list.map((e) => {
        const own = Array.from(e.classList).find((c) => !shared.includes(c)) || e.classList[0];
        return e.id ? "#" + e.id : own ? "." + own : e.tagName.toLowerCase();
      }).filter((n, i, all) => all.indexOf(n) === i).join(", ");
    }
    function drawPageAnims() {
      const rows = motionGroups(true).map((g) => {
        const row = button("ft-anim-row", null, () => { if (selection) selection.selectLayers(g); });
        row.append(el("span", "ft-anim-name", layerNames(g)), el("span", "ft-anim-meta", motionLabel(g[0])));
        return row;
      });
      animList.replaceChildren(...rows);
      if (!rows.length) {
        const warn = el("div", "ft-guide-warn");
        warn.innerHTML = ICON.warning;
        warn.appendChild(el("span", null, "No animations running on this page."));
        animList.appendChild(warn);
      }
      // Waiting: Play adds the class that starts it, where the page would, then selects what it animates, ready to
      // tune. That's the page's own state from then on (a reload puts it back); it isn't an edit.
      const waiting = waitingAnimations();
      waitSec.hidden = !waiting.length;
      waitList.replaceChildren(...waiting.map((w) => {
        const row = el("div", "ft-anim-row");
        const play = iconButton(ICON.play, "Play: adds ." + w.cls + " to " + layerNames(w.on) + ", as the page would", () => {
          w.on.forEach((e) => e.classList.add(w.cls));
          requestAnimationFrame(() => { if (selection) selection.selectLayers(w.animated); });
        });
        row.append(el("span", "ft-anim-name", layerNames(w.animated)), el("span", "ft-anim-meta", w.names.join(", ")), play);
        return row;
      }));
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
      shown = target;
      shownKind = kind;
      drawMotion();
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
      // Components after the layers' own edits, so an override taken off falls back to the component's value.
      instanceCache.clear();
      const nextComps = next.components || {};
      new Set(Object.keys(edits.components).concat(Object.keys(nextComps))).forEach((name) => {
        const a = (edits.components[name] || { styles: {} }).styles;
        const b = (nextComps[name] || { styles: {} }).styles;
        instancesOf(name).forEach((t) => {
          const sel = selectorFor(t);
          const own = (next.elements[sel] || { styles: {} }).styles;
          const o = originals[sel] || { styles: {} };
          new Set(Object.keys(a).concat(Object.keys(b))).forEach((prop) => {
            if (own[prop] != null) return;
            const v = prop in b ? b[prop] : o.styles[prop] || "";
            if (v) t.style.setProperty(prop, v);
            else t.style.removeProperty(prop);
          });
        });
      });
      edits.components = nextComps;
      edits.overrides = next.overrides || [];
      edits.groups = next.groups;
      paintNewKeyframes(next.newKeyframes || {});
      edits.newKeyframes = next.newKeyframes || {};
      paintKeyframes(next.keyframes);
      edits.waapi = next.waapi || {};
      waapi.forEach(applyWaapi);
      edits.keyframes = next.keyframes;

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
    // Figma's shortcuts for what finetune does too (same key, same action), shown in their buttons' tooltips: ⌥8 and
    // ⌥9 Design and Motion, ⌥⌘S Save, ⇧⌘E Copy changes, and in Design ⌥A ⌥H ⌥D ⌥W ⌥V ⌥S the alignments, ⇧H and ⇧V the flips, ⇧⌘H
    // show or hide, 1 to 0 opacity (10% to 100%), and the arrows a nudge (Shift for 10). Undo, Redo, ⌘G, ⇧⌘G and ⌘\
    // are handled where those live. None fires while typing in a field or in words being edited.
    function flipLayer(t, across) {
      const cs = getComputedStyle(t);
      const sc = cs.scale === "none" ? [1, 1] : cs.scale.trim().split(/\s+/).map(parseFloat);
      const sx = across ? -sc[0] : sc[0];
      const sy = across ? (sc.length > 1 ? sc[1] : sc[0]) : -(sc.length > 1 ? sc[1] : sc[0]);
      boxed(t);
      turnInPlace(t);
      setStyle(t, "scale", sx === 1 && sy === 1 ? "" : sx + " " + sy);
    }
    const ALIGN_KEYS = { KeyA: "left", KeyH: "hcenter", KeyD: "right", KeyW: "top", KeyV: "vcenter", KeyS: "bottom" };
    document.addEventListener("keydown", (e) => {
      if (root.hidden || e.defaultPrevented || e.repeat && !/^Arrow/.test(e.key) || typing(e.target)) return;
      const mod = MAC ? e.metaKey : e.ctrlKey;
      const only = (m, a, sh) => mod === m && e.altKey === a && e.shiftKey === sh;
      if (only(false, true, false) && (e.code === "Digit8" || e.code === "Digit9")) {
        e.preventDefault();
        return modeBtns[e.code === "Digit8" ? 0 : 1].click();
      }
      if (only(true, true, false) && e.code === "KeyS") {
        e.preventDefault();
        return saveNow();
      }
      // Copy changes on Figma's Export key (⇧⌘C is Chrome's Inspect element).
      if (only(true, false, true) && e.code === "KeyE") {
        e.preventDefault();
        return copyChanges();
      }
      if (root.getAttribute("data-tab") !== "design" || !shown) return;
      const list = Array.isArray(shown) ? shown : [shown];
      const one = Array.isArray(shown) ? null : shown;
      const act = (fn) => {
        e.preventDefault();
        fn();
        changed(true);
      };
      if (only(false, true, false) && ALIGN_KEYS[e.code]) return act(() => (one ? alignToParent(one, ALIGN_KEYS[e.code]) : alignSelection(list, ALIGN_KEYS[e.code])));
      if (one && only(false, false, true) && (e.code === "KeyH" || e.code === "KeyV")) return act(() => flipLayer(one, e.code === "KeyH"));
      if (one && only(true, false, true) && e.code === "KeyH") return act(() => toggleHidden(one));
      if (one && only(false, false, false) && /^Digit\d$/.test(e.code)) return act(() => setOpacity(one, (+e.code.slice(5) || 10) * 10));
      if (!mod && !e.altKey && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) {
        const n = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -n : e.key === "ArrowRight" ? n : 0;
        const dy = e.key === "ArrowUp" ? -n : e.key === "ArrowDown" ? n : 0;
        return act(() => list.filter((t) => !list.some((o) => o !== t && o.contains(t))).forEach((t) => nudge(t, dx, dy)));
      }
    });

    designPane.append(chosen, page, guideSec);
    // Playback speed, for debugging, shown while an animation is selected: its layers play slower (or faster)
    // while she watches them, from 0.25× to 1.5×; the rest of the page stays at 1×. It's only a way of viewing:
    // nothing is edited, saved or copied, and leaving Motion (or the selection) puts them back to 1×. A replay,
    // or an animation the page starts later, takes it too.
    const SPEEDS = [0.25, 0.5, 1, 1.5];
    let speed = 1;
    const speedSec = el("div", "ft-section ft-speed");
    const speedSeg = el("div", "ft-seg");
    const speedBtns = SPEEDS.map((v) => {
      const b = button("ft-seg-btn", v + "×", () => {
        speed = v;
        drawSpeed();
        applySpeed();
      });
      const tip = "Test in " + v + "×";
      b.setAttribute("data-ft-tip", tip);
      b.setAttribute("aria-label", tip);
      withTip(b);
      speedSeg.appendChild(b);
      return b;
    });
    const drawSpeed = () => speedBtns.forEach((b, i) => b.setAttribute("aria-pressed", String(SPEEDS[i] === speed)));
    // Only the animations it slowed go back to 1×, so a page's own playback rates are left alone.
    const sped = new WeakSet();
    function applySpeed() {
      const on = motionPane.hidden || !shown ? [] : Array.isArray(shown) ? shown : [shown];
      const all = new Set(document.getAnimations().filter((x) => !(x instanceof CSSTransition)));
      waapi.forEach((en) => en.targets.forEach((tg) => all.add(tg.anim)));
      all.forEach((x) => {
        if (on.includes(x.effect && x.effect.target)) {
          if (x.playbackRate !== speed) x.playbackRate = speed;
          sped.add(x);
        } else if (sped.has(x)) {
          x.playbackRate = 1;
          sped.delete(x);
        }
      });
    }
    document.addEventListener("animationstart", applySpeed, true);
    afterAnimate = applySpeed;
    const speedLabel = el("div", "ft-speed-label", "Playback speed for debugging only");
    const speedRow = el("div", "ft-labeled");
    speedRow.append(speedLabel, speedSeg);
    speedSec.appendChild(speedRow);
    drawSpeed();
    speedSec.hidden = true;
    motionPane.append(motionChosen, animsSec, waitSec);
    root.append(top, designPane, motionPane, modes);
    // The floating scrollbar: drawn from the panel's scroll, kept in step with its size and its content's.
    const rail = el("div", "ft-scroll-rail");
    const thumb = el("div", "ft-scroll-thumb");
    rail.appendChild(thumb);
    root.prepend(rail);
    function drawThumb() {
      const h = root.clientHeight;
      const sh = root.scrollHeight;
      thumb.hidden = sh <= h + 1;
      if (thumb.hidden) return;
      const track = h - 4;
      const th = Math.max(28, Math.round((track * h) / sh));
      thumb.style.height = th + "px";
      thumb.style.transform = "translateY(" + Math.round(2 + ((track - th) * root.scrollTop) / (sh - h)) + "px)";
    }
    root.addEventListener("scroll", drawThumb, { passive: true });
    const sizes = new ResizeObserver(drawThumb);
    [root, designPane, motionPane].forEach((e) => sizes.observe(e));
    // Dragging the thumb scrolls the panel, as a scrollbar's does.
    thumb.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const y0 = e.clientY;
      const s0 = root.scrollTop;
      const k = (root.scrollHeight - root.clientHeight) / Math.max(1, root.clientHeight - 4 - thumb.offsetHeight);
      thumb.setPointerCapture(e.pointerId);
      const move = (ev) => { root.scrollTop = s0 + (ev.clientY - y0) * k; };
      const up = () => {
        thumb.removeEventListener("pointermove", move);
        thumb.removeEventListener("pointerup", up);
        thumb.removeEventListener("pointercancel", up);
      };
      thumb.addEventListener("pointermove", move);
      thumb.addEventListener("pointerup", up);
      thumb.addEventListener("pointercancel", up);
    });
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
        afterReset();
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
