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
/* The panel's colours: Figma UI3's colour tokens (the UI3 kit's Colors, Light and Dark), named for what they do here.
   html[data-ft-theme] picks the theme: the system's, unless she flips it (⌥⌘T, see setTheme). Two are finetune's
   own (her calls): the panel's container is pen.dev's (#F8F8F8 with a #E3E3E3 border in light), and Motion's accent
   is UI3's pink where Design has its blue. The overlays on the page (selection, marquee, size label) take UI3's
   canvas tokens, which follow the theme as Figma's do. */
:root {
  --ft-i-bg: #F8F8F8;                      /* the container (pen.dev) */
  --ft-i-border: #E3E3E3;                  /* the container's border (pen.dev) */
  --ft-i-surface: #FFFFFF;                 /* bg-default */
  --ft-i-line: #E6E6E6;                    /* border-default */
  --ft-i-field: rgba(0, 0, 0, 0.05);       /* special/bghovertransparent */
  --ft-i-hover: rgba(0, 0, 0, 0.05);       /* special/bghovertransparent */
  --ft-i-press: rgba(0, 0, 0, 0.1);        /* special/bgtransparentsecondary/hover */
  --ft-i-stroke: rgba(0, 0, 0, 0.1);       /* special/bordertranslucent */
  --ft-i-text: rgba(0, 0, 0, 0.9);         /* text-default, icon-default */
  --ft-i-text-2: rgba(0, 0, 0, 0.5);       /* text-secondary */
  --ft-i-text-3: rgba(0, 0, 0, 0.3);       /* text-tertiary */
  --ft-i-inverse: #2C2C2C;                 /* bg/inverse */
  --ft-i-on-inverse: rgba(255, 255, 255, 0.9); /* text/inverse/oninverse */
  --ft-i-scrollbar: rgba(179, 179, 179, 0.5); /* special/scrollbar */
  --ft-i-surface-2: #F5F5F5;               /* bg-secondary */
  --ft-i-disabled: #D9D9D9;                /* bg-disabled */
  --ft-i-on-disabled: #FFFFFF;             /* icon-ondisabled */
  --ft-on-brand: #FFFFFF;                  /* icon-onbrand: white in both themes */
  --ft-blue: #0D99FF;                      /* bg-brand, border-selected, fullscreen/selection/border */
  --ft-blue-soft: #E5F4FF;                 /* bg-selected */
  --ft-blue-text: #007BE5;                 /* icon/selected */
  --ft-pink: #FF24BD;                      /* bg-assistive (pink-500), fullscreen/assistive/bg */
  --ft-pink-soft: #FFE0FC;                 /* bg/assistive/tertiary */
  --ft-pink-text: #EA10AC;                 /* icon/assistive */
  --ft-purple: #9747FF;                    /* bg/component, fullscreen/component/bg */
  --ft-purple-soft: #F1E5FF;               /* bg/component/tertiary */
  --ft-purple-text: #8638E5;               /* text/component */
  --ft-dark: #1E1E1E;                      /* bg-menu, bg-tooltip: dark in both themes */
  --ft-dark-line: #383838;                 /* border-menu */
  --ft-dark-hover: rgba(255, 255, 255, 0.1); /* white/200 */
  --ft-dark-press: rgba(255, 255, 255, 0.2); /* white/300 */
  --ft-on-dark: #FFFFFF;                   /* text/menu */
  --ft-on-dark-2: rgba(255, 255, 255, 0.7); /* text/menu/secondary */
  --ft-on-dark-3: rgba(255, 255, 255, 0.4); /* text/menu/tertiary */
  --ft-toolbar: #2C2C2C;                   /* bg/toolbar: dark in both themes */
  --ft-toolbar-hover: #111111;             /* bg/toolbar/hover */
  --ft-toolbar-line: #444444;              /* border/toolbar */
  /* UI3's elevation effect styles. */
  --ft-elev-200: 0 1px 3px rgba(0, 0, 0, 0.1), 0 3px 8px rgba(0, 0, 0, 0.1), 0 0 0.5px rgba(0, 0, 0, 0.18);
  --ft-elev-300: 0 1px 3px rgba(0, 0, 0, 0.1), 0 5px 12px rgba(0, 0, 0, 0.13), 0 0 0.5px rgba(0, 0, 0, 0.15);
  --ft-elev-400: 0 2px 5px rgba(0, 0, 0, 0.15), 0 10px 16px rgba(0, 0, 0, 0.12), 0 0 0.5px rgba(0, 0, 0, 0.12);
  /* The accent: blue in Design, pink in Motion (html.ft-motion, below). */
  --ft-accent: var(--ft-blue);
  --ft-accent-soft: var(--ft-blue-soft);
  --ft-accent-text: var(--ft-blue-text);
}
html[data-ft-theme="dark"] {
  --ft-i-bg: #2C2C2C;                      /* bg-default */
  --ft-i-border: #444444;                  /* border-default */
  --ft-i-surface: #2C2C2C;
  --ft-i-line: #444444;
  --ft-i-field: rgba(255, 255, 255, 0.05);
  --ft-i-hover: rgba(255, 255, 255, 0.05);
  --ft-i-press: rgba(255, 255, 255, 0.1);
  --ft-i-stroke: rgba(255, 255, 255, 0.1);
  --ft-i-text: #FFFFFF;
  --ft-i-text-2: rgba(255, 255, 255, 0.7);
  --ft-i-text-3: rgba(255, 255, 255, 0.4);
  --ft-i-inverse: #FFFFFF;
  --ft-i-on-inverse: rgba(0, 0, 0, 0.9);
  --ft-i-surface-2: #383838;
  --ft-i-disabled: #757575;
  --ft-i-on-disabled: #2C2C2C;
  --ft-blue: #0C8CE9;
  --ft-blue-soft: #4A5878;
  --ft-blue-text: #7CC4F8;
  --ft-pink: #F316B0;
  --ft-pink-soft: #68275E;
  --ft-pink-text: #FC9CE0;
  --ft-purple: #8A38F5;
  --ft-purple-soft: #473956;
  --ft-purple-text: #D1A8FF;
  --ft-elev-200: 0 1px 3px rgba(0, 0, 0, 0.5), inset 0 0 0.5px rgba(255, 255, 255, 0.3), 0 3px 8px rgba(0, 0, 0, 0.35), inset 0 0.5px 0 rgba(255, 255, 255, 0.08);
  --ft-elev-300: 0 1px 3px rgba(0, 0, 0, 0.5), inset 0 0 0.5px rgba(255, 255, 255, 0.3), 0 5px 12px rgba(0, 0, 0, 0.35), inset 0 0.5px 0 rgba(255, 255, 255, 0.08);
  --ft-elev-400: 0 2px 5px rgba(0, 0, 0, 0.35), inset 0 0 0.5px rgba(255, 255, 255, 0.35), 0 10px 16px rgba(0, 0, 0, 0.35), inset 0 0.5px 0 rgba(255, 255, 255, 0.08);
}
html.ft-motion { --ft-accent: var(--ft-pink); --ft-accent-soft: var(--ft-pink-soft); --ft-accent-text: var(--ft-pink-text); }
/* Figma UI3's icons are 24 frames drawn at 1:1: each shows at 24, never scaled, and a smaller slot centres one
   with negative margins. */
.ft-ico { display: block; flex: none; }
.ft-inspector {
  position: fixed; top: 12px; right: 12px; z-index: 2147483646;
  /* Its own border-box: the 242 holds the border on a page with no box-sizing reset too, so the content is 240
     everywhere, not only on pages whose CSS (Tailwind's preflight) resets it. */
  box-sizing: border-box;
  width: 242px; max-height: calc(100vh - 24px); overflow: hidden auto; overscroll-behavior: none;
  background: var(--ft-i-bg); border: 1px solid var(--ft-i-border); border-radius: 8px;
  color: var(--ft-i-text);
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  cursor: default; user-select: none;
}
/* Under about 690 wide the centred Design / Motion bar (174 wide) reaches under the panel, so the panel stops
   8 above the bar (12 + its 44 + 8) and its last rows stay in reach. */
@media (max-width: 690px) { .ft-inspector { max-height: calc(100vh - 76px); } }
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
  background: var(--ft-i-scrollbar); background-clip: padding-box; pointer-events: auto; touch-action: none;
}
.ft-scroll-thumb[hidden] { display: none; }
.ft-inspector *, .ft-inspector *::before, .ft-inspector *::after { box-sizing: border-box; }
.ft-inspector :where(button, input) {
  font: inherit; letter-spacing: inherit; color: inherit;
  margin: 0; padding: 0; border: 0; background: none; outline: none;
}
/* Keyboard focus on a button shows UI3's 1px blue ring, as the checkboxes' does (.ft-check-row); a mouse click
   leaves no focus behind (button()). */
.ft-inspector button:focus-visible:not(.ft-check-row), .ft-ui button:focus-visible, .ft-tool:focus-visible .ft-tool-icon {
  outline: 1px solid var(--ft-blue-text); outline-offset: -1px;
}
/* The panel's top row: Undo and Redo at the left, Hide UI over its right end (Reset is in the left toolbar). */
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
.ft-actions { display: flex; }
.ft-ui :where(button) { margin: 0; padding: 0; border: 0; background: none; color: inherit; outline: none; font: inherit; }
.ft-ui[data-min] { background: var(--ft-i-bg); border-color: var(--ft-i-border); }
/* Help and resources (Figma's ? button) in the bottom right corner, its menu above it with the hovered row in the
   mode's colour (blue in Design, pink in Motion), and Keyboard shortcuts as a sheet along the bottom of the window,
   as Figma's. A shortcut used this visit lights up in the mode's colour, as Figma marks the ones you know. */
.ft-resources {
  position: fixed; right: 16px; bottom: 16px; z-index: 2147483646; display: grid; place-items: center; width: 32px; height: 32px;
  margin: 0; padding: 0; border: 0; border-radius: 50%; background: var(--ft-i-surface); color: var(--ft-i-text);
  box-shadow: var(--ft-elev-200); cursor: default;
}
.ft-resources[hidden], .ft-shortcuts[hidden] { display: none; }
.ft-resources-menu {
  position: fixed; top: auto; left: auto; right: 16px; bottom: 56px; z-index: 2147483646; min-width: 160px;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-resources-menu .ft-menu-item { padding: 0 8px; border: 0; background: none; color: inherit; font: inherit; letter-spacing: inherit; cursor: default; }
.ft-resources-menu .ft-menu-item:hover, .ft-resources-menu .ft-menu-item:focus-visible { background: var(--ft-accent); outline: none; }
.ft-shortcuts {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483646; padding-bottom: 32px; background: var(--ft-i-surface);
  color: var(--ft-i-text); border-top: 1px solid var(--ft-i-border); box-shadow: var(--ft-elev-400);
  font: 450 13px/22px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: -0.0025em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-shortcuts-tabs { position: relative; display: flex; justify-content: center; height: 48px; border-bottom: 1px solid var(--ft-i-border); }
.ft-shortcuts-tab { display: grid; place-items: center; padding: 0 32px; margin-bottom: -1px; border: solid var(--ft-i-border); border-width: 0 1px; background: var(--ft-i-surface); }
.ft-shortcuts-x { margin: 0; position: absolute; right: 16px; top: 12px; display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 5px; background: none; color: inherit; cursor: default; }
.ft-shortcuts-x:hover { background: var(--ft-i-hover); }
.ft-shortcuts-list { display: grid; grid-template-columns: max-content max-content; column-gap: 120px; row-gap: 12px; width: max-content; margin: 32px auto 0; }
.ft-shortcuts-row { display: contents; }
.ft-shortcuts-name { display: flex; align-items: center; }
.ft-shortcuts-caps { display: flex; gap: 4px; justify-content: flex-end; }
.ft-shortcuts-cap { display: grid; place-items: center; min-width: 32px; height: 32px; padding: 0 8px; box-sizing: border-box; border: 1px solid var(--ft-i-border); border-radius: 5px; font-size: 11px; }
.ft-shortcuts-row.is-used .ft-shortcuts-name { color: var(--ft-accent-text); }
.ft-shortcuts-row.is-used .ft-shortcuts-cap { border-color: transparent; background: var(--ft-accent); color: var(--ft-on-dark); }
/* Every floating box (the panel, the toolbar, this bar, popovers, menus, the toast) has the panel's 8px corners;
   a cell inside one sits 4px in, so its corners are 4px (the Design / Motion bar's sit 6px in, her call).
   Design and Motion, at the bottom of the window like Figma's toolbar: one bar of cells, each with its icon
   and its name; the chosen one is filled with the accent, its icon and name white, as Figma's selected tool
   (blue, pink in Motion). It takes finetune's theme, as the rest does; its shadow is UI3's elevation-200, its
   24px icon sits 4 in, as in Figma's toolbar. */
.ft-modes {
  position: fixed; left: 50%; bottom: 12px; transform: translateX(-50%); display: flex; gap: 4px; padding: 6px;
  border-radius: 8px; background: var(--ft-i-surface); box-shadow: var(--ft-elev-200);
}
.ft-modes-btn {
  display: inline-flex; align-items: center; gap: 4px; height: 32px; padding: 0 10px 0 4px; border-radius: 4px;
  color: var(--ft-i-text);
}
.ft-modes-btn svg { display: block; width: 24px; height: 24px; }
.ft-modes-btn:hover { background: var(--ft-i-hover); }
.ft-modes-btn[aria-selected="true"] { background: var(--ft-accent); color: var(--ft-on-dark); }
.ft-icon-btn:disabled { opacity: 0.4; pointer-events: none; }
/* Unavailable but still hoverable, so its tip can say why. */
.ft-icon-btn[aria-disabled="true"] { opacity: 0.4; }
.ft-icon-btn[aria-disabled="true"]:hover { background: none; }
/* The toast sits above the Design / Motion bar, spaced as Figma's (40 tall, 16 in, 12 between the words and its
   buttons) in finetune's colors. One with an action (Reset's Undo) takes clicks, has Figma's close button after it,
   and fades out. */
.ft-toast {
  position: fixed; left: 50%; bottom: 64px; z-index: 2147483647; transform: translateX(-50%);
  display: flex; align-items: center; gap: 12px; min-height: 40px; box-sizing: border-box;
  padding: 0 16px; border-radius: 8px; background: var(--ft-dark); color: var(--ft-on-dark); pointer-events: none;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  transition: opacity 0.4s;
}
.ft-toast[hidden] { display: none; }
/* The first-visit note sits in the middle of the window (her call, 2026-10-14). */
.ft-toast.is-center { top: 50%; bottom: auto; transform: translate(-50%, -50%); }
/* A key in a toast, in the tooltips' shortcut colour. */
.ft-toast-key { color: var(--ft-on-dark-2); }
.ft-toast.has-action { padding: 0 8px 0 16px; pointer-events: auto; }
.ft-toast-actions { display: flex; align-items: center; gap: 8px; }
.ft-toast.is-fading { opacity: 0; }
.ft-toast-btn {
  height: 24px; margin: 0; padding: 0 8px; border: 0; border-radius: 5px; background: var(--ft-dark-hover);
  color: var(--ft-on-dark); font: inherit; letter-spacing: inherit; cursor: default;
}
.ft-toast-btn:hover { background: var(--ft-dark-press); }
.ft-toast-close {
  display: grid; place-items: center; width: 24px; height: 24px; margin: 0; padding: 0; border: 0; border-radius: 5px;
  background: none; color: var(--ft-on-dark-2); cursor: default;
}
.ft-toast-close:hover { background: var(--ft-dark-hover); color: var(--ft-on-dark); }
.ft-toast-close svg { display: block; width: 24px; height: 24px; }
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
.ft-icon-btn svg { display: block; width: 24px; height: 24px; }
.ft-fill-row { display: flex; align-items: center; gap: 8px; }
.ft-fill-actions { display: flex; flex: none; gap: 4px; }
/* Once any row has a remove button, rows without one keep its gap so every field is the same width. */
.ft-fills:has(.ft-fill-remove) .ft-fill-row:not(:has(.ft-fill-remove)) .ft-fill-actions::before { content: ""; width: 24px; }
.ft-fill {
  display: flex; flex: 1; min-width: 0; height: 24px; border-radius: 5px;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px transparent;
}
.ft-fill:hover { box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-fill:has(input:focus) { box-shadow: inset 0 0 0 1px var(--ft-accent); }
.ft-fill-color { position: relative; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; padding-left: 5px; }
.ft-swatch {
  flex: none; width: 14px; height: 14px; border-radius: 2px;
  background:
    linear-gradient(90deg, var(--ft-c) 50%, transparent 50%),
    linear-gradient(var(--ft-ca), var(--ft-ca)),
    repeating-conic-gradient(#D9D9D9 0 25%, #FFFFFF 0 50%) 0 0 / 6px 6px;
  box-shadow: inset 0 0 0 1px var(--ft-i-stroke);
}
.ft-hex, .ft-alpha { width: 100%; min-width: 0; height: 24px; }
.ft-fill-alpha {
  display: flex; align-items: center; flex: none; width: 52px; padding: 0 8px;
  border-left: 1px solid var(--ft-i-bg);
}
.ft-fill:hover .ft-fill-alpha { border-left-color: var(--ft-i-stroke); }
.ft-fill:has(input:focus) .ft-fill-alpha { border-left-color: var(--ft-accent); }
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
.ft-kind-name { flex: none; font-weight: 550; font-size: 13px; line-height: 22px; letter-spacing: -0.0025em; }
.ft-kind-el { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ft-i-text-2); }
/* The columns' line opens the Page settings. */
.ft-kind-link { cursor: pointer; }
.ft-kind-link:hover { background: var(--ft-i-hover); }
/* A group's count opens its items as a menu, to pick one she knows (her ask, 2026-10-14): after the element's
   name, in its small grey type, "main.gv-pane · 6 items" with a caret after the count, as Figma's "Frame ⌄" header
   opens its menu; hovering the count (or while its menu is open) greys it. */
.ft-kind-dot { flex: none; margin: 0 -4px; color: var(--ft-i-text-2); }
.ft-kind-count { display: inline-flex; align-items: center; flex: none; margin: 0 -2px 0 -4px; padding: 0 2px 0 4px; border-radius: 5px; color: var(--ft-i-text-2); cursor: default; }
.ft-kind-count:hover, .ft-kind-count.is-open { background: var(--ft-i-hover); }
.ft-kind-count .ft-caret { color: inherit; }
/* A component's line: its name, what an edit reaches, then Override across the width (pressed while it's on). */
.ft-kind-comp { flex-direction: column; align-items: stretch; gap: 4px; }
.ft-kind-comp .ft-kind-el { white-space: normal; }
/* A cva component's name and its variant on one line, as a group's element and count sit ("Button · outline"). */
.ft-kind-head { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
.ft-choice.ft-override { margin-top: 8px; }
.ft-choice.ft-override[aria-pressed="true"], .ft-choice.ft-override[aria-pressed="true"]:hover { background: var(--ft-purple-soft); color: var(--ft-purple-text); box-shadow: none; }
/* A section with nothing under its head (Fill, Stroke or Effects before the +) is just the head, as in Figma. */
.ft-section:has(> .ft-section-head + :is(.ft-fills, .ft-stroke):empty:last-child) { padding-bottom: 0; }
.ft-section > :is(.ft-fills, .ft-stroke):empty { display: none; }

/* Inside the panel, overlays stack in a set order over its rows (a faded row, at 40% opacity, is a layer
   of its own and would otherwise paint over them): popovers, then the color picker opened from one, then menus. */
.ft-pop {
  position: fixed; z-index: 2; width: 240px; background: var(--ft-i-surface); border-radius: 13px;
  box-shadow: var(--ft-elev-400);
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
  box-shadow: inset 0 0 0 1px var(--ft-i-stroke);
}
.ft-pop-tools { display: flex; align-items: center; gap: 12px; }
/* Figma's picker (measured): 16px tracks 12 apart, 12 between the square, the sliders and the hex row. */
.ft-sliders { display: flex; flex-direction: column; gap: 12px; flex: 1; min-width: 0; }
.ft-pop.ft-picker-pop .ft-pop-body { gap: 12px; }
.ft-track { position: relative; height: 16px; border-radius: 8px; touch-action: none; box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
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
.ft-fill:has(input:focus) .ft-channel + .ft-channel { border-left-color: var(--ft-accent); }
.ft-select {
  display: flex; align-items: center; justify-content: space-between; gap: 4px;
  height: 24px; padding: 0 4px 0 8px; border: 1px solid var(--ft-i-line); border-radius: 5px;
}
.ft-select:hover { border-color: var(--ft-i-stroke); }
.ft-mode { flex: none; min-width: 54px; }
.ft-menu {
  position: fixed; z-index: 4; min-width: 104px; max-height: calc(100vh - 16px); overflow-y: auto; padding: 8px;
  background: var(--ft-dark); color: var(--ft-on-dark); border-radius: 13px; box-shadow: var(--ft-elev-400);
}
.ft-menu[hidden] { display: none; }
.ft-menu-item {
  display: flex; align-items: center; gap: 4px; width: 100%; height: 24px;
  padding: 0 8px 0 4px; border-radius: 5px; text-align: left; white-space: nowrap;
}
.ft-menu-item:hover { background: var(--ft-blue); }
.ft-menu-check { display: grid; place-items: center; width: 16px; height: 16px; }
.ft-menu-check svg { display: block; width: 24px; height: 24px; margin: -4px; }
/* The kit's menu glyph sits 20 in from the row (the 4px gap after the tick would put it at 24). */
.ft-menu-icon { display: grid; place-items: center; flex: none; width: 24px; height: 24px; margin-left: -4px; }
.ft-menu-icon svg { display: block; width: 24px; height: 24px; }
.ft-menu-keys { margin-left: auto; padding-left: 24px; color: var(--ft-on-dark-3); }
.ft-menu-heading { padding: 6px 8px 4px 24px; font-size: 11px; color: var(--ft-on-dark-3); white-space: nowrap; }
.ft-menu-heading:not(:first-child) { margin-top: 4px; }
/* Select layer's rows step in a level per layer they sit inside, as the layers they are nest. */
.ft-menu-nest { padding-left: calc(var(--ft-depth) * 12px); }
/* A line between a menu's parts, as Figma's: Motion's coded animations above, its generic ones below. */
.ft-menu-divider { height: 1px; margin: 7px -8px; background: var(--ft-dark-line); }
.ft-menu-trash { display: grid; place-items: center; flex: none; width: 20px; height: 20px; margin: 0 -4px 0 auto; padding-left: 8px; opacity: 0; }
.ft-menu-item:hover .ft-menu-trash { opacity: 1; }
.ft-menu-trash svg { display: block; width: 24px; height: 24px; margin: -2px; }
/* Layout guide styles (Figma's): a heading per part and a row per style, Delete on a row's hover. */
.ft-styles-list { max-height: min(360px, calc(100vh - 80px)); overflow-y: auto; overscroll-behavior: none; padding: 8px 0; }
.ft-styles-heading { display: flex; align-items: center; height: 32px; padding: 0 16px; font-weight: 550; }
.ft-style-row { display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 8px 0 16px; cursor: default; }
.ft-style-row:hover { background: var(--ft-i-hover); }
/* The layout on the page now: not a pick (it's already on), so it keeps Figma's selected fill (bg-selected), a full
   width rectangle as Figma's in-use "Grid" row has, hovered or not. */
.ft-style-current, .ft-style-current:hover { background: var(--ft-blue-soft); }
/* Figma's styles popover is 216 wide, not the 240 of the others (measured from her shots of Layout guide styles).
   The Fonts popover copies it, so the two sit the same beside the panel. */
.ft-pop.ft-styles-pop, .ft-pop.ft-fonts-pop { width: 216px; }
/* Fonts: the type filter sits where the styles popover's first heading sits (8 under the divider, a 32 row), its
   dropdown 8 in from each side so its words line up with the rows' 16. The list scrolls under it. */
.ft-fonts-filter { display: flex; align-items: center; height: 32px; margin-top: 8px; padding: 0 8px; }
.ft-fonts-filter > .ft-dd { flex: 1; min-width: 0; }
.ft-fonts-list { max-height: min(360px, calc(100vh - 120px)); overflow-y: auto; overscroll-behavior: none; padding: 0 0 8px; }
/* A family's row is a style row with Figma's check column in the icon's slot: the tick on the one in use. */
.ft-font-check { display: grid; place-items: center; flex: none; width: 16px; height: 16px; }
.ft-font-check svg { display: block; width: 24px; height: 24px; margin: -4px; }
/* Each name is drawn in its own face at 13, as Figma's font list shows them, so a face reads at a glance. */
.ft-font-name { font-size: 13px; font-weight: 400; letter-spacing: 0; }
.ft-style-row > svg { display: block; flex: none; width: 24px; height: 24px; margin: -4px; }
.ft-style-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-style-trash { opacity: 0; }
.ft-style-row:hover .ft-style-trash, .ft-style-trash:focus-visible { opacity: 1; }
.ft-styles-empty { padding: 8px 16px; color: var(--ft-i-text-2); }
/* Text styles and Color styles: a style's "Ag" (in its own face) or its swatch sits in the icon's 16 slot, so every
   name starts at 40; Figma's size and line height follow the name in the second text colour ("b1 · 16/24"). */
.ft-style-ag { flex: none; width: 16px; font-size: 13px; line-height: 16px; letter-spacing: 0; white-space: nowrap; }
.ft-style-row > .ft-swatch { margin: 0 1px; }
.ft-style-meta { color: var(--ft-i-text-2); }
.ft-caret { display: grid; place-items: center; width: 16px; height: 16px; color: var(--ft-i-text-2); }
.ft-caret svg { display: block; width: 24px; height: 24px; margin: -4px; }

.ft-tip {
  position: fixed; z-index: 2147483647; pointer-events: none;
  padding: 4px 8px; border-radius: 5px; background: var(--ft-dark); color: var(--ft-on-dark);
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  box-shadow: var(--ft-elev-300);
}
.ft-tip[hidden] { display: none; }
.ft-tip-key { margin-left: 8px; color: var(--ft-on-dark-2); }
.ft-tip::before {
  content: ""; position: absolute; top: -4px; left: calc(var(--ft-caret, 50%) - 4px);
  border-style: solid; border-width: 0 4px 4px; border-color: transparent transparent var(--ft-dark);
}
.ft-tip[data-side="top"]::before {
  top: auto; bottom: -4px; border-width: 4px 4px 0; border-color: var(--ft-dark) transparent transparent;
}
.ft-tip[data-side="right"]::before {
  top: calc(50% - 4px); left: -5px;
  border-width: 4px 5px 4px 0; border-color: transparent var(--ft-dark) transparent transparent;
}

.ft-toolbar {
  position: fixed; top: 12px; left: 12px; z-index: 2147483646;
  display: flex; flex-direction: column; gap: 4px; padding: 8px;
  background: var(--ft-i-bg); border: 1px solid var(--ft-i-border); border-radius: 8px;
  color: var(--ft-i-text); cursor: default; user-select: none;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-toolbar[hidden] { display: none; }
.ft-toolbar, .ft-toolbar * { box-sizing: border-box; }
.ft-toolbar :where(button) { margin: 0; padding: 0; border: 0; background: none; color: inherit; outline: none; }
/* The rail, slimmed (her call, 2026-10-14: no names, tighter): icons only, each a 32 box with its 24 icon at 1:1
   (the panel's button size), 4 apart and 8 in from the rail's edges; the names are in the tooltips. Hover greys the
   box and nothing stays picked (they're actions). It starts with finetune's mark, a link to the repo, over a short
   grey line, as Figma's rail starts with its logo (her ask, 2026-10-15); the line sits 6 from the boxes on either side
   (the 4px gap plus 2, her ask: 4 read tight next to a line). */
.ft-tool { display: flex; color: inherit; text-decoration: none; cursor: default; }
.ft-rail-line { flex: none; width: 16px; height: 1px; margin: 2px auto; background: var(--ft-i-line); }
/* The mark at 20 (a touch over the tools' glyphs, as Figma's logo stands over its tools); hover fills it in. */
.ft-logo .ft-tool-icon svg { width: 20px; height: 20px; }
.ft-logo .ft-logo-fill, .ft-logo:hover .ft-logo-line { display: none; }
.ft-logo:hover .ft-logo-fill { display: block; }
.ft-tool-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 5px; }
.ft-tool:hover .ft-tool-icon { background: var(--ft-i-hover); }
.ft-tool:disabled { opacity: 0.4; pointer-events: none; }
.ft-tool-icon svg { display: block; width: 24px; height: 24px; }

.ft-type { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-right: 32px; }
.ft-span2 { grid-column: 1 / -1; }
.ft-dd, .ft-num-field {
  display: flex; align-items: center; min-width: 0; height: 24px; border-radius: 5px;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px transparent;
}
.ft-dd { justify-content: space-between; gap: 4px; padding: 0 4px 0 8px; text-align: left; }
.ft-dd-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-dd:hover, .ft-num-field:hover { box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-num-field:has(input:focus) { box-shadow: inset 0 0 0 1px var(--ft-accent); }
.ft-field-icon { display: grid; place-items: center; flex: none; width: 24px; height: 24px; color: var(--ft-i-text-2); }
.ft-field-icon svg { display: block; width: 24px; height: 24px; }
.ft-field-letter { color: var(--ft-i-text); }
.ft-num-input { flex: 1; min-width: 0; height: 24px; padding-left: 8px; }
.ft-field-icon + .ft-num-input { padding-left: 0; }
.ft-field-caret { display: grid; place-items: center; flex: none; width: 20px; height: 24px; color: var(--ft-i-text-2); }
.ft-field-caret svg { display: block; width: 24px; height: 24px; margin: 0 -2px; }
.ft-field-caret[hidden] { display: none; }
.ft-labeled { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
/* A plain selection's Spacing hides while its layers aren't in one row or column. */
.ft-labeled[hidden] { display: none; }
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
.ft-field-label { color: var(--ft-i-text-2); font-size: 9px; line-height: 14px; font-weight: 450; }
.ft-type-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
/* Figma's segmented boxes: each button its own grey cell, 1px apart so the panel shows between them, the
   group's outer corners rounded. Hover darkens a cell; the chosen one is white. */
.ft-seg { display: flex; gap: 1px; height: 24px; }
.ft-seg-btn { display: grid; place-items: center; flex: 1; height: 24px; background: var(--ft-i-field); }
.ft-seg-btn:first-child { border-radius: 5px 0 0 5px; }
.ft-seg-btn:last-child { border-radius: 0 5px 5px 0; }
.ft-seg-btn:hover { background: var(--ft-i-press); }
.ft-seg-btn[aria-pressed="true"] { background: var(--ft-i-surface); box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-seg-btn svg { display: block; width: 24px; height: 24px; }
/* UI3's segmented control, on Flow only: one grey track, the picked cell a surface with a 1px line. The other
   segmented rows keep the separate cells above (her earlier call). */
.ft-seg.ft-seg-track { gap: 0; background: var(--ft-i-field); border-radius: 5px; }
.ft-seg-track > .ft-seg-btn,
.ft-seg-track > .ft-seg-btn:first-child,
.ft-seg-track > .ft-seg-btn:last-child { background: none; border-radius: 5px; color: var(--ft-i-text-2); }
.ft-seg-track > .ft-seg-btn:hover { background: none; color: var(--ft-i-text); }
.ft-seg-track > .ft-seg-btn[aria-pressed="true"] { background: var(--ft-i-surface); box-shadow: inset 0 0 0 1px var(--ft-i-line); color: var(--ft-i-text); }
.ft-with-action > .ft-seg { flex: 1; min-width: 0; }
/* Flow's Wrap and its empty slot take turns in the action column. */
.ft-with-action > [hidden] { display: none; }
/* Auto layout's Alignment: Figma's nine dots on one grey field, 64 tall in the left column, with Gap beside it at the
   top. The glyphs are UI3's 16 frames at 1:1 (an ICON svg has no size of its own, so the cell gives it one). A cell
   at rest shows its dot; picked (accent) or under the pointer (secondary) it shows the flow's glyph. Under Gap Auto
   the box is three cells, each holding three glyphs spread along the flow, centred where the nine dots' rows (or
   columns) are. */
.ft-type > .ft-al-top { align-self: start; }
/* Figma's Scale section spaces its second row (Scale, Anchor point) 3px further down than the other sections. The
   row is also a labeled row, so this replaces the -4px above: -4 + 3 = -1. */
.ft-scale-grid > .ft-al-top { margin-top: -1px; }
.ft-al-box { display: grid; grid-template: repeat(3, 1fr) / repeat(3, 1fr); height: 64px; border-radius: 5px; background: var(--ft-i-field); }
.ft-al-box.is-cols { grid-template: 1fr / repeat(3, 1fr); }
.ft-al-box.is-rows { grid-template: repeat(3, 1fr) / 1fr; }
.ft-al-cell { display: grid; place-items: center; min-width: 0; min-height: 0; color: var(--ft-i-text-3); }
.ft-al-box.is-auto .ft-al-cell { place-items: stretch; }
.ft-al-cell svg { display: block; flex: none; width: 16px; height: 16px; }
.ft-al-cell > span { display: flex; justify-content: space-around; align-items: center; }
.ft-al-box.is-cols .ft-al-cell > span { flex-direction: column; }
.ft-al-box .ft-al-cell > .ft-al-on,
.ft-al-box .ft-al-cell:hover > .ft-al-rest,
.ft-al-box .ft-al-cell[aria-pressed="true"] > .ft-al-rest { display: none; }
.ft-al-box .ft-al-cell:hover > .ft-al-on,
.ft-al-box .ft-al-cell[aria-pressed="true"] > .ft-al-on { display: flex; }
.ft-al-cell:hover { color: var(--ft-i-text-2); }
.ft-al-cell[aria-pressed="true"] { color: var(--ft-accent-text); }
/* Scale (K). Scale's field and its presets caret are two cells 1px apart, the caret cell 24 wide; it darkens on
   hover (Figma's #E6E6E6) and shows UI3's selected blue while its menu is open. Anchor point is the nine dots' grey
   field (64 tall, as Alignment's): the picked cell shows a 10px blue square in place of its dot. Both are always
   drawn, one over the other, so moving the anchor fades the old square out and the new one in at the same time. */
.ft-scale-combo { display: flex; gap: 1px; min-width: 0; }
.ft-scale-combo > .ft-num-field { flex: 1; border-radius: 5px 0 0 5px; }
.ft-scale-dd { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 0 5px 5px 0; background: var(--ft-i-field); color: var(--ft-i-text); }
.ft-scale-dd:hover { background: var(--ft-i-line); }
.ft-scale-dd.is-open { background: var(--ft-blue-soft); box-shadow: inset 0 0 0 1px var(--ft-blue); }
.ft-scale-dd svg { display: block; width: 24px; height: 24px; }
.ft-anchor-box { display: grid; grid-template: repeat(3, 1fr) / 22px 1fr 22px; height: 64px; border-radius: 5px; background: var(--ft-i-field); }
.ft-anchor-cell { display: grid; place-items: center; min-width: 0; min-height: 0; color: var(--ft-i-text-3); }
.ft-anchor-cell > * { grid-area: 1 / 1; }
.ft-anchor-cell svg { display: block; width: 16px; height: 16px; }
.ft-anchor-cell > .ft-al-rest, .ft-anchor-sq { transition: opacity 120ms linear; }
.ft-anchor-sq { width: 10px; height: 10px; border-radius: 2px; background: var(--ft-blue); opacity: 0; }
.ft-anchor-cell[aria-pressed="true"] > .ft-anchor-sq { opacity: 1; }
.ft-anchor-cell[aria-pressed="true"] > .ft-al-rest { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .ft-anchor-cell > .ft-al-rest, .ft-anchor-sq { transition: none; } }
/* A wrapped row's two gaps stack in Gap's column; Individual padding opens two rows, as the corners do. */
.ft-al-gaps, .ft-pads { display: flex; flex-direction: column; gap: 8px; }
.ft-pads[hidden] { display: none; }
.ft-head-actions, .ft-btn-group { display: flex; }
/* An icon button's own display: grid would otherwise beat [hidden] (the Styles popover's +). */
.ft-head-actions > [hidden] { display: none; }
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
.ft-guide-warn svg { display: block; flex: none; width: 24px; height: 24px; margin: -4px; }
/* Save as style: where it applies, two buttons in place. */
.ft-pop.ft-save-pop { width: auto; }
.ft-save-body { display: flex; flex-direction: column; gap: 6px; padding: 8px; }
/* Plain until she points at one, as in Figma's option lists: no choice looks picked before she's touched it. */
.ft-choice { height: 24px; padding: 0 12px; border-radius: 5px; background: none; text-align: left; white-space: nowrap; }
.ft-choice:hover { background: var(--ft-i-field); }
/* Figma's secondary button: white, a hairline border, the + left of a centered label. */
.ft-choice.ft-choice-icon {
  display: flex; align-items: center; justify-content: center; gap: 4px; height: 24px; padding: 0 8px;
  background: var(--ft-i-surface); box-shadow: inset 0 0 0 1px var(--ft-i-line); font-weight: 500;
}
.ft-choice.ft-choice-icon:hover { background: var(--ft-i-hover); box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-choice-icon svg { display: block; width: 24px; height: 24px; margin: 0 -6px; }
.ft-seg-act .ft-seg-btn:active { background: var(--ft-i-surface); box-shadow: inset 0 0 0 1px var(--ft-i-line); }
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
.ft-icon-btn[aria-pressed="true"], .ft-icon-btn.is-open { background: var(--ft-accent-soft); color: var(--ft-accent-text); }
.ft-swatch.ft-thumb { background: #FFFFFF center / cover no-repeat; }
.ft-fill-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ft-dd.ft-fit { align-self: flex-start; width: 112px; background: none; box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-dd.ft-fit:hover { box-shadow: inset 0 0 0 1px var(--ft-i-stroke); }
.ft-img-preview {
  position: relative; display: block; width: 100%; height: 208px; overflow: hidden; border-radius: 2px;
  background: repeating-conic-gradient(#EDEDED 0 25%, #FFFFFF 0 50%) 0 0 / 16px 16px;
  box-shadow: inset 0 0 0 1px var(--ft-i-stroke);
}
.ft-img-preview img { display: block; width: 100%; height: 100%; object-fit: contain; }
/* Replace image, a dark button over the middle of the preview (after Figma's "Make an image"); the whole
   preview is the button, so a click anywhere on it picks a file. */
.ft-img-replace {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; align-items: center;
  height: 32px; padding: 0 12px; border-radius: 5px; white-space: nowrap; pointer-events: none;
  background: var(--ft-toolbar); color: var(--ft-on-dark); box-shadow: inset 0 0 0 1px var(--ft-toolbar-line);
}
.ft-img-preview:hover .ft-img-replace { background: var(--ft-toolbar-hover); }
.ft-adjust { display: grid; grid-template-columns: 76px 1fr; align-items: center; row-gap: 12px; }
.ft-adjust-label { color: var(--ft-i-text-2); }
.ft-adj-track {
  position: relative; height: 16px; border-radius: 8px; touch-action: none;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px var(--ft-i-line);
}
/* Off zero, the track fills in from the middle to the knob, as in Figma. */
.ft-adj-fill {
  position: absolute; top: 0; bottom: 0; pointer-events: none; background: var(--ft-accent);
  left: calc(8px + var(--ft-lo, 0.5) * (100% - 16px)); width: calc(var(--ft-span, 0) * (100% - 16px));
}
/* Figma's: a white knob with the fill's color in its middle, and a small white dot marking zero. */
.ft-adj-knob {
  position: absolute; z-index: 1; top: 50%; left: calc(8px + var(--ft-x, 0.5) * (100% - 16px));
  width: 16px; height: 16px; border-radius: 50%; pointer-events: none;
  transform: translate(-50%, -50%); background: radial-gradient(circle, var(--ft-accent) 0 3px, #FFFFFF 3.5px);
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
.ft-slide { position: relative; flex: 1; height: 4px; border-radius: 2px; background: var(--ft-i-press); }
.ft-slide-fill { position: absolute; left: 0; top: 0; bottom: 0; width: calc(var(--ft-x, 0) * 100%); border-radius: 2px; background: var(--ft-accent); }
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
.ft-slide-mark { position: absolute; top: 50%; left: 60%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%; background: var(--ft-i-text-3); }
.ft-slide-note { position: absolute; top: 8px; left: 60%; transform: translateX(-50%); color: var(--ft-i-text-2); font-size: 9.5px; line-height: 12px; }
/* Motion: the layer's keyframe animations, and, with nothing selected, the page's animated layers.
   Its accent is Motion's pink (see html.ft-motion below). */
/* Figma's curve editor: the unit square, with room above and below for the curves that overshoot. */
.ft-curve { display: block; width: 100%; height: auto; border-radius: 2px; background: var(--ft-i-field); touch-action: none; }
.ft-curve-box { fill: var(--ft-i-surface); stroke: var(--ft-i-line); }
.ft-curve-arm { stroke: var(--ft-i-text-3); }
.ft-curve-line { fill: none; stroke: var(--ft-pink); stroke-width: 1.5; }
.ft-curve-knob { fill: #FFFFFF; stroke: var(--ft-pink); }
/* Figma's Interactions list: one row per animation, its name and duration; the open one is picked. */
.ft-anim-rows { display: flex; flex-direction: column; gap: 2px; }
.ft-anim-row { display: flex; align-items: center; gap: 8px; width: 100%; height: 32px; padding: 0 8px; border-radius: 5px; text-align: left; }
.ft-anim-row:hover { background: var(--ft-i-hover); }
.ft-anim-row[aria-pressed="true"] { background: var(--ft-pink-soft); }
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
.ft-dd-icon svg.ft-ico { width: 24px; height: 24px; margin: -4px; }
.ft-dd-icon + .ft-dd-label { flex: 1; }
/* Figma's checkbox row (Clip content): the box, then its label. The box is UI3's Checkbox (the kit's Light and Dark
   frames). The line is an inset shadow, not a border, so the 16 glyph fills the box at 1:1. The kit draws no hover,
   so an empty box only firms its line on hover (finetune's own). Focus puts a 2px ring of the panel's surface inside
   the line, as the kit does. The glyph paints with currentColor, so each state just sets color. */
.ft-check-row { display: flex; align-items: center; gap: 8px; height: 24px; text-align: left; }
.ft-check { display: grid; place-items: center; width: 16px; height: 16px; border-radius: 6px; color: var(--ft-i-text); background: var(--ft-i-surface-2); box-shadow: inset 0 0 0 1px var(--ft-i-line); transition: background-color 150ms ease-out; }
/* Hover darkens the box (her Figma, 2026-10-15); a click flashes that back out until the pointer leaves. Corners 6
   (her call: the kit's 5 read square next to Figma's). */
.ft-check-row:hover:not(.is-pressed) .ft-check { background: color-mix(in srgb, var(--ft-i-surface-2), var(--ft-i-text) 9%); box-shadow: inset 0 0 0 1px var(--ft-i-text-3); }
/* Checked, as her Figma draws it (her call, 2026-10-15, over the kit's blue fill): the box stays as it is and a
   check is drawn in, in the text color; unchecked, the check just fades out. Only a click animates it (.is-toggling),
   so a panel that opens on a checked box shows it already drawn. */
.ft-check-mark { opacity: 0; }
.ft-check-mark path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.ft-check-row[aria-checked="true"] .ft-check-mark { opacity: 1; }
.ft-check-row[aria-checked="true"] .ft-check-mark path { stroke-dashoffset: 0; }
.ft-check-row.is-toggling[aria-checked="true"] .ft-check-mark path { transition: stroke-dashoffset 220ms cubic-bezier(0.2, 0, 0, 1); }
.ft-check-row.is-toggling[aria-checked="false"] .ft-check-mark { transition: opacity 120ms ease-out; }
.ft-check-row.is-toggling[aria-checked="false"] .ft-check-mark path { transition: stroke-dashoffset 0s 120ms; }
@media (prefers-reduced-motion: reduce) { .ft-check-row.is-toggling .ft-check-mark, .ft-check-row.is-toggling .ft-check-mark path { transition: none; } }
.ft-check-row[aria-checked="mixed"] .ft-check::after { content: ""; width: 8px; height: 1px; border-radius: 0.5px; background: currentColor; }
.ft-check-row:focus-visible .ft-check { box-shadow: inset 0 0 0 1px var(--ft-blue-text); }
/* Off: the box goes faint and its label takes the secondary text, as the disabled fields beside it do. One with a tip
   saying why still takes the hover, so the tip shows; its click does nothing. */
.ft-check-row:is(:disabled, [aria-disabled="true"]):not([data-ft-tip]) { pointer-events: none; }
.ft-check-row:is(:disabled, [aria-disabled="true"]) { cursor: default; }
.ft-check-row:is(:disabled, [aria-disabled="true"]) > span:last-child { color: var(--ft-i-text-2); }
.ft-check-row:is(:disabled, [aria-disabled="true"]) .ft-check { background: none; box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-check-row:is(:disabled, [aria-disabled="true"]):is([aria-checked="true"], [aria-checked="mixed"]) .ft-check { color: var(--ft-i-text-3); }
.ft-check-row:is(:disabled, [aria-disabled="true"])[aria-checked="mixed"] .ft-check { color: var(--ft-i-text-3); }
.ft-check svg { display: block; width: 16px; height: 16px; margin: 0; }
/* Motion's accent: pink where Design uses its blue (the selection, focus, the bar's chosen cell, and Motion's
   own rows and curve above), so it's clear which mode is on. html.ft-motion is set while Motion shows. */
html.ft-motion .ft-hover-box, html.ft-motion .ft-sel-box, html.ft-motion .ft-handle { border-color: var(--ft-pink); }
html.ft-motion .ft-menu-item:hover { background: var(--ft-pink); }
/* A layer with no animation: one full-width button to add one (Figma's secondary button). */
.ft-choice.ft-add-anim { width: 100%; }
/* Match layer width: ends where the W / H row does, clear of the section's 32 trailing column. */
.ft-choice.ft-match-cols { width: calc(100% - 32px); }

.ft-hover-box, .ft-sel-box {
  position: fixed; z-index: 2147483645; box-sizing: border-box; pointer-events: none;
  border: 1px solid var(--ft-blue);
}
.ft-hover-box[hidden], .ft-sel-box[hidden] { display: none; }
/* A layer tipped in 3D: the box stays around it (for the label), unpainted, and its outline is its own slanted shape. */
.ft-quad { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; display: none; }
.ft-quad polygon { fill: none; stroke: var(--ft-blue); stroke-width: 1; vector-effect: non-scaling-stroke; }
html.ft-motion .ft-quad polygon { stroke: var(--ft-pink); }
.ft-hover-box.is-quad, .ft-sel-box.is-quad { border-color: transparent; }
.ft-hover-box.is-quad > .ft-quad, .ft-sel-box.is-quad > .ft-quad { display: block; }
.ft-sel-box.is-quad .ft-handle, .ft-sel-box.is-quad .ft-rot { display: none; }
/* Its layer turned away (its back hidden): nothing shows, so neither does its outline. */
.ft-hover-box.is-away, .ft-sel-box.is-away { visibility: hidden; }
/* A column of the layout guide she's picked: outlined as a selection is, without corners or a label. */
.ft-col-box { border-color: var(--ft-blue); }
/* Figma's help card (its "Creating a connection"): a title band, then its icon beside a line or two of how-to. */
.ft-help-body { display: flex; align-items: flex-start; gap: 8px; }
.ft-help-icon { flex: none; width: 24px; height: 24px; color: var(--ft-i-text); }
.ft-help-icon svg { display: block; width: 24px; height: 24px; }
.ft-help-text { flex: 1; min-width: 0; margin: 4px 0 0; color: var(--ft-i-text); }
.ft-help-body[hidden] { display: none; }
/* The section's right padding is 8 (room for trailing icon buttons); a how-to without a close takes 8 more so its
   text has 16 on both sides. With a close, the close sits in that trailing column. */
.ft-help-body:not(.ft-help-closable) { padding-right: 8px; }
/* Under a section's controls (Align to column, Match item width), the how-to sits 8 below them. */
.ft-section > .ft-choice + .ft-help-body { margin-top: 8px; }
.ft-section > .ft-type + .ft-choice, .ft-section > .ft-type + .ft-help-body { margin-top: 8px; }
/* Figma's marquee: drag on the page to select what the box touches. */
.ft-marquee { position: fixed; z-index: 2147483645; box-sizing: border-box; pointer-events: none; border: 1px solid var(--ft-blue); background: color-mix(in srgb, var(--ft-blue) 8%, transparent); }
.ft-marquee[hidden] { display: none; }
/* In Motion, every layer with motion on screen is outlined in pink, so what can be tuned is plain to see. */
.ft-marks { position: fixed; inset: 0; z-index: 2147483644; pointer-events: none; }
.ft-marks[hidden] { display: none; }
.ft-mark { position: absolute; box-sizing: border-box; border: 1px solid color-mix(in srgb, var(--ft-pink) 50%, transparent); }
.ft-handle {
  position: absolute; width: 7px; height: 7px; box-sizing: border-box;
  background: #FFFFFF; border: 1px solid var(--ft-blue);
}
.ft-nw { left: -4px; top: -4px; }
.ft-ne { right: -4px; top: -4px; }
.ft-sw { left: -4px; bottom: -4px; }
.ft-se { right: -4px; bottom: -4px; }
.ft-sel-box.is-editing .ft-handle { display: none; }
/* A corner drags to resize: a 15px target around the 7px square. Only one layer that isn't turned resizes. */
.ft-handle { pointer-events: auto; }
.ft-handle::before { content: ""; position: absolute; inset: -4px; }
/* The resize cursor: the macOS diagonal arrow, with a line drawn outside each head that matches its size and angle. Hotspot at the centre. */
html.ft-moving .ft-sel-box .ft-nw, html.ft-moving .ft-sel-box .ft-se { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M18.78 18.198A0.46 0.46 0 0 1 18.198 18.78L12.353 16.832A0.46 0.46 0 0 1 12.173 16.07L16.07 12.173A0.46 0.46 0 0 1 16.832 12.353ZM14.967 17.703L14.413 19.363L21.838 21.838L19.363 14.413L17.703 14.967ZM5.22 5.802A0.46 0.46 0 0 1 5.802 5.22L11.647 7.168A0.46 0.46 0 0 1 11.827 7.93L7.93 11.827A0.46 0.46 0 0 1 7.168 11.647ZM9.033 6.297L9.587 4.637L2.162 2.162L4.637 9.587L6.297 9.033Z' stroke-width='2'/%3E%3Cpath d='M14.413 19.363L21.838 21.838L19.363 14.413M9.587 4.637L2.162 2.162L4.637 9.587' fill='none' stroke-width='3.5'/%3E%3C/g%3E%3Cpath d='M18.78 18.198A0.46 0.46 0 0 1 18.198 18.78L12.353 16.832A0.46 0.46 0 0 1 12.173 16.07L16.07 12.173A0.46 0.46 0 0 1 16.832 12.353ZM5.22 5.802A0.46 0.46 0 0 1 5.802 5.22L11.647 7.168A0.46 0.46 0 0 1 11.827 7.93L7.93 11.827A0.46 0.46 0 0 1 7.168 11.647Z' fill='black'/%3E%3Cpath d='M14.413 19.363L21.838 21.838L19.363 14.413M9.587 4.637L2.162 2.162L4.637 9.587' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, nwse-resize; }
html.ft-moving .ft-sel-box .ft-ne, html.ft-moving .ft-sel-box .ft-sw { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M18.198 5.22A0.46 0.46 0 0 1 18.78 5.802L16.832 11.647A0.46 0.46 0 0 1 16.07 11.827L12.173 7.93A0.46 0.46 0 0 1 12.353 7.168ZM17.703 9.033L19.363 9.587L21.838 2.162L14.413 4.637L14.967 6.297ZM5.802 18.78A0.46 0.46 0 0 1 5.22 18.198L7.168 12.353A0.46 0.46 0 0 1 7.93 12.173L11.827 16.07A0.46 0.46 0 0 1 11.647 16.832ZM6.297 14.967L4.637 14.413L2.162 21.838L9.587 19.363L9.033 17.703Z' stroke-width='2'/%3E%3Cpath d='M19.363 9.587L21.838 2.162L14.413 4.637M4.637 14.413L2.162 21.838L9.587 19.363' fill='none' stroke-width='3.5'/%3E%3C/g%3E%3Cpath d='M18.198 5.22A0.46 0.46 0 0 1 18.78 5.802L16.832 11.647A0.46 0.46 0 0 1 16.07 11.827L12.173 7.93A0.46 0.46 0 0 1 12.353 7.168ZM5.802 18.78A0.46 0.46 0 0 1 5.22 18.198L7.168 12.353A0.46 0.46 0 0 1 7.93 12.173L11.827 16.07A0.46 0.46 0 0 1 11.647 16.832Z' fill='black'/%3E%3Cpath d='M19.363 9.587L21.838 2.162L14.413 4.637M4.637 14.413L2.162 21.838L9.587 19.363' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, nesw-resize; }
.ft-sel-box.no-resize .ft-handle { display: none; }
/* Figma's edge handles, full-length 8px strips with no paint along each side: in Design a side sizes one axis (left and
   right the width, top and bottom the height), in Scale (K) it scales. The corners come after them in the box, so a
   corner wins where they meet. In Scale every handle takes UI3's scale cursor (cursor-resize-scale), its hotspot at
   the arrow's middle. */
.ft-handle.ft-edge { display: none; background: none; border: 0; }
.ft-handle.ft-edge::before { inset: 0; }
.ft-sel-box:not(.no-resize):not(.is-editing) .ft-edge { display: block; }
/* On a small layer the corners' 15px targets would cover the edges: there they shrink to the 7px squares, so the
   middle of each side is its edge's. */
.ft-sel-box.is-small .ft-handle:not(.ft-edge)::before { inset: 0; }
.ft-n, .ft-s { left: 0; right: 0; width: auto; height: 8px; }
.ft-n { top: -4px; }
.ft-s { bottom: -4px; }
.ft-e, .ft-w { top: 0; bottom: 0; width: 8px; height: auto; }
.ft-e { right: -4px; }
.ft-w { left: -4px; }
/* There the strips would cover most of the layer (all of a 4px bar's middle), so a drag on it would resize rather
   than move it: they sit just outside its sides instead, and the layer's whole body stays draggable, as Figma
   keeps a small or thin layer's body. 9px, as the box's 1px border sits inside the layer. */
.ft-sel-box.is-small .ft-n { top: -9px; }
.ft-sel-box.is-small .ft-s { bottom: -9px; }
.ft-sel-box.is-small .ft-e { right: -9px; }
.ft-sel-box.is-small .ft-w { left: -9px; }
/* The left and right sides' cursor, and the top and bottom's: the corners' two heads turned level or upright, in a 32
   box so they fit, hotspot in the middle, without the line outside each head (her call, 2026-10-17: only Scale's has it). */
html.ft-moving .ft-sel-box .ft-e, html.ft-moving .ft-sel-box .ft-w { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M25.177 15.589A0.46 0.46 0 0 1 25.177 16.411L19.666 19.167A0.46 0.46 0 0 1 19 18.756L19 13.244A0.46 0.46 0 0 1 19.666 12.833ZM6.823 16.411A0.46 0.46 0 0 1 6.823 15.589L12.334 12.833A0.46 0.46 0 0 1 13 13.244L13 18.756A0.46 0.46 0 0 1 12.334 19.167Z' stroke-width='2'/%3E%3C/g%3E%3Cpath d='M25.177 15.589A0.46 0.46 0 0 1 25.177 16.411L19.666 19.167A0.46 0.46 0 0 1 19 18.756L19 13.244A0.46 0.46 0 0 1 19.666 12.833ZM6.823 16.411A0.46 0.46 0 0 1 6.823 15.589L12.334 12.833A0.46 0.46 0 0 1 13 13.244L13 18.756A0.46 0.46 0 0 1 12.334 19.167Z' fill='black'/%3E%3C/svg%3E") 16 16, ew-resize; }
html.ft-moving .ft-sel-box .ft-n, html.ft-moving .ft-sel-box .ft-s { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M15.589 6.823A0.46 0.46 0 0 1 16.411 6.823L19.167 12.334A0.46 0.46 0 0 1 18.756 13L13.244 13A0.46 0.46 0 0 1 12.833 12.334ZM16.411 25.177A0.46 0.46 0 0 1 15.589 25.177L12.833 19.666A0.46 0.46 0 0 1 13.244 19L18.756 19A0.46 0.46 0 0 1 19.167 19.666Z' stroke-width='2'/%3E%3C/g%3E%3Cpath d='M15.589 6.823A0.46 0.46 0 0 1 16.411 6.823L19.167 12.334A0.46 0.46 0 0 1 18.756 13L13.244 13A0.46 0.46 0 0 1 12.833 12.334ZM16.411 25.177A0.46 0.46 0 0 1 15.589 25.177L12.833 19.666A0.46 0.46 0 0 1 13.244 19L18.756 19A0.46 0.46 0 0 1 19.167 19.666Z' fill='black'/%3E%3C/svg%3E") 16 16, ns-resize; }
/* Figma's rotation: a zone just outside each corner (4 to 20px out, under the corner's own target) turns the layer
   about its pivot (the code's transform-origin, its centre unless the code moves it). Her rotate cursor bends away from the selection at each corner (on a turned layer, by the screen corner the zone sits at, data-glyph); while a turn is dragged the
   whole page keeps it (html.ft-turning-*), so it doesn't flicker back to the arrow off the zone. */
.ft-rot { display: none; position: absolute; width: 20px; height: 20px; pointer-events: auto; }
.ft-sel-box.can-rotate:not(.is-editing) .ft-rot { display: block; }
.ft-rot-nw { left: -20px; top: -20px; }
.ft-rot-ne { right: -20px; top: -20px; }
.ft-rot-sw { left: -20px; bottom: -20px; }
.ft-rot-se { right: -20px; bottom: -20px; }
/* While a turn is dragged the selection box's own zones and handles let the pointer through, so crossing another
   corner's zone doesn't swap in that corner's glyph. */
html[class*="ft-turning-"] .ft-sel-box * { pointer-events: none; }
html.ft-moving .ft-sel-box .ft-rot-nw:not([data-glyph]), html.ft-moving .ft-sel-box .ft-rot[data-glyph="nw"], html.ft-moving.ft-turning-nw body * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M20.377 4.339A0.46 0.46 0 0 1 20.377 5.161L14.866 7.917A0.46 0.46 0 0 1 14.2 7.506L14.2 1.994A0.46 0.46 0 0 1 14.866 1.583ZM5.161 20.377A0.46 0.46 0 0 1 4.339 20.377L1.583 14.866A0.46 0.46 0 0 1 1.994 14.2L7.506 14.2A0.46 0.46 0 0 1 7.917 14.866Z' stroke-width='2'/%3E%3Cpath d='M4.75 14.8L4.75 10A5.25 5.25 0 0 1 10 4.75L14.8 4.75' fill='none' stroke-width='3.5'/%3E%3C/g%3E%3Cpath d='M20.377 4.339A0.46 0.46 0 0 1 20.377 5.161L14.866 7.917A0.46 0.46 0 0 1 14.2 7.506L14.2 1.994A0.46 0.46 0 0 1 14.866 1.583ZM5.161 20.377A0.46 0.46 0 0 1 4.339 20.377L1.583 14.866A0.46 0.46 0 0 1 1.994 14.2L7.506 14.2A0.46 0.46 0 0 1 7.917 14.866Z' fill='black'/%3E%3Cpath d='M4.75 14.8L4.75 10A5.25 5.25 0 0 1 10 4.75L14.8 4.75' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, default; }
html.ft-moving .ft-sel-box .ft-rot-ne:not([data-glyph]), html.ft-moving .ft-sel-box .ft-rot[data-glyph="ne"], html.ft-moving.ft-turning-ne body * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M3.623 4.339A0.46 0.46 0 0 0 3.623 5.161L9.134 7.917A0.46 0.46 0 0 0 9.8 7.506L9.8 1.994A0.46 0.46 0 0 0 9.134 1.583ZM18.839 20.377A0.46 0.46 0 0 0 19.661 20.377L22.417 14.866A0.46 0.46 0 0 0 22.006 14.2L16.494 14.2A0.46 0.46 0 0 0 16.083 14.866Z' stroke-width='2'/%3E%3Cpath d='M19.25 14.8L19.25 10A5.25 5.25 0 0 0 14 4.75L9.2 4.75' fill='none' stroke-width='3.5'/%3E%3C/g%3E%3Cpath d='M3.623 4.339A0.46 0.46 0 0 0 3.623 5.161L9.134 7.917A0.46 0.46 0 0 0 9.8 7.506L9.8 1.994A0.46 0.46 0 0 0 9.134 1.583ZM18.839 20.377A0.46 0.46 0 0 0 19.661 20.377L22.417 14.866A0.46 0.46 0 0 0 22.006 14.2L16.494 14.2A0.46 0.46 0 0 0 16.083 14.866Z' fill='black'/%3E%3Cpath d='M19.25 14.8L19.25 10A5.25 5.25 0 0 0 14 4.75L9.2 4.75' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, default; }
html.ft-moving .ft-sel-box .ft-rot-se:not([data-glyph]), html.ft-moving .ft-sel-box .ft-rot[data-glyph="se"], html.ft-moving.ft-turning-se body * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M3.623 19.661A0.46 0.46 0 0 1 3.623 18.839L9.134 16.083A0.46 0.46 0 0 1 9.8 16.494L9.8 22.006A0.46 0.46 0 0 1 9.134 22.417ZM18.839 3.623A0.46 0.46 0 0 1 19.661 3.623L22.417 9.134A0.46 0.46 0 0 1 22.006 9.8L16.494 9.8A0.46 0.46 0 0 1 16.083 9.134Z' stroke-width='2'/%3E%3Cpath d='M19.25 9.2L19.25 14A5.25 5.25 0 0 1 14 19.25L9.2 19.25' fill='none' stroke-width='3.5'/%3E%3C/g%3E%3Cpath d='M3.623 19.661A0.46 0.46 0 0 1 3.623 18.839L9.134 16.083A0.46 0.46 0 0 1 9.8 16.494L9.8 22.006A0.46 0.46 0 0 1 9.134 22.417ZM18.839 3.623A0.46 0.46 0 0 1 19.661 3.623L22.417 9.134A0.46 0.46 0 0 1 22.006 9.8L16.494 9.8A0.46 0.46 0 0 1 16.083 9.134Z' fill='black'/%3E%3Cpath d='M19.25 9.2L19.25 14A5.25 5.25 0 0 1 14 19.25L9.2 19.25' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, default; }
html.ft-moving .ft-sel-box .ft-rot-sw:not([data-glyph]), html.ft-moving .ft-sel-box .ft-rot[data-glyph="sw"], html.ft-moving.ft-turning-sw body * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='white' stroke='white' stroke-linejoin='round' stroke-linecap='round'%3E%3Cpath d='M20.377 19.661A0.46 0.46 0 0 0 20.377 18.839L14.866 16.083A0.46 0.46 0 0 0 14.2 16.494L14.2 22.006A0.46 0.46 0 0 0 14.866 22.417ZM5.161 3.623A0.46 0.46 0 0 0 4.339 3.623L1.583 9.134A0.46 0.46 0 0 0 1.994 9.8L7.506 9.8A0.46 0.46 0 0 0 7.917 9.134Z' stroke-width='2'/%3E%3Cpath d='M4.75 9.2L4.75 14A5.25 5.25 0 0 0 10 19.25L14.8 19.25' fill='none' stroke-width='3.5'/%3E%3C/g%3E%3Cpath d='M20.377 19.661A0.46 0.46 0 0 0 20.377 18.839L14.866 16.083A0.46 0.46 0 0 0 14.2 16.494L14.2 22.006A0.46 0.46 0 0 0 14.866 22.417ZM5.161 3.623A0.46 0.46 0 0 0 4.339 3.623L1.583 9.134A0.46 0.46 0 0 0 1.994 9.8L7.506 9.8A0.46 0.46 0 0 0 7.917 9.134Z' fill='black'/%3E%3Cpath d='M4.75 9.2L4.75 14A5.25 5.25 0 0 0 10 19.25L14.8 19.25' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, default; }
html.ft-moving.ft-scaling .ft-sel-box .ft-handle { cursor: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23f)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.93934 9.93934C8.52513 9.35355 9.47487 9.35355 10.0607 9.93934L11.5607 11.4393C12.1464 12.0251 12.1464 12.9749 11.5607 13.5607L11.1213 14H20.8787L20.4393 13.5607C19.8536 12.9749 19.8536 12.0251 20.4393 11.4393L21.9393 9.93934C22.5251 9.35355 23.4749 9.35355 24.0607 9.93934L28.5607 14.4393C29.1464 15.0251 29.1464 15.9749 28.5607 16.5607L24.0607 21.0607C23.4749 21.6464 22.5251 21.6464 21.9393 21.0607L20.4393 19.5607C19.8536 18.9749 19.8536 18.0251 20.4393 17.4393L20.8787 17H11.1213L11.5607 17.4393C12.1464 18.0251 12.1464 18.9749 11.5607 19.5607L10.0607 21.0607C9.47487 21.6464 8.52513 21.6464 7.93934 21.0607L3.43934 16.5607C2.85355 15.9749 2.85355 15.0251 3.43934 14.4393L7.93934 9.93934Z' fill='white'/%3E%3C/g%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.35355 10.6464C9.54882 10.8417 9.54882 11.1583 9.35355 11.3536L5.20711 15.5L9.35355 19.6464C9.54882 19.8417 9.54882 20.1583 9.35355 20.3536C9.15829 20.5488 8.84171 20.5488 8.64645 20.3536L4.14645 15.8536C3.95118 15.6583 3.95118 15.3417 4.14645 15.1464L8.64645 10.6464C8.84171 10.4512 9.15829 10.4512 9.35355 10.6464ZM22.6464 10.6464C22.8417 10.4512 23.1583 10.4512 23.3536 10.6464L27.8536 15.1464C28.0488 15.3417 28.0488 15.6583 27.8536 15.8536L23.3536 20.3536C23.1583 20.5488 22.8417 20.5488 22.6464 20.3536C22.4512 20.1583 22.4512 19.8417 22.6464 19.6464L26.7929 15.5L22.6464 11.3536C22.4512 11.1583 22.4512 10.8417 22.6464 10.6464ZM10.8536 12.1464C11.0488 12.3417 11.0488 12.6583 10.8536 12.8536L8.70711 15H23.2929L21.1464 12.8536C20.9512 12.6583 20.9512 12.3417 21.1464 12.1464C21.3417 11.9512 21.6583 11.9512 21.8536 12.1464L24.8536 15.1464C25.0488 15.3417 25.0488 15.6583 24.8536 15.8536L21.8536 18.8536C21.6583 19.0488 21.3417 19.0488 21.1464 18.8536C20.9512 18.6583 20.9512 18.3417 21.1464 18.1464L23.2929 16H8.70711L10.8536 18.1464C11.0488 18.3417 11.0488 18.6583 10.8536 18.8536C10.6583 19.0488 10.3417 19.0488 10.1464 18.8536L7.14645 15.8536C6.95118 15.6583 6.95118 15.3417 7.14645 15.1464L10.1464 12.1464C10.3417 11.9512 10.6583 11.9512 10.8536 12.1464Z' fill='black'/%3E%3Cdefs%3E%3Cfilter id='f' x='0' y='7.5' width='32' height='18' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 16 16, ew-resize; }
/* The corners take it turned to their diagonal, 45° (top-left / bottom-right) and −45° (top-right / bottom-left). */
html.ft-moving.ft-scaling .ft-sel-box .ft-nw, html.ft-moving.ft-scaling .ft-sel-box .ft-se { cursor: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23f)'%3E%3Cg transform='rotate(45 16 16)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.93934 9.93934C8.52513 9.35355 9.47487 9.35355 10.0607 9.93934L11.5607 11.4393C12.1464 12.0251 12.1464 12.9749 11.5607 13.5607L11.1213 14H20.8787L20.4393 13.5607C19.8536 12.9749 19.8536 12.0251 20.4393 11.4393L21.9393 9.93934C22.5251 9.35355 23.4749 9.35355 24.0607 9.93934L28.5607 14.4393C29.1464 15.0251 29.1464 15.9749 28.5607 16.5607L24.0607 21.0607C23.4749 21.6464 22.5251 21.6464 21.9393 21.0607L20.4393 19.5607C19.8536 18.9749 19.8536 18.0251 20.4393 17.4393L20.8787 17H11.1213L11.5607 17.4393C12.1464 18.0251 12.1464 18.9749 11.5607 19.5607L10.0607 21.0607C9.47487 21.6464 8.52513 21.6464 7.93934 21.0607L3.43934 16.5607C2.85355 15.9749 2.85355 15.0251 3.43934 14.4393L7.93934 9.93934Z' fill='white'/%3E%3C/g%3E%3C/g%3E%3Cg transform='rotate(45 16 16)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.35355 10.6464C9.54882 10.8417 9.54882 11.1583 9.35355 11.3536L5.20711 15.5L9.35355 19.6464C9.54882 19.8417 9.54882 20.1583 9.35355 20.3536C9.15829 20.5488 8.84171 20.5488 8.64645 20.3536L4.14645 15.8536C3.95118 15.6583 3.95118 15.3417 4.14645 15.1464L8.64645 10.6464C8.84171 10.4512 9.15829 10.4512 9.35355 10.6464ZM22.6464 10.6464C22.8417 10.4512 23.1583 10.4512 23.3536 10.6464L27.8536 15.1464C28.0488 15.3417 28.0488 15.6583 27.8536 15.8536L23.3536 20.3536C23.1583 20.5488 22.8417 20.5488 22.6464 20.3536C22.4512 20.1583 22.4512 19.8417 22.6464 19.6464L26.7929 15.5L22.6464 11.3536C22.4512 11.1583 22.4512 10.8417 22.6464 10.6464ZM10.8536 12.1464C11.0488 12.3417 11.0488 12.6583 10.8536 12.8536L8.70711 15H23.2929L21.1464 12.8536C20.9512 12.6583 20.9512 12.3417 21.1464 12.1464C21.3417 11.9512 21.6583 11.9512 21.8536 12.1464L24.8536 15.1464C25.0488 15.3417 25.0488 15.6583 24.8536 15.8536L21.8536 18.8536C21.6583 19.0488 21.3417 19.0488 21.1464 18.8536C20.9512 18.6583 20.9512 18.3417 21.1464 18.1464L23.2929 16H8.70711L10.8536 18.1464C11.0488 18.3417 11.0488 18.6583 10.8536 18.8536C10.6583 19.0488 10.3417 19.0488 10.1464 18.8536L7.14645 15.8536C6.95118 15.6583 6.95118 15.3417 7.14645 15.1464L10.1464 12.1464C10.3417 11.9512 10.6583 11.9512 10.8536 12.1464Z' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='f' x='0' y='0' width='32' height='32' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 16 16, nwse-resize; }
html.ft-moving.ft-scaling .ft-sel-box .ft-ne, html.ft-moving.ft-scaling .ft-sel-box .ft-sw { cursor: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23f)'%3E%3Cg transform='rotate(-45 16 16)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M7.93934 9.93934C8.52513 9.35355 9.47487 9.35355 10.0607 9.93934L11.5607 11.4393C12.1464 12.0251 12.1464 12.9749 11.5607 13.5607L11.1213 14H20.8787L20.4393 13.5607C19.8536 12.9749 19.8536 12.0251 20.4393 11.4393L21.9393 9.93934C22.5251 9.35355 23.4749 9.35355 24.0607 9.93934L28.5607 14.4393C29.1464 15.0251 29.1464 15.9749 28.5607 16.5607L24.0607 21.0607C23.4749 21.6464 22.5251 21.6464 21.9393 21.0607L20.4393 19.5607C19.8536 18.9749 19.8536 18.0251 20.4393 17.4393L20.8787 17H11.1213L11.5607 17.4393C12.1464 18.0251 12.1464 18.9749 11.5607 19.5607L10.0607 21.0607C9.47487 21.6464 8.52513 21.6464 7.93934 21.0607L3.43934 16.5607C2.85355 15.9749 2.85355 15.0251 3.43934 14.4393L7.93934 9.93934Z' fill='white'/%3E%3C/g%3E%3C/g%3E%3Cg transform='rotate(-45 16 16)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.35355 10.6464C9.54882 10.8417 9.54882 11.1583 9.35355 11.3536L5.20711 15.5L9.35355 19.6464C9.54882 19.8417 9.54882 20.1583 9.35355 20.3536C9.15829 20.5488 8.84171 20.5488 8.64645 20.3536L4.14645 15.8536C3.95118 15.6583 3.95118 15.3417 4.14645 15.1464L8.64645 10.6464C8.84171 10.4512 9.15829 10.4512 9.35355 10.6464ZM22.6464 10.6464C22.8417 10.4512 23.1583 10.4512 23.3536 10.6464L27.8536 15.1464C28.0488 15.3417 28.0488 15.6583 27.8536 15.8536L23.3536 20.3536C23.1583 20.5488 22.8417 20.5488 22.6464 20.3536C22.4512 20.1583 22.4512 19.8417 22.6464 19.6464L26.7929 15.5L22.6464 11.3536C22.4512 11.1583 22.4512 10.8417 22.6464 10.6464ZM10.8536 12.1464C11.0488 12.3417 11.0488 12.6583 10.8536 12.8536L8.70711 15H23.2929L21.1464 12.8536C20.9512 12.6583 20.9512 12.3417 21.1464 12.1464C21.3417 11.9512 21.6583 11.9512 21.8536 12.1464L24.8536 15.1464C25.0488 15.3417 25.0488 15.6583 24.8536 15.8536L21.8536 18.8536C21.6583 19.0488 21.3417 19.0488 21.1464 18.8536C20.9512 18.6583 20.9512 18.3417 21.1464 18.1464L23.2929 16H8.70711L10.8536 18.1464C11.0488 18.3417 11.0488 18.6583 10.8536 18.8536C10.6583 19.0488 10.3417 19.0488 10.1464 18.8536L7.14645 15.8536C6.95118 15.6583 6.95118 15.3417 7.14645 15.1464L10.1464 12.1464C10.3417 11.9512 10.6583 11.9512 10.8536 12.1464Z' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='f' x='0' y='0' width='32' height='32' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1.5'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 16 16, nesw-resize; }
/* Figma's spacing: 8 below the selection, 6 either side of the numbers. */
.ft-size-label {
  position: absolute; left: 50%; top: calc(100% + 8px); transform: translateX(-50%);
  padding: 0 6px; border-radius: 2px; background: var(--ft-blue); color: var(--ft-on-dark); white-space: nowrap;
  font: 500 11px/16px "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
/* A component (componentOf), as Figma shows one: its outline, corners and size label in Figma's component purple,
   and its name with the component mark over its top left. Design only; Motion keeps its own accent. */
.ft-sel-box.is-comp, .ft-hover-box.is-comp, .ft-sel-box.is-comp .ft-handle { border-color: var(--ft-purple); }
.ft-sel-box.is-comp .ft-size-label { background: var(--ft-purple); }
.ft-comp-label {
  position: absolute; left: -1px; bottom: calc(100% + 4px); display: flex; align-items: center; gap: 4px;
  color: var(--ft-purple); white-space: nowrap; font: 500 11px/16px "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-comp-label[hidden] { display: none; }
.ft-comp-label svg { display: block; width: 24px; height: 24px; margin: -6px; }
/* Figma's canvas cursor while finetune is on, so it reads as its own mode: UI3's Move tool arrow (icon.24.move),
   black with its white rim, the tip at 5 5. */
html.ft-moving body *:not(input) { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M20.9986 11.183C20.9664 12.0324 20.4007 12.7687 19.5882 13.0187L14.5645 14.5645L13.0188 19.5882C12.7688 20.4007 12.0325 20.9663 11.183 20.9986C10.3336 21.0308 9.55653 20.5225 9.2457 19.7313L4.13856 6.7313C3.84765 5.99082 4.02329 5.14834 4.58584 4.58578C5.1484 4.02323 5.99088 3.84759 6.73136 4.13849L19.7314 9.24564C20.5226 9.55647 21.0308 10.3335 20.9986 11.183Z' fill='white'/%3E%3Cpath d='M13.7644 13.7644L12.063 19.2941C11.938 19.7003 11.5698 19.9832 11.1451 19.9993C10.7204 20.0154 10.3319 19.7613 10.1764 19.3656L5.06931 6.36565C4.92386 5.99541 5.01167 5.57417 5.29295 5.29289C5.57423 5.01161 5.99547 4.92379 6.36571 5.06925L19.3657 10.1764C19.7613 10.3318 20.0155 10.7203 19.9993 11.145C19.9832 11.5698 19.7004 11.9379 19.2941 12.0629L13.7644 13.7644Z' fill='black'/%3E%3C/svg%3E") 5 5, default; }
html.ft-moving [data-ft-editing], html.ft-moving [data-ft-editing] * { cursor: text; }
[data-ft-editing] { outline: none; }
/* A layer being read or dragged runs no transitions, so an edit lands at once (see still()). */
[data-ft-still], [data-ft-still] * { transition: none !important; }
/* A deleted layer (Delete or Backspace) is only hidden: the live page is never taken apart (that breaks a React page). */
[data-ft-deleted] { display: none !important; }
/* An ungrouped container (⇧⌘G on a code group) loses its box but stays in the DOM, for the same reason. */
[data-ft-ungrouped] { display: contents !important; }

/* Clear of the rail (12 in, 50 wide) by 8, so its Copy, Save and Reset stay in reach. */
.ft-panel {
  position: fixed; top: 16px; left: 70px; z-index: 2147483647;
  width: 280px; max-height: calc(100vh - 32px); overflow: auto;
  background: var(--ft-i-bg); color: var(--ft-i-text);
  border: 1px solid var(--ft-i-border); border-radius: 8px;
  font: 12px/1.4 "Inter", system-ui, -apple-system, sans-serif;
  box-shadow: var(--ft-elev-400);
}
.ft-panel[hidden] { display: none; }
.ft-panel *, .ft-panel *::before, .ft-panel *::after { box-sizing: border-box; }
.ft-panel button, .ft-panel input, .ft-panel textarea { font: inherit; color: inherit; margin: 0; }
.ft-head {
  padding: 8px 12px; border-bottom: 1px solid var(--ft-i-line);
  font-weight: 600; cursor: grab; user-select: none; touch-action: none;
}
.ft-head:active { cursor: grabbing; }
.ft-body { padding: 4px 12px; }
.ft-row { padding: 6px 0; }
.ft-label { margin-bottom: 4px; color: var(--ft-i-text-2); }
.ft-line { display: flex; gap: 8px; align-items: center; }
.ft-line input[type="range"] { flex: 1; min-width: 0; }
.ft-num { width: 72px; }
.ft-field { width: 100%; }
.ft-panel input[type="number"], .ft-panel input[type="text"], .ft-panel textarea {
  background: var(--ft-i-field); border: 1px solid var(--ft-i-line); border-radius: 5px; padding: 3px 6px;
}
.ft-grid { display: grid; gap: 4px; }
/* A select chip's label stays on one line, so no chip makes its row taller than the rest. The tuner drops columns
   when the widest label won't fit; the ellipsis is only for a label wider than the whole panel. */
.ft-grid > .ft-btn { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ft-btn {
  background: var(--ft-i-field); border: 1px solid var(--ft-i-line); border-radius: 5px;
  padding: 4px 6px; cursor: pointer;
}
.ft-btn:hover { background: var(--ft-i-press); }
.ft-btn[aria-pressed="true"] { background: var(--ft-i-inverse); color: var(--ft-i-on-inverse); border-color: var(--ft-i-inverse); }
.ft-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.ft-chip { width: 20px; height: 20px; padding: 0; border: 1px solid var(--ft-i-line); border-radius: 50%; cursor: pointer; }
.ft-chip[aria-pressed="true"] { outline: 2px solid var(--ft-i-text); outline-offset: 1px; }
.ft-presets, .ft-foot { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px 12px; border-top: 1px solid var(--ft-i-line); }
.ft-out {
  display: block; width: calc(100% - 24px); height: 120px; margin: 0 12px 12px;
  resize: vertical;
}
.ft-out[hidden] { display: none; }
/* T dims the panels to 20% and lets the pointer through them, to see and pick what they cover: the page doesn't
   zoom out from under them as Figma's canvas would (her ask, 2026-10-17). */
html.ft-dim :is(.ft-inspector, .ft-toolbar, .ft-ui, .ft-resources, .ft-panel) { opacity: 0.2; }
html.ft-dim :is(.ft-inspector, .ft-toolbar, .ft-ui, .ft-resources, .ft-panel), html.ft-dim :is(.ft-inspector, .ft-toolbar, .ft-ui, .ft-resources, .ft-panel) * { pointer-events: none !important; }
/* E hides the panels while editing goes on (her ask, 2026-10-19). Hidden rather than taken out, so the panel keeps its
   layout for when it comes back. */
html.ft-bare :is(.ft-inspector, .ft-toolbar, .ft-ui, .ft-resources, .ft-resources-menu, .ft-shortcuts, .ft-panel, .ft-pop), html.ft-bare :is(.ft-inspector, .ft-toolbar, .ft-ui, .ft-resources, .ft-resources-menu, .ft-shortcuts, .ft-panel, .ft-pop) * { visibility: hidden !important; }
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
    // As Figma's chrome: a mouse click doesn't leave the button focused, so a later Space or Enter (meant for
    // the page) can't press it again. A keyboard press (detail 0) keeps focus; so does a click that moved it on.
    b.addEventListener("click", (e) => {
      if (e.detail > 0 && document.activeElement === b) b.blur();
    });
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
    // A key typed in a web component's field reaches document with the component as its target:
    // follow focus down through open shadow roots to the field itself.
    while (t && t.shadowRoot && t.shadowRoot.activeElement) t = t.shadowRoot.activeElement;
    return !!t &&(t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  }

  // Icons are Figma UI3's (the UI3 kit's Icons page) unless a comment says otherwise: 24 frames drawn
  // at 1:1, painted with currentColor, never scaled; a smaller slot centres them with negative margins
  // (PANEL LOOK). The comment names the UI3 icon; mirrored ones are flipped across their middle.
  // check16 is the kit's 16 frame, because the checkbox it sits in is 16.
  // floppyDisk, undo and redo are Phosphor (MIT), nested at 16 inside the 24 frame. Undo and redo sit 8 units
  // low (half a pixel at 16px): their ink spans 32 to 208, so drawn as is they ride above the button's middle.
  // Flow's four (flowFree, flowVertical, flowHorizontal, flowGrid) are composed from UI3 pieces, since
  // the kit has no symbol for Figma's 2025 Flow row: autolayout-wrap's rounded squares in its slots
  // (6,6) (13,6) (6,13) (13,13), Freeform's top right one at (13,8), and a 1px arrow with a compact
  // 2px chevron head, at the kit's 1px weight.
  const ICON = {
    // finetune's own mark (the "ft" ligature, her final marks, 2026-10-15; the geometry is hers, untouched): the
    // outline as a 1px line at any size (non-scaling), so it draws like the kit's 1px icons beside it, and the fill
    // mark, which the rail shows on hover (.ft-logo-fill).
    logo: '<svg class="ft-ico" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path class="ft-logo-fill" d="M 26.00 24.08 A 19.20 19.20 0 0 1 45.20 4.88 L 48.88 4.88 A 4.00 4.00 0 0 1 52.88 8.88 L 52.88 12.40 A 4.00 4.00 0 0 0 56.88 16.40 L 60.40 16.40 A 4.00 4.00 0 0 1 64.40 20.40 L 64.40 40.24 A 4.00 4.00 0 0 0 68.40 44.24 L 81.52 44.24 A 4.00 4.00 0 0 1 85.52 48.24 L 85.52 51.76 A 4.00 4.00 0 0 1 81.52 55.76 L 68.40 55.76 A 4.00 4.00 0 0 0 64.40 59.76 L 64.40 75.92 A 7.68 7.68 0 0 0 72.08 83.60 L 75.76 83.60 A 4.00 4.00 0 0 1 79.76 87.60 L 79.76 91.12 A 4.00 4.00 0 0 1 75.76 95.12 L 72.08 95.12 A 19.20 19.20 0 0 1 52.88 75.92 L 52.88 59.76 A 4.00 4.00 0 0 0 48.88 55.76 L 41.52 55.76 A 4.00 4.00 0 0 0 37.52 59.76 L 37.52 79.60 A 4.00 4.00 0 0 1 33.52 83.60 L 30.00 83.60 A 4.00 4.00 0 0 1 26.00 79.60 L 26.00 59.76 A 4.00 4.00 0 0 0 22.00 55.76 L 18.48 55.76 A 4.00 4.00 0 0 1 14.48 51.76 L 14.48 48.24 A 4.00 4.00 0 0 1 18.48 44.24 L 22.00 44.24 A 4.00 4.00 0 0 0 26.00 40.24 L 26.00 24.08 Z M 37.52 40.24 L 37.52 24.08 A 7.68 7.68 0 0 1 45.20 16.40 L 48.88 16.40 A 4.00 4.00 0 0 1 52.88 20.40 L 52.88 40.24 A 4.00 4.00 0 0 1 48.88 44.24 L 41.52 44.24 A 4.00 4.00 0 0 1 37.52 40.24 Z" fill="currentColor" fill-rule="evenodd"/><path class="ft-logo-line" d="M 26.00 24.08 A 19.20 19.20 0 0 1 45.20 4.88 L 48.88 4.88 A 4.00 4.00 0 0 1 52.88 8.88 L 52.88 12.40 A 4.00 4.00 0 0 1 48.88 16.40 L 45.20 16.40 A 7.68 7.68 0 0 0 37.52 24.08 L 37.52 40.24 A 4.00 4.00 0 0 0 41.52 44.24 L 48.88 44.24 A 4.00 4.00 0 0 0 52.88 40.24 L 52.88 28.08 A 4.00 4.00 0 0 1 56.88 24.08 L 60.40 24.08 A 4.00 4.00 0 0 1 64.40 28.08 L 64.40 40.24 A 4.00 4.00 0 0 0 68.40 44.24 L 81.52 44.24 A 4.00 4.00 0 0 1 85.52 48.24 L 85.52 51.76 A 4.00 4.00 0 0 1 81.52 55.76 L 68.40 55.76 A 4.00 4.00 0 0 0 64.40 59.76 L 64.40 75.92 A 7.68 7.68 0 0 0 72.08 83.60 L 75.76 83.60 A 4.00 4.00 0 0 1 79.76 87.60 L 79.76 91.12 A 4.00 4.00 0 0 1 75.76 95.12 L 72.08 95.12 A 19.20 19.20 0 0 1 52.88 75.92 L 52.88 59.76 A 4.00 4.00 0 0 0 48.88 55.76 L 41.52 55.76 A 4.00 4.00 0 0 0 37.52 59.76 L 37.52 79.60 A 4.00 4.00 0 0 1 33.52 83.60 L 30.00 83.60 A 4.00 4.00 0 0 1 26.00 79.60 L 26.00 59.76 A 4.00 4.00 0 0 0 22.00 55.76 L 18.48 55.76 A 4.00 4.00 0 0 1 14.48 51.76 L 14.48 48.24 A 4.00 4.00 0 0 1 18.48 44.24 L 22.00 44.24 A 4.00 4.00 0 0 0 26.00 40.24 L 26.00 24.08 Z" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" stroke-linejoin="miter" stroke-linecap="butt"/></svg>',
    // icon.24.help (Help and resources), from the kit
    help: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 13.5V14C11.5 14.2761 11.7239 14.5 12 14.5C12.2761 14.5 12.5 14.2761 12.5 14V13.5C12.5 12.9813 12.9629 12.5024 13.6777 12.1523C14.4706 11.7641 15 11.0383 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 10.2761 9.22386 10.5 9.5 10.5C9.77614 10.5 10 10.2761 10 10C10 8.89543 10.8954 8 12 8C13.1046 8 14 8.89543 14 10C14 10.6352 13.707 11.024 13.2373 11.2539C12.4642 11.6325 11.5 12.362 11.5 13.5ZM12 17C12.4142 17 12.75 16.6642 12.75 16.25C12.75 15.8358 12.4142 15.5 12 15.5C11.5858 15.5 11.25 15.8358 11.25 16.25C11.25 16.6642 11.5858 17 12 17Z" fill="currentColor"/></svg>',
    // rotation
    angle: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 8.5C9 8.22386 8.77614 8 8.5 8C8.22386 8 8 8.22386 8 8.5V15.5C8 15.7761 8.22386 16 8.5 16H15.5C15.7761 16 16 15.7761 16 15.5C16 15.2239 15.7761 15 15.5 15H13C13 12.7909 11.2091 11 9 11V8.5ZM9 12V15H12C12 13.3431 10.6569 12 9 12Z" fill="currentColor"/></svg>',
    // rotate
    arrowClockwise: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2322 6.47491C11.2085 5.4986 12.7915 5.4986 13.7678 6.47491L15.2929 8.00003H14C13.7239 8.00003 13.5 8.22389 13.5 8.50003C13.5 8.77618 13.7239 9.00003 14 9.00003H16.5C16.7761 9.00003 17 8.77618 17 8.50003V6.00003C17 5.72389 16.7761 5.50003 16.5 5.50003C16.2239 5.50003 16 5.72389 16 6.00003V7.29293L14.4749 5.7678C13.108 4.40097 10.892 4.40097 9.52513 5.7678L7.14645 8.14648C6.95118 8.34174 6.95118 8.65833 7.14645 8.85359C7.34171 9.04885 7.65829 9.04885 7.85355 8.85359L10.2322 6.47491ZM13.0607 9.64648C12.4749 9.0607 11.5251 9.06069 10.9393 9.64648L7.64645 12.9394C7.06066 13.5252 7.06066 14.4749 7.64645 15.0607L10.9393 18.3536C11.5251 18.9394 12.4749 18.9394 13.0607 18.3536L16.3536 15.0607C16.9393 14.4749 16.9393 13.5252 16.3536 12.9394L13.0607 9.64648ZM11.6464 10.3536C11.8417 10.1583 12.1583 10.1583 12.3536 10.3536L15.6464 13.6465C15.8417 13.8417 15.8417 14.1583 15.6464 14.3536L12.3536 17.6465C12.1583 17.8417 11.8417 17.8417 11.6464 17.6465L8.35355 14.3536C8.15829 14.1583 8.15829 13.8417 8.35355 13.6465L11.6464 10.3536Z" fill="currentColor"/></svg>',
    // restart (her pick for Reset)
    refresh: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.85355 5.85355C9.04882 5.65829 9.04882 5.34171 8.85355 5.14645C8.65829 4.95118 8.34171 4.95118 8.14645 5.14645L5.14645 8.14645C4.95118 8.34171 4.95118 8.65829 5.14645 8.85355L8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536C9.04882 11.6583 9.04882 11.3417 8.85355 11.1464L6.70711 9H13.9999C16.2091 9 17.9999 10.7909 17.9999 13C17.9999 15.2091 16.2091 17 13.9999 17C12.2832 17 10.8191 15.9186 10.2517 14.3998C10.17 14.1812 9.96929 14.0226 9.73602 14.0226C9.41028 14.0226 9.1658 14.3231 9.27201 14.6311C9.94825 16.5916 11.8096 18 13.9999 18C16.7614 18 18.9999 15.7614 18.9999 13C18.9999 10.2391 16.7623 8.00091 14.0016 8C14.0011 8 14.0005 8 14 8H13.9999H6.70711L8.85355 5.85355Z" fill="currentColor"/></svg>',
    // blendmode.small
    drop: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 15.9999C13.6569 15.9999 15 14.6567 15 12.9999C15 12.1735 14.58 11.0112 13.9224 9.75417C13.3085 8.58051 12.5596 7.45671 12 6.67141C11.4404 7.45671 10.6915 8.58051 10.0776 9.75417C9.42004 11.0112 9 12.1735 9 12.9999C9 14.6567 10.3431 15.9999 12 15.9999ZM12 16.9999C14.2091 16.9999 16 15.209 16 12.9999C16 10.8296 13.9066 7.61254 12.7486 5.99911C12.375 5.47849 11.625 5.47849 11.2514 5.99911C10.0934 7.61254 8 10.8296 8 12.9999C8 15.209 9.79086 16.9999 12 16.9999Z" fill="currentColor"/></svg>',
    // opacity
    checkerboard: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 7H16C16.5523 7 17 7.44772 17 8V16C17 16.5523 16.5523 17 16 17H8C7.44772 17 7 16.5523 7 16V8C7 7.44772 7.44772 7 8 7ZM6 8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8ZM15 9.5C15.2761 9.5 15.5 9.27614 15.5 9C15.5 8.72386 15.2761 8.5 15 8.5C14.7239 8.5 14.5 8.72386 14.5 9C14.5 9.27614 14.7239 9.5 15 9.5ZM13.5 11C13.5 11.2761 13.2761 11.5 13 11.5C12.7239 11.5 12.5 11.2761 12.5 11C12.5 10.7239 12.7239 10.5 13 10.5C13.2761 10.5 13.5 10.7239 13.5 11ZM11.5 13C11.5 13.2761 11.2761 13.5 11 13.5C10.7239 13.5 10.5 13.2761 10.5 13C10.5 12.7239 10.7239 12.5 11 12.5C11.2761 12.5 11.5 12.7239 11.5 13ZM9.5 15C9.5 15.2761 9.27614 15.5 9 15.5C8.72386 15.5 8.5 15.2761 8.5 15C8.5 14.7239 8.72386 14.5 9 14.5C9.27614 14.5 9.5 14.7239 9.5 15ZM11 15.5C11.2761 15.5 11.5 15.2761 11.5 15C11.5 14.7239 11.2761 14.5 11 14.5C10.7239 14.5 10.5 14.7239 10.5 15C10.5 15.2761 10.7239 15.5 11 15.5ZM13 13.5C13.2761 13.5 13.5 13.2761 13.5 13C13.5 12.7239 13.2761 12.5 13 12.5C12.7239 12.5 12.5 12.7239 12.5 13C12.5 13.2761 12.7239 13.5 13 13.5ZM13.5 15C13.5 15.2761 13.2761 15.5 13 15.5C12.7239 15.5 12.5 15.2761 12.5 15C12.5 14.7239 12.7239 14.5 13 14.5C13.2761 14.5 13.5 14.7239 13.5 15ZM15.5 11C15.5 11.2761 15.2761 11.5 15 11.5C14.7239 11.5 14.5 11.2761 14.5 11C14.5 10.7239 14.7239 10.5 15 10.5C15.2761 10.5 15.5 10.7239 15.5 11ZM15 13.5C15.2761 13.5 15.5 13.2761 15.5 13C15.5 12.7239 15.2761 12.5 15 12.5C14.7239 12.5 14.5 12.7239 14.5 13C14.5 13.2761 14.7239 13.5 15 13.5ZM15.5 15C15.5 15.2761 15.2761 15.5 15 15.5C14.7239 15.5 14.5 15.2761 14.5 15C14.5 14.7239 14.7239 14.5 15 14.5C15.2761 14.5 15.5 14.7239 15.5 15Z" fill="currentColor"/></svg>',
    // radius.top.left
    radius: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4781 8L12.5 8H15.5C15.7761 8 16 8.22386 16 8.5C16 8.77614 15.7761 9 15.5 9H12.5C11.7917 9 11.2905 9.00039 10.8987 9.0324C10.5128 9.06393 10.2772 9.12365 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9.12365 10.2772 9.06393 10.5128 9.0324 10.8987C9.00039 11.2905 9 11.7917 9 12.5V15.5C9 15.7761 8.77614 16 8.5 16C8.22386 16 8 15.7761 8 15.5V12.5L8 12.4781C8 11.7966 7.99999 11.2546 8.03572 10.8173C8.07231 10.3695 8.14884 9.98765 8.32698 9.63803C8.6146 9.07354 9.07354 8.6146 9.63803 8.32698C9.98765 8.14884 10.3695 8.07231 10.8173 8.03572C11.2546 7.99999 11.7966 8 12.4781 8Z" fill="currentColor"/></svg>',
    // corners
    corners: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.90012 6H8.87947H8.87865C8.47653 6 8.14462 6 7.87421 6.02209C7.59315 6.04506 7.33481 6.09435 7.09215 6.21799C6.71582 6.40973 6.40985 6.7157 6.21811 7.09203C6.09447 7.33469 6.04518 7.59303 6.02222 7.87408C6.00012 8.1445 6.00012 8.47641 6.00012 8.87852V8.87935V8.89999V9.5C6.00012 9.77614 6.22398 10 6.50012 10C6.77626 10 7.00012 9.77614 7.00012 9.5V8.89999C7.00012 8.47171 7.0005 8.18056 7.01889 7.95552C7.0368 7.73631 7.06927 7.62421 7.10912 7.54601C7.20499 7.35785 7.35797 7.20486 7.54613 7.10899C7.62433 7.06915 7.73643 7.03668 7.95564 7.01877C8.18068 7.00038 8.47183 7 8.90012 7H9.50012C9.77626 7 10.0001 6.77614 10.0001 6.5C10.0001 6.22386 9.77626 6 9.50012 6H8.90012ZM15.1 6H15.1207H15.1215C15.5236 6 15.8555 6 16.1259 6.02209C16.407 6.04506 16.6653 6.09435 16.908 6.21799C17.2843 6.40973 17.5903 6.7157 17.782 7.09203C17.9057 7.33469 17.9549 7.59303 17.9779 7.87408C18 8.1445 18 8.47641 18 8.87852V8.87935V8.89999V9.5C18 9.77614 17.7761 10 17.5 10C17.2239 10 17 9.77614 17 9.5V8.89999C17 8.47171 16.9996 8.18056 16.9812 7.95552C16.9633 7.73631 16.9308 7.62421 16.891 7.54601C16.7951 7.35785 16.6422 7.20486 16.454 7.10899C16.3758 7.06915 16.2637 7.03668 16.0445 7.01877C15.8194 7.00038 15.5283 7 15.1 7H14.5C14.2239 7 14 6.77614 14 6.5C14 6.22386 14.2239 6 14.5 6H15.1ZM15.1207 18H15.1H14.5C14.2239 18 14 17.7761 14 17.5C14 17.2239 14.2239 17 14.5 17H15.1C15.5283 17 15.8194 16.9996 16.0445 16.9812C16.2637 16.9633 16.3758 16.9308 16.454 16.891C16.6422 16.7951 16.7951 16.6422 16.891 16.454C16.9308 16.3758 16.9633 16.2637 16.9812 16.0445C16.9996 15.8194 17 15.5283 17 15.1V14.5C17 14.2239 17.2239 14 17.5 14C17.7761 14 18 14.2239 18 14.5V15.1V15.1207V15.1215C18 15.5236 18 15.8555 17.9779 16.1259C17.9549 16.407 17.9057 16.6653 17.782 16.908C17.5903 17.2843 17.2843 17.5903 16.908 17.782C16.6653 17.9057 16.407 17.9549 16.1259 17.9779C15.8555 18 15.5236 18 15.1215 18H15.1207ZM8.89999 18H8.87935H8.87852C8.47641 18 8.1445 18 7.87408 17.9779C7.59303 17.9549 7.33469 17.9057 7.09203 17.782C6.7157 17.5903 6.40973 17.2843 6.21799 16.908C6.09435 16.6653 6.04506 16.407 6.02209 16.1259C6 15.8555 6 15.5236 6 15.1215V15.1207V15.1V14.5C6 14.2239 6.22386 14 6.5 14C6.77614 14 7 14.2239 7 14.5V15.1C7 15.5283 7.00038 15.8194 7.01877 16.0445C7.03668 16.2637 7.06915 16.3758 7.10899 16.454C7.20486 16.6422 7.35785 16.7951 7.54601 16.891C7.62421 16.9308 7.73631 16.9633 7.95552 16.9812C8.18056 16.9996 8.47171 17 8.89999 17H9.5C9.77614 17 10 17.2239 10 17.5C10 17.7761 9.77614 18 9.5 18H8.89999Z" fill="currentColor"/></svg>',
    // Phosphor's floppy disk (UI3 has none; her pick for Save to this browser), at its 16 inside UI3's 24 frame
    floppyDisk: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><svg x="4" y="4" width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M217.9,73.42,182.58,38.1a13.9,13.9,0,0,0-9.89-4.1H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V83.31A13.9,13.9,0,0,0,217.9,73.42ZM170,210H86V152a2,2,0,0,1,2-2h80a2,2,0,0,1,2,2Zm40-2a2,2,0,0,1-2,2H182V152a14,14,0,0,0-14-14H88a14,14,0,0,0-14,14v58H48a2,2,0,0,1-2-2V48a2,2,0,0,1,2-2H172.69a2,2,0,0,1,1.41.58L209.42,81.9a2,2,0,0,1,.58,1.41ZM158,72a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h56A6,6,0,0,1,158,72Z"/></svg></svg>',
    // Phosphor's U-turn arrow (UI3 has no undo or redo), at its 16 inside UI3's 24 frame
    undo: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><svg x="4" y="4" width="16" height="16" viewBox="0 -8 256 256" fill="currentColor"><path d="M232,144a64.07,64.07,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H51.31l34.35,34.34a8,8,0,0,1-11.32,11.32l-48-48a8,8,0,0,1,0-11.32l48-48A8,8,0,0,1,85.66,45.66L51.31,80H168A64.07,64.07,0,0,1,232,144Z"/></svg></svg>',
    // Phosphor's U-turn arrow (UI3 has no undo or redo), at its 16 inside UI3's 24 frame
    redo: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><svg x="4" y="4" width="16" height="16" viewBox="0 -8 256 256" fill="currentColor"><path d="M170.34,130.34,204.69,96H88a48,48,0,0,0,0,96h88a8,8,0,0,1,0,16H88A64,64,0,0,1,88,80H204.69L170.34,45.66a8,8,0,0,1,11.32-11.32l48,48a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32-11.32Z"/></svg></svg>',
    // warning.small
    warning: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2568 6.05903L5.21667 15.0193C4.46674 16.3525 5.43016 17.9998 6.95982 17.9998H17.0401C18.5697 17.9998 19.5331 16.3525 18.7832 15.0193L13.7431 6.05904C12.9785 4.69973 11.0214 4.69972 10.2568 6.05903ZM11.1284 6.54929L6.08824 15.5096C5.71328 16.1762 6.19499 16.9998 6.95982 16.9998H17.0401C17.8049 16.9998 18.2866 16.1762 17.9116 15.5096L12.8715 6.54929C12.4892 5.86964 11.5107 5.86964 11.1284 6.54929ZM11.9999 8.49976C12.2761 8.49976 12.4999 8.72361 12.4999 8.99976V12.4998C12.4999 12.7759 12.2761 12.9998 11.9999 12.9998C11.7238 12.9998 11.4999 12.7759 11.4999 12.4998V8.99976C11.4999 8.72361 11.7238 8.49976 11.9999 8.49976ZM12.7499 14.7532C12.7499 15.1674 12.4142 15.5032 11.9999 15.5032C11.5857 15.5032 11.2499 15.1674 11.2499 14.7532C11.2499 14.339 11.5857 14.0032 11.9999 14.0032C12.4142 14.0032 12.7499 14.339 12.7499 14.7532Z" fill="currentColor"/></svg>',
    // trash
    trash: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 6C10 5.44771 10.4477 5 11 5H13C13.5523 5 14 5.44771 14 6H10ZM9 6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6H17.5C18.3284 6 19 6.67157 19 7.5C19 8.16678 18.565 8.73193 17.9632 8.92711L17.122 18.1811C17.0283 19.2112 16.1646 20 15.1302 20H8.86983C7.83542 20 6.97168 19.2112 6.87804 18.1811L6.03677 8.92711C5.43504 8.73193 5 8.16678 5 7.5C5 6.67157 5.67157 6 6.5 6H9ZM17.4942 8H17.5027C17.7776 7.99855 18 7.77524 18 7.5C18 7.22386 17.7761 7 17.5 7H14.5H9.5H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77524 6.22241 7.99855 6.49731 8H6.50578H17.4942ZM16.9525 9H7.04752L7.87393 18.0905C7.92076 18.6056 8.35262 19 8.86983 19H15.1302C15.6474 19 16.0792 18.6056 16.1261 18.0905L16.9525 9ZM11 11.5C11 11.2239 10.7761 11 10.5 11C10.2239 11 10 11.2239 10 11.5V16.5C10 16.7761 10.2239 17 10.5 17C10.7761 17 11 16.7761 11 16.5V11.5ZM14 11.5C14 11.2239 13.7761 11 13.5 11C13.2239 11 13 11.2239 13 11.5V16.5C13 16.7761 13.2239 17 13.5 17C13.7761 17 14 16.7761 14 16.5V11.5Z" fill="currentColor"/></svg>',
    // save
    bookmark: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.0858L12.7071 16.7929L16 20.0858V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5L8 20.0858L11.2929 16.7929L12 16.0858ZM12.7071 18.2071L15.2929 20.7929C15.9229 21.4229 17 20.9767 17 20.0858V5C17 3.89543 16.1046 3 15 3H9C7.89543 3 7 3.89543 7 5V20.0858C7 20.9767 8.07714 21.4229 8.70711 20.7929L11.2929 18.2071L12 17.5L12.7071 18.2071Z" fill="currentColor"/></svg>',
    // effects.small
    sun: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1056 5.55279C10.275 5.214 10.6212 5 11 5H15C15.3603 5 15.6927 5.19379 15.8702 5.5073C16.0477 5.82081 16.0429 6.20557 15.8575 6.5145L13.7662 10H16C16.4045 10 16.7691 10.2436 16.9239 10.6173C17.0787 10.991 16.9931 11.4211 16.7071 11.7071L9.70711 18.7071C9.37139 19.0428 8.84588 19.0962 8.44951 18.8348C8.05314 18.5735 7.89519 18.0694 8.07152 17.6286L9.52297 14H7.5C7.15342 14 6.83156 13.8205 6.64935 13.5257C6.46714 13.2309 6.45058 12.8628 6.60557 12.5528L10.1056 5.55279ZM9.92297 13H11L10.6 14L9.94281 15.643L9 18L10.7951 16.2049L15 12L16 11H14.5858H13.1662H12L12.6 10L14.4 7L15 6H13.8338H11L8 12L7.5 13H8.61804H9.92297Z" fill="currentColor"/></svg>',
    // adjust
    slidersHorizontal: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 4.5C7 4.22386 7.22386 4 7.5 4C7.77614 4 8 4.22386 8 4.5V12C8 12.0167 7.99918 12.0332 7.99758 12.0495C9.1399 12.2802 10 13.2897 10 14.5C10 15.7103 9.1399 16.7198 7.99758 16.9505C7.99918 16.9668 8 16.9833 8 17V19.5C8 19.7761 7.77614 20 7.5 20C7.22386 20 7 19.7761 7 19.5V17C7 16.9833 7.00082 16.9668 7.00242 16.9505C5.86009 16.7198 5 15.7103 5 14.5C5 13.2897 5.86009 12.2802 7.00242 12.0495C7.00082 12.0332 7 12.0167 7 12V4.5ZM9 14.5C9 15.3284 8.32843 16 7.5 16C6.67157 16 6 15.3284 6 14.5C6 13.6716 6.67157 13 7.5 13C8.32843 13 9 13.6716 9 14.5ZM16 19.5C16 19.7761 16.2239 20 16.5 20C16.7761 20 17 19.7761 17 19.5V12C17 11.9833 16.9992 11.9668 16.9976 11.9505C18.1399 11.7198 19 10.7103 19 9.5C19 8.28967 18.1399 7.28022 16.9976 7.04952C16.9992 7.03323 17 7.01671 17 7V4.5C17 4.22386 16.7761 4 16.5 4C16.2239 4 16 4.22386 16 4.5V7C16 7.01671 16.0008 7.03323 16.0024 7.04952C14.8601 7.28022 14 8.28967 14 9.5C14 10.7103 14.8601 11.7198 16.0024 11.9505C16.0008 11.9668 16 11.9833 16 12V19.5ZM18 9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5C15 10.3284 15.6716 11 16.5 11C17.3284 11 18 10.3284 18 9.5Z" fill="currentColor"/></svg>',
    // design
    pencilRuler: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.35986 5.69366L10.851 10.1441L10.8526 10.1457C11.0484 10.0521 11.2676 9.99972 11.499 9.99972C12.3274 9.99972 12.999 10.6713 12.999 11.4997C12.999 12.3281 12.3274 12.9997 11.499 12.9997C10.6706 12.9997 9.999 12.3281 9.999 11.4997C9.999 11.268 10.0515 11.0486 10.1453 10.8527L5.72664 6.474L7.61052 13.0614L7.61559 13.0791L7.61934 13.0971C8.05545 15.1959 9.91152 16.7711 12.1321 16.7711C12.5159 16.7711 12.8881 16.7241 13.2436 16.6359C13.6226 16.5419 14.0555 16.6279 14.361 16.9341L15.5777 18.1537C15.8699 18.4466 16.3431 18.4466 16.6353 18.1537L18.1544 16.631C18.4472 16.3375 18.4472 15.861 18.1544 15.5674L16.9162 14.3262C16.6149 14.0242 16.5279 13.5982 16.6169 13.2232C16.6985 12.879 16.7419 12.5194 16.7419 12.1491C16.7419 9.99433 15.2711 8.18388 13.2821 7.67193L13.2693 7.66863L13.2694 7.66846L6.35986 5.69366ZM6.45953 4.68211C5.37497 4.37213 4.37225 5.37501 4.68241 6.45952L6.64412 13.319C7.18137 15.8616 9.43304 17.7711 12.1321 17.7711C12.5978 17.7711 13.0508 17.7141 13.4844 17.6065C13.5645 17.5866 13.6245 17.6118 13.653 17.6404L14.8697 18.86C15.5526 19.5445 16.6604 19.5445 17.3433 18.86L18.8623 17.3373C19.5446 16.6534 19.5446 15.5451 18.8623 14.8612L17.6241 13.62C17.5959 13.5917 17.5711 13.5328 17.5898 13.454C17.6893 13.0347 17.7419 12.5977 17.7419 12.1491C17.7419 9.53085 15.9562 7.33075 13.5379 6.70518L6.45953 4.68211ZM11.499 11.9997C11.7751 11.9997 11.999 11.7759 11.999 11.4997C11.999 11.2236 11.7751 10.9997 11.499 10.9997C11.2229 10.9997 10.999 11.2236 10.999 11.4997C10.999 11.7759 11.2229 11.9997 11.499 11.9997Z" fill="currentColor"/></svg>',
    // animate
    motion: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7C7.22386 7 7 7.22386 7 7.5C7 7.77614 7.22386 8 7.5 8H11.5C11.7761 8 12 7.77614 12 7.5C12 7.22386 11.7761 7 11.5 7H7.5ZM3.5 10C3.22386 10 3 10.2239 3 10.5C3 10.7761 3.22386 11 3.5 11H9.5C9.77614 11 10 10.7761 10 10.5C10 10.2239 9.77614 10 9.5 10H3.5ZM3.5 13C3.22386 13 3 13.2239 3 13.5C3 13.7761 3.22386 14 3.5 14H9.5C9.77614 14 10 13.7761 10 13.5C10 13.2239 9.77614 13 9.5 13H3.5ZM7.5 16C7.22386 16 7 16.2239 7 16.5C7 16.7761 7.22386 17 7.5 17H11.5C11.7761 17 12 16.7761 12 16.5C12 16.2239 11.7761 16 11.5 16H7.5ZM20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12ZM21 12C21 14.7614 18.7614 17 16 17C13.2386 17 11 14.7614 11 12C11 9.23857 13.2386 7 16 7C18.7614 7 21 9.23857 21 12Z" fill="currentColor"/></svg>',
    // play.small
    play: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.1587 7.17447C9.6598 6.85016 9 7.20822 9 7.8033V16.1966C9 16.7917 9.6598 17.1497 10.1587 16.8254L16.8086 12.503C17.1726 12.2664 17.1726 11.7335 16.8086 11.4969L10.1587 7.17447ZM8 7.8033C8 6.41478 9.53954 5.5793 10.7037 6.33603L17.3536 10.6584C18.3243 11.2894 18.3243 12.7105 17.3536 13.3415L10.7037 17.6639C9.53954 18.4206 8 17.5851 8 16.1966V7.8033Z" fill="currentColor"/></svg>',
    // pause.small
    pause: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H9.5C9.77614 7 10 7.22386 10 7.5V16.5C10 16.7761 9.77614 17 9.5 17H7.5C7.22386 17 7 16.7761 7 16.5V7.5C7 7.22386 7.22386 7 7.5 7ZM6 7.5C6 6.67157 6.67157 6 7.5 6H9.5C10.3284 6 11 6.67157 11 7.5V16.5C11 17.3284 10.3284 18 9.5 18H7.5C6.67157 18 6 17.3284 6 16.5V7.5ZM14.5 7H16.5C16.7761 7 17 7.22386 17 7.5V16.5C17 16.7761 16.7761 17 16.5 17H14.5C14.2239 17 14 16.7761 14 16.5V7.5C14 7.22386 14.2239 7 14.5 7ZM13 7.5C13 6.67157 13.6716 6 14.5 6H16.5C17.3284 6 18 6.67157 18 7.5V16.5C18 17.3284 17.3284 18 16.5 18H14.5C13.6716 18 13 17.3284 13 16.5V7.5Z" fill="currentColor"/></svg>',
    // al.layout-horizontal (mirrored)
    arrowLeft: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><g transform="matrix(-1 0 0 1 24 0)"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 11.5C8 11.7761 8.22386 12 8.5 12H15.289L12.8899 14.3883C12.6942 14.5831 12.6935 14.8997 12.8883 15.0954C13.0831 15.2911 13.3997 15.2918 13.5954 15.097L16.8528 11.8543C16.947 11.7605 17 11.633 17 11.5C17 11.367 16.947 11.2394 16.8528 11.1456L13.5954 7.90297C13.3997 7.70815 13.0831 7.70887 12.8883 7.90457C12.6935 8.10028 12.6942 8.41686 12.8899 8.61168L15.289 11H8.5C8.22386 11 8 11.2238 8 11.5Z" fill="currentColor"/></g></svg>',
    // al.layout-horizontal
    arrowRight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 11.5C8 11.7761 8.22386 12 8.5 12H15.289L12.8899 14.3883C12.6942 14.5831 12.6935 14.8997 12.8883 15.0954C13.0831 15.2911 13.3997 15.2918 13.5954 15.097L16.8528 11.8543C16.947 11.7605 17 11.633 17 11.5C17 11.367 16.947 11.2394 16.8528 11.1456L13.5954 7.90297C13.3997 7.70815 13.0831 7.70887 12.8883 7.90457C12.6935 8.10028 12.6942 8.41686 12.8899 8.61168L15.289 11H8.5C8.22386 11 8 11.2238 8 11.5Z" fill="currentColor"/></svg>',
    // al.layout-vertical
    arrowDown: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 7C12.2238 7 12 7.22386 12 7.5V14.289L9.61168 11.8899C9.41686 11.6942 9.10028 11.6935 8.90457 11.8883C8.70887 12.0831 8.70815 12.3997 8.90297 12.5954L12.1456 15.8528C12.2394 15.947 12.367 16 12.5 16C12.633 16 12.7605 15.947 12.8543 15.8528L16.097 12.5954C16.2918 12.3997 16.2911 12.0831 16.0954 11.8883C15.8997 11.6935 15.5831 11.6942 15.3883 11.8899L13 14.289V7.5C13 7.22386 12.7761 7 12.5 7Z" fill="currentColor"/></svg>',
    // al.layout-vertical-up
    arrowUp: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 16C12.2238 16 12 15.7761 12 15.5V8.71098L9.61168 11.1101C9.41686 11.3058 9.10028 11.3065 8.90457 11.1117C8.70887 10.9169 8.70815 10.6003 8.90297 10.4046L12.1456 7.14725C12.2394 7.05299 12.367 7 12.5 7C12.633 7 12.7605 7.05299 12.8543 7.14725L16.097 10.4046C16.2918 10.6003 16.2911 10.9169 16.0954 11.1117C15.8997 11.3065 15.5831 11.3058 15.3883 11.1101L13 8.71098V15.5C13 15.7761 12.7761 16 12.5 16Z" fill="currentColor"/></svg>',
    // measure.small
    ruler: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 10.2071C4.90237 9.81658 4.90237 9.18342 5.29289 8.79289L8.79289 5.29289C9.18342 4.90237 9.81658 4.90237 10.2071 5.29289L18.7071 13.7929C19.0976 14.1834 19.0976 14.8166 18.7071 15.2071L15.2071 18.7071C14.8166 19.0976 14.1834 19.0976 13.7929 18.7071L5.29289 10.2071ZM6.70711 10.2071L6 9.5L6.70711 8.79289L8.79289 6.70711L9.5 6L10.2071 6.70711L17.2929 13.7929L18 14.5L17.2929 15.2071L15.2071 17.2929L14.5 18L13.7929 17.2929L10.1036 13.6036L11.8536 11.8536C12.0488 11.6583 12.0488 11.3417 11.8536 11.1464C11.6583 10.9512 11.3417 10.9512 11.1464 11.1464L9.39645 12.8964L8.10355 11.6036L8.85355 10.8536C9.04882 10.6583 9.04882 10.3417 8.85355 10.1464C8.65829 9.95118 8.34171 9.95118 8.14645 10.1464L7.39645 10.8964L6.70711 10.2071ZM13.5 14.5C13.5 15.0523 13.9477 15.5 14.5 15.5C15.0523 15.5 15.5 15.0523 15.5 14.5C15.5 13.9477 15.0523 13.5 14.5 13.5C13.9477 13.5 13.5 13.9477 13.5 14.5Z" fill="currentColor"/></svg>',
    // time.small
    timer: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12ZM19 12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12C5 8.134 8.134 5 12 5C15.866 5 19 8.134 19 12ZM12.5 8.5C12.5 8.22386 12.2761 8 12 8C11.7239 8 11.5 8.22386 11.5 8.5V12C11.5 12.1326 11.5527 12.2598 11.6465 12.3535L13.6465 14.3535C13.8417 14.5488 14.1583 14.5488 14.3535 14.3535C14.5488 14.1583 14.5488 13.8417 14.3535 13.6465L12.5 11.7929V8.5Z" fill="currentColor"/></svg>',
    // interaction.delay.small
    hourglass: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5C11.7239 5 11.5 5.22386 11.5 5.5C11.5 5.77614 11.7239 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 11.7239 5.77614 11.5 5.5 11.5C5.22386 11.5 5 11.7239 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM8.3005 6.91783C7.9046 6.66167 7.38356 6.71688 7.05014 7.05031C6.71672 7.38374 6.66153 7.90479 6.9177 8.30067L9.99202 13.0517C10.7573 14.2343 12.4182 14.4103 13.4142 13.4142C14.4103 12.4181 14.2343 10.7572 13.0516 9.99199L8.3005 6.91783ZM12.5084 10.8316L9.80624 9.08317L7.75726 7.75741L9.08309 9.80634L10.8316 12.5084C11.251 13.1566 12.1612 13.253 12.7071 12.7071C13.253 12.1612 13.1566 11.251 12.5084 10.8316Z" fill="currentColor"/></svg>',
    // loop.small
    repeat: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.85355 6.14645C9.65829 5.95118 9.34171 5.95118 9.14645 6.14645C8.95118 6.34171 8.95118 6.65829 9.14645 6.85355L10.2929 8H9C6.79086 8 5 9.79086 5 12C5 14.2091 6.79086 16 9 16H9.5C9.77614 16 10 15.7761 10 15.5C10 15.2239 9.77614 15 9.5 15H9C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9H10.2929L9.14645 10.1464C8.95118 10.3417 8.95118 10.6583 9.14645 10.8536C9.34171 11.0488 9.65829 11.0488 9.85355 10.8536L11.8536 8.85355C12.0488 8.65829 12.0488 8.34171 11.8536 8.14645L9.85355 6.14645ZM14.5 8C14.2239 8 14 8.22386 14 8.5C14 8.77614 14.2239 9 14.5 9H15C16.6569 9 18 10.3431 18 12C18 13.6569 16.6569 15 15 15H13.7071L14.8536 13.8536C15.0488 13.6583 15.0488 13.3417 14.8536 13.1464C14.6583 12.9512 14.3417 12.9512 14.1464 13.1464L12.1464 15.1464C11.9512 15.3417 11.9512 15.6583 12.1464 15.8536L14.1464 17.8536C14.3417 18.0488 14.6583 18.0488 14.8536 17.8536C15.0488 17.6583 15.0488 17.3417 14.8536 17.1464L13.7071 16H15C17.2091 16 19 14.2091 19 12C19 9.79086 17.2091 8 15 8H14.5Z" fill="currentColor"/></svg>',
    // restart
    replay: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.85355 5.85355C9.04882 5.65829 9.04882 5.34171 8.85355 5.14645C8.65829 4.95118 8.34171 4.95118 8.14645 5.14645L5.14645 8.14645C4.95118 8.34171 4.95118 8.65829 5.14645 8.85355L8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536C9.04882 11.6583 9.04882 11.3417 8.85355 11.1464L6.70711 9H13.9999C16.2091 9 17.9999 10.7909 17.9999 13C17.9999 15.2091 16.2091 17 13.9999 17C12.2832 17 10.8191 15.9186 10.2517 14.3998C10.17 14.1812 9.96929 14.0226 9.73602 14.0226C9.41028 14.0226 9.1658 14.3231 9.27201 14.6311C9.94825 16.5916 11.8096 18 13.9999 18C16.7614 18 18.9999 15.7614 18.9999 13C18.9999 10.2391 16.7623 8.00091 14.0016 8C14.0011 8 14.0005 8 14 8H13.9999H6.70711L8.85355 5.85355Z" fill="currentColor"/></svg>',
    // sidebar.closed (Figma's Hide UI button)
    sidebarSimple: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 7H18C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17H10V7ZM9 7H6C5.44772 7 5 7.44772 5 8V16C5 16.5523 5.44772 17 6 17H9V7ZM4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8Z" fill="currentColor"/></svg>',
    // copy.small
    copy: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 6C6.67157 6 6 6.67157 6 7.5V13.5C6 14.3284 6.67157 15 7.5 15H9V16.5C9 17.3284 9.67157 18 10.5 18H16.5C17.3284 18 18 17.3284 18 16.5V10.5C18 9.67157 17.3284 9 16.5 9H15V7.5C15 6.67157 14.3284 6 13.5 6H7.5ZM15 10V13.5C15 14.3284 14.3284 15 13.5 15H10V16.5C10 16.7761 10.2239 17 10.5 17H16.5C16.7761 17 17 16.7761 17 16.5V10.5C17 10.2239 16.7761 10 16.5 10H15ZM7 7.5C7 7.22386 7.22386 7 7.5 7H13.5C13.7761 7 14 7.22386 14 7.5V13.5C14 13.7761 13.7761 14 13.5 14H7.5C7.22386 14 7 13.7761 7 13.5V7.5Z" fill="currentColor"/></svg>',
    // text.align-left
    textAlignLeft: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7.5C5 7.22386 5.22386 7 5.5 7H18.5C18.7761 7 19 7.22386 19 7.5C19 7.77614 18.7761 8 18.5 8H5.5C5.22386 8 5 7.77614 5 7.5ZM5 11.5C5 11.2239 5.22386 11 5.5 11H12.5C12.7761 11 13 11.2239 13 11.5C13 11.7761 12.7761 12 12.5 12H5.5C5.22386 12 5 11.7761 5 11.5ZM5.5 15C5.22386 15 5 15.2239 5 15.5C5 15.7761 5.22386 16 5.5 16H14.5C14.7761 16 15 15.7761 15 15.5C15 15.2239 14.7761 15 14.5 15H5.5Z" fill="currentColor"/></svg>',
    // text.align-center
    textAlignCenter: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 7.5C5 7.22386 5.22386 7 5.5 7H18.5C18.7761 7 19 7.22386 19 7.5C19 7.77614 18.7761 8 18.5 8H5.5C5.22386 8 5 7.77614 5 7.5ZM8 11.5C8 11.2239 8.22386 11 8.5 11H15.5C15.7761 11 16 11.2239 16 11.5C16 11.7761 15.7761 12 15.5 12H8.5C8.22386 12 8 11.7761 8 11.5ZM7.5 15C7.22386 15 7 15.2239 7 15.5C7 15.7761 7.22386 16 7.5 16H16.5C16.7761 16 17 15.7761 17 15.5C17 15.2239 16.7761 15 16.5 15H7.5Z" fill="currentColor"/></svg>',
    // text.align-right
    textAlignRight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 7.5C19 7.22386 18.7761 7 18.5 7H5.5C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H18.5C18.7761 8 19 7.77614 19 7.5ZM19 11.5C19 11.2239 18.7761 11 18.5 11H11.5C11.2239 11 11 11.2239 11 11.5C11 11.7761 11.2239 12 11.5 12H18.5C18.7761 12 19 11.7761 19 11.5ZM18.5 15C18.7761 15 19 15.2239 19 15.5C19 15.7761 18.7761 16 18.5 16H9.5C9.22386 16 9 15.7761 9 15.5C9 15.2239 9.22386 15 9.5 15H18.5Z" fill="currentColor"/></svg>',
    // stroke-weight
    strokeWeight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 6.5C6 6.22386 6.22386 6 6.5 6H17.5C17.7761 6 18 6.22386 18 6.5C18 6.77614 17.7761 7 17.5 7H6.5C6.22386 7 6 6.77614 6 6.5ZM7 10V11H17V10H7ZM6.75 9C6.33579 9 6 9.33579 6 9.75V11.25C6 11.6642 6.33579 12 6.75 12H17.25C17.6642 12 18 11.6642 18 11.25V9.75C18 9.33579 17.6642 9 17.25 9H6.75ZM7 17V15H17V17H7ZM6 14.75C6 14.3358 6.33579 14 6.75 14H17.25C17.6642 14 18 14.3358 18 14.75V17.25C18 17.6642 17.6642 18 17.25 18H6.75C6.33579 18 6 17.6642 6 17.25V14.75Z" fill="currentColor"/></svg>',
    // text.align-top
    arrowLineUp: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 5C5.22386 5 5 5.22386 5 5.5C5 5.77614 5.22386 6 5.5 6H17.5C17.7761 6 18 5.77614 18 5.5C18 5.22386 17.7761 5 17.5 5H5.5ZM11.8536 7.14645C11.6583 6.95118 11.3417 6.95118 11.1464 7.14645L8.14645 10.1464C7.95118 10.3417 7.95118 10.6583 8.14645 10.8536C8.34171 11.0488 8.65829 11.0488 8.85355 10.8536L11 8.70711V16.5C11 16.7761 11.2239 17 11.5 17C11.7761 17 12 16.7761 12 16.5V8.70711L14.1464 10.8536C14.3417 11.0488 14.6583 11.0488 14.8536 10.8536C15.0488 10.6583 15.0488 10.3417 14.8536 10.1464L11.8536 7.14645Z" fill="currentColor"/></svg>',
    // text.align-middle
    arrowsInLineVertical: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.8536 9.85355L13.8536 7.85355C14.0488 7.65829 14.0488 7.34171 13.8536 7.14645C13.6583 6.95118 13.3417 6.95118 13.1464 7.14645L12 8.29289V4.5C12 4.22386 11.7761 4 11.5 4C11.2239 4 11 4.22386 11 4.5V8.29289L9.85355 7.14645C9.65829 6.95118 9.34171 6.95118 9.14645 7.14645C8.95118 7.34171 8.95118 7.65829 9.14645 7.85355L11.1464 9.85355C11.3417 10.0488 11.6583 10.0488 11.8536 9.85355ZM11.8536 13.1464L13.8536 15.1464C14.0488 15.3417 14.0488 15.6583 13.8536 15.8536C13.6583 16.0488 13.3417 16.0488 13.1464 15.8536L12 14.7071V18.5C12 18.7761 11.7761 19 11.5 19C11.2239 19 11 18.7761 11 18.5V14.7071L9.85355 15.8536C9.65829 16.0488 9.34171 16.0488 9.14645 15.8536C8.95118 15.6583 8.95118 15.3417 9.14645 15.1464L11.1464 13.1464C11.3417 12.9512 11.6583 12.9512 11.8536 13.1464ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12H17.5C17.7761 12 18 11.7761 18 11.5C18 11.2239 17.7761 11 17.5 11H5.5Z" fill="currentColor"/></svg>',
    // text.align-bottom
    arrowLineDown: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.8536 13.8536L11.8536 16.8536C11.6583 17.0488 11.3417 17.0488 11.1464 16.8536L8.14645 13.8536C7.95118 13.6583 7.95118 13.3417 8.14645 13.1464C8.34171 12.9512 8.65829 12.9512 8.85355 13.1464L11 15.2929V7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5V15.2929L14.1464 13.1464C14.3417 12.9512 14.6583 12.9512 14.8536 13.1464C15.0488 13.3417 15.0488 13.6583 14.8536 13.8536ZM5.5 19C5.22386 19 5 18.7761 5 18.5C5 18.2239 5.22386 18 5.5 18H17.5C17.7761 18 18 18.2239 18 18.5C18 18.7761 17.7761 19 17.5 19H5.5Z" fill="currentColor"/></svg>',
    // text.resize-width
    arrowLineRight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1464 8.14645C14.3417 7.95118 14.6583 7.95118 14.8536 8.14645L17.8536 11.1464C17.9473 11.2402 18 11.3674 18 11.5C18 11.6326 17.9473 11.7598 17.8536 11.8536L14.8536 14.8536C14.6583 15.0488 14.3417 15.0488 14.1464 14.8536C13.9512 14.6583 13.9512 14.3417 14.1464 14.1464L16.2929 12L7.70708 12.0002L9.85355 14.1467C10.0488 14.342 10.0488 14.6585 9.85355 14.8538C9.65829 15.0491 9.34171 15.0491 9.14645 14.8538L6.14645 11.8538C5.95118 11.6585 5.95118 11.342 6.14645 11.1467L9.14645 8.14669C9.34171 7.95143 9.65829 7.95143 9.85355 8.14669C10.0488 8.34195 10.0488 8.65854 9.85355 8.8538L7.70713 11.0002L16.2929 11L14.1464 8.85355C13.9512 8.65829 13.9512 8.34171 14.1464 8.14645Z" fill="currentColor"/></svg>',
    // text.resize-height
    resizeHeight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 6C6.77614 6 7 6.22386 7 6.5V17.5C7 17.7761 6.77614 18 6.5 18C6.22386 18 6 17.7761 6 17.5V6.5C6 6.22386 6.22386 6 6.5 6ZM9.50002 10.0002L14.5 10C14.7762 9.99999 15 9.77612 15 9.49998C15 9.22383 14.7761 8.99999 14.5 9L9.49998 9.00024C9.22383 9.00026 8.99999 9.22413 9 9.50027C9.00001 9.77641 9.22388 10.0003 9.50002 10.0002ZM14.5 12.5L9.50002 12.5002C9.22388 12.5003 9.00001 12.2764 9 12.0003C8.99999 11.7241 9.22383 11.5003 9.49998 11.5002L14.5 11.5C14.7761 11.5 15 11.7238 15 12C15 12.2761 14.7762 12.5 14.5 12.5ZM9 14.5C9 14.2239 9.22386 14 9.5 14H12.5C12.7761 14 13 14.2239 13 14.5C13 14.7761 12.7761 15 12.5 15H9.5C9.22386 15 9 14.7761 9 14.5ZM18 6.5C18 6.22386 17.7761 6 17.5 6C17.2239 6 17 6.22386 17 6.5V17.5C17 17.7761 17.2239 18 17.5 18C17.7761 18 18 17.7761 18 17.5V6.5Z" fill="currentColor"/></svg>',
    // text.resize-fixed
    article: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 7H7L7 17H17V7ZM7 6C6.44772 6 6 6.44772 6 7V17C6 17.5523 6.44772 18 7 18H17C17.5523 18 18 17.5523 18 17V7C18 6.44772 17.5523 6 17 6H7Z" fill="currentColor"/></svg>',
    // al.spacing-vertical
    arrowsVertical: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7C7.77614 7 8 7.22386 8 7.5V7.75C8 7.88807 8.11193 8 8.25 8H14.75C14.8881 8 15 7.88807 15 7.75V7.5C15 7.22386 15.2239 7 15.5 7C15.7761 7 16 7.22386 16 7.5V7.75C16 8.44036 15.4404 9 14.75 9H8.25C7.55964 9 7 8.44036 7 7.75V7.5C7 7.22386 7.22386 7 7.5 7ZM8.25 15C8.11193 15 8 15.1119 8 15.25V15.5C8 15.7761 7.77614 16 7.5 16C7.22386 16 7 15.7761 7 15.5V15.25C7 14.5596 7.55964 14 8.25 14H14.7501C15.4405 14 16.0001 14.5596 16.0001 15.25V15.5C16.0001 15.7761 15.7763 16 15.5001 16C15.224 16 15.0001 15.7761 15.0001 15.5V15.25C15.0001 15.1119 14.8882 15 14.7501 15H8.25ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12H13.5C13.7761 12 14 11.7761 14 11.5C14 11.2239 13.7761 11 13.5 11H9.5Z" fill="currentColor"/></svg>',
    // al.spacing-horizontal
    arrowsHorizontal: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 15.5C7 15.2239 7.22386 15 7.5 15H7.75C7.88807 15 8 14.8881 8 14.75V8.25C8 8.11193 7.88807 8 7.75 8H7.5C7.22386 8 7 7.77614 7 7.5C7 7.22386 7.22386 7 7.5 7H7.75C8.44036 7 9 7.55964 9 8.25V14.75C9 15.4404 8.44036 16 7.75 16H7.5C7.22386 16 7 15.7761 7 15.5ZM15 14.7502C15 14.8883 15.1119 15.0002 15.25 15.0002H15.5C15.7761 15.0002 16 15.2241 16 15.5002C16 15.7764 15.7761 16.0002 15.5 16.0002H15.25C14.5596 16.0002 14 15.4406 14 14.7502V8.25012C14 7.55977 14.5596 7.00012 15.25 7.00012H15.5C15.7761 7.00012 16 7.22398 16 7.50012C16 7.77626 15.7761 8.00012 15.5 8.00012H15.25C15.1119 8.00012 15 8.11205 15 8.25012V14.7502ZM11 13.5C11 13.7761 11.2239 14 11.5 14C11.7761 14 12 13.7761 12 13.5V9.5C12 9.22386 11.7761 9 11.5 9C11.2239 9 11 9.22386 11 9.5V13.5Z" fill="currentColor"/></svg>',
    // text.line-height
    lineHeight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5.5C5 5.22386 5.22386 5 5.5 5H18.5C18.7761 5 19 5.22386 19 5.5C19 5.77614 18.7761 6 18.5 6H5.5C5.22386 6 5 5.77614 5 5.5ZM5 18.5C5 18.2239 5.22386 18 5.5 18H18.5C18.7761 18 19 18.2239 19 18.5C19 18.7761 18.7761 19 18.5 19H5.5C5.22386 19 5 18.7761 5 18.5ZM8.56445 16H9.58008L10.3843 13.7344H13.6196L14.4238 16H15.4395L12.502 8H11.502L8.56445 16ZM13.3145 12.875L12.0332 9.26562H11.9707L10.6894 12.875H13.3145Z" fill="currentColor"/></svg>',
    // text.letter-spacing
    letterSpacing: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 6C4.77614 6 5 6.22386 5 6.5L5 17.5C5 17.7761 4.77614 18 4.5 18C4.22386 18 4 17.7761 4 17.5V6.5C4 6.22386 4.22386 6 4.5 6ZM19.5 6C19.7761 6 20 6.22386 20 6.5L20 17.5C20 17.7761 19.7761 18 19.5 18C19.2239 18 19 17.7761 19 17.5L19 6.5C19 6.22386 19.2239 6 19.5 6ZM8.56445 16H9.58008L10.3843 13.7344H13.6196L14.4238 16H15.4395L12.502 8H11.502L8.56445 16ZM13.3145 12.875L12.0332 9.26562H11.9707L10.6894 12.875H13.3145Z" fill="currentColor"/></svg>',
    // link-connected
    lockRatio: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8V9.5C14 9.77614 14.2239 10 14.5 10C14.7761 10 15 9.77614 15 9.5V8C15 6.34314 13.6569 5 12 5C10.3431 5 9 6.34314 9 8V9.5C9 9.77614 9.22386 10 9.5 10C9.77614 10 10 9.77614 10 9.5V8ZM10 16C10 17.1046 10.8954 18 12 18C13.1046 18 14 17.1046 14 16V14.5C14 14.2239 14.2239 14 14.5 14C14.7761 14 15 14.2239 15 14.5V16C15 17.6569 13.6569 19 12 19C10.3431 19 9 17.6569 9 16V14.5C9 14.2239 9.22386 14 9.5 14C9.77614 14 10 14.2239 10 14.5V16ZM12.5 10C12.5 9.72386 12.2761 9.5 12 9.5C11.7239 9.5 11.5 9.72386 11.5 10V14C11.5 14.2761 11.7239 14.5 12 14.5C12.2761 14.5 12.5 14.2761 12.5 14V10Z" fill="currentColor"/></svg>',
    // link-broken (Constrain proportions off; lockRatio is on)
    linkBroken: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8V9.5C14 9.77614 14.2239 10 14.5 10C14.7761 10 15 9.77614 15 9.5V8C15 6.34315 13.6569 5 12 5C10.3432 5 9.00001 6.34315 9.00001 8V9.5C9.00001 9.77614 9.22386 10 9.50001 10C9.77615 10 10 9.77614 10 9.5V8ZM10 16C10 17.1046 10.8954 18 12 18C13.1046 18 14 17.1046 14 16V14.5C14 14.2239 14.2239 14 14.5 14C14.7761 14 15 14.2239 15 14.5V16C15 17.6569 13.6569 19 12 19C10.3431 19 9 17.6569 9 16V14.5C9 14.2239 9.22386 14 9.5 14C9.77614 14 10 14.2239 10 14.5V16Z" fill="currentColor"/></svg>',
    // instance.small
    instance: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.8233 6.59105L6.59105 11.8233C6.49342 11.9209 6.49341 12.0792 6.59105 12.1768L11.8233 17.4091C11.9209 17.5067 12.0792 17.5067 12.1768 17.4091L17.4091 12.1768C17.5067 12.0792 17.5067 11.9209 17.4091 11.8233L12.1768 6.59105C12.0792 6.49342 11.9209 6.49341 11.8233 6.59105ZM11.1162 5.88394L5.88394 11.1162C5.39578 11.6043 5.39578 12.3958 5.88394 12.8839L11.1162 18.1162C11.6043 18.6043 12.3958 18.6043 12.8839 18.1162L18.1162 12.8839C18.6043 12.3958 18.6043 11.6043 18.1162 11.1162L12.8839 5.88394C12.3958 5.39578 11.6043 5.39578 11.1162 5.88394Z" fill="currentColor"/></svg>',
    // component.small
    component: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.96966 10.4444L6.59105 11.823C6.49341 11.9207 6.49341 12.079 6.59105 12.1766L7.96977 13.5553C8.06741 13.6529 8.2257 13.6529 8.32333 13.5553L9.70195 12.1767C9.79958 12.0791 9.79958 11.9208 9.70195 11.8231L8.32322 10.4444C8.22559 10.3468 8.0673 10.3468 7.96966 10.4444ZM9.02968 9.73666C8.54147 9.24915 7.7505 9.24937 7.26256 9.73731L5.88394 11.1159C5.39578 11.6041 5.39578 12.3955 5.88394 12.8837L7.26267 14.2624C7.75082 14.7506 8.54228 14.7506 9.03043 14.2624L10.4091 12.8838C10.4093 12.8836 10.4095 12.8833 10.4098 12.8831C10.8972 12.3948 10.897 11.6039 10.4091 11.116L9.03032 9.73731C9.03011 9.73709 9.0299 9.73688 9.02968 9.73666ZM11.1169 13.5902C11.1167 13.5904 11.1164 13.5907 11.1162 13.5909L9.73754 14.9695C9.24939 15.4577 9.24939 16.2491 9.73754 16.7373L11.1162 18.1159C11.6043 18.6041 12.3958 18.6041 12.8839 18.1159L14.2626 16.7373C14.7505 16.2494 14.7507 15.4585 14.2633 14.9703C14.2631 14.97 14.2628 14.9698 14.2626 14.9695L12.8839 13.5909C12.8838 13.5907 12.8836 13.5906 12.8834 13.5904C12.3955 13.103 11.6049 13.1029 11.1169 13.5902ZM9.73679 9.02956C9.737 9.02977 9.73722 9.02999 9.73743 9.0302L11.1162 10.4089C11.1163 10.4091 11.1165 10.4093 11.1167 10.4095C11.6049 10.8971 12.3959 10.8969 12.8839 10.4089L14.2627 9.03019C14.7508 8.54204 14.7508 7.75058 14.2627 7.26242L12.8839 5.88369C12.3958 5.39554 11.6043 5.39554 11.1162 5.88369L9.73743 7.26244C9.24949 7.75038 9.24928 8.54135 9.73679 9.02956ZM10.4445 8.3231L11.8233 9.70182C11.9209 9.79946 12.0792 9.79946 12.1768 9.70182L13.5556 8.32308C13.6532 8.22545 13.6532 8.06716 13.5556 7.96953L12.1768 6.5908C12.0792 6.49317 11.9209 6.49317 11.8233 6.5908L10.4445 7.96954C10.3469 8.06717 10.3469 8.22546 10.4445 8.3231ZM14.9698 9.7373L13.591 11.116C13.1029 11.6042 13.1029 12.3956 13.591 12.8838L14.9697 14.2624C15.4578 14.7506 16.2493 14.7506 16.7374 14.2624L18.1162 12.8837C18.6043 12.3955 18.6043 11.6041 18.1162 11.1159L16.7375 9.7373C16.2494 9.24914 15.4579 9.24914 14.9698 9.7373ZM15.6769 10.4444L14.2981 11.8231C14.2005 11.9208 14.2005 12.0791 14.2981 12.1767L15.6768 13.5553C15.7744 13.653 15.9327 13.653 16.0303 13.5553L17.4091 12.1766C17.5067 12.079 17.5067 11.9207 17.4091 11.823L16.0304 10.4444C15.9328 10.3468 15.7745 10.3468 15.6769 10.4444ZM13.5555 15.6766L12.1768 14.298C12.0792 14.2004 11.9209 14.2004 11.8233 14.298L10.4446 15.6766C10.347 15.7743 10.347 15.9326 10.4446 16.0302L11.8233 17.4088C11.9209 17.5065 12.0792 17.5065 12.1768 17.4088L13.5555 16.0302C13.6531 15.9326 13.6531 15.7743 13.5555 15.6766Z" fill="currentColor"/></svg>',
    // scale (1:532666), the Scale tool's own glyph
    scale: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 6.5C5 5.67157 5.67157 5 6.5 5H17.5C18.3284 5 19 5.67157 19 6.5V17.5C19 18.3284 18.3284 19 17.5 19H15.5C15.2239 19 15 19.2239 15 19.5C15 19.7761 15.2239 20 15.5 20H17.5C18.8807 20 20 18.8807 20 17.5V6.5C20 5.11929 18.8807 4 17.5 4H6.5C5.11929 4 4 5.11929 4 6.5V8.5C4 8.77614 4.22386 9 4.5 9C4.77614 9 5 8.77614 5 8.5V6.5ZM11 8.5C11 8.22386 11.2239 8 11.5 8H15.5C15.7761 8 16 8.22386 16 8.5V12.5C16 12.7761 15.7761 13 15.5 13C15.2239 13 15 12.7761 15 12.5V9.70711L8.85355 15.8535C8.65829 16.0488 8.34171 16.0488 8.14645 15.8535C7.95119 15.6583 7.95119 15.3417 8.14645 15.1465L14.2929 9H11.5C11.2239 9 11 8.77614 11 8.5ZM4 11.5C4 10.6716 4.67157 10 5.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H5.5C5.22386 11 5 11.2239 5 11.5V18.5C5 18.7761 5.22386 19 5.5 19H12.5C12.7761 19 13 18.7761 13 18.5V13.5C13 13.2239 13.2239 13 13.5 13C13.7761 13 14 13.2239 14 13.5V18.5C14 19.3284 13.3284 20 12.5 20H5.5C4.67157 20 4 19.3284 4 18.5V11.5Z" fill="currentColor"/></svg>',
    // scale.small (1:532691), in front of Scale's factor
    scaleSmall: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7C7.22386 7 7 7.22386 7 7.5V9.5C7 9.77614 6.77614 10 6.5 10C6.22386 10 6 9.77614 6 9.5V7.5C6 6.67157 6.67157 6 7.5 6H16.5C17.3284 6 18 6.67157 18 7.5V16.5C18 17.3284 17.3284 18 16.5 18H14.5C14.2239 18 14 17.7761 14 17.5C14 17.2239 14.2239 17 14.5 17H16.5C16.7761 17 17 16.7761 17 16.5V7.5C17 7.22386 16.7761 7 16.5 7H7.5ZM6 12C6 11.4477 6.44771 11 7 11H9.5C9.77614 11 10 11.2239 10 11.5C10 11.7761 9.77614 12 9.5 12H7V17H12V14.5C12 14.2239 12.2239 14 12.5 14C12.7761 14 13 14.2239 13 14.5V17C13 17.5523 12.5523 18 12 18H7C6.44771 18 6 17.5523 6 17V12ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10H13.2929L9.14645 14.1465C8.95119 14.3417 8.95119 14.6583 9.14645 14.8535C9.34171 15.0488 9.65829 15.0488 9.85355 14.8535L14 10.7071V12.5C14 12.7761 14.2239 13 14.5 13C14.7761 13 15 12.7761 15 12.5V9.5C15 9.22386 14.7761 9 14.5 9H11.5Z" fill="currentColor"/></svg>',
    // check
    check: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.2519 8.56819C15.4905 8.70733 15.571 9.01349 15.4319 9.25202L11.9319 15.252C11.8498 15.3928 11.7041 15.4848 11.5416 15.4983C11.3792 15.5119 11.2203 15.4454 11.1159 15.3202L8.6159 12.3202C8.43912 12.108 8.46778 11.7928 8.67992 11.616C8.89206 11.4392 9.20734 11.4679 9.38412 11.68L11.4275 14.1321L14.5681 8.74815C14.7073 8.50962 15.0134 8.42905 15.2519 8.56819Z" fill="currentColor"/></svg>',
    // check, the 16 frame (the checkbox's tick)
    // The checkbox's check, drawn as one stroke (pathLength 1) so it can draw itself in: the kit's check16 line.
    checkDraw: '<svg class="ft-ico ft-check-mark" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4.5 7.5L7.45 10.45L11.5 4.4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>',
    check16: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.7773 4.084C12.0071 4.23717 12.0692 4.54761 11.916 4.77737L7.91603 10.7774C7.83293 10.902 7.69834 10.9828 7.54927 10.9976C7.4002 11.0123 7.25237 10.9595 7.14645 10.8536L4.14645 7.85358C3.95118 7.65831 3.95118 7.34173 4.14645 7.14647C4.34171 6.95121 4.65829 6.95121 4.85355 7.14647L7.42229 9.7152L11.084 4.22267C11.2372 3.99291 11.5476 3.93082 11.7773 4.084Z" fill="currentColor"/></svg>',
    // plus.small
    plus: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 6C12.2761 6 12.5 6.22386 12.5 6.5V11.5H17.5C17.7761 11.5 18 11.7239 18 12C18 12.2761 17.7761 12.5 17.5 12.5H12.5V17.5C12.5 17.7761 12.2761 18 12 18C11.7239 18 11.5 17.7761 11.5 17.5V12.5H6.5C6.22386 12.5 6 12.2761 6 12C6 11.7239 6.22386 11.5 6.5 11.5H11.5V6.5C11.5 6.22386 11.7239 6 12 6Z" fill="currentColor"/></svg>',
    // minus.small
    minus: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 12C18 12.2761 17.7761 12.5 17.5 12.5H6.5C6.22386 12.5 6 12.2761 6 12C6 11.7239 6.22386 11.5 6.5 11.5H17.5C17.7761 11.5 18 11.7239 18 12Z" fill="currentColor"/></svg>',
    // eye.small
    eye: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 12C6 11.9345 6.0545 11.642 6.31257 11.1754C6.55343 10.7399 6.92629 10.2367 7.43394 9.76077C8.44172 8.81598 9.95481 8 12 8C14.0452 8 15.5583 8.81599 16.5661 9.76079C17.0737 10.2367 17.4466 10.7399 17.6874 11.1754C17.9455 11.642 18 11.9345 18 12C18 12.0655 17.9455 12.358 17.6874 12.8246C17.4466 13.2601 17.0737 13.7633 16.5661 14.2392C15.5583 15.184 14.0452 16 12 16C9.95482 16 8.44173 15.184 7.43394 14.2392C6.92629 13.7633 6.55343 13.2601 6.31257 12.8246C6.0545 12.358 6 12.0655 6 12ZM5 12C5 10.75 7.33333 7 12 7C16.6667 7 19 10.75 19 12C19 13.25 16.6667 17 12 17C7.33333 17 5 13.25 5 12ZM13 12C13 12.5522 12.5523 13 12 13C11.4477 13 11 12.5522 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM14 12C14 13.1045 13.1046 14 12 14C10.8954 14 10 13.1045 10 12C10 10.8954 10.8954 9.99996 12 9.99996C13.1046 9.99996 14 10.8954 14 12Z" fill="currentColor"/></svg>',
    // hidden.small
    eyeClosed: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5001 9C5.77622 9 6.03289 9.22343 6.1415 9.47729C6.18496 9.57887 6.24092 9.69501 6.31258 9.82457C6.55344 10.2601 6.9263 10.7633 7.43395 11.2392C8.44173 12.184 9.95483 13 12 13C14.0452 13 15.5583 12.184 16.5661 11.2392C17.0737 10.7633 17.4466 10.2601 17.6874 9.8246C17.7591 9.69506 17.815 9.57895 17.8585 9.47738C17.9671 9.2235 18.2239 9 18.5 9C18.7761 9 18.9951 9.22492 18.9168 9.48974C18.7152 10.1719 18.1468 11.14 17.2116 12.0045L18.3536 13.1464C18.5488 13.3417 18.5488 13.6583 18.3536 13.8536C18.1583 14.0488 17.8417 14.0488 17.6464 13.8536L16.429 12.6361C15.8852 13.0177 15.2551 13.3517 14.5388 13.5937L14.9851 15.3787C15.052 15.6466 14.8892 15.9181 14.6213 15.9851C14.3534 16.052 14.0819 15.8892 14.0149 15.6213L13.5722 13.8502C13.0814 13.9465 12.5573 14 12 14C11.4427 14 10.9186 13.9465 10.4278 13.8502L9.98508 15.6213C9.9181 15.8892 9.64664 16.052 9.37874 15.9851C9.11084 15.9181 8.94796 15.6466 9.01494 15.3787L9.4612 13.5937C8.74487 13.3517 8.11481 13.0177 7.57101 12.6361L6.35355 13.8536C6.15829 14.0488 5.84171 14.0488 5.64645 13.8536C5.45118 13.6583 5.45118 13.3417 5.64645 13.1464L6.78841 12.0045C5.8533 11.14 5.28489 10.172 5.0832 9.48982C5.0049 9.22497 5.22391 9 5.5001 9Z" fill="currentColor"/></svg>',
    // close.small
    x: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3536 6.64645C17.5488 6.84171 17.5488 7.15829 17.3536 7.35355L12.7071 12L17.3536 16.6464C17.5488 16.8417 17.5488 17.1583 17.3536 17.3536C17.1583 17.5488 16.8417 17.5488 16.6464 17.3536L12 12.7071L7.35355 17.3536C7.15829 17.5488 6.84171 17.5488 6.64645 17.3536C6.45118 17.1583 6.45118 16.8417 6.64645 16.6464L11.2929 12L6.64645 7.35365C6.45119 7.15839 6.45118 6.84181 6.64644 6.64654C6.84171 6.45128 7.15829 6.45128 7.35355 6.64654L12 11.2929L16.6464 6.64645C16.8417 6.45118 17.1583 6.45118 17.3536 6.64645Z" fill="currentColor"/></svg>',
    // eyedropper
    eyedropper: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.3966 4.60357C18.6253 3.83234 17.3749 3.83234 16.6037 4.60357L13.3536 7.8537L13 8.20727L12.6464 7.85367L12.601 7.80826C12.2691 7.47628 11.7309 7.47627 11.3989 7.80823L11.3083 7.89886C10.9763 8.2308 10.9763 8.76899 11.3083 9.10094L11.8537 9.64635L14.3537 12.1463L14.8991 12.6917C15.231 13.0237 15.7692 13.0237 16.1012 12.6918L16.1918 12.6011C16.5238 12.2692 16.5237 11.7309 16.1918 11.399L16.1465 11.3537L15.7929 11.0002L16.1464 10.6466L19.3966 7.39647C20.1678 6.62523 20.1678 5.37481 19.3966 4.60357ZM15.8966 3.89647C17.0583 2.73471 18.9419 2.73471 20.1037 3.89647C21.2654 5.05823 21.2654 6.94181 20.1037 8.10357L17.1706 11.0367C17.6058 11.749 17.5152 12.6919 16.8989 13.3082L16.8083 13.3989C16.0858 14.1213 14.9144 14.1213 14.192 13.3989L14.0001 13.207L6.64645 20.5607C6.36514 20.842 5.98361 21 5.58579 21H3.5C3.22386 21 3 20.7762 3 20.5V18.4142C3 18.0164 3.15804 17.6349 3.43934 17.3536L10.793 9.9999L10.6012 9.80805C9.87869 9.08558 9.87869 7.91422 10.6012 7.19175L10.6918 7.10112C11.3081 6.48477 12.2512 6.39424 12.9635 6.82952L15.8966 3.89647ZM11.5001 10.707L4.14645 18.0607C4.05268 18.1544 4 18.2816 4 18.4142V20H5.58579C5.71839 20 5.84557 19.9473 5.93934 19.8536L13.293 12.4999L11.5001 10.707Z" fill="currentColor"/></svg>',
    // chevron.down
    caretDown: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.64645 11.1464C9.84171 10.9512 10.1583 10.9512 10.3536 11.1464L12 12.7929L13.6464 11.1464C13.8417 10.9512 14.1583 10.9512 14.3536 11.1464C14.5488 11.3417 14.5488 11.6583 14.3536 11.8536L12.3536 13.8536C12.1583 14.0488 11.8417 14.0488 11.6464 13.8536L9.64645 11.8536C9.45118 11.6583 9.45118 11.3417 9.64645 11.1464Z" fill="currentColor"/></svg>',
    // styles
    guideStyles: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10ZM8.5 11C7.11929 11 6 9.88071 6 8.5C6 7.11929 7.11929 6 8.5 6C9.88071 6 11 7.11929 11 8.5C11 9.88071 9.88071 11 8.5 11ZM15.5 10C14.6716 10 14 9.32843 14 8.5C14 7.67157 14.6716 7 15.5 7C16.3284 7 17 7.67157 17 8.5C17 9.32843 16.3284 10 15.5 10ZM15.5 11C14.1193 11 13 9.88071 13 8.5C13 7.11929 14.1193 6 15.5 6C16.8807 6 18 7.11929 18 8.5C18 9.88071 16.8807 11 15.5 11ZM14 15.5C14 16.3284 14.6716 17 15.5 17C16.3284 17 17 16.3284 17 15.5C17 14.6716 16.3284 14 15.5 14C14.6716 14 14 14.6716 14 15.5ZM13 15.5C13 16.8807 14.1193 18 15.5 18C16.8807 18 18 16.8807 18 15.5C18 14.1193 16.8807 13 15.5 13C14.1193 13 13 14.1193 13 15.5ZM8.5 17C7.67157 17 7 16.3284 7 15.5C7 14.6716 7.67157 14 8.5 14C9.32843 14 10 14.6716 10 15.5C10 16.3284 9.32843 17 8.5 17ZM8.5 18C7.11929 18 6 16.8807 6 15.5C6 14.1193 7.11929 13 8.5 13C9.88071 13 11 14.1193 11 15.5C11 16.8807 9.88071 18 8.5 18Z" fill="currentColor"/></svg>',
    // flip.horizontal.small
    flipHorizontal: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 6.5C12.5 6.22386 12.2761 6 12 6C11.7239 6 11.5 6.22386 11.5 6.5V17.5C11.5 17.7761 11.7239 18 12 18C12.2761 18 12.5 17.7761 12.5 17.5V6.5ZM6 9.10355C6 8.43538 6.80786 8.10075 7.28033 8.57323L10 11.2929C10.3905 11.6834 10.3905 12.3166 10 12.7071L7.28033 15.4268C6.80785 15.8993 6 15.5646 6 14.8965V9.10355ZM7 14.2929L9.29289 12L7 9.70711V14.2929ZM18 9.10355C18 8.43538 17.1921 8.10075 16.7197 8.57323L14 11.2929C13.6095 11.6834 13.6095 12.3166 14 12.7071L16.7197 15.4268C17.1922 15.8993 18 15.5646 18 14.8965V9.10355ZM17 14.2929L14.7071 12L17 9.70711V14.2929Z" fill="currentColor"/></svg>',
    // flip.vertical
    flipVertical: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 12.5C17.7761 12.5 18 12.2761 18 12C18 11.7239 17.7761 11.5 17.5 11.5L6.5 11.5C6.22386 11.5 6 11.7239 6 12C6 12.2761 6.22386 12.5 6.5 12.5L17.5 12.5ZM14.8964 18C15.5646 18 15.8992 17.1921 15.4268 16.7197L12.7071 14C12.3166 13.6095 11.6834 13.6095 11.2929 14L8.57322 16.7197C8.10075 17.1921 8.43538 18 9.10355 18L14.8964 18ZM14.2929 17L9.70711 17L12 14.7071L14.2929 17ZM14.8964 6C15.5646 6 15.8992 6.80786 15.4268 7.28033L12.7071 10C12.3166 10.3905 11.6834 10.3905 11.2929 10L8.57322 7.28033C8.10075 6.80785 8.43538 6 9.10355 6L14.8964 6ZM14.2929 7L9.70711 7L12 9.29289L14.2929 7Z" fill="currentColor"/></svg>',
    // rotate
    rotateSquare: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2322 6.47491C11.2085 5.4986 12.7915 5.4986 13.7678 6.47491L15.2929 8.00003H14C13.7239 8.00003 13.5 8.22389 13.5 8.50003C13.5 8.77618 13.7239 9.00003 14 9.00003H16.5C16.7761 9.00003 17 8.77618 17 8.50003V6.00003C17 5.72389 16.7761 5.50003 16.5 5.50003C16.2239 5.50003 16 5.72389 16 6.00003V7.29293L14.4749 5.7678C13.108 4.40097 10.892 4.40097 9.52513 5.7678L7.14645 8.14648C6.95118 8.34174 6.95118 8.65833 7.14645 8.85359C7.34171 9.04885 7.65829 9.04885 7.85355 8.85359L10.2322 6.47491ZM13.0607 9.64648C12.4749 9.0607 11.5251 9.06069 10.9393 9.64648L7.64645 12.9394C7.06066 13.5252 7.06066 14.4749 7.64645 15.0607L10.9393 18.3536C11.5251 18.9394 12.4749 18.9394 13.0607 18.3536L16.3536 15.0607C16.9393 14.4749 16.9393 13.5252 16.3536 12.9394L13.0607 9.64648ZM11.6464 10.3536C11.8417 10.1583 12.1583 10.1583 12.3536 10.3536L15.6464 13.6465C15.8417 13.8417 15.8417 14.1583 15.6464 14.3536L12.3536 17.6465C12.1583 17.8417 11.8417 17.8417 11.6464 17.6465L8.35355 14.3536C8.15829 14.1583 8.15829 13.8417 8.35355 13.6465L11.6464 10.3536Z" fill="currentColor"/></svg>',
    // composed: autolayout-wrap squares
    flowFree: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 7H7.5C7.22386 7 7 7.2239 7 7.5V9.5C7 9.7761 7.22386 10 7.5 10H9.5C9.77614 10 10 9.7761 10 9.5V7.5C10 7.2239 9.77614 7 9.5 7ZM7.5 6C6.67157 6 6 6.6716 6 7.5V9.5C6 10.3284 6.67157 11 7.5 11H9.5C10.3284 11 11 10.3284 11 9.5V7.5C11 6.6716 10.3284 6 9.5 6H7.5ZM16.5 9H14.5C14.2239 9 14 9.2239 14 9.5V11.5C14 11.7761 14.2239 12 14.5 12H16.5C16.7761 12 17 11.7761 17 11.5V9.5C17 9.2239 16.7761 9 16.5 9ZM14.5 8C13.6716 8 13 8.6716 13 9.5V11.5C13 12.3284 13.6716 13 14.5 13H16.5C17.3284 13 18 12.3284 18 11.5V9.5C18 8.6716 17.3284 8 16.5 8H14.5ZM9.5 14H7.5C7.22386 14 7 14.2239 7 14.5V16.5C7 16.7761 7.22386 17 7.5 17H9.5C9.77614 17 10 16.7761 10 16.5V14.5C10 14.2239 9.77614 14 9.5 14ZM7.5 13C6.67157 13 6 13.6716 6 14.5V16.5C6 17.3284 6.67157 18 7.5 18H9.5C10.3284 18 11 17.3284 11 16.5V14.5C11 13.6716 10.3284 13 9.5 13H7.5Z" fill="currentColor"/></svg>',
    // composed: autolayout-wrap squares + 1px arrow (its head drawn here, not a kit chevron)
    flowVertical: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 7H7.5C7.22386 7 7 7.2239 7 7.5V9.5C7 9.7761 7.22386 10 7.5 10H9.5C9.77614 10 10 9.7761 10 9.5V7.5C10 7.2239 9.77614 7 9.5 7ZM7.5 6C6.67157 6 6 6.6716 6 7.5V9.5C6 10.3284 6.67157 11 7.5 11H9.5C10.3284 11 11 10.3284 11 9.5V7.5C11 6.6716 10.3284 6 9.5 6H7.5ZM9.5 14H7.5C7.22386 14 7 14.2239 7 14.5V16.5C7 16.7761 7.22386 17 7.5 17H9.5C9.77614 17 10 16.7761 10 16.5V14.5C10 14.2239 9.77614 14 9.5 14ZM7.5 13C6.67157 13 6 13.6716 6 14.5V16.5C6 17.3284 6.67157 18 7.5 18H9.5C10.3284 18 11 17.3284 11 16.5V14.5C11 13.6716 10.3284 13 9.5 13H7.5Z" fill="currentColor"/><path d="M15.5 6C15.7761 6 16 6.22386 16 6.5V17.5C16 17.7761 15.7761 18 15.5 18C15.2239 18 15 17.7761 15 17.5V6.5C15 6.22386 15.2239 6 15.5 6ZM13.1464 15.1464C13.3417 14.9512 13.6583 14.9512 13.8536 15.1464L15.5 16.7929L17.1464 15.1464C17.3417 14.9512 17.6583 14.9512 17.8536 15.1464C18.0488 15.3417 18.0488 15.6583 17.8536 15.8536L15.8536 17.8536C15.6583 18.0488 15.3417 18.0488 15.1464 17.8536L13.1464 15.8536C12.9512 15.6583 12.9512 15.3417 13.1464 15.1464Z" fill="currentColor"/></svg>',
    // composed: autolayout-wrap squares + 1px arrow (its head drawn here, not a kit chevron)
    flowHorizontal: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 7H7.5C7.22386 7 7 7.2239 7 7.5V9.5C7 9.7761 7.22386 10 7.5 10H9.5C9.77614 10 10 9.7761 10 9.5V7.5C10 7.2239 9.77614 7 9.5 7ZM7.5 6C6.67157 6 6 6.6716 6 7.5V9.5C6 10.3284 6.67157 11 7.5 11H9.5C10.3284 11 11 10.3284 11 9.5V7.5C11 6.6716 10.3284 6 9.5 6H7.5ZM16.5 7H14.5C14.2239 7 14 7.2239 14 7.5V9.5C14 9.7761 14.2239 10 14.5 10H16.5C16.7761 10 17 9.7761 17 9.5V7.5C17 7.2239 16.7761 7 16.5 7ZM14.5 6C13.6716 6 13 6.6716 13 7.5V9.5C13 10.3284 13.6716 11 14.5 11H16.5C17.3284 11 18 10.3284 18 9.5V7.5C18 6.6716 17.3284 6 16.5 6H14.5Z" fill="currentColor"/><path d="M6 15.5C6 15.2239 6.22386 15 6.5 15H17.5C17.7761 15 18 15.2239 18 15.5C18 15.7761 17.7761 16 17.5 16H6.5C6.22386 16 6 15.7761 6 15.5ZM15.1464 13.1464C15.3417 12.9512 15.6583 12.9512 15.8536 13.1464L17.8536 15.1464C18.0488 15.3417 18.0488 15.6583 17.8536 15.8536L15.8536 17.8536C15.6583 18.0488 15.3417 18.0488 15.1464 17.8536C14.9512 17.6583 14.9512 17.3417 15.1464 17.1464L16.7929 15.5L15.1464 13.8536C14.9512 13.6583 14.9512 13.3417 15.1464 13.1464Z" fill="currentColor"/></svg>',
    // composed: autolayout-wrap squares
    flowGrid: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 7H7.5C7.22386 7 7 7.2239 7 7.5V9.5C7 9.7761 7.22386 10 7.5 10H9.5C9.77614 10 10 9.7761 10 9.5V7.5C10 7.2239 9.77614 7 9.5 7ZM7.5 6C6.67157 6 6 6.6716 6 7.5V9.5C6 10.3284 6.67157 11 7.5 11H9.5C10.3284 11 11 10.3284 11 9.5V7.5C11 6.6716 10.3284 6 9.5 6H7.5ZM16.5 7H14.5C14.2239 7 14 7.2239 14 7.5V9.5C14 9.7761 14.2239 10 14.5 10H16.5C16.7761 10 17 9.7761 17 9.5V7.5C17 7.2239 16.7761 7 16.5 7ZM14.5 6C13.6716 6 13 6.6716 13 7.5V9.5C13 10.3284 13.6716 11 14.5 11H16.5C17.3284 11 18 10.3284 18 9.5V7.5C18 6.6716 17.3284 6 16.5 6H14.5ZM9.5 14H7.5C7.22386 14 7 14.2239 7 14.5V16.5C7 16.7761 7.22386 17 7.5 17H9.5C9.77614 17 10 16.7761 10 16.5V14.5C10 14.2239 9.77614 14 9.5 14ZM7.5 13C6.67157 13 6 13.6716 6 14.5V16.5C6 17.3284 6.67157 18 7.5 18H9.5C10.3284 18 11 17.3284 11 16.5V14.5C11 13.6716 10.3284 13 9.5 13H7.5ZM16.5 14H14.5C14.2239 14 14 14.2239 14 14.5V16.5C14 16.7761 14.2239 17 14.5 17H16.5C16.7761 17 17 16.7761 17 16.5V14.5C17 14.2239 16.7761 14 16.5 14ZM14.5 13C13.6716 13 13 13.6716 13 14.5V16.5C13 17.3284 13.6716 18 14.5 18H16.5C17.3284 18 18 17.3284 18 16.5V14.5C18 13.6716 17.3284 13 16.5 13H14.5Z" fill="currentColor"/></svg>',
    // al.layout-wrap
    flowWrap: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 7C16.1046 7 17 7.89543 17 9C17 10.1046 16.1046 11 15 11H13.5H9.71098L12.1101 8.61171C12.3058 8.41689 12.3065 8.10031 12.1117 7.90461C11.9169 7.7089 11.6003 7.70819 11.4046 7.90301L8.14725 11.1456C8.05299 11.2395 8 11.367 8 11.5C8 11.633 8.05299 11.7605 8.14725 11.8544L11.4046 15.097C11.6003 15.2918 11.9169 15.2911 12.1117 15.0954C12.3065 14.8997 12.3058 14.5831 12.1101 14.3883L9.71098 12L13.5 12H15C16.6569 12 18 10.6569 18 9C18 7.34315 16.6569 6 15 6H14.5C14.2239 6 14 6.22386 14 6.5C14 6.77614 14.2239 7 14.5 7H15Z" fill="currentColor"/></svg>',
    // al.padding-horizontal
    padH: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 7.5C8 7.22386 7.77614 7 7.5 7C7.22386 7 7 7.22386 7 7.5V16.5C7 16.7761 7.22386 17 7.5 17C7.77614 17 8 16.7761 8 16.5V7.5ZM16.5 7C16.7761 7 17 7.22386 17 7.5V16.5C17 16.7761 16.7761 17 16.5 17C16.2239 17 16 16.7761 16 16.5V7.5C16 7.22386 16.2239 7 16.5 7ZM13 13V11H11V13H13ZM14 11C14 10.4477 13.5523 10 13 10H11C10.4477 10 10 10.4477 10 11V13C10 13.5523 10.4477 14 11 14H13C13.5523 14 14 13.5523 14 13V11Z" fill="currentColor"/></svg>',
    // al.padding-vertical
    padV: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 16C7.22386 16 7 16.2239 7 16.5C7 16.7761 7.22386 17 7.5 17H16.5C16.7761 17 17 16.7761 17 16.5C17 16.2239 16.7761 16 16.5 16H7.5ZM7 7.5C7 7.22385 7.22386 7 7.5 7H16.5C16.7761 7 17 7.22385 17 7.5C17 7.77615 16.7761 8 16.5 8H7.5C7.22386 8 7 7.77615 7 7.5ZM13 11H11V13H13V11ZM11 10C10.4477 10 10 10.4477 10 11V13C10 13.5523 10.4477 14 11 14H13C13.5523 14 14 13.5523 14 13V11C14 10.4477 13.5523 10 13 10H11Z" fill="currentColor"/></svg>',
    // al.padding-sides
    padSides: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 9.5C8 9.22385 7.77614 9 7.5 9C7.22386 9 7 9.22385 7 9.5L7 14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V9.5ZM17 9.5C17 9.22385 16.7761 9 16.5 9C16.2239 9 16 9.22385 16 9.5V14.5C16 14.7761 16.2239 15 16.5 15C16.7761 15 17 14.7761 17 14.5V9.5ZM9 7.5C9 7.22385 9.22386 7 9.5 7H14.5C14.7761 7 15 7.22385 15 7.5C15 7.77615 14.7761 8 14.5 8H9.5C9.22386 8 9 7.77615 9 7.5ZM9.5 16C9.22386 16 9 16.2239 9 16.5C9 16.7761 9.22386 17 9.5 17H14.5C14.7761 17 15 16.7761 15 16.5C15 16.2239 14.7761 16 14.5 16H9.5Z" fill="currentColor"/></svg>',
    // al.padding-top
    padTop: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7C7.22386 7 7 7.22385 7 7.5C7 7.77615 7.22386 8 7.5 8H16.5C16.7761 8 17 7.77615 17 7.5C17 7.22385 16.7761 7 16.5 7L7.5 7ZM11 11H13V13H11V11ZM10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11Z" fill="currentColor"/></svg>',
    // al.padding-right
    padRight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17 7.5C17 7.22386 16.7761 7 16.5 7C16.2239 7 16 7.22386 16 7.5V16.5C16 16.7761 16.2239 17 16.5 17C16.7761 17 17 16.7761 17 16.5V7.5ZM13 11V13H11V11H13ZM13 10C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11C10 10.4477 10.4477 10 11 10H13Z" fill="currentColor"/></svg>',
    // al.padding-bottom
    padBottom: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 11H13V13H11V11ZM10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11ZM7.5 16C7.22386 16 7 16.2239 7 16.5C7 16.7761 7.22386 17 7.5 17H16.5C16.7761 17 17 16.7761 17 16.5C17 16.2239 16.7761 16 16.5 16H7.5Z" fill="currentColor"/></svg>',
    // al.padding-left
    padLeft: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 7.5C8 7.22386 7.77614 7 7.5 7C7.22386 7 7 7.22386 7 7.5V16.5C7 16.7761 7.22386 17 7.5 17C7.77614 17 8 16.7761 8 16.5V7.5ZM13 11V13H11V11H13ZM13 10C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11C10 10.4477 10.4477 10 11 10H13Z" fill="currentColor"/></svg>',
    // autolayoutgrid.dot (its 30% comes from the colour)
    alDot: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7Z" fill="currentColor"/></svg>',
    // autolayoutgrid.vertical, Position=Left
    alV_L: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C3.44772 3 3 3.44772 3 4C3 4.55228 3.44772 5 4 5L9 5C9.55228 5 10 4.55229 10 4C10 3.44772 9.55228 3 9 3L4 3ZM4 7C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9L12 9C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7L4 7ZM3 12C3 11.4477 3.44771 11 4 11L7 11C7.55228 11 8 11.4477 8 12C8 12.5523 7.55228 13 7 13L4 13C3.44771 13 3 12.5523 3 12Z" fill="currentColor"/></svg>',
    // autolayoutgrid.vertical, Position=Center
    alV_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 3C10.5523 3 11 3.44772 11 4C11 4.55228 10.5523 5 10 5L6 5C5.44772 5 5 4.55228 5 4C5 3.44772 5.44772 3 6 3H10ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9L4 9C3.44772 9 3 8.55228 3 8C3 7.44771 3.44772 7 4 7L12 7ZM10 12C10 11.4477 9.55228 11 9 11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H9C9.55228 13 10 12.5523 10 12Z" fill="currentColor"/></svg>',
    // autolayoutgrid.vertical, Position=Right
    alV_R: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 7C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9L12 9C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7L4 7ZM7 3C6.44772 3 6 3.44772 6 4C6 4.55228 6.44772 5 7 5L12 5C12.5523 5 13 4.55229 13 4C13 3.44772 12.5523 3 12 3L7 3ZM8 12C8 11.4477 8.44771 11 9 11L12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13L9 13C8.44771 13 8 12.5523 8 12Z" fill="currentColor"/></svg>',
    // autolayoutgrid.horizontal, Position=Top
    alH_T: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4V9C5 9.55228 4.55228 10 4 10C3.44772 10 3 9.55228 3 9V4ZM7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12V4ZM12 3C11.4477 3 11 3.44772 11 4V7C11 7.55228 11.4477 8 12 8C12.5523 8 13 7.55228 13 7V4C13 3.44772 12.5523 3 12 3Z" fill="currentColor"/></svg>',
    // autolayoutgrid.horizontal, Position=Center
    alH_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12V4ZM3 6C3 5.44772 3.44772 5 4 5C4.55228 5 5 5.44772 5 6V10C5 10.5523 4.55228 11 4 11C3.44772 11 3 10.5523 3 10V6ZM12 6C11.4477 6 11 6.44772 11 7V9C11 9.55228 11.4477 10 12 10C12.5523 10 13 9.55228 13 9V7C13 6.44772 12.5523 6 12 6Z" fill="currentColor"/></svg>',
    // autolayoutgrid.horizontal, Position=Bottom
    alH_B: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12V4ZM3 7C3 6.44772 3.44772 6 4 6C4.55228 6 5 6.44772 5 7V12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12V7ZM12 8C11.4477 8 11 8.44772 11 9V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V9C13 8.44772 12.5523 8 12 8Z" fill="currentColor"/></svg>',
    // autolayoutgrid.wrap, Position=Left
    alW_L: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C3.44772 3 3 3.44772 3 4V6C3 6.55228 3.44772 7 4 7C4.55228 7 5 6.55228 5 6V4C5 3.44772 4.55228 3 4 3ZM7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V4ZM11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V4ZM3 10C3 9.44772 3.44772 9 4 9C4.55228 9 5 9.44772 5 10V12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12V10ZM8 9C7.44772 9 7 9.44772 7 10V12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12V10C9 9.44772 8.55228 9 8 9Z" fill="currentColor"/></svg>',
    // autolayoutgrid.wrap, Position=Center
    alW_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C3.44772 3 3 3.44772 3 4V6C3 6.55228 3.44772 7 4 7C4.55228 7 5 6.55228 5 6V4C5 3.44772 4.55228 3 4 3ZM7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V4ZM11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V4ZM5 10C5 9.44772 5.44772 9 6 9C6.55228 9 7 9.44772 7 10V12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12V10ZM10 9C9.44772 9 9 9.44772 9 10V12C9 12.5523 9.44772 13 10 13C10.5523 13 11 12.5523 11 12V10C11 9.44772 10.5523 9 10 9Z" fill="currentColor"/></svg>',
    // autolayoutgrid.wrap, Position=Right
    alW_R: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C3.44772 3 3 3.44772 3 4V6C3 6.55228 3.44772 7 4 7C4.55228 7 5 6.55228 5 6V4C5 3.44772 4.55228 3 4 3ZM7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V6C9 6.55228 8.55228 7 8 7C7.44772 7 7 6.55228 7 6V4ZM11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V4ZM7 10C7 9.44772 7.44772 9 8 9C8.55228 9 9 9.44772 9 10V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12V10ZM12 9C11.4477 9 11 9.44772 11 10V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V10C13 9.44772 12.5523 9 12 9Z" fill="currentColor"/></svg>',
    // autolayoutgrid.vertical.auto.large, Position=Top
    alAutoV_T: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M12 3C12.5523 3 13 3.44772 13 4C13 4.55229 12.5523 5 12 5L4 5C3.44772 5 3 4.55228 3 4C3 3.44772 3.44771 3 4 3L12 3Z" fill="currentColor"/></svg>',
    // autolayoutgrid.vertical.auto.large, Position=Center
    alAutoV_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55229 12.5523 9 12 9L4 9C3.44772 9 3 8.55228 3 8C3 7.44772 3.44771 7 4 7L12 7Z" fill="currentColor"/></svg>',
    // autolayoutgrid.vertical.auto.large, Position=Bottom
    alAutoV_B: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13L4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44771 11 4 11L12 11Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.vertical.small, Position=Left
    alAutoVs_L: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 7C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9L8 9C8.55228 9 9 8.55229 9 8C9 7.44772 8.55228 7 8 7L4 7Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.vertical.small, Position=Center
    alAutoVs_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9L10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7L6 7Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.vertical.small, Position=Right
    alAutoVs_R: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9L12 9C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7L8 7Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.horizontal.large, Position=Left
    alAutoH_L: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4V12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12V4Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.horizontal.large, Position=Center
    alAutoH_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M7 4C7 3.44772 7.44772 3 8 3C8.55228 3 9 3.44772 9 4V12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12V4Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.horizontal.large, Position=Right
    alAutoH_R: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M11 4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V4Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.horizontal.small, Position=Top
    alAutoHs_T: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 3C7.44772 3 7 3.44772 7 4V8C7 8.55228 7.44772 9 8 9C8.55228 9 9 8.55228 9 8V4C9 3.44772 8.55228 3 8 3Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.horizontal.small, Position=Center
    alAutoHs_C: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 5C7.44772 5 7 5.44772 7 6V10C7 10.5523 7.44772 11 8 11C8.55228 11 9 10.5523 9 10V6C9 5.44772 8.55228 5 8 5Z" fill="currentColor"/></svg>',
    // autolayoutgrid.auto.horizontal.small, Position=Bottom
    alAutoHs_B: '<svg class="ft-ico" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 7C7.44772 7 7 7.44772 7 8V12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12V8C9 7.44772 8.55228 7 8 7Z" fill="currentColor"/></svg>',
    // al.constrain-horiz (the same glyph as spanWidth): Fixed width
    fixedW: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 8.49976C16.7761 8.49976 17 8.72361 17 8.99976V11.4998V13.9998C17 14.2759 16.7761 14.4998 16.5 14.4998C16.2239 14.4998 16 14.2759 16 13.9998V11.9998L7 11.9998L7 13.9998C7 14.2759 6.77614 14.4998 6.5 14.4998C6.22386 14.4998 6 14.2759 6 13.9998L6 11.4998L6 8.99976C6 8.72361 6.22386 8.49976 6.5 8.49976C6.77614 8.49976 7 8.72361 7 8.99976L7 10.9998L16 10.9998V8.99976C16 8.72361 16.2239 8.49976 16.5 8.49976Z" fill="currentColor"/></svg>',
    // al.constrain-vert: Fixed height
    fixedH: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 6.50024C8.5 6.2241 8.72386 6.00024 9 6.00024H11.5H14C14.2761 6.00024 14.5 6.2241 14.5 6.50024C14.5 6.77639 14.2761 7.00024 14 7.00024H12V16.0002H14C14.2761 16.0002 14.5 16.2241 14.5 16.5002C14.5 16.7764 14.2761 17.0002 14 17.0002H11.5H9C8.72386 17.0002 8.5 16.7764 8.5 16.5002C8.5 16.2241 8.72386 16.0002 9 16.0002H11V7.00024H9C8.72386 7.00024 8.5 6.77639 8.5 6.50024Z" fill="currentColor"/></svg>',
    // al.width-hug
    hugW: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.14644 8.14645C7.34171 7.95119 7.65829 7.95118 7.85355 8.14644L10.8536 11.1464C10.9473 11.2402 11 11.3674 11 11.5C11 11.6326 10.9473 11.7598 10.8536 11.8535L7.85355 14.8535C7.65829 15.0488 7.34171 15.0488 7.14645 14.8535C6.95118 14.6583 6.95118 14.3417 7.14645 14.1464L9.79289 11.5L7.14645 8.85356C6.95119 8.65829 6.95118 8.34171 7.14644 8.14645ZM16.8536 8.14645C17.0488 8.34171 17.0488 8.65829 16.8536 8.85356L14.2071 11.5L16.8536 14.1464C17.0488 14.3417 17.0488 14.6583 16.8536 14.8535C16.6583 15.0488 16.3417 15.0488 16.1464 14.8535L13.1464 11.8535C13.0527 11.7598 13 11.6326 13 11.5C13 11.3674 13.0527 11.2402 13.1464 11.1464L16.1464 8.14644C16.3417 7.95118 16.6583 7.95119 16.8536 8.14645Z" fill="currentColor"/></svg>',
    // al.height-hug
    hugH: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.8535 7.14645C15.0488 7.34171 15.0488 7.65829 14.8535 7.85355L11.8536 10.8536C11.7598 10.9473 11.6326 11 11.5 11C11.3674 11 11.2402 10.9473 11.1464 10.8536L8.14645 7.85355C7.95118 7.65829 7.95118 7.34171 8.14645 7.14645C8.34171 6.95118 8.65829 6.95118 8.85355 7.14645L11.5 9.79289L14.1464 7.14645C14.3417 6.95119 14.6583 6.95118 14.8535 7.14645ZM14.8535 16.8536C14.6583 17.0488 14.3417 17.0488 14.1464 16.8536L11.5 14.2071L8.85355 16.8536C8.65829 17.0488 8.34171 17.0488 8.14645 16.8536C7.95118 16.6583 7.95118 16.3417 8.14645 16.1464L11.1464 13.1464C11.2402 13.0527 11.3674 13 11.5 13C11.6326 13 11.7598 13.0527 11.8536 13.1464L14.8535 16.1464C15.0488 16.3417 15.0488 16.6583 14.8535 16.8536Z" fill="currentColor"/></svg>',
    // al.width-fill
    fillW: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.35355 8.14645C9.54882 8.34171 9.54882 8.65829 9.35355 8.85355L7.20713 11L16.7928 10.9998L14.6465 8.85357C14.4512 8.65831 14.4512 8.34173 14.6464 8.14646C14.8417 7.95119 15.1583 7.95118 15.3535 8.14643L18.3535 11.1462C18.4473 11.24 18.5 11.3671 18.5 11.4997C18.5 11.6323 18.4473 11.7595 18.3536 11.8533L15.3536 14.8535C15.1583 15.0488 14.8417 15.0488 14.6465 14.8536C14.4512 14.6583 14.4512 14.3417 14.6464 14.1465L16.7929 11.9998L7.20708 12L9.35355 14.1464C9.54882 14.3417 9.54882 14.6583 9.35355 14.8536C9.15829 15.0488 8.84171 15.0488 8.64645 14.8536L5.64645 11.8536C5.45118 11.6583 5.45118 11.3417 5.64645 11.1464L8.64645 8.14645C8.84171 7.95118 9.15829 7.95118 9.35355 8.14645Z" fill="currentColor"/></svg>',
    // al.height-fill
    fillH: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.8536 14.1464C15.0488 14.3417 15.0488 14.6583 14.8536 14.8535L11.8536 17.8535C11.6583 18.0488 11.3417 18.0488 11.1464 17.8535L8.14645 14.8535C7.95118 14.6583 7.95118 14.3417 8.14645 14.1464C8.34171 13.9512 8.65829 13.9512 8.85355 14.1464L11 16.2929V7.70711L8.85355 9.85355C8.65829 10.0488 8.34171 10.0488 8.14645 9.85355C7.95118 9.65829 7.95118 9.34171 8.14645 9.14645L11.1464 6.14645C11.2402 6.05268 11.3674 6 11.5 6C11.6326 6 11.7598 6.05268 11.8536 6.14645L14.8536 9.14645C15.0488 9.34171 15.0488 9.65829 14.8536 9.85355C14.6583 10.0488 14.3417 10.0488 14.1464 9.85355L12 7.70711L12 16.2929L14.1464 14.1464C14.3417 13.9512 14.6583 13.9512 14.8536 14.1464Z" fill="currentColor"/></svg>',
    // al.absolute-position: Ignore auto layout
    ignoreLayout: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 7C6 6.44771 6.44771 6 7 6H9.5C9.77614 6 10 6.22386 10 6.5C10 6.77614 9.77614 7 9.5 7H7V9.5C7 9.77614 6.77614 10 6.5 10C6.22386 10 6 9.77614 6 9.5V7ZM18 7C18 6.44771 17.5523 6 17 6H14.5C14.2239 6 14 6.22386 14 6.5C14 6.77614 14.2239 7 14.5 7H17V9.5C17 9.77614 17.2239 10 17.5 10C17.7761 10 18 9.77614 18 9.5V7ZM7 18C6.44771 18 6 17.5523 6 17V14.5C6 14.2239 6.22386 14 6.5 14C6.77614 14 7 14.2239 7 14.5V17H9.5C9.77614 17 10 17.2239 10 17.5C10 17.7761 9.77614 18 9.5 18H7ZM18 17C18 17.5523 17.5523 18 17 18H14.5C14.2239 18 14 17.7761 14 17.5C14 17.2239 14.2239 17 14.5 17H17V14.5C17 14.2239 17.2239 14 17.5 14C17.7761 14 18 14.2239 18 14.5V17ZM9.99994 10H13.9999V14H9.99994V10ZM8.99994 10C8.99994 9.44772 9.44765 9 9.99994 9H13.9999C14.5522 9 14.9999 9.44772 14.9999 10V14C14.9999 14.5523 14.5522 15 13.9999 15H9.99994C9.44765 15 8.99994 14.5523 8.99994 14V10Z" fill="currentColor"/></svg>',
    // autolayout-add-vertical: the Layout header's Add auto layout, when the layers stack
    alAddV: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 9.5L7 7.5C7 7.22386 7.22386 7 7.5 7L16.5 7C16.7761 7 17 7.22386 17 7.5L17 9.5C17 9.77614 16.7761 10 16.5 10L7.5 10C7.22386 10 7 9.77614 7 9.5ZM6 7.5C6 6.67157 6.67157 6 7.5 6L16.5 6C17.3284 6 18 6.67157 18 7.5L18 9.5C18 10.3284 17.3284 11 16.5 11L7.5 11C6.67157 11 6 10.3284 6 9.5L6 7.5ZM7 16.5L7 14.5C7 14.2239 7.22386 14 7.5 14L9.5 14C9.77614 14 10 14.2239 10 14.5L10 16.5C10 16.7761 9.77614 17 9.5 17L7.5 17C7.22386 17 7 16.7761 7 16.5ZM6 14.5C6 13.6716 6.67157 13 7.5 13L9.5 13C10.3284 13 11 13.6716 11 14.5L11 16.5C11 17.3284 10.3284 18 9.5 18L7.5 18C6.67157 18 6 17.3284 6 16.5L6 14.5ZM13.5 16C13.2239 16 13 15.7761 13 15.5C13 15.2239 13.2239 15 13.5 15L15 15L15 13.5C15 13.2239 15.2239 13 15.5 13C15.7761 13 16 13.2239 16 13.5L16 15L17.5 15C17.7761 15 18 15.2239 18 15.5C18 15.7761 17.7761 16 17.5 16L16 16L16 17.5C16 17.7761 15.7761 18 15.5 18C15.2239 18 15 17.7761 15 17.5L15 16L13.5 16Z" fill="currentColor"/></svg>',
    // autolayout-add-horizontal: the same, when the layers sit in a row
    alAddH: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 7H7.5C7.22386 7 7 7.22386 7 7.5V16.5C7 16.7761 7.22386 17 7.5 17H9.5C9.77614 17 10 16.7761 10 16.5V7.5C10 7.22386 9.77614 7 9.5 7ZM7.5 6C6.67157 6 6 6.67157 6 7.5V16.5C6 17.3284 6.67157 18 7.5 18H9.5C10.3284 18 11 17.3284 11 16.5V7.5C11 6.67157 10.3284 6 9.5 6H7.5ZM16.5 7H14.5C14.2239 7 14 7.22386 14 7.5V9.5C14 9.77614 14.2239 10 14.5 10H16.5C16.7761 10 17 9.77614 17 9.5V7.5C17 7.22386 16.7761 7 16.5 7ZM14.5 6C13.6716 6 13 6.67157 13 7.5V9.5C13 10.3284 13.6716 11 14.5 11H16.5C17.3284 11 18 10.3284 18 9.5V7.5C18 6.67157 17.3284 6 16.5 6H14.5ZM16 13.5C16 13.2239 15.7761 13 15.5 13C15.2239 13 15 13.2239 15 13.5V15H13.5C13.2239 15 13 15.2239 13 15.5C13 15.7761 13.2239 16 13.5 16H15V17.5C15 17.7761 15.2239 18 15.5 18C15.7761 18 16 17.7761 16 17.5V16H17.5C17.7761 16 18 15.7761 18 15.5C18 15.2239 17.7761 15 17.5 15H16V13.5Z" fill="currentColor"/></svg>',
    // autolayout-add-wrap
    alAddWrap: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H9.5C9.77614 7 10 7.22386 10 7.5V9.5C10 9.77614 9.77614 10 9.5 10H7.5C7.22386 10 7 9.77614 7 9.5V7.5C7 7.22386 7.22386 7 7.5 7ZM6 7.5C6 6.67157 6.67157 6 7.5 6H9.5C10.3284 6 11 6.67157 11 7.5V9.5C11 10.3284 10.3284 11 9.5 11H7.5C6.67157 11 6 10.3284 6 9.5V7.5ZM14.5 7H16.5C16.7761 7 17 7.22386 17 7.5V9.5C17 9.77614 16.7761 10 16.5 10H14.5C14.2239 10 14 9.77614 14 9.5V7.5C14 7.22386 14.2239 7 14.5 7ZM13 7.5C13 6.67157 13.6716 6 14.5 6H16.5C17.3284 6 18 6.67157 18 7.5V9.5C18 10.3284 17.3284 11 16.5 11H14.5C13.6716 11 13 10.3284 13 9.5V7.5ZM9.5 14H7.5C7.22386 14 7 14.2239 7 14.5V16.5C7 16.7761 7.22386 17 7.5 17H9.5C9.77614 17 10 16.7761 10 16.5V14.5C10 14.2239 9.77614 14 9.5 14ZM7.5 13C6.67157 13 6 13.6716 6 14.5V16.5C6 17.3284 6.67157 18 7.5 18H9.5C10.3284 18 11 17.3284 11 16.5V14.5C11 13.6716 10.3284 13 9.5 13H7.5ZM16 13.5C16 13.2239 15.7761 13 15.5 13C15.2239 13 15 13.2239 15 13.5V15H13.5C13.2239 15 13 15.2239 13 15.5C13 15.7761 13.2239 16 13.5 16H15V17.5C15 17.7761 15.2239 18 15.5 18C15.7761 18 16 17.7761 16 17.5V16H17.5C17.7761 16 18 15.7761 18 15.5C18 15.2239 17.7761 15 17.5 15H16V13.5Z" fill="currentColor"/></svg>',
    // radius.top.left
    cornerTL: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4781 8L12.5 8H15.5C15.7761 8 16 8.22386 16 8.5C16 8.77614 15.7761 9 15.5 9H12.5C11.7917 9 11.2905 9.00039 10.8987 9.0324C10.5128 9.06393 10.2772 9.12365 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9.12365 10.2772 9.06393 10.5128 9.0324 10.8987C9.00039 11.2905 9 11.7917 9 12.5V15.5C9 15.7761 8.77614 16 8.5 16C8.22386 16 8 15.7761 8 15.5V12.5L8 12.4781C8 11.7966 7.99999 11.2546 8.03572 10.8173C8.07231 10.3695 8.14884 9.98765 8.32698 9.63803C8.6146 9.07354 9.07354 8.6146 9.63803 8.32698C9.98765 8.14884 10.3695 8.07231 10.8173 8.03572C11.2546 7.99999 11.7966 8 12.4781 8Z" fill="currentColor"/></svg>',
    // radius.top.right
    cornerTR: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5219 8L11.5 8H8.5C8.22386 8 8 8.22386 8 8.5C8 8.77614 8.22386 9 8.5 9H11.5C12.2083 9 12.7095 9.00039 13.1013 9.0324C13.4872 9.06393 13.7228 9.12365 13.908 9.21799C14.2843 9.40973 14.5903 9.71569 14.782 10.092C14.8764 10.2772 14.9361 10.5128 14.9676 10.8987C14.9996 11.2905 15 11.7917 15 12.5V15.5C15 15.7761 15.2239 16 15.5 16C15.7761 16 16 15.7761 16 15.5V12.5V12.4781C16 11.7966 16 11.2546 15.9643 10.8173C15.9277 10.3695 15.8512 9.98765 15.673 9.63803C15.3854 9.07354 14.9265 8.6146 14.362 8.32698C14.0123 8.14884 13.6305 8.07231 13.1827 8.03572C12.7454 7.99999 12.2034 8 11.5219 8Z" fill="currentColor"/></svg>',
    // radius.bottom.left
    cornerBL: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.4781 16H12.5H15.5C15.7761 16 16 15.7761 16 15.5C16 15.2239 15.7761 15 15.5 15H12.5C11.7917 15 11.2905 14.9996 10.8987 14.9676C10.5128 14.9361 10.2772 14.8764 10.092 14.782C9.71569 14.5903 9.40973 14.2843 9.21799 13.908C9.12365 13.7228 9.06393 13.4872 9.0324 13.1013C9.00039 12.7095 9 12.2083 9 11.5V8.5C9 8.22386 8.77614 8 8.5 8C8.22386 8 8 8.22386 8 8.5V11.5L8 11.5219C8 12.2034 7.99999 12.7454 8.03572 13.1827C8.07231 13.6305 8.14884 14.0123 8.32698 14.362C8.6146 14.9265 9.07354 15.3854 9.63803 15.673C9.98765 15.8512 10.3695 15.9277 10.8173 15.9643C11.2546 16 11.7966 16 12.4781 16Z" fill="currentColor"/></svg>',
    // radius.bottom.right
    cornerBR: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5219 16H11.5H8.5C8.22386 16 8 15.7761 8 15.5C8 15.2239 8.22386 15 8.5 15H11.5C12.2083 15 12.7095 14.9996 13.1013 14.9676C13.4872 14.9361 13.7228 14.8764 13.908 14.782C14.2843 14.5903 14.5903 14.2843 14.782 13.908C14.8764 13.7228 14.9361 13.4872 14.9676 13.1013C14.9996 12.7095 15 12.2083 15 11.5V8.5C15 8.22386 15.2239 8 15.5 8C15.7761 8 16 8.22386 16 8.5V11.5V11.5219C16 12.2034 16 12.7454 15.9643 13.1827C15.9277 13.6305 15.8512 14.0123 15.673 14.362C15.3854 14.9265 14.9265 15.3854 14.362 15.673C14.0123 15.8512 13.6305 15.9277 13.1827 15.9643C12.7454 16 12.2034 16 11.5219 16Z" fill="currentColor"/></svg>',
    // adjust.small
    sliders: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 5.5C8 5.22386 8.22386 5 8.5 5C8.77614 5 9 5.22386 9 5.5V12.05C10.1411 12.2816 11 13.2905 11 14.5C11 15.7095 10.1411 16.7184 9 16.95V18.5C9 18.7761 8.77614 19 8.5 19C8.22386 19 8 18.7761 8 18.5V16.95C6.85888 16.7184 6 15.7095 6 14.5C6 13.2905 6.85888 12.2816 8 12.05V5.5ZM7 14.5C7 13.6716 7.67157 13 8.5 13C9.32843 13 10 13.6716 10 14.5C10 15.3284 9.32843 16 8.5 16C7.67157 16 7 15.3284 7 14.5ZM15 18.5C15 18.7761 15.2239 19 15.5 19C15.7761 19 16 18.7761 16 18.5V11.95C17.1411 11.7184 18 10.7095 18 9.5C18 8.29052 17.1411 7.28164 16 7.05001V5.5C16 5.22386 15.7761 5 15.5 5C15.2239 5 15 5.22386 15 5.5V7.05001C13.8589 7.28164 13 8.29052 13 9.5C13 10.7095 13.8589 11.7184 15 11.95V18.5ZM14 9.5C14 10.3284 14.6716 11 15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5Z" fill="currentColor"/></svg>',
    // layout-align-left
    alignLeft: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.25 10C17.6642 10 18 9.66421 18 9.25V8.75C18 8.33579 17.6642 8 17.25 8H8.75C8.33579 8 8 8.33579 8 8.75V9.25C8 9.66421 8.33579 10 8.75 10H17.25ZM13.25 15C13.6642 15 14 14.6642 14 14.25V13.75C14 13.3358 13.6642 13 13.25 13H8.75C8.33579 13 8 13.3358 8 13.75V14.25C8 14.6642 8.33579 15 8.75 15H13.25Z" fill="currentColor"/><path d="M6 17.5C6 17.7761 5.77614 18 5.5 18C5.22386 18 5 17.7761 5 17.5V5.5C5 5.22386 5.22386 5 5.5 5C5.77614 5 6 5.22386 6 5.5V17.5Z" fill="currentColor" fill-opacity="0.333"/></svg>',
    // layout-align-horizontal-center
    alignHCenter: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.25 10C17.6642 10 18 9.66421 18 9.25V8.75C18 8.33579 17.6642 8 17.25 8H7.75C7.33579 8 7 8.33579 7 8.75V9.25C7 9.66421 7.33579 10 7.75 10H17.25ZM15.25 15C15.6642 15 16 14.6642 16 14.25V13.75C16 13.3358 15.6642 13 15.25 13H9.75C9.33579 13 9 13.3358 9 13.75V14.25C9 14.6642 9.33579 15 9.75 15H15.25Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13 17.5C13 17.7761 12.7761 18 12.5 18C12.2239 18 12 17.7761 12 17.5V15H13V17.5ZM13 13V10H12V13H13ZM13 5.5V8H12V5.5C12 5.22386 12.2239 5 12.5 5C12.7761 5 13 5.22386 13 5.5Z" fill="currentColor" fill-opacity="0.333"/></svg>',
    // layout-align-right
    alignRight: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 10C6.33579 10 6 9.66421 6 9.25V8.75C6 8.33579 6.33579 8 6.75 8H15.25C15.6642 8 16 8.33579 16 8.75V9.25C16 9.66421 15.6642 10 15.25 10H6.75ZM10.75 15C10.3358 15 10 14.6642 10 14.25V13.75C10 13.3358 10.3358 13 10.75 13H15.25C15.6642 13 16 13.3358 16 13.75V14.25C16 14.6642 15.6642 15 15.25 15H10.75Z" fill="currentColor"/><path d="M18 17.5C18 17.7761 18.2239 18 18.5 18C18.7761 18 19 17.7761 19 17.5V5.5C19 5.22386 18.7761 5 18.5 5C18.2239 5 18 5.22386 18 5.5V17.5Z" fill="currentColor" fill-opacity="0.333"/></svg>',
    // layout-align-top
    alignTop: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 17.25C10 17.6642 9.66421 18 9.25 18H8.75C8.33579 18 8 17.6642 8 17.25L8 8.75C8 8.33579 8.33579 8 8.75 8H9.25C9.66421 8 10 8.33579 10 8.75V17.25ZM15 13.25C15 13.6642 14.6642 14 14.25 14H13.75C13.3358 14 13 13.6642 13 13.25V8.75C13 8.33579 13.3358 8 13.75 8H14.25C14.6642 8 15 8.33579 15 8.75V13.25Z" fill="currentColor"/><path d="M17.5 6C17.7761 6 18 5.77614 18 5.5C18 5.22386 17.7761 5 17.5 5L5.5 5C5.22386 5 5 5.22386 5 5.5C5 5.77614 5.22386 6 5.5 6L17.5 6Z" fill="currentColor" fill-opacity="0.333"/></svg>',
    // layout-align-vertical-center
    alignVCenter: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.75C10 6.33579 9.66421 6 9.25 6H8.75C8.33579 6 8 6.33579 8 6.75V16.25C8 16.6642 8.33579 17 8.75 17H9.25C9.66421 17 10 16.6642 10 16.25V6.75ZM15 8.75C15 8.33579 14.6642 8 14.25 8H13.75C13.3358 8 13 8.33579 13 8.75V14.25C13 14.6642 13.3358 15 13.75 15H14.25C14.6642 15 15 14.6642 15 14.25V8.75Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 11C17.7761 11 18 11.2239 18 11.5C18 11.7761 17.7761 12 17.5 12H15V11H17.5ZM13 11H10V12H13V11ZM5.5 11H8V12H5.5C5.22386 12 5 11.7761 5 11.5C5 11.2239 5.22386 11 5.5 11Z" fill="currentColor" fill-opacity="0.333"/></svg>',
    // grid-column (1:535488, Figma's columns layout grid): the column help card, and each row of Layout guide styles,
    // as Figma marks a layout guide style with it
    gridColumn: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 6C7.77614 6 8 6.22386 8 6.5V7H11.5V6.5C11.5 6.22386 11.7239 6 12 6C12.2761 6 12.5 6.22386 12.5 6.5V7H16V6.5C16 6.22386 16.2239 6 16.5 6C16.7761 6 17 6.22386 17 6.5V7H17.5C17.7761 7 18 7.22386 18 7.5C18 7.77614 17.7761 8 17.5 8H17V16H17.5C17.7761 16 18 16.2239 18 16.5C18 16.7761 17.7761 17 17.5 17H17V17.5C17 17.7761 16.7761 18 16.5 18C16.2239 18 16 17.7761 16 17.5V17H12.5V17.5C12.5 17.7761 12.2761 18 12 18C11.7239 18 11.5 17.7761 11.5 17.5V17H8V17.5C8 17.7761 7.77614 18 7.5 18C7.22386 18 7 17.7761 7 17.5V17H6.5C6.22386 17 6 16.7761 6 16.5C6 16.2239 6.22386 16 6.5 16H7V8H6.5C6.22386 8 6 7.77614 6 7.5C6 7.22386 6.22386 7 6.5 7H7V6.5C7 6.22386 7.22386 6 7.5 6ZM8 16H11.5V8H8V16ZM12.5 16H16V8H12.5V16Z" fill="currentColor"/></svg>',
    // layout-grid-columns: the help for several columns
    gridColumns: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5H8V19H5V5ZM11 5H14V19H11V5ZM20 5H17V19H20V5Z" fill="currentColor"/></svg>',
    // al.constrain-horiz: Match item width to columns
    spanWidth: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5 8.49976C16.7761 8.49976 17 8.72361 17 8.99976V11.4998V13.9998C17 14.2759 16.7761 14.4998 16.5 14.4998C16.2239 14.4998 16 14.2759 16 13.9998V11.9998L7 11.9998L7 13.9998C7 14.2759 6.77614 14.4998 6.5 14.4998C6.22386 14.4998 6 14.2759 6 13.9998L6 11.4998L6 8.99976C6 8.72361 6.22386 8.49976 6.5 8.49976C6.77614 8.49976 7 8.72361 7 8.99976L7 10.9998L16 10.9998V8.99976C16 8.72361 16.2239 8.49976 16.5 8.49976Z" fill="currentColor"/></svg>',
    // fit.to.width.small: the help for matching width
    fitWidth: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 7H17.5C17.7761 7 18 7.22386 18 7.5V16.5C18 16.7761 17.7761 17 17.5 17H6.5C6.22386 17 6 16.7761 6 16.5V7.5C6 7.22386 6.22386 7 6.5 7ZM5 7.5C5 6.67157 5.67157 6 6.5 6H17.5C18.3284 6 19 6.67157 19 7.5V16.5C19 17.3284 18.3284 18 17.5 18H6.5C5.67157 18 5 17.3284 5 16.5V7.5ZM9.35355 10.8535C9.54881 10.6583 9.54881 10.3417 9.35355 10.1465C9.15829 9.95119 8.84171 9.95119 8.64645 10.1465L7.14645 11.6465C6.95119 11.8417 6.95119 12.1583 7.14645 12.3535L8.64645 13.8535C8.84171 14.0488 9.15829 14.0488 9.35355 13.8535C9.54881 13.6583 9.54881 13.3417 9.35355 13.1465L8.70711 12.5H15.2929L14.6465 13.1465C14.4512 13.3417 14.4512 13.6583 14.6465 13.8535C14.8417 14.0488 15.1583 14.0488 15.3535 13.8535L16.8535 12.3535C17.0488 12.1583 17.0488 11.8417 16.8535 11.6465L15.3535 10.1465C15.1583 9.95119 14.8417 9.95119 14.6465 10.1465C14.4512 10.3417 14.4512 10.6583 14.6465 10.8535L15.2929 11.5H8.70711L9.35355 10.8535Z" fill="currentColor"/></svg>',
    // close (the large one, as Figma's help card has)
    dismiss: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3536 6.64645C17.5488 6.84171 17.5488 7.15829 17.3536 7.35355L12.7071 12L17.3536 16.6464C17.5488 16.8417 17.5488 17.1583 17.3536 17.3536C17.1583 17.5488 16.8417 17.5488 16.6464 17.3536L12 12.7071L7.35355 17.3536C7.15829 17.5488 6.84171 17.5488 6.64645 17.3536C6.45118 17.1583 6.45118 16.8417 6.64645 16.6464L11.2929 12L6.64645 7.35365C6.45119 7.15839 6.45118 6.84181 6.64644 6.64654C6.84171 6.45128 7.15829 6.45128 7.35355 6.64654L12 11.2929L16.6464 6.64645C16.8417 6.45118 17.1583 6.45118 17.3536 6.64645Z" fill="currentColor"/></svg>',
    // layout-align-bottom
    alignBottom: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.75C10 6.33579 9.66421 6 9.25 6H8.75C8.33579 6 8 6.33579 8 6.75L8 15.25C8 15.6642 8.33579 16 8.75 16H9.25C9.66421 16 10 15.6642 10 15.25V6.75ZM15 10.75C15 10.3358 14.6642 10 14.25 10H13.75C13.3358 10 13 10.3358 13 10.75V15.25C13 15.6642 13.3358 16 13.75 16H14.25C14.6642 16 15 15.6642 15 15.25V10.75Z" fill="currentColor"/><path d="M17.5 18C17.7761 18 18 18.2239 18 18.5C18 18.7761 17.7761 19 17.5 19H5.5C5.22386 19 5 18.7761 5 18.5C5 18.2239 5.22386 18 5.5 18H17.5Z" fill="currentColor" fill-opacity="0.333"/></svg>',
    // more: Alignment's More options (Distribute spacing, Tidy up), as UI3 tucks them behind it
    more: '<svg class="ft-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 12C7.5 12.8284 6.82843 13.5 6 13.5C5.17157 13.5 4.5 12.8284 4.5 12C4.5 11.1716 5.17157 10.5 6 10.5C6.82843 10.5 7.5 11.1716 7.5 12ZM13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12ZM18 13.5C18.8284 13.5 19.5 12.8284 19.5 12C19.5 11.1716 18.8284 10.5 18 10.5C17.1716 10.5 16.5 11.1716 16.5 12C16.5 12.8284 17.1716 13.5 18 13.5Z" fill="currentColor"/></svg>',
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
  // Two modifiers in each platform's order: Mac's ⌃⌥⇧⌘, elsewhere Ctrl, Alt, Shift (as Figma on Windows writes them).
  KEYS.shiftMod = MAC ? "⇧⌘" : "Ctrl+Shift+";
  KEYS.altMod = MAC ? "⌥⌘" : "Ctrl+Alt+";
  // Figma's own keys for Tidy up (⌃⌥T, Ctrl+Alt+T) and Distribute spacing (⌃⌥H and ⌃⌥V on a Mac, Alt+Shift+H and
  // Alt+Shift+V elsewhere).
  KEYS.tidy = MAC ? "⌃⌥" : "Ctrl+Alt+";
  KEYS.distribute = MAC ? "⌃⌥" : "Alt+Shift+";

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
      // 300 ms (was 500; her call 2026-10-15, it came in late), then at once from one tip to the next.
      else tipTimer = setTimeout(() => showTip(target), 300);
    });
    target.addEventListener("pointerleave", hideTip);
    target.addEventListener("pointerdown", hideTip);
  }

  // The panel is set in Inter, as Figma's is. A page that has no Inter face of its own gets it once from Google Fonts
  // (her call, 2026-10-15), so every user sees the panel as designed without loading it themselves. A page that
  // already has an "Inter" face is left alone; a blocked request just leaves the system font the stack falls back to.
  function loadInter() {
    if (document.getElementById("ft-inter")) return;
    try {
      for (const f of document.fonts) if (f.family.replace(/["']/g, "").trim() === "Inter") return;
    } catch (e) {}
    const link = document.createElement("link");
    link.id = "ft-inter";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap";
    link.setAttribute("data-finetune-ui", "");
    document.head.appendChild(link);
  }
  // A checkbox row just clicked: its check animates (drawn in, or faded out) and its hover darkening flashes out,
  // staying off until the pointer leaves, as Figma's does.
  function toggling(row) {
    row.classList.add("is-toggling", "is-pressed");
    clearTimeout(row.ftToggleTimer);
    row.ftToggleTimer = setTimeout(() => row.classList.remove("is-toggling"), 400);
    row.addEventListener("pointerleave", () => row.classList.remove("is-pressed"), { once: true });
  }
  function iconButton(svg, tip, onClick) {
    const b = button("ft-icon-btn", null, onClick);
    b.innerHTML = svg;
    b.setAttribute("data-ft-tip", tip);
    b.setAttribute("aria-label", tip);
    withTip(b);
    return b;
  }

  // A color as the browser computes it: rgb() mostly, but oklch(), lab() and the rest stay as written, and
  // color-mix() computes to color(srgb …). Found inside a longer value too (a shadow, a drop-shadow()).
  const COLOR_FN = /(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\((?:[^()]|\([^()]*\))*\)/g;
  // Any other color is put in sRGB (the panel's hex) by the browser itself, through a relative color on a hidden
  // probe; out of gamut is clipped to it, as the page fill is sRGB.
  let colorProbe = null;
  const srgbSeen = new Map();
  function inSrgb(c) {
    if (/^(rgba?|color)\(/.test(c) && !/^color\((?!srgb\s)/.test(c)) return c;
    if (srgbSeen.has(c)) return srgbSeen.get(c);
    let out = null;
    if (window.CSS && CSS.supports("color", "rgb(from red r g b)")) {
      if (!colorProbe) {
        colorProbe = document.createElement("i");
        colorProbe.setAttribute("data-finetune-ui", "");
        colorProbe.style.display = "none";
      }
      if (!colorProbe.isConnected) document.documentElement.appendChild(colorProbe);
      colorProbe.style.color = "rgb(from " + c + " r g b)";
      out = getComputedStyle(colorProbe).color;
      colorProbe.style.color = "";
    }
    srgbSeen.set(c, out);
    return out;
  }

  function toFill(css) {
    COLOR_FN.lastIndex = 0;
    const found = COLOR_FN.exec(css || "");
    const c = found && inSrgb(found[0]);
    if (!c) return null;
    const srgb = /^color\(/.test(c);
    const p = c.slice(c.indexOf("(") + 1, -1).replace(/^srgb\s+/, "").split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    const a = p.length > 3 ? p[3] : 1;
    if (!(a > 0)) return null;
    const hex = p.slice(0, 3).map((n) => Math.round(Math.min(255, Math.max(0, srgb ? n * 255 : n))).toString(16).padStart(2, "0")).join("");
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
      const v = parseFloat(mathValue(alpha.value));
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

  // Figma's number fields take maths: 60-4 is 56, 16*1.5 is 24, (100-8)/2 is 46. A typed sum is worked out before the
  // field reads it, keeping its unit (12%+4 is 16%, 45°+15 is 60°, 10vh+5 is 15vh). What isn't a sum is handed over as
  // typed: a plain number (-4 is just -4) or a word (Auto, Mixed, a hex). A sum that can't be worked out is null, and
  // the field keeps its value, as Figma's does: one cut short (16-), units that differ (1s+200ms), or a unit only after
  // the first number (24+10% in a px field would turn its 24px into 24%).
  const MATH_TOKEN = /\s*(?:(\d*\.?\d+)\s*([a-z%°]+)?|([-+*/()]))\s*/iy;
  function mathValue(text) {
    const s = String(text).trim();
    const tokens = [];
    const units = [];
    for (let i = 0; i < s.length;) {
      MATH_TOKEN.lastIndex = i;
      const m = MATH_TOKEN.exec(s);
      if (!m) return text;
      i = MATH_TOKEN.lastIndex;
      if (m[1] == null) tokens.push(m[3]);
      else {
        tokens.push(parseFloat(m[1]));
        units.push((m[2] || "").toLowerCase());
      }
    }
    // A sum has an operator after a number or a closing bracket.
    if (!tokens.some((t, i) => i > 0 && /^[-+*/]$/.test(t) && (typeof tokens[i - 1] === "number" || tokens[i - 1] === ")"))) return text;
    const unit = units[0] || "";
    if (units.some((u) => u && u !== unit)) return null;
    let at = 0;
    const factor = () => {
      const t = tokens[at++];
      if (t === "-") return -factor();
      if (t === "+") return factor();
      if (t === "(") {
        const v = expr();
        return tokens[at++] === ")" ? v : NaN;
      }
      return typeof t === "number" ? t : NaN;
    };
    const term = () => {
      let v = factor();
      while (tokens[at] === "*" || tokens[at] === "/") {
        const op = tokens[at++];
        const r = factor();
        v = op === "*" ? v * r : v / r;
      }
      return v;
    };
    function expr() {
      let v = term();
      while (tokens[at] === "+" || tokens[at] === "-") {
        const op = tokens[at++];
        const r = term();
        v = op === "+" ? v + r : v - r;
      }
      return v;
    }
    const v = expr();
    if (at !== tokens.length || !isFinite(v)) return null;
    // Rounded, as 0.1+0.2 is 0.30000000000000004.
    return String(Math.round(v * 10000) / 10000) + unit;
  }

  // A Figma field: a click selects all of it, Enter or blur commits, Escape puts the old value back. A sum typed in
  // is worked out first (mathValue); one that can't be commits nothing, and the field shows its value again.
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
      const v = input.value !== shown ? mathValue(input.value) : null;
      if (v != null) commit(v);
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
      // Each channel as typed, a sum worked out (mathValue).
      const v = inputs.map((i) => parseFloat(mathValue(i.value)));
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
      // Handled: the selection's own Escape leaves this one alone, and so does the page's (stopPropagation).
      e.preventDefault();
      e.stopPropagation();
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
  // Set by the inspector: the right-click Select layer menu, in the panel's menu, each layer named as its kind line.
  let openLayerMenu = () => {};
  // Set by the panel: closes its menu (and lets go of what it previews), for when the UI hides.
  let closeMenu = () => {};
  // The Scale tool (K) while it's on: what it scales and the snapshot it scales from (see beginScale), else null.
  let scaleMode = null;
  // Set by the inspector: leaves Scale, the layer still selected, and puts Appearance and the rest back.
  let endScale = () => {};

  // Left toolbar, after pen.dev's: Copy the changes for the bake skill, Save them so a reload keeps
  // them, then Reset, which goes back to the code (her call, 2026-10-14: it was in the panel's top row, where
  // Undo and Redo stay). They're actions, not tools, so none stays pressed; Reset greys out with nothing to
  // reset. (Hide UI sits over the panel's top row.)
  const REPO_URL = "https://github.com/monica-makes/finetune";
  function makeToolbar(hotkey, helpOn) {
    const bar = el("div", "ft-toolbar");
    // The left rail: each tool's icon in its box; its name is its tooltip.
    const actions = [
      ["copy", "Copy", "Copy changes and prompt", copyChanges, KEYS.shiftMod + "E"],
      ["floppyDisk", "Save", "Save changes in this browser", saveNow, KEYS.altMod + "S"],
      ["refresh", "Reset", "Reset to the code's last presets", resetEdits, null],
    ].map(([icon, label, name, onClick, keys]) => {
      const b = button("ft-tool", null, onClick);
      const box = el("span", "ft-tool-icon");
      box.innerHTML = ICON[icon];
      b.appendChild(box);
      b.setAttribute("aria-label", name);
      b.setAttribute("data-ft-tip", name);
      if (keys) b.setAttribute("data-ft-tip-key", keys);
      b.setAttribute("data-ft-tip-side", "right");
      withTip(b);
      return b;
    });
    // finetune's mark first, as Figma's rail starts with its logo: it opens the repo.
    const logo = el("a", "ft-tool ft-logo");
    logo.href = REPO_URL;
    logo.target = "_blank";
    logo.rel = "noreferrer";
    const logoBox = el("span", "ft-tool-icon");
    logoBox.innerHTML = ICON.logo;
    logo.appendChild(logoBox);
    logo.setAttribute("aria-label", "View the repo");
    logo.setAttribute("data-ft-tip", "View the repo");
    logo.setAttribute("data-ft-tip-side", "right");
    withTip(logo);
    bar.append(logo, el("span", "ft-rail-line"), ...actions);
    resetBtn = actions[2];
    historyChanged();
    document.body.appendChild(bar);
    uiBox = el("div", "ft-ui");
    uiButton = iconButton(ICON.sidebarSimple, "Hide UI", toggleUi);
    uiButton.setAttribute("data-ft-tip-key", KEYS.mod + "\\");
    uiBox.appendChild(uiButton);
    document.body.appendChild(uiBox);
    if (helpOn) makeHelp(hotkey);
    return bar;
  }

  // The first time finetune shows in this browser, a note in the middle of the window says the hotkey turns the
  // overlays off and on (her ask, 2026-10-14; the key in the tooltips' shortcut colour); kept in localStorage so it
  // shows once.
  // A page can hold it back (hotkeyNote: false) and show it when it's ready with finetune.hotkeyNote(), say once its
  // own welcome has gone; it still shows once per browser.
  const HOTKEY_NOTE_KEY = "finetune:tip:hotkey";
  let noteHotkey = "d";
  function hotkeyNote(hotkey) {
    try {
      if (localStorage.getItem(HOTKEY_NOTE_KEY) === "shown") return;
      localStorage.setItem(HOTKEY_NOTE_KEY, "shown");
    } catch (e) { return; }
    const words = el("span");
    words.append("Press ", el("span", "ft-toast-key", hotkey.toUpperCase()), " to toggle overlays off and on");
    toast(words, null, 4000, true);
  }

  // Help and resources, as Figma's ? button: a menu of Keyboard shortcuts (a sheet of the ways to show and hide
  // finetune) and the User guide (docs/GUIDE.md on GitHub). A page with its own help turns it off with help: false.
  function makeHelp(hotkey) {
    const menu = el("div", "ft-menu ft-resources-menu");
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    const setMenu = (on) => {
      menu.hidden = !on;
      if (on) hideTip();
    };
    helpBox = button("ft-resources", null, () => setMenu(menu.hidden));
    helpBox.innerHTML = ICON.help;
    helpBox.setAttribute("aria-label", "Help and resources");
    helpBox.setAttribute("data-ft-tip", "Help and resources");
    helpBox.setAttribute("data-ft-tip-side", "top");
    withTip(helpBox);
    const sheet = el("div", "ft-shortcuts");
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-label", "Keyboard shortcuts");
    sheet.hidden = true;
    const item = (label, run) => {
      const b = button("ft-menu-item", label, () => {
        setMenu(false);
        run();
      });
      b.setAttribute("role", "menuitem");
      menu.appendChild(b);
    };
    item("Keyboard shortcuts", () => { sheet.hidden = false; });
    item("User guide", () => window.open(REPO_URL + "/blob/main/docs/GUIDE.md", "_blank", "noopener"));
    // The sheet's one tab, View: every way to show and hide finetune, with this computer's keys.
    const tabs = el("div", "ft-shortcuts-tabs");
    tabs.appendChild(el("div", "ft-shortcuts-tab", "View"));
    const x = button("ft-shortcuts-x", null, () => { sheet.hidden = true; });
    x.innerHTML = ICON.x;
    x.setAttribute("aria-label", "Close");
    tabs.appendChild(x);
    const list = el("div", "ft-shortcuts-list");
    const mod = MAC ? "⌘" : "Ctrl";
    const bare = (k) => (e) => !e.metaKey && !e.ctrlKey && !e.altKey && String(e.key).toLowerCase() === k;
    const rows = [
      // finetune's own keys first, then Figma's
      ["Show/Hide UI", [hotkey.toUpperCase()], bare(hotkey)],
      ["Hide panels, keep editing", ["E"], bare("e")],
      ["See through panels", ["T"], bare("t")],
      ["Figma's shortcut to show/hide UI", [mod, "\\"], (e) => (e.metaKey || e.ctrlKey) && !e.shiftKey && e.code === "Backslash"],
      ["Minimize UI", [MAC ? "⇧" : "Shift", mod, "\\"], (e) => (e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "Backslash"],
    ].map(([name, caps, is]) => {
      const row = el("div", "ft-shortcuts-row");
      row.appendChild(el("div", "ft-shortcuts-name", name));
      const keys = el("div", "ft-shortcuts-caps");
      caps.forEach((c) => keys.appendChild(el("span", "ft-shortcuts-cap", c)));
      row.appendChild(keys);
      list.appendChild(row);
      return { row, is };
    });
    sheet.append(tabs, list);
    [helpBox, menu, sheet].forEach((n) => n.setAttribute("data-finetune-ui", ""));
    document.body.append(helpBox, menu, sheet);
    closeHelp = () => {
      menu.hidden = true;
      sheet.hidden = true;
    };
    window.addEventListener("pointerdown", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !helpBox.contains(e.target)) setMenu(false);
    }, true);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && (!menu.hidden || !sheet.hidden)) closeHelp();
      if (!typing(e.target)) rows.forEach((r) => { if (r.is(e)) r.row.classList.add("is-used"); });
    }, true);
  }

  // Hide UI, as Figma's Minimize UI: the panel, the toolbar, the grid and the selection go at once, leaving
  // only this button, in a small box where it sat, to bring them back. The hotkey (D), ⌘\ and ⇧⌘\ (Figma's
  // Show/Hide UI and Minimize UI; Ctrl on Windows) do the same. From fully hidden (open: false,
  // finetune.toggle(false)) it shows everything.
  let minimized = false;
  let uiButton = null;
  let uiBox = null;
  // Help and resources: its button, and what closes its menu and sheet.
  let helpBox = null;
  let closeHelp = () => {};
  // The toolbar's Reset; historyChanged greys it out.
  let resetBtn = null;
  function drawUiButton() {
    if (!uiButton) return;
    const name = minimized ? "Show UI" : "Hide UI";
    uiButton.setAttribute("data-ft-tip", name);
    uiButton.setAttribute("aria-label", name);
    uiBox.toggleAttribute("data-min", minimized);
    uiBox.hidden = inspector.hidden && !minimized;
    if (helpBox) {
      helpBox.hidden = inspector.hidden || minimized;
      if (helpBox.hidden) closeHelp();
    }
  }
  function toggleUi() {
    if (!inspector) return;
    if (inspector.hidden && !minimized) return showPanel(true);
    // With the panels hidden for editing (E), the hotkey and ⌘\ bring them back.
    if (bare) return setBare(false);
    minimized = !minimized;
    inspector.hidden = toolbar.hidden = minimized;
    // The panels come back undimmed (T), so Show UI and the panel can always be clicked.
    if (minimized) document.documentElement.classList.remove("ft-dim");
    selection.sync();
    hideTip();
    drawUiButton();
    refreshPanels();
  }
  // Every tuner's controls panel follows the inspector, whichever way it was shown or hidden.
  function refreshPanels() {
    Object.keys(live).forEach((k) => live[k].refresh && live[k].refresh());
  }
  // The Hide UI hotkey, bound once (by the first finetune() call, after the shortcuts that may claim its key)
  // for every call: two calls sharing a key would otherwise toggle twice and land back where they started.
  let hideKeyBound = false;
  function bindHideKey() {
    if (hideKeyBound) return;
    hideKeyBound = true;
    window.addEventListener("keydown", (e) => {
      // A key one of finetune's shortcuts already used (⇧A on a layer, say, with a Hide UI key of `a`) stays theirs.
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.repeat || typing(e.target)) return;
      const k = String(e.key).toLowerCase();
      if (Object.keys(live).some((id) => live[id].key === k)) toggleUi();
    });
  }
  // T dims the panels and lets clicks through them (PANEL LOOK, html.ft-dim); T again brings them back. Only while the
  // panel shows (hidden or minimized, they come back undimmed), and a Hide UI key of `t` keeps T for itself.
  window.addEventListener("keydown", (e) => {
    if (!inspector || inspector.hidden) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat || typing(e.target)) return;
    if (String(e.key).toLowerCase() !== "t" || Object.keys(live).some((id) => live[id].key === "t")) return;
    document.documentElement.classList.toggle("ft-dim");
  });
  // E hides the panels and editing goes on (her ask, 2026-10-19: they sat over what she was working on): the panel,
  // the toolbar, the Design / Motion bar and the tuners' panels go, while select, drag, resize, retype, every shortcut
  // and the grid stay (PANEL LOOK, html.ft-bare). E again, the hotkey (D) or ⌘\ brings them back. From hidden or
  // minimized, E shows the inspector with its panels already hidden. A Hide UI key of `e` keeps E for itself.
  let bare = false;
  function setBare(on) {
    bare = on;
    document.documentElement.classList.toggle("ft-bare", on);
    if (on) {
      document.documentElement.classList.remove("ft-dim");
      const a = document.activeElement;
      if (a && a.closest && a.closest(".ft-inspector, .ft-toolbar, .ft-ui, .ft-panel, .ft-pop")) a.blur();
    }
    hideTip();
  }
  window.addEventListener("keydown", (e) => {
    if (!inspector || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat || typing(e.target)) return;
    if (String(e.key).toLowerCase() !== "e" || Object.keys(live).some((id) => live[id].key === "e")) return;
    if (inspector.hidden) showPanel(true);
    setBare(!bare);
  });
  window.addEventListener("keydown", (e) => {
    if (!(e.metaKey || e.ctrlKey) || e.altKey || e.code !== "Backslash" || typing(e.target)) return;
    e.preventDefault();
    toggleUi();
  });

  // finetune's theme, Figma UI3's light or dark (html[data-ft-theme], PANEL LOOK): the system's, until ⌥⌘T flips it.
  // The flip is kept in this browser; one that lands back on the system's theme goes back to following the system.
  const THEME_KEY = "finetune:theme";
  const systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const systemTheme = () => (systemDark && systemDark.matches ? "dark" : "light");
  function theme() {
    let t = null;
    try { t = localStorage.getItem(THEME_KEY); } catch (e) {}
    return t === "dark" || t === "light" ? t : systemTheme();
  }
  const showTheme = () => document.documentElement.setAttribute("data-ft-theme", theme());
  function setTheme(next) {
    try {
      if (next === systemTheme()) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    showTheme();
  }
  showTheme();
  if (systemDark) systemDark.addEventListener("change", showTheme);
  window.addEventListener("keydown", (e) => {
    if (!(MAC ? e.metaKey : e.ctrlKey) || !e.altKey || e.shiftKey || e.code !== "KeyT" || typing(e.target)) return;
    e.preventDefault();
    setTheme(theme() === "dark" ? "light" : "dark");
  });

  // Text means an element with words of its own, not just inside its children.
  const hasText = (e) => Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
  // [data-finetune-ui] marks a page's own controls (its nav, its buttons): never selected, and they keep
  // working while the inspector is open. A tuner's controls panel (.ft-panel) is finetune's own UI too.
  const isUi = (t) => !t || !t.closest || !!t.closest(".ft-inspector, .ft-toolbar, .ft-ui, .ft-tip, .ft-toast, .ft-sel-box, .ft-hover-box, .ft-marquee, .ft-panel, [data-finetune-ui]");
  // A layer's own layers, as she sees them: a container she already ungrouped draws no box, so its layers count in
  // its place (the panel's "N items", and what a later ungroup measures and puts back).
  const layersOf = (t) => Array.from(t.children).filter((c) => !isUi(c))
    .flatMap((c) => (c.hasAttribute("data-ft-ungrouped") ? layersOf(c) : [c]));
  // The CSS properties a layer takes from the one holding it unless it sets its own: what an ungrouped wrapper still
  // gives its layers live, and what the bake has to carry over when it takes the wrapper out of the code.
  const INHERITED = ["color", "font-family", "font-size", "font-weight", "font-style", "font-stretch", "font-variant",
    "font-feature-settings", "font-variation-settings", "line-height", "letter-spacing", "word-spacing", "text-align",
    "text-indent", "text-transform", "text-shadow", "white-space", "word-break", "overflow-wrap", "hyphens",
    "visibility", "cursor", "direction", "writing-mode", "list-style-type", "-webkit-font-smoothing"];

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
  // frame past React's own call. "" when the build doesn't say. React's frames are told apart by their function's
  // name, not by "jsx" anywhere in the line, since a page file can be Hero.jsx; anything in node_modules is a
  // library's or React's own, so it's passed over too.
  const REACT_FRAME = /^\s*(?:at\s+)?(?:[\w$.]*\.)?(?:jsxDEV|jsxs?|createElement|fakeJSXCallSite)\b/;
  function writtenAt(f) {
    if (f._debugSource && f._debugSource.fileName) return f._debugSource.fileName;
    const stack = f._debugStack && f._debugStack.stack;
    if (!stack) return "";
    return stack.split("\n").slice(1).find((l) => l.trim() && !REACT_FRAME.test(l) && !/node_modules/.test(l)) || "";
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
  // These three are read again whenever the instance cache is (see forgetInstances): React can re-render the same
  // node with another variant (a tab bar's variant={active ? "default" : "outline"}), and a stale one would keep the
  // old variant's edit on it.
  let components = new WeakMap();
  // The fiber of the component that names an element, so Copy can say where that instance is used in the code.
  let componentFibers = new WeakMap();
  // Every page-code component that renders the element as its one root, inner to outer (FeatureCard returns a Card,
  // so its root is [Card, FeatureCard]): an edit to Card is written in card.tsx, which draws FeatureCard's too, so
  // the page has to show it there as well. The outermost is the element's name. Each keeps the string props cva reads
  // (variant, size, intent, tone), as given at that instance.
  let componentChains = new WeakMap();
  const CVA_PROPS = ["variant", "size", "intent", "tone"];
  function componentOf(e) {
    if (!e || e.nodeType !== 1) return "";
    if (components.has(e)) return components.get(e);
    let name = "";
    const chain = [];
    // The node can hold the older of React's two copies after an update; the newer one has the props it shows now.
    const fiber = hostFiber(e);
    let found = false;
    for (let p = fiber && fiber.return; p && !HOST_TAGS.includes(p.tag); p = p.return) {
      if (!COMPONENT_TAGS.includes(p.tag)) continue;
      if (!inPageCode(writtenAt(p))) {
        if (found) break;
        continue;
      }
      found = true;
      const n = typeName(p.elementType) || typeName(p.type);
      if (n && oneRoot(p)) {
        name = n;
        componentFibers.set(e, p);
        const props = p.memoizedProps && typeof p.memoizedProps === "object" ? p.memoizedProps : {};
        const link = { name: n, fiber: p };
        CVA_PROPS.forEach((k) => { if (typeof props[k] === "string") link[k] = props[k]; });
        chain.push(link);
      }
    }
    if (!name && e.localName.includes("-") && window.customElements && customElements.get(e.localName)) {
      name = e.localName;
      chain.push({ name });
    }
    components.set(e, name);
    componentChains.set(e, chain);
    return name;
  }
  const chainOf = (e) => (componentOf(e) ? componentChains.get(e) : []);

  // Where the code writes an element, as a repo-relative "file:line[:col]", so a bake opens the right file instead
  // of searching for the selector. "here" is where this element is written in the page; for a component's root,
  // where that instance is used, read off the component's own fiber (the tag a dev tagger gave it, or its record).
  // "def" is where the component writes the element it returns, in its own file. First match wins, most exact
  // record first. A production build records none, so this gives "" and Copy's lines stay as they were.
  const SOURCE_FILE = /\.(?:jsx|tsx|js|ts|vue|svelte)$/;
  function sourcePath(loc) {
    const m = String(loc || "").trim().match(/^(.*?)(?::(\d+))?(?::(\d+))?$/);
    let p = m[1].replace(/\\/g, "/").replace(/[?#].*$/, "");
    const at = m[2] ? ":" + m[2] + (m[3] ? ":" + m[3] : "") : "";
    if (/node_modules|_next\/static|<anonymous>/.test(p)) return "";
    p = p.replace(/^webpack-internal:\/\/\/(?:\([^)]*\)\/)?/, "");
    const served = /^https?:\/\//i.test(p) && !/^https?:\/\/[^/]*\/@fs\//i.test(p);
    p = p.replace(/^[a-z][\w+.-]*:\/\/[^/]*/i, "").replace(/^\/@fs(?=\/)/, "");
    try {
      p = decodeURIComponent(p);
    } catch (e) {
      // A stray % stays as it is.
    }
    if (served) p = p.replace(/^\/+/, "");
    else if (/^\/|^[A-Za-z]:\//.test(p)) {
      // A path on disk: the project's own part starts at its source folder. Without one there's no telling where
      // the project starts, so no path is better than a wrong one.
      const i = p.indexOf("/src/");
      const j = i >= 0 ? i : p.search(/\/(?:app|pages|components)\//);
      if (j < 0) return "";
      p = p.slice(j + 1);
    } else p = p.replace(/^\.\//, "");
    return SOURCE_FILE.test(p) ? p + at : "";
  }
  // A stack frame's file:line:col, in Chrome's form ("at Hero (url:5:5)", "at url:5:5") or Firefox and Safari's
  // ("Hero@url:5:5"). The URL itself can hold brackets (Next's webpack-internal:///(app-pages-browser)/, a route
  // group's (marketing)/ folder), so Chrome's is split at the first " (" after the name, never the last "(".
  function frameLoc(line) {
    const l = String(line || "").trim();
    if (!l) return "";
    if (/^at\s/.test(l)) {
      const m = l.match(/^at\s+[^(]*?\s\((.*)\)$/);
      return m ? m[1] : l.replace(/^at\s+/, "");
    }
    return l.slice(l.indexOf("@") + 1);
  }
  // React 18's recorded place is the file's own line and column. React 19's comes from a creation stack, and the
  // browser doesn't source-map a stack: its line and column are the dev server's compiled module's, not the file's,
  // so only the file is given, and the bake finds the element in it by its selector.
  function fiberSource(f) {
    if (!f) return "";
    const d = f._debugSource;
    if (d && d.fileName) return sourcePath(d.fileName + (d.lineNumber ? ":" + d.lineNumber + (d.columnNumber ? ":" + d.columnNumber : "") : ""));
    return sourcePath(frameLoc(writtenAt(f))).replace(/(?::\d+){1,2}$/, "");
  }
  let sourceCache = new WeakMap();
  function sourceOf(e, which) {
    if (!e || e.nodeType !== 1) return "";
    let c = sourceCache.get(e);
    if (!c) sourceCache.set(e, (c = {}));
    if (!(which in c)) c[which] = findSource(e, which);
    return c[which];
  }
  // A dev tagger's place, read off an element's attributes or a fiber's props: Lovable's data-lov-id (or its older
  // data-component-path and -line), TanStack's data-tsd-source.
  function tagSource(get) {
    const path = get("data-component-path");
    const line = get("data-component-line");
    for (const t of [get("data-lov-id"), path ? path + (line ? ":" + line : "") : "", get("data-tsd-source")]) {
      const s = typeof t === "string" && sourcePath(t);
      if (s) return s;
    }
    return "";
  }
  const propTag = (f) => (f && f.memoizedProps && typeof f.memoizedProps === "object" ? tagSource((k) => f.memoizedProps[k]) : "");
  // Where a component's fiber writes the element it returns, in its own file: the element (a memo's is one fiber
  // further down). A tag there that is the component's own, passed on by a spread, names the place of use, not this
  // file. Copy reads it for any component in an element's chain, so Card's line names card.tsx even on a FeatureCard.
  function componentDef(comp) {
    const c = comp.tag === 14 ? comp.child && comp.child.child : comp.child;
    if (!c) return "";
    const tag = propTag(c);
    return fiberSource(c) || (tag !== propTag(comp) ? tag : "");
  }
  function findSource(e, which) {
    // A component's root carries the tag of whatever wrote it last: the component's own file when it doesn't pass
    // its props on (FeatureCard's <Card>), so its fiber answers instead, on a tagged build and an untagged one alike.
    const comp = componentOf(e) ? componentFibers.get(e) : null;
    if (comp) return which === "here" ? propTag(comp) || fiberSource(comp) : componentDef(comp);
    if (which === "def") return fiberSource(fiberOf(e));
    const tag = tagSource((k) => e.getAttribute(k));
    if (tag) return tag;
    const js = e[Symbol.for("__jsxSource__")];
    const s = js && js.fileName && sourcePath(js.fileName + (js.lineNumber ? ":" + js.lineNumber + (js.columnNumber != null ? ":" + js.columnNumber : "") : ""));
    return s || fiberSource(fiberOf(e));
  }

  // React keeps its own hold on an element's words unless the code gives them as one string (then React writes the
  // element's text itself, whatever nodes are there). Where it holds them (words beside an {expression}, a list of
  // one), a node finetune swaps out is one React later inserts next to, and the page goes blank.
  const reactProps = (e) => {
    const k = Object.keys(e).find((key) => key.slice(0, 13) === "__reactProps$");
    return k ? e[k] : null;
  };
  const childrenOf = (e) => (reactProps(e) || fiberOf(e).memoizedProps || {});
  function reactHeld(e) {
    if (!e || e.nodeType !== 1 || !fiberOf(e)) return false;
    const p = childrenOf(e);
    if (p.dangerouslySetInnerHTML) return false;
    return typeof p.children !== "string" && typeof p.children !== "number";
  }
  // Words React holds as one text node (the code gives a list of one string): they can be retyped, as long as that
  // very node stays in place.
  function oneHeldText(e) {
    if (!reactHeld(e)) return null;
    const items = [childrenOf(e).children].flat(Infinity).filter((c) => c != null && typeof c !== "boolean");
    const n = e.childNodes;
    return items.length === 1 && /^(string|number)$/.test(typeof items[0]) && n.length === 1 && n[0].nodeType === 3 ? n[0] : null;
  }
  // Words the code builds from several parts ("Plan {name} pricing"): no one place in the code holds them as typed.
  const codeBuiltWords = (e) => reactHeld(e) && !oneHeldText(e);
  // The fiber React drew the element with last. The node keeps the one it was made with, which after an update can be
  // the older of React's two copies; the newer one's props are the ones on the node.
  function hostFiber(e) {
    const f = fiberOf(e);
    const p = f && reactProps(e);
    return f && p && f.memoizedProps !== p && f.alternate && f.alternate.memoizedProps === p ? f.alternate : f;
  }
  // Where the code writes a fiber's element, line and column included, so the items of one .map() read as one place.
  const writtenPlace = (f) => {
    const d = f._debugSource;
    return (d && d.fileName ? d.fileName + ":" + d.lineNumber + ":" + d.columnNumber : frameLoc(writtenAt(f))) + "|" + propTag(f);
  };
  // A list item's React key ("Team" in a .map() of plans): it says which item an edit was made on after the list
  // changes, where a selector's position can't. Only a list's keys count: siblings of the same component written at
  // the same place in the code. The walk stays inside what the selector reaches (its first step's parent), so a list
  // far up the page (a router's routes) isn't taken for this one's.
  function listItem(t, sel) {
    let f = t && t.nodeType === 1 ? hostFiber(t) : null;
    if (!f) return null;
    let top = t;
    for (let i = (sel || selectorFor(t)).split(" > ").length; i > 1 && top.parentElement; i--) top = top.parentElement;
    const scope = top.parentElement || top;
    for (; f; f = f.return) {
      const n = f.stateNode;
      if (HOST_TAGS.includes(f.tag) && n && n.nodeType === 1 && n !== scope && n.contains(scope)) return null;
      if (f.key == null || !f.return) continue;
      const kin = [];
      for (let s = f.return.child; s; s = s.sibling) if (s.key != null && s.elementType === f.elementType && writtenPlace(s) === writtenPlace(f)) kin.push(s);
      // Keys are unique in a list, so the item is found by its key (React's return pointer can lead to its older copy).
      if (kin.length > 1) return { key: String(f.key), n: kin.findIndex((s) => s.key === f.key) + 1, of: kin.length };
    }
    return null;
  }
  // A component's instances on the page, found once per selection (the selection clears this).
  const instanceCache = new Map();
  function forgetInstances() {
    instanceCache.clear();
    components = new WeakMap();
    componentFibers = new WeakMap();
    componentChains = new WeakMap();
  }
  // Its two other entries: every component root on the page, and, by name, the variants its instances pass.
  const ALL_ROOTS = {};
  const VARIANTED = {};
  function rootsOnPage() {
    if (!instanceCache.has(ALL_ROOTS)) instanceCache.set(ALL_ROOTS, Array.from(document.querySelectorAll("*")).filter((e) => !isUi(e) && componentOf(e)));
    return instanceCache.get(ALL_ROOTS);
  }
  // A component edit's key: its name, and when any instance of it on the page passes a string `variant` (a shadcn
  // Button's outline, ghost, default), the variant too. cva writes each variant's look in its own entry, so an edit
  // to the outline Button is the outline entry's and the page shows it on those only.
  // size (and intent, tone) are printed, not keyed: cva's size entries are shared by every variant, so keying by
  // them would show the edit on fewer buttons than the bake changes. A key saved as a bare name reaches every variant.
  function variantedNames() {
    if (!instanceCache.has(VARIANTED)) {
      const m = new Map();
      rootsOnPage().forEach((e) => chainOf(e).forEach((c) => {
        if (c.variant != null) (m.get(c.name) || m.set(c.name, new Set()).get(c.name)).add(c.variant);
      }));
      instanceCache.set(VARIANTED, m);
    }
    return instanceCache.get(VARIANTED);
  }
  // An instance that passes no variant draws the cva's defaultVariants entry, whose name the page doesn't hold. It reads
  // as "default" only where another instance passes "default" by name (shadcn's, so the two stay one key, as they're
  // one entry); else as its own "(none)", never a name the cva may not have (a hand-written cva's default "primary").
  const NO_VARIANT = "(none)";
  const variantOf = (link) => (link.variant != null ? link.variant
    : (variantedNames().get(link.name) || new Set()).has("default") ? "default" : NO_VARIANT);
  const linkKey = (link) => (variantedNames().has(link.name) ? link.name + " variant=" + variantOf(link) : link.name);
  function parseKey(key) {
    const m = String(key).match(/^(\S+) variant=(.*)$/);
    return m ? { name: m[1], variant: m[2] } : { name: String(key), variant: null };
  }
  // The key an edit to this element's component goes under: its outermost component's (the one it's named by).
  function componentKey(e) {
    const chain = chainOf(e);
    return chain.length ? linkKey(chain[chain.length - 1]) : "";
  }
  // How far out in an element's chain a key's component sits (0 its innermost), -1 when the key doesn't reach it. One
  // with a variant ranks above a bare name at the same place, as the more exact of the two.
  function rankOf(e, key) {
    const k = parseKey(key);
    const chain = chainOf(e);
    for (let i = 0; i < chain.length; i++) {
      if (chain[i].name === k.name && (k.variant == null || variantOf(chain[i]) === k.variant)) return i * 2 + (k.variant == null ? 0 : 1);
    }
    return -1;
  }
  // Every element a key's edit reaches: the instances of that component (of that variant), its renders inside other
  // components included.
  function instancesOf(key) {
    if (!instanceCache.has(key)) instanceCache.set(key, rootsOnPage().filter((e) => rankOf(e, key) >= 0));
    return instanceCache.get(key);
  }
  // What a component line in Copy adds after its count: how many of its renders sit inside another component (the
  // bake's edit to its file changes those too: "; 3 inside FeatureCard"), and the sizes (intents, tones) its
  // instances are given, which cva keeps in entries every variant shares ("; sizes lg, default"). "" when neither.
  // A bare key on a component whose instances pass variants (a save from before they were told apart) also lists the
  // variants it reached, since each variant's entry sets its own colours and the bake has to write into those.
  function reachNote(key) {
    const inside = new Map();
    const given = {};
    const k = parseKey(key);
    const printed = CVA_PROPS.filter((p) => p !== "variant" || (k.variant == null && variantedNames().has(k.name)));
    instancesOf(key).forEach((e) => {
      const chain = chainOf(e);
      const i = rankOf(e, key) >> 1;
      const outer = i < chain.length - 1 ? chain[i + 1].name : "";
      if (outer) inside.set(outer, (inside.get(outer) || 0) + 1);
      printed.forEach((p) => (given[p] = given[p] || []).push(p === "variant" ? variantOf(chain[i]) : chain[i][p]));
    });
    const parts = Array.from(inside, ([n, c]) => c + " inside " + n);
    printed.forEach((p) => {
      if (given[p] && given[p].some((v) => v != null)) parts.push(p + "s " + Array.from(new Set(given[p].map((v) => (v != null ? v : "default")))).join(", "));
    });
    return parts.map((s) => "; " + s).join("");
  }
  // Writes the component edits that reach an element onto it again: what the code wrote inline first, then each key's
  // styles from the innermost component out, then the instance's own edits. In the code an outer component's class
  // passed in comes after the inner one's and tailwind-merge keeps the later class, so FeatureCard's rounded-[40px]
  // drops Card's rounded-tl-[4px]. Written in that order, the outer shorthand resets the inner longhands here too;
  // weighed one property at a time, which one won hung on the order the keys were saved in. props are ones an edit
  // just took off (or every component prop, after a re-render), so they go back to the code's own where none reaches.
  function paintComps(t, props, comps, own) {
    const all = comps || edits.components;
    own = own || (edits.elements[keyOf(t)] || { styles: {} }).styles;
    const keys = Object.keys(all).map((k) => [rankOf(t, k), k]).filter((r) => r[0] >= 0).sort((a, b) => a[0] - b[0]).map((r) => r[1]);
    const touched = new Set();
    const touch = (p) => [p].concat(longhandsOf(p)).forEach((q) => touched.add(q));
    (props || []).forEach(touch);
    keys.forEach((k) => Object.keys(all[k].styles).forEach(touch));
    if (!touched.size) return;
    const o = originalOf(t);
    touched.forEach((q) => { if (!(q in o.styles)) o.styles[q] = t.style.getPropertyValue(q); });
    // Shorthands first, so a longhand the code wrote on its own is put back after them; one a code shorthand covers is
    // left as that shorthand set it (a var() in it gives its longhands no value of their own to put back).
    const shorts = Array.from(touched).filter((q) => longhandsOf(q).length);
    shorts.forEach((q) => (o.styles[q] ? t.style.setProperty(q, o.styles[q]) : t.style.removeProperty(q)));
    touched.forEach((q) => {
      if (shorts.includes(q)) return;
      if (o.styles[q]) t.style.setProperty(q, o.styles[q]);
      else if (!shorts.some((s) => o.styles[s] && longhandsOf(s).includes(q))) t.style.removeProperty(q);
    });
    keys.forEach((k) => Object.keys(all[k].styles).forEach((p) => t.style.setProperty(p, all[k].styles[p])));
    // An instance's override holds over every component's look, a shorthand of it over their longhands too.
    Object.keys(own).forEach((p) => { if (touched.has(p) || longhandsOf(p).some((q) => touched.has(q))) t.style.setProperty(p, own[p]); });
    tidyStyle(t);
  }
  // The nearest component a layer sits inside, when that component is on the page more than once; "" otherwise.
  function hostComponent(t) {
    for (let a = t.parentElement; a && a !== document.body; a = a.parentElement) {
      const n = componentOf(a);
      if (n) return instancesOf(n).length > 1 ? n : "";
    }
    return "";
  }
  // Where an edit to a component instance goes, as in Figma: to every instance (the component's own look), unless
  // she overrode this one, or it places this one (a move, a turn, a flip), which is always this one's. Design only.
  const PLACEMENT = ["translate", "rotate", "scale", "transform-box", "transform-origin"];
  function sharedComponent(t, prop) {
    if (document.documentElement.classList.contains("ft-motion") || PLACEMENT.includes(prop)) return "";
    const name = componentKey(t);
    return name && !edits.overrides.includes(selectorFor(t)) ? name : "";
  }

  // Figma's layout guide, columns: bands stretched between margins, or packed to a side (or the middle)
  // at a set width, an offset from that side.
  const GUIDE_ALIGN = [["stretch", "Stretch"], ["left", "Left"], ["center", "Center"], ["right", "Right"]];
  // The usual layout: 8 stretched columns, 200 margin, 20 gutter (her default); Figma's red at 10%.
  const newGuide = () => ({
    type: "columns", visible: true, color: { hex: "FF0000", opacity: 10, visible: true },
    count: 8, align: "stretch", width: 0, offset: 200, gutter: 20,
  });
  // The grid the call declares (`layout`: the site's decided grid, { count, gutter, margin }, or align / offset /
  // width for a packed one), read as a guide's fields; null when the call has none.
  let declaredGrid = null;
  // Set by the panel: takes the declared grid as the page's layout when it has none yet.
  let adoptPageGrid = () => {};
  function readLayout(l) {
    if (!l || !isNum(l.count) || l.count < 1) return null;
    const g = { count: Math.round(l.count), gutter: isNum(l.gutter) ? l.gutter : 0 };
    if (l.align && l.align !== "stretch" && GUIDE_ALIGN.some(([a]) => a === l.align)) {
      Object.assign(g, { align: l.align, offset: isNum(l.offset) ? l.offset : 0, width: isNum(l.width) ? l.width : 0 });
    } else Object.assign(g, { align: "stretch", offset: isNum(l.margin) ? l.margin : isNum(l.offset) ? l.offset : 0 });
    return g;
  }
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

  // The page the edits (and this page's styles) belong to. A single-page app that moves to another page and calls
  // finetune() there switches it (see switchPage), so a Save never lands under the last page's key.
  let editsPath = location.pathname;
  // Her horizontal-layout styles, for every page or just this one. A style library, not a page edit:
  // kept in the browser the moment she saves one, not with Save.
  const STYLES_ALL = "finetune:styles";
  const stylesPage = () => "finetune:styles:" + editsPath;
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
  // The active grid: the layout a page opens on ("Use as active grid"), set for this page or for every page, this
  // page's first. Kept the moment she sets it, as styles are. One on the page's own numbers (fromPage) follows the
  // code's grid. Without one a page opens on its own grid (see takePageGrid).
  const GRID_ALL = "finetune:grid";
  const gridPage = () => "finetune:grid:" + editsPath;
  function activeGrid() {
    for (const key of [gridPage(), GRID_ALL]) {
      try {
        const g = JSON.parse(localStorage.getItem(key));
        if (validGuide(g)) return copyGuides([g])[0];
      } catch (e) {
        // Storage blocked, or nothing kept.
      }
    }
    return null;
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
  const editsKey = () => "finetune:edits:" + editsPath;
  // Reset's Undo (see resetEdits): what it threw away, and what to load once instead of what Save stored.
  const resetKey = () => "finetune:reset-undo:" + editsPath;
  const restoreKey = () => "finetune:restore:" + editsPath;
  let restored = false;
  const blankRecord = () => ({ page: null, elements: {}, guides: [], groups: [], autoLayout: [], keyframes: {}, waapi: {}, newKeyframes: {}, components: {}, overrides: [], duplicates: [] });
  let edits = loadEdits();

  // Anything stored in a shape this file no longer writes is dropped, not trusted.
  function loadEdits() {
    const out = blankRecord();
    let raw = null;
    try {
      // Reset's Undo loads what showed before it, once; otherwise what Save stored.
      let undone = null;
      try {
        undone = sessionStorage.getItem(restoreKey());
        if (undone != null) sessionStorage.removeItem(restoreKey());
      } catch (e) {
        undone = null;
      }
      restored = undone != null;
      raw = JSON.parse(undone != null ? undone : localStorage.getItem(editsKey()));
    } catch (e) {
      return out;
    }
    if (!raw || typeof raw !== "object") return out;
    if (Array.isArray(raw.page) && raw.page.length && raw.page.every((l) =>
      l && /^[0-9A-F]{6}$/.test(l.hex) && isNum(l.opacity) && typeof l.visible === "boolean")) {
      out.page = raw.page.map((l) => ({ hex: l.hex, opacity: l.opacity, visible: l.visible }));
      if (raw.pageView && typeof raw.pageView === "object") {
        const view = readView(raw.pageView, {});
        if ("vw" in view) out.pageView = view;
      }
      const base = raw.pageBase;
      if (base && /^[0-9A-F]{6}$/.test(base.hex) && isNum(base.opacity)) out.pageBase = { hex: base.hex, opacity: base.opacity };
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
    // A group's auto layout, kept only while a group with the same layers is kept too. Saves from before it load as
    // they were.
    if (Array.isArray(raw.autoLayout)) {
      raw.autoLayout.forEach((l) => {
        const ok = validLayout(l, out.groups);
        if (ok && !out.autoLayout.some((k) => sameSet(k.sels, ok.sels))) out.autoLayout.push(ok);
      });
    }
    // Component edits (every instance's), by the component's name, and the instances she overrode, by selector.
    if (raw.components && typeof raw.components === "object") {
      Object.keys(raw.components).forEach((name) => {
        const c = raw.components[name];
        if (!c || typeof c.styles !== "object" || !c.styles) return;
        const styles = {};
        Object.keys(c.styles).forEach((p) => { if (typeof c.styles[p] === "string" && c.styles[p]) styles[p] = c.styles[p]; });
        const comp = readMeta(c, { styles });
        if (Object.keys(styles).length) out.components[name] = comp;
      });
    }
    if (Array.isArray(raw.overrides)) out.overrides = raw.overrides.filter((sel) => typeof sel === "string");
    // Duplicates (⌘D): the original's key and the copy's own minted key, in the order they were made, so a copy
    // made inside another one is remade after the one that holds it.
    if (Array.isArray(raw.duplicates)) {
      raw.duplicates.forEach((d) => {
        if (d && typeof d.of === "string" && / \/\* dup \d+ \*\/$/.test(String(d.key))
          && !out.duplicates.some((x) => x.key === d.key)) out.duplicates.push({ of: d.of, key: d.key });
      });
    }
    if (raw.elements && typeof raw.elements === "object") {
      Object.keys(raw.elements).forEach((sel) => {
        const e = raw.elements[sel];
        if (!e || typeof e.styles !== "object" || !e.styles) return;
        const styles = {};
        Object.keys(e.styles).forEach((p) => { if (typeof e.styles[p] === "string") styles[p] = e.styles[p]; });
        const entry = { styles };
        if (typeof e.html === "string") entry.html = e.html;
        // The page rewrote her words after the edit: they're built in code (see watchWords).
        if (e.htmlComputed === true && entry.html != null) entry.htmlComputed = true;
        if (e.deleted === true) entry.deleted = true;
        if (e.ungrouped === true) entry.ungrouped = true;
        // Made inside a ⌘D copy: its layer exists only in the copy (see resolve).
        if (e.inDup === true) entry.inDup = true;
        // Which element the edit was made on (see fingerprint). A save without one skips the check, as before.
        const at = e.at;
        if (at && typeof at === "object" && typeof at.tag === "string" && /^[\w-]+$/.test(at.tag)
          && ["src", "key", "text"].every((k) => at[k] == null || typeof at[k] === "string")) {
          entry.at = { tag: at.tag };
          ["src", "key", "text"].forEach((k) => { if (typeof at[k] === "string") entry.at[k] = at[k]; });
        }
        // Spacing's share of the translate on a free-flow container (see nudge), so a change of Flow can take back
        // just that share; any other shape is dropped.
        if (e.sim && isNum(e.sim.x) && isNum(e.sim.y)) entry.sim = { x: e.sim.x, y: e.sim.y };
        // The padding and margins auto layout wrote to hold the layers (see applyInferred), so Freeform can take
        // them off after a reload too.
        if (e.inferred && typeof e.inferred === "object") {
          const inferred = {};
          Object.keys(e.inferred).forEach((p) => { if (/^(padding|margin)-/.test(p) && typeof e.inferred[p] === "string") inferred[p] = e.inferred[p]; });
          if (Object.keys(inferred).length) entry.inferred = inferred;
        }
        // A K scale's notes for Copy (its factor on the layer scaled, the animated values it left), and the one
        // attribute it writes (an <svg>'s viewBox).
        if (typeof e.scaled === "string" && /^\d*\.?\d+$/.test(e.scaled)) entry.scaled = e.scaled;
        if (typeof e.scaleSkipped === "string" && e.scaleSkipped) entry.scaleSkipped = e.scaleSkipped;
        if (typeof e.scalePseudo === "string" && e.scalePseudo) entry.scalePseudo = e.scalePseudo;
        if (e.attrs && typeof e.attrs.viewBox === "string") entry.attrs = { viewBox: e.attrs.viewBox };
        // The margin a group's auto layout set in a flex container (spanGaps), so Copy still leaves it out.
        const sg = e.spanGap;
        if (sg && /^margin-(top|left)$/.test(sg.prop) && typeof sg.value === "string") {
          entry.spanGap = { prop: sg.prop, value: sg.value };
          if (typeof sg.was === "string" && sg.was) entry.spanGap.was = sg.was;
        }
        // A resize's notes for Copy (resizeLayer's noteWhy): the value each was written with and why.
        if (e.why && typeof e.why === "object") {
          const why = {};
          Object.keys(e.why).forEach((p) => {
            const w = e.why[p];
            if (w && typeof w.value === "string" && typeof w.note === "string") why[p] = { value: w.value, note: w.note };
          });
          if (Object.keys(why).length) entry.why = why;
        }
        readMeta(e, entry);
        if (e.src && typeof e.src.name === "string" && /^data:image\//.test(e.src.data)) {
          entry.src = { name: e.src.name, data: e.src.data };
        }
        // The columns an Align or Make wide to columns put it on (see noteColumns), for Copy's comment.
        const c = e.cols;
        if (c && typeof c === "object" && ["first", "last", "count"].every((k) => Number.isInteger(c[k]) && c[k] >= 1)
          && ["gutter", "vw", "left", "width"].every((k) => isNum(c[k])) && ["left", "hcenter", "right", "width"].includes(c.how)
          && GUIDE_ALIGN.some(([a]) => a === c.align) && typeof c.source === "string") {
          const cols = {};
          ["first", "last", "count", "how", "gutter", "align", "source", "vw", "left", "width"].forEach((k) => { cols[k] = c[k]; });
          ["margin", "offset", "colWidth"].forEach((k) => { if (isNum(c[k])) cols[k] = c[k]; });
          entry.cols = cols;
        }
        out.elements[sel] = entry;
      });
    }
    return out;
    // The window an edit was made in (see stampView): a width, and the page's theme when it has one; and each
    // property's own, kept apart so Copy can say which of a line's properties were made elsewhere.
    function readView(e, entry) {
      if (isNum(e.vw) && e.vw > 0) entry.vw = e.vw;
      if (typeof e.theme === "string" && /^[\w-]{1,24}$/.test(e.theme)) entry.theme = e.theme;
      if (e.views && typeof e.views === "object") {
        const views = {};
        Object.keys(e.views).forEach((k) => {
          const v = e.views[k] && typeof e.views[k] === "object" ? readView({ vw: e.views[k].vw, theme: e.views[k].theme }, {}) : {};
          if ("vw" in v) views[k] = v;
        });
        if (Object.keys(views).length) entry.views = views;
      }
      return entry;
    }
    // What the panel shows beside the CSS (see META), on a layer or a component.
    function readMeta(e, entry) {
      readView(e, entry);
      if (e.adjust && typeof e.adjust === "object") {
        const adjust = Object.assign({}, NO_ADJUST);
        Object.keys(NO_ADJUST).forEach((k) => { if (isNum(e.adjust[k])) adjust[k] = e.adjust[k]; });
        entry.adjust = adjust;
      }
      const paint = (c) => !!c && /^[0-9A-F]{6}$/.test(c.hex) && isNum(c.opacity) && typeof c.visible === "boolean";
      // A hidden fill's color (it writes transparent), and the colour token it showed (see recordFill).
      if (paint(e.fill) && !e.fill.visible) {
        entry.fill = { hex: e.fill.hex, opacity: e.fill.opacity, visible: false };
        if (typeof e.fill.token === "string" && /^--[\w-]+$/.test(e.fill.token)) entry.fill.token = e.fill.token;
      }
      // A text style she picked from Text styles (see codeTextStyles): its class and the values it wrote, for Copy's
      // note. Kept where those values went, the layer or its component.
      const ts = e.textStyle;
      if (ts && typeof ts.name === "string" && /^[\w-]+$/.test(ts.name) && ts.styles && typeof ts.styles === "object") {
        const given = {};
        Object.keys(ts.styles).forEach((p) => { if (typeof ts.styles[p] === "string") given[p] = ts.styles[p]; });
        entry.textStyle = { name: ts.name, styles: given };
      }
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
      return entry;
    }
  }

  // An action that can be undone says so in a toast with Undo, for 10 seconds.
  const undoToast = (text, run) => toast(text, { label: "Undo", run }, 10000);
  // An edit's toast (⌘G, Delete, ⇧A...): its Undo takes back the step that edit made, so it's committed now, and the
  // toast closes once a newer step lands or an undo moves off it (Undo there would take back something else).
  let stepToast = null;
  function actionToast(text) {
    if (history.timer) commitStep();
    const mark = { now: history.now, depth: history.past.length };
    stepToast = mark;
    undoToast(text, () => {
      // An edit still settling is a newer step: it lands first, and then this one isn't the newest.
      if (history.timer) commitStep();
      if (stepToast === mark && history.now === mark.now && history.past.length === mark.depth) undo();
    });
    mark.seq = toastSeq;
  }
  // Called when the step showing changes: an edit's toast that no longer names the newest step goes.
  function dropStepToast() {
    if (!stepToast || history.now === stepToast.now) return;
    const showing = stepToast.seq === toastSeq;
    stepToast = null;
    if (!showing) return;
    clearTimeout(toastTimer);
    if (toastEl) toastEl.hidden = true;
  }

  // The page's own grid as the panel took it up (see makeInspector), hidden. Left as it came it's the code's
  // default, not an edit: Save leaves it out and Reset has nothing to put back, so a later change to the code's grid
  // shows. A layout on its numbers that she showed or recolored is kept marked fromPage, and its numbers follow the
  // code's grid on the next load.
  let pageDefault = null;
  const GUIDE_NUMS = ["type", "align", "count", "width", "offset", "gutter"];
  const sameNums = (a, b) => !!a && !!b && GUIDE_NUMS.every((k) => a[k] === b[k]);
  const untouchedGrid = (g) => sameNums(g, pageDefault) && !g.visible
    && ["hex", "opacity", "visible"].every((k) => g.color[k] === pageDefault.color[k]);
  // With an active grid set, that's the page's default instead: a layout as she set it (its numbers, colour and eye)
  // isn't an edit either, so Save leaves it out and a change to the active grid later still reaches this page. Read
  // once, as the page opened (takePageGrid) or as she set it here: one set in another tab meanwhile doesn't make
  // this page's layout an edit.
  let openGrid = null;
  const onDefault = (g) => {
    const a = openGrid;
    if (!a) return untouchedGrid(g);
    return (a.fromPage && pageDefault ? sameNums(g, pageDefault) : sameNums(g, a)) && g.visible === a.visible
      && ["hex", "opacity", "visible"].every((k) => g.color[k] === a.color[k]);
  };
  const guideEdited = () => edits.guides.some((g) => !onDefault(g));
  function savable() {
    // At a width with no grid the guide is set aside (followPage), still on the page's last numbers: it saves as one
    // that follows the page, and is left out when untouched, as the page's own grid would be (or as the active grid
    // it was, when that one follows the page or has these numbers).
    const p = !edits.guides.length && parkedGuide();
    if (p) {
      const a = openGrid;
      const def = newGuide().color;
      const untouched = a ? (a.fromPage || sameNums(p, a)) && p.visible === a.visible && ["hex", "opacity", "visible"].every((k) => p.color[k] === a.color[k])
        : !p.visible && ["hex", "opacity", "visible"].every((k) => p.color[k] === def[k]);
      return Object.assign({}, edits, { guides: untouched ? [] : [Object.assign({}, p, { fromPage: true })] });
    }
    const guides = edits.guides.filter((g) => !onDefault(g))
      .map((g) => (sameNums(g, pageDefault) ? Object.assign({}, g, { fromPage: true }) : g));
    return Object.assign({}, edits, { guides });
  }

  // Nothing is saved until she presses Save; a reload before that drops the unsaved edits. Its Undo puts back what
  // the browser had stored before (nothing, or the last save); the edits on the page stay as they are.
  function saveNow() {
    // Words still being typed count, as they do for undo.
    finishTyping();
    let before = null;
    // With no edit at all, Save stores nothing (so Reset stays greyed), and only says so when nothing was stored.
    const keep = savable();
    const blank = blankEdits(keep);
    try {
      before = localStorage.getItem(editsKey());
      if (blank && storedBlank(before)) {
        if (before != null) localStorage.removeItem(editsKey());
        historyChanged();
        return toast("No changes to save");
      }
      if (blank) localStorage.removeItem(editsKey());
      else localStorage.setItem(editsKey(), JSON.stringify(keep));
    } catch (e) {
      // Storage blocked or full (a large swapped-in image): edits still show, they just won't survive a reload.
      return toast("Couldn't save: storage is blocked or full");
    }
    const n = editCount();
    historyChanged();
    undoToast(n ? "Saved " + n + (n === 1 ? " change" : " changes") : "Saved", () => {
      try {
        if (before == null) localStorage.removeItem(editsKey());
        else localStorage.setItem(editsKey(), before);
      } catch (e) {
        // Storage blocked: the save stands.
      }
      historyChanged();
      toast("Save undone");
    });
  }

  function copyChanges() {
    finishTyping();
    const n = editCount();
    if (!n) return toast("No changes to copy");
    // The list asks for the bake itself, so pasting it is all it takes.
    copyText("Bake these finetune changes into the code with the finetune skill:\n" + changesText()).then((ok) => {
      toast(ok ? "Copied " + n + (n === 1 ? " change" : " changes") + ". Paste into Claude Code to bake." : "Couldn't reach the clipboard");
    });
  }

  // Forget every saved edit and reload the page as written. A page with state of its own (its own
  // controls, its own storage) hears "finetune:reset" on window first, so one Reset clears everything.
  // Reset keeps what it throws away (what Save stored, and what showed, saved or not) for the next load in this
  // tab, so the toast after the reload can offer Undo. Undo hands it back: what Save stored goes back in storage,
  // and what showed loads once more (restoreKey()), so unsaved edits come back unsaved.
  function resetEdits() {
    finishTyping();
    window.dispatchEvent(new CustomEvent("finetune:reset"));
    try {
      // Anything to bring back: an edit (a layout grid included) or something Save stored.
      const saved = localStorage.getItem(editsKey());
      const had = !storedBlank(saved) || editCount() > 0 || !blankEdits(savable());
      sessionStorage.setItem(resetKey(), JSON.stringify({ saved, live: JSON.stringify(edits), had }));
    } catch (e) {
      // No session storage: Reset still works, just without Undo.
    }
    try {
      localStorage.removeItem(editsKey());
    } catch (e) {
      // Nothing stored to clear.
    }
    location.reload();
  }
  // Whether Reset has anything to put back: an edit on the page now, or something Save stored.
  function canReset() {
    if (editCount() > 0 || guideEdited()) return true;
    try {
      return !storedBlank(localStorage.getItem(editsKey()));
    } catch (e) {
      return false;
    }
  }
  // An edits record with nothing in it: every list empty, every map empty (or holding only empty maps).
  function blankEdits(v) {
    if (v == null) return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === "object") return Object.keys(v).every((k) => blankEdits(v[k]));
    return false;
  }
  // What Save stored is nothing to keep when it's missing, unreadable or a blank record.
  function storedBlank(s) {
    if (s == null) return true;
    try {
      return blankEdits(JSON.parse(s));
    } catch (e) {
      return true;
    }
  }
  // After the load: Reset's toast, with Undo for 10 seconds; or, after Undo, that the edits are back.
  function afterReset() {
    if (restored) return toast("Your edits are back");
    let stash = null;
    try {
      stash = JSON.parse(sessionStorage.getItem(resetKey()));
      sessionStorage.removeItem(resetKey());
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
          if (stash.saved != null) localStorage.setItem(editsKey(), stash.saved);
          sessionStorage.setItem(restoreKey(), stash.live);
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

  const editCount = () => Object.keys(edits.elements).length + (edits.page ? 1 : 0) + edits.groups.length + edits.autoLayout.length + Object.keys(edits.keyframes).length + Object.keys(edits.waapi).length + Object.keys(edits.components).length;

  // The classes Motion's Play added (page state a reload takes away), per element, so no selector is built on one.
  const playClasses = new WeakMap();

  // A short selector that finds the element again after a reload: as few steps as stay
  // unique, each a tag, its first class, and a position when siblings share both. An id
  // the page uses twice (an SVG exported twice, a component rendered twice) isn't unique.
  function selectorFor(t) {
    if (t.id && document.querySelectorAll("#" + CSS.escape(t.id)).length === 1) return "#" + CSS.escape(t.id);
    const steps = [];
    // A layer React has since taken off the page has no parent at its top: the walk ends there instead of throwing.
    for (let e = t; e && e.parentElement && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      let step = e.tagName.toLowerCase();
      const played = playClasses.get(e);
      const cls = Array.from(e.classList).find((c) => !(played && played.has(c)));
      if (cls) step += "." + CSS.escape(cls);
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
    const sel = keyOf(t);
    return originals[sel] || (originals[sel] = { styles: {} });
  }
  // The key an element's edit is saved under. Keys never change once saved, so a layer an edit was found on again
  // after the page moved it (see resolve) keeps the key it was saved under, not the selector it has now.
  const refound = new WeakMap();
  // The element each saved edit is on now, and why one is on none (see resolve).
  const applied = new Map();
  const lostAt = new Map();
  function keyOf(t) {
    const k = refound.get(t);
    if (k && (edits.elements[k] || dupRecord(k))) return k;
    // Its selector's saved edit can be another element's: the one it was made on, found again elsewhere after the
    // page changed, or one judged gone from the page. An edit to this one would merge into it and Copy would put both
    // on this element, so this one gets a key of its own: its selector and a CSS comment, which still finds it.
    const sel = selectorFor(t);
    for (let n = 1, key = sel; ; key = sel + " /* " + ++n + " */") {
      const was = applied.get(key);
      if (!edits.elements[key] || (was && was.isConnected ? was === t : lostAt.get(key) !== "moved")) return key;
    }
  }
  // A key as a selector to print: without the comment that sets apart a second edit on the same selector, or the
  // marker that names a ⌘D copy (a copy of a copy carries one per step).
  const bareKey = (k) => k.replace(/( \/\* (?:dup )?\d+ \*\/)+$/, "");
  // The duplicates (⌘D) are live clones finetune made, each under a minted key the page can't query: the clone is
  // found through applied, never hunted for by selector or fingerprint, and the bake adds the copy in the code.
  const dupRecord = (key) => edits.duplicates.find((d) => d.key === key);
  // A copy as a live clone of its original, right after it (after the original's other copies, so each keeps its
  // place among the siblings across reloads). Ids come off (no two elements share one, and the page's own scripts
  // keep finding only the original); a nested copy's marker comes off too, since inside this copy it's plain content.
  function buildDup(t) {
    if (!t || !t.parentElement || t === document.body || t === document.documentElement) return null;
    const clone = t.cloneNode(true);
    [clone].concat(Array.from(clone.querySelectorAll("*"))).forEach((n) => {
      if (n.removeAttribute) ["id", "data-ft-dup", "data-ft-editing", "data-ft-still"].forEach((a) => n.removeAttribute(a));
    });
    clone.setAttribute("data-ft-dup", "");
    let anchor = t;
    while (anchor.nextElementSibling && anchor.nextElementSibling.hasAttribute("data-ft-dup")) anchor = anchor.nextElementSibling;
    anchor.after(clone);
    return clone;
  }
  // Remade from its record: the original as it stands now (its edits applied), registered under its saved key.
  function remakeDup(d, orig) {
    const clone = orig && buildDup(orig);
    if (!clone) return null;
    refound.set(clone, d.key);
    applied.set(d.key, clone);
    return clone;
  }
  // A copy deleted is taken out whole (it was never in the code): its record, its node, its own entry, and the
  // entries and copies of layers that exist only inside it.
  function removeDup(key) {
    const t = applied.get(key);
    edits.duplicates = edits.duplicates.filter((d) => {
      if (d.key === key) return false;
      const n = applied.get(d.key);
      return !(t && n && n !== t && t.contains(n));
    });
    Object.keys(edits.elements).forEach((sel) => {
      const n = applied.get(sel);
      if (sel === key || (t && n && n !== t && t.contains(n))) delete edits.elements[sel];
    });
    applied.delete(key);
    if (t) t.remove();
  }

  // An element's inner HTML as the code would hold it: the layers inside it with their own inline styles and
  // image sources put back and finetune's data-ft-* marks off. Their edits are their own lines, so the words
  // never carry them (and a reload or redo doesn't bring back one she has since changed).
  function codeHtml(t) {
    const copy = t.cloneNode(true);
    // A ⌘D copy inside it isn't the code's: it goes (after the loop, so the live list still lines up).
    const dups = Array.from(copy.querySelectorAll("[data-ft-dup]"));
    const live = t.querySelectorAll("*");
    copy.querySelectorAll("*").forEach((c, i) => {
      const o = live[i] && originals[keyOf(live[i])];
      if (o) {
        Object.keys(o.styles).forEach((p) => (o.styles[p] ? c.style.setProperty(p, o.styles[p]) : c.style.removeProperty(p)));
        if (!c.getAttribute("style")) c.removeAttribute("style");
        if ("src" in o) {
          ["src", "srcset"].forEach((a) => (o[a] != null ? c.setAttribute(a, o[a]) : c.removeAttribute(a)));
        }
        if (o.attrs) Object.keys(o.attrs).forEach((a) => (o.attrs[a] != null ? c.setAttribute(a, o.attrs[a]) : c.removeAttribute(a)));
      }
      // A dev build's source tags (Lovable's data-lov-* and data-component-*, TanStack's data-tsd-source) aren't in
      // the code either: the build adds them, so words copied with them would bake them in.
      Array.from(c.attributes).forEach((a) => { if (/^data-(?:ft-|lov-|component-|tsd-source$)/.test(a.name)) c.removeAttribute(a.name); });
    });
    dups.forEach((c) => c.remove());
    return copy.innerHTML;
  }

  // Undo and redo, as in Figma. A step is the whole set of edits once a change settles (a drag, a scrub
  // or a burst of typing is one step); hover previews never count (quiet). Going back hands the step to
  // the inspector, which puts the page and the panel where it had them.
  const history = { past: [], future: [], now: null, timer: 0, quiet: 0 };
  let applyEdits = () => {};
  let switchPage = () => {};
  let historyChanged = () => {};
  let finishTyping = () => {};
  // The layout guide set aside at a width with no grid (followPage). A step taken there still carries it, so an undo
  // back at a width with a grid lands on a step that has it rather than one that removes it.
  let parkedGuide = () => null;
  const snapshot = () => {
    const p = parkedGuide();
    return JSON.stringify(p && !edits.guides.length ? Object.assign({}, edits, { guides: [p] }) : edits);
  };
  // Counts every change, quiet ones too, so a group's auto layout can tell an edit (reflow its layers) from a scroll
  // (leave them be) without comparing the whole set of edits. flowTick is the count its last reflow saw.
  let editTick = 0;
  let flowTick = 0;
  function noteChange() {
    editTick++;
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
      dropStepToast();
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
    // Scale's W, H and factor skip their refresh while quiet, so they're read again now the step has landed.
    if (scaleMode) refreshPanel();
    dropStepToast();
    historyChanged();
  }
  // Right after a Reset (while its toast shows), Undo, ⌘Z included, undoes the Reset: there's nothing before it in
  // this visit's history.
  let undoReset = null;
  const undo = () => (undoReset && !history.past.length ? undoReset() : step(history.past, history.future));
  const redo = () => step(history.future, history.past);

  // The page's own theme when it has a switch for one ("dark", "light", or a data-theme's own name); "" when it has
  // none. Copy names it, since a value seen in one theme may belong to that theme's token only. Read from what
  // themes switch on: a class or data attribute on html or body, an inline color-scheme, else the page's
  // prefers-color-scheme rules, answered by the system's setting. finetune's own data-ft-theme is the panel's.
  function pageTheme() {
    const roots = [document.documentElement, document.body].filter(Boolean);
    for (const r of roots) {
      if (r.classList.contains("dark")) return "dark";
      if (r.classList.contains("light")) return "light";
    }
    for (const r of roots) {
      for (const a of ["data-theme", "data-mode", "data-color-scheme"]) {
        const v = (r.getAttribute(a) || "").trim().toLowerCase();
        if (/dark/.test(v)) return "dark";
        if (/light/.test(v)) return "light";
        if (/^[\w-]{1,24}$/.test(v)) return v;
      }
    }
    for (const r of roots) {
      const v = r.style.colorScheme.trim();
      if (v === "dark" || v === "light") return v;
    }
    const kind = themeSwitch();
    if (kind === "media") return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    // A .dark or [data-theme] rule with nothing set on html or body: the switch is there, and off.
    return kind === "class" ? "light" : "";
  }
  // Whether the page's styles switch theme by the system's setting ("media") or by a class or attribute ("class"),
  // read once per set of stylesheets, since every edit asks.
  let themeScan = { n: -1, kind: "" };
  function themeSwitch() {
    const n = document.styleSheets.length;
    if (themeScan.n === n) return themeScan.kind;
    let kind = "";
    const walk = (rules) => {
      for (const r of rules) {
        if (r.media && /prefers-color-scheme/.test(r.media.mediaText)) return void (kind = "media");
        // .dark\:bg-x is a utility's name, not the switch: the escape after it rules it out.
        if (r.selectorText && /\.dark(?![\w\\-])|\[data-(?:theme|mode|color-scheme)\b/.test(r.selectorText)) kind = "class";
        if (r.cssRules) walk(r.cssRules);
        if (kind === "media") return;
      }
    };
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode && /^finetune-/.test(sheet.ownerNode.id || "")) continue;
      try {
        if (sheet.media && /prefers-color-scheme/.test(sheet.media.mediaText)) kind = "media";
        else walk(sheet.cssRules);
      } catch (e) {
        // Another origin's sheet can't be read.
      }
      if (kind === "media") break;
    }
    themeScan = { n, kind };
    return kind;
  }
  // The window an edit was made in (its width, and the page's theme when it has one), kept on the edit so Copy can
  // say when it was made at another width or theme than the header's: a bake then writes it for that breakpoint or
  // theme only. Each property keeps its own (views), given what the entry held before the change: one set at 1440
  // keeps 1440 when another is changed at 390. The entry's own vw and theme are its last change's, for what has no
  // property (a delete, an ungroup).
  const viewKeys = (entry) => Object.assign({}, entry.styles, entry.html != null ? { text: entry.html } : {});
  function stampView(entry, before) {
    const view = { vw: window.innerWidth };
    const theme = pageTheme();
    if (theme) view.theme = theme;
    if (before) {
      const views = entry.views || {};
      // An edit saved before properties had their own: what it already held keeps the window it was made in.
      const old = isNum(entry.vw) ? Object.assign({ vw: entry.vw }, entry.theme ? { theme: entry.theme } : {}) : null;
      const now = viewKeys(entry);
      Object.keys(now).forEach((k) => {
        if (now[k] !== before[k]) views[k] = view;
        else if (!views[k] && old) views[k] = old;
      });
      Object.keys(views).forEach((k) => { if (!(k in now)) delete views[k]; });
      if (Object.keys(views).length) entry.views = views;
      else delete entry.views;
    }
    entry.vw = view.vw;
    if (theme) entry.theme = theme;
    else delete entry.theme;
  }

  // Which element an edit was made on, kept with it (entry.at), since its selector can come to point at another one: a
  // list item added before it, a section put above it. In a dev build the place the code writes it and its list key
  // say which, and its words (the first 40 characters) tell apart the elements one file writes; with neither, the
  // words alone do.
  const query = (sel) => {
    try {
      const t = document.querySelector(sel);
      return t && !isUi(t) ? t : null;
    } catch (e) {
      return null;
    }
  };
  const firstWords = (s) => String(s || "").replace(/\s+/g, " ").trim().slice(0, 40).trim();
  // The layers she retyped words in, with the code's words, read once per lookup: a lookup reads many elements' words.
  const retyped = () => Object.keys(originals).filter((s) => "html" in originals[s]).map((s) => [query(s), originals[s].html])
    .filter(([n]) => n);
  function codeWords(t, list) {
    // Words she retyped inside it read as the code's, so an edit to words never makes its layer (or one holding it)
    // look like another element.
    const edited = (list || retyped()).filter(([n]) => t.contains(n));
    // A ⌘D copy inside it isn't the code's: its words come off too, so the element's fingerprint holds.
    const hasDup = t.querySelector && t.querySelector("[data-ft-dup]");
    if (!edited.length && !hasDup) return firstWords(t.textContent);
    const all = [t].concat(Array.from(t.querySelectorAll("*")));
    const copy = t.cloneNode(true);
    const twins = [copy].concat(Array.from(copy.querySelectorAll("*")));
    edited.forEach(([n, html]) => { twins[all.indexOf(n)].innerHTML = html; });
    if (hasDup) all.forEach((n, i) => { if (i && n.hasAttribute("data-ft-dup")) twins[i].remove(); });
    return firstWords(copy.textContent);
  }
  function fingerprint(t, sel) {
    const at = { tag: t.localName };
    const src = sourceOf(t, "here");
    const item = listItem(t, sel);
    if (src) at.src = src;
    if (item) at.key = item.key;
    // A list key says which item on its own. Without one the words go too: React 19 names only the file, which every
    // element of that tag in the component shares, and a dev build's line moves whenever a line is added above it.
    if (!item) at.text = codeWords(t);
    return at;
  }
  const fileOf = (s) => String(s || "").replace(/(?::\d+){1,2}$/, "");
  // An element of the same kind from the same place: its tag, its file and its list key. One that differs in any of
  // these is another element. Its line and its words are weaker: a line added above it moves the line, and a count-up,
  // a rotating word or a price toggle changes the words by themselves.
  function sameKind(t, at, sel) {
    if (t.localName !== at.tag) return false;
    if (at.src != null && fileOf(sourceOf(t, "here")) !== fileOf(at.src)) return false;
    return at.key == null || (listItem(t, sel) || {}).key === at.key;
  }
  // And nothing about it moved on: the same line, the same words.
  const sameAt = (t, at, sel, words) => sameKind(t, at, sel) && (at.src == null || sourceOf(t, "here") === at.src)
    && (at.text == null || words(t) === at.text);
  // How close two runs of words are: the words they share, as a share of the longer one's.
  function nearWords(a, b) {
    const set = (s) => new Set(String(s).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    const x = set(a);
    const y = set(b);
    if (!x.size || !y.size) return 0;
    let n = 0;
    x.forEach((w) => { if (y.has(w)) n++; });
    return n / Math.max(x.size, y.size);
  }
  // The element an edit belongs on now: the one it's on, while that's still on the page; else what its selector finds,
  // when nothing about it moved on; else the one element that matches it exactly, or whose words clearly come closest;
  // else what its selector finds, while that's the same kind from the same place (a moved line or changed words say
  // nothing against it, so it isn't left off for them). None: the page changed since the edit, and it's left off
  // rather than put on another element. lostAt says why, for Copy and the load's toast: "moved" when the selector now
  // finds another element, "missing" when it finds none; "changed" when it's on the selector's element, whose words
  // aren't the ones it was made on.
  // within: the layers the page just added (the page watcher's batch). A fresh copy can only be among them, and
  // searching the whole page every frame would cost too much on a page that keeps adding nodes.
  // The element each edit was put on for its place alone (see below). Its words are checked again at each lookup,
  // since a rotating word or a count-up keeps changing them, so Copy notes it exactly while they differ.
  const byPlace = new Map();
  function resolve(sel, entry, within) {
    const e = entry || edits.elements[sel];
    // A ⌘D copy is only ever the clone finetune made (its minted key matches no element, and its fingerprint is its
    // original's, so a hunt would land on the original). An edit made inside a copy is likewise never hunted for
    // elsewhere: its selector counts only while it finds a layer inside a tracked copy.
    if (dupRecord(sel) || (e && e.inDup)) {
      lostAt.delete(sel);
      const was = applied.get(sel);
      if (was && was.isConnected && !isUi(was)) return was;
      if (e && e.inDup) {
        const c = query(sel);
        if (c && edits.duplicates.some((d) => { const n = applied.get(d.key); return n && n.contains(c); })) {
          refound.set(c, sel);
          return c;
        }
      }
      lostAt.set(sel, "missing");
      return null;
    }
    const t = query(sel);
    lostAt.delete(sel);
    if (!e || !e.at) return t;
    const at = e.at;
    // Read only when needed: the page watcher calls this for every edit, every frame the page adds layers.
    let list = null;
    const words = (c) => codeWords(c, list || (list = retyped()));
    const was = applied.get(sel);
    let r = was && was.isConnected && !isUi(was) ? was : t && sameAt(t, at, sel, words) ? t : null;
    if (r && r === byPlace.get(sel) && at.text != null && words(r) !== at.text) lostAt.set(sel, "changed");
    if (!r) {
      const pool = within ? within.flatMap((n) => (n.localName === at.tag ? [n] : []).concat(Array.from(n.getElementsByTagName(at.tag))))
        : Array.from(document.getElementsByTagName(at.tag));
      const kin = Array.from(new Set(pool)).filter((c) => c !== t && !isUi(c) && sameKind(c, at, sel));
      const exact = kin.filter((c) => sameAt(c, at, sel, words));
      if (exact.length === 1) r = exact[0];
      else if (at.text) {
        // Most of its words, more than the selector's own element has, and no tie: the edit's element, its words
        // edited in the code since.
        const own = t && sameKind(t, at, sel) ? nearWords(words(t), at.text) : 0;
        const near = kin.map((c) => [c, nearWords(words(c), at.text)]).sort((a, b) => b[1] - a[1]);
        if (near.length && near[0][1] >= 0.5 && near[0][1] > own && !(near[1] && near[1][1] === near[0][1])) r = near[0][0];
      }
      if (!r && t && sameKind(t, at, sel)) {
        r = t;
        byPlace.set(sel, t);
        if (at.text != null && words(t) !== at.text) lostAt.set(sel, "changed");
      }
    }
    if (r !== byPlace.get(sel)) byPlace.delete(sel);
    if (r) refound.set(r, sel);
    else lostAt.set(sel, t ? "moved" : "missing");
    return r;
  }

  function record(target, change) {
    const sel = keyOf(target);
    const entry = edits.elements[sel] || { styles: {} };
    // Read once, at the entry's first change, while the element is the one she changed.
    if (!entry.at) entry.at = fingerprint(target, sel);
    // Inside a ⌘D copy: its layer exists only in the copy, so it's never hunted for elsewhere (see resolve).
    if (!entry.inDup && target.closest("[data-ft-dup]")) entry.inDup = true;
    const before = viewKeys(entry);
    change(entry);
    stampView(entry, before);
    if (Object.keys(entry.styles).length || entry.html != null || entry.adjust || entry.src || "stroke" in entry || entry.effects || entry.fill || entry.deleted || entry.ungrouped
      || entry.attrs || entry.scaled || entry.scaleSkipped || entry.scalePseudo || dupRecord(sel)) edits.elements[sel] = entry;
    else delete edits.elements[sel];
    // The element it's on, so the page watcher (see watchPage) can tell a fresh copy of it from the one it's on.
    applied.set(sel, target);
    noteChange();
  }

  // A layer with data-ft-still (and what's inside it) runs no transitions, so an edit made while reading or
  // dragging lands at once. Counted, so a read inside a drag doesn't switch it off early.
  const stills = new Map();
  // An inline style emptied by a read or an edit taken back leaves style="" on the element; it goes, so the page's
  // DOM is as the code made it.
  const tidyStyle = (el) => { if (el.style && !el.style.length && el.getAttribute("style") === "") el.removeAttribute("style"); };
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

  // The page's :hover rules, each with its whole selector and the same selector with nothing hovered (:hover can't
  // match). A nested rule's parents are worked in, since Tailwind v4 writes `.hover\:x { &:hover { ... } }` and
  // `&:hover` alone matches any hovered element. Found again only when the stylesheets change: one added, or one
  // rewritten in place (Tailwind's browser build and a dev server's hot reload swap a <style>'s text, which makes
  // it a new sheet), or rules added to one.
  let hoverScan = { sheets: [], sizes: [], rules: [] };
  function hoverRules() {
    // finetune's own sheets aren't the page's, and they change as she edits.
    const sheets = Array.from(document.styleSheets).filter((s) => !(s.ownerNode && /^finetune-/.test(s.ownerNode.id || "")));
    const sizes = sheets.map((s) => { try { return s.cssRules.length; } catch (e) { return -1; } });
    if (sheets.length === hoverScan.sheets.length && sheets.every((s, i) => s === hoverScan.sheets[i] && sizes[i] === hoverScan.sizes[i])) return hoverScan.rules;
    const rules = [];
    const amp = /(^|[^\\])&/g;
    // Only a real :hover is switched off, never the escaped text of one in a class name (`.sm\:hover\:lift:hover`,
    // `.\[\&\:hover\]\:x`): rewriting that too gives a selector that can't parse, and the rule would stay on. Each
    // escape is passed over whole, so `\\:hover` (an escaped backslash) still counts as a real one.
    const noHover = (s) => s.replace(/\\[\s\S]|:hover/g, (m) => (m === ":hover" ? ":not(*)" : m));
    const walk = (list, parent) => {
      for (const r of list) {
        let sel = parent;
        if (r.selectorText != null) {
          const own = r.selectorText;
          sel = !parent ? own : amp.test(own) ? own.replace(amp, "$1:is(" + parent + ")") : ":is(" + parent + ") :is(" + own + ")";
          amp.lastIndex = 0;
          if (/:hover/.test(own)) rules.push({ r, own, ownRest: noHover(own), sel, rest: noHover(sel) });
        }
        if (r.cssRules) walk(r.cssRules, sel);
      }
    };
    for (const sheet of sheets) {
      try {
        walk(sheet.cssRules, "");
      } catch (e) {
        // Another origin's sheet can't be read.
      }
    }
    hoverScan = { sheets, sizes, rules };
    return rules;
  }
  // A computed value as the layer rests, with no :hover rule on it. Where finetune takes over the code's translate,
  // rotate or scale as hers, the pointer is often on the layer (a drag starts there), and a hover lift
  // (hover:-translate-y-1) read then would be baked in as where it sits. Every :hover rule that matches t now but
  // wouldn't with nothing hovered (or the other way round, a :not(:hover)) is switched off by its selector, the
  // value read, and the rule put back, all before the next paint. t is held still meanwhile, or the read would
  // catch the start of a transition back to rest.
  function resting(t, prop) {
    const off = hoverRules().filter((h) => {
      try {
        return t.matches(h.sel) !== t.matches(h.rest);
      } catch (e) {
        return false;
      }
    });
    if (!off.length) return getComputedStyle(t)[prop];
    still(t, true);
    off.forEach((h) => { h.r.selectorText = h.ownRest; });
    const v = getComputedStyle(t)[prop];
    off.forEach((h) => { h.r.selectorText = h.own; });
    flush();
    still(t, false);
    return v;
  }

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

  // Stroke, effects, adjustments and a hidden fill are kept as the panel shows them, beside the CSS they write (a
  // hidden fill writes transparent, so its color would be lost). On a component instance that CSS reaches every
  // instance, so they're kept once, on the component, as Figma's main component holds them; else on the layer.
  const META = ["fill", "stroke", "effects", "adjust"];
  const sharedName = (t) => sharedComponent(t, "outline");
  const keepComp = (c) => Object.keys(c.styles).length > 0 || META.some((k) => k in c);
  function metaOf(t) {
    const name = sharedName(t);
    return name ? edits.components[name] : edits.elements[keyOf(t)];
  }
  function recordMeta(t, change) {
    const name = sharedName(t);
    if (!name) return record(t, change);
    const c = edits.components[name] || { styles: {} };
    const before = viewKeys(c);
    change(c);
    stampView(c, before);
    if (keepComp(c)) edits.components[name] = c;
    else delete edits.components[name];
    noteChange();
  }
  // Her fill hidden, or shown again: its color is kept only while it's hidden, with the colour token it showed (a
  // text's var(--x)), so showing it again writes the token and not this theme's colour.
  const recordFill = (t, layer) => recordMeta(t, (m) => {
    if (layer.visible) delete m.fill;
    else m.fill = Object.assign({ hex: layer.hex, opacity: layer.opacity, visible: false }, layer.token ? { token: layer.token } : {});
  });
  const hiddenFill = (t) => {
    const m = metaOf(t);
    return m && m.fill ? Object.assign({}, m.fill) : null;
  };
  // Whose adjustments a filter carries: the layer's, or its component's.
  const toneKey = (t) => (sharedName(t) ? "component " + sharedName(t) : keyOf(t));

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
    const entry = metaOf(target);
    return Object.assign({}, NO_ADJUST, entry && entry.adjust);
  }

  function setAdjust(target, a) {
    setToneFilter(toneId(toneKey(target)), a);
    recordMeta(target, (entry) => {
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

  const entryOf = (t) => edits.elements[keyOf(t)];
  const figmaBlur = (cssBlur) => Math.round(parseFloat(cssBlur) * 2 * 10) / 10;

  // A filter's functions, in order.
  const filterFns = (v) => (!v || v === "none" ? [] : v.match(/[\w-]+\((?:[^()]|\([^()]*\))*\)/g) || []);
  // Hers among the page's own: the functions the panel shows (shown) give way to hers, which go where the first of
  // them was, or last; every other function (grayscale(), the code's saturate(), a url()) keeps its place. The
  // page's own value again hands the property back to the page; nothing left is none.
  function amongOwn(own, shown, mine) {
    const at = own.findIndex(shown);
    const kept = own.filter((f) => !shown(f));
    kept.splice(at < 0 ? kept.length : at, 0, ...mine);
    const css = kept.join(" ");
    return css === own.join(" ") ? "" : css || "none";
  }

  // One filter carries the adjustments and Layer blur, among the page's own functions. Once she's edited the
  // effects, the page's blur (and an SVG's drop-shadow) are the rows she sees, so hers replace them; a box's
  // drop-shadow() in its filter isn't one of its effects (those are box-shadow), so it stays as the code has it.
  function writeFilter(t) {
    const m = metaOf(t);
    const a = Object.assign({}, NO_ADJUST, m && m.adjust);
    const fxs = m && m.effects;
    const on = (fxs || []).filter((fx) => fx.visible);
    const svg = t instanceof SVGElement;
    // On anything SVG (the outer <svg> too) drop shadows are filter functions, so they follow the drawing's
    // shape, not its box; they go before the blur, so the blur takes them with it.
    const drops = svg ? on.filter((fx) => fx.type === "drop").map((fx) => "drop-shadow(" + fx.x + "px " + fx.y + "px " + fx.blur / 2 + "px " + rgba(fx) + ")") : [];
    const blurs = on.filter((fx) => fx.type === "layer").map((fx) => "blur(" + fx.blur / 2 + "px)");
    const mine = [adjustFilter(toneId(toneKey(t)), a)].concat(drops, blurs).filter(Boolean);
    const shown = (f) => !!fxs && (/^blur\(/.test(f) || (svg && /^drop-shadow\(/.test(f)));
    setStyle(t, "filter", amongOwn(filterFns(ownValue(t, "filter")), shown, mine));
  }

  // The stroke the panel shows: hers, or the page's own outline.
  function strokeOf(t) {
    const entry = metaOf(t);
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
      recordMeta(t, (entry) => {
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
    recordMeta(t, (entry) => {
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
    const entry = metaOf(t);
    if (entry && entry.effects) return entry.effects.map((fx) => Object.assign({}, fx));
    const cs = getComputedStyle(t);
    const out = [];
    if (t instanceof SVGElement) {
      // drop-shadow()'s blur reaches twice as far as box-shadow's, so Figma's number is double it.
      (cs.filter.match(/drop-shadow\((?:[^()]|\([^()]*\))*\)/g) || []).forEach((one) => {
        const c = toFill(one);
        const n = (one.replace(COLOR_FN, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
        if (c && n.length >= 2) out.push(Object.assign(newEffect(), { x: n[0], y: n[1], blur: figmaBlur(n[2] || 0), hex: c.hex, opacity: c.opacity }));
      });
      const blur = /(?:^|\s)blur\(([\d.]+)px\)/.exec(cs.filter);
      if (blur) out.push(Object.assign(newEffect(), { type: "layer", blur: figmaBlur(blur[1]) }));
      return out;
    }
    if (cs.boxShadow !== "none") {
      splitTop(cs.boxShadow).forEach((one) => {
        const c = toFill(one);
        const n = (one.replace(COLOR_FN, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
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
    recordMeta(t, (entry) => {
      if (list.length || pageHas) entry.effects = list.map((fx) => Object.assign({}, fx));
      else delete entry.effects;
    });
    if (svg) return writeFilter(t);
    const on = list.filter((fx) => fx.visible);
    const shadows = on.filter(isShadow).map((fx) => (fx.type === "inner" ? "inset " : "") + fx.x + "px " + fx.y + "px " + fx.blur + "px " + fx.spread + "px " + rgba(fx));
    setOrNone(t, "box-shadow", shadows.join(", "));
    writeFilter(t);
    // Background blur is the blur() in backdrop-filter, among the page's own functions (a glass's saturate() and
    // brightness() keep theirs).
    const back = on.filter((fx) => fx.type === "background").map((fx) => "blur(" + fx.blur / 2 + "px)");
    const css = amongOwn(filterFns(ownValue(t, "backdrop-filter")), (f) => /^blur\(/.test(f), back);
    // The prefixed one first, the standard one last: a build that merges the pair keeps the last.
    setStyle(t, "-webkit-backdrop-filter", css);
    setStyle(t, "backdrop-filter", css);
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

  // How much bigger or smaller than its CSS px the page draws what's inside t's parent: a scale on the parent or
  // further out (a prototype scaled to fit its frame). Read off the nearest box above it, drawn size against CSS
  // size, as drawnScaled does. 1 under a turn or a skew, which a rect can't measure.
  function scaleAbove(t) {
    let p = t.parentElement;
    while (p && p !== document.documentElement && !(p instanceof HTMLElement && p.offsetWidth && p.offsetHeight)) p = p.parentElement;
    if (!p || p === document.documentElement) return [1, 1];
    for (let a = p; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.rotate !== "none" || !/^(none|matrix\([^,]+, 0, 0,)/.test(cs.transform)) return [1, 1];
    }
    const r = p.getBoundingClientRect();
    // Offsets are whole px, so a box drawn within 1px of them isn't scaled.
    if (Math.abs(r.width - p.offsetWidth) <= 1 && Math.abs(r.height - p.offsetHeight) <= 1) return [1, 1];
    return [r.width / p.offsetWidth || 1, r.height / p.offsetHeight || 1];
  }

  // The turns and scales of the layers around t as one 2D matrix, which scaleAbove can't measure off a rect. Their
  // own translates don't change a move's size or direction, so only rotate, scale and transform count, in the order
  // CSS applies them. null when nothing above turns, skews or flips (scaleAbove serves then), or a value can't be read.
  function turnAbove(t) {
    const axes = { x: "1,0,0", y: "0,1,0", z: "0,0,1" };
    let m = new DOMMatrix();
    let turned = false;
    try {
      for (let a = t.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.rotate === "none" && cs.scale === "none" && cs.transform === "none") continue;
        const own = new DOMMatrix();
        if (cs.rotate !== "none") {
          const p = cs.rotate.trim().split(/\s+/);
          own.multiplySelf(new DOMMatrix(p.length === 1 ? "rotate(" + p[0] + ")"
            : "rotate3d(" + (p.length === 2 ? axes[p[0]] : p.slice(0, 3).join(",")) + "," + p[p.length - 1] + ")"));
        }
        if (cs.scale !== "none") {
          const p = cs.scale.trim().split(/\s+/);
          own.multiplySelf(new DOMMatrix((p.length === 3 ? "scale3d(" : "scale(") + p.join(",") + ")"));
        }
        if (cs.transform !== "none") own.multiplySelf(new DOMMatrix(cs.transform));
        // A flip (rotate 180°, a negative scale) turns a move round too, and a rect's size can't show it.
        if (Math.abs(own.b) > 1e-6 || Math.abs(own.c) > 1e-6 || own.a < 0 || own.d < 0) turned = true;
        m = own.multiply(m);
      }
    } catch (e) {
      return null;
    }
    return turned ? m : null;
  }

  // A move on screen, in the units a translate on t is counted in: px for the page (a scaled page around it draws
  // them bigger or smaller, so a move still follows the pointer), but inside an SVG the user units of its parent,
  // which a viewBox can scale (a 256 viewBox drawn at 24px makes a unit about a tenth of a px).
  function localDelta(t, dx, dy) {
    if (!inSvg(t)) {
      // Under a turned parent a translate turns with it, so the move is taken back through the turn: else a move
      // right inside a parent turned 90° would go down (Distribute and Spacing then move it the wrong way).
      const m = turnAbove(t);
      const det = m ? m.a * m.d - m.b * m.c : 0;
      if (det) return [(m.d * dx - m.c * dy) / det, (-m.b * dx + m.a * dy) / det];
      const [sx, sy] = scaleAbove(t);
      return [dx / sx, dy / sy];
    }
    const p = t.parentNode && t.parentNode.getScreenCTM ? t.parentNode.getScreenCTM() : null;
    const det = p ? p.a * p.d - p.b * p.c : 0;
    if (!det) return [dx, dy];
    return [(p.d * dx - p.c * dy) / det, (-p.b * dx + p.a * dy) / det];
  }

  // A layer's turn as it's drawn, the one angle Figma shows: its rotate, plus a turn its transform gives it
  // (transform: rotate(), Tailwind's rotate-*). The transform comes after the scale, so a flip there turns it the
  // other way. A transform that mirrors or skews has no one turn to read, so it counts for none.
  // rest: as the layer rests (see resting), where the turn is taken over as hers; else as drawn now.
  function transformTurn(t, rest) {
    const cs = rest ? { transform: resting(t, "transform"), scale: resting(t, "scale") } : getComputedStyle(t);
    if (!cs.transform || cs.transform === "none") return 0;
    const m = new DOMMatrixReadOnly(cs.transform);
    if (Math.abs(m.a - m.d) > 1e-3 || Math.abs(m.b + m.c) > 1e-3 || m.a * m.d - m.b * m.c <= 0) return 0;
    const sc = cs.scale === "none" ? [1, 1] : cs.scale.trim().split(/\s+/).map(parseFloat);
    const mirror = (sc[0] < 0) !== ((sc.length > 1 ? sc[1] : sc[0]) < 0);
    const deg = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    return Math.round((mirror ? -deg : deg) * 1000) / 1000;
  }
  function turnOf(t, rest) {
    const rot = rest ? resting(t, "rotate") : getComputedStyle(t).rotate;
    return (rot === "none" ? 0 : parseFloat(rot) || 0) + transformTurn(t, rest);
  }
  // Turns a layer to deg as drawn: the rotate written is what's left after the transform's turn, so the bake's
  // rotate and the code's transform add up to it.
  function setTurn(t, deg) {
    const code = transformTurn(t, true);
    let d = Math.round(((((deg - code) % 360) + 360) % 360) * 10) / 10;
    // Beside a turn in the code, the smaller way round reads better in Copy (-35deg, not 325deg).
    if (code && d > 180) d = Math.round((d - 360) * 10) / 10;
    boxed(t);
    turnInPlace(t);
    setStyle(t, "rotate", d ? d + "deg" : "");
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
  // The same size unrounded, as Scale needs it (offsetWidth and offsetHeight are whole px, so a 171.55 wide layer
  // would read 172): an element's computed width and height, plus its padding and border where they sit outside
  // them; else its box on screen over any scale above it; a vector's geometry.
  function exactSize(t) {
    if (isVector(t) || !(t instanceof HTMLElement)) return sizeOf(t);
    const cs = getComputedStyle(t);
    const n = (v) => parseFloat(v) || 0;
    if (cs.display !== "contents" && (cs.display !== "inline" || REPLACED.test(t.tagName)) && /px$/.test(cs.width) && /px$/.test(cs.height)) {
      const out = cs.boxSizing !== "border-box";
      return {
        w: n(cs.width) + (out ? n(cs.paddingLeft) + n(cs.paddingRight) + n(cs.borderLeftWidth) + n(cs.borderRightWidth) : 0),
        h: n(cs.height) + (out ? n(cs.paddingTop) + n(cs.paddingBottom) + n(cs.borderTopWidth) + n(cs.borderBottomWidth) : 0),
      };
    }
    const r = t.getBoundingClientRect();
    const k = scaleAbove(t);
    return { w: r.width / k[0], h: r.height / k[1] };
  }

  // Sets that size as the code would: a vector's geometry, an element's width and height. null leaves one as is.
  function setSize(t, w, h) {
    if (isVector(t)) {
      const now = vectorSize(t);
      return setVectorSize(t, w != null ? w : now.w, h != null ? h : now.h);
    }
    boxed(t);
    const [cw, ch] = boxCss(t, w || 0, h || 0);
    // Two decimals, as Figma's fields: a size kept as it was (389.25) is written as it was, not 389.3.
    if (w != null) setStyle(t, "width", Math.round(cw * 100) / 100 + "px");
    if (h != null) setStyle(t, "height", Math.round(ch * 100) / 100 + "px");
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
  const round2 = (n) => Math.round(n * 100) / 100;
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

  // A paint shown is its color (its -opacity back to 1 if the page set one, or the two would multiply), or its
  // colour token when it has one (SVG text's Color styles), which carries no opacity, so the page's own stays; a
  // hidden one is transparent, so the shape can still be clicked.
  function writeSvgPaint(t, prop, layer) {
    setStyle(t, prop, !layer.visible ? "transparent" : layer.token ? "var(" + layer.token + ")" : rgba(layer));
    const own = parseFloat(ownValue(t, prop + "-opacity"));
    setStyle(t, prop + "-opacity", !layer.token && isNum(own) && own !== 1 ? "1" : "");
  }

  // Removing a paint: none, unless the page's own is already none.
  function clearSvgPaint(t, prop) {
    setStyle(t, prop, ownValue(t, prop) === "none" ? "" : "none");
    setStyle(t, prop + "-opacity", "");
  }

  // mine: this layer only, never its component (a K scale is an instance's own, as in Figma).
  // The longhands a shorthand sets (outline: its color, style and width), none for a longhand.
  const LONGS = new Map();
  function longhandsOf(prop) {
    if (!LONGS.has(prop)) {
      const st = document.createElement("div").style;
      st.setProperty(prop, "initial");
      const l = Array.from(st);
      LONGS.set(prop, l.length && !(l.length === 1 && l[0] === prop) ? l : []);
    }
    return LONGS.get(prop);
  }
  function setStyle(target, prop, value, mine) {
    const shared = !mine && sharedComponent(target, prop);
    if (shared) return setComponentStyle(shared, prop, value);
    const o = originalOf(target);
    // The code's own translate (inline or the stylesheet's), kept before her first one hides it: a move adds to it.
    // Read at rest, so a hover lift isn't kept as the code's.
    if (prop === "translate" && !(prop in o.styles)) o.codeTr = resting(target, "translate");
    if (!(prop in o.styles)) o.styles[prop] = target.style.getPropertyValue(prop);
    // One declaration per part: a longhand written over her shorthand (K's outline-width over Stroke's outline)
    // splits the shorthand into its parts, and a shorthand drops the parts it resets, so Copy and a reload never
    // hang on the order of the two. A shorthand holding a var() has no parts to read, so it stays.
    const own = entryOf(target);
    const parts = {};
    const split = own ? Object.keys(own.styles).filter((sh) => sh !== prop && longhandsOf(sh).includes(prop)
      && longhandsOf(sh).every((lh) => target.style.getPropertyValue(lh))) : [];
    split.forEach((sh) => longhandsOf(sh).forEach((lh) => {
      parts[lh] = target.style.getPropertyValue(lh);
      if (!(lh in o.styles)) {
        const st = document.createElement("div").style;
        if (o.styles[sh]) st.setProperty(sh, o.styles[sh]);
        o.styles[lh] = st.getPropertyValue(lh);
      }
    }));
    if (value) target.style.setProperty(prop, value);
    else {
      target.style.removeProperty(prop);
      tidyStyle(target);
    }
    record(target, (entry) => {
      split.forEach((sh) => {
        delete entry.styles[sh];
        longhandsOf(sh).forEach((lh) => { if (lh !== prop) entry.styles[lh] = parts[lh]; });
      });
      longhandsOf(prop).forEach((lh) => delete entry.styles[lh]);
      if (value) entry.styles[prop] = value;
      else delete entry.styles[prop];
      // Her moves (a drag, the arrows, X and Y) add to the translate, so Spacing's share inside it (nudge) still
      // holds; only a translate that is gone takes the share with it.
      if (prop === "translate" && !value) delete entry.sim;
    });
  }

  // An edit to a component: on every instance of it (but one that overrides that property), recorded once. Recorded
  // first, so each instance takes what the component edits now give it (an outer component's value holds over it,
  // and taking this one off falls back to an inner one's).
  function setComponentStyle(name, prop, value) {
    const entry = edits.components[name] || { styles: {} };
    const before = viewKeys(entry);
    if (value) entry.styles[prop] = value;
    else delete entry.styles[prop];
    stampView(entry, before);
    if (keepComp(entry)) edits.components[name] = entry;
    else delete edits.components[name];
    instancesOf(name).forEach((t) => {
      // Has the component's look now, so the page watcher leaves it be.
      appliedComp.add(t);
      paintComps(t, [prop]);
    });
    noteChange();
  }

  function restoreEdits() {
    const added = edits.newKeyframes;
    edits.newKeyframes = {};
    paintNewKeyframes(added);
    edits.newKeyframes = added;
    // Words first: new words are new layers inside, so the edits of a layer in them land after.
    Object.keys(edits.elements).forEach((sel) => {
      const t = edits.elements[sel].html != null && resolve(sel);
      if (t) applyWords(sel, t);
    });
    // An edit whose selector now finds another element is left off it (see resolve), and said once.
    let moved = 0;
    Object.keys(edits.elements).forEach((sel) => {
      const t = resolve(sel);
      if (t) applyEntry(sel, t);
      else if (lostAt.get(sel) === "moved") moved++;
    });
    // The ⌘D copies, cloned from their originals now the originals' edits are on (the copy shows them too), in the
    // order they were made (a copy made inside another is remade after the one that holds it). Their own edits, and
    // those of layers inside them, land in a late pass: until a copy exists, resolve finds nothing for them.
    if (edits.duplicates.length) {
      edits.duplicates.forEach((d) => remakeDup(d, resolve(d.of)));
      const late = Object.keys(edits.elements).filter((sel) => dupRecord(sel) || edits.elements[sel].inDup);
      late.forEach((sel) => {
        const t = edits.elements[sel].html != null && resolve(sel);
        if (t) applyWords(sel, t);
      });
      late.forEach((sel) => {
        const t = resolve(sel);
        if (t) applyEntry(sel, t);
      });
    }
    // Saved component edits, on every instance but where one overrides that property. Each instance is written once,
    // with every key that reaches it, so the order the keys were saved in doesn't matter (see paintComps).
    const reached = new Set();
    Object.keys(edits.components).forEach((name) => {
      if (edits.components[name].adjust) setToneFilter(toneId("component " + name), edits.components[name].adjust);
      instancesOf(name).forEach((t) => reached.add(t));
    });
    reached.forEach((t) => applyComp(t));
    // Saved keyframe edits, written over what the code had (kept first).
    const saved = edits.keyframes;
    edits.keyframes = {};
    paintKeyframes(saved);
    edits.keyframes = saved;
    if (moved) toast(moved + (moved === 1 ? " saved edit no longer matches" : " saved edits no longer match") + " the page", null, 4000);
  }
  // Her words, written in by React's rule (see reactHeld): plain words go into the one text node React holds, so its
  // hold on it stays good; where React builds them from several parts nothing is written, and this says false.
  function writeWords(t, html) {
    if (t.innerHTML === html) return true;
    if (fiberOf(t)) {
      const tpl = document.createElement("template");
      tpl.innerHTML = html;
      const only = t.childNodes.length === 1 && t.firstChild.nodeType === 3 ? t.firstChild : null;
      if (only && !tpl.content.querySelector("*")) {
        only.data = tpl.content.textContent;
        return true;
      }
      if (reactHeld(t)) return false;
    }
    t.innerHTML = html;
    return true;
  }
  // Saved words React wouldn't let in (see writeWords), by selector, so Copy says they don't show.
  const wordsHeld = new Set();
  function applyWords(sel, t) {
    const o = originalOf(t);
    if (!("html" in o)) o.html = t.innerHTML;
    if (writeWords(t, edits.elements[sel].html)) {
      wordsHeld.delete(sel);
      watchWords(t);
    } else wordsHeld.add(sel);
  }
  // One element's saved edit (all but its words, above), on the element it belongs on now.
  function applyEntry(sel, t) {
    const entry = edits.elements[sel];
    const o = originalOf(t);
    if (entry.src && !("src" in o)) Object.assign(o, { src: t.getAttribute("src"), srcset: t.getAttribute("srcset") });
    if ("translate" in entry.styles && !("translate" in o.styles)) o.codeTr = resting(t, "translate");
    Object.keys(entry.styles).forEach((p) => { if (!(p in o.styles)) o.styles[p] = t.style.getPropertyValue(p); });
    if (entry.src) {
      t.removeAttribute("srcset");
      t.src = entry.src.data;
    }
    if (entry.adjust) setToneFilter(toneId(sel), entry.adjust);
    Object.keys(entry.styles).forEach((p) => t.style.setProperty(p, entry.styles[p]));
    if (entry.deleted) t.setAttribute("data-ft-deleted", "");
    if (entry.ungrouped) t.setAttribute("data-ft-ungrouped", "");
    if (entry.attrs) Object.keys(entry.attrs).forEach((a) => {
      o.attrs = o.attrs || {};
      if (!(a in o.attrs)) o.attrs[a] = t.getAttribute(a);
      t.setAttribute(a, entry.attrs[a]);
    });
    applied.set(sel, t);
  }
  // The saved component looks on one instance, but for what that instance overrides, every key that reaches it at once
  // (see paintComps).
  const appliedComp = new WeakSet();
  function applyComp(t, props) {
    paintComps(t, props);
    appliedComp.add(t);
  }

  // React (and other scripts) can swap a layer for a fresh copy of it: a re-render that remounts it, a route coming
  // back. Its edits would be gone from the page, so one watcher puts them on the new one, as a reload would: element
  // edits, deletes, ungroups, words (by React's rule) and a component's look on its new instances. Not an edit of
  // hers, so no undo step. Batched to a frame, and blind to finetune's own layers; its own writes land on the
  // elements the edits are already on, so they never start it over.
  let pageWatch = null;
  // finetune's layers carry ft- classes. html and body carry some too (ft-moving), so the walk stops below body.
  const ownNode = (n) => {
    if (isUi(n)) return true;
    for (let p = n; p && p !== document.body; p = p.parentElement) if (/(^|\s)ft-/.test(p.getAttribute("class") || "")) return true;
    return false;
  };
  function watchPage() {
    if (pageWatch || !window.MutationObserver || !document.body) return;
    let added = [];
    // Elements whose class the page changed: React re-rendering the same node with another variant changes its class,
    // so the variant edits that reach it can change with it.
    let restyled = [];
    let frame = 0;
    pageWatch = new MutationObserver((records) => {
      records.forEach((r) => {
        if (r.type === "attributes") {
          if (Object.keys(edits.components).length && !ownNode(r.target)) restyled.push(r.target);
        } else r.addedNodes.forEach((n) => { if (n.nodeType === 1 && !ownNode(n)) added.push(n); });
      });
      if ((!added.length && !restyled.length) || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const fresh = added.filter((n) => n.isConnected);
        const changed = restyled.filter((n) => n.isConnected);
        added = [];
        restyled = [];
        if (fresh.length) reapply(fresh);
        if (changed.length) reapplyComps(changed);
      });
    });
    pageWatch.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }
  // The component edits on elements the page re-rendered in place: each takes what the keys that reach it now give it,
  // and the code's own back for what a key that no longer reaches it had set.
  function reapplyComps(changed) {
    const roots = changed.filter((t) => !isUi(t) && (appliedComp.has(t) || componentOf(t)));
    if (!roots.length) return;
    forgetInstances();
    const props = Object.keys(edits.components).flatMap((k) => Object.keys(edits.components[k].styles));
    roots.forEach((t) => {
      if (!appliedComp.has(t) && !Object.keys(edits.components).some((k) => rankOf(t, k) >= 0)) return;
      applyComp(t, props);
    });
  }
  function reapply(fresh) {
    forgetInstances();
    const sels = Object.keys(edits.elements);
    const stale = (sel) => {
      const t = resolve(sel, null, fresh);
      return t && t !== applied.get(sel) ? t : null;
    };
    sels.forEach((sel) => {
      const t = edits.elements[sel].html != null && stale(sel);
      if (t) applyWords(sel, t);
    });
    sels.forEach((sel) => {
      const t = stale(sel);
      if (t) applyEntry(sel, t);
    });
    // A ⌘D copy thrown out with a re-rendered parent is remade from its original as it stands now, and the edits
    // made on it (and inside it) go back on.
    let remade = false;
    edits.duplicates.forEach((d) => {
      const was = applied.get(d.key);
      if (was && was.isConnected) return;
      const clone = remakeDup(d, resolve(d.of, null, fresh));
      if (!clone) return;
      remade = true;
      const e = edits.elements[d.key];
      if (e && e.html != null) applyWords(d.key, clone);
      if (e) applyEntry(d.key, clone);
    });
    if (remade) sels.forEach((sel) => {
      if (!edits.elements[sel].inDup) return;
      const t = stale(sel);
      if (!t) return;
      if (edits.elements[sel].html != null) applyWords(sel, t);
      applyEntry(sel, t);
    });
    if (!Object.keys(edits.components).length) return;
    fresh.forEach((n) => [n].concat(Array.from(n.querySelectorAll("*"))).forEach((t) => {
      if (appliedComp.has(t) || isUi(t) || !componentOf(t)) return;
      if (Object.keys(edits.components).some((key) => rankOf(t, key) >= 0)) applyComp(t);
    }));
  }

  // Words the page rewrites after she retyped them (React's {expression}, a script's counter) are built in code: the
  // bake can't retype them as words, so the edit says so (entry.htmlComputed, in Copy and under the panel's kind
  // line). finetune's own writes put back what the entry holds, so only a write that doesn't counts, and words
  // inside it with an edit of their own are theirs.
  const wordWatch = new WeakSet();
  function watchWords(t) {
    if (wordWatch.has(t) || !window.MutationObserver) return;
    wordWatch.add(t);
    const mo = new MutationObserver((records) => {
      if (t.hasAttribute("data-ft-editing") || t.querySelector("[data-ft-editing]")) return;
      const sel = keyOf(t);
      const e = edits.elements[sel];
      if (!e || e.html == null || e.htmlComputed || applied.get(sel) !== t) return stop();
      const theirs = (n) => {
        for (let p = n.nodeType === 1 ? n : n.parentElement; p && p !== t; p = p.parentElement) {
          if ((edits.elements[keyOf(p)] || {}).html != null) return true;
        }
        return false;
      };
      if (records.every((r) => theirs(r.target)) || codeHtml(t) === e.html) return;
      e.htmlComputed = true;
      stop();
      // Not her edit, so not an undo step: the step showing takes it in.
      if (!history.timer && history.now != null) history.now = snapshot();
      refreshPanel();
    });
    const stop = () => {
      mo.disconnect();
      wordWatch.delete(t);
    };
    mo.observe(t, { characterData: true, childList: true, subtree: true });
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
  // The page wrapper as it is now: React can replace the one read at load with a fresh copy (a remount), and a fill
  // or a Copy on the old one would land on nothing.
  const livePage = () => (pageEl && pageEl.isConnected ? pageEl : (pageEl = pageCanvas()));

  // The page fill as one CSS background: the top layer first, the bottom one as the color.
  function pageBackground(layers) {
    const shown = layers.filter((l) => l.visible).map((l) => (l.opacity === 100 ? "#" + l.hex : rgba(l)));
    if (!shown.length) return "transparent";
    return shown.slice(0, -1).map((c) => "linear-gradient(" + c + ", " + c + ")").concat(shown.slice(-1)).join(", ");
  }

  // The list the bake skill reads: the file, then one line per changed element.
  function changesText() {
    const lines = [];
    // The window Copy is made in, for the header. An edit made at another width or theme says so under its line, so
    // the bake writes it for that breakpoint or theme, not for every one.
    const view = { vw: window.innerWidth, theme: pageTheme() };
    // A theme switches colours (its tokens), so it's named only for a value that carries one: an opacity or a size
    // seen in light holds in dark too. A filter carries colour unless all it does is blur. A value that is just a token
    // (var(--x), from Color styles) switches with the theme by itself, so it holds in every theme.
    const colourKey = (k, v) => !/^var\(\s*--[\w-]+\s*\)$/.test(String(v).trim())
      && (k === "page" || k === "adjust" || k.startsWith("--") || /color|background|shadow/.test(k)
      || /^(fill|stroke|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?|outline|text-decoration|column-rule)$/.test(k)
      || (/filter$/.test(k) && /(^|[\s)])(?!blur\()[a-z-]+\(/.test(String(v))));
    // keys: the properties the line lists, each read at its own window (see stampView), the entry's for one without;
    // none for a line with no property (a delete, an ungroup). When every one of them was made at the same other
    // window the note is the line's; when only some were, it names them.
    const viewNote = (name, e, keys) => {
      if (!e) return;
      const ks = keys && keys.length ? keys : [""];
      const groups = new Map();
      ks.forEach((k) => {
        const v = (k && e.views && e.views[k]) || e;
        const diff = [];
        if (isNum(v.vw) && v.vw !== view.vw) diff.push("at " + v.vw + "px wide");
        if (k && colourKey(k, e.styles && e.styles[k]) && v.theme && view.theme && v.theme !== view.theme) diff.push("in " + v.theme);
        if (!diff.length) return;
        const d = diff.join(", ");
        if (!groups.has(d)) groups.set(d, []);
        groups.get(d).push(k);
      });
      groups.forEach((list, d) => {
        const whose = groups.size === 1 && list.length === ks.length ? "" : list.join(", ") + " ";
        lines.push(["/* " + name + ": " + whose + "changed " + d + " */", null]);
      });
    };
    // Where the code writes it, when the dev build says (see sourceOf): the file the bake opens.
    const at = (where) => (where ? " @ " + where : "");
    // A wrapper that paints the page is named, so the bake writes its background, not the body's.
    const page = livePage();
    const pageName = page && page !== document.body ? "page (" + selectorFor(page) + ")" : "page";
    if (edits.page) {
      // A bottom row she never touched is the code's own background, read as one colour in the theme she was in;
      // the code holds it as a token that differs per theme. So only her rows are written, as layers over it, and
      // the note says the code keeps its own: a literal hex there would bake one theme's colour into every theme.
      const base = edits.page[edits.page.length - 1];
      const own = edits.pageBase;
      if (own && base.visible && base.hex === own.hex && base.opacity === own.opacity) {
        const over = edits.page.slice(0, -1).filter((l) => l.visible).map((l) => (l.opacity === 100 ? "#" + l.hex : rgba(l)));
        if (over.length) {
          const theme = (edits.pageView && edits.pageView.theme) || view.theme;
          lines.push([pageName, "background-image: " + over.map((c) => "linear-gradient(" + c + ", " + c + ")").join(", ")]);
          lines.push(["/* " + pageName + ": under these layers is the code's own background (" + (own.opacity === 100 ? "#" + own.hex : rgba(own)) + (theme ? " in " + theme : "") + "); keep the code's */", null]);
          viewNote(pageName, edits.pageView, ["page"]);
        }
      } else {
        lines.push([pageName, "background: " + pageBackground(edits.page)]);
        viewNote(pageName, edits.pageView, ["page"]);
      }
    }
    // A component's own look, changed on every instance of it: named, with the element it renders and how many,
    // and the component's own file, where it writes that element.
    Object.keys(edits.components).forEach((name) => {
      const styles = edits.components[name].styles;
      const all = instancesOf(name);
      const root = all[0] ? " (" + all[0].localName + (all[0].classList.length ? "." + all[0].classList[0] : "") + ", " + all.length + " on the page" + reachNote(name) + ")" : "";
      // The file is this component's own, even where its first render sits inside another (a Card in a FeatureCard).
      const link = all[0] && chainOf(all[0])[rankOf(all[0], name) >> 1];
      const def = link && link.fiber ? componentDef(link.fiber) : all[0] ? sourceOf(all[0], "def") : "";
      const before = lines.length;
      if (Object.keys(styles).length) lines.push(["component " + name + root + at(def), Object.keys(styles).map((p) => p + ": " + styles[p]).join("; ")]);
      const adj = edits.components[name].adjust;
      if (adj && hasTone(adj)) lines.push(["component " + name + " svg", toneMarkup(toneId("component " + name), adj)]);
      if (lines.length > before) viewNote("component " + name, edits.components[name], Object.keys(styles).concat(adj && hasTone(adj) ? ["adjust"] : []));
      // A text style picked on its instances' text, as on a layer's (see the element lines).
      const ts = edits.components[name].textStyle;
      if (ts && Object.keys(ts.styles).every((p) => styles[p] === ts.styles[p])) {
        lines.push(["/* component " + name + ": text style ." + ts.name + " (defined in code) */", null]);
      }
    });
    // A layer in a group's auto layout carries no translate of its own: the group's line places it (and an ignored
    // one's own line), so the bake never adds a move the new element's flex would add again.
    const laidOut = new Set(edits.autoLayout.flatMap((l) => l.sels));
    // The selector a line names an element by: the one it has now, where its edit was found again elsewhere (see
    // resolve) or is a second edit on its selector (see keyOf); else the key as saved. Every line that names a layer
    // (its own, its group's, a scale's) names it the same way.
    const named = (key, t) => (t && (query(key) !== t || bareKey(key) !== key) ? selectorFor(t) : bareKey(key));
    // One whose code has a translate gets translate: none instead, or the code's would land on top of the layout.
    const codeMoved = new Set([...laidOut].filter((sel) => {
      const t = groupMembers([sel])[0];
      return t && !/^(none)?$/.test(ownValue(t, "translate"));
    }));
    codeMoved.forEach((sel) => { if (!edits.elements[sel]) lines.push([sel, "translate: none"]); });
    // What an ungrouped wrapper still hands its layers live (display: contents keeps it in the DOM, so they inherit
    // from it) and the bake would lose with it: her own edits to an inherited property (she sees them on the layers),
    // and any inherited value it sets that differs from its parent's and that a layer of it still reads. Custom
    // properties from the code can't be listed from the page, so the bake checks those in the code.
    const carried = (sel, e) => {
      const t = q(sel);
      const out = Object.keys(e.styles).filter((p) => p.startsWith("--") || INHERITED.includes(p)).map((p) => p + ": " + e.styles[p]);
      if (!t || !t.parentElement) return out;
      const cs = getComputedStyle(t);
      const ps = getComputedStyle(t.parentElement);
      const kids = layersOf(t).map((c) => getComputedStyle(c));
      INHERITED.filter((p) => !(p in e.styles)).forEach((p) => {
        const v = cs.getPropertyValue(p);
        if (v !== ps.getPropertyValue(p) && kids.some((k) => k.getPropertyValue(p) === v)) out.push(p + ": " + v);
      });
      return out;
    };
    // A K scale's comment comes before the lines of every layer inside it, an edit made before the scale included.
    // An edit's element is the one it was made on (see resolve), looked up once per Copy.
    const qs = new Map();
    const q = (sel) => {
      if (!qs.has(sel)) qs.set(sel, edits.elements[sel] ? resolve(sel) : query(sel));
      return qs.get(sel);
    };
    // A scale made inside another one comes after the outer layer's own lines, so each comment heads only the layers
    // its layer holds.
    const roots = Object.keys(edits.elements).filter((sel) => edits.elements[sel].scaled && q(sel));
    // The nearest scaled layer holding sel (not sel itself), and every one holding it, nearest first.
    const holders = (sel) => {
      const t = q(sel);
      return t ? roots.filter((r) => r !== sel && q(r).contains(t)).sort((a, b) => (q(b).contains(q(a)) ? -1 : 1)) : [];
    };
    const kids = new Map();
    const tops = [];
    Object.keys(edits.elements).forEach((sel) => {
      const h = holders(sel)[0];
      if (!h) return tops.push(sel);
      if (!kids.has(h)) kids.set(h, []);
      kids.get(h).push(sel);
    });
    const order = [];
    const emit = (sel) => {
      order.push(sel);
      const k = kids.get(sel) || [];
      k.filter((x) => !roots.includes(x)).forEach((x) => order.push(x));
      k.filter((x) => roots.includes(x)).forEach(emit);
    };
    tops.forEach((sel) => (roots.includes(sel) ? emit(sel) : order.push(sel)));
    const edit = (key) => {
      const e = edits.elements[key];
      // Not on the element it was made on, since the page changed. Where its selector finds none (gone, or not shown
      // right now), its line follows as usual; where it finds another element, its lines follow commented out (see
      // below), so the bake has the values once she names the element.
      if (e.at && !q(key)) {
        const was = e.at.key != null ? e.at.key : e.at.text || e.at.src || e.at.tag;
        lines.push(["/* " + bareKey(key) + ': not found, the page changed since this edit (was "' + was + '") */', null]);
      }
      // Found again after the page moved it (see resolve): its lines name it as it is now, so the bake edits it and not
      // the element the saved key points at today. The key itself stays as saved.
      const sel = named(key, q(key));
      // On the selector's element for its place alone: its words aren't the ones the edit was made on (a count-up, a
      // rotating word, or another element now), so the bake checks it's the one she meant.
      if (lostAt.get(key) === "changed") lines.push(["/* " + sel + ': its words were "' + e.at.text + '" when this edit was made; check it is the same element */', null]);
      // A .map() item says which one: its key, and where it is in the list.
      const item = q(key) && listItem(q(key), key);
      const itemTag = item ? ' (item "' + item.key + '", ' + item.n + " of " + item.of + ")" : "";
      if (e.deleted) {
        lines.push([sel + itemTag + at(sourceOf(q(key), "here")), "delete"]);
        return viewNote(sel, e);
      }
      // The wrapper goes and its layers take its place in the code; their own moves are on their own lines.
      if (e.ungrouped) {
        lines.push([sel + itemTag + at(sourceOf(q(key), "here")), "ungroup"]);
        const carry = carried(key, e);
        if (carry.length) lines.push([sel, "carry to children: " + carry.join("; ")]);
        return viewNote(sel, e);
      }
      // Nor the margin a group's auto layout set in a flex container (spanGaps): the new element stands for it.
      const keys = Object.keys(e.styles).filter((p) => !(p === "translate" && laidOut.has(key))
        && !(laidOut.has(key) && e.spanGap && e.spanGap.prop === p && e.styles[p] === e.spanGap.value));
      const parts = keys.map((p) => p + ": " + e.styles[p]);
      if (codeMoved.has(key)) parts.unshift("translate: none");
      // A ⌘D copy: a new layer, a duplicate of its original right after it in the code. Its own edits follow on the
      // same line, made to the copy once it's in; its @ is the original's place, where the code to copy lives.
      const d = dupRecord(key);
      let dupNote = "";
      if (d) {
        parts.unshift("duplicate of " + named(d.of, q(d.of)));
        // A component edit made after the copy repaints the original (a real instance) but not the copy, which has
        // no fiber: where their values differ now (and the copy's own edits don't say so), the note tells the bake
        // the live copy lags — the baked copy, a real instance, takes the component's look by itself.
        const orig = q(d.of);
        const copy = q(key);
        if (orig && copy && Object.keys(edits.components).some((name) => rankOf(orig, name) >= 0
          && Object.keys(edits.components[name].styles).some((p) =>
            !(p in e.styles) && orig.style.getPropertyValue(p) !== copy.style.getPropertyValue(p)))) {
          dupNote = "its original is a component instance edited since the copy was made, so the copy shows the older look live; the baked copy, a real instance, takes the component's — no extra lines needed";
        }
      }
      if (e.html != null) keys.push("text");
      if (e.src) keys.push("src");
      if (e.attrs) keys.push("attributes");
      const t = q(key);
      // The words stay on their line. Where the element collapses white space (the usual), the source's line breaks
      // and indents are one space, as the browser shows them; where it keeps them (white-space: pre and kin), a line
      // break is written \n.
      if (e.html != null) {
        const cs = t && getComputedStyle(t);
        const keeps = cs && (cs.whiteSpaceCollapse ? cs.whiteSpaceCollapse !== "collapse" : /pre|break-spaces/.test(cs.whiteSpace));
        parts.push("text: " + (keeps ? e.html.replace(/\r\n?|\n/g, "\\n") : e.html.replace(/\s+/g, " ").trim()));
      }
      if (e.src) parts.push('src: new image "' + e.src.name + '", chosen from her computer');
      // An attribute on the markup, not CSS: a K scale's viewBox on an <svg> that had none.
      if (e.attrs) Object.keys(e.attrs).forEach((a) => parts.push("attribute " + a + ': "' + e.attrs[a] + '"'));
      // A K scale says its factor once, over the layer it was made on, for the bake's calc() on tokens; the values
      // a running animation holds, which it left, are listed for her.
      // One inside another scaled layer also gives the factor its values carry, every holder's multiplied in.
      if (e.scaled) {
        const h = holders(key);
        const total = Number(h.reduce((f, r) => f * parseFloat(edits.elements[r].scaled), parseFloat(e.scaled)).toPrecision(8));
        const names = h.map((r) => named(r, q(r)) + "'s").join(" and ");
        lines.push(["/* " + sel + " scaled " + e.scaled + "x (K)" + (h.length ? ", " + total + "x with " + names : "") + " */", null]);
      }
      if (e.scaleSkipped) lines.push(["/* " + sel + ": animated " + e.scaleSkipped + " not scaled (K) */", null]);
      // A ::before or ::after has no inline style to write, so its px lengths stay; each is listed for the bake.
      if (e.scalePseudo) e.scalePseudo.split("; ").forEach((x) => lines.push(["/* " + sel + x + " not scaled (K) */", null]));
      // On a component instance, the layer's own edits are this instance's only (an override, a move, its words).
      const comp = t ? componentOf(t) : "";
      // A layer inside an instance of a component used more than once changed on this instance only (as an edit
      // inside an instance is in Figma), so it's named: the rule that styles it is the component's, shared by all.
      const host = !comp && t ? hostComponent(t) : "";
      const tag = comp ? " (this " + comp + " only)" : host ? " (inside this " + host + " only)" : "";
      // Where it's written. Inside an instance that's the component's file, so the place that instance is used
      // comes too: an edit to one instance is written there, through what it's given.
      const here = sourceOf(t, "here");
      let where = at(here);
      const instanceAround = (name) => {
        let inst = t.parentElement;
        while (inst && componentOf(inst) !== name) inst = inst.parentElement;
        return inst;
      };
      if (where && host) {
        const used = sourceOf(instanceAround(host), "here");
        if (used) where += ", this one at " + used;
      }
      // An instance used inside another component that's on the page more than once is used on a line all of those
      // share, so that outer instance's place comes too: the bake passes the change in through it. Only when this
      // one is used in the outer one's own file (or that can't be told): one handed in as children is used elsewhere.
      const outer = comp && where ? hostComponent(t) : "";
      if (outer) {
        const file = (s) => s.replace(/(?::\d+){1,2}$/, "");
        const inst = instanceAround(outer);
        const def = file(sourceOf(inst, "def"));
        const used = sourceOf(inst, "here");
        if (used && (!def || def === file(here))) where += ", inside this " + outer + " at " + used;
      }
      if (parts.length) {
        lines.push([sel + tag + itemTag + where, parts.join("; ")]);
        viewNote(sel, e, keys);
        if (dupNote) lines.push(["/* " + sel + ": " + dupNote + " */", null]);
      }
      // A text style she picked from Text styles, while the line still has every value its class gave: the bake adds
      // the class and doesn't write those values.
      const ts = e.textStyle;
      if (ts && Object.keys(ts.styles).every((p) => e.styles[p] === ts.styles[p])) {
        lines.push(["/* " + sel + ": text style ." + ts.name + " (defined in code) */", null]);
      }
      // Words the code builds: the page rewrote them after the edit (see watchWords), or they're made of several parts,
      // so React wouldn't take them (see writeWords). The bake changes the expression, not the words.
      if (e.html != null && e.htmlComputed) lines.push(["/* " + sel + ": these words are built in code (the page rewrote them); change the expression, ask first */", null]);
      else if (e.html != null && wordsHeld.has(key)) lines.push(["/* " + sel + ": these words are built in code from several parts, so the page doesn't show this edit; change the expression, ask first */", null]);
      // The columns an Align or Make wide to columns put it on, while it still sits there (an arrow key since then,
      // or another width, and it's px again).
      const c = e.cols;
      const r = c && t && t.getBoundingClientRect();
      if (r && Math.abs(r.left + window.scrollX - c.left) <= 0.5 && (c.how !== "width" || Math.abs(r.width - c.width) <= 0.5)) {
        // A grid in the code is named by its classes, which more than one element can have, and a layer that isn't
        // one of its items can't be placed with it (a grid-column on it lands in whatever grid holds it), so that's
        // said and the bake writes the px. Its parent through any display: contents wrapper is what lays it out.
        let p = t.parentElement;
        while (p && p !== document.body && getComputedStyle(p).display === "contents") p = p.parentElement;
        let item = false;
        try {
          item = !!p && /grid/.test(getComputedStyle(p).display) && p.matches(c.source);
        } catch (err) {
          // "layout" (the call's declared grid) or an old name that isn't a selector: no grid element to be in.
        }
        const grid = c.source === "layout" ? c.source : c.source !== "guide" ? c.source + (item ? "" : ", not its item")
          : "guide " + styleName({ count: c.count, gutter: c.gutter, align: c.align, offset: c.align === "stretch" ? c.margin : c.offset, width: c.colWidth });
        const how = { left: "aligned left", hcenter: "centered", right: "aligned right", width: "full span" }[c.how];
        // A fluid grid (auto-fit, auto-fill) has no rule or variant that holds this count, so the bake writes px. And
        // the preview moves the layer within its row, while a grid-column starting before its own column makes the
        // grid's auto-placement put it on the next row: said, so the bake asks rather than bake what she didn't see.
        const fluid = item && fluidGrid(p);
        const at = item && !fluid && getComputedStyle(t).gridRowStart === "auto" ? itemColumn(t, p) : 0;
        lines.push(["/* " + sel + ": " + (c.first === c.last ? "column " + c.first : "columns " + c.first + "-" + c.last) + " of " + c.count
          + " (" + grid + "), " + how + (fluid ? ", fluid columns" : "") + ", at " + c.vw + "px wide"
          + (at > c.first ? ", before its column " + at + " so the grid moves it to the next row" : "") + " */", null]);
      }
      // Why a resize wrote a value she didn't type (a pinned axis, an image's fill, a stretch let go), while it holds.
      if (e.why) Object.keys(e.why).forEach((p) => {
        if (e.styles[p] === e.why[p].value) lines.push(["/* " + sel + ": " + p + ": " + e.why[p].value + " " + e.why[p].note + " */", null]);
      });
      // The SVG filter its url() points at, for the bake to put in the page.
      if (e.adjust && hasTone(e.adjust)) lines.push([sel + " svg", toneMarkup(toneId(key), e.adjust)]);
    };
    // An edit whose selector now finds another element keeps its lines, commented out: as lines they'd send the bake
    // to that element, and without them the bake would have nothing to write once she says which element she meant.
    order.forEach((key) => {
      const from = lines.length;
      edit(key);
      if (lostAt.get(key) !== "moved") return;
      for (let i = from; i < lines.length; i++) if (lines[i][1] != null) lines[i] = ["/* " + lines[i][0] + "  " + lines[i][1] + " */", null];
    });
    // A group: the layers the bake wraps in one new layer in the code, listed in the code's order (not the order she
    // picked them; with auto layout, the order its flex places them), then the new layer's CSS, then each layer that
    // ignores the layout.
    edits.groups.forEach((g, i) => {
      const name = "group " + (i + 1);
      const L = layoutOf(g);
      const found = g.map((sel) => ({ sel, t: groupMembers([sel])[0] || null }));
      const order = found.filter((m) => m.t).sort((a, b) => domOrder(a.t, b.t)).concat(found.filter((m) => !m.t));
      lines.push([name, order.map((m) => named(m.sel, m.t)).join(", ")]);
      if (!L) return;
      const f = alGeometry(L);
      const bake = alBake(L, f);
      lines.push([name + " auto layout", alDeclarations(L, f, bake.wrap)]);
      bake.layers.forEach(([sel, decl, t]) => lines.push([name + " " + named(sel, t), decl.join("; ")]));
    });
    // A keyframe she changed, in the page's @keyframes: every animation using them changes with it.
    // A @keyframes she added from the generic list: new to the code, so it's listed whole (her edits included), when
    // a layer still runs it.
    const runs = namesRun();
    Object.keys(edits.newKeyframes).filter((name) => runs.has(name)).forEach((name) => {
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
    // A comment line (decl null) stands alone, so it doesn't widen the column.
    const width = Math.max.apply(null, lines.filter((l) => l[1] != null).map((l) => l[0].length)) + 2;
    // The header: the page, the window's size (the width picks the breakpoint the edits were seen at), and the
    // page's theme when it has a switch for one.
    return "finetune changes · " + decodeURIComponent(editsPath) + " · " + view.vw + "×" + window.innerHeight + (view.theme ? " · " + view.theme : "") + "\n"
      + lines.map(([sel, decl]) => (decl == null ? sel : sel.padEnd(width) + decl)).join("\n");
  }

  let toastEl = null;
  let toastTimer = 0;
  // Counts toasts, so an edit's toast is closed only while it's still the one showing (see dropStepToast).
  let toastSeq = 0;
  // action: a button on the toast ({ label, run }); ms: how long it stays (1.8 seconds unless said). It fades out.
  function toast(text, action, ms, center) {
    toastSeq++;
    if (!toastEl) {
      toastEl = el("div", "ft-toast");
      document.body.appendChild(toastEl);
    }
    // Words, or a node (the hotkey note, with its key coloured).
    if (typeof text === "string") toastEl.textContent = text;
    else toastEl.replaceChildren(text);
    toastEl.classList.toggle("is-center", !!center);
    // One action (Undo) or several, each the same plain button (neither stands out), then the close. "close" is
    // the close alone, for a note she may want to read longer than the toast stays.
    const acts = !action || action === "close" ? [] : Array.isArray(action) ? action : [action];
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
      actions.append(...acts.map((a) => button("ft-toast-btn", a.label, () => {
        clearTimeout(toastTimer);
        toastEl.hidden = true;
        a.run();
      })), close);
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
    // The rotation zones outside the corners first, so the corners' own targets sit over them; then the edge handles,
    // so the corners sit over their ends.
    const rotZones = ["nw", "ne", "sw", "se"].map((c) => selBox.appendChild(el("span", "ft-rot ft-rot-" + c)));
    ["ft-n", "ft-s", "ft-e", "ft-w"].forEach((c) => selBox.appendChild(el("span", "ft-handle ft-edge " + c)));
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
    // The columns of the layout guide picked with a click on the page inside one (see columnAt), one box each.
    const colBoxes = [];
    hoverBox.hidden = true;
    selBox.hidden = true;
    marquee.hidden = true;
    document.body.append(hoverBox, selBox, marquee);
    // One layer, or two or more: a group, or what shift-clicks gathered.
    let selected = null;
    let many = [];
    let group = null;
    // Columns of the layout guide, { cols: [i, ...] } in order, on their own or with the layers (Design, while a
    // columns layout shows).
    let column = null;
    // The group she double-clicked into: inside it, its layers select one at a time.
    let inside = null;
    let editing = null;
    let before = "";
    // While layers are being dragged, hover outlines stay off.
    let moving = false;

    const active = () => !!inspector && !inspector.hidden;
    // The page itself (the body, or the wrapper that paints the page) is the canvas, as in Figma: clicking
    // it selects nothing and shows the Page panel. So is a wrapper that only holds the page (as big as the
    // window) and draws nothing of its own, an app's #root, so its empty space draws a marquee.
    const windowSized = (r) => r.width >= document.documentElement.clientWidth - 1 && r.height >= window.innerHeight - 1;
    const holdsPage = (t) => windowSized(t.getBoundingClientRect()) && drawsNothing(t);
    const pickable = (t) => (t && t !== document.body && t !== document.documentElement && t !== pageEl && !isUi(t) && !holdsPage(t) ? t : null);
    // A press on the panels over a layer they cover (on their empty space or words, not a control) says, once a visit,
    // how to get at it: E hides the panels and editing goes on, T sees through them (her ask, 2026-10-19).
    const PANEL_CONTROL = "button, a, input, select, textarea, label, summary, [contenteditable], [tabindex], [role=button], "
      + "[role=checkbox], .ft-kind-link, .ft-head, .ft-scroll-thumb, .ft-slide, .ft-knob, .ft-sv, .ft-chip";
    let coverTipShown = false;
    document.addEventListener("pointerdown", (e) => {
      const t = e.target;
      if (coverTipShown || e.button !== 0 || !active() || !t || !t.closest) return;
      if (!t.closest(".ft-inspector, .ft-toolbar, .ft-ui, .ft-panel") || t.closest(PANEL_CONTROL)) return;
      if (!pickable(document.elementsFromPoint(e.clientX, e.clientY).find((u) => !isUi(u)))) return;
      coverTipShown = true;
      const key = (k) => el("span", "ft-toast-key", k);
      const words = el("span");
      words.append("Press ", key("E"), " to hide the panels and keep editing, or ", key("T"), " to see through them");
      toast(words, null, 5000);
    }, true);

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
      if (windowSized(r)) return true;
      return invisible(e, r);
    };
    // Layers that draw nothing of their own are passed through too, so code full of wrappers doesn't cost a click per
    // wrapper: a box with no size (one that only holds positioned layers), or one the same size and place as its only
    // child. Anything with a look of its own stays a layer (a fill, border, shadow, outline, filter, blend, opacity,
    // transform, clip or mask, rounded corners that clip, a ::before / ::after, its own words), as do images,
    // vectors, controls, links and components (their outline and name are how she finds them).
    const OWN_LOOK = /^(A|BUTTON|IMG|PICTURE|VIDEO|CANVAS|IFRAME|INPUT|TEXTAREA|SELECT|LABEL)$/;
    const noPseudo = (e, which) => {
      const c = getComputedStyle(e, which).content;
      return c === "none" || c === "normal";
    };
    // A rounded clip (overflow other than visible with a corner radius) rounds what it holds: a look of its own.
    const roundClip = (cs) => (cs.overflowX !== "visible" || cs.overflowY !== "visible")
      && ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].some((c) => parseFloat(cs["border" + c + "Radius"]) > 0);
    function drawsNothing(e) {
      if (!(e instanceof HTMLElement) || OWN_LOOK.test(e.tagName) || hasText(e) || componentOf(e)) return false;
      const cs = getComputedStyle(e);
      return cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.backgroundImage === "none"
        && ["Top", "Right", "Bottom", "Left"].every((side) => cs["border" + side + "Style"] === "none" || parseFloat(cs["border" + side + "Width"]) === 0)
        && cs.boxShadow === "none" && cs.outlineStyle === "none" && cs.filter === "none"
        && (cs.backdropFilter || cs.webkitBackdropFilter || "none") === "none"
        && cs.opacity === "1" && cs.mixBlendMode === "normal" && cs.transform === "none"
        && cs.translate === "none" && cs.rotate === "none" && cs.scale === "none"
        && cs.clipPath === "none" && (cs.maskImage || cs.webkitMaskImage || "none") === "none" && !roundClip(cs)
        && noPseudo(e, "::before") && noPseudo(e, "::after");
    }
    function invisible(e, r) {
      if (!drawsNothing(e)) return false;
      if (r.width < 1 || r.height < 1) return true;
      const shown = Array.from(e.children).filter((c) => {
        const cr = c.getBoundingClientRect();
        return cr.width >= 1 && cr.height >= 1;
      });
      if (shown.length !== 1) return false;
      const c = shown[0].getBoundingClientRect();
      return Math.abs(c.left - r.left) < 1 && Math.abs(c.top - r.top) < 1 && Math.abs(c.width - r.width) < 1 && Math.abs(c.height - r.height) < 1;
    }
    // The layers from the page down to t, outermost first, wrappers that only hold the page (or draw nothing) left out.
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

    // list: the one layer the box outlines; a layer tipped in 3D (quadOf) gets its own slanted outline inside the box.
    function frameRect(b, r, list) {
      b.style.left = r.left + "px";
      b.style.top = r.top + "px";
      b.style.width = r.width + "px";
      b.style.height = r.height + "px";
      const svg = b.querySelector(":scope > .ft-quad");
      if (!svg) return;
      const q = list && list.length === 1 ? quadOf(list[0]) : null;
      b.classList.toggle("is-quad", !!q);
      b.classList.toggle("is-away", !!q && facingAway(list[0]));
      if (!q || !q.pts.length) return;
      svg.setAttribute("width", Math.max(1, r.width));
      svg.setAttribute("height", Math.max(1, r.height));
      svg.firstChild.setAttribute("points", q.pts.map(([x, y]) => (x - r.left).toFixed(2) + "," + (y - r.top).toFixed(2)).join(" "));
    }
    [hoverBox, selBox].forEach((b) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "ft-quad");
      svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "polygon"));
      b.prepend(svg);
    });

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
      // In Scale every layer it's on has handles (several share the box around them).
      const scaling = !!scaleMode && !motion();
      selBox.classList.toggle("no-resize", motion() || !(scaling ? current().length : selected && resizable(selected)));
      // A turned layer still turns by its corners (it only loses its resize handles), so a turn can be dragged again.
      selBox.classList.toggle("can-rotate", !motion() && !scaling && !editing && !!selected);
      if (selected) {
        const sr = selected.getBoundingClientRect();
        selBox.classList.toggle("is-small", Math.min(sr.width, sr.height) < 30);
        frameRect(selBox, sr, [selected]);
        placeTurnZones(selected, sr);
        // The size before any rotation, as Figma shows it: the same numbers as Dimensions (a vector's geometry).
        const { w, h } = sizeOf(selected);
        sizeLabel.textContent = Math.round(w) + " × " + Math.round(h);
      } else if (many.length) {
        // A group with auto layout is its frame, padding included, so the box and its size match the bake's element.
        const u = boxOf(many, group);
        selBox.classList.toggle("is-small", Math.min(u.width, u.height) < 30);
        frameRect(selBox, u);
        sizeLabel.textContent = Math.round(u.width) + " × " + Math.round(u.height);
      }
      // Scale's size reads as its fields do, to two decimals (97 × 134.18).
      if (scaling && current().length) sizeLabel.textContent = fmt2(scaleMode.base.w * scaleMode.f) + " × " + fmt2(scaleMode.base.h * scaleMode.f);
      // Motion's selection has no label: the size is Design's.
      sizeLabel.hidden = motion();
      const comp = !motion() && selected ? componentOf(selected) : "";
      selBox.classList.toggle("is-comp", !!comp);
      compLabel.hidden = !comp;
      if (comp) compName.textContent = comp;
      placeColumn();
    }
    // Each rotate zone sits just outside its corner as drawn. On a turned layer that's the turned corner, not the
    // corner of the box around it, as Figma's zones follow the layer: the zone goes 10px out along both of the
    // corner's sides, turned with it. (A turned rectangle's bounding box shares its middle, whatever the origin.)
    // Unturned, the stylesheet places them.
    function placeTurnZones(t, sr) {
      const deg = t && !motion() ? turnOf(t) : 0;
      if (!deg) return rotZones.forEach((z) => { if (z.style.cssText) z.style.cssText = ""; delete z.dataset.glyph; });
      const s = sizeOf(t);
      const k = t instanceof HTMLElement ? scaleAbove(t) : [1, 1];
      const a = (deg * Math.PI) / 180;
      ["nw", "ne", "sw", "se"].forEach((c, i) => {
        const lx = (c[1] === "e" ? 1 : -1) * ((s.w * k[0]) / 2 + 10);
        const ly = (c[0] === "s" ? 1 : -1) * ((s.h * k[1]) / 2 + 10);
        const x = sr.width / 2 + lx * Math.cos(a) - ly * Math.sin(a);
        const y = sr.height / 2 + lx * Math.sin(a) + ly * Math.cos(a);
        rotZones[i].style.cssText = "left:" + (x - 10) + "px;top:" + (y - 10) + "px;right:auto;bottom:auto;rotate:" + deg + "deg";
        // The glyph goes by where the corner now sits on screen, not by its name: turned past 45° the nw corner is
        // no longer top left, and its own glyph would bend into the selection instead of away from it.
        rotZones[i].dataset.glyph = (y < sr.height / 2 ? "n" : "s") + (x < sr.width / 2 ? "w" : "e");
      });
    }
    function placeColumn() {
      const cols = column ? column.cols : [];
      while (colBoxes.length < cols.length) {
        const b = el("div", "ft-sel-box ft-col-box");
        document.body.appendChild(b);
        colBoxes.push(b);
      }
      colBoxes.forEach((b, k) => {
        const r = k < cols.length && columnRect(cols[k]);
        // Hide UI keeps the picked columns but not their boxes (sync).
        b.hidden = !r || minimized;
        if (r) frameRect(b, r);
      });
    }
    // The outermost layer under the pointer that doesn't span the whole guide that shows (see shift-click). Inside a
    // layer she drilled into, the search starts below it, so the click stays at her level as levelPick's would.
    function fitsColumns(target) {
      const g = shownGuide();
      const deepest = pickable(target);
      if (!g || !deepest) return null;
      const chain = levelOf(deepest);
      const i = scope ? chain.indexOf(scope) : -1;
      return chain.slice(i + 1).find((e) => !spansGuide(e.getBoundingClientRect(), g)) || null;
    }
    // The column of the layout that shows under x, as { i }: Design only, and only on a column, not a gutter.
    function columnAt(x) {
      const g = motion() ? null : shownGuide();
      if (!g) return null;
      const { starts, ends } = guideEdges(g);
      const i = starts.findIndex((st, k) => x >= st && x <= ends[k]);
      return i < 0 ? null : { i };
    }
    const sameColumn = (a, b) => (a ? a.cols.join() : "") === (b ? b.cols.join() : "");
    // Column i added to the columns picked, or taken back out (none left: no columns).
    function toggleColumn(i) {
      const cols = column ? column.cols.slice() : [];
      const k = cols.indexOf(i);
      if (k < 0) cols.push(i);
      else cols.splice(k, 1);
      return cols.length ? { cols: cols.sort((a, b) => a - b) } : null;
    }
    // The columns picked that the layout still has.
    const liveColumns = () => {
      const cols = column ? column.cols.filter((i) => columnRect(i)) : [];
      return cols.length ? { cols } : null;
    };
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
    // Anything else that moves the selected layers (a sibling growing, an image loading, an ancestor animating, a
    // script): their boxes are read each frame while something is selected, so the selection stays on them, and the
    // panel's numbers catch up when they land.
    let watching = 0;
    let watched = "";
    function watch() {
      if (watching) return;
      let landed = true;
      const tick = () => {
        if (!active() || !current().length) {
          watching = 0;
          watched = "";
          return;
        }
        const now = current().map((t) => {
          const r = t.getBoundingClientRect();
          return [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 10)).join();
        }).join(";");
        if (now !== watched) {
          if (watched) {
            place();
            landed = false;
          }
          watched = now;
        } else if (!landed) {
          landed = true;
          refreshPanel();
        }
        watching = requestAnimationFrame(tick);
      };
      watching = requestAnimationFrame(tick);
    }

    function show(one, list, g, col) {
      forgetInstances();
      sourceCache = new WeakMap();
      stopEditing();
      current().forEach((t) => sizes.unobserve(t));
      selected = one;
      many = list;
      group = g;
      column = col || null;
      const now = current();
      selBox.hidden = !now.length;
      hoverBox.hidden = true;
      now.forEach((t) => sizes.observe(t));
      if (now.length) place();
      else placeColumn();
      if (busy()) follow();
      watched = "";
      if (now.length) watch();
      showInPanel(selected || (many.length ? many : null), group ? "group" : "selected", column);
    }
    // Layers, and a column with them when she's picked one: a group if the layers are exactly one.
    function choose(list, col) {
      if (list.length === 1) return show(list[0], [], null, col);
      const sels = list.map(keyOf);
      const g = list.length ? edits.groups.find((gr) => gr.length === sels.length && gr.every((x) => sels.includes(x))) : null;
      show(null, list, g || null, col);
    }
    // The layout changed (hidden, removed, fewer columns): a picked column that's gone is let go.
    function guidesChanged() {
      if (!column) return;
      const live = liveColumns();
      if (sameColumn(live, column)) placeColumn();
      else choose(current(), live);
    }
    // After an undo or redo: the same layers, redrawn, as a group if they still are one.
    function reshow() {
      inside = null;
      const one = selected;
      const list = many.slice();
      const col = liveColumns();
      if (one) show(one, [], null, col);
      else if (list.length) {
        const sels = list.map(keyOf);
        show(null, list, edits.groups.find((g) => g.length === sels.length && g.every((x) => sels.includes(x))) || null, col);
      } else if (col) show(null, [], null, col);
      else showInPanel(null);
    }
    finishTyping = () => stopEditing();

    function select(t) {
      if (t === selected && !many.length && !column) return;
      show(t, [], null);
    }
    function selectMany(list, g) {
      if (list.length < 2) return select(list[0] || null);
      show(null, list, g || null);
    }

    // A set of layers as the selection: a group if it's exactly one, else "N selected" (col keeps a picked column
    // with them). No change, no redraw.
    function pick(next, col) {
      const now = current();
      if (sameColumn(col, column) && next.length === now.length && next.every((t) => now.includes(t))) return;
      if (col) return choose(next, col);
      const sels = next.map(keyOf);
      const g = edits.groups.find((gr) => gr.length === sels.length && gr.every((s) => sels.includes(s)));
      selectMany(next, g);
    }

    // The layers one level inside a layer (or the page, document.body), in the code's order: its outermost ones that
    // aren't passed through, the level a click picks at once she's inside it.
    function levelChildren(parent) {
      const layers = [];
      const walk = (p) => {
        for (const e of p.children) {
          if (isUi(e) || e.closest(".ft-guides, .ft-marks")) continue;
          const cs = getComputedStyle(e);
          if (cs.display === "none") continue;
          const shows = cs.visibility !== "hidden";
          if (shows && !passThrough(e)) {
            if (pickable(e)) layers.push(e);
          } else if (e.children.length) walk(e);
          else if (shows && pickable(e)) layers.push(e);
        }
      };
      walk(parent);
      return layers;
    }
    // What a marquee can pick: the layers a click picks on the page (the outermost ones that aren't passed through),
    // a group as one, so a drag and a click agree.
    function marqueeUnits() {
      return unitsOf(levelChildren(document.body));
    }
    function unitsOf(layers) {
      const units = [];
      const taken = new Set();
      layers.forEach((t) => {
        if (taken.has(t)) return;
        const unit = unitOf(t);
        const list = unit ? unit.list : [t];
        list.forEach((m) => taken.add(m));
        units.push(list);
      });
      return units;
    }

    // Figma's marquee: a drag that starts on the page draws a box and selects every layer it touches
    // (a group as one), live; shift keeps what was selected. A click without a drag clears it.
    function startMarquee(e) {
      const x0 = e.clientX;
      const y0 = e.clientY;
      const base = e.shiftKey ? current().slice() : [];
      const baseCol = e.shiftKey ? column : null;
      let dragging = false;
      let units = null;
      const move = (ev) => {
        if (!dragging && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 3) return;
        if (!dragging) {
          dragging = true;
          inside = null;
          hoverBox.hidden = true;
          units = marqueeUnits();
        }
        const r = { left: Math.min(x0, ev.clientX), top: Math.min(y0, ev.clientY), right: Math.max(x0, ev.clientX), bottom: Math.max(y0, ev.clientY) };
        frameRect(marquee, { left: r.left, top: r.top, width: r.right - r.left, height: r.bottom - r.top });
        marquee.hidden = false;
        const touches = (b) => b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top;
        const hit = units.filter((u) => u.some((t) => !facingAway(t) && touches(t.getBoundingClientRect()))).flat();
        pick(base.concat(hit.filter((h) => !base.includes(h))), baseCol);
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        marquee.hidden = true;
        if (dragging) return;
        // A click on the page: inside a column of the layout that shows, that column (Shift adds it to the columns
        // and layers picked, or takes it back off); anywhere else, nothing.
        const at = columnAt(x0);
        if (e.shiftKey) {
          if (at) choose(current(), toggleColumn(at.i));
        } else if (at) choose([], { cols: [at.i] });
        else select(null);
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
          // From the translate she sees, the code's included, so a layer the code already moves doesn't jump.
          starts = list.map(trNow);
        }
        const dx = ev.clientX - x0;
        const dy = ev.clientY - y0;
        list.forEach((t, i) => {
          const [lx, ly] = localDelta(t, dx, dy);
          const s0 = starts[i];
          writeTranslate(t, [{ px: s0[0].px + lx, pct: s0[0].pct }, { px: s0[1].px + ly, pct: s0[1].pct }, s0[2]]);
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
        // A layer a group's auto layout places goes back to its place, as Figma's can't be moved freely. A whole
        // group moved as one is already in place, so nothing moves.
        reflowFor(list);
        moved();
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // Scale's drag, as Figma's K: a handle scales the layer (or the layers) and everything inside around the opposite
    // point, which becomes the panel's anchor; a corner follows whichever axis the pointer has pulled further, an edge
    // its own. The axis that leads lands on a whole px (97 x 134.18). The drag is one undo step.
    function startScaleDrag(e, handle) {
      const list = current();
      if (!scaleMode || !list.length) return;
      const name = ["nw", "ne", "sw", "se", "n", "s", "e", "w"].find((c) => handle.classList.contains("ft-" + c));
      const hx = /w/.test(name) ? 0 : /e/.test(name) ? 1 : 0.5;
      const hy = /n/.test(name) ? 0 : /s/.test(name) ? 1 : 0.5;
      const a = [1 - hx, 1 - hy];
      const from = scaleFrom(a);
      const m = scaleMode;
      const r0 = from.r;
      // The handle's own point, so the press itself is 1x wherever on the handle it lands.
      const hp = { x: r0.left + r0.width * hx, y: r0.top + r0.height * hy };
      const x0 = e.clientX;
      const y0 = e.clientY;
      const least = scaleLeast(m);
      let started = false;
      const move = (ev) => {
        if (!started) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 2) return;
          started = moving = true;
          hoverBox.hidden = true;
          history.quiet++;
          list.forEach((t) => still(t, true));
          m.anchor = a;
        }
        if (scaleMode !== m) return;
        const kx = hx === 0.5 || !r0.width ? null : (hx > a[0] ? 1 : -1) * (hp.x + ev.clientX - x0 - from.A.x) / r0.width;
        const ky = hy === 0.5 || !r0.height ? null : (hy > a[1] ? 1 : -1) * (hp.y + ev.clientY - y0 - from.A.y) / r0.height;
        const byW = ky == null || (kx != null && kx >= ky);
        const k = byW ? kx : ky;
        const f = byW ? Math.round(m.base.w * from.f * k) / m.base.w : Math.round(m.base.h * from.f * k) / m.base.h;
        applyScale(Math.max(least, f), from);
        moved();
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        if (!started) return;
        moving = false;
        flush();
        list.forEach((t) => still(t, false));
        history.quiet--;
        noteChange();
        // In a group's auto layout the others make room (or close up) for the new size.
        reflowFor(list);
        if (scaleMode) scaleSeal(scaleMode);
        moved();
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // Figma's resize: drag a corner or a side of the selected layer. The opposite corner or side stays put (in auto
    // layout the layout places it). A side sizes its own axis only and a corner both, freely, as resizeLayer sizes
    // them: the lock (Constrain proportions) or Shift on a corner keeps the proportions. The new size is written as
    // the code would (its width and height, or a vector's geometry). The drag is one undo step.
    function startResize(e, handle) {
      if (scaleMode) return startScaleDrag(e, handle);
      const t = selected;
      if (!t || !resizable(t)) return;
      const name = ["nw", "ne", "sw", "se", "n", "s", "e", "w"].find((c) => handle.classList.contains("ft-" + c));
      const west = /w/.test(name);
      const north = /n/.test(name);
      const sizesW = /[we]/.test(name);
      const sizesH = /[ns]/.test(name);
      const x0 = e.clientX;
      const y0 = e.clientY;
      const start = sizeOf(t);
      const exact = exactSize(t);
      // What's inside, as it was, so a wider or narrower layer can wrap it (resizeLayer).
      const fit = fitBefore(t);
      // An element's size is CSS px, which a scaled page around it draws bigger or smaller, and so does a scale on the
      // layer itself (transform: scale(0.5), or scale: 0.5): the corner follows the pointer on screen. The layer's own
      // scale is read off its transform and scale (a turn or a skew in them can't be split out, so it's left at 1).
      // Its translate sits outside both, so the anchor nudge below needs only the scale above.
      const k = t instanceof HTMLElement ? scaleAbove(t) : [1, 1];
      if (t instanceof HTMLElement) {
        const cs = getComputedStyle(t);
        const m = /^matrix\(([^,]+), ([^,]+), ([^,]+), ([^,]+),/.exec(cs.transform);
        const sc = cs.scale === "none" ? [1, 1] : cs.scale.split(" ").map(parseFloat);
        if (sc.length === 1) sc.push(sc[0]);
        if (m && !+m[2] && !+m[3] && +m[1] > 0 && +m[4] > 0) { k[0] *= +m[1]; k[1] *= +m[4]; }
        if (sc[0] > 0 && sc[1] > 0) { k[0] *= sc[0]; k[1] *= sc[1]; }
      }
      const r0 = t.getBoundingClientRect();
      const anchor = { x: west ? r0.right : r0.left, y: north ? r0.bottom : r0.top };
      // In auto layout (a flex or grid in the code) the layout places it, as in Figma: only its size changes.
      const lp0 = layoutParentOf(t);
      const placedByLayout = !!(lp0 || {}).inFlow;
      let started = false;
      // The edits as they were, for a drag that ends where it started (up).
      let snap0 = null;
      const move = (ev) => {
        if (!started) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 2) return;
          started = moving = true;
          hoverBox.hidden = true;
          history.quiet++;
          still(t, true);
          snap0 = snapshot();
          // A dragged axis is Fixed, as in Figma: inside auto layout, grow, shrink and stretch let go once here, so
          // the size the drag writes holds.
          if (lp0) ["w", "h"].forEach((axis) => { if (axis === "w" ? sizesW : sizesH) fixAxis(t, axis, null); });
        }
        let w = sizesW ? Math.max(1, exact.w + ((west ? -1 : 1) * (ev.clientX - x0)) / k[0]) : null;
        let h = sizesH ? Math.max(1, exact.h + ((north ? -1 : 1) * (ev.clientY - y0)) / k[1]) : null;
        if (sizesW && sizesH && (ev.shiftKey || ratioLocked(t))) {
          const f = Math.max(w / exact.w, h / exact.h);
          w = exact.w * f;
          h = exact.h * f;
        }
        // Whole px, as Figma's drag, but back within half a px of where it started is the size it started at (a
        // 389.25 stays 389.25), so a drag that comes back changes nothing.
        const px = (v, e0) => (v == null ? null : Math.abs(v - e0) < 0.5 ? e0 : Math.round(v));
        resizeLayer(t, px(w, exact.w), px(h, exact.h), { from: start, exact, fit, fixed: true, locked: ratioLocked(t) });
        const r = t.getBoundingClientRect();
        const dx = anchor.x - (west ? r.right : r.left);
        const dy = anchor.y - (north ? r.bottom : r.top);
        if (!placedByLayout && (Math.abs(dx) >= 0.05 || Math.abs(dy) >= 0.05)) nudge(t, dx, dy);
        moved();
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        if (!started) return;
        moving = false;
        flush();
        // Back where it started (size and place): the drag's writes (a Fixed, a kept axis, an align-self) would
        // change nothing on the page but still show in Copy, so the edits go back to how they were.
        const e1 = exactSize(t);
        const r1 = t.getBoundingClientRect();
        if (snap0 && Math.abs(e1.w - exact.w) < 0.05 && Math.abs(e1.h - exact.h) < 0.05 && Math.abs(r1.left - r0.left) < 0.05 && Math.abs(r1.top - r0.top) < 0.05) {
          applyEdits(JSON.parse(snap0));
        }
        still(t, false);
        history.quiet--;
        noteChange();
        // In a group's auto layout the others make room (or close up) for the new size.
        reflowFor([t]);
        moved();
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // Figma's rotation: drag in the zone just outside a corner and the layer turns about its pivot, by the angle the
    // pointer sweeps round it. It writes what the Rotation field writes (setTurn), so Copy and the bake read the same.
    // Shift snaps the turn to 15° steps. The drag is one undo step.
    function startRotate(e, zone) {
      const t = selected;
      if (!t || editing || motion() || scaleMode) return;
      // The glyph the zone showed on hover (its screen corner on a turned layer), so the drag keeps the same one.
      const corner = zone.dataset.glyph || ["nw", "ne", "sw", "se"].find((c) => zone.classList.contains("ft-rot-" + c));
      const r0 = t.getBoundingClientRect();
      // A turn about the middle leaves the middle of the box on screen where it is, so it's read once.
      const c = { x: r0.left + r0.width / 2, y: r0.top + r0.height / 2 };
      // CSS turns a layer about its transform-origin, which the code may have moved off the middle (0 0, a corner):
      // there the angle is read about that point instead, so the layer turns with the pointer rather than swinging
      // away from it. The origin is where the middle would be, less the middle's offset from it, turned.
      if (t instanceof HTMLElement) {
        const s = sizeOf(t);
        // Inline text (a span) has no box to put an origin on, so its computed one reads 0px 0px; the first turn makes
        // it inline-block (boxed), where the code's origin applies, the middle unless the code says otherwise. So it's
        // read as the code gives it (a % against the box the turn will have), else the middle.
        const o = getComputedStyle(t).display === "inline"
          ? codeValue(t, "transform-origin").split(" ").slice(0, 2).map((v, i) => (/%$/.test(v) ? (parseFloat(v) / 100) * (i ? s.h : s.w) : /px$/.test(v) ? parseFloat(v) : i ? s.h / 2 : s.w / 2))
          : getComputedStyle(t).transformOrigin.split(" ").map(parseFloat);
        if (o.length < 2) o.splice(0, 2, s.w / 2, s.h / 2);
        const k = scaleAbove(t);
        const dx = (s.w / 2 - (o[0] || 0)) * k[0];
        const dy = (s.h / 2 - (o[1] || 0)) * k[1];
        if (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5) {
          const a = (turnOf(t) * Math.PI) / 180;
          c.x -= dx * Math.cos(a) - dy * Math.sin(a);
          c.y -= dx * Math.sin(a) + dy * Math.cos(a);
        }
      }
      const a0 = Math.atan2(e.clientY - c.y, e.clientX - c.x);
      // From the turn it rests at: a turn a :hover rule adds isn't the code's.
      const turn0 = turnOf(t, true);
      const x0 = e.clientX;
      const y0 = e.clientY;
      const html = document.documentElement;
      let started = false;
      const move = (ev) => {
        if (!started) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 2) return;
          started = moving = true;
          hoverBox.hidden = true;
          history.quiet++;
          still(t, true);
          html.classList.add("ft-turning-" + corner);
        }
        // Screen y runs down, so a growing angle is clockwise, which is positive in CSS and in the Rotation field.
        let deg = turn0 + ((Math.atan2(ev.clientY - c.y, ev.clientX - c.x) - a0) * 180) / Math.PI;
        deg = ev.shiftKey ? Math.round(deg / 15) * 15 : Math.round(deg * 10) / 10;
        setTurn(t, deg);
        moved();
      };
      const up = () => {
        document.removeEventListener("mousemove", move, true);
        document.removeEventListener("mouseup", up, true);
        if (!started) return;
        moving = false;
        html.classList.remove("ft-turning-" + corner);
        flush();
        still(t, false);
        history.quiet--;
        noteChange();
        moved();
      };
      document.addEventListener("mousemove", move, true);
      document.addEventListener("mouseup", up, true);
    }

    // ⌘G: the selected layers become one group (a layer in one group at a time, so grouping takes
    // it out of any other). ⌘⇧G: the group goes, its layers stay selected.
    // silent: ⇧A groups the layers first and says so in its own toast.
    function groupSelection(silent) {
      const list = current();
      if (list.length < 2) return toast("Select two or more layers to group.");
      // The bake wraps a group in one new element, which can't hold a layer and the layer around it.
      if (list.some((t) => list.some((o) => o !== t && o.contains(t)))) return toast("One of these layers holds another, so they can't be grouped.");
      const sels = list.map(keyOf);
      edits.groups = edits.groups.map((g) => g.filter((s) => !sels.includes(s))).filter((g) => g.length > 1);
      edits.groups.push(sels);
      // A group that lost layers to this one is a different group now, so its auto layout goes.
      edits.autoLayout = edits.autoLayout.filter((l) => edits.groups.some((g) => sameSet(g, l.sels)));
      dropSpans();
      inside = null;
      show(null, list, sels);
      noteChange();
      if (!silent) actionToast("Grouped " + list.length + " layers");
    }
    // A ⌘G group: its auto layout goes with it. The layers keep their moves as plain ones, so nothing moves, as in
    // Figma. A layer that holds others in the code (the panel's "Group") ungroups as its own kind, below.
    function ungroup() {
      if (!group) {
        const t = selected;
        if (t instanceof HTMLElement && t !== document.body && t !== pageEl && !hasText(t) && Array.from(t.children).some((c) => !isUi(c))) return ungroupContainer(t);
        return toast("Select a group to ungroup.");
      }
      const L = layoutOf(group);
      edits.autoLayout = edits.autoLayout.filter((l) => l !== L);
      edits.groups = edits.groups.filter((g) => g !== group);
      dropSpans();
      const list = many.slice();
      show(null, list, null);
      noteChange();
      actionToast("Ungrouped " + list.length + " layers");
    }
    // Figma's ungroup on a layer that holds others in the code (a card's <div>): its box goes and its layers stay
    // where they are on screen. Live, the wrapper only stops drawing a box (display: contents; taking it out of the
    // DOM breaks a React page), and a layer that moved or resized when the box went is put back with ordinary
    // edits, measured before and after. Copy lists the wrapper as "ungroup" for the bake to take out of the code.
    function ungroupContainer(t) {
      // A link's box is what its layers are clicked through, so it stays; nothing changes.
      if (t.matches("a[href], area[href], [role='link']")) return toast("This group is a link and cannot be ungrouped here.", "close", 6000);
      // Its layers, with any it holds through a container already ungrouped (those draw, the container doesn't).
      const kids = layersOf(t);
      // What lays it out: the nearest holder that still draws a box. Its other layers can move too when the box goes
      // (in a grid or a flex row the layers take cells or slots of their own and push the rest along; in plain flow
      // the wrapper's padding goes), and so can its size, which moves what comes after it on the page.
      let p = t.parentElement;
      while (p && p.hasAttribute("data-ft-ungrouped")) p = p.parentElement;
      const around = p ? layersOf(p).filter((c) => c !== t && !t.contains(c)) : [];
      const pin = p && p !== document.body && p !== document.documentElement ? p : null;
      const measure = (list) => list.map((c) => ({ c, r: c.getBoundingClientRect() })).filter(({ r }) => r.width || r.height);
      const before = measure(kids);
      const others = measure(around);
      const box = pin && pin.getBoundingClientRect();
      // No transitions while the box goes, so what's measured after is where the layers land. All in one task, so a
      // running animation can't move anything between the two readings.
      const moving = kids.concat(around, pin ? [pin] : []);
      moving.forEach((c) => still(c, true));
      record(t, (entry) => { entry.ungrouped = true; });
      t.setAttribute("data-ft-ungrouped", "");
      flush();
      // A size it had before is kept as its own: the wrapper gave it (a width: 100%, a stretch), or a grid track or
      // flex share changed. One that was drawn and now reads 0 (an empty stretched box) takes its measured size,
      // since there's nothing to scale from. Fixed, as Figma's: in a flex row a px width alone still shrinks to fit.
      const keepSize = (c, r) => {
        const a = c.getBoundingClientRect();
        const now = exactSize(c);
        const w = Math.abs(a.width - r.width) > 0.25 ? (a.width ? now.w * r.width / a.width : r.width) : null;
        const h = Math.abs(a.height - r.height) > 0.25 ? (a.height ? now.h * r.height / a.height : r.height) : null;
        if (w != null) fixAxis(c, "w", w);
        if (h != null) fixAxis(c, "h", h);
      };
      // The holder first: its size sets the grid's tracks and the space the rest share, and pinned back it keeps
      // the page after it where it was.
      if (pin) keepSize(pin, box);
      flush();
      before.concat(others).forEach(({ c, r }) => keepSize(c, r));
      flush();
      // Twice, so a move that reflowed text or rounded to a tenth of a px is caught.
      for (let pass = 0; pass < 2; pass++) before.concat(others).forEach(({ c, r }) => {
        const a = c.getBoundingClientRect();
        if (Math.abs(r.left - a.left) < 0.05 && Math.abs(r.top - a.top) < 0.05) return;
        nudge(c, r.left - a.left, r.top - a.top);
        flush();
      });
      moving.forEach((c) => still(c, false));
      // The wrapper leaves any ⌘G group it was in, as a deleted layer does.
      const sel = keyOf(t);
      edits.groups = edits.groups.map((g) => g.filter((s) => s !== sel)).filter((g) => g.length > 1);
      edits.autoLayout = edits.autoLayout.filter((l) => edits.groups.some((g) => sameSet(g, l.sels)));
      dropSpans();
      inside = scope = null;
      hoverBox.hidden = true;
      selectMany(before.map(({ c }) => c), null);
      noteChange();
      actionToast("Ungrouped " + before.length + (before.length === 1 ? " layer" : " layers"));
    }

    // Delete / Backspace: the selected layers are hidden and listed as "delete" for the bake to take out of the code.
    // A deleted layer leaves any ⌘G group it was in.
    function deleteSelection() {
      const list = current().slice();
      const sels = list.map(keyOf);
      list.forEach((t) => {
        // A ⌘D copy goes out whole (it was never in the code): its record, its node and the edits inside it (see
        // removeDup); anything else is hidden and listed as "delete".
        if (dupRecord(keyOf(t))) return removeDup(keyOf(t));
        record(t, (entry) => { entry.deleted = true; });
        t.setAttribute("data-ft-deleted", "");
      });
      edits.groups = edits.groups.map((g) => g.filter((s) => !sels.includes(s))).filter((g) => g.length > 1);
      // A group's auto layout keeps going while its group does, and the layers left close up as its flex would.
      const touched = [];
      edits.autoLayout = edits.autoLayout.map((l) => {
        if (!l.sels.some((s) => sels.includes(s))) return l;
        const next = Object.assign({}, l, { sels: l.sels.filter((s) => !sels.includes(s)), ignore: l.ignore.filter((s) => !sels.includes(s)) });
        touched.push(next);
        return next;
      }).filter((l) => edits.groups.some((g) => sameSet(g, l.sels)));
      dropSpans();
      touched.filter((l) => edits.autoLayout.includes(l)).forEach(flowGroup);
      inside = scope = null;
      hoverBox.hidden = true;
      select(null);
      noteChange();
      actionToast("Deleted " + list.length + (list.length === 1 ? " layer" : " layers"));
    }

    // Figma's ⌘D, Duplicate selection: each selected layer gets a live copy right after it, and the copies are
    // selected in place of the originals, ready to move. The live page only gains finetune's own node (the code is
    // never touched, as a delete never takes it apart): the copy is tracked in edits.duplicates under a minted key,
    // saved with Save, and Copy lists it as "duplicate of <selector>" for the bake to copy the element in the code.
    // A ⌘G selection's copies come as a ⌘G group of their own (its auto layout isn't copied).
    function duplicateSelection() {
      const list = current().slice();
      // Outermost only: a copy of a layer already holds copies of what's inside it.
      const tops = list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
      if (history.timer) commitStep();
      const made = tops.map((t) => {
        const of = keyOf(t);
        let n = 1;
        while (edits.elements[of + " /* dup " + n + " */"] || dupRecord(of + " /* dup " + n + " */")) n++;
        const key = of + " /* dup " + n + " */";
        const clone = buildDup(t);
        if (!clone) return null;
        edits.duplicates.push({ of, key });
        edits.elements[key] = { styles: {} };
        refound.set(clone, key);
        applied.set(key, clone);
        return clone;
      }).filter(Boolean);
      if (!made.length) return toast("Nothing to duplicate");
      const wasGroup = group;
      inside = scope = null;
      hoverBox.hidden = true;
      if (made.length === 1) select(made[0]);
      else if (wasGroup) {
        const g = made.map(keyOf).sort();
        edits.groups.push(g);
        selectMany(made, g);
      } else selectMany(made, null);
      noteChange();
      actionToast("Duplicated " + made.length + (made.length === 1 ? " layer" : " layers"));
    }

    // Figma's ⇧A and ⌥⇧A on one layer that holds others. Adding reads the auto layout from how the layers sit
    // (applyInferred), so nothing moves where the gaps are even; uneven gaps are evened out and the toast says so.
    // Where the layers overlap or can't be measured, a toast says why and nothing changes: the Flow row still
    // applies it on purpose. Each is one undo step of its own, apart from whatever came before it.
    const holdsLayers = (t) => !(t instanceof SVGElement) && !hasText(t) && t.children.length > 0;
    function addAutoLayout() {
      const list = current();
      // Several layers, or a ⌘G group, get a group's auto layout.
      if (list.length > 1 || group) return addGroupLayout(list);
      const t = list[0];
      // An SVG's shapes are layers too, but a flex can't arrange them: the same answer as several shapes get.
      if (t instanceof SVGElement) return toast("Auto layout works on HTML layers");
      if (!t || !holdsLayers(t)) return toast("Select a layer with layers inside, or two or more layers");
      if (/flex|grid/.test(getComputedStyle(t).display)) return toast("Already auto layout");
      // Layers placed with position: absolute are out of any flow, so there's nothing for a flow to arrange.
      if (!flowChildren(t).length) {
        return toast(flowChildren(t, true).length ? "Its layers are placed with position: absolute, so auto layout can't arrange them"
          : "Select a layer with layers inside");
      }
      const { inf } = readInferred(t);
      if (inf.reason === "overlap") return toast("Its layers overlap, so auto layout would move them. Pick a Flow to apply it anyway.");
      if (inf.reason) return toast("Some of its layers can't be measured, so auto layout would move them. Pick a Flow to apply it anyway.");
      if (history.timer) commitStep();
      history.quiet++;
      const done = applyInferred(t);
      history.quiet--;
      noteChange();
      reshow();
      actionToast("Added auto layout" + (done.moves ? " · layers moved" : ""));
    }
    // ⇧A on two or more layers or on a group. Plain layers are grouped first, in the same undo step. The layout is
    // read from where they sit, so nothing moves where they already sit evenly in the code's order; where they
    // don't, the toast says what moved. Layers one new element in the code couldn't hold are refused, as they sit.
    function addGroupLayout(list) {
      if (group && layoutOf(group)) return toast("Already auto layout");
      const why = groupLayoutRefusal(list);
      if (why) return toast(why);
      const inf = inferGroup(list);
      // Measured, not only inferred: a margin or a rounded gap can move a layer the reading says stays.
      const was = list.map((t) => t.getBoundingClientRect());
      if (history.timer) commitStep();
      history.quiet++;
      if (!group) groupSelection(true);
      edits.autoLayout.push({ sels: group.slice().sort(), flow: inf.flow, gap: inf.gap, pad: [0, 0, 0, 0], main: "start", cross: inf.cross, ignore: [] });
      flowGroup(layoutOf(group));
      history.quiet--;
      noteChange();
      reshow();
      const moved = inf.moves || list.some((t, i) => {
        const r = t.getBoundingClientRect();
        return Math.abs(r.left - was[i].left) > 0.5 || Math.abs(r.top - was[i].top) > 0.5;
      });
      // The group is only drawn here, so layers after it in the code's flow don't make room for it until the bake
      // wraps it in a real element. Said once, here, since a later Gap or Padding can overlap them.
      const inFlow = list.some((t) => !/^(absolute|fixed)$/.test(getComputedStyle(t).position));
      // A swap says why; it's also the move, so "layers moved" would only repeat it.
      actionToast("Added auto layout" + (inf.reordered ? " · layers follow their order in the code" : moved ? " · layers moved" : "")
        + (inFlow ? " · layers after it make room once it's in the code" : ""));
    }
    // Back to Freeform, as the Flow row's Freeform. Her padding stays: it's the box's, as in Figma.
    // On a group, its auto layout goes and the group stays. Its layers keep their moves as plain ones, so nothing moves.
    function removeAutoLayout() {
      const list = current();
      if (list.length > 1 || group) {
        const L = layoutOf(group);
        if (!L) return toast("No auto layout to remove");
        if (history.timer) commitStep();
        edits.autoLayout = edits.autoLayout.filter((l) => l !== L);
        // The margins it set in a flex container come off, its layers held where they are (dropSpans).
        dropSpans();
        noteChange();
        reshow();
        return actionToast("Removed auto layout");
      }
      const t = list[0];
      if (!t || !holdsLayers(t) || !/flex|grid/.test(getComputedStyle(t).display)) return toast("No auto layout to remove");
      const own = ownValue(t, "display");
      const fromCode = /flex|grid/.test(own);
      if (history.timer) commitStep();
      history.quiet++;
      toFreeform(t);
      history.quiet--;
      noteChange();
      reshow();
      // Figma freezes the layers where they are; here they follow the code's own layout (her call to change). A
      // code grid turned to block stacks its cells in one column, so there the toast just says they moved.
      actionToast("Removed auto layout" + (/grid/.test(own) ? " · layers moved" : fromCode ? " · layers follow the code's layout" : ""));
    }

    // The text node React holds for the words being edited (see oneHeldText): typing can replace it, so it's put back
    // with the new words when editing stops, or React's next update inserts next to a node that's gone.
    let keptText = null;
    // Double-click puts the caret where you clicked; Enter selects all the text.
    function startEditing(t, x, y) {
      // Words React builds from several parts ("Plan {name} pricing") have no one node to retype, and swapping them
      // blanks the page at React's next update: they're changed in the code instead.
      if (codeBuiltWords(t)) return toast("Editing this component would break the code. Change it with Claude Code.");
      // Editing the words leaves Scale, as Scale won't start on words being edited.
      endScale();
      editing = t;
      keptText = oneHeldText(t);
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
      // typeBreak's stand-in stays only where it's a line she can see (after another break); after words it shows
      // nothing, so it goes.
      t.querySelectorAll("br[data-ft-hold]").forEach((br) => {
        br.removeAttribute("data-ft-hold");
        const prev = br.previousSibling;
        if (nothingAfter(br, t) && !(prev && prev.nodeName === "BR")) br.remove();
      });
      // React's own text node goes back, holding the new words.
      const kept = keptText;
      keptText = null;
      if (kept) {
        const words = t.textContent;
        if (t.childNodes.length !== 1 || t.firstChild !== kept) t.replaceChildren(kept);
        if (kept.data !== words) kept.data = words;
      }
      if (t.innerHTML === before) return;
      const o = originalOf(t);
      if (!("html" in o)) o.html = before;
      record(t, (entry) => { entry.html = codeHtml(t); });
      // So a rewrite by the page (an {expression} React updates) is caught and said.
      watchWords(t);
      // New words can change its size, and a group's auto layout makes room for it.
      reflowFor([t]);
    }

    // Enter is a line break that stays one, as in Figma: a <br>, as the code writes it. Left to plaintext-only
    // editing it would be a "\n", which shows only while editing (the text is pre-wrapped then) and folds to a space
    // after. On a <button> it would also press it.
    // Whether nothing but a stand-in <br> follows a node inside the words.
    function nothingAfter(node, root) {
      const after = document.createRange();
      after.setStartAfter(node);
      after.setEnd(root, root.childNodes.length);
      const rest = after.cloneContents();
      rest.querySelectorAll("br[data-ft-hold]").forEach((x) => x.remove());
      return !rest.textContent && !rest.querySelector("*");
    }
    function typeBreak() {
      // A <br> would split the one text node React holds (see keptText).
      if (keptText) return toast("A line break can't go in these words here: the code holds them as one string. Add it in Claude Code.");
      const sel = window.getSelection();
      if (!sel.rangeCount || !editing.contains(sel.anchorNode)) return;
      const r = sel.getRangeAt(0);
      r.deleteContents();
      const br = document.createElement("br");
      r.insertNode(br);
      // A break with nothing after it shows no new line and the caret can't go there, so a second <br> holds the
      // line (as the browser's own editing does) until words follow; stopEditing drops it then.
      if (nothingAfter(br, editing) && !editing.querySelector("br[data-ft-hold]")) {
        const hold = document.createElement("br");
        hold.setAttribute("data-ft-hold", "");
        br.after(hold);
      }
      r.setStartAfter(br);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      place();
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
    // An item picked from the items menu of the group or container selected: a level in, as a double-click goes,
    // so Escape steps back out to it.
    function selectItem(t) {
      const from = selected;
      const g = group;
      selectLayers([t]);
      if (g && groupOf(t) === g) inside = g;
      else if (from && from !== t && from.contains(t)) scope = from;
    }

    // Figma's layer keys and right-click Select layer walk the same levels a click picks at (levelOf). Each leaves
    // the level it lands on as the scope, so a click after it picks at that depth too.
    // The layer at a level that holds every one of these (null: the page).
    function holderOf(list) {
      const chain = levelOf(list[0]);
      for (let i = chain.length - 2; i >= 0; i--) if (list.every((t) => chain[i].contains(t))) return chain[i];
      return null;
    }
    const inCodeOrder = (a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    // One layer as the selection, at its own level: a grouped one by itself, inside its group, as a ⌘-click picks it.
    function selectAtLevel(t) {
      inside = groupOf(t) || null;
      scope = holderOf([t]);
      select(t);
    }
    // Enter: the layers one level in, all of them (a ⌘G group's own layers, one by one). False when there are none.
    function selectChildren() {
      if (group) {
        const list = many.slice();
        inside = group;
        show(null, list, null);
        return true;
      }
      const now = current();
      const kids = now.flatMap(levelChildren).filter((k, i, all) => all.indexOf(k) === i);
      if (!kids.length) return false;
      inside = null;
      scope = holderOf([kids[0]]);
      if (kids.length === 1) selectAtLevel(kids[0]);
      else show(null, kids, null);
      return true;
    }
    // Shift+Enter and \: the layer that holds the selection; from a ⌘G group's layers (one, or the ones Enter
    // selected), the group first, as Escape.
    function selectParent() {
      const now = current();
      if (!now.length) return;
      const g = selected ? groupOf(selected) : !group && inside && now.every((t) => groupOf(t) === inside) ? inside : null;
      if (g) {
        const list = groupMembers(g);
        inside = null;
        scope = holderOf(list);
        return show(null, list, g);
      }
      const p = holderOf(now);
      if (p) selectAtLevel(p);
    }
    // Tab and Shift+Tab: the next or previous layer at the same level, in the code's order, round from the last to the
    // first. One layer or one group only, as in Figma.
    function selectSibling(dir) {
      if (!selected && !group) return;
      const t = selected || many[0];
      const own = selected && inside && groupOf(selected) === inside;
      const p = own ? scope : selected ? holderOf([t]) : holderOf(many);
      // Inside a group, its layers; anywhere else, the layers a click picks at this level, a group as one.
      const units = own ? groupMembers(inside).sort(inCodeOrder).map((m) => [m]) : unitsOf(levelChildren(p || document.body));
      const i = units.findIndex((u) => u.includes(t));
      if (i < 0 || units.length < 2) return;
      const next = units[(i + dir + units.length) % units.length][0];
      if (own) return select(next);
      scope = p;
      inside = null;
      const unit = unitOf(next);
      if (unit) show(null, unit.list, unit.g);
      else select(next);
    }
    // Every layer under the pointer, as Figma's Select layer lists them: in the layers panel's order, a layer above
    // the layers inside it (a level deeper each), and of layers side by side the one painted on top first. Wrappers a
    // click passes through aren't listed.
    function layersAt(x, y) {
      // A layer the page set to pointer-events: none (an overlay, a scrim) is still under the pointer, as Figma
      // lists it, and is one a click can't reach: hit-tested for this one read with every layer taking hits.
      const all = document.createElement("style");
      all.textContent = "body * { pointer-events: auto !important; }";
      document.head.appendChild(all);
      let found;
      try {
        found = document.elementsFromPoint(x, y);
      } finally {
        all.remove();
      }
      const hits = found.filter((h) => !isUi(h) && !h.closest(".ft-guides, .ft-marks") && pickable(h));
      // Each layer's place is its topmost hit's.
      const rank = new Map();
      hits.forEach((h, i) => levelOf(h).forEach((l) => {
        if (l === h && passThrough(h)) return;
        if (!rank.has(l)) rank.set(l, i);
      }));
      const layers = Array.from(rank.keys());
      const holder = (l) => {
        for (let e = l.parentElement; e; e = e.parentElement) if (rank.has(e)) return e;
        return null;
      };
      const rows = [];
      const add = (p, depth) => layers.filter((l) => holder(l) === p).sort((a, b) => rank.get(a) - rank.get(b)).forEach((l) => {
        rows.push({ t: l, depth });
        add(l, depth + 1);
      });
      add(null, 0);
      return rows;
    }
    // Right-click, as Figma's context menu: Select layer lists them; hovering one outlines it, a click selects it.
    // On finetune's own UI, with finetune off, in Motion or in words being edited, the browser's own menu opens.
    document.addEventListener("contextmenu", (e) => {
      if (!active() || motion() || isUi(e.target) || (editing && editing.contains(e.target))) return;
      const rows = layersAt(e.clientX, e.clientY);
      if (!rows.length) return;
      e.preventDefault();
      e.stopPropagation();
      hoverBox.hidden = true;
      openLayerMenu(e.clientX, e.clientY, rows, selectAtLevel, preview);
    }, true);
    // Back in Motion, a selection with motion becomes its whole group; one without stays, ready for one to be added.
    function tabChanged() {
      // Columns are picked in Design only.
      if (motion() && column) choose(current(), null);
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

    // A layer previewed from the panel (a group's items menu): outlined until the menu lets go.
    let previewed = null;
    function preview(t) {
      previewed = t || null;
      hoverBox.hidden = !previewed;
      if (!previewed) return;
      frameRect(hoverBox, unionRect([previewed]), [previewed]);
      hoverBox.classList.toggle("is-comp", !motion() && !!componentOf(previewed));
    }

    // Hover outlines what a click would pick: a group as one box (⌘ goes through it, as a ⌘-click does).
    function hoverAt(target, x, deep, alt) {
      if (previewed) return;
      const live = active() && !editing && !moving && marquee.hidden;
      const moving_ = live && motion() ? motionPick(target) : null;
      // ⌥ outlines the column under the pointer, whatever layer covers it, as an ⌥-click picks it.
      const altCol = live && alt && !isUi(target) ? columnAt(x) : null;
      // Over the one layer selected, a press keeps it (see the press handler), so that's what's outlined: nothing new.
      const keep = live && !motion() && !altCol && !deep && !column && !!selected && selected.contains(target) && !!pickable(target);
      const t = !live || altCol ? null : keep ? selected : moving_ || levelPick(target, deep).pick;
      const unit = moving_ ? { list: motionGroupOf(moving_) } : deep || keep ? null : unitOf(t);
      const over = unit ? unit.list : t ? [t] : [];
      const now = current();
      // On the page itself, a column of the layout that shows outlines as a click would pick it.
      const col = altCol || (live && !t && !isUi(target) ? columnAt(x) : null);
      if (col && !over.length) {
        hovered = null;
        hoverBox.hidden = !!column && column.cols.includes(col.i);
        if (!hoverBox.hidden) frameRect(hoverBox, columnRect(col.i));
        hoverBox.classList.remove("is-comp");
        return;
      }
      hoverBox.hidden = !over.length || over.every((o) => now.includes(o));
      hovered = hoverBox.hidden ? null : { over, g: unit && unit.g };
      if (!hoverBox.hidden) {
        frameRect(hoverBox, hovered.g ? boxOf(over, hovered.g) : unionRect(over), hovered.g ? null : over);
        trackHover();
      }
      hoverBox.classList.toggle("is-comp", !motion() && over.length === 1 && !!componentOf(over[0]));
    }
    // What the hover outline frames, so it stays on a layer that moves under a still pointer (an animation, a
    // script moving it each frame), as the selection box does: its box is read each frame while the outline shows,
    // and the loop ends when the outline hides, finetune is off, or a drag, a marquee or a text edit starts.
    let hovered = null;
    let hoverLoop = 0;
    function trackHover() {
      if (hoverLoop) return;
      let last = "";
      const tick = () => {
        if (!hovered || hoverBox.hidden || previewed || !active() || editing || moving || !marquee.hidden
          || !hovered.over.every((o) => o.isConnected)) {
          hoverLoop = 0;
          return;
        }
        const r = hovered.g ? boxOf(hovered.over, hovered.g) : unionRect(hovered.over);
        const key = [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 10)).join();
        if (key !== last) {
          last = key;
          frameRect(hoverBox, r, hovered.g ? null : hovered.over);
        }
        hoverLoop = requestAnimationFrame(tick);
      };
      hoverLoop = requestAnimationFrame(tick);
    }
    let pointer = null;
    document.addEventListener("pointermove", (e) => {
      pointer = { target: e.target, x: e.clientX };
      hoverAt(e.target, e.clientX, e.metaKey || e.ctrlKey, e.altKey);
    }, { passive: true });
    // Pressing or letting go of ⌘ (Ctrl) or ⌥ (Alt) changes what a click would pick, so the outline follows without a
    // move.
    ["keydown", "keyup"].forEach((type) => document.addEventListener(type, (e) => {
      if (/^(Meta|Control|Alt)$/.test(e.key) && pointer && pointer.target.isConnected) hoverAt(pointer.target, pointer.x, e.metaKey || e.ctrlKey, e.altKey);
    }, true));

    // mousedown, not pointerdown: preventing it is what stops the page starting a text selection.
    document.addEventListener("mousedown", (e) => {
      const handle = e.target && e.target.closest && e.target.closest(".ft-handle");
      if (handle && active() && e.button === 0) {
        e.preventDefault();
        e.stopPropagation();
        return startResize(e, handle);
      }
      const turn = e.target && e.target.closest && e.target.closest(".ft-rot");
      if (turn && active() && e.button === 0) {
        e.preventDefault();
        e.stopPropagation();
        return startRotate(e, turn);
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
        const unit = e.metaKey || e.ctrlKey ? null : unitOf(lp.pick);
        if (unit) return show(null, unit.list, unit.g);
        return select(lp.pick);
      }
      // ⌥-click (Alt) picks the column under the pointer whatever layer covers it, since a page whose sections run
      // edge to edge has no empty space in a column to click; ⇧⌥ adds it to the columns picked or takes it back.
      if (e.altKey) {
        const at = columnAt(e.clientX);
        if (at) return e.shiftKey ? choose(current(), toggleColumn(at.i)) : choose([], { cols: [at.i] });
      }
      const deep = e.metaKey || e.ctrlKey;
      // A press on the one layer selected keeps it, as in Figma, however it was picked (the layer menu, a group's list,
      // a ⌘-click): her level becomes its own, so the press doesn't go back out to the layer around it, and a
      // double-click on text edits it at once.
      if (!deep && !e.shiftKey && !column && selected && selected.contains(e.target) && pickable(e.target)) {
        const chain = levelOf(selected);
        scope = chain[chain.length - 2] || null;
        return startMove(e);
      }
      const lp = levelPick(e.target, deep);
      let t = lp.pick;
      // With columns picked, a shift-click is for a layer to line up with them: the outermost layer under the pointer
      // that doesn't span the whole guide, so the heading is taken rather than the full-width section around it.
      // ⌘⇧ still takes the deepest.
      if (t && e.shiftKey && !deep && column) t = fitsColumns(e.target) || t;
      scope = lp.scope;
      if (inside && !(t && groupOf(t) === inside)) inside = null;
      if (!t) return startMarquee(e);
      // ⌘-click goes through a group, as in Figma: the layer itself, inside its group, so Escape steps out to it.
      if (deep && groupOf(t)) inside = groupOf(t);
      const unit = unitOf(t);
      const picked = unit ? unit.list : t ? [t] : [];
      // Shift adds what's clicked, or takes it back out, as in Figma.
      if (e.shiftKey) {
        const now = current().slice();
        const has = picked.every((p) => now.includes(p));
        return pick(has ? now.filter((n) => !picked.includes(n)) : now.concat(picked.filter((p) => !now.includes(p))), column);
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
      if (!active() || editing || motion()) return;
      // Selected text's resize handles sit 4 in over its edges (a third of a 24px line): a double-click there is on its
      // words as much as its edge, so it edits them rather than doing nothing.
      const edge = e.target && e.target.closest && e.target.closest(".ft-sel-box .ft-handle");
      if (edge && selected && hasText(selected)) return startEditing(selected, e.clientX, e.clientY);
      if (isUi(e.target)) return;
      const deepest = pickable(e.target);
      if (!deepest) return;
      const t = levelPick(e.target).pick;
      // Into a group, as in Figma: the first double-click selects the layer under the pointer.
      const g = groupOf(t);
      if (g && g !== inside) {
        inside = g;
        return select(t);
      }
      // A double-click on words edits them at once, however deep they sit (her report, 2026-10-17: a name two
      // containers in took a click and three double-clicks): the text layer under the pointer, a word set apart inside
      // it (a <strong>, a link) counting as part of it. On anything else it goes one level in, below.
      let words = deepest;
      while (words !== t && words.parentElement && getComputedStyle(words).display === "inline"
        && hasText(words.parentElement) && pickable(words.parentElement)) words = words.parentElement;
      if (hasText(words)) {
        const chain = levelOf(words);
        scope = chain[chain.length - 2] || null;
        select(words);
        return startEditing(words, e.clientX, e.clientY);
      }
      // Into a container: one level down, toward what's under the pointer. Selected text is edited whole, as in Figma,
      // even where the pointer is on a word set apart inside it (a <strong>, a link): only inline words between, not
      // an icon, an image, a control or a block inside it, which a double-click still goes into.
      const inlineWords = () => {
        for (let x = deepest; x && x !== t; x = x.parentElement) {
          if (!(x instanceof HTMLElement) || /^(IMG|PICTURE|VIDEO|CANVAS|IFRAME|INPUT|TEXTAREA|SELECT|BUTTON)$/.test(x.tagName)
            || getComputedStyle(x).display !== "inline") return false;
        }
        return true;
      };
      if (t !== deepest && !(t === selected && hasText(t) && inlineWords())) {
        const chain = levelOf(deepest);
        scope = t;
        // A grouped layer there comes as its whole group, as a click at that level picks it.
        const next = chain[chain.indexOf(t) + 1] || deepest;
        const unit = unitOf(next);
        return unit ? show(null, unit.list, unit.g) : select(next);
      }
      if (!hasText(t)) return;
      select(t);
      startEditing(t, e.clientX, e.clientY);
    }, true);

    const selectionKey = (e) => {
      if (!active() || e.defaultPrevented) return;
      if (editing) {
        if (e.key === "Escape") {
          e.preventDefault();
          stopEditing();
        } else if (e.key === "Enter" && !e.isComposing && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          typeBreak();
        } else if (e.key === " " && !e.isComposing && editing.closest("button, summary")) {
          // A <button> (or a <summary>) takes Space as a press, so no space would go in and the page's own click
          // would run: it's typed here instead.
          e.preventDefault();
          document.execCommand("insertText", false, " ");
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
      // Figma's ⌘G and ⌘⇧G (Ctrl on Windows). ⌃G on a Mac is the layout grid's.
      if ((MAC ? e.metaKey : e.ctrlKey) && !e.altKey && String(e.key).toLowerCase() === "g") {
        e.preventDefault();
        if (e.shiftKey) ungroup();
        else groupSelection();
        return;
      }
      if (!current().length && !column) return;
      // Figma's ⇧A and ⌥⇧A (Shift+A, Alt+Shift+A elsewhere), add and remove auto layout. Read by code, since ⌥⇧A
      // types Å on a Mac. Motion has no layout to add.
      if (e.code === "KeyA" && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.repeat && !motion()) {
        e.preventDefault();
        return e.altKey ? removeAutoLayout() : addAutoLayout();
      }
      // Figma's Delete and Backspace.
      if ((e.key === "Delete" || e.key === "Backspace") && !e.metaKey && !e.ctrlKey && !e.altKey && current().length) {
        e.preventDefault();
        return deleteSelection();
      }
      // Figma's ⌘D (Ctrl on Windows), Duplicate selection. The browser's bookmark key, so it's taken only with
      // layers selected; Hide UI's plain D stays its own.
      if ((MAC ? e.metaKey : e.ctrlKey) && !e.altKey && !e.shiftKey && String(e.key).toLowerCase() === "d" && current().length) {
        e.preventDefault();
        return duplicateSelection();
      }
      // Figma's layer keys, in Design: Shift+Enter and \ select the parent, Tab and Shift+Tab the next and previous
      // layer, Enter the children (on a text layer Enter edits its words instead, below, as Figma's does). A panel
      // control focused from the keyboard keeps Tab and Enter, to move on and to press it.
      if (current().length && !motion() && !e.metaKey && !e.ctrlKey && !e.altKey && !e.isComposing && !isUi(e.target)) {
        if ((e.key === "Enter" && e.shiftKey) || (e.code === "Backslash" && !e.shiftKey)) {
          e.preventDefault();
          return selectParent();
        }
        if (e.key === "Tab") {
          e.preventDefault();
          return selectSibling(e.shiftKey ? -1 : 1);
        }
        if (e.key === "Enter" && !(selected && hasText(selected)) && selectChildren()) return e.preventDefault();
      }
      if (e.key === "Escape") {
        // Handled, so a page's own Escape (closing its modal, say) can tell.
        e.preventDefault();
        // The first Escape leaves Scale, the layer still selected (an open menu takes it first, and closes).
        if (scaleMode && !document.querySelector(".ft-menu:not([hidden])")) return endScale();
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
    };
    // A key acted on here goes no further than document, so a page's own shortcuts on window don't run it too.
    document.addEventListener("keydown", (e) => {
      const was = e.defaultPrevented;
      selectionKey(e);
      if (!was && e.defaultPrevented) e.stopPropagation();
    });

    window.addEventListener("scroll", () => {
      place();
      hoverBox.hidden = true;
      pointer = null;
    }, true);
    window.addEventListener("resize", place);
    document.addEventListener("input", moved, true);

    function sync() {
      document.documentElement.classList.toggle("ft-moving", active());
      if (!active()) {
        closeMenu();
        hoverBox.hidden = true;
        // Hide UI keeps the selection, as Figma's Minimize UI does: only its boxes go, and they come back with
        // the UI. Fully hidden (open: false, finetune.toggle(false)) lets it go.
        if (minimized) {
          stopEditing();
          selBox.hidden = true;
          placeColumn();
        } else {
          inside = scope = null;
          select(null);
        }
      } else if (current().length || column) {
        selBox.hidden = !current().length;
        place();
        if (current().length) watch();
      }
      drawMarks();
    }
    sync();

    return { sync, refresh: place, reshow, selectLayers, selectItem, tabChanged, guidesChanged, preview, addAutoLayout, removeAutoLayout, resizable };
  }

  const WEIGHT_NAMES = {
    100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular", 500: "Medium",
    600: "Semi Bold", 700: "Bold", 800: "Extra Bold", 900: "Black",
  };
  const unquote = (s) => String(s).trim().replace(/^["']|["']$/g, "");

  // CSS's generic families are keywords: quoted, one names a font that doesn't exist, and the text falls back.
  const GENERIC_FAMILY = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|math|emoji|fangsong|ui-(serif|sans-serif|monospace|rounded)|-apple-system)$/i;
  const familyCss = (f) => (GENERIC_FAMILY.test(f) ? f : '"' + f + '"');

  // Whether the family has a face at this weight; a variable face ("100 900") has every weight in its range.
  function familyHas(family, w) {
    let has = false;
    if (document.fonts) document.fonts.forEach((f) => {
      if (unquote(f.family) !== family) return;
      const [lo, hi] = String(f.weight).split(/\s+/).map(Number);
      if (isNum(hi) ? w >= lo && w <= hi : lo === w) has = true;
    });
    return has;
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
      if (!anchor) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      // While a menu is open, the layer keys and Delete don't reach the page's layers, as Figma's menus hold the
      // keys: the selection (and a Select layer list, or a preview) can't change under it.
      if ((/^(Enter|Tab|Delete|Backspace)$/.test(e.key) || e.code === "Backslash") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!typing(e.target) && !menu.contains(e.target)) e.preventDefault();
      }
    });
    // Right-click on a menu opens no browser menu over it.
    menu.addEventListener("contextmenu", (e) => e.preventDefault());

    return {
      close,
      // A context menu: its top left at the pointer (kept on screen), as Figma's right-click menu opens. It hangs
      // off a stand-in anchor there, so a click anywhere else, or Escape, closes it as any other.
      openAt(x, y, items, onPick, onHover) {
        const point = el("span");
        point.getBoundingClientRect = () => new DOMRect(x, y - 4, 0, 0);
        this.toggle(point, items, null, onPick, onHover);
      },
      // span: an element the menu drops down under, as wide as it (8 in from its edges), as Figma's header menu
      // drops under the panel's header; without it the menu opens at the button.
      toggle(btn, items, current, onPick, onHover, span) {
        if (anchor === btn) return close();
        menu.style.width = "";
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
          item.appendChild(check);
          // An item with a glyph shows it before its words, as the kit's resizing menu does.
          if (it.icon) {
            const glyph = el("span", "ft-menu-icon");
            glyph.innerHTML = ICON[it.icon];
            item.appendChild(glyph);
          }
          const words = el("span", it.depth ? "ft-menu-nest" : null, it.label);
          if (it.depth) words.style.setProperty("--ft-depth", it.depth);
          item.appendChild(words);
          // An action's shortcut, at the right as Figma's menus show it.
          if (it.keys) item.appendChild(el("span", "ft-menu-keys", it.keys));
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
        if (span) {
          const sr = span.getBoundingClientRect();
          menu.style.left = sr.left + 8 + "px";
          menu.style.width = sr.width - 16 + "px";
          menu.style.top = Math.max(8, Math.min(sr.bottom + 4, window.innerHeight - menu.offsetHeight - 8)) + "px";
          return;
        }
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

  // The names the Fonts popover shows, as Figma's list does ("PP Neue Montreal", not "neueMontreal"). Display only:
  // a pick still writes the family the page registers, so Copy and the bake never see these. The page can hand
  // the exact names over (finetune({ fontNames })); without them a name is read off the font's files, then off the
  // family itself.
  const fontNames = {};
  // Short brand prefixes kept in capitals ("gtSuperText" is GT Super Text, not Gt).
  const FONT_ACRONYMS = /^(PP|GT|ABC|FK|DM|IBM|JB|SF|UI|AI|NY|TT|HK|KR|JP|SC|TC|CJK)$/i;
  // Weights and styles that end a font's file name (PPNeueMontreal-Medium, GT-Super-Text-Bold-Italic), plus the
  // words foundries add to a trial or variable file. They name a face, not the family.
  const FONT_STYLE_WORD = /^(thin|hair|hairline|extra|ultra|semi|demi|light|leicht|regular|normal|book|buch|roman|medium|kraftig|kräftig|halbfett|fett|bold|heavy|black|italic|oblique|upright|trial|variable|vf|var|wght|\d{3})$/i;
  // A family as the page registers it, with build tooling's marks taken off: next/font's leading underscores and
  // hash ("__Inter_a1b2c3"), and a metric stand-in's "Fallback".
  // After next/font's "__" the last part is always its hash, even one with no digit ("__Inter_abcdef").
  const bareFamily = (f) => {
    const s = unquote(f);
    const hash = /^__/.test(s) ? /_[0-9a-f]{5,}$/i : /[_-](?=[0-9a-f]*\d)[0-9a-f]{5,}$/i;
    return s.replace(/^_+/, "").replace(/[_ -]Fallback(?=$|[_-])/i, "").replace(hash, "");
  };
  // camelCase, snake_case and kebab-case split into words, a run of capitals kept as one ("PPNeueMontreal").
  const fontWords = (s) => s.replace(/([a-z\d])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").split(/[\s_.-]+/).filter(Boolean);
  const titleWords = (words) => words.map((w) => (FONT_ACRONYMS.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))).join(" ");
  // The words a family's files share, less the weights and styles after them: GT_Super_Text_Book and
  // GT_Super_Text_Bold_Italic are GT Super Text. Bundlers' hashes come off first (Turbopack's "-s.p.2o_lmciy58",
  // Vite's "-BKl3ZsNC" or older ".BKl3ZsNC", webpack's "-a1b2c3d4"), and Google's "-VariableFont_wght"; a file
  // named only by a hash, as
  // Google Fonts' are once self-hosted, says nothing.
  function nameFromFiles(urls) {
    const stems = urls.map((u) => {
      let s = u.split(/[?#]/)[0].split("/").pop();
      try {
        s = decodeURIComponent(s);
      } catch (e) {
        // Left as written.
      }
      s = s.replace(/\.(woff2?|ttf|otf|eot|svg)$/i, "").replace(/-s(\.p)?(\.[\w-]+)?$/, "").replace(/\.[\w-]{6,}$|-(?=[0-9a-f]*\d)[0-9a-f]{8,}$/i, "").replace(/[-_]?VariableFont.*$/i, "");
      // Vite's eight-character hash isn't hex: it comes off when it mixes digits and both cases, or follows a weight.
      s = s.replace(/-([\w-]{8})$/, (m, h, at, all) => ((/\d/.test(h) && /[a-z]/.test(h) && /[A-Z]/.test(h)) || FONT_STYLE_WORD.test(fontWords(all.slice(0, at)).pop() || "") ? "" : m));
      return /^[0-9a-f]{8,}$/i.test(s) ? null : fontWords(s);
    }).filter((w) => w && w.length);
    if (!stems.length) return null;
    let shared = stems[0];
    stems.slice(1).forEach((w) => {
      let n = 0;
      while (n < shared.length && n < w.length && shared[n].toLowerCase() === w[n].toLowerCase()) n++;
      shared = shared.slice(0, n);
    });
    while (shared.length && FONT_STYLE_WORD.test(shared[shared.length - 1])) shared = shared.slice(0, -1);
    return shared.length ? titleWords(shared) : null;
  }
  // The page's own name first, then a name already written for people ("Geist", "DM Mono") as it is, then the
  // files' name, then the family's words.
  function fontLabel(family, files) {
    // A generic family (sans-serif, system-ui) is CSS's own word, shown as written.
    if (GENERIC_FAMILY.test(unquote(family))) return unquote(family);
    const bare = bareFamily(family);
    const given = fontNames[unquote(family)] || fontNames[bare];
    if (given) return String(given);
    const words = titleWords(fontWords(bare));
    if (words === unquote(family)) return words;
    return (files && files.length && nameFromFiles(files)) || words || unquote(family);
  }

  // The project's font families, as Figma's Fonts list but only what this page loads or names: each family in
  // document.fonts that has loaded or that the page's own CSS names in a font stack, plus the current one. Left out:
  // next/font's metric stand-ins ("<family> Fallback", a local Arial resized to match) when their family is listed
  // too, and Next's own dev fonts. A stack is a font-family, with its var()s filled in from the custom properties
  // the page defines, since next/font hands its families over that way (--font-signifier: "signifier", ...) and the
  // rules that use them close the stack (var(--font-signifier), Georgia, serif).
  // Each family comes with its kind (sans, serif, mono), read in this order: the generic family closing the stacks
  // that name it (sans-serif, serif, monospace; the most common one when they differ), then its name (Mono or Code
  // is mono, Serif without Sans is serif, Sans or Grotesk is sans), then a measure (a face whose "iiii" and "WWWW"
  // are the same width is mono). A serif can't be measured reliably, so it's only ever read from a stack or a name;
  // anything still unknown counts as sans serif.
  function projectFamilies(current) {
    const stacks = [];
    const defs = new Map();
    // Each family's font files, from its @font-face rules, for the name the popover shows (fontLabel).
    const files = new Map();
    const walk = (rules) => {
      for (const r of rules) {
        if (window.CSSFontFaceRule && r instanceof CSSFontFaceRule) {
          const fam = unquote(r.style.getPropertyValue("font-family"));
          const urls = Array.from(r.style.getPropertyValue("src").matchAll(/url\(\s*["']?([^"')]+)/g), (m) => m[1]);
          if (fam && urls.length) files.set(fam, (files.get(fam) || []).concat(urls));
        } else if (r.style) {
          const ff = r.style.getPropertyValue("font-family");
          if (ff) stacks.push(ff);
          for (let i = 0; i < r.style.length; i++) {
            const prop = r.style[i];
            if (!prop.startsWith("--")) continue;
            if (!defs.has(prop)) defs.set(prop, []);
            defs.get(prop).push(r.style.getPropertyValue(prop).trim());
          }
        }
        if (r.cssRules) walk(r.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      // finetune's own sheet names the panel's Inter, which isn't the page's.
      if (sheet.ownerNode && /^finetune-/.test(sheet.ownerNode.id || "")) continue;
      try {
        walk(sheet.cssRules);
      } catch (e) {
        // Another origin's sheet can't be read.
      }
    }
    // var(--name, fallback) becomes the property's value (one that isn't just itself, as Tailwind's theme writes
    // --font-x: var(--font-x)), else its fallback; a few levels deep, for vars made of vars.
    const fill = (text, depth) => {
      let out = "";
      let i = 0;
      while (i < text.length) {
        const at = text.indexOf("var(", i);
        if (at < 0) return out + text.slice(i);
        out += text.slice(i, at);
        let level = 0;
        let end = at + 3;
        for (; end < text.length; end++) {
          if (text[end] === "(") level++;
          else if (text[end] === ")" && --level === 0) break;
        }
        const inner = text.slice(at + 4, end);
        const comma = inner.indexOf(",");
        const name = (comma < 0 ? inner : inner.slice(0, comma)).trim();
        const value = (defs.get(name) || []).find((v) => !v.includes("var(" + name));
        const use = value != null ? value : comma < 0 ? "" : inner.slice(comma + 1);
        out += depth > 0 ? fill(use, depth - 1) : "";
        i = end + 1;
      }
      return out;
    };
    const named = stacks.map((s) => fill(s, 4).split(",").map(unquote).filter(Boolean));
    // A custom property that holds a family counts as naming it too (a family the page sets up for its rules). Its
    // list ends in a blank, so it never votes on the family's kind: text doesn't fall back through a property.
    defs.forEach((vals) => vals.forEach((v) => named.push(fill(v, 4).split(",").map(unquote).filter(Boolean).concat(""))));
    const all = new Set();
    const loaded = new Set();
    if (document.fonts) document.fonts.forEach((f) => {
      const name = unquote(f.family);
      all.add(name);
      if (f.status === "loaded") loaded.add(name);
    });
    const used = (f) => named.some((n) => n.includes(f));
    // The Inter finetune loads for its own panel (loadInter) isn't the page's, unless the page's CSS names it too.
    const panelOnly = (f) => f === "Inter" && !!document.getElementById("ft-inter") && !used(f);
    const keep = Array.from(all).filter((f) => !(/^__nextjs-/.test(f) || (/ Fallback$/.test(f) && all.has(f.slice(0, -9)))) && !panelOnly(f) && (loaded.has(f) || used(f)));
    if (current && !keep.includes(current)) keep.push(current);
    const ctx = document.createElement("canvas").getContext("2d");
    const kindOf = (f) => {
      const votes = { sans: 0, serif: 0, mono: 0 };
      named.forEach((n) => {
        if (!n.includes(f)) return;
        const g = String(n[n.length - 1]).toLowerCase();
        if (/^(ui-)?monospace$/.test(g)) votes.mono++;
        else if (/^(ui-)?serif$/.test(g)) votes.serif++;
        else if (/^(ui-)?sans-serif$|^system-ui$/.test(g)) votes.sans++;
      });
      const top = Object.keys(votes).reduce((a, b) => (votes[b] > votes[a] ? b : a));
      if (votes[top]) return top;
      if (/mono|code/i.test(f)) return "mono";
      if (/serif/i.test(f) && !/sans/i.test(f)) return "serif";
      if (/sans|grotesk/i.test(f)) return "sans";
      // A face that hasn't loaded measures as the sans-serif behind it, so it reads as sans, the default anyway.
      ctx.font = "40px " + familyCss(f) + ", sans-serif";
      return Math.abs(ctx.measureText("iiii").width - ctx.measureText("WWWW").width) < 0.5 ? "mono" : "sans";
    };
    // Alphabetical by the name shown, as Figma's list is.
    return keep.map((name) => ({ name, label: fontLabel(name, files.get(name)), kind: kindOf(name) })).sort((a, b) => a.label.localeCompare(b.label));
  }

  // Figma's Fonts popover, opened from Typography's family field: white (the panel's surface), just left of the
  // panel and level with the field, built as Layout guide styles is (title and close, a divider, then the list). No
  // search. Under the divider, where the styles popover's first heading sits, the "All fonts" dropdown filters the
  // list by kind; its options are the dark menu, the only dark part. Each row shows the family in its own face, the
  // one in use ticked. Hovering a row previews it on the text (onHover), leaving the list puts it back
  // (onHover(null)), a click applies it (onPick) and closes. Escape, a click elsewhere and the close shut it.
  function makeFontsPop(root, menu) {
    const FILTERS = [["all", "All fonts"], ["sans", "Sans serif fonts"], ["serif", "Serif fonts"], ["mono", "Mono fonts"]];
    let anchor = null;
    let opts = null;
    let kind = "all";
    let fonts = [];

    const pop = el("div", "ft-pop ft-fonts-pop");
    pop.hidden = true;
    const head = el("div", "ft-pop-head");
    const actions = el("div", "ft-head-actions");
    actions.append(iconButton(ICON.x, "Close", close));
    head.append(el("span", null, "Fonts"), actions);
    const filter = dropdown((btn) => {
      const items = FILTERS.map(([value, label]) => ({ label, value }));
      // A line between All fonts and the kinds, as in Figma's menu.
      items.splice(1, 0, { divider: true });
      menu.toggle(btn, items, kind, (v) => {
        kind = v;
        draw();
      });
    });
    const filterRow = el("div", "ft-fonts-filter");
    filterRow.appendChild(filter.btn);
    const list = el("div", "ft-fonts-list");
    list.addEventListener("pointerleave", () => opts && opts.onHover(null));
    pop.append(head, filterRow, list);
    root.appendChild(pop);

    function row(f) {
      const r = el("div", "ft-style-row ft-font-row");
      r.setAttribute("role", "button");
      r.tabIndex = 0;
      const check = el("span", "ft-font-check");
      if (f.name === opts.current) check.innerHTML = ICON.check;
      // The family's display name; the pick below still hands over the family itself.
      const name = el("span", "ft-style-name ft-font-name", f.label);
      name.style.fontFamily = familyCss(f.name);
      r.append(check, name);
      const pick = () => {
        const o = opts;
        close();
        o.onPick(f.name);
      };
      r.addEventListener("click", pick);
      r.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        pick();
      });
      r.addEventListener("pointerenter", () => opts && opts.onHover(f.name));
      return r;
    }

    function draw() {
      filter.label.textContent = FILTERS.find(([v]) => v === kind)[1];
      const shown = fonts.filter((f) => kind === "all" || f.kind === kind);
      list.replaceChildren(...(shown.length ? shown.map(row) : [el("div", "ft-styles-empty", "No fonts of this kind")]));
    }

    function open(btn, o) {
      anchor = btn;
      opts = o;
      btn.classList.add("is-open");
      fonts = projectFamilies(o.current);
      draw();
      pop.hidden = false;
      // Just left of the panel, level with the field, kept on screen (as Layout guide styles).
      const r = btn.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
      pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
      const cur = list.querySelector(".ft-font-check:not(:empty)");
      if (cur) cur.parentNode.scrollIntoView({ block: "nearest" });
    }

    function close() {
      if (!anchor) return;
      menu.close();
      const o = opts;
      pop.hidden = true;
      anchor.classList.remove("is-open");
      anchor = opts = null;
      o.onHover(null);
    }

    // Its filter's menu lives outside it, so a click there isn't a click elsewhere.
    document.addEventListener("pointerdown", (e) => {
      if (!anchor || pop.contains(e.target) || anchor.contains(e.target) || e.target.closest(".ft-menu")) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (!anchor) return;
      // While it is open the layer keys and Delete don't reach the page's layers, as makeMenu holds them: the text
      // being previewed can't be hidden, swapped or put into editing under it. A row's own Enter or Space still picks.
      if ((/^(Enter|Tab|Delete|Backspace)$/.test(e.key) || e.code === "Backslash") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!typing(e.target) && !pop.contains(e.target)) e.preventDefault();
        return;
      }
      if (e.key !== "Escape" || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      close();
    });

    return {
      close,
      toggle(btn, o) {
        if (anchor === btn) close();
        else {
          close();
          open(btn, o);
        }
      },
    };
  }

  // The style rules of the page's own sheets in source order, through @layer, @import and the @supports and @media
  // that hold now (finetune's own sheet left out; another origin's can't be read). ctx says whether a rule sits in an
  // @media (it changes a style at some widths only), an @layer (a framework's theme, as Tailwind's), or a container
  // query, a scope or a starting style (cond: it holds for some elements only, which can't be told here).
  function pageStyleRules(visit) {
    const is = (r, type) => typeof window[type] !== "undefined" && r instanceof window[type];
    const walk = (rules, ctx) => {
      for (const r of rules) {
        if (r instanceof CSSStyleRule) {
          visit(r, ctx);
          continue;
        }
        if (r.media && r.media.mediaText && !matchMedia(r.media.mediaText).matches) continue;
        // An @import's rules are on its own sheet, which document.styleSheets doesn't list.
        if (is(r, "CSSImportRule")) {
          try {
            if (r.styleSheet) walk(r.styleSheet.cssRules, { media: ctx.media, layered: ctx.layered || r.layerName != null, cond: ctx.cond });
          } catch (e) {
            // Another origin's sheet can't be read.
          }
          continue;
        }
        if (!r.cssRules || is(r, "CSSKeyframesRule")) continue;
        if (is(r, "CSSSupportsRule") && !CSS.supports(r.conditionText)) continue;
        walk(r.cssRules, {
          media: ctx.media || is(r, "CSSMediaRule"),
          layered: ctx.layered || is(r, "CSSLayerBlockRule"),
          cond: ctx.cond || is(r, "CSSContainerRule") || is(r, "CSSScopeRule") || is(r, "CSSStartingStyleRule"),
        });
      }
    };
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode && /^finetune-/.test(sheet.ownerNode.id || "")) continue;
      try {
        if (!sheet.disabled && (!sheet.media || !sheet.media.mediaText || matchMedia(sheet.media.mediaText).matches)) walk(sheet.cssRules, { media: false, layered: false, cond: false });
      } catch (e) {
        // Another origin's sheet can't be read.
      }
    }
  }

  // Figma's text styles as the page's code defines them: a plain class (a rule's selector, or one part of a selector
  // list) with a rule outside any @media, giving a size and at least one more of a type style's values, and nothing but
  // type: a class that also places or paints its element is a component's. Tailwind's arbitrary and variant classes
  // are escaped (.text-\[13px\], .md\:text-lg), so they're left out too. A style is what its class gives where the
  // text is, at this width: every rule naming the class that a hidden probe beside the text matches (its own rule, the
  // @media ones that hold now, the page's `.page .b1`), the strongest for each property, as the code writes it (a
  // var() or a clamp() kept) when that computes to what the probe shows, else what it shows. Rules under a container
  // query, a scope or a starting style hold for some elements only, so they're left out. Large to small, as a type
  // scale reads.
  const TYPE_PROP = /^(--.+|font(-[a-z-]+)?|line-height|letter-spacing|word-spacing|text-transform|text-decoration(-[a-z-]+)?|text-underline-offset|text-rendering|-webkit-font-smoothing|-moz-osx-font-smoothing|(-webkit-)?text-size-adjust)$/;
  // What makes two texts the same style: no colour in it, so a decoration's currentcolor doesn't tell them apart.
  const TYPE_CHECK = ["font-family", "font-size", "font-weight", "font-style", "line-height", "letter-spacing", "word-spacing", "text-transform"];
  // Line height in px (or "normal"): Chrome hands a unitless one back as px on shown text, but as the number on a
  // hidden one (the probe).
  const lineHeightPx = (cs) => (cs.lineHeight === "normal" ? "normal"
    : /px$/.test(cs.lineHeight) ? parseFloat(cs.lineHeight) : parseFloat(cs.lineHeight) * parseFloat(cs.fontSize));
  function codeTextStyles(near) {
    const rules = [];
    const based = new Set();
    pageStyleRules((r, ctx) => {
      if (ctx.cond || r.selectorText.indexOf(".") < 0) return;
      const decl = {};
      let typeOnly = true;
      for (let i = 0; i < r.style.length; i++) {
        const p = r.style[i];
        const v = r.style.getPropertyValue(p).trim();
        if (!v) continue;
        if (!TYPE_PROP.test(p)) typeOnly = false;
        decl[p] = { v, important: r.style.getPropertyPriority(p) === "important" };
      }
      const parts = r.selectorText.split(/,(?![^()]*\))/).map((s) => s.trim());
      rules.push({ parts, decl, typeOnly });
      if (!ctx.media) parts.forEach((s) => { if (/^\.[A-Za-z_-][\w-]*$/.test(s) && !/^\.ft-/.test(s)) based.add(s.slice(1)); });
    });
    if (!based.size) return [];
    const probe = document.createElement("span");
    probe.style.display = "none";
    ((near && !inSvg(near) && near.parentElement) || document.body).appendChild(probe);
    const matches = (s) => {
      try {
        return probe.matches(s);
      } catch (e) {
        return false;
      }
    };
    const list = [];
    based.forEach((name) => {
      // Its ft- class keeps finetune's page watcher off it (see ownNode).
      probe.className = "ft-style-probe " + name;
      const named = new RegExp("\\." + name + "(?![\\w-])");
      const win = {};
      let typeOnly = true;
      // The strongest of the class's rules for each property: !important, then the most specific, then the last.
      rules.forEach((x) => {
        const hit = x.parts.filter((s) => named.test(s) && matches(s));
        if (!hit.length) return;
        typeOnly = typeOnly && x.typeOnly;
        const w = Math.max(...hit.map(selectorWeight));
        Object.keys(x.decl).forEach((p) => {
          const rank = (x.decl[p].important ? 1e9 : 0) + w;
          if (!win[p] || rank >= win[p].rank) win[p] = { v: x.decl[p].v, rank };
        });
      });
      if (!typeOnly || !win["font-size"] || !["font-family", "font-weight", "line-height", "letter-spacing"].some((p) => win[p])) return;
      const cs = getComputedStyle(probe);
      const decl = {};
      Object.keys(win).forEach((p) => {
        const shown = cs.getPropertyValue(p).trim();
        probe.style.setProperty(p, win[p].v);
        decl[p] = cs.getPropertyValue(p).trim() === shown ? win[p].v : shown;
        probe.style.removeProperty(p);
      });
      const leading = lineHeightPx(cs);
      list.push({
        name, decl, order: list.length, size: parseFloat(cs.fontSize), leading,
        face: { family: cs.fontFamily, weight: cs.fontWeight, style: cs.fontStyle },
        check: TYPE_CHECK.filter((p) => p in decl).map((p) => [p, p === "line-height" ? leading : cs.getPropertyValue(p)]),
      });
    });
    probe.remove();
    // Figma's "57/64": the size and line height in px, Auto for normal.
    const px = (n) => String(Math.round(n * 10) / 10);
    list.forEach((st) => { st.meta = px(st.size) + "/" + (st.leading === "normal" ? "Auto" : px(st.leading)); });
    const lead = (st) => (st.leading === "normal" ? st.size * 1.2 : st.leading);
    return list.sort((a, b) => b.size - a.size || lead(b) - lead(a) || a.order - b.order);
  }
  // Whether the text shows a style as its class gives it.
  function showsTextStyle(t, st) {
    const cs = getComputedStyle(t);
    return st.check.every(([p, v]) => {
      if (p !== "line-height") return cs.getPropertyValue(p) === v;
      const now = lineHeightPx(cs);
      return now === v || (typeof now === "number" && typeof v === "number" && Math.abs(now - v) < 0.01);
    });
  }

  // The page's colour tokens, as Figma's colour styles: the custom properties its code sets on the root (:root, html,
  // :host or body, a [data-theme] or .dark / .light, alone or on one of those) whose value is one colour, each read
  // where the text is, in the theme it shows now (a wrapper can hold a theme of its own). The project's own come first,
  // in the order its code writes them; a framework's theme (Tailwind's, in an @layer) after.
  const ROOT_SEL = /^(?::root|html|:host|body)?(?:\[data-(?:theme|mode|color-scheme)(?:=["']?[\w-]+["']?)?\]|\.(?:dark|light))*(?::not\([^()]*\))?$/;
  function codeColors(near) {
    const own = [];
    const theirs = [];
    pageStyleRules((r, ctx) => {
      if (!r.selectorText.split(/,(?![^()]*\))/).every((s) => s.trim() && ROOT_SEL.test(s.trim()))) return;
      for (let i = 0; i < r.style.length; i++) {
        const p = r.style[i];
        // finetune's own and Tailwind's inner workings are no one's palette.
        if (p.startsWith("--") && !/^--(ft|tw)-/.test(p)) (ctx.layered ? theirs : own).push(p);
      }
    });
    const cs = getComputedStyle(near);
    const seen = new Set();
    const out = [];
    own.concat(theirs).forEach((name) => {
      if (seen.has(name)) return;
      seen.add(name);
      const value = cs.getPropertyValue(name).trim();
      if (value && !/var\(/.test(value) && !/^(transparent|currentcolor|inherit|initial|unset|revert(-layer)?)$/i.test(value)
        && CSS.supports("color", value)) out.push({ name, value });
    });
    return out;
  }
  // The colour token a text shows: var(--x) as its own value (hers, or the code's), else the one it inherits. A fill of
  // currentColor (SVG text's) is the text's own colour, wherever it's declared, so that's read from the text up. Only a
  // token that paints what the text shows now counts: a rule finetune can't read (the browser's own, another origin's
  // sheet) can win over the one found, and the token may be unset where the text is.
  function colorTokenOf(t, prop) {
    let e = t;
    let p = prop;
    let tok = null;
    while (e && e.nodeType === 1) {
      const v = declaredValue(e, p);
      if (/^currentcolor$/i.test(v) && p !== "color") {
        p = "color";
        e = t;
        continue;
      }
      if (v && !/^(inherit|unset|currentcolor)$/i.test(v)) {
        const m = /^var\(\s*(--[\w-]+)\s*(,[^]*)?\)$/.exec(v);
        tok = m ? m[1] : null;
        break;
      }
      e = e.parentElement;
    }
    return tok && paintsAs(t, prop, tok) ? tok : null;
  }
  // Whether var(--x) on the text paints the colour it shows now: written inline for one read, then put back.
  function paintsAs(t, prop, tok) {
    const s = t.style;
    const now = getComputedStyle(t).getPropertyValue(prop);
    const was = [s.getPropertyValue(prop), s.getPropertyPriority(prop)];
    s.setProperty(prop, "var(" + tok + ")", "important");
    const v = getComputedStyle(t).getPropertyValue(prop);
    if (was[0]) s.setProperty(prop, was[0], was[1]);
    else s.removeProperty(prop);
    tidyStyle(t);
    return v === now;
  }

  // Figma's Text styles popover, and the same for colours (Color styles), from the styles button (four circles) in
  // Typography's and the text Fill's header: built as the Fonts popover is, with only the close in its header (no
  // search, no libraries, no + to make one), then one heading, "Defined in code", over a row per style the page's
  // own CSS defines. The one the text has now is filled blue, as Layout guide styles fills the one in use. Hovering a
  // row previews it (onHover), leaving the list puts it back (onHover(null)), a click applies it (onPick) and closes.
  // o.items() lists the rows when it opens ({ value, label, meta, lead, current }), so it reads the code each time.
  function makeCodeStylesPop(root, title) {
    let anchor = null;
    let opts = null;

    const pop = el("div", "ft-pop ft-styles-pop");
    pop.hidden = true;
    const head = el("div", "ft-pop-head");
    const actions = el("div", "ft-head-actions");
    actions.append(iconButton(ICON.x, "Close", close));
    head.append(el("span", null, title), actions);
    const list = el("div", "ft-styles-list");
    list.addEventListener("pointerleave", () => opts && opts.onHover(null));
    pop.append(head, list);
    root.appendChild(pop);

    function row(it) {
      const r = el("div", "ft-style-row" + (it.current ? " ft-style-current" : ""));
      r.setAttribute("role", "button");
      r.tabIndex = 0;
      const name = el("span", "ft-style-name", it.label);
      if (it.meta) name.appendChild(el("span", "ft-style-meta", " · " + it.meta));
      r.append(it.lead, name);
      // The one it has already changes nothing, as in Figma.
      const pick = () => {
        const o = opts;
        close();
        if (!it.current) o.onPick(it.value);
      };
      r.addEventListener("click", pick);
      r.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        pick();
      });
      r.addEventListener("pointerenter", () => opts && opts.onHover(it.current ? null : it.value));
      return r;
    }

    function open(btn, o) {
      anchor = btn;
      opts = o;
      btn.classList.add("is-open");
      const items = o.items();
      list.replaceChildren(el("div", "ft-styles-heading", "Defined in code"), ...(items.length ? items.map(row) : [el("div", "ft-styles-empty", o.empty)]));
      pop.hidden = false;
      // Just left of the panel, level with the button, kept on screen (as Layout guide styles).
      const r = btn.getBoundingClientRect();
      const panel = root.getBoundingClientRect();
      pop.style.left = Math.max(8, panel.left - 8 - pop.offsetWidth) + "px";
      pop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - pop.offsetHeight - 8)) + "px";
      const cur = list.querySelector(".ft-style-current");
      if (cur) cur.scrollIntoView({ block: "nearest" });
    }

    function close() {
      if (!anchor) return;
      const o = opts;
      pop.hidden = true;
      anchor.classList.remove("is-open");
      anchor = opts = null;
      o.onHover(null);
    }

    document.addEventListener("pointerdown", (e) => {
      if (!anchor || pop.contains(e.target) || anchor.contains(e.target)) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (!anchor) return;
      // While it is open the layer keys and Delete don't reach the page's layers (as the Fonts popover holds them): the
      // text being previewed can't be hidden, swapped or put into editing under it. A row's own Enter or Space picks.
      if ((/^(Enter|Tab|Delete|Backspace)$/.test(e.key) || e.code === "Backslash") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!typing(e.target) && !pop.contains(e.target)) e.preventDefault();
        return;
      }
      if (e.key !== "Escape" || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      close();
    });

    return {
      close,
      toggle(btn, o) {
        if (anchor === btn) close();
        else {
          close();
          open(btn, o);
        }
      },
    };
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
        // currentSrc names the old image until the new one loads: the preview and the thumbnail draw again then.
        t.addEventListener("load", () => {
          if (target === t) draw();
          onChange();
        }, { once: true });
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
      e.stopPropagation();
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
  // A layer with an edit of its own is the element that edit is on (see resolve), so the group's line and the layer's
  // own line name the same one after the page changed; none while that edit is judged gone.
  const groupMembers = (g) => g.map((sel) => {
    const was = edits.elements[sel] && applied.get(sel);
    if (was && was.isConnected) return was;
    return edits.elements[sel] && lostAt.get(sel) === "moved" ? null : query(sel);
  }).filter(Boolean);
  function groupOf(t) {
    const sel = keyOf(t);
    return edits.groups.find((g) => g.includes(sel)) || null;
  }

  // A ⌘G group's auto layout (⇧A on the group, or on two or more layers, which groups them first). The group is no
  // element on the live page, so its layout is kept beside the groups (edits.autoLayout), matched by the group's set
  // of layers so a regroup, an undo or a reload finds it again, and shown by moving its layers (flowGroup). Those
  // moves are ordinary recorded translates, so undo, Save and restore need nothing new. Copy lists the layout for the
  // bake, which wraps the layers in one new element. It always hugs its layers, so its frame is wherever they are plus
  // its padding: nothing about the frame needs keeping. These two are functions, not consts, because loadEdits runs
  // before this part of the file does.
  function sameSet(a, b) {
    return a.length === b.length && a.every((s) => b.includes(s));
  }
  function validLayout(l, groups) {
    const size = (v) => isNum(v) && v >= 0;
    const pos = (v) => v === "start" || v === "center" || v === "end";
    if (!l || !Array.isArray(l.sels) || l.sels.length < 2 || !l.sels.every((s) => typeof s === "string")) return null;
    if ((l.flow !== "vertical" && l.flow !== "horizontal") || !size(l.gap) || !pos(l.main) || !pos(l.cross)) return null;
    if (!Array.isArray(l.pad) || l.pad.length !== 4 || !l.pad.every(size)) return null;
    const ignore = Array.isArray(l.ignore) ? l.ignore : [];
    if (!ignore.every((s) => l.sels.includes(s)) || !groups.some((g) => sameSet(g, l.sels))) return null;
    return { sels: l.sels.slice().sort(), flow: l.flow, gap: l.gap, pad: l.pad.slice(), main: l.main, cross: l.cross, ignore: ignore.slice() };
  }
  // Found again each time, never held: an undo or a regroup swaps the arrays.
  const layoutOf = (g) => (g && edits.autoLayout.find((l) => sameSet(l.sels, g))) || null;
  // The group that is exactly these layers, if they are one.
  function groupFor(list) {
    const sels = list.map(keyOf);
    return edits.groups.find((g) => sameSet(g, sels)) || null;
  }
  // The group auto layout a layer is in, placed by it or ignoring it.
  function layoutWith(t) {
    const sel = keyOf(t);
    return edits.autoLayout.find((l) => l.sels.includes(sel)) || null;
  }
  // The code's order: the order the baked flex places the layers in.
  const domOrder = (a, b) => (a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

  // Where a layer sits without any translate (nx, ny), and where she sees it (x, y: that plus its translate, hers or,
  // where she has none, the code's). Read off its rect less its translate and less a transform that only moves it, so
  // a running animation's slide can't skew the layout. A turned or scaled layer is read from offset geometry, which
  // leaves transforms out but rounds to whole pixels.
  function placeOf(t) {
    const cs = getComputedStyle(t);
    const n = (v) => parseFloat(v) || 0;
    const own = trPx(t, trNow(t));
    const moveOnly = cs.rotate === "none" && cs.scale === "none" && (cs.transform === "none" || /^matrix\(1, 0, 0, 1,/.test(cs.transform)) && !/[%(]/.test(cs.translate);
    let x;
    let y;
    let w;
    let h;
    if (moveOnly || !(t instanceof HTMLElement) || !t.offsetParent) {
      const r = t.getBoundingClientRect();
      const tr = moveOnly && cs.translate !== "none" ? cs.translate.split(/\s+/).map(n) : [];
      const m = moveOnly && cs.transform !== "none" ? new DOMMatrixReadOnly(cs.transform) : null;
      x = r.left - (tr[0] || 0) - (m ? m.e : 0);
      y = r.top - (tr[1] || 0) - (m ? m.f : 0);
      w = r.width;
      h = r.height;
    } else {
      // Against the body, offsets are from the document's corner.
      const op = t.offsetParent;
      const pr = op === document.body ? { left: -window.scrollX, top: -window.scrollY } : op.getBoundingClientRect();
      const edge = op === document.body ? { x: 0, y: 0 } : { x: op.clientLeft, y: op.clientTop };
      x = pr.left + edge.x + t.offsetLeft;
      y = pr.top + edge.y + t.offsetTop;
      w = t.offsetWidth;
      h = t.offsetHeight;
    }
    return { t, sel: keyOf(t), nx: x, ny: y, x: x + (own[0] || 0), y: y + (own[1] || 0), w, h };
  }
  // A group layout's layers in the code's order, the ones it places (flow) and the ones that ignore it, and its
  // frame's corner (fx, fy). The frame hugs the placed layers, so it's derived from where they are, not kept. nx, ny
  // is where the bake's new element would put them before any move, for Copy's translate.
  function alGeometry(L) {
    const shown = groupMembers(L.sels).filter((t) => !t.hasAttribute("data-ft-deleted") && getComputedStyle(t).display !== "none").sort(domOrder);
    const flow = [];
    const ignored = [];
    shown.forEach((t) => {
      const b = placeOf(t);
      (L.ignore.includes(b.sel) ? ignored : flow).push(b);
    });
    const base = flow.length ? flow : ignored;
    const least = (k) => (base.length ? Math.min(...base.map((b) => b[k])) : 0);
    return { flow, ignored, fx: least("x") - L.pad[3], fy: least("y") - L.pad[0], nx: least("nx"), ny: least("ny") };
  }
  // Places a group's layers as its flex will in the code: one after another in the code's order, gap apart, inside
  // the padding, lined up across the flow. Each move goes through nudge, so it's an ordinary recorded translate, and a
  // second run moves nothing. Twice at most: a move can box a layer (inline becomes inline-block), shifting the rest.
  // The translate a layer's code gives it (in px), while she has none of her own; "" otherwise.
  function codeTranslate(t) {
    const tr = resting(t, "translate");
    return !t.style.translate && tr !== "none" && !/[%(]/.test(tr) ? tr : "";
  }
  // A group layout's move of one of its layers. Her translate stands in for the code's (Copy says translate: none);
  // none is written where hers comes back to nothing, so the code's doesn't show again. To 2 decimals (an arrow
  // nudge keeps 1), so a scaled group's gaps and alignment land where its Copy line says.
  function layoutNudge(t, dx, dy) {
    [dx, dy] = localDelta(t, dx, dy);
    const cur = trNow(t);
    cur[0].px += dx;
    cur[1].px += dy;
    boxed(t);
    writeTranslate(t, cur, true);
  }
  // A group's layers one after another in a real flex container, along the group's own flow, stand for one element of
  // the code (the bake's new wrapper), so the container's gap doesn't fall between them (her report, 2026-10-17: the
  // outer gap changed the inner group's spacing). A margin on each layer after the first takes that gap off and puts
  // the group's gap in, so the layers are in place and the ones after the group move with it, as they will once the
  // wrapper is in the code. It stands in for the wrapper alone: Copy leaves it out (entry.spanGap), and it goes with
  // the group's auto layout (dropSpans).
  // The layer's own margin on that side comes back: hers from before the span (was), else the code's. On the element
  // only, as the span was (a component's root keeps its component's margin).
  function unspan(t) {
    const e = entryOf(t);
    if (!e || !e.spanGap) return;
    const { prop, value, was } = e.spanGap;
    if (e.styles[prop] === value) {
      if (was) setStyle(t, prop, was, true);
      else {
        setStyle(t, prop, "", true);
        if (Object.keys(edits.components).some((k) => rankOf(t, k) >= 0)) paintComps(t, [prop]);
        else if (originalOf(t).styles[prop]) t.style.setProperty(prop, originalOf(t).styles[prop]);
      }
    }
    record(t, (x) => { delete x.spanGap; });
  }
  function spanGaps(L) {
    const y = L.flow === "vertical";
    const prop = y ? "margin-top" : "margin-left";
    const placed = groupMembers(L.sels.filter((s) => !L.ignore.includes(s))).filter((t) => !t.hasAttribute("data-ft-deleted")).sort(domOrder);
    const p = placed.length > 1 ? placed[0].parentElement : null;
    const cs = p && getComputedStyle(p);
    const kids = p ? flowChildren(p) : [];
    const at = placed.map((t) => kids.indexOf(t));
    const fits = !!cs && /flex/.test(cs.display) && cs.flexWrap === "nowrap" && (y ? cs.flexDirection === "column" : cs.flexDirection === "row")
      && L.main !== "space-between" && isNum(L.gap) && placed.every((t) => t.parentElement === p) && at.every((v, i) => v >= 0 && (!i || v === at[i - 1] + 1));
    const G = fits ? parseFloat(y ? cs.rowGap : cs.columnGap) || 0 : 0;
    // A layer that ignores the layout isn't placed by the group, so it has no span.
    groupMembers(L.ignore).forEach(unspan);
    placed.forEach((t, i) => {
      if (!fits || !i) return unspan(t);
      // The group's gap after the layer before, as flowGroup measures it (margins aside): the container's gap and that
      // layer's own margin on this side come off.
      const before = parseFloat(getComputedStyle(placed[i - 1])[y ? "marginBottom" : "marginRight"]) || 0;
      const e = entryOf(t);
      const value = Math.round((L.gap - G - before) * 100) / 100 + "px";
      if (e && e.spanGap && e.spanGap.value === value && e.styles[prop] === value) return;
      // Her own margin on that side, kept to put back when the span goes (unspan).
      const was = e && e.spanGap ? e.spanGap.was || "" : (e && e.styles[prop]) || "";
      // On this layer only: on a component's root it would otherwise reach every instance of the component.
      setStyle(t, prop, value, true);
      record(t, (x) => { x.spanGap = Object.assign({ prop, value }, was ? { was } : {}); });
    });
  }
  // A group layout gone (Freeform, an ungroup, a layer leaving it): the margins it set come off its layers, and they
  // stay where they were as plain moves, as nothing moves in Figma. All are measured before any margin comes off, since
  // each one moves the layers after it too.
  function dropSpans() {
    const kept = new Set(edits.autoLayout.flatMap((l) => l.sels.filter((s) => !l.ignore.includes(s))));
    const gone = [];
    Object.keys(edits.elements).forEach((sel) => {
      const e = edits.elements[sel];
      if (!e || !e.spanGap || kept.has(sel)) return;
      const t = groupMembers([sel])[0];
      if (t) gone.push(t);
    });
    if (!gone.length) return;
    // The layers after them in the same container move with them too, so they're held as well.
    const held = new Set(gone);
    gone.forEach((t) => { if (t.parentElement) flowChildren(t.parentElement).forEach((c) => held.add(c)); });
    const at = Array.from(held).map((t) => [t, t.getBoundingClientRect()]);
    gone.forEach(unspan);
    at.forEach(([t, r]) => {
      const now = t.getBoundingClientRect();
      if (Math.abs(now.left - r.left) >= 0.05 || Math.abs(now.top - r.top) >= 0.05) nudge(t, r.left - now.left, r.top - now.top);
    });
  }
  function flowGroup(L) {
    const y = L.flow === "vertical";
    const across = (span, size) => (L.cross === "center" ? (span - size) / 2 : L.cross === "end" ? span - size : 0);
    history.quiet++;
    // A translate in a layer's code is taken over as hers first, where it is, since nudge adds to hers alone.
    groupMembers(L.sels.filter((s) => !L.ignore.includes(s))).forEach((t) => {
      const tr = codeTranslate(t);
      if (tr) setStyle(t, "translate", tr);
    });
    spanGaps(L);
    for (let pass = 0; pass < 2; pass++) {
      const f = alGeometry(L);
      if (!f.flow.length) break;
      const W = Math.max(...f.flow.map((b) => b.w));
      const H = Math.max(...f.flow.map((b) => b.h));
      let run = y ? f.fy + L.pad[0] : f.fx + L.pad[3];
      let moved = false;
      f.flow.forEach((b) => {
        const tx = y ? f.fx + L.pad[3] + across(W, b.w) : run;
        const ty = y ? run : f.fy + L.pad[0] + across(H, b.h);
        run += (y ? b.h : b.w) + L.gap;
        if (Math.abs(tx - b.x) < 0.005 && Math.abs(ty - b.y) < 0.005) return;
        layoutNudge(b.t, tx - b.x, ty - b.y);
        moved = true;
      });
      if (!moved) break;
    }
    history.quiet--;
    noteChange();
    flowTick = editTick;
  }
  // After a change to a layer in a group's auto layout (its words, its size, a move of its own), the group places
  // its layers again, as Figma's frame would.
  function reflowFor(list) {
    const sels = list.map(keyOf);
    edits.autoLayout.filter((l) => l.sels.some((s) => sels.includes(s))).forEach(flowGroup);
  }
  // And the groups inside a layer: a container's own layout (its gap, padding, alignment) moves the layers a group in
  // it places, so that group places them again, as a frame inside Figma's auto layout keeps its own spacing.
  function reflowAround(list) {
    const sels = list.map(keyOf);
    edits.autoLayout.filter((l) => l.sels.some((s) => sels.includes(s))
      || groupMembers(l.sels).some((m) => list.some((t) => t !== m && t.contains(m)))).forEach(flowGroup);
  }
  // The frame a group layout draws: the box around the layers it places, plus its padding.
  function alFrame(L) {
    // Read on every pointer move and scroll, so it goes by the stored selectors rather than working each one out.
    const placed = groupMembers(L.sels.filter((s) => !L.ignore.includes(s))).filter((t) => !t.hasAttribute("data-ft-deleted"));
    if (!placed.length) return null;
    const u = unionRect(placed);
    const [pt, pr, pb, pl] = L.pad;
    return { left: u.left - pl, top: u.top - pt, right: u.right + pr, bottom: u.bottom + pb, width: u.width + pl + pr, height: u.height + pt + pb };
  }
  // The box a set of layers shows as: a group with auto layout is its frame.
  function boxOf(list, g) {
    const L = layoutOf(g);
    return (L && alFrame(L)) || unionRect(list);
  }
  // Copy's line for a group layout: the new element's CSS, longhands in a fixed order. translate is the frame's move
  // from where the new element would sit, so a group she dragged keeps its move through the bake. margin is the
  // layers' outer margins, which the new element takes over (alBake).
  function alDeclarations(L, f, margin) {
    const y = L.flow === "vertical";
    const out = ["display: flex", "flex-direction: " + (y ? "column" : "row"), (y ? "row-gap: " : "column-gap: ") + L.gap + "px",
      "justify-content: " + ALIGN_CSS[L.main], "align-items: " + ALIGN_CSS[L.cross]];
    ["top", "right", "bottom", "left"].forEach((side, i) => { if (L.pad[i]) out.push("padding-" + side + ": " + L.pad[i] + "px"); });
    ["top", "right", "bottom", "left"].forEach((side, i) => { if (margin && +fmt2(margin[i])) out.push("margin-" + side + ": " + fmt2(margin[i]) + "px"); });
    out.push("width: fit-content");
    // To 2 decimals, as a K scale's values are: 1 would put a scaled group up to 0.05px off.
    const tx = +fmt2(f.fx - f.nx);
    const ty = +fmt2(f.fy - f.ny);
    if (tx || ty) out.push("translate: " + (tx || 0) + "px " + (ty || 0) + "px");
    return out.join("; ");
  }
  // What a group layout's layers need in the bake so the new element's flex puts them where she sees them. The
  // preview places border boxes, but flex adds every margin and collapses none: so the layers' margins go to 0 (the
  // gap holds the space between them) and the new element takes the outer ones (along the flow the first's start
  // and the last's end, across it the smallest), so it sits where they sat. A layer that filled its old parent
  // would shrink to its content in a hugging flex, so it keeps its size in px. One that ignores the layout is placed
  // by its margin box (absolute left and top place that) and keeps its width unless that's fixed (out of the flow it
  // shrinks to fit), as Ignore auto layout on a container does. wrap: the new element's margins. layers: [selector, declarations], in the code's order.
  function alBake(L, f) {
    const y = L.flow === "vertical";
    const SIDES = ["top", "right", "bottom", "left"];
    const n = (v) => parseFloat(v) || 0;
    // The code's own margins: the one spanGaps sets in a flex container stands in for the new element, not the code.
    const marginsOf = (t) => {
      const cs = getComputedStyle(t);
      const span = entryOf(t) && entryOf(t).spanGap;
      return ["top", "right", "bottom", "left"].map((side) => n(span && span.prop === "margin-" + side ? ownValue(t, span.prop) : cs["margin" + side[0].toUpperCase() + side.slice(1)]));
    };
    const wrap = [0, 0, 0, 0];
    const ms = new Map(f.flow.map((b) => [b, marginsOf(b.t)]));
    if (f.flow.length) {
      const [lead, trail, cLead, cTrail] = y ? [0, 2, 3, 1] : [3, 1, 0, 2];
      const all = f.flow.map((b) => ms.get(b));
      wrap[lead] = all[0][lead];
      wrap[trail] = all[all.length - 1][trail];
      wrap[cLead] = Math.min(...all.map((m) => m[cLead]));
      wrap[cTrail] = Math.min(...all.map((m) => m[cTrail]));
    }
    const layers = f.flow.concat(f.ignored).sort((a, b) => domOrder(a.t, b.t)).map((b) => {
      const out = [];
      const ignored = !ms.has(b);
      if (ignored) {
        const m = marginsOf(b.t);
        out.push("position: absolute", "left: " + round1(b.x - m[3] - f.fx) + "px", "top: " + round1(b.y - m[0] - f.fy) + "px");
      } else ms.get(b).forEach((v, i) => { if (round1(v)) out.push("margin-" + SIDES[i] + ": 0px"); });
      const [cw, ch] = boxCss(b.t, b.w, b.h);
      const wm = sizeModeOf(b.t, "w");
      if (wm === "fill" || (ignored && wm === "hug")) out.push("width: " + round1(cw) + "px");
      if (sizeModeOf(b.t, "h") === "fill") out.push("height: " + round1(ch) + "px");
      return [b.sel, out, b.t];
    }).filter((l) => l[1].length);
    return { wrap, layers };
  }
  // Why one auto layout can't hold these layers, or "" when it can. The bake wraps them in one new element, so they
  // must be HTML layers side by side in the code.
  function groupLayoutRefusal(list) {
    if (list.length < 2) return "Auto layout needs two or more layers";
    if (list.some((t) => t === pageEl || t === document.body || t === document.documentElement)) return "Auto layout can't hold the page itself";
    if (list.some(inSvg)) return "Auto layout works on HTML layers";
    if (list.some((t) => list.some((o) => o !== t && o.contains(t)))) return "One of these layers holds another";
    if (list.some((t) => t.parentElement !== list[0].parentElement)) return "These layers sit in different places in the code, so one auto layout can't hold them";
    if (drawnScaled(list)) return "These layers are drawn scaled or turned, so auto layout can't measure them";
    return "";
  }
  // Whether the layers are drawn at another size than their CSS gives them: a scale or a turn on their parent, or
  // further out. The group's gaps and moves are measured on screen but baked as CSS px, so there every number would
  // come out wrong. Read off a box's drawn size against its CSS size: the parent's, and each layer's that only moves.
  function drawnScaled(list) {
    const off = (e) => {
      if (!(e instanceof HTMLElement) || !e.offsetWidth || !e.offsetHeight) return false;
      const r = e.getBoundingClientRect();
      return Math.abs(r.width - e.offsetWidth) > 1 || Math.abs(r.height - e.offsetHeight) > 1;
    };
    const p = list[0].parentElement;
    if (p && p !== document.documentElement && off(p)) return true;
    return list.some((t) => {
      const cs = getComputedStyle(t);
      return cs.rotate === "none" && cs.scale === "none" && (cs.transform === "none" || /^matrix\(1, 0, 0, 1,/.test(cs.transform)) && off(t);
    });
  }
  // The group layout that keeps the layers where she sees them: the flow from how they sit (where they overlap both
  // ways, the axis they spread along most), then the gap and alignment read in screen order. reordered: the code's
  // order isn't the order on screen, so they'll swap places.
  function inferGroup(list) {
    const bs = list.slice().sort(domOrder).map(placeOf);
    const boxes = bs.map((b) => ({ el: b.t, l: b.x, t: b.y, r: b.x + b.w, b: b.y + b.h }));
    let inf = inferLayout(boxes);
    let overlap = false;
    if (inf.reason) {
      const spread = (k) => {
        const c = bs.map((b) => (k === "x" ? b.x + b.w / 2 : b.y + b.h / 2));
        return Math.max(...c) - Math.min(...c);
      };
      inf = { flow: spread("x") > spread("y") ? "horizontal" : "vertical" };
      overlap = true;
    }
    const lo = inf.flow === "vertical" ? "t" : "l";
    const reordered = boxes.some((b, i) => i && b[lo] < boxes[i - 1][lo] - 0.5);
    const out = inferLayout(boxes.slice().sort((a, b) => a[lo] - b[lo]), { flow: inf.flow });
    return Object.assign(out, { reordered, moves: out.moves || overlap });
  }

  // A layer tipped in 3D (a perspective() or a turn about x or y in its transform) is drawn as a slanted shape, not
  // a rectangle: its four corners on screen, so its outline hugs it instead of the box around it (getBoundingClientRect).
  // Worked out from its layout box and its own transform; null for a flat layer, or when a layer above it is
  // transformed too (it keeps the box). back: it's turned away from the window.
  const NUM_PX = /^-?[\d.]+(e-?\d+)?px$/;
  function quadOf(t) {
    if (!(t instanceof HTMLElement) || !t.offsetParent) return null;
    const cs = getComputedStyle(t);
    if (!cs.transform.startsWith("matrix3d")) return null;
    for (let a = t.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (as.transform !== "none" || as.translate !== "none" || as.rotate !== "none" || as.scale !== "none" || as.perspective !== "none") return null;
    }
    let m;
    try {
      const o = cs.transformOrigin.split(" ").map(parseFloat);
      const tr = cs.translate === "none" ? [] : cs.translate.split(" ");
      if (!tr.every((v) => NUM_PX.test(v))) return null;
      const [tx = 0, ty = 0, tz = 0] = tr.map(parseFloat);
      const r = cs.rotate.trim();
      const rot = r === "none" ? undefined : /\s/.test(r) ? "rotate3d(" + r.split(/\s+/).join(", ") + ")" : "rotate(" + r + ")";
      const sc = cs.scale === "none" ? [] : cs.scale.split(" ").map(parseFloat);
      m = new DOMMatrix()
        .translate(o[0] || 0, o[1] || 0, o[2] || 0)
        .translate(tx, ty, tz)
        .multiply(new DOMMatrix(rot))
        .scale(sc[0] ?? 1, sc[1] ?? sc[0] ?? 1, sc[2] ?? 1)
        .multiply(new DOMMatrix(cs.transform))
        .translate(-(o[0] || 0), -(o[1] || 0), -(o[2] || 0));
    } catch (e) {
      return null;
    }
    const p = t.offsetParent;
    const pr = p.getBoundingClientRect();
    const x0 = pr.left + p.clientLeft - p.scrollLeft + t.offsetLeft;
    const y0 = pr.top + p.clientTop - p.scrollTop + t.offsetTop;
    const w = t.offsetWidth;
    const h = t.offsetHeight;
    const pts = [[0, 0], [w, 0], [w, h], [0, h]].map(([x, y]) => m.transformPoint(new DOMPoint(x, y, 0, 1)));
    // A corner behind the eye: no shape to draw.
    if (pts.some((q) => q.w <= 0)) return { pts: [], back: true };
    const xy = pts.map((q) => [x0 + q.x / q.w, y0 + q.y / q.w]);
    let area = 0;
    xy.forEach(([x, y], i) => { const [x2, y2] = xy[(i + 1) % 4]; area += x * y2 - x2 * y; });
    return { pts: xy, back: area < 0 };
  }
  // Turned away with its back hidden (backface-visibility: hidden): nothing of it shows, so nothing outlines it.
  function facingAway(t) {
    const q = quadOf(t);
    return !!q && q.back && getComputedStyle(t).backfaceVisibility === "hidden";
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

  // A translate value read as the code writes it, per axis: px plus a share of the layer's own size (a %), which
  // is all a computed translate holds (calc() keeps the two apart). A third value (z) is kept as it is. null when
  // it's something else (a var() inline).
  function trAxes(v) {
    const s = String(v || "").trim();
    if (!s || s === "none") return [{ px: 0, pct: 0 }, { px: 0, pct: 0 }, ""];
    const parts = [];
    let depth = 0;
    let cur = "";
    for (const ch of s) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (/\s/.test(ch) && !depth) {
        if (cur) parts.push(cur);
        cur = "";
      } else cur += ch;
    }
    if (cur) parts.push(cur);
    const axis = (p) => {
      const out = { px: 0, pct: 0 };
      if (!p) return out;
      const body = /^calc\((.*)\)$/i.exec(p);
      const terms = (body ? body[1] : p).replace(/\s*([+-])\s+/g, " $1").trim().split(/\s+/);
      for (const term of terms) {
        const m = /^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(px|%)?$/i.exec(term);
        if (!m || (!m[2] && parseFloat(m[1]))) return null;
        out[m[2] === "%" ? "pct" : "px"] += parseFloat(m[1]);
      }
      return out;
    };
    const x = axis(parts[0]);
    const y = axis(parts[1]);
    return x && y && parts.length <= 3 ? [x, y, parts[2] || ""] : null;
  }
  // The translate she sees on t now: her own, else the code's at rest (a hover lift isn't where it sits).
  const trNow = (t) => (t.style.translate && trAxes(t.style.translate)) || trAxes(resting(t, "translate")) || trAxes("");
  // The translate the code gives t (its own inline one or its stylesheet's), as it was before her first move.
  function codeTrOf(t) {
    const o = originalOf(t);
    if (!("translate" in o.styles)) return resting(t, "translate");
    return o.codeTr != null ? o.codeTr : o.styles.translate || "none";
  }
  // A translate in px, its % worked out against the layer's own box (a % translate is a share of its own size).
  function trPx(t, ax) {
    const box = t instanceof HTMLElement ? { w: t.offsetWidth, h: t.offsetHeight } : t.getBBox ? (() => { try { const b = t.getBBox(); return { w: b.width, h: b.height }; } catch (e) { return { w: 0, h: 0 }; } })() : { w: 0, h: 0 };
    return [ax[0].px + (ax[0].pct / 100) * box.w, ax[1].px + (ax[1].pct / 100) * box.h];
  }
  // Writes a translate given per axis. Back on the code's own, the edit goes (and the code's inline value with it
  // comes back); otherwise the whole value is written, the code's share kept: a -50% stays -50% with her px added
  // in a calc(), so the bake keeps a centring the code made. Nothing at all, where the code has a translate, is none.
  // fine: to 0.01px, as Scale writes its sizes (else 0.1px).
  function writeTranslate(t, ax, fine) {
    const code = trAxes(codeTrOf(t));
    const step = fine ? 100 : 10;
    const near = (a, b) => Math.abs(a.px - b.px) < 0.5 / step && Math.abs(a.pct - b.pct) < 0.0005;
    if (code && near(ax[0], code[0]) && near(ax[1], code[1]) && (ax[2] || "") === (code[2] || "")) return handBack(t, "translate");
    const fmt = (a) => {
      const px = Math.round(a.px * step) / step;
      const pct = Math.round(a.pct * 1000) / 1000;
      if (!pct) return px + "px";
      if (!px) return pct + "%";
      return "calc(" + pct + "% " + (px < 0 ? "- " : "+ ") + Math.abs(px) + "px)";
    };
    const none = !ax[2] && [0, 1].every((i) => !Math.round(ax[i].px * step) && !Math.round(ax[i].pct * 1000));
    setStyle(t, "translate", none ? "none" : fmt(ax[0]) + " " + fmt(ax[1]) + (ax[2] ? " " + ax[2] : ""));
  }

  // A move by dx, dy as a translate, recorded like one typed into the Position fields. It adds to the translate
  // she sees, the code's included (taken over as hers), so a layer the code already moves goes on from there.
  // sim "stack" is Spacing's move on a free-flow container: its share is added up in entry.sim apart from her own
  // moves, so a change of Flow takes back just Spacing's share and a layer she moved keeps her move.
  function nudge(t, dx, dy, sim) {
    [dx, dy] = localDelta(t, dx, dy);
    const cur = trNow(t);
    cur[0].px += dx;
    cur[1].px += dy;
    boxed(t);
    writeTranslate(t, cur);
    if (sim) record(t, (entry) => {
      if (!entry.styles.translate) return;
      const was = entry.sim || { x: 0, y: 0 };
      const share = { x: Math.round((was.x + dx) * 10) / 10, y: Math.round((was.y + dy) * 10) / 10 };
      if (share.x || share.y) entry.sim = share;
      else delete entry.sim;
    });
  }

  // "All items" for the guide alignments: what she could select (text, images, boxes with a fill),
  // outermost only, so a card moves with the words inside it. Inside root when one is given (a full-width band's).
  function pageItems(root) {
    const all = Array.from((root || document.body).querySelectorAll("*")).filter((e) => {
      if (e === pageEl || isUi(e) || inSvg(e) || e.closest(".ft-guides, .ft-hover-box, .ft-sel-box, .ft-marquee, .ft-panel")) return false;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(e).visibility === "hidden") return false;
      return hasText(e) || e.tagName === "IMG" || e instanceof SVGSVGElement || !!toFill(getComputedStyle(e).backgroundColor);
    });
    return all.filter((e) => !all.some((o) => o !== e && o.contains(e)));
  }

  // The grid the page's code already has, read as a horizontal layout: the one the call declares (`layout`, the
  // site's decided grid, her call 2026-10-15: a site has its grid even where no CSS grid draws it), else its widest
  // CSS grid with four or more equal columns, at least half the window wide (a two-column list is content, not
  // the page's grid). Count and gutter are the grid's own; equal margins read as Stretch, otherwise Left with an
  // offset. A page with neither still has a grid when its sections sit in one centred content column and a grid
  // inside runs edge to edge of it (containerGrid).
  function pageGrid() {
    if (declaredGrid) return fromCode(Object.assign(newGuide(), declaredGrid), "layout");
    return fullGrid() || containerGrid();
  }
  // Whether a grid's column count comes from its own width (repeat(auto-fit or auto-fill, ...)) rather than the
  // window's: no rule or variant holds a count for it, so Copy says so and the bake writes px. The computed tracks
  // are px either way, so it's read by giving the grid half its width for a moment and put straight back.
  function fluidGrid(p) {
    const count = () => getComputedStyle(p).gridTemplateColumns.split(/\s+/).map(parseFloat).filter(isNum).length;
    const n = count();
    const was = p.style.getPropertyValue("width");
    const pri = p.style.getPropertyPriority("width");
    still(p, true);
    p.style.setProperty("width", Math.round(p.getBoundingClientRect().width / 2) + "px", "important");
    const half = count();
    if (was) p.style.setProperty("width", was, pri);
    else p.style.removeProperty("width");
    tidyStyle(p);
    flush();
    still(p, false);
    return half !== n;
  }
  // The column of grid p that its item t starts in as the code places it (finetune's px translate taken off),
  // 1-based; 0 when it can't be read.
  function itemColumn(t, p) {
    const m = /^(-?[\d.]+)px(?:\s+-?[\d.]+px)?$|^none$/.exec(getComputedStyle(t).translate);
    if (!m) return 0;
    const cs = getComputedStyle(p);
    const tracks = cs.gridTemplateColumns.split(/\s+/).map(parseFloat).filter(isNum);
    const gap = parseFloat(cs.columnGap) || 0;
    let x = p.getBoundingClientRect().left + (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.borderLeftWidth) || 0);
    const left = t.getBoundingClientRect().left - (parseFloat(m[1]) || 0);
    for (let i = 0; i < tracks.length; i++) {
      if (left < x + tracks[i] + gap / 2) return i + 1;
      x += tracks[i] + gap;
    }
    return 0;
  }
  // A grid's or a box's own selector for Copy: its id, else up to four of its classes, else its tag.
  const gridName = (e) => (e.id ? "#" + CSS.escape(e.id)
    : e.classList.length ? Array.from(e.classList).slice(0, 4).map((c) => "." + CSS.escape(c)).join("") : e.localName);
  function fullGrid() {
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
    return fromCode(g, gridName(best.e));
  }
  // The content column most of the page sits in, as vibecoded sites build it (.container, mx-auto max-w-7xl px-6,
  // width: min(1100px, 92vw), a section with padding-inline): boxes centred in the window by a max-width, side
  // padding or auto margins, grouped by their content edges. The group down the most of the page's height wins (two
  // or more boxes, or one down 40% of it). Its columns are those of the grids inside it that run edge to edge of
  // it with two or more equal tracks, the most common count and gap among them (a tie goes to more columns, the finer
  // grid). A content column with no such grid gives no layout: "Layout not defined" stays (her call 2026-10-15).
  function containerGrid() {
    const W = document.documentElement.clientWidth;
    const H = document.documentElement.scrollHeight;
    const px = (cs, k) => parseFloat(cs[k]) || 0;
    const content = (r, cs) => [r.left + px(cs, "paddingLeft") + px(cs, "borderLeftWidth"), r.right - px(cs, "paddingRight") - px(cs, "borderRightWidth")];
    const cols = new Map();
    const grids = [];
    for (const e of document.body.querySelectorAll("*")) {
      if (isUi(e) || e.closest(".ft-guides, .ft-panel")) continue;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(e);
      const [left, right] = content(r, cs);
      if (cs.display === "grid" || cs.display === "inline-grid") {
        const tracks = cs.gridTemplateColumns.split(/\s+/).map(parseFloat).filter(isNum);
        const avg = tracks.reduce((a, b) => a + b, 0) / tracks.length;
        if (tracks.length >= 2 && avg > 0 && tracks.every((t) => Math.abs(t - avg) <= 1)) {
          grids.push({ e, left, right, n: tracks.length, gap: Math.round(px(cs, "columnGap")) });
        }
      }
      if (Math.abs(r.left - (W - r.right)) > 1 || right - left < 1) continue;
      const centred = cs.maxWidth !== "none" || (px(cs, "paddingLeft") > 0 && px(cs, "paddingRight") > 0)
        || (px(cs, "marginLeft") > 0 && Math.abs(px(cs, "marginLeft") - px(cs, "marginRight")) <= 1);
      if (!centred) continue;
      const k = Math.round(left) + "," + Math.round(right);
      if (!cols.has(k)) cols.set(k, { left, right, boxes: [], spans: [] });
      const c = cols.get(k);
      c.boxes.push(e);
      c.spans.push([r.top, r.bottom]);
    }
    // How much of the page's height a group covers: its boxes' spans merged, so nested boxes count once.
    const covered = (spans) => {
      let sum = 0;
      let end = -Infinity;
      spans.slice().sort((a, b) => a[0] - b[0]).forEach(([a, b]) => {
        if (b <= end) return;
        sum += b - Math.max(a, end);
        end = b;
      });
      return sum;
    };
    // Only a group with a grid edge to edge across it can be the content column: padded full-width sections around a
    // narrower container cover more height (their padding counts) but hold no grid themselves.
    let col = null;
    let fits = [];
    cols.forEach((c) => {
      c.h = covered(c.spans);
      if (!(c.boxes.length >= 2 || c.h >= 0.4 * H) || (col && c.h <= col.h)) return;
      const f = grids.filter((g) => Math.abs(g.left - c.left) <= 1 && Math.abs(g.right - c.right) <= 1);
      if (!f.length) return;
      col = c;
      fits = f;
    });
    if (!col) return null;
    const tally = new Map();
    fits.forEach((g) => {
      const k = g.n + "," + g.gap;
      tally.set(k, (tally.get(k) || []).concat(g));
    });
    const [n, gap] = Array.from(tally.keys()).sort((a, b) => tally.get(b).length - tally.get(a).length
      || parseInt(b) - parseInt(a))[0].split(",").map(Number);
    const left = col.left;
    const right = col.right;
    const g = Object.assign(newGuide(), { count: n, gutter: gap });
    if (Math.abs(left - (W - right)) <= 1) Object.assign(g, { align: "stretch", offset: Math.round(left) });
    else Object.assign(g, { align: "left", offset: Math.round(left), width: Math.round((right - left - (n - 1) * gap) / n) });
    // Named as the code has it, so Copy's columns comment and the bake find it: each of those grids inside the
    // content column (a grid that is the column itself by its own name), as one selector list.
    const names = [];
    tally.get(n + "," + gap).forEach((gr) => {
      const box = col.boxes.find((b) => b !== gr.e && b.contains(gr.e));
      const name = (box ? gridName(box) + " " : "") + gridName(gr.e);
      if (!names.includes(name)) names.push(name);
    });
    return fromCode(g, names.join(", "));
  }
  // Where the page's grid comes from in the code (the grid's own classes, or "layout" for the call's), for Copy's
  // columns comment. Not enumerable, so the guides copied from it, saved with the edits, don't carry it.
  function fromCode(g, source) {
    return Object.defineProperty(g, "source", { value: source });
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
  // A box across the whole guide, its first column's left edge to its last one's right: a full-width band (a
  // section, a header), not a layer to line up with columns.
  function spansGuide(r, g) {
    const { starts, ends } = guideEdges(g);
    return r.left <= starts[0] + 1 && r.right >= ends[ends.length - 1] - 1;
  }

  // What the guide alignments move: each group as one, then every other item on its own.
  // A unit that spans the whole guide (a section, a header, a footer: a full-width band) isn't moved, since lining
  // its edge up with a column would push it off the page; the items inside it are taken instead, the same way, down
  // to ones that fit. A band with nothing inside stays put.
  function pageUnits(g) {
    const groups = edits.groups.map(groupMembers).filter((m) => m.length);
    const grouped = groups.flat();
    const loose = (root) => pageItems(root).filter((t) => !grouped.some((m) => m !== root && (m === t || m.contains(t) || t.contains(m))));
    const units = [];
    const take = (unit) => {
      if (!g || !spansGuide(unionRect(unit), g)) return units.push(unit);
      if (unit.length > 1) return unit.forEach((t) => take([t]));
      loose(unit[0]).forEach((t) => take([t]));
    };
    groups.concat(loose().map((t) => [t])).forEach(take);
    return units;
  }

  const nearest = (list, v) => list.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  const ALIGN_WORD = { left: "left", right: "right", hcenter: "horizontally" };

  // Align items to nearest column: each item's left or right edge snaps to the nearest column edge;
  // horizontally puts each item in the middle of the page instead. Every move is recorded.
  function alignAll(g, how) {
    const W = document.documentElement.clientWidth;
    let moved = false;
    pageUnits(g).forEach((unit) => {
      const r = unionRect(unit);
      const dx = how === "left" ? nearest(guideEdges(g).starts, r.left) - r.left
        : how === "right" ? nearest(guideEdges(g).ends, r.right) - r.right
          : W / 2 - (r.left + r.width / 2);
      if (Math.abs(dx) < 0.05) return;
      unit.forEach((t) => nudge(t, dx, 0));
      moved = true;
    });
    // Nothing moved, no step: an Undo here would take back the edit before it.
    if (moved) actionToast("Align all items " + ALIGN_WORD[how]);
  }

  // The columns layout that shows (one at a time), and column i of it as a box down the window.
  const shownGuide = () => edits.guides.find((g) => g.visible) || null;
  function columnRect(i) {
    const g = shownGuide();
    if (!g || i >= g.count) return null;
    const { starts, ends } = guideEdges(g);
    return { left: starts[i], right: ends[i], width: ends[i] - starts[i], top: 0, bottom: window.innerHeight, height: window.innerHeight };
  }
  // The columns picked, as one box: from the leftmost one's left edge to the rightmost one's right edge.
  function columnsRect(cols) {
    const a = columnRect(Math.min(...cols));
    const b = columnRect(Math.max(...cols));
    return a && b ? { left: a.left, right: b.right, width: b.right - a.left, top: 0, bottom: a.bottom, height: a.height } : null;
  }
  // How many columns that box spans, the ones between included.
  const columnSpan = (cols) => Math.max(...cols) - Math.min(...cols) + 1;
  // Columns picked with layers (Design, the layout showing): the layers line up with the leftmost column's left
  // edge, the middle of the columns or the rightmost one's right edge (one column: its own edges and middle),
  // moved as alignSelection moves them (a group as one).
  function alignToColumns(cols, list, how) {
    const box = columnsRect(cols);
    if (!box) return;
    alignSelection(list, how, box);
    noteColumns(cols, list, how);
  }
  // Which columns a layer was lined up with or sized to, kept on its edit so Copy can say so while it still sits
  // there: the bake can then place it in the page's grid (a grid-column) rather than write the px it landed at.
  // source is the page's grid in the code when the guide is still on its numbers, else "guide" (her own guide).
  function noteColumns(cols, list, how) {
    const g = shownGuide();
    if (!g) return;
    const base = {
      first: Math.min(...cols) + 1, last: Math.max(...cols) + 1, count: g.count, how, gutter: g.gutter, align: g.align,
      source: (pageDefault && sameNums(g, pageDefault) && pageDefault.source) || "guide", vw: window.innerWidth,
    };
    if (g.align === "stretch") base.margin = g.offset;
    else Object.assign(base, { offset: g.offset, colWidth: g.width });
    // Only a layer that sits on the columns by itself is noted: one in a ⌘G group moved or scaled as one unit fills
    // just its part of the span, and a grid-column for the whole span would stretch it over its neighbours.
    const box = columnsRect(cols);
    const on = (r) => !box ? false : how === "left" ? Math.abs(r.left - box.left) <= 0.5
      : how === "right" ? Math.abs(r.right - box.right) <= 0.5
        : how === "hcenter" ? Math.abs(r.left + r.width / 2 - (box.left + box.width / 2)) <= 0.5
          : Math.abs(r.left - box.left) <= 0.5 && Math.abs(r.width - box.width) <= 0.5;
    list.filter((t) => !list.some((o) => o !== t && o.contains(t))).forEach((t) => {
      const entry = edits.elements[keyOf(t)];
      if (!entry) return;
      const r = t.getBoundingClientRect();
      if (on(r)) entry.cols = Object.assign({ left: round2(r.left + window.scrollX), width: round2(r.width) }, base);
      else delete entry.cols;
    });
    noteChange();
  }
  // Match item widths to the columns: each layer (the outermost picked) takes their width and lines up with the
  // leftmost one. It's a width change like a typed W (resizeLayer): what's inside wraps, and an image, a video, an
  // <svg>, a vector or a box the code gives an aspect-ratio keeps its proportions (her call: images scale, and the
  // item's height changes with its width), as does a layer with its lock on. A ⌘G group is one box, as Figma resizes
  // a group: each layer's width and its place across the group scale by the span over the group's width, so the
  // layers keep their spacing rather than all landing on the span's left edge.
  function matchColumns(cols, list) {
    const box = columnsRect(cols);
    if (!box) return;
    const top = list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
    const keeps = (t) => isVector(t) || ratioDriven(t) || ratioLocked(t);
    const groups = edits.groups.map(groupMembers).filter((m) => m.length > 1 && m.every((t) => top.includes(t)));
    const grouped = groups.flat();
    const units = groups.concat(top.filter((t) => !grouped.includes(t)).map((t) => [t]));
    units.forEach((unit) => {
      if (unit.length === 1) return resizeLayer(unit[0], Math.round(box.width), null, { locked: keeps(unit[0]) });
      const u = unionRect(unit);
      if (!u.width) return;
      const f = box.width / u.width;
      const at = unit.map((t) => t.getBoundingClientRect().left - u.left);
      unit.forEach((t) => resizeLayer(t, round2(exactSize(t).w * f), null, { locked: keeps(t) }));
      unit.forEach((t, i) => {
        const dx = u.left + at[i] * f - t.getBoundingClientRect().left;
        if (Math.abs(dx) >= 0.05) nudge(t, dx, 0);
      });
    });
    alignTo(units, box, "left");
    noteColumns(cols, list, "width");
  }

  // Figma's Alignment for a selection: every layer lines up on an edge or the middle of the selection's box (or
  // of box, a column's). A selected group moves as one. A selection that is just one group is one unit too (her rule,
  // 2026-10-17: groups are always a single unit): it lines up inside the layer that holds its layers, as one layer
  // lines up inside its parent, its layers keeping their places in it. A layer inside another selected one rides along
  // with it. Every move is recorded.
  function alignSelection(list, how, box) {
    const top = outermost(list);
    const units = selectionUnits(list);
    if (units.length === top.length && top.length > 1 && edits.groups.some((g) => sameSet(g, top.map(keyOf)))) {
      // The layer that holds them all (their parent, through any display: contents wrapper).
      let holder = top[0].parentElement;
      while (holder && !top.every((t) => holder.contains(t))) holder = holder.parentElement;
      if (box) return alignTo([top], box, how);
      if (holder) return alignTo([top], innerBox(holder), how);
    }
    alignTo(units, box || unionRect(top), how);
  }
  const outermost = (list) => list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
  // What a selection's alignment and spacing move, each unit as one: a ⌘G group whose layers are all in it, then
  // every other outermost layer on its own. A selection that is just one group moves its own layers.
  function selectionUnits(list) {
    const top = outermost(list);
    const groups = edits.groups.map(groupMembers).filter((m) => m.length > 1 && m.every((t) => top.includes(t)));
    const grouped = groups.flat();
    return groups.length === 1 && grouped.length === top.length ? top.map((t) => [t])
      : groups.concat(top.filter((t) => !grouped.includes(t)).map((t) => [t]));
  }

  // One layer lines up inside its parent, as in Figma's frame: the parent's box inside its border and
  // padding (a display: contents parent has no box, so its own parent counts).
  function alignToParent(t, how) {
    let p = t.parentElement;
    while (p && p !== document.body && getComputedStyle(p).display === "contents") p = p.parentElement;
    if (!p) return;
    alignTo([[t]], innerBox(p), how);
  }
  // A layer's box inside its border and padding, what the layers it holds line up in (a display: contents layer has
  // no box, so the one holding it counts).
  function innerBox(p) {
    while (p && p !== document.body && getComputedStyle(p).display === "contents") p = p.parentElement;
    const r = p.getBoundingClientRect();
    const cs = getComputedStyle(p);
    const px = (k) => parseFloat(cs[k]) || 0;
    const left = r.left + px("borderLeftWidth") + px("paddingLeft");
    const right = r.right - px("borderRightWidth") - px("paddingRight");
    const top = r.top + px("borderTopWidth") + px("paddingTop");
    const bottom = r.bottom - px("borderBottomWidth") - px("paddingBottom");
    return { left, right, top, bottom, width: right - left, height: bottom - top };
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
  // ways (then there's no single spacing to set). A stack once read is kept (axis and order), so one spaced closer
  // than touching (a negative Spacing, which overlaps them) still reads as that stack while its items keep their
  // order along it, and Spacing can be typed back. An item is a layer, or a unit of layers that moves as one (a
  // plain selection's ⌘G group, see selectionUnits), read as the box around them.
  const stacksSeen = new Map();
  const unitRect = (u) => (Array.isArray(u) ? unionRect(u) : u.getBoundingClientRect());
  // Units are built afresh on every read, so a kept stack knows its items by selector, not by reference.
  const unitId = (u) => (Array.isArray(u) ? u.map(selectorFor).join(",") : selectorFor(u));
  function stackOf(items) {
    const rs = items.map((t) => ({ t, r: unitRect(t), id: unitId(t) })).filter((x) => x.r.width || x.r.height);
    if (rs.length < 2) return null;
    const key = rs.map((x) => x.id).sort().join("\n");
    const edges = (axis) => (axis === "y" ? ["top", "bottom"] : ["left", "right"]);
    const run = (axis) => {
      const [lo, hi] = edges(axis);
      const sorted = rs.slice().sort((a, b) => a.r[lo] - b.r[lo]);
      if (!sorted.every((x, i) => !i || x.r[lo] >= sorted[i - 1].r[hi] - 0.5)) return null;
      return { axis, items: sorted.map((x) => x.t), gaps: sorted.slice(1).map((x, i) => x.r[lo] - sorted[i].r[hi]) };
    };
    const st = run("y") || run("x");
    if (st) {
      stacksSeen.set(key, { axis: st.axis, ids: st.items.map(unitId) });
      return st;
    }
    const kept = stacksSeen.get(key);
    if (!kept) return null;
    const [lo, hi] = edges(kept.axis);
    const order = kept.ids.map((id) => rs.find((x) => x.id === id));
    if (order.some((x) => !x) || !order.every((x, i) => !i || x.r[lo] > order[i - 1].r[lo] + 0.5)) return null;
    return { axis: kept.axis, items: order.map((x) => x.t), gaps: order.slice(1).map((x, i) => x.r[lo] - order[i].r[hi]) };
  }

  // Sets every gap in the stack to n by moving each item after the first (so the ones below move down too).
  // In a ⌘G group each move is marked as Spacing's (sim), so a change of Flow can take it back (the flex gap then
  // spaces them instead). A plain selection has no Flow, so its moves are her own (sim null).
  function setStackGap(stack, n, sim = "stack") {
    const y = stack.axis === "y";
    let edge = null;
    // Each item is measured after the one before it moves, so a transition (Tailwind's transition-all on a card)
    // would leave it mid-way and every later gap off. They land at once instead, as a drag's moves do.
    const all = stack.items.flatMap((t) => (Array.isArray(t) ? t : [t]));
    all.forEach((t) => still(t, true));
    flush();
    stack.items.forEach((t, i) => {
      if (i) {
        const r = unitRect(t);
        const d = edge + n - (y ? r.top : r.left);
        if (Math.abs(d) >= 0.05) (Array.isArray(t) ? t : [t]).forEach((m) => nudge(m, y ? 0 : d, y ? d : 0, sim));
      }
      const r2 = unitRect(t);
      edge = y ? r2.bottom : r2.right;
    });
    flush();
    all.forEach((t) => still(t, false));
  }

  // Figma's Distribute horizontal (or vertical) spacing on a plain selection: the units, leftmost to rightmost (top
  // to bottom), keep the outer two where they are and space the rest evenly between them. It takes three; with two
  // there's nothing between. Each move is an ordinary recorded translate. False when nothing moved.
  function distributeSelection(list, axis) {
    const units = selectionUnits(list);
    if (units.length < 3) return false;
    const y = axis === "y";
    const [lo, hi] = y ? ["top", "bottom"] : ["left", "right"];
    const rs = units.map((u) => ({ u, r: unionRect(u) })).sort((a, b) => a.r[lo] - b.r[lo] || a.r[hi] - b.r[hi]);
    const start = rs[0].r[lo];
    const end = Math.max(...rs.map((x) => x.r[hi]));
    const sizes = rs.map((x) => x.r[hi] - x.r[lo]);
    const gap = (end - start - sizes.reduce((a, b) => a + b, 0)) / (rs.length - 1);
    let edge = start;
    let moved = false;
    rs.forEach((x, i) => {
      const d = edge - x.r[lo];
      if (Math.abs(d) >= 0.05) {
        x.u.forEach((t) => nudge(t, y ? 0 : d, y ? d : 0));
        moved = true;
      }
      edge += sizes[i] + gap;
    });
    return moved;
  }

  // The spacing most of the gaps share (Figma's Tidy up keeps it): gaps are counted to the nearest px, the smallest
  // wins a tie, and the result is their own mean, so gaps the code already lays out at 7.7 stay 7.7 rather than each
  // gaining a sub-pixel move. Overlaps (negative gaps) don't count, since tidied nothing overlaps. null when there's
  // no gap to go by.
  function commonGap(gaps) {
    const counts = new Map();
    gaps.filter((g) => g >= -0.5).forEach((g) => {
      const n = Math.max(0, Math.round(g));
      counts.set(n, (counts.get(n) || []).concat(Math.max(0, g)));
    });
    let best = null;
    counts.forEach((list, n) => {
      if (!best || list.length > best.list.length || (list.length === best.list.length && n < best.n)) best = { n, list };
    });
    return best ? best.list.reduce((a, b) => a + b, 0) / best.list.length : null;
  }

  // Figma's Tidy up on a plain selection. Units are read into rows and columns. One row is spaced along at its most
  // common gap from its leftmost unit, each unit keeping its height on the page; one column the same way down (units
  // that share both, piled up, go the way the selection is longer). Otherwise they become a grid from the selection's
  // top left: a unit's column is its place in its row, each column as wide as its widest unit and each row as tall as
  // its tallest, at the most common gap across and down. False when nothing moved.
  function tidySelection(list) {
    const units = selectionUnits(list);
    if (units.length < 2) return false;
    const rs = units.map((u) => ({ u, r: unionRect(u) }));
    // A unit joins the row (or column) its first unit starts when either one's middle falls inside the other, so one
    // wide layer that overlaps everything doesn't chain them all into one band.
    const bands = (lo, hi) => {
      const out = [];
      const mid = (r) => (r[lo] + r[hi]) / 2;
      const inside = (v, r) => v >= r[lo] - 0.5 && v <= r[hi] + 0.5;
      rs.slice().sort((a, b) => a.r[lo] - b.r[lo]).forEach((x) => {
        const band = out.find((b) => inside(mid(x.r), b[0].r) || inside(mid(b[0].r), x.r));
        if (band) band.push(x);
        else out.push([x]);
      });
      return out;
    };
    const rows = bands("top", "bottom");
    const cols = bands("left", "right");
    let moved = false;
    const move = (x, dx, dy) => {
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) return;
      x.u.forEach((t) => nudge(t, dx, dy));
      moved = true;
    };
    const line = (y) => {
      const [lo, hi] = y ? ["top", "bottom"] : ["left", "right"];
      const sorted = rs.slice().sort((a, b) => a.r[lo] - b.r[lo]);
      const gap = commonGap(sorted.slice(1).map((x, i) => x.r[lo] - sorted[i].r[hi])) || 0;
      let edge = sorted[0].r[lo];
      sorted.forEach((x) => {
        const d = edge - x.r[lo];
        move(x, y ? 0 : d, y ? d : 0);
        edge += x.r[hi] - x.r[lo] + gap;
      });
    };
    const all = unionRect(units.flat());
    if (rows.length === 1 && (cols.length > 1 || all.width >= all.height)) line(false);
    else if (cols.length === 1) line(true);
    else {
      const grid = rows.map((row) => row.slice().sort((a, b) => a.r.left - b.r.left));
      const hGap0 = commonGap(grid.flatMap((row) => row.slice(1).map((x, i) => x.r.left - row[i].r.right)));
      const tops = grid.map((row) => Math.min(...row.map((x) => x.r.top)));
      const bottoms = grid.map((row) => Math.max(...row.map((x) => x.r.bottom)));
      const vGap0 = commonGap(tops.slice(1).map((t, i) => t - bottoms[i]));
      // A direction with no gap to go by (its layers all overlap) takes the other's, as a grid's gaps usually match.
      const hGap = hGap0 ?? vGap0 ?? 0;
      const vGap = vGap0 ?? hGap0 ?? 0;
      const widths = [];
      grid.forEach((row) => row.forEach((x, c) => { widths[c] = Math.max(widths[c] || 0, x.r.width); }));
      const left0 = Math.min(...rs.map((x) => x.r.left));
      let top = tops[0];
      grid.forEach((row, r) => {
        let left = left0;
        row.forEach((x, c) => {
          move(x, left - x.r.left, top - x.r.top);
          left += widths[c] + hGap;
        });
        top += Math.max(...row.map((x) => x.r.height)) + vGap;
      });
    }
    return moved;
  }

  // What the page itself says for a property, written back only where it differs (so a value that matches the
  // code leaves no edit behind).
  function setUnlessOwn(t, prop, value) {
    if (ownValue(t, prop) === value) handBack(t, prop);
    else setStyle(t, prop, value);
  }

  // Takes the edit off and puts back the layer's own inline value, if the code wrote one (a React style prop):
  // setStyle's "" only removes, which would also drop the code's inline value until the next undo.
  function handBack(t, prop) {
    // On a component, the "" went to every instance, and each was written again (see paintComps): the code's own value
    // back, or what another component edit still gives it (FeatureCard's, around this Card).
    const shared = sharedComponent(t, prop);
    setStyle(t, prop, "");
    if (shared) return;
    // An instance's own override taken off falls back the same way.
    if (Object.keys(edits.components).some((k) => rankOf(t, k) >= 0)) return paintComps(t, [prop]);
    const own = originalOf(t).styles[prop];
    if (own) t.style.setProperty(prop, own);
  }

  // Figma's Resizing inside auto layout (Fixed, Hug, Fill) and Ignore auto layout, written as CSS longhands only:
  // the flex shorthand next to its own longhands would make undo depend on the order they were written in.

  // The parent a layer is laid out in, when it is auto layout (a flex or a grid), past any display: contents
  // wrapper as alignToParent reads it. main is the axis a flex runs along ("w" for a row); a grid has none.
  // inFlow is false for a layer taken out of the flow (absolute or fixed), which the parent no longer sizes.
  function layoutParentOf(t) {
    if (!(t instanceof HTMLElement) && !isSvgRoot(t)) return null;
    let p = t.parentElement;
    while (p && p !== document.body && getComputedStyle(p).display === "contents") p = p.parentElement;
    if (!p) return null;
    const cs = getComputedStyle(p);
    if (!/flex|grid/.test(cs.display)) return null;
    const flex = /flex/.test(cs.display);
    const pos = getComputedStyle(t).position;
    return { el: p, flex, main: flex ? (/column/.test(cs.flexDirection) ? "h" : "w") : null, inFlow: pos !== "absolute" && pos !== "fixed" };
  }
  // Across a flex (or along either axis of a grid) a child fills by stretching: align-self, or justify-self for a
  // grid's columns.
  const selfProp = (lp, axis) => (!lp.flex && axis === "w" ? "justify-self" : "align-self");
  // Whether it stretches: its own value, or the parent's -items when its own says auto. normal stretches a box too.
  function stretches(t, lp, axis) {
    const prop = selfProp(lp, axis);
    let v = getComputedStyle(t).getPropertyValue(prop).trim();
    if (v === "auto") v = getComputedStyle(lp.el).getPropertyValue(prop === "align-self" ? "align-items" : "justify-items").trim();
    return /^(stretch|normal|legacy)$/.test(v);
  }
  // A layer's size along one axis as it is, then with its own size hugging (fit-content), then with its own size
  // auto, each read with the inline value swapped in and put straight back. Costs two forced layouts, so it's read
  // when the panel is built or forced, never on scroll.
  function sizeTrial(t, axis) {
    const prop = axis === "w" ? "width" : "height";
    const get = () => {
      const v = axis === "w" ? t.offsetWidth : t.offsetHeight;
      return v != null ? v : t.getBoundingClientRect()[prop];
    };
    const was = t.style.getPropertyValue(prop);
    const pri = t.style.getPropertyPriority(prop);
    still(t, true);
    const now = get();
    t.style.setProperty(prop, "fit-content");
    const hug = get();
    t.style.setProperty(prop, "auto");
    const auto = get();
    if (was) t.style.setProperty(prop, was, pri);
    else t.style.removeProperty(prop);
    tidyStyle(t);
    flush();
    still(t, false);
    return { now, hug, auto };
  }
  // A layer's size across its auto layout with its own alignment set to start for a moment, so it doesn't stretch.
  function unstretchedSize(t, lp, axis) {
    const prop = selfProp(lp, axis);
    const was = t.style.getPropertyValue(prop);
    const pri = t.style.getPropertyPriority(prop);
    still(t, true);
    t.style.setProperty(prop, lp.flex ? "flex-start" : "start");
    const v = axis === "w" ? t.offsetWidth : t.offsetHeight;
    if (was) t.style.setProperty(prop, was, pri);
    else t.style.removeProperty(prop);
    tidyStyle(t);
    flush();
    still(t, false);
    return v;
  }
  // Whether nothing sets this axis's size, so it's whatever the layout gives it.
  const sizedByLayout = (t, axis) => {
    const s = sizeTrial(t, axis);
    return Math.abs(s.now - s.auto) < 0.5;
  };
  // Resizing as Figma would read it off the code: "fixed", "hug" or "fill".
  function sizeModeOf(t, axis) {
    const lp = layoutParentOf(t);
    const laid = lp && lp.inFlow;
    if (laid && lp.main === axis && parseFloat(getComputedStyle(t).flexGrow) > 0) return "fill";
    // A size written as a length is Fixed even when it matches the content: the trials below can't tell a 196px
    // width from a hug of 196. A percentage isn't one, as it follows the parent. Along a flex, a basis that's a
    // length sizes the box whatever its width says.
    const own = t.style.getPropertyValue(axis === "w" ? "width" : "height");
    if (own && /\d/.test(own) && !/%/.test(own)) return "fixed";
    if (laid && lp.flex && lp.main === axis && /\d/.test(getComputedStyle(t).flexBasis)) return "fixed";
    const s = sizeTrial(t, axis);
    if (laid && lp.main !== axis && stretches(t, lp, axis) && Math.abs(s.now - s.auto) < 0.5) {
      // CSS stretches only a box whose own size is auto. One the stylesheet sizes (a class's height: 30px) keeps that
      // size when it stops stretching, where an auto one hugs its content: that's Fixed, even when the row happens
      // to be as tall.
      return Math.abs(unstretchedSize(t, lp, axis) - s.hug) >= 0.5 ? "fixed" : "fill";
    }
    if (Math.abs(s.now - s.hug) < 0.5) return "hug";
    if (Math.abs(s.now - s.auto) < 0.5 && s.auto > s.hug + 0.5) return "fill";
    return "fixed";
  }
  // Whether finetune changed a property (on the layer, or on its component), as against the code's own value.
  const editedHere = (t, prop) => prop in originalOf(t).styles && t.style.getPropertyValue(prop) !== originalOf(t).styles[prop];
  // Leaving Fill (or Fixed's shrink lock): what finetune wrote for it goes back to the code's own.
  function unfill(t, lp, axis) {
    const props = lp.main === axis ? ["flex-grow", "flex-shrink", "flex-basis", axis === "w" ? "min-width" : "min-height"] : [selfProp(lp, axis)];
    props.forEach((p) => { if (editedHere(t, p)) handBack(t, p); });
  }
  // Fixed along one axis: the size as px (when px is given), and inside auto layout whatever would still grow,
  // shrink or stretch it switched off, so the number holds. A corner drag and a typed W or H come here too.
  function fixAxis(t, axis, px) {
    const lp = layoutParentOf(t);
    if (lp && lp.inFlow) {
      unfill(t, lp, axis);
      if (lp.main === axis) {
        setUnlessOwn(t, "flex-grow", "0");
        setUnlessOwn(t, "flex-shrink", "0");
        setUnlessOwn(t, "flex-basis", "auto");
      } else if (stretches(t, lp, axis) && sizedByLayout(t, axis)) {
        // A px size already beats the stretch; start keeps it from reading as Fill when the two happen to match.
        setUnlessOwn(t, selfProp(lp, axis), lp.flex ? "flex-start" : "start");
      }
    }
    if (px != null) setSize(t, axis === "w" ? px : null, axis === "h" ? px : null);
  }
  // Hug contents (a container): its size from what's inside. The code's own size is handed back first, and
  // fit-content written only when that doesn't already hug (fit-content also beats a stretch, which auto doesn't).
  function hugAxis(t, axis) {
    const lp = layoutParentOf(t);
    const prop = axis === "w" ? "width" : "height";
    if (lp && lp.inFlow) {
      unfill(t, lp, axis);
      if (lp.main === axis) {
        setUnlessOwn(t, "flex-grow", "0");
        setUnlessOwn(t, "flex-basis", "auto");
      }
    }
    handBack(t, prop);
    if (sizeModeOf(t, axis) !== "hug") setStyle(t, prop, "fit-content");
  }
  // Fill container: along the flex, grow from nothing (min 0, so long words can't push it past its share); across
  // it, stretch. Its own size goes, as a size would stop the stretch.
  function fillAxis(t, axis) {
    const lp = layoutParentOf(t);
    if (!lp || !lp.inFlow) return;
    const prop = axis === "w" ? "width" : "height";
    unfill(t, lp, axis);
    if (lp.main === axis) {
      // A parent that hugs along the flex has no room to grow into, so a basis of 0 would collapse the layer. As
      // in Figma, the parent turns Fixed at the size it has now.
      if (sizeModeOf(lp.el, axis) === "hug") {
        const ps = sizeOf(lp.el);
        fixAxis(lp.el, axis, Math.round(axis === "w" ? ps.w : ps.h));
      }
      setUnlessOwn(t, "flex-grow", "1");
      setUnlessOwn(t, "flex-basis", "0px");
      setUnlessOwn(t, axis === "w" ? "min-width" : "min-height", "0px");
      // A basis of 0 already outranks any width the code sets, so none is written.
      handBack(t, prop);
      return;
    }
    setUnlessOwn(t, selfProp(lp, axis), "stretch");
    handBack(t, prop);
    if (!sizedByLayout(t, axis)) setStyle(t, prop, "auto");
  }
  function setSizeMode(t, axis, mode) {
    if (mode === "fill") return fillAxis(t, axis);
    if (mode === "hug") return hugAxis(t, axis);
    const s = sizeOf(t);
    fixAxis(t, axis, Math.round(axis === "w" ? s.w : s.h));
  }

  // Figma's resize, the one path a typed W or H, Make selected N cols wide and a handle drag all take. Unlike Scale (K)
  // it changes a size, never what's inside: text, strokes and corner radius keep their px.

  // The lock beside W and H (Constrain proportions), per layer. Off until she turns it on, images included, so a W
  // or an H changes only itself (her call, 2026-10-15).
  const ratioLocks = new WeakMap();
  const ratioLocked = (t) => !!ratioLocks.get(t);
  // Whether the code makes one axis follow the other when only one is set: a CSS aspect-ratio, or the own ratio of an
  // image, a video, a canvas or an <svg> whose other axis is left auto.
  function ratioDriven(t) {
    if (!(t instanceof Element) || isVector(t)) return false;
    return getComputedStyle(t).aspectRatio !== "auto" || /^(IMG|VIDEO|CANVAS|EMBED|OBJECT)$/.test(t.tagName) || isSvgRoot(t);
  }
  // A layer that holds others in the code (a card), not words.
  const holdsLayers = (t) => t instanceof HTMLElement && !hasText(t) && Array.from(t.children).some((c) => !isUi(c));
  // The box a parent lays its children in: inside its padding, and none for display: contents, which has no box.
  function contentOf(p) {
    if (!(p instanceof HTMLElement)) return { w: 0, h: 0 };
    const cs = getComputedStyle(p);
    if (cs.display === "contents") return { w: 0, h: 0 };
    const n = (k) => parseFloat(cs[k]) || 0;
    return { w: p.clientWidth - n("paddingLeft") - n("paddingRight"), h: p.clientHeight - n("paddingTop") - n("paddingBottom") };
  }
  // Whether an element's height comes from its parent's (a height: 100%, a stretch, an inset), read by making the
  // parent 40px taller for a moment: then a resize that leaves the parent's height crops it rather than growing it.
  function followsParentH(d) {
    const p = d.parentElement;
    if (!(p instanceof HTMLElement)) return false;
    const was = p.style.getPropertyValue("height");
    const pri = p.style.getPropertyPriority("height");
    still(p, true);
    const h0 = sizeOf(d).h;
    p.style.setProperty("height", p.offsetHeight + 40 + "px", "important");
    const h1 = sizeOf(d).h;
    if (was) p.style.setProperty("height", was, pri);
    else p.style.removeProperty("height");
    tidyStyle(p);
    flush();
    still(p, false);
    return h1 - h0 >= 20;
  }
  // What's inside a layer before a resize, so refit can wrap it after: each element's size, whether it filled its
  // parent's width, whether its height hangs on its parent's, and an image's or video's fill. At most 400 elements, so
  // a big layer stays quick to drag.
  function fitBefore(t) {
    if (!(t instanceof HTMLElement) && !isSvgRoot(t)) return [];
    const inner = t instanceof HTMLElement ? Array.from(t.querySelectorAll("*")).filter((d) => !isUi(d) && !inSvg(d)).slice(0, 400) : [];
    // Whether a parent's width was set rather than hugging its content, as it was before the resize (the layer resized
    // included): one that fills its own parent (read first, as querySelectorAll lists parents before children), one
    // whose width isn't its fit-content, or one the code gives a width (a 400px card round a 400px wrapper is as wide
    // as its content and still set). A parent that hugs (an absolute flex column with no width) took its width from
    // its widest child, which stays hugging. Read once per parent; the rules are walked only when the trial can't tell.
    const byEl = new Map();
    const setW = new Map();
    const widthSet = (p) => {
      // The layer resized, when its width came from its parent (a block, or a grid or flex item stretched across): the
      // trial below can't tell that from hugging when its content is exactly as wide (a grid cell's card round its
      // 300px image), and its fillsW is never read, as only what's inside it is. An absolute or floated one, or one
      // its row sizes from its content, hugs, so its widest child stays as it is.
      if (p === t && t instanceof HTMLElement) {
        const cs = getComputedStyle(t);
        const lp = layoutParentOf(t);
        const fills = /^(absolute|fixed)$/.test(cs.position) || cs.float !== "none" ? false
          : lp ? (lp.flex && lp.main === "w" ? parseFloat(cs.flexGrow) > 0 : stretches(t, lp, "w"))
          : /^(block|flex|grid|flow-root|list-item)$/.test(cs.display);
        if (fills) return true;
      }
      if ((byEl.get(p) || {}).fillsW) return true;
      if (!setW.has(p)) {
        const tr = p instanceof HTMLElement ? sizeTrial(p, "w") : null;
        setW.set(p, !!tr && (Math.abs(tr.now - tr.hug) >= 0.5 || /\d/.test(declaredValue(p, "width"))));
      }
      return setW.get(p);
    };
    return [t].concat(inner).map((d) => {
      // Whole px (sizeOf) to test against the parent's box, which is whole px too; the size kept is unrounded
      // (exactSize), so an image that keeps its ratio to the decimal doesn't read as one that changed shape.
      const s = sizeOf(d);
      const x = exactSize(d);
      const cs = getComputedStyle(d);
      const k = { d, w: x.w, h: x.h, media: /^(IMG|VIDEO|CANVAS)$/.test(d.tagName) || isSvgRoot(d), fit: /^(IMG|VIDEO)$/.test(d.tagName) ? cs.objectFit : null };
      byEl.set(d, k);
      // A fill the code chose (object-fit: fill written in a rule or inline) is kept: only the CSS default, which no
      // one picked, gets cover when the box changes shape.
      if (k.fit === "fill") k.fitSet = !!declaredValue(d, "object-fit");
      // The inline values a resize may write, as they were, so a drag that comes back puts them back (putBack).
      k.was = {};
      ["width", "height", "object-fit", "align-self"].forEach((p) => { k.was[p] = d.style.getPropertyValue(p); });
      // Whether its row stretched it to the row's height, read once before the resize: a drag calls resizeLayer on
      // every move, and once a move has written align-self: start the live value no longer stretches, so reading it
      // live would take the start off again on the next move and flip it on every move after.
      if (d === t && t instanceof HTMLElement) {
        const lp = layoutParentOf(t);
        k.stretchedH = !!(lp && lp.inFlow && lp.main !== "h" && stretches(t, lp, "h"));
      }
      if (d !== t && /^(static|relative|sticky)$/.test(cs.position) && cs.display !== "contents" && (cs.display !== "inline" || REPLACED.test(d.tagName))) {
        const pc = contentOf(d.parentElement);
        const n = (v) => parseFloat(v) || 0;
        k.mx = n(cs.marginLeft) + n(cs.marginRight);
        k.pw = pc.w;
        // As wide as its parent's box, in a parent whose width is set: it fills, whatever its own fit-content (a
        // wrapper with width: 400px round a 400px image hugs and fills at once). In a parent that hugs, the widest
        // line made the parent that wide, so it stays as it is. Asked of the parent, not the child, for that reason.
        k.fillsW = pc.w > 0 && Math.abs(s.w + k.mx - pc.w) < 0.5 && widthSet(d.parentElement);
        // Only an image, a video or an <svg> needs this (to crop or to grow), and only when it's as tall as its parent.
        k.tiedH = k.media && pc.h > 0 && Math.abs(s.h + n(cs.marginTop) + n(cs.marginBottom) - pc.h) < 0.5 && followsParentH(d);
      }
      return k;
    });
  }
  // A note for Copy on why a value was written that she didn't type, kept beside the value: Copy prints it only while
  // the layer still has that value.
  function noteWhy(t, prop, why) {
    const value = t.style.getPropertyValue(prop);
    if (!value) return;
    record(t, (entry) => {
      if (entry.styles[prop] === value) entry.why = Object.assign({}, entry.why, { [prop]: { value, note: why } });
    });
  }
  // Puts one inline value back as fitBefore read it (was), for a drag that comes back: what an earlier move wrote for
  // another size mustn't stay behind. A value that is the code's own goes back as the code's (handBack), so no edit
  // is left. true when it changed anything.
  function putBack(d, prop, was) {
    const v = was[prop] || "";
    if (d.style.getPropertyValue(prop) === v) return false;
    if (v === (originalOf(d).styles[prop] || "")) handBack(d, prop);
    else setStyle(d, prop, v);
    return true;
  }
  // After a width change, what's inside wraps as in Figma: a layer that filled the old width fills the new one (one
  // the code gave a px width is written the new one), an image, video or <svg> keeps its proportions (taller or
  // shorter; one whose height hangs on its parent's crops instead), and the text, strokes and radii are left alone.
  // Any image or video whose box changed shape keeps its fill: with none in the code (fill, which stretches), cover,
  // Figma's default image fill, is written. fit is fitBefore's, taken before the change. Sizes are read unrounded, so
  // an image with height: auto, which keeps its ratio by itself, gets no height and no fill written. Whatever no longer
  // applies (a drag back to the old width) goes back to how it was.
  function refit(t, fit, widened) {
    fit.forEach((k) => {
      const d = k.d;
      if (!d.isConnected) return;
      let now = exactSize(d);
      if (d !== t) {
        let held = false;
        if (widened && k.fillsW) {
          const pc = contentOf(d.parentElement);
          const want = pc.w - k.mx;
          if (Math.abs(pc.w - k.pw) >= 0.5 && want > 0) {
            held = true;
            if (Math.abs(now.w - want) >= 0.5) {
              setSize(d, want, null);
              now = exactSize(d);
            }
          }
        }
        if (!held && putBack(d, "width", k.was)) now = exactSize(d);
        held = false;
        if (widened && k.media && k.w && k.h && !k.tiedH && Math.abs(now.w - k.w) >= 0.5) {
          held = true;
          const want = (now.w * k.h) / k.w;
          if (Math.abs(now.h - want) >= 0.5) {
            setSize(d, null, want);
            now = exactSize(d);
          }
        }
        if (!held && putBack(d, "height", k.was)) now = exactSize(d);
      }
      if (k.fit === "fill" && !k.fitSet && k.w && k.h && now.w && now.h) {
        if (Math.abs((now.w * k.h) / (now.h * k.w) - 1) > 0.005) {
          if (d.style.getPropertyValue("object-fit") !== "cover") {
            setStyle(d, "object-fit", "cover");
            noteWhy(d, "object-fit", "added: its box changed shape and the code had no fill, so it crops (Figma's default image fill) rather than stretch");
          }
        } else putBack(d, "object-fit", k.was);
      }
    });
  }
  // Resizes one layer to w by h (null leaves that axis to the code). Unlocked, an axis changes alone: where the code
  // would make the other follow (an aspect-ratio, an image's own ratio), that one is pinned at its px, unrounded so
  // it truly stays. Locked, the other follows in proportion: where the code keeps the ratio itself, only the axis
  // given is written and the code brings the other along (written too only if it doesn't). In auto layout a size
  // given is Fixed (fixAxis), unless the caller fixed it already (o.fixed, a drag). A container made wider or
  // narrower wraps its content (refit); one its grid or flex row stretched to the row's height couldn't, so it takes
  // align-self: start. o.from / o.exact / o.fit: the size and the inside as they were, for a drag that resizes from
  // its start on every move.
  function resizeLayer(t, w, h, o = {}) {
    const e0 = o.exact || exactSize(t);
    const fit = o.fit || fitBefore(t);
    const vector = isVector(t);
    const one = (w == null) !== (h == null);
    const follows = !!o.locked && one && !vector && ratioDriven(t);
    // The axis the lock makes follow. A drag (fixed) made only the dragged axis Fixed when it started, so this one is
    // made Fixed here, as a typed size does, and the drag's Copy matches the typed one.
    let added = null;
    if (o.locked && !follows && e0.w && e0.h) {
      if (w != null && h == null) { h = round2((w * e0.h) / e0.w); added = "h"; }
      else if (h != null && w == null) { w = round2((h * e0.w) / e0.h); added = "w"; }
    }
    const lp = vector ? null : layoutParentOf(t);
    if (lp && !o.fixed) {
      if (w != null) fixAxis(t, "w", w);
      if (h != null) fixAxis(t, "h", h);
    } else {
      // Before the size goes in: fixAxis reads whether the layout sizes it, which a px size would hide. Once per drag
      // (marked on fitBefore's entry, which lives for the drag): on a later move the px size hides the stretch, and
      // fixAxis would take back the start it wrote on the first.
      if (lp && added && fit[0] && fit[0].d === t && fit[0].fixedLock !== added) {
        fixAxis(t, added, null);
        fit[0].fixedLock = added;
      }
      setSize(t, w, h);
    }
    if (vector) return;
    if (one && ratioDriven(t)) {
      const axis = w == null ? "w" : "h";
      const now = exactSize(t);
      const want = !follows ? e0[axis] : axis === "h" ? (now.w * e0.h) / e0.w : (now.h * e0.w) / e0.h;
      if (e0.w && e0.h && Math.abs(now[axis] - want) >= 0.5) {
        const px = round2(want);
        if (lp) fixAxis(t, axis, px);
        else setSize(t, axis === "w" ? px : null, axis === "h" ? px : null);
        if (!follows) noteWhy(t, axis === "w" ? "width" : "height", "kept: only the " + (axis === "w" ? "height" : "width") + " was changed, and the code's aspect ratio would have changed this too");
      }
    }
    const widened = Math.abs(exactSize(t).w - e0.w) >= 0.5;
    if (widened && h == null && lp && lp.inFlow && lp.main !== "h" && holdsLayers(t) && (fit[0] && fit[0].d === t ? fit[0].stretchedH : stretches(t, lp, "h")) && sizedByLayout(t, "h")) {
      setUnlessOwn(t, "align-self", lp.flex ? "flex-start" : "start");
      noteWhy(t, "align-self", "added: its " + (lp.flex ? "flex row" : "grid") + " stretched it to the row's height, so it couldn't wrap its content after the width change");
    } else if (w != null && h == null && fit[0] && fit[0].d === t) putBack(t, "align-self", fit[0].was);
    refit(t, fit, widened);
  }
  // A typed W or H keeps the layer's top-left where it is, as Figma keeps X and Y and as a handle drag does. Where the
  // code centres it (left: 50% with translateX(-50%), margin: 0 auto) the size alone would grow it from both sides, so
  // a translate puts it back, as the drag writes. In auto layout the layout places it, so nothing is moved.
  function typedResize(t, w, h, o) {
    const lp = layoutParentOf(t);
    const r0 = t.getBoundingClientRect();
    resizeLayer(t, w, h, o);
    if (lp && lp.inFlow) return;
    const r = t.getBoundingClientRect();
    const dx = r0.left - r.left;
    const dy = r0.top - r.top;
    if (Math.abs(dx) >= 0.05 || Math.abs(dy) >= 0.05) nudge(t, dx, dy);
  }

  // Scale (K), as Figma's: a layer and everything inside it grow or shrink together around an anchor point. Figma's K
  // rewrites the stored numbers (size, font size, radius, stroke, effects, padding, gap, every child's size and place)
  // and leaves no transform, so this multiplies the real values too (her call): no zoom, and a scale transform only on
  // an SVG shape, which has no other way. Every scale is the snapshot taken when Scale started times the factor, never
  // what's on the page now times it, so drag after drag doesn't drift.
  const fmt2 = (n) => String(Math.round(n * 100) / 100 || 0);
  const round4 = (n) => Math.round(n * 10000) / 10000;
  const NUM = "-?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?";
  // A px length anywhere in a value (a shadow list, a filter, a gradient's stops and size, a clip-path or
  // shape-outside shape), but never inside a url(); a path()'s numbers are all px, so they go through scalePath.
  const LENGTHS = new RegExp("url\\((?:[^()\"']|\"[^\"]*\"|'[^']*')*\\)|path\\(((?:nonzero|evenodd)\\s*,\\s*)?([\"'])([^\"']*)\\2\\)|(" + NUM + ")px\\b", "gi");
  // A path's numbers, but an arc's turn and its two flags (the 3rd to 5th of every 7 after an A), which aren't lengths:
  // her squircle clip-paths are arcs and curves.
  function scalePath(d, k) {
    let cmd = "";
    let i = 0;
    return d.replace(new RegExp("([MmLlHhVvCcSsQqTtAaZz])|(" + NUM + ")", "g"), (m, c, n) => {
      if (c) {
        cmd = c;
        i = 0;
        return c;
      }
      const flag = (cmd === "A" || cmd === "a") && i % 7 >= 2 && i % 7 <= 4;
      i++;
      return flag ? n : fmt2(parseFloat(n) * k);
    });
  }
  function scaleLengths(v, k) {
    return String(v).replace(LENGTHS, (m, rule, q, d, n) => (n != null ? fmt2(parseFloat(n) * k) + "px"
      : d != null ? "path(" + (rule || "") + q + scalePath(d, k) + q + ")" : m));
  }
  // A value's lengths, and the rest of it, so two values can be compared number by number.
  function lengthsOf(v) {
    const nums = [];
    const rest = String(v).replace(LENGTHS, (m, rule, q, d, n) => {
      if (n != null) {
        nums.push(parseFloat(n));
        return "#";
      }
      if (d != null) {
        (d.match(new RegExp(NUM, "g")) || []).forEach((x) => nums.push(parseFloat(x)));
        return "path(#)";
      }
      return m;
    });
    return { nums, rest };
  }
  const hasLength = (v) => lengthsOf(v).nums.some((n) => n !== 0);
  function sameLengths(a, b) {
    const x = lengthsOf(a);
    const y = lengthsOf(b);
    return x.rest === y.rest && x.nums.length === y.nums.length && x.nums.every((n, i) => Math.abs(n - y.nums[i]) <= 0.01);
  }
  // The computed value as the code gives it (Typed OM), where getComputedStyle hands back what it lays out to: a margin
  // or an inset that is auto, and a grid's tracks as written (200px 1fr, not the px each came to).
  function codeValue(el, prop) {
    try {
      return String(el.computedStyleMap().get(prop));
    } catch (e) {
      return "";
    }
  }
  // Read as the code gives them: a grid's tracks, and an origin, which getComputedStyle turns from 50% into px (a %
  // keeps no line; only px parts are multiplied).
  const CODE_READ = /^(grid-template-|transform-origin|perspective-origin)/;
  const readScaled = (el, prop) => (CODE_READ.test(prop) ? codeValue(el, prop) : getComputedStyle(el).getPropertyValue(prop).trim());
  const scaleStyle = (t, prop, value) => setStyle(t, prop, value, true);

  // What K multiplies (the px parts only; a %, a keyword, an fr stay). Text and box values follow on their own when they
  // can (an em, a %, an inherited font size, a unitless line height), so they're read again before each write; border,
  // outline and column-rule widths never follow, so they're always written.
  const SCALE_TEXT = ["line-height", "letter-spacing", "word-spacing", "text-indent", "text-shadow", "text-decoration-thickness",
    "text-underline-offset", "-webkit-text-stroke-width"];
  const SCALE_BOX = ["padding-top", "padding-right", "padding-bottom", "padding-left", "margin-top", "margin-right", "margin-bottom",
    "margin-left", "min-width", "min-height", "max-width", "max-height", "row-gap", "column-gap",
    "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius", "box-shadow",
    "filter", "backdrop-filter", "flex-basis", "grid-template-columns", "grid-template-rows", "grid-auto-columns", "grid-auto-rows",
    "background-image", "background-size", "background-position", "mask-image", "mask-size", "mask-position", "object-position",
    "column-width", "vertical-align", "clip-path", "shape-outside", "shape-margin", "border-image-width", "border-image-outset",
    "transform-origin", "perspective-origin", "perspective"];
  const SCALE_EDGES = ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "outline-width", "column-rule-width",
    "outline-offset"];
  const MOVES = ["transform", "translate", "scale", "rotate"];
  // A pseudo-element's lengths worth listing: its origins are left out (computed, a 50% reads as px).
  const PSEUDO_LENGTHS = ["width", "height", "top", "right", "bottom", "left", "font-size", "translate"]
    .concat(SCALE_TEXT, SCALE_BOX, SCALE_EDGES).filter((p) => !/-origin$/.test(p));
  const REPLACED = /^(IMG|VIDEO|CANVAS|IFRAME|EMBED|OBJECT)$/;

  // The properties an animation or transition holds on el now (one that's running, or done and filling): writing them
  // would do nothing, so they're left and listed. The move properties count as one.
  function animatedProps(el) {
    const out = new Set();
    el.getAnimations().forEach((a) => {
      const fx = a.effect;
      if (!fx || !fx.getComputedTiming || fx.getComputedTiming().progress == null) return;
      if (a.transitionProperty) out.add(a.transitionProperty);
      (fx.getKeyframes ? fx.getKeyframes() : []).forEach((kf) => Object.keys(kf).forEach((p) => {
        if (!/^(offset|computedOffset|easing|composite)$/.test(p)) out.add(p.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()));
      }));
    });
    if (MOVES.some((p) => out.has(p))) MOVES.forEach((p) => out.add(p));
    return out;
  }
  // A longhand counts when its shorthand is animated (padding holds padding-top).
  const animates = (set, prop) => set.has(prop) || Array.from(set).some((a) => prop.indexOf(a + "-") === 0);

  // A selector's specificity, near enough: :where() counts nothing, :is()/:not()/:has() count what's inside them.
  const selectorWeight = (sel) => {
    const x = sel.replace(/:where\((?:[^()]|\([^()]*\))*\)/g, "").replace(/::?(before|after|first-line|first-letter)\b|::[\w-]+/g, "");
    const ids = (x.match(/#[\w-]+/g) || []).length;
    const cls = (x.match(/\.[\w-]+|\[[^\]]*\]|:(?!is\(|not\(|has\()[\w-]+/g) || []).length;
    const tags = (x.match(/(^|[\s>+~(,])[a-zA-Z][\w-]*/g) || []).length;
    return ids * 1e6 + cls * 1e3 + tags;
  };

  // The value the code wrote for prop on el, where the computed one has lost it: Chrome snaps border, outline and
  // column-rule widths to whole device pixels, so 1.5px reads back as 1px. The inline value first (hers, or the
  // code's), else the stylesheet rule that wins: !important first, then the most specific match, then the last of
  // equals. "" when none is found (a rule that can't be read, a value only a shorthand with var() sets).
  function declaredValue(el, prop) {
    const inline = el.style.getPropertyValue(prop);
    if (inline) return inline.trim();
    const weigh = selectorWeight;
    let best = null;
    const walk = (rules) => {
      for (const r of rules) {
        if (r instanceof CSSStyleRule) {
          const v = r.style.getPropertyValue(prop);
          if (!v) continue;
          const parts = r.selectorText.split(/,(?![^()]*\))/).filter((x) => {
            try {
              return el.matches(x);
            } catch (e) {
              return false;
            }
          });
          if (!parts.length) continue;
          const w = Math.max(...parts.map(weigh)) + (r.style.getPropertyPriority(prop) === "important" ? 1e9 : 0);
          if (!best || w >= best.w) best = { w, v: v.trim() };
        } else if (r.cssRules) {
          if (r.media && r.media.mediaText && !matchMedia(r.media.mediaText).matches) continue;
          if (typeof CSSSupportsRule !== "undefined" && r instanceof CSSSupportsRule && !CSS.supports(r.conditionText)) continue;
          walk(r.cssRules);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      try {
        if (!sheet.disabled && (!sheet.media || !sheet.media.mediaText || matchMedia(sheet.media.mediaText).matches)) walk(sheet.cssRules);
      } catch (e) {
        // A sheet from another origin can't be read.
      }
    }
    return best ? best.v : "";
  }

  // A length as the code wrote it (a token, a rem), worked out on el without Chrome's whole-pixel snapping: a hidden
  // probe inside el holds it in a registered <length> property, which keeps the fraction (var(--bw) = 1.5px reads
  // 1.5px, where the border width reads 1px). NaN when it isn't a length (a style, a colour).
  const EXACT = "--ft-exact-length";
  let exactReady = false;
  function exactLength(el, text) {
    if (!exactReady) {
      exactReady = true;
      try {
        CSS.registerProperty({ name: EXACT, syntax: "<length>", inherits: false, initialValue: "-99999px" });
      } catch (e) {
        // Registered already (finetune loaded twice), or the browser can't: then it reads NaN below.
      }
    }
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;display:none";
    probe.style.setProperty(EXACT, text);
    if (!probe.style.getPropertyValue(EXACT)) return NaN;
    el.appendChild(probe);
    const v = getComputedStyle(probe).getPropertyValue(EXACT).trim();
    probe.remove();
    return /^-?\d*\.?\d+(e-?\d+)?px$/.test(v) && v !== "-99999px" ? parseFloat(v) : NaN;
  }
  // The code's value for a border, outline or column rule width where the longhand doesn't hold it: a shorthand that
  // uses a token (border: var(--bw) solid) leaves its longhands empty. The width is the shorthand's one part that's
  // a length; border-width gives each side by its place (1 to 4 values).
  function edgeFromShorthand(el, prop) {
    const parts = (v) => (v.match(/(?:[^\s(]|\([^()]*(?:\([^()]*\)[^()]*)*\))+/g) || []);
    const side = /^border-(top|right|bottom|left)-width$/.exec(prop);
    const lengthIn = (v) => {
      for (const x of parts(v)) {
        const n = exactLength(el, x);
        if (isNum(n)) return n;
      }
      return NaN;
    };
    if (side) {
      const all = declaredValue(el, "border-width");
      if (all) {
        const w = parts(all);
        const at = { top: 0, right: 1, bottom: 2, left: 3 }[side[1]];
        if (w.length >= 1 && w.length <= 4) return exactLength(el, w[[[0, 0, 0, 0], [0, 1, 0, 1], [0, 1, 2, 1], [0, 1, 2, 3]][w.length - 1][at]]);
      }
      for (const sh of ["border-" + side[1], "border"]) {
        const v = declaredValue(el, sh);
        if (v) return lengthIn(v);
      }
      return NaN;
    }
    const sh = { "outline-width": "outline", "column-rule-width": "column-rule" }[prop];
    const v = sh ? declaredValue(el, sh) : "";
    return v ? lengthIn(v) : NaN;
  }

  // Whether a box holds words anywhere: a text node, a form field, or a ::before or ::after with content (an icon
  // font's glyph).
  function wordsIn(el) {
    if (el.textContent.trim() || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName) || el.querySelector("input, textarea, select")) return true;
    const drawn = (e) => ["::before", "::after"].some((pe) => !/^(none|normal)$/.test(getComputedStyle(e, pe).content));
    return drawn(el) || Array.from(el.querySelectorAll("*")).some(drawn);
  }

  // One element's part of the snapshot: what K writes on it, each with its computed value and the inline value it had.
  // font first, then follow (read again before writing), fixed (always written), size (Fixed axes only), once (a
  // shape's turn-in-place and stroke setting), viewBox (an <svg> that has none), skipped (animated, left).
  function scaleItem(el, root, out) {
    const cs = getComputedStyle(el);
    const anim = animatedProps(el);
    const it = { el, root, font: [], follow: [], fixed: [], size: [], once: [], skipped: [], viewBox: null };
    const take = (list, prop, v, on) => {
      const t = on || el;
      if (animates(on ? animatedProps(on) : anim, prop)) {
        if (hasLength(v)) it.skipped.push(prop);
        return;
      }
      if (!hasLength(v)) return;
      const p = { el: t, prop, v, inline: t.style.getPropertyValue(prop), last: null };
      // Background blur is written as the prefixed one first, then the standard one (a build that merges the pair keeps
      // the last).
      if (prop === "backdrop-filter") Object.assign(p, { also: "-webkit-backdrop-filter", alsoInline: t.style.getPropertyValue("-webkit-backdrop-filter") });
      list.push(p);
    };
    out.push(it);
    // The panel's own record of a Stroke or Effects she set on this layer (what those sections show and edit from):
    // its numbers grow with the CSS they wrote.
    const keepMeta = () => {
      const own = edits.elements[keyOf(el)];
      if (own && (own.stroke || own.effects)) {
        it.meta = { stroke: own.stroke ? Object.assign({}, own.stroke) : null, effects: own.effects ? own.effects.map((fx) => Object.assign({}, fx)) : null };
      }
    };
    // A shape's stroke: its weight and its dashes (and where they start), each multiplied.
    const strokes = (d) => {
      const ds = d === el ? cs : getComputedStyle(d);
      if (ds.stroke === "none") return;
      const on = d === el ? null : d;
      take(it.fixed, "stroke-width", ds.strokeWidth, on);
      if (ds.strokeDasharray !== "none") take(it.fixed, "stroke-dasharray", ds.strokeDasharray, on);
      take(it.fixed, "stroke-dashoffset", ds.strokeDashoffset, on);
    };
    // A shape picked on its own: its geometry where SVG has some to write (a rect's size and corner radius, a circle's
    // r, an ellipse's rx and ry) and its stroke, else the vector scale finetune already uses, turned in place. A stroke
    // drawn at a fixed screen weight (vector-effect: non-scaling-stroke) wouldn't grow with that scale: it keeps its
    // vector-effect and its stroke is multiplied, so the line comes out f times as thick, as Figma's does, whatever
    // the svg's viewBox.
    if (isVector(el)) {
      const geo = { rect: ["width", "height", "rx", "ry"], circle: ["r"], ellipse: ["rx", "ry"] }[el.tagName.toLowerCase()];
      if (geo) {
        geo.forEach((p) => take(it.fixed, p, cs.getPropertyValue(p)));
        strokes(el);
        keepMeta();
        return;
      }
      if (animates(anim, "scale")) return it.skipped.push("scale");
      const sc = cs.scale === "none" ? [1, 1] : cs.scale.trim().split(/\s+/).map(parseFloat);
      it.fixed.push({ el, prop: "scale", v: sc[0] + " " + (sc.length > 1 ? sc[1] : sc[0]), inline: el.style.getPropertyValue("scale"), last: null, shape: true });
      if (el.style.transformBox !== "fill-box") {
        it.once.push({ el, prop: "transform-box", inline: el.style.getPropertyValue("transform-box"), to: "fill-box" });
        it.once.push({ el, prop: "transform-origin", inline: el.style.getPropertyValue("transform-origin"), to: "center" });
      }
      if (cs.vectorEffect === "non-scaling-stroke") strokes(el);
      return;
    }
    keepMeta();
    const svg = el instanceof SVGSVGElement;
    const replaced = REPLACED.test(el.tagName) || svg;
    // A drawn ::before or ::after: its px lengths now. It has no inline style to write, so it can't grow; Copy lists
    // the ones that didn't follow (an em or an inherited font size does).
    if (!replaced && el instanceof HTMLElement) {
      it.pseudo = ["::before", "::after"].map((pe) => {
        const ps = getComputedStyle(el, pe);
        if (/^(none|normal)$/.test(ps.content)) return null;
        const v = {};
        PSEUDO_LENGTHS.forEach((p) => {
          const style = /^(border-\w+|outline|column-rule)-width$/.exec(p);
          if (style && ps.getPropertyValue(p.replace(/-width$/, "-style")) === "none") return;
          const x = ps.getPropertyValue(p);
          if (hasLength(x)) v[p] = x;
        });
        return Object.keys(v).length ? { pe, v } : null;
      }).filter(Boolean);
    }
    // An image, a video or an <svg> has no words, so its inherited font size isn't one of its values; nor has a box
    // with no words anywhere inside it (an em value there is read again before it's written, so it still grows). An
    // <svg> holding words keeps the font size it has, so only its viewBox scales them (else they'd grow twice). The
    // text values (line height and the rest) go with the font size: a box with no words gets none of them.
    if (!replaced) {
      if (wordsIn(el)) {
        take(it.font, "font-size", cs.fontSize);
        SCALE_TEXT.forEach((p) => take(it.follow, p, cs.getPropertyValue(p)));
      }
    } else if (svg && el.querySelector("text, foreignObject")) {
      const n = it.font.length;
      take(it.font, "font-size", cs.fontSize);
      if (it.font.length > n) it.font[n].keep = true;
    }
    SCALE_BOX.forEach((p) => {
      const margin = /^margin-/.test(p);
      // The layer K is on keeps its margins (they place it, as its position does) and an auto margin stays auto.
      if (margin && (root || codeValue(el, p) === "auto")) return;
      take(it.follow, p, CODE_READ.test(p) ? codeValue(el, p) : cs.getPropertyValue(p));
    });
    // A width counts only where its line is drawn: Chrome reports an outline's or a column rule's medium (3px) with no
    // style at all.
    // Read as the code wrote it (1.5px, which the computed value snaps to 1px). One written in em grows with the font
    // size, so it's read again before writing, as the follow values are, and gets no line where it followed.
    // An outline's offset is read the same way: Chrome rounds it to whole px too.
    SCALE_EDGES.forEach((p) => {
      if (cs.getPropertyValue(p === "outline-offset" ? "outline-style" : p.replace(/-width$/, "-style")) === "none") return;
      const c = cs.getPropertyValue(p);
      const d = declaredValue(el, p);
      const em = /^(-?\d*\.?\d+)em$/.exec(d);
      if (em) return take(it.follow, p, fmt2(parseFloat(em[1]) * parseFloat(cs.fontSize)) + "px");
      // A token or a rem (var(--bw), 0.09375rem) is worked out unsnapped, so 1.5px grows to 3px and not 2px.
      const x = /^-?\d*\.?\d+px$/.test(d) ? parseFloat(d) : d ? exactLength(el, d) : edgeFromShorthand(el, p);
      take(it.fixed, p, isNum(x) && Math.abs(x - parseFloat(c)) < 1 ? x + "px" : c);
    });
    // A table's border spacing, only where it's set (it's inherited, so every row and cell reads it too), and read as
    // the code wrote it, as Chrome cuts it to whole px (4.11px reads 4px).
    const bs = cs.borderSpacing;
    const bd = declaredValue(el, "border-spacing");
    if (bd || !el.parentElement || getComputedStyle(el.parentElement).borderSpacing !== bs) {
      const c = bs.split(/\s+/).map(parseFloat);
      const d = /^-?\d*\.?\d+px(\s+-?\d*\.?\d+px)?$/.test(bd) ? bd.split(/\s+/).map(parseFloat) : null;
      const near = d && d.every((n, i) => Math.abs(n - c[Math.min(i, c.length - 1)]) < 1);
      take(it.fixed, "border-spacing", near ? bd : bs);
    }
    // A layer inside: its place in the box, which grows. The layer K is on is placed by the anchor instead.
    if (!root) {
      if (cs.position !== "static" && cs.position !== "sticky") {
        ["left", "top", "right", "bottom"].forEach((p) => { if (codeValue(el, p) !== "auto") take(it.follow, p, cs.getPropertyValue(p)); });
      }
      take(it.follow, "translate", cs.translate);
      const m = /^matrix\(([^)]+)\)$/.exec(cs.transform);
      const n = m ? m[1].split(",").map(parseFloat) : null;
      if (n && (n[4] || n[5])) {
        if (animates(anim, "transform")) it.skipped.push("transform");
        else it.fixed.push({ el, prop: "transform", v: cs.transform, inline: el.style.getPropertyValue("transform"), last: null, matrix: n });
      }
    } else if (MOVES.some((p) => anim.has(p))) {
      // The layer K is on, moved by an animation in px (a 6px rise): the anchor places it, but the rise stays 6px.
      const px = el.getAnimations().some((a) => a.effect && a.effect.getKeyframes
        && a.effect.getKeyframes().some((kf) => MOVES.some((p) => kf[p] && hasLength(kf[p]))));
      if (px) it.skipped.push("transform");
    }
    // Width and height on a Fixed axis only (Hug and Fill follow what's inside or around them). An image, a video, a
    // canvas or an <svg> keeps its own size unless it's given one, so it counts as Fixed; so does the layer K is on
    // when it fills its parent, or it couldn't grow. Across a flex row an image or an <svg> can read as Fill (its own
    // size happens to match the stretch), which would leave its height behind: it counts as Fixed there too, which
    // comes out the same when it really stretches. Along the row a Fill one keeps growing into its share.
    if (cs.display !== "contents" && (cs.display !== "inline" || replaced)) {
      const lp = replaced ? layoutParentOf(el) : null;
      ["w", "h"].forEach((axis) => {
        const prop = axis === "w" ? "width" : "height";
        const px = parseFloat(cs.getPropertyValue(prop));
        if (!isNum(px)) return;
        if (animates(anim, prop)) return it.skipped.push(prop);
        let mode = sizeModeOf(el, axis);
        const coded = mode === "fixed";
        if (mode === "hug" && replaced) mode = "fixed";
        if (mode === "fill" && replaced && !(lp && lp.inFlow && lp.main === axis)) mode = "fixed";
        if (mode === "fill" && root) mode = "fixed";
        if (mode === "fixed") it.size.push({ el, prop, axis, px, coded, inline: el.style.getPropertyValue(prop), last: null, was: locksOf(el) });
      });
    }
    if (svg) {
      // An <svg> scales its own drawing when its size changes, through its viewBox; one without a viewBox would keep
      // it, so it gets one at the size it has. Nothing inside is touched, but a stroke drawn at a fixed screen weight
      // (vector-effect: non-scaling-stroke) wouldn't grow with it: its stroke-width is multiplied, so it bakes as a
      // plain number on that shape and the vector-effect stays.
      if (!el.hasAttribute("viewBox")) it.viewBox = { w: parseFloat(cs.width) || 0, h: parseFloat(cs.height) || 0 };
      el.querySelectorAll("*").forEach((d) => {
        if (getComputedStyle(d).vectorEffect === "non-scaling-stroke") strokes(d);
      });
      return;
    }
    Array.from(el.children).forEach((c) => {
      if (!isUi(c) && getComputedStyle(c).display !== "none") scaleItem(c, false, out);
    });
  }

  // The flex locks fixAxis can write on a layer in auto layout, and what her edits had on each before Scale, so 1x
  // takes them off again.
  const LOCKS = ["flex-grow", "flex-shrink", "flex-basis", "min-width", "min-height", "align-self", "justify-self"];
  const locksOf = (el) => {
    const e = entryOf(el);
    return LOCKS.map((p) => [p, e && e.styles[p] != null ? e.styles[p] : null]);
  };
  // What the inline styles look like, so an edit that isn't a scale (Layout's W and H, an undo) can be told from the
  // scale's own; a move of the layer K is on doesn't count (the anchor places it). Each element's declarations are
  // sorted, as an undo can put them back in another order.
  const cssSig = (el, root) => el.style.cssText.split(";").map((d) => d.trim()).filter((d) => d && !(root && /^translate\s*:/.test(d))).sort().join(";");
  const scaleSig = (m) => m.items.map((it) => cssSig(it.el, it.root) + "|" + (it.el.getAttribute("viewBox") || "")).join("\n");
  // Keeps what the page looks like now with the factor it's at, so an undo or a redo that lands back on it picks up
  // that factor and this snapshot, never one measured off the page (Chrome rounds borders, so a width can't give
  // the factor back exactly).
  function scaleSeal(m) {
    m.sig = scaleSig(m);
    m.states.set(m.sig, { items: m.items, layout: m.layout, fAtSnap: m.fAtSnap, snapSize: m.snapSize, f: m.f, base: Object.assign({}, m.base) });
  }
  function scaleSnap(m) {
    m.items = [];
    m.roots.forEach((t) => scaleItem(t, true, m.items));
    const L = layoutOf(m.g);
    m.layout = L ? { gap: L.gap, pad: L.pad.slice() } : null;
    m.snapSize = m.many ? null : exactSize(m.roots[0]);
    m.trs = m.roots.map((t) => copyTr(trNow(t)));
    scaleSeal(m);
  }
  const copyTr = (ax) => [Object.assign({}, ax[0]), Object.assign({}, ax[1]), ax[2] || ""];
  // Starts Scale on one layer or several (g: their ⌘G group). base is the size at 1x; f the factor now; fAtSnap the
  // factor the snapshot was taken at; prior a factor an earlier Scale left on each layer, so Copy's comment is the
  // whole factor from the code.
  function beginScale(list, g) {
    const many = list.length > 1;
    const roots = list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
    const box = many ? boxOf(list, g) : null;
    const m = {
      list: list.slice(), roots, many, g: g || null,
      base: many ? { w: box.width, h: box.height } : exactSize(list[0]),
      f: 1, fAtSnap: 1, anchor: [0.5, 0.5], states: new Map(),
      prior: roots.map((t) => parseFloat((entryOf(t) || {}).scaled) || 1),
    };
    scaleSnap(m);
    // Each ::before and ::after as Scale found it, to tell which grew.
    m.pseudo0 = m.items.filter((it) => it.pseudo && it.pseudo.length).map((it) => ({ el: it.el, list: it.pseudo }));
    scaleMode = m;
    document.documentElement.classList.add("ft-scaling");
    const n = m.items.reduce((s, it) => s + it.skipped.length, 0);
    if (n) toast(n === 1 ? "1 animated value wasn't scaled" : n + " animated values weren't scaled");
  }
  function dropScale() {
    scaleMode = null;
    document.documentElement.classList.remove("ft-scaling");
  }
  // Whether Scale is on for what the panel shows.
  function scaleHolds(target) {
    const m = scaleMode;
    if (!m || !target) return false;
    if (!Array.isArray(target)) return !m.many && m.list[0] === target;
    return m.many && target.length === m.list.length && target.every((t) => m.list.includes(t));
  }
  const scaleRect = (m) => (m.many ? boxOf(m.list, m.g) : m.roots[0].getBoundingClientRect());
  // After an edit that wasn't a scale (Layout's W or H, a nudge), a new snapshot at the factor Scale is at: the factor
  // stays (a W of its own isn't a scale, so it can't tell the factor), and 1x is moved so W and H read the true size.
  function scaleFresh() {
    const m = scaleMode;
    if (!m) return;
    const sig = scaleSig(m);
    if (sig === m.sig) return;
    const known = m.states.get(sig);
    if (known) {
      Object.assign(m, known, { sig });
      // What was last written may not be what's on the page now, so each value is written again where it changes.
      m.items.forEach((it) => [it.font, it.follow, it.fixed, it.size].forEach((l) => l.forEach((p) => {
        p.last = null;
        p.locked = false;
      })));
      return;
    }
    const box = m.many ? boxOf(m.list, m.g) : null;
    const now = box ? { w: box.width, h: box.height } : exactSize(m.roots[0]);
    m.base = { w: now.w / m.f, h: now.h / m.f };
    m.fAtSnap = m.f;
    scaleSnap(m);
  }
  // Where a scale starts from: the anchor's point on screen (a, or the panel's), the factor, each layer's top left.
  function scaleFrom(a) {
    scaleFresh();
    const m = scaleMode;
    const at = a || m.anchor;
    const r = scaleRect(m);
    // Each layer's translate as Scale last worked it out, unrounded, unless it has moved since (an arrow nudge).
    const near = (x, y) => [0, 1].every((i) => Math.abs(x[i].px - y[i].px) < 0.006 && Math.abs(x[i].pct - y[i].pct) < 0.0006) && x[2] === y[2];
    m.trs = m.roots.map((t, i) => {
      const now = copyTr(trNow(t));
      return m.trs && m.trs[i] && near(m.trs[i], now) ? m.trs[i] : now;
    });
    return {
      r, a: at, f: m.f, A: { x: r.left + r.width * at[0], y: r.top + r.height * at[1] },
      trs: m.trs.map(copyTr),
      tls: m.roots.map((t) => {
        const b = t.getBoundingClientRect();
        return [b.left, b.top];
      }),
    };
  }
  // An attribute written as an edit (a K scale's viewBox), recorded and undone like a style.
  function setAttr(t, name, value) {
    const o = originalOf(t);
    o.attrs = o.attrs || {};
    if (!(name in o.attrs)) o.attrs[name] = t.getAttribute(name);
    const v = value == null ? o.attrs[name] : value;
    if (t.getAttribute(name) === v) return;
    if (v == null) t.removeAttribute(name);
    else t.setAttribute(name, v);
    record(t, (entry) => {
      const a = Object.assign({}, entry.attrs);
      if (v != null && v !== o.attrs[name]) a[name] = v;
      else delete a[name];
      if (Object.keys(a).length) entry.attrs = a;
      else delete entry.attrs;
    });
  }
  // A transform the code set: a pure move comes back as a translate(), any other keeps its a, b, c, d.
  function matrixScaled(n, k) {
    const e = fmt2(n[4] * k);
    const f = fmt2(n[5] * k);
    if (n[0] === 1 && n[1] === 0 && n[2] === 0 && n[3] === 1) return "translate(" + e + "px, " + f + "px)";
    return "matrix(" + n.slice(0, 4).join(", ") + ", " + e + ", " + f + ")";
  }
  // One element's writes at k (the factor over the snapshot). At 1x everything goes back to what it had.
  function scaleWrite(it, k) {
    const one = Math.abs(k - 1) < 1e-9;
    const put = (p, v) => {
      if (p.also) scaleStyle(p.el, p.also, v);
      scaleStyle(p.el, p.prop, v);
      p.last = v;
    };
    // Back to what it had: a value the code gave is handed back (no edit left, so 1x prints nothing), one she had
    // edited before Scale is written again.
    const restore = (el, prop, inline) => {
      const o = originalOf(el).styles;
      const e = entryOf(el);
      if (prop in o && o[prop] !== inline) {
        if (el.style.getPropertyValue(prop) !== inline) scaleStyle(el, prop, inline);
        return;
      }
      if (!(e && e.styles[prop] != null) && el.style.getPropertyValue(prop) === inline) return;
      scaleStyle(el, prop, "");
      if (inline) el.style.setProperty(prop, inline);
    };
    const back = (p) => {
      p.last = null;
      if (p.also) restore(p.el, p.also, p.alsoInline);
      restore(p.el, p.prop, p.inline);
    };
    // Read first, then written: the reads see the ancestors' new values (and this one's font size), and none of this
    // element's own writes changes another of its reads. A kept value (an <svg>'s font size) is written as it was.
    const follow = (list) => {
      if (one) return list.forEach(back);
      list.map((p) => [p, p.keep ? p.v : scaleLengths(p.v, k)]).filter(([p, v]) => !sameLengths(readScaled(p.el, p.prop), v)).forEach(([p, v]) => put(p, v));
    };
    follow(it.font);
    follow(it.follow);
    // Border widths are compared with the last value written, not the screen: Chrome draws them on whole device
    // pixels, so 1px x 1.5 may still show 1px while the line rightly says 1.5px.
    it.fixed.forEach((p) => {
      if (one) return back(p);
      const sc = p.shape ? p.v.split(" ").map((x) => round4(parseFloat(x) * k)).join(" ") : null;
      const v = sc || (p.matrix ? matrixScaled(p.matrix, k) : scaleLengths(p.v, k));
      if (v !== p.last) put(p, v);
    });
    it.once.forEach((p) => {
      const v = one ? p.inline : p.to;
      if (p.el.style.getPropertyValue(p.prop) !== v) scaleStyle(p.el, p.prop, v);
    });
    if (it.viewBox) setAttr(it.el, "viewBox", one ? null : "0 0 " + fmt2(it.viewBox.w) + " " + fmt2(it.viewBox.h));
    if (it.meta) {
      const x = (n) => (one ? n : Math.round(n * k * 100) / 100);
      const s = it.meta.stroke;
      const want = {
        stroke: s ? Object.assign({}, s, { weight: x(s.weight) }) : null,
        effects: it.meta.effects ? it.meta.effects.map((fx) => Object.assign({}, fx, { x: x(fx.x), y: x(fx.y), blur: x(fx.blur), spread: x(fx.spread) })) : null,
      };
      const e = entryOf(it.el) || {};
      if (JSON.stringify(want) !== JSON.stringify({ stroke: e.stroke || null, effects: e.effects || null })) {
        record(it.el, (entry) => {
          if (want.stroke) entry.stroke = want.stroke;
          if (want.effects) entry.effects = want.effects;
        });
      }
    }
    // Size last, after padding and borders: the snapshot's own width or height (the content box for content-box, the
    // border box for border-box), so padding is never taken off twice. Inside auto layout its flex locks go on first.
    it.size.forEach((p) => {
      if (one) {
        back(p);
        // The flex locks go back to what they were before Scale.
        p.locked = false;
        p.was.forEach(([prop, v]) => {
          const e = entryOf(p.el);
          const now = e && e.styles[prop] != null ? e.styles[prop] : null;
          if (now === v) return;
          if (v != null) return scaleStyle(p.el, prop, v);
          scaleStyle(p.el, prop, "");
          const own = originalOf(p.el).styles[prop];
          if (own) p.el.style.setProperty(prop, own);
        });
        return;
      }
      const px = p.px * k;
      if (Math.abs((parseFloat(getComputedStyle(p.el).getPropertyValue(p.prop)) || 0) - px) <= 0.01) return;
      if (!p.locked) {
        p.locked = true;
        const lp = layoutParentOf(p.el);
        // Across the flow, a size the code already fixes isn't stretched, so it needs no lock (one would be a line
        // that changes nothing).
        if (lp && lp.inFlow && !(p.coded && lp.main !== p.axis)) fixAxis(p.el, p.axis, null);
      }
      put(p, fmt2(px) + "px");
    });
  }
  // The smallest factor K goes to: the shorter side down to 0.01px, as Figma's. A side that's 0 (a straight line, a
  // hairline's missing height) has nothing to shrink, so only the sides with a size count.
  function scaleLeast(m) {
    const sides = [m.base.w, m.base.h].filter((x) => x > 0);
    return sides.length ? 0.01 / Math.min(...sides) : 0.01;
  }
  // Scales to f (the factor over 1x) from where `from` (scaleFrom) left it: every value, a group layout's gap and
  // padding through the group's own layout, then the place, so the anchor stays put.
  function applyScale(f, from) {
    const m = scaleMode;
    if (!m || !(f > 0)) return;
    const k = f / m.fAtSnap;
    m.f = f;
    m.items.forEach((it) => scaleWrite(it, k));
    const L = m.layout && layoutOf(m.g);
    if (L) {
      L.gap = Math.round(m.layout.gap * k * 100) / 100;
      L.pad = m.layout.pad.map((p) => Math.round(p * k * 100) / 100);
      flowGroup(L);
    }
    if (from) scalePlace(m, from, L);
    if (Math.abs(k - 1) > 1e-9 && m.roots.every((t, i) => Math.abs(m.prior[i] * f - 1) < 1e-6)) scaleHome(m);
    scaleNotes(m);
    scaleSeal(m);
  }
  // Back at the code's own size over two Scales (2x, then 0.5x in a second K), each value that comes out as the
  // code's own is handed back, as 1x within one Scale does, so Copy has no line for it; one she had edited before
  // keeps her value. Then the flex locks a Scale put on go where taking them off changes nothing.
  function scaleHome(m) {
    const off = (el, prop) => {
      const orig = originalOf(el).styles[prop] || "";
      el.style.removeProperty(prop);
      if (orig) el.style.setProperty(prop, orig);
    };
    const giveBack = (el, prop) => {
      scaleStyle(el, prop, "");
      off(el, prop);
    };
    m.items.forEach((it) => {
      [it.font, it.follow, it.fixed, it.size].forEach((list) => list.forEach((p) => {
        const e = entryOf(p.el);
        const mine = e && e.styles[p.prop];
        if (mine == null || p.shape || p.keep) return;
        off(p.el, p.prop);
        const edge = SCALE_EDGES.includes(p.prop) || p.prop === "border-spacing";
        const code = edge ? declaredValue(p.el, p.prop) || getComputedStyle(p.el).getPropertyValue(p.prop) : readScaled(p.el, p.prop);
        p.el.style.setProperty(p.prop, mine);
        if (!sameLengths(code, mine) && !(p.matrix && sameLengths(getComputedStyle(p.el).transform, code))) return;
        giveBack(p.el, p.prop);
        if (p.also) giveBack(p.el, p.also);
        p.last = null;
        p.locked = false;
      }));
      if (!it.size.length) return;
      const e = entryOf(it.el);
      if (!e || e.styles.width != null || e.styles.height != null) return;
      LOCKS.forEach((lp) => {
        if (e.styles[lp] == null) return;
        const mine = e.styles[lp];
        const r0 = it.el.getBoundingClientRect();
        off(it.el, lp);
        const r1 = it.el.getBoundingClientRect();
        const same = ["left", "top", "width", "height"].every((k) => Math.abs(r0[k] - r1[k]) <= 0.01);
        it.el.style.setProperty(lp, mine);
        if (same) giveBack(it.el, lp);
      });
    });
  }
  // One layer: its anchor point goes back where it was. Several: each lands where the scale around the anchor takes its
  // top left; a group layout's layers move together, as the layout keeps them. A layer the code's layout places
  // (flex or grid) isn't moved, as resize does.
  function scalePlace(m, from, L) {
    const placed = (t) => {
      const lp = layoutParentOf(t);
      return !!(lp && lp.inFlow);
    };
    // A measured move on screen, added to the translate it has, written to 0.01px.
    const go = (t, dx, dy) => {
      if (Math.abs(dx) < 0.005 && Math.abs(dy) < 0.005) return;
      const [lx, ly] = localDelta(t, dx, dy);
      const cur = trNow(t);
      cur[0].px += lx;
      cur[1].px += ly;
      boxed(t);
      writeTranslate(t, cur, true);
    };
    const { A, a } = from;
    if (!m.many) {
      const t = m.roots[0];
      if (placed(t)) return;
      // A shape inside an SVG counts in its parent's units: only measured, from where it is now.
      const ax = inSvg(t) || !m.snapSize ? copyTr(trNow(t)) : copyTr(from.trs[0]);
      // Worked out, not measured: the anchor's place in the box moves by the size's change times the anchor, so the
      // translate is the one Scale started from plus that, unrounded. Back at a factor it had, around the same anchor,
      // it's that factor's translate exactly (1x leaves no line).
      if (!inSvg(t) && m.snapSize) {
        const r = (from.f - m.f) / m.fAtSnap;
        ax[0].px += m.snapSize.w * r * a[0];
        ax[1].px += m.snapSize.h * r * a[1];
        boxed(t);
        writeTranslate(t, ax, true);
      }
      // What the sums can't know is measured and taken out: a layout that moves it as it grows, a line box that
      // rounds, a shape's own units.
      const b = t.getBoundingClientRect();
      const dx = A.x - (b.left + b.width * a[0]);
      const dy = A.y - (b.top + b.height * a[1]);
      const off = inSvg(t) || !m.snapSize ? 0.005 : 0.25;
      if (Math.abs(dx) >= off || Math.abs(dy) >= off) {
        const [lx, ly] = localDelta(t, dx, dy);
        ax[0].px += lx;
        ax[1].px += ly;
        boxed(t);
        writeTranslate(t, ax, true);
      }
      m.trs[0] = ax;
      return;
    }
    const r = from.f ? m.f / from.f : 1;
    const flow = L ? groupMembers(L.sels.filter((s) => !L.ignore.includes(s))) : [];
    m.roots.forEach((t, i) => {
      if (flow.includes(t) || placed(t)) return;
      const b = t.getBoundingClientRect();
      const tl = from.tls[i];
      go(t, A.x + (tl[0] - A.x) * r - b.left, A.y + (tl[1] - A.y) * r - b.top);
    });
    const fr = flow.length && alFrame(L);
    if (fr) {
      const dx = A.x - (fr.left + fr.width * a[0]);
      const dy = A.y - (fr.top + fr.height * a[1]);
      flow.forEach((t) => go(t, dx, dy));
    }
  }
  // Copy's notes: the whole factor on each layer K was on, and what animations held, while it's scaled.
  function scaleNotes(m) {
    // The factor to 8 digits, so the bake's check of a token times it against a line holds on large values too.
    let whole = false;
    m.roots.forEach((t, i) => {
      const total = Number((m.prior[i] * m.f).toPrecision(8));
      const want = Math.abs(total - 1) < 1e-6 ? "" : String(total);
      if (want) whole = true;
      if (((entryOf(t) || {}).scaled || "") !== want) record(t, (entry) => { if (want) entry.scaled = want; else delete entry.scaled; });
    });
    // At this Scale's 1x, the notes an earlier Scale left stay while the layer is still scaled.
    const on = whole && Math.abs(m.f - 1) > 1e-9;
    // A ::before or ::after length that stayed (nearer what it was than to it times the factor). Back at this
    // session's 1x, as above.
    let fresh = false;
    (m.pseudo0 || []).forEach(({ el, list }) => {
      const e = entryOf(el) || {};
      let want = whole ? e.scalePseudo || "" : "";
      if (on) {
        want = list.map(({ pe, v }) => {
          const ps = getComputedStyle(el, pe);
          const left = Object.keys(v).filter((p) => {
            const was = lengthsOf(v[p]).nums;
            const now = lengthsOf(ps.getPropertyValue(p)).nums;
            return was.some((n, i) => n && now[i] != null && Math.abs(now[i] - n) <= Math.abs(now[i] - n * m.f));
          });
          return left.length ? pe + ": " + left.join(", ") : "";
        }).filter(Boolean).join("; ");
      }
      if ((e.scalePseudo || "") === want) return;
      if (want && !e.scalePseudo) fresh = true;
      record(el, (entry) => { if (want) entry.scalePseudo = want; else delete entry.scalePseudo; });
    });
    if (fresh && !m.pseudoToast) {
      m.pseudoToast = true;
      toast("::before and ::after weren't scaled");
    }
    m.items.forEach((it) => {
      const had = (entryOf(it.el) || {}).scaleSkipped || "";
      const want = on ? it.skipped.join(", ") : whole ? had : "";
      if (had !== want) record(it.el, (entry) => { if (want) entry.scaleSkipped = want; else delete entry.scaleSkipped; });
    });
  }

  // Ignore auto layout: the layer leaves its parent's flow (absolute) and stays where it is on screen, its translate
  // kept. The parent becomes the box it's placed in, so a static parent is made relative.
  const ignoresLayout = (t) => /^(absolute|fixed)$/.test(getComputedStyle(t).position);
  function setIgnoreLayout(t, on) {
    const lp = layoutParentOf(t);
    if (!lp) return;
    const p = lp.el;
    const posEdited = (e) => { const en = entryOf(e); return !!(en && en.styles.position != null); };
    if (!on) {
      // Back in the flow means the code's own position, so a relative layer keeps its offset and stays the box
      // its own absolute children sit in. Only a layer the code itself takes out of the flow is written static.
      if (/^(absolute|fixed)$/.test(ownValue(t, "position"))) setStyle(t, "position", "static");
      else handBack(t, "position");
      handBack(t, "left");
      handBack(t, "top");
      // The parent's relative was only there to place its ignored children.
      const others = flowChildren(p, true).some((c) => c !== t && posEdited(c));
      if (!others && posEdited(p) && ownValue(p, "position") === "static") handBack(p, "position");
      return;
    }
    still(t, true);
    const r0 = t.getBoundingClientRect();
    const s0 = sizeOf(t);
    // A Fill would collapse once out of the flow, so it keeps today's size.
    ["w", "h"].forEach((axis) => {
      if (sizeModeOf(t, axis) === "fill") setSize(t, axis === "w" ? Math.round(s0.w) : null, axis === "h" ? Math.round(s0.h) : null);
    });
    // A static parent made relative would also catch any other absolute layer inside it that's placed against a
    // box further out, and move it. Then it stays static and this layer is placed against that outer box instead.
    const staticParent = getComputedStyle(p).position === "static";
    const catches = staticParent && [...p.querySelectorAll("*")].some((d) =>
      !t.contains(d) && getComputedStyle(d).position === "absolute" && d.offsetParent && !p.contains(d.offsetParent));
    if (staticParent && !catches) setStyle(p, "position", "relative");
    const cs = getComputedStyle(t);
    setStyle(t, "position", "absolute");
    const cb = t.offsetParent || p;
    const pr = cb.getBoundingClientRect();
    const n = (v) => parseFloat(v) || 0;
    const tr = trPx(t, trNow(t));
    const left = r0.left - pr.left - cb.clientLeft + cb.scrollLeft - n(cs.marginLeft) - (tr[0] || 0);
    const top = r0.top - pr.top - cb.clientTop + cb.scrollTop - n(cs.marginTop) - (tr[1] || 0);
    setStyle(t, "left", round1(left) + "px");
    setStyle(t, "top", round1(top) + "px");
    // Out of the flow a box shrinks to fit what's left of the parent, which can wrap its words: it keeps its size.
    const s1 = sizeOf(t);
    if (Math.abs(s1.w - s0.w) >= 0.5) setSize(t, Math.round(s0.w), null);
    if (Math.abs(s1.h - s0.h) >= 0.5) setSize(t, null, Math.round(s0.h));
    // Anything the sums miss (a transform, a scale on the parent) is measured and taken out.
    const r1 = t.getBoundingClientRect();
    if (Math.abs(r1.left - r0.left) >= 0.05) setStyle(t, "left", round1(left + r0.left - r1.left) + "px");
    if (Math.abs(r1.top - r0.top) >= 0.05) setStyle(t, "top", round1(top + r0.top - r1.top) + "px");
    flush();
    still(t, false);
  }

  // Takes Spacing's share (nudge's entry.sim) out of a layer's translate and keeps the rest, her own moves.
  function takeBackSpacing(t) {
    const e = edits.elements[keyOf(t)];
    if (!e || !e.sim) return;
    const cur = trNow(t);
    cur[0].px -= e.sim.x;
    cur[1].px -= e.sim.y;
    writeTranslate(t, cur);
    record(t, (entry) => { delete entry.sim; });
  }

  // Auto layout, read from a container's CSS as Figma's panel shows it: justify-content along the flow and
  // align-items across it, each start, center or end. Auto is Figma's Gap Auto (space-between; around and evenly
  // read the same, as the panel has no cell for them). Baseline reads as start: there's no Baseline control yet.
  const ALIGN_MAIN = { normal: "start", "flex-start": "start", start: "start", left: "start", center: "center", "flex-end": "end", end: "end", right: "end", "space-between": "auto", "space-around": "auto", "space-evenly": "auto" };
  const ALIGN_CROSS = { normal: "start", stretch: "start", "flex-start": "start", start: "start", "self-start": "start", baseline: "start", center: "center", "flex-end": "end", end: "end", "self-end": "end" };
  const ALIGN_CSS = { start: "flex-start", center: "center", end: "flex-end" };
  // "safe center" and "first baseline" mean their keyword here.
  const alignWord = (v) => String(v || "").trim().replace(/^(safe|unsafe|first|last)\s+/, "");
  const mainOf = (v) => ALIGN_MAIN[alignWord(v)] || "start";
  const crossOf = (v) => ALIGN_CROSS[alignWord(v)] || "start";
  const stretchy = (v) => /^(normal|stretch)$/.test(alignWord(v));
  // Wrapped, Figma's alignment across moves the rows as one block, with the gap between them: align-content packed
  // to a side. Its normal stretches the rows apart instead, so then the cell is read off align-items.
  const PACKED = { "flex-start": "start", start: "start", center: "center", "flex-end": "end", end: "end" };
  function alignOf(t) {
    const cs = getComputedStyle(t);
    const packed = /^wrap/.test(cs.flexWrap) && PACKED[alignWord(cs.alignContent)];
    return { main: mainOf(cs.justifyContent), cross: packed || crossOf(cs.alignItems), stretch: stretchy(cs.alignItems) };
  }
  // Packs a wrap's rows to that side, handed back when the code's own already does.
  function packRows(t, cross) {
    if (PACKED[alignWord(ownValue(t, "align-content"))] === cross) handBack(t, "align-content");
    else setStyle(t, "align-content", ALIGN_CSS[cross]);
  }
  function padOf(t) {
    const cs = getComputedStyle(t);
    return [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map((v) => parseFloat(v) || 0);
  }

  // The layers a flex or grid places. An absolute one is out of the flow (Figma's Ignore auto layout), so it has no
  // part in the gap or the alignment; all keeps it, for Freeform's Spacing, which moves absolute layers too. A
  // display: contents wrapper has no box of its own: the flex or grid places its children, so they stand in for it.
  function flowChildren(t, all) {
    const out = [];
    Array.from(t.children).forEach((c) => {
      if (isUi(c)) return;
      const cs = getComputedStyle(c);
      if (cs.display === "contents") out.push(...flowChildren(c, all));
      else if (cs.display !== "none" && cs.position !== "fixed" && (all || cs.position !== "absolute")) out.push(c);
    });
    return out;
  }
  // Words straight inside a display: contents wrapper become a box of their own in a flex, one with no element to
  // measure.
  const looseWords = (t) => Array.from(t.children).some((c) => !isUi(c) && getComputedStyle(c).display === "contents"
    && (Array.from(c.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()) || looseWords(c)));

  // A layer's border box from its container's border box, with transforms left out (a running animation, or a move
  // she made, isn't layout). Offset geometry does that for an HTML element; an <svg> has none, so its rect is read
  // instead, scaled back by the container's own scale and with its own translate taken off. null when it has no box.
  function boxIn(t, c) {
    if (c instanceof HTMLElement) {
      if (!c.offsetParent) return null;
      const mine = c.offsetParent === t;
      const off = { x: c.offsetLeft + (mine ? t.clientLeft : -t.offsetLeft), y: c.offsetTop + (mine ? t.clientTop : -t.offsetTop), w: c.offsetWidth, h: c.offsetHeight };
      // Offset geometry rounds to whole pixels, so two 22.4px lines of text would read as a 1px gap that isn't
      // there, and auto layout would move them. A layer whose transform only moves it (most layers, and an
      // animation's slide) is read from its rect instead, which keeps the fractions, with the move taken off.
      // A turned or scaled layer keeps the offsets. So does one under a turn or a skew anywhere above (the container,
      // or a tilted card around it): a rect is the upright box around the turned one, so every gap read from it
      // would be wrong. A plain scale up there is fine, it's read off the container's rect below. So is a translate
      // that calc() mixes, which can't be taken off the rect exactly.
      const cs = getComputedStyle(c);
      const tcs = getComputedStyle(t);
      const moveOnly = (s) => s.rotate === "none" && s.scale === "none" && (s.transform === "none" || /^matrix\(1, 0, 0, 1,/.test(s.transform));
      const upright = (s) => s.rotate === "none" && /^(none|matrix\([^,]+, 0, 0,)/.test(s.transform);
      let up = t;
      while (up && upright(getComputedStyle(up))) up = up.parentElement;
      if (!moveOnly(cs) || up || /\(/.test(cs.translate)) return off;
      const n = (v) => parseFloat(v) || 0;
      // The container's scale on screen (its own, or a scaled page around it), against its exact layout size.
      const lay = (k, a, b) => (/px$/.test(tcs[k]) ? n(tcs[k]) + (tcs.boxSizing !== "border-box" ? n(tcs["padding" + a]) + n(tcs["padding" + b]) + n(tcs["border" + a + "Width"]) + n(tcs["border" + b + "Width"]) : 0) : 0);
      const r = c.getBoundingClientRect();
      const tr = t.getBoundingClientRect();
      const lw = lay("width", "Left", "Right") || t.offsetWidth;
      const lh = lay("height", "Top", "Bottom") || t.offsetHeight;
      if (!lw || !lh) return off;
      const sx = tr.width / lw;
      const sy = tr.height / lh;
      const w = r.width / sx;
      const h = r.height / sy;
      // A translate in % stays a % in the computed value, and it's a share of the layer's own size.
      const part = (v, size) => (/%$/.test(v) ? (n(v) / 100) * size : n(v));
      const tl = cs.translate && cs.translate !== "none" ? cs.translate.split(/\s+/) : [];
      const m = cs.transform !== "none" ? new DOMMatrixReadOnly(cs.transform) : null;
      return {
        x: (r.left - tr.left) / sx + t.scrollLeft - (tl[0] ? part(tl[0], w) : 0) - (m ? m.e : 0),
        y: (r.top - tr.top) / sy + t.scrollTop - (tl[1] ? part(tl[1], h) : 0) - (m ? m.f : 0),
        w,
        h,
      };
    }
    if (!c.getBoundingClientRect) return null;
    const r = c.getBoundingClientRect();
    const tr = t.getBoundingClientRect();
    const sx = t.offsetWidth ? tr.width / t.offsetWidth : 1;
    const sy = t.offsetHeight ? tr.height / t.offsetHeight : 1;
    const cs = getComputedStyle(c);
    const n = (v) => parseFloat(v) || 0;
    const content = cs.boxSizing !== "border-box";
    const w = n(cs.width) + (content ? n(cs.paddingLeft) + n(cs.paddingRight) + n(cs.borderLeftWidth) + n(cs.borderRightWidth) : 0);
    const h = n(cs.height) + (content ? n(cs.paddingTop) + n(cs.paddingBottom) + n(cs.borderTopWidth) + n(cs.borderBottomWidth) : 0);
    // A turn or a scale about the centre leaves the centre where it was, so only the moves are taken off it.
    // A % translate is a share of the layer's own size, as above.
    const tl = cs.translate && cs.translate !== "none" ? cs.translate.split(/\s+/).map((v, i) => (/%$/.test(v) ? (n(v) / 100) * (i ? h : w) : n(v))) : [];
    const m = cs.transform && cs.transform !== "none" ? new DOMMatrixReadOnly(cs.transform) : null;
    const cx = ((r.left + r.right) / 2 - tr.left) / sx - (tl[0] || 0) - (m ? m.e : 0);
    const cy = ((r.top + r.bottom) / 2 - tr.top) / sy - (tl[1] || 0) - (m ? m.f : 0);
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }

  // A px length, written unless the code's own reads the same (a gap's normal reads as 0), so a value that matches
  // the code leaves no edit behind.
  function setPx(t, prop, n) {
    const own = ownValue(t, prop);
    if ((own === "normal" ? 0 : parseFloat(own)) === n) handBack(t, prop);
    else setStyle(t, prop, n + "px");
  }

  // An alignment, handed back when the code's own means the same (normal and flex-start are both start).
  function setAlignment(t, prop, value) {
    const own = ownValue(t, prop);
    // Across, the code's normal is stretch, not start: a layer that hugs would fill again if handed back to it.
    const same = value === "space-between" ? alignWord(own) === value
      : prop === "justify-content" ? mainOf(own) === mainOf(value) : crossOf(own) === crossOf(value) && stretchy(own) === stretchy(value);
    if (same) handBack(t, prop);
    else setStyle(t, prop, value);
  }

  // In Figma a new alignment never changes a layer's Fill. In CSS a layer fills across only under stretch, so
  // before align-items first leaves the code's stretch, each layer that fills across keeps it with its own
  // align-self. A layer that fills reads as one that spans the content box (a fixed one that happens to span it
  // gets an align-self that changes nothing).
  function keepStretch(t) {
    if (!stretchy(ownValue(t, "align-items")) || !stretchy(getComputedStyle(t).alignItems)) return;
    const col = /column/.test(getComputedStyle(t).flexDirection);
    const p = padOf(t);
    const inner = col ? t.clientWidth - p[1] - p[3] : t.clientHeight - p[0] - p[2];
    flowChildren(t).forEach((c) => {
      const cs = getComputedStyle(c);
      if (!/^(auto|normal|stretch)$/.test(cs.alignSelf)) return;
      const m = col ? (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0) : (parseFloat(cs.marginTop) || 0) + (parseFloat(cs.marginBottom) || 0);
      const b = boxIn(t, c);
      if (b && Math.abs((col ? b.w : b.h) + m - inner) < 0.5) setUnlessOwn(c, "align-self", "stretch");
    });
  }
  // Back on the code's stretch, those align-selfs say nothing, so they'd only be noise in Copy.
  function dropStretch(t) {
    if (!stretchy(getComputedStyle(t).alignItems)) return;
    flowChildren(t, true).forEach((c) => {
      const e = entryOf(c);
      if (e && e.styles["align-self"] === "stretch") handBack(c, "align-self");
    });
  }

  // A container's layers as margin boxes from its border box, in the code's order, for inferLayout. Offset geometry
  // ignores transforms, so a running animation can't skew them; Spacing's share of a translate is added back,
  // since that's where she sees the layer. Her own moves stay hers and aren't read as layout. m is the margins (top,
  // right, bottom, left). null when a layer has no box to read: the padding read from the others alone would move
  // every layer.
  function layoutBoxes(t, list) {
    const out = [];
    for (const c of list) {
      const box = boxIn(t, c);
      if (!box) return null;
      const cs = getComputedStyle(c);
      const m = [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft].map((v) => parseFloat(v) || 0);
      const e = entryOf(c);
      const x = box.x + ((e && e.sim && e.sim.x) || 0);
      const y = box.y + ((e && e.sim && e.sim.y) || 0);
      out.push({ el: c, m, l: x - m[3], t: y - m[0], r: x + box.w + m[1], b: y + box.h + m[2] });
    }
    return out;
  }

  // Figma's Add auto layout, as a pure read: the flow, gap, alignment and padding that keep the boxes where they
  // are. opts.flow forces the direction; opts.content and opts.pad (a real container's content box and own
  // padding) let padding be read too. moves says some layer will still move (the gaps differ, or the order on
  // screen isn't the code's). Returns { reason } when the boxes overlap both ways.
  function inferLayout(boxes, opts) {
    opts = opts || {};
    if (!boxes.length) return { reason: "empty" };
    // Margin boxes, or border boxes (bare): collapsed block margins overlap as margin boxes even though the layers
    // themselves sit one after another, so either way counts as a stack.
    const fits = (lo, hi, bare) => {
      const at = (x, k) => x[k] + (bare && x.m ? { t: x.m[0], b: -x.m[2], l: x.m[3], r: -x.m[1] }[k] : 0);
      const s = boxes.slice().sort((a, b) => at(a, lo) - at(b, lo));
      return s.every((x, i) => !i || at(x, lo) >= at(s[i - 1], hi) - 0.5);
    };
    const stacks = (lo, hi) => fits(lo, hi) || fits(lo, hi, true);
    const flow = opts.flow || (boxes.length < 2 || stacks("t", "b") ? "vertical" : stacks("l", "r") ? "horizontal" : null);
    if (!flow) return { reason: "overlap" };
    const y = flow === "vertical";
    const [lo, hi, clo, chi] = y ? ["t", "b", "l", "r"] : ["l", "r", "t", "b"];
    const same = (vals, tol) => vals.every((v) => Math.abs(v - vals[0]) <= tol);
    let moves = false;
    // Flex places them in the code's order, so the gaps are read in that order too: between margin boxes, since
    // flex doesn't collapse margins.
    let gaps = boxes.slice(1).map((b, i) => b[lo] - boxes[i][hi]);
    // Figma's gap is the space she sees between the layers, which is also what Freeform's Spacing shows. So where
    // margins between the layers make that space and it's even, the gap is read between the border boxes and those
    // margins go (dropMargins); the first's start and the last's end stay, inside the padding. Block margins that
    // collapsed (two 8px margins make one 8px space) take the same path, since there the margin boxes overlap.
    // Only where the border boxes sit unevenly and the margin boxes evenly do the margins stay, under a gap of 0.
    const ms = (b) => (b.m ? b.m[y ? 0 : 3] : 0);
    const me = (b) => (b.m ? b.m[y ? 2 : 1] : 0);
    const bare = boxes.slice(1).map((b, i) => b[lo] + ms(b) - (boxes[i][hi] - me(boxes[i])));
    const holds = (g) => same(g, 0.5) && g[0] >= -0.5;
    let dropMargins = false;
    const between = boxes.slice(1).some((b, i) => ms(b) || me(boxes[i]));
    if (between && (holds(bare) || (!holds(gaps) && gaps.some((g) => g < -0.5)))) {
      gaps = bare;
      dropMargins = true;
    }
    let gap = 0;
    if (gaps.length) {
      if (same(gaps, 0.5)) gap = gaps[0];
      else {
        const s = gaps.slice().sort((a, b) => a - b);
        const mid = s.length >> 1;
        gap = s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
        moves = true;
      }
      // CSS has no negative gap.
      if (gap < -0.5) moves = true;
      gap = Math.max(0, Math.round(gap));
    }
    const starts = boxes.map((b) => b[clo]);
    const mids = boxes.map((b) => (b[clo] + b[chi]) / 2);
    const ends = boxes.map((b) => b[chi]);
    const cross = same(starts, 1) ? "start" : same(mids, 1) ? "center" : same(ends, 1) ? "end" : "start";
    if (cross === "start" && !same(starts, 1)) moves = true;
    let pad = [0, 0, 0, 0];
    if (opts.content && opts.pad) {
      const C = opts.content;
      const own = opts.pad;
      pad = own.slice();
      const add = (i, v) => { pad[i] = Math.max(0, Math.round(own[i] + v)); };
      const first = Math.min(...boxes.map((b) => b[lo]));
      // Only the sides that place the layers change: where the flow starts, and across it the side (or the
      // middle) the alignment holds to. The rest keep the code's, so no padding grows that places nothing.
      add(y ? 0 : 3, first - (y ? C.t : C.l));
      if (cross === "start") add(y ? 3 : 0, Math.min(...starts) - (y ? C.l : C.t));
      else if (cross === "end") add(y ? 1 : 2, (y ? C.r : C.b) - Math.max(...ends));
      else {
        const d = mids[0] - (y ? (C.l + C.r) / 2 : (C.t + C.b) / 2);
        if (Math.abs(d) >= 0.5) {
          if (d > 0) add(y ? 3 : 0, 2 * d);
          else add(y ? 1 : 2, -2 * d);
        }
      }
    }
    return { flow, gap, pad, cross, main: "start", moves, dropMargins };
  }

  // A layer whose look is only its words: nothing paints its box (no fill, border, shadow, outline, ::before or
  // ::after), and, across a column, its lines start at its start edge. Hugging the words puts them where they
  // already are (a line too long to fit still fills, as fit-content does), so it needn't fill across.
  function onlyWords(e, column) {
    if (!(e instanceof HTMLElement) || !hasText(e)) return false;
    const cs = getComputedStyle(e);
    const none = (which) => /^(none|normal)$/.test(getComputedStyle(e, which).content);
    return cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.backgroundImage === "none"
      && ["Top", "Right", "Bottom", "Left"].every((side) => cs["border" + side + "Style"] === "none" || parseFloat(cs["border" + side + "Width"]) === 0)
      && cs.boxShadow === "none" && cs.outlineStyle === "none" && none("::before") && none("::after")
      && (!column || cs.textAlign === "start" || cs.textAlign === (cs.direction === "rtl" ? "right" : "left"));
  }

  // Turns a real container into auto layout from how its layers sit, so they don't jump: display (inline stays
  // inline), direction, the gap, align-items (always written, so the layers hug as Figma's do) and the padding,
  // each a longhand through setUnlessOwn, so what the code already has leaves no edit. A layer that filled across
  // keeps filling (align-self: stretch), unless it's only words (onlyWords). Spacing's moves on the layers go, the
  // gap takes over from them.
  // The padding and margins written only to hold the layers are marked (entry.inferred), so going back to
  // Freeform can take them off again: the code's block layout places the layers without them.
  // readInferred is the read alone, so the Layout header can say what ⇧A would pick without writing anything.
  function readInferred(t, forced) {
    const p = padOf(t);
    const content = { l: t.clientLeft + p[3], t: t.clientTop + p[0], r: t.clientLeft + t.clientWidth - p[1], b: t.clientTop + t.clientHeight - p[2] };
    if (looseWords(t)) return { inf: { reason: "unmeasured" } };
    const boxes = layoutBoxes(t, flowChildren(t));
    if (!boxes) return { inf: { reason: "unmeasured" } };
    return { inf: inferLayout(boxes, { flow: forced, content, pad: p }), boxes, content, p };
  }
  function applyInferred(t, forced) {
    const { inf, boxes, content, p } = readInferred(t, forced);
    if (inf.reason) return inf;
    const mark = (el, prop) => record(el, (entry) => {
      if (entry.styles[prop] == null) return;
      entry.inferred = Object.assign({}, entry.inferred, { [prop]: entry.styles[prop] });
    });
    const y = inf.flow === "vertical";
    // A layer that spans across keeps filling, unless its look is only its words (onlyWords): those sit in the same
    // place hugging them, so it hugs, as a text layer does in Figma's auto layout, and the alignment then moves it.
    const fills = boxes.filter((b) => (y ? Math.abs(b.l - content.l) < 0.5 && Math.abs(b.r - content.r) < 0.5
      : Math.abs(b.t - content.t) < 0.5 && Math.abs(b.b - content.b) < 0.5) && !onlyWords(b.el, y));
    // Block margins that collapsed out through the container (nothing on that side stops them: no padding, no
    // border, and at the bottom an auto height) sit outside its box. Flex collapses none, so they'd land inside it
    // and grow it. They move onto the container's own margin, where they collapse as before, so nothing moves. A
    // negative margin of its own doesn't add up that simply: then it stays, and the toast says layers moved.
    const leaks = [];
    if (y) {
      const cs = getComputedStyle(t);
      const n = (v) => parseFloat(v) || 0;
      const first = boxes[0];
      const last = boxes[boxes.length - 1];
      if (first.m[0] > 0 && !p[0] && !n(cs.borderTopWidth) && Math.abs(first.t + first.m[0] - content.t) < 0.5) leaks.push([first.el, "margin-top", first.m[0], n(cs.marginTop)]);
      if (last.m[2] > 0 && !p[2] && !n(cs.borderBottomWidth) && Math.abs(last.b - last.m[2] - content.b) < 0.5 && sizedByLayout(t, "h")) leaks.push([last.el, "margin-bottom", last.m[2], n(cs.marginBottom)]);
    }
    const r0 = t.getBoundingClientRect();
    const own = ownValue(t, "display");
    if (/flex/.test(own)) handBack(t, "display");
    else setStyle(t, "display", own.startsWith("inline") ? "inline-flex" : "flex");
    setUnlessOwn(t, "flex-direction", y ? "column" : "row");
    setPx(t, y ? "row-gap" : "column-gap", inf.gap);
    setAlignment(t, "justify-content", "flex-start");
    setUnlessOwn(t, "align-items", ALIGN_CSS[inf.cross]);
    fills.forEach((b) => setUnlessOwn(b.el, "align-self", "stretch"));
    boxes.forEach((b) => takeBackSpacing(b.el));
    if (inf.dropMargins) {
      const [ps, pe] = y ? ["margin-top", "margin-bottom"] : ["margin-left", "margin-right"];
      boxes.forEach((b, i) => {
        if (i && b.m[y ? 0 : 3]) {
          setPx(b.el, ps, 0);
          mark(b.el, ps);
        }
        if (i < boxes.length - 1 && b.m[y ? 2 : 1]) {
          setPx(b.el, pe, 0);
          mark(b.el, pe);
        }
      });
    }
    leaks.forEach(([c, prop, m, mine]) => {
      if (mine < 0) return;
      setPx(c, prop, 0);
      mark(c, prop);
      if (m > mine) {
        setPx(t, prop, m);
        mark(t, prop);
      }
    });
    ["padding-top", "padding-right", "padding-bottom", "padding-left"].forEach((prop, i) => {
      if (Math.abs(inf.pad[i] - p[i]) < 0.05) return;
      setPx(t, prop, inf.pad[i]);
      mark(t, prop);
    });
    // The frame itself should stay put too; where it didn't, the toast says so.
    const r1 = t.getBoundingClientRect();
    if (["left", "top", "right", "bottom"].some((k) => Math.abs(r1[k] - r0[k]) >= 0.5)) inf.moves = true;
    if (selection) selection.reshow();
    return inf;
  }

  // Back to Freeform, what applyInferred wrote only to hold the layers goes too, unless she has changed it since
  // (then it's hers and stays).
  function dropInferred(t) {
    const e = entryOf(t);
    if (!e || !e.inferred) return;
    const inf = e.inferred;
    Object.keys(inf).forEach((prop) => {
      const now = entryOf(t);
      if (now && now.styles[prop] === inf[prop]) handBack(t, prop);
    });
    record(t, (entry) => { delete entry.inferred; });
  }

  // A container back to Freeform, for the Flow row and ⌥⇧A alike. An inline layer stays inline (inline-block), so
  // the text around it doesn't reflow.
  function toFreeform(t) {
    const own = ownValue(t, "display");
    if (/flex|grid/.test(own)) setStyle(t, "display", own.startsWith("inline") ? "inline-block" : "block");
    else {
      handBack(t, "display");
      // Back to inline, a layer she moved, turned or sized loses that on screen, so it's boxed again.
      const e = edits.elements[keyOf(t)];
      if (e && ["translate", "rotate", "scale", "width", "height"].some((p) => e.styles[p])) boxed(t);
    }
    handBack(t, "flex-direction");
    // Wrap, the gaps and the alignment mean nothing off flex, so her edits to them go too (they'd only be noise in
    // Copy). Her padding stays: it still places the layers. The padding and margins that only held the layers under
    // flex go, or the block layout would add them to its own and move the layers.
    const e = entryOf(t);
    ["flex-wrap", "row-gap", "column-gap", "justify-content", "align-items", "align-content"].forEach((p) => {
      if (e && e.styles[p] != null) handBack(t, p);
    });
    dropInferred(t);
    flowChildren(t, true).forEach((c) => {
      const ce = entryOf(c);
      if (ce && ce.styles["align-self"] === "stretch") handBack(c, "align-self");
      dropInferred(c);
    });
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
    // Live as she types, a sum once it adds up (16-2 shows 14; 16- shows nothing new yet).
    f.input.addEventListener("input", () => {
      const n = parse(mathValue(f.input.value));
      if (!isNum(n) || n < min) return;
      g[key] = n;
      onChange();
    });
    const back = () => {
      if (g[key] === start) return;
      g[key] = start;
      onChange();
    };
    f.input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") back();
    });
    // A sum left unfinished goes back to the value from before the typing, as a refused one does below.
    f.input.addEventListener("blur", () => {
      if (mathValue(f.input.value) === null) back();
    });
    editable(f.input, (force) => f.set(g[key], force), (v) => {
      const n = parse(v);
      if (!isNum(n) || n < min) return back();
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
      e.stopPropagation();
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
      e.stopPropagation();
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
  // The @keyframes names her edits run (every animation-name she set, on a layer or a component).
  function namesRun() {
    const runs = new Set();
    JSON.stringify(edits, (k, v) => {
      if (k === "newKeyframes" || k === "keyframes" || k === "waapi") return undefined;
      if (k === "animation-name" && typeof v === "string") splitTop(v).forEach((n) => runs.add(n.trim()));
      return v;
    });
    return runs;
  }
  // An added @keyframes nothing runs any more (another was picked in its place) goes, from the page and the edits,
  // so Copy doesn't ask the code for it and picking it again takes its own name back.
  function dropUnusedKeyframes() {
    const runs = namesRun();
    Object.keys(edits.newKeyframes).forEach((name) => {
      if (runs.has(name)) return;
      putNewKeyframes(name, null);
      delete edits.newKeyframes[name];
      delete edits.keyframes[name];
    });
    noteChange();
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
      } else if (v.x && v.y) {
        // Keyframes that move but sit still now (a distance typed to 0) still offer the move, so it can be typed
        // out again: Up until the panel knows better (moveShape).
        info.direction = "up";
        info.distance = { n: 0, u: moving[0].parts.move.y.u };
      }
    }
    // The keyframe(s) farthest from rest (scale 1, no turn, opacity 1), which a field edits together. Keyframes that
    // declare it but sit at rest (typed back to 1, say) still offer it (rest: true), so it can be typed again.
    const farthest = (aspect, rest) => {
      const list = has(aspect);
      if (!list.length || list.some((f) => f.parts[aspect] == null)) return;
      const far = list.reduce((a, b) => (Math.abs(b.parts[aspect] - rest) > Math.abs(a.parts[aspect] - rest) ? b : a));
      if (Math.abs(far.parts[aspect] - rest) < 1e-6) {
        info[aspect] = { value: rest, frames: list, rest: true };
        return;
      }
      info[aspect] = { value: far.parts[aspect], frames: list.filter((f) => Math.abs(f.parts[aspect] - far.parts[aspect]) < 1e-6) };
    };
    farthest("scale", 1);
    farthest("rotate", 0);
    farthest("opacity", 1);
    return info;
  }
  // Turns every keyframe's move from one direction to another, keeping its distance: along the same axis it
  // flips, across it swaps the axes.
  function turnMove(m, from, to) {
    const [fx, fy] = DIRS[from];
    const [tx, ty] = DIRS[to];
    const s = (l, k) => ({ n: l.n * k, u: l.u });
    return fx && tx ? { x: s(m.x, fx * tx), y: m.y } : fy && ty ? { x: m.x, y: s(m.y, fy * ty) }
      : fy ? { x: s(m.y, fy * tx), y: s(m.x, fy * tx) } : { x: s(m.y, fx * ty), y: s(m.x, fx * ty) };
  }
  function turnMoves(info, to) {
    info.frames.forEach((f) => {
      const m = f.parts.move;
      if (!m || (!m.x.n && !m.y.n)) return;
      writePart(f, "move", turnMove(m, info.direction, to));
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
  // A move apart from its size: its direction and each moving keyframe's move per unit of distance. The panel keeps
  // the last one it saw, so a move typed down to 0 types out again as it was. With none, the first keyframe that
  // moves goes Up toward where the layer sits (as Slide in does), or away from it when that keyframe is later.
  function moveShape(info) {
    const per = (l) => ({ n: l.n / info.distance.n, u: l.u });
    return {
      direction: info.direction,
      frames: info.frames.filter((f) => f.parts.move && (f.parts.move.x.n || f.parts.move.y.n)).map((f) => ({ at: f.at, x: per(f.parts.move.x), y: per(f.parts.move.y) })),
    };
  }
  function stillShape(info) {
    const f = info.frames.find((g) => g.parts.move);
    return { direction: "up", frames: [{ at: f.at, x: { n: 0, u: f.parts.move.x.u }, y: { n: f.at ? -1 : 1, u: f.parts.move.y.u } }] };
  }
  const turnShape = (shape, to) => ({ direction: to, frames: shape.frames.map((p) => Object.assign({ at: p.at }, turnMove(p, shape.direction, to))) });
  // Moves the keyframes of a still move out to this distance, in the shape's direction.
  function putShape(info, shape, n) {
    shape.frames.forEach((p) => {
      const f = info.frames.find((g) => g.at === p.at && g.parts.move);
      if (f) writePart(f, "move", { x: { n: p.x.n * n, u: p.x.u }, y: { n: p.y.n * n, u: p.y.u } });
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
  // Each layer's entries, so a call only looks at its own layer's (a pointer follower calls animate() every frame).
  // seq keeps them in the order they were first seen, the same on every layer, so a group's key matches.
  const waapiByEl = new WeakMap();
  let waapiSeq = 0;
  // Set by the inspector: gives a new call the playback speed while its layer is being watched. It's handed the
  // layer and the call's animation, and must stay cheap: it runs on every call.
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
  function dropTarget(entry, el) {
    entry.targets.delete(el);
    const mine = waapiByEl.get(el);
    if (mine) mine.delete(entry);
    if (!entry.targets.size) waapi.delete(entry.key);
  }
  // stack is the call's Error: the browser only writes its text out when it's read, so it's read once, for a new entry.
  function noteAnim(el, anim, frames, timing, id, stack, key) {
    key = key || (id ? "id:" + id : JSON.stringify(frames));
    let entry = waapi.get(key);
    if (!entry) {
      const text = typeof stack === "string" ? stack : stack && stack.stack;
      entry = { key, seq: ++waapiSeq, label: id || propsOf(frames).join(", "), hint: callerOf(text), frames, targets: new Map() };
      waapi.set(key, entry);
    }
    let mine = waapiByEl.get(el);
    if (!mine) waapiByEl.set(el, (mine = new Set()));
    // A layer the page animates again with fresh values (a pointer follower) is one animation, not one per call: an
    // earlier call on it of the same properties is let go, unless she has edited it, once it's over or this one
    // replaces it (not adding to it: composite "add" or "accumulate").
    const replaces = anim.effect && anim.effect.composite === "replace" && !frames.some((f) => f.composite && f.composite !== "replace");
    mine.forEach((other) => {
      if (other === entry || other.label !== entry.label || edits.waapi[other.key]) return;
      const was = other.targets.get(el).anim;
      if (replaces || (was.playState !== "running" && was.playState !== "paused")) dropTarget(other, el);
    });
    entry.targets.set(el, { anim, timing });
    mine.add(entry);
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
          const frames = effect.getKeyframes().map(cleanFrame);
          plan = { frames, timing: codeTiming(effect.getTiming()), id, stack: new Error(), key: id ? "id:" + id : JSON.stringify(frames) };
        }
      } catch (e) {
        plan = null;
      }
      let kf = keyframes;
      let opts = options;
      const ed = plan && edits.waapi[plan.key];
      if (ed) {
        kf = editedFrames(plan.frames, ed);
        opts = Object.assign(typeof options === "number" ? {} : Object.assign({}, options), editedTiming(plan.timing, ed, selectorFor(this)));
      }
      const anim = native.call(this, kf, opts);
      if (plan) {
        try {
          noteAnim(this, anim, plan.frames, plan.timing, plan.id, plan.stack, plan.key);
          afterAnimate(this, anim);
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
      if (!el.isConnected) dropTarget(entry, el);
    }));
  }
  // The JavaScript animations a layer runs.
  const waapiOf = (e) => {
    const mine = waapiByEl.get(e);
    return mine ? Array.from(mine).sort((a, b) => a.seq - b.seq) : [];
  };
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
        } else if (r.cssRules && !(r instanceof CSSKeyframesRule)) {
          // A rule for another screen size, or a feature this browser lacks, can't start here.
          try {
            if (window.CSSMediaRule && r instanceof CSSMediaRule && !matchMedia(r.conditionText || r.media.mediaText).matches) continue;
            if (window.CSSSupportsRule && r instanceof CSSSupportsRule && !CSS.supports(r.conditionText)) continue;
          } catch (e) {
            // A condition it can't read is walked as before.
          }
          walk(r.cssRules);
        }
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

    // Undo and redo the latest change, as in Figma (also ⌘Z and ⌘⇧Z). They sit at the left of the panel's top
    // row; Hide UI is at its right (Reset is in the left toolbar).
    const undoBtn = iconButton(ICON.undo, "Undo", undo);
    const redoBtn = iconButton(ICON.redo, "Redo", redo);
    undoBtn.setAttribute("data-ft-tip-key", KEYS.mod + "Z");
    redoBtn.setAttribute("data-ft-tip-key", KEYS.shiftMod + "Z");
    const actions = el("div", "ft-actions");
    actions.append(undoBtn, redoBtn);
    const top = el("div", "ft-top");
    top.appendChild(actions);
    // Design and Motion, as Figma's Design and Prototype, in a bar at the bottom of the window. It lives in the
    // panel, so it hides with it.
    const designPane = el("div", "ft-pane");
    const motionPane = el("div", "ft-pane");
    motionPane.hidden = true;
    const modes = el("div", "ft-modes");
    const modeBtns = [["design", "Design", "pencilRuler"], ["motion", "Motion", "motion"]].map(([name, label, icon]) => {
      const b = button("ft-modes-btn", null, () => {
        // Scale is a Design tool: Motion leaves it.
        if (name === "motion" && scaleMode) endScale();
        modeBtns.forEach((m) => m.setAttribute("aria-selected", String(m === b)));
        root.setAttribute("data-tab", name);
        menu.close();
        picker.close();
        imagePop.close();
        fontsPop.close();
        textStylesPop.close();
        colorStylesPop.close();
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
    historyChanged = () => {
      undoBtn.disabled = !history.past.length && !history.timer && !undoReset;
      redoBtn.disabled = !history.future.length;
      // Reset is off with nothing to reset: no edit on the page and nothing Save stored.
      if (resetBtn) resetBtn.disabled = !canReset();
    };

    // A page fill saved from an earlier visit comes back; the bottom layer is the base.
    pageEl = pageCanvas();
    // The fill the page's code gives it as it shows now (the wrapper's, else the body's, else the root's).
    const ownFill = () => toFill(getComputedStyle(livePage()).backgroundColor)
      || toFill(getComputedStyle(document.body).backgroundColor)
      || toFill(getComputedStyle(document.documentElement).backgroundColor)
      || { hex: "FFFFFF", opacity: 100, visible: true };
    // The page's own fill (before any paint), for undoing back to it.
    const pageOwn = {
      layer: ownFill(),
      color: pageEl.style.backgroundColor,
      image: pageEl.style.backgroundImage,
    };
    const layers = edits.page ? edits.page.map((l) => Object.assign({}, l)) : [Object.assign({}, pageOwn.layer)];
    const picker = makePicker(root);

    // Fills stack like Figma's: the top row paints on top.
    function paint() {
      const shown = layers.filter((l) => l.visible).map((l) => "linear-gradient(" + rgba(l) + ", " + rgba(l) + ")");
      const page = livePage();
      page.style.backgroundColor = "transparent";
      page.style.backgroundImage = shown.length ? shown.join(", ") : "none";
      picker.sync();
    }

    function paintAndSave() {
      paint();
      // The page's own fill as her first edit found it, so Copy can tell a bottom row she never touched (the code's
      // own background, a token in each theme) from a colour she picked.
      if (!edits.page) edits.pageBase = { hex: pageOwn.layer.hex, opacity: pageOwn.layer.opacity };
      edits.page = layers.map((l) => Object.assign({}, l));
      // The fill is a list of layers, so the window it was set in is kept beside it.
      stampView((edits.pageView = {}));
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
      readPageOwn();
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
    // The page can switch theme after finetune read its fill: a .dark class a React theme provider adds once the
    // app mounts (a Vite app runs this script first), a theme toggle, or the system's setting. While she has no
    // fill of her own, the base row is read again, so it shows the page as it is now and Add fill stacks on that.
    function readPageOwn() {
      if (edits.page) return;
      const fill = ownFill();
      pageOwn.layer = fill;
      const base = layers[0];
      if (layers.length === 1 && base.hex === fill.hex && base.opacity === fill.opacity) return;
      layers.forEach((l) => picker.closeFor(l));
      layers.splice(0, layers.length, Object.assign({}, fill));
      drawRows();
    }
    // A switch is a class, a style or a data-theme on html or body; finetune's own ft- classes there aren't one.
    const ownClasses = (v) => String(v || "").split(/\s+/).filter((c) => c && !/^ft-/.test(c)).join(" ");
    // Read on the next frame, not at once: a page's styles can follow the switch a moment later (Tailwind's
    // browser build writes the new theme's rules when it sees the class), and a read before that is the old fill.
    let themeFrame = 0;
    const readSoon = () => { if (!themeFrame) themeFrame = requestAnimationFrame(() => { themeFrame = 0; readPageOwn(); }); };
    const themeWatch = new MutationObserver((list) => {
      if (list.some((m) => m.attributeName !== "class" || ownClasses(m.oldValue) !== ownClasses(m.target.getAttribute("class")))) readSoon();
    });
    [document.documentElement, document.body].forEach((e) => themeWatch.observe(e, { attributes: true, attributeOldValue: true, attributeFilter: ["class", "style", "data-theme", "data-mode", "data-color-scheme"] }));
    if (systemDark) systemDark.addEventListener("change", readSoon);
    // A theme that fades its colours in reads mid-fade at the switch, so the fill is read again when it lands.
    document.addEventListener("transitionend", (e) => {
      if (e.propertyName === "background-color" && (e.target === livePage() || e.target === document.body || e.target === document.documentElement)) readPageOwn();
    }, true);
    // She can reach the rows only through the panel, so they're checked again as the pointer comes in.
    page.addEventListener("pointerenter", readPageOwn);

    const menu = makeMenu(root);
    openLayerMenu = (x, y, rows, onPick, onHover) => menu.openAt(x, y,
      [{ heading: true, label: "Select layer" }].concat(rows.map((r, i) => ({ label: (componentOf(r.t) || kindOf(r.t)) + " · " + elName(r.t), value: i, depth: r.depth }))),
      (i) => onPick(rows[i].t), (i) => onHover(i == null ? null : rows[i].t));
    closeMenu = menu.close;
    const imagePop = makeImagePop(root, menu, () => changed(false));
    const fontsPop = makeFontsPop(root, menu);
    const textStylesPop = makeCodeStylesPop(root, "Text styles");
    const colorStylesPop = makeCodeStylesPop(root, "Color styles");

    // Horizontal layout: one columns layout at a time (Figma's layout guide). With none saved for the page,
    // it starts as the page's own grid when its code has one (pageGrid), ready to tweak, hidden until ⌃G or its eye
    // shows it (her call: visibility off is the default). Its row's icon opens its color, the eye shows or hides
    // it, and its fields and alignment sit under it. Save keeps it; Copy never includes it. The header saves it as
    // a style, or applies a saved one.
    const guides = edits.guides;
    // For the guide following the window's width (followPage): the last page grid it was on (a width with no grid
    // keeps the one before), the untouched guide set aside while the width has none, and whether a page grid was ever
    // taken up (so one she removed isn't put back).
    let anchor = null;
    let parked = null;
    let tookPage = false;
    parkedGuide = () => parked;
    takePageGrid();
    // The page grid, taken up as the page's layout when there's none (hidden), and what a saved layout on its numbers
    // (fromPage, see savable) now reads: the code's grid as it is today.
    function takePageGrid() {
      pageDefault = pageGrid();
      if (pageDefault) pageDefault.visible = false;
      anchor = pageDefault;
      parked = null;
      // With no layout saved for the page, it opens on the active grid she set (this page's, else every page's). One
      // that follows the page's own grid, on a page or at a width with none, is set aside as a guide on the page's
      // grid is (followPage brings it back at a width with one), not shown on another page's numbers.
      openGrid = activeGrid();
      let parkActive = false;
      if (!guides.length && openGrid) {
        if (openGrid.fromPage && !pageDefault) {
          parked = copyGuides([openGrid])[0];
          delete parked.fromPage;
          parkActive = true;
        } else guides.push(copyGuides([openGrid])[0]);
      }
      tookPage = !!pageDefault || guides.length > 0 || parkActive;
      if (!guides.length) {
        if (pageDefault) guides.push(copyGuides([pageDefault])[0]);
        return;
      }
      guides.forEach((g, i) => {
        if (!g.fromPage) return;
        const next = copyGuides([g])[0];
        delete next.fromPage;
        if (pageDefault) GUIDE_NUMS.forEach((k) => { next[k] = pageDefault[k]; });
        guides[i] = next;
      });
    }
    const overlay = el("div", "ft-guides");
    const guideSec = el("div", "ft-section");
    const guideHead = el("div", "ft-section-head");
    const guideList = el("div", "ft-guide-list");

    // Styles, as Figma's Layout guide styles (titled "Layout guide styles"): a popover just left of the panel, with a
    // close, no search. "Currently used by site" is the layout on the page now, filled blue as Figma fills the style in
    // use; the header's + saves it as a style (the same
    // All pages / Just this page choice as the bookmark) until it's saved. "Additional styles" lists the rest: the
    // page's own grid (so a tweak can always go back to it), hers for this page (marked) and for all pages. Hovering a
    // row shows it on the page, a click applies it, leaving the list puts hers back; a saved style's row shows Delete
    // on hover, where Figma's shows Edit style.
    const stylesPop = el("div", "ft-pop ft-styles-pop");
    stylesPop.hidden = true;
    const stylesHead = el("div", "ft-pop-head");
    // Its + (Create style) sits left of the close, as Figma's styles popover has it; it shows while the layout in use
    // isn't a saved style yet.
    const createStyle = iconButton(ICON.plus, "Create style", () => openSave(createStyle));
    const stylesActions = el("div", "ft-head-actions");
    stylesActions.append(createStyle, iconButton(ICON.x, "Close", () => closeStyles()));
    stylesHead.append(el("span", null, "Layout guide styles"), stylesActions);
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
      // A style is its numbers and color: it shows when hovered or picked, whatever eye it was saved with.
      guide = Object.assign(copyGuides([guide])[0], { visible: true });
      delete guide.fromPage;
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
      row.insertAdjacentHTML("beforeend", ICON.gridColumn);
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
      const cur = guides[0];
      const curName = cur ? styleName(cur) : "";
      if (cur) {
        const row = el("div", "ft-style-row ft-style-current");
        row.insertAdjacentHTML("beforeend", ICON.gridColumn);
        row.appendChild(el("span", "ft-style-name", curName));
        rows.push(el("div", "ft-styles-heading", "Currently used by site"), row);
      }
      createStyle.hidden = !cur || [STYLES_ALL, stylesPage()].some((key) => loadStyles(key).some((st) => st.name === curName));
      const more = [];
      const own = pageGrid();
      if (own && styleName(own) !== curName) more.push(styleRow("Page grid · " + styleName(own), own));
      [[stylesPage(), " · this page"], [STYLES_ALL, ""]].forEach(([key, tag]) => {
        const list = loadStyles(key);
        list.forEach((st, i) => st.name !== curName && more.push(styleRow(st.name + tag, st.guide, () => {
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
      rows.push(el("div", "ft-styles-heading", "Additional styles"));
      if (more.length) rows.push(...more);
      else rows.push(el("div", "ft-styles-empty", "No saved styles yet"));
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
      if (stylesPop.hidden || stylesPop.contains(e.target) || styleBtn.contains(e.target) || savePop.contains(e.target)) return;
      closeStyles();
    }, true);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || stylesPop.hidden || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      closeStyles();
    });
    const styleBtn = iconButton(ICON.guideStyles, "Styles", openStyles);

    // Save as style: two buttons in place, for every page or just this one. Named from its numbers;
    // the same numbers aren't saved twice.
    const savePop = el("div", "ft-pop ft-save-pop");
    savePop.hidden = true;
    let saveAnchor = null;
    const closeSave = () => {
      savePop.hidden = true;
      if (saveAnchor) saveAnchor.classList.remove("is-open");
      saveAnchor = null;
    };
    // active: "Use as active grid" (the bookmark, or the toast's offer). The layout in use also becomes the one this page,
    // or every page, opens on (activeGrid), as it shows now, eye included, whether it's a saved style already or not.
    // Every page's clears this page's own, so it shows here too; and a layout Save kept for this page goes, or it would
    // open on that instead.
    function saveStyle(key, active) {
      closeSave();
      const g = guides[0];
      if (!g) return;
      const name = styleName(g);
      const list = loadStyles(key);
      // The page's own grid is already listed in Styles ("Page grid"), so this page needn't keep it twice.
      const had = list.some((st) => st.name === name) || (key !== STYLES_ALL && pageDefault && styleName(pageDefault) === name);
      if (had && !active) return toast("Already saved");
      const put = (k, v) => {
        try {
          if (v == null) localStorage.removeItem(k);
          else localStorage.setItem(k, v);
          return true;
        } catch (e) {
          return false;
        }
      };
      // What the active grid touches, as it was, for Undo.
      const keys = active ? [GRID_ALL, gridPage(), editsKey()] : [];
      const before = keys.map((k) => {
        try {
          return localStorage.getItem(k);
        } catch (e) {
          return null;
        }
      });
      const unsave = () => storeStyles(key, loadStyles(key).filter((st) => st.name !== name));
      if (!had) {
        const kept = Object.assign(copyGuides([g])[0], { visible: true });
        delete kept.fromPage;
        list.push({ name, guide: kept });
        if (!storeStyles(key, list)) return toast("Couldn't save: storage is blocked or full");
      }
      if (active) {
        const grid = copyGuides([g])[0];
        delete grid.fromPage;
        if (sameNums(g, pageDefault)) grid.fromPage = true;
        let ok = put(key === STYLES_ALL ? GRID_ALL : gridPage(), JSON.stringify(grid));
        if (ok && key === STYLES_ALL) ok = put(gridPage(), null);
        try {
          const saved = JSON.parse(localStorage.getItem(editsKey()));
          if (ok && saved && Array.isArray(saved.guides) && saved.guides.length) ok = put(editsKey(), JSON.stringify(Object.assign(saved, { guides: [] })));
        } catch (e) {
          // Nothing saved for the page.
        }
        if (!ok) {
          keys.forEach((k, i) => put(k, before[i]));
          if (!had) unsave();
          return toast("Couldn't save: storage is blocked or full");
        }
      }
      // The layout as set here is now the page's default (onDefault), not an edit.
      if (active) openGrid = activeGrid();
      if (!stylesPop.hidden) drawStyles();
      historyChanged();
      undoToast(!active ? "Saved style" : key === STYLES_ALL ? "Active grid for all pages" : "Active grid for this page", () => {
        keys.forEach((k, i) => put(k, before[i]));
        if (!had) unsave();
        if (active) openGrid = activeGrid();
        if (!stylesPop.hidden) drawStyles();
        historyChanged();
      });
    }
    const saveBody = el("div", "ft-save-body");
    // The bookmark's two choices set the active grid; the Styles popover's + only saves a style.
    saveBody.append(
      button("ft-choice", "Apply to all pages", () => saveStyle(STYLES_ALL, saveAnchor === saveBtn)),
      button("ft-choice", "Just this page", () => saveStyle(stylesPage(), saveAnchor === saveBtn))
    );
    savePop.appendChild(saveBody);
    // The bookmark in the Horizontal layout header and the + in the Styles popover's header both open it, under the one
    // pressed.
    function openSave(anchor) {
      if (!savePop.hidden && saveAnchor === anchor) return closeSave();
      closeSave();
      menu.close();
      savePop.hidden = false;
      saveAnchor = anchor;
      anchor.classList.add("is-open");
      // Under the button, its right edge on the button's, kept on screen.
      const r = anchor.getBoundingClientRect();
      savePop.style.left = Math.max(8, r.right - savePop.offsetWidth) + "px";
      savePop.style.top = Math.min(r.bottom + 6, window.innerHeight - savePop.offsetHeight - 8) + "px";
    }
    const saveBtn = iconButton(ICON.bookmark, "Use as active grid", () => openSave(saveBtn));
    document.addEventListener("pointerdown", (e) => {
      if (!savePop.hidden && !savePop.contains(e.target) && !(saveAnchor && saveAnchor.contains(e.target))) closeSave();
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
    // After the guides redraw: the column help card, and a picked column whose layout went (set further down).
    let afterGuides = () => {};

    // No layout yet: say so, and offer the usual one to start from (8 columns).
    const guideEmpty = el("div", "ft-guide-empty");
    const guideWarn = el("div", "ft-guide-warn");
    guideWarn.innerHTML = ICON.warning;
    guideWarn.appendChild(el("span", null, "Layout not defined."));
    const addLayout = button("ft-choice ft-choice-icon", null, () => {
      guides.push(newGuide());
      drawGuides();
      offerStyle();
    });
    const plus = el("span");
    plus.innerHTML = ICON.plus;
    addLayout.append(plus, el("span", null, "Add layout"));
    guideEmpty.append(guideWarn, addLayout);

    // Under each guide, Figma's alignment buttons, as actions: pressed, they align every item, then
    // spring back.
    const ACROSS = [["left", "alignLeft", "Align left"], ["hcenter", "alignHCenter", "Align horizontally"], ["right", "alignRight", "Align right"]];
    const alignSeg = (g) => actionSeg(ACROSS, (how) => alignAll(g, how));
    // With columns picked, Alignment's across buttons line the layers up with them (same keys): one column's edges and
    // middle, or several columns' leftmost edge, middle and rightmost edge.
    const COLUMN_ACROSS = [["left", "alignLeft", "Align left to column", KEYS.alt + "A"], ["hcenter", "alignHCenter", "Align to column center", KEYS.alt + "H"], ["right", "alignRight", "Align right to column", KEYS.alt + "D"]];
    const COLUMNS_ACROSS = [["left", "alignLeft", "Align to leftmost column", KEYS.alt + "A"], ["hcenter", "alignHCenter", "Align to center of columns", KEYS.alt + "H"], ["right", "alignRight", "Align to rightmost column", KEYS.alt + "D"]];
    const COLUMN_KEYS = { KeyA: "left", KeyH: "hcenter", KeyD: "right" };
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
      guideFields(fields, g, () => {
        drawGuides();
        offerSoon(g);
      });
      group.append(rowEl, fields, alignBox);
      return { g, group, rowEl, label, eye, swatch };
    }

    // Figma's Show layout grids: ⌃G on a Mac, Ctrl+Shift+4 elsewhere. Turned on with nothing selected, the panel shows
    // the layout (brought back if it was hidden, in Design if Motion was showing); with a layer selected, the panel stays
    // as it is. With no layout yet, it adds the usual one (8 columns).
    const GRID_KEY = MAC ? "⌃G" : "Ctrl+Shift+4";
    document.addEventListener("keydown", (e) => {
      const hit = MAC ? e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && e.code === "KeyG"
        : e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.code === "Digit4";
      if (!hit || e.defaultPrevented || typing(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      const on = !guides.some((g) => g.visible);
      const added = !guides.length;
      if (added) guides.push(newGuide());
      else guides.forEach((g) => { g.visible = on; });
      drawGuides();
      if (added) offerStyle();
      if (!on || shown || shownColumn) return;
      if (inspector.hidden) {
        if (minimized) toggleUi();
        else showPanel(true);
      }
      if (root.getAttribute("data-tab") !== "design") modeBtns[0].click();
      guideSec.scrollIntoView({ block: "nearest" });
    });

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
        eye.setAttribute("data-ft-tip-key", GRID_KEY);
        eye.setAttribute("aria-label", tip);
        rowEl.classList.toggle("is-hidden", !g.visible);
      });
      overlay.replaceChildren(...guides.filter((g) => g.visible).map(guideLayer));
      noteChange();
      afterGuides();
    }
    drawGuides();
    // A call that declares a grid to a panel already built. With no layout yet it's taken up; one still on the last
    // page grid's numbers takes the new numbers (its eye and color stay), as a reload would show it.
    adoptPageGrid = () => {
      const was = pageDefault;
      pageDefault = pageGrid();
      if (!pageDefault) return;
      pageDefault.visible = false;
      anchor = pageDefault;
      tookPage = true;
      parked = null;
      if (!guides.length) guides.push(copyGuides([pageDefault])[0]);
      else if (sameNums(guides[0], was) && !sameNums(guides[0], pageDefault)) {
        const next = copyGuides([guides[0]])[0];
        GUIDE_NUMS.forEach((k) => { next[k] = pageDefault[k]; });
        guides[0] = next;
      } else return;
      drawGuides();
    };
    // The page's grid changes with the window (a container's margin grows, a breakpoint drops columns), so a guide
    // still on the page's numbers takes the new ones, eye and color kept. A width with no grid sets that guide aside
    // ("Layout not defined") and the next width with one brings it back. A guide she retuned stays as she set it.
    // Following the width isn't an edit: it's left out of the undo history, and the steps already there are moved
    // onto the new numbers once the resize settles, so an Undo doesn't put back another width's grid.
    function followPage() {
      const now = pageGrid();
      if (now) now.visible = false;
      pageDefault = now;
      if (parked && guides.length) parked = null;
      const g = guides[0];
      let change = false;
      if (parked) {
        if (now) {
          const back = copyGuides([parked])[0];
          GUIDE_NUMS.forEach((k) => { back[k] = now[k]; });
          guides.push(back);
          parked = null;
          change = true;
        }
      } else if (g && sameNums(g, anchor)) {
        if (!now) {
          parked = g;
          guides.splice(0, 1);
          change = true;
        } else if (!sameNums(g, now)) {
          const next = copyGuides([g])[0];
          GUIDE_NUMS.forEach((k) => { next[k] = now[k]; });
          guides[0] = next;
          change = true;
        }
      } else if (!guides.length && !tookPage && now) {
        guides.push(copyGuides([now])[0]);
        tookPage = true;
        change = true;
      }
      if (now) anchor = now;
      if (!change) return;
      history.quiet++;
      drawGuides();
      history.quiet--;
    }
    // The undo steps' guide on the numbers it had when the resize began, moved to the ones it has now.
    function rebaseSteps(from, to) {
      if (!from || !to || sameNums(from, to)) return;
      const move = (s) => {
        if (s == null) return s;
        const o = JSON.parse(s);
        const g = o.guides && o.guides[0];
        if (!g || !sameNums(g, from)) return s;
        GUIDE_NUMS.forEach((k) => { g[k] = to[k]; });
        return JSON.stringify(o);
      };
      history.now = move(history.now);
      history.past = history.past.map(move);
      history.future = history.future.map(move);
    }
    let resizeFrame = 0;
    let resizeFrom = null;
    let resizeSettle = 0;
    let pageWidth = document.documentElement.clientWidth;
    const onWidth = () => {
      pageWidth = document.documentElement.clientWidth;
      if (!resizeFrom) resizeFrom = anchor;
      if (!resizeFrame) resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        followPage();
      });
      clearTimeout(resizeSettle);
      resizeSettle = setTimeout(() => {
        rebaseSteps(resizeFrom, anchor);
        resizeFrom = null;
      }, 300);
    };
    window.addEventListener("resize", onWidth);
    // The page's width also changes with no resize event when a classic scrollbar comes or goes (content loading in,
    // a modal locking the scroll, any page on Windows), and the page grid's margins move with it. Only a change of
    // width counts, so a page growing taller doesn't rescan it.
    if (window.ResizeObserver) {
      new ResizeObserver(() => {
        if (document.documentElement.clientWidth !== pageWidth) onWidth();
      }).observe(document.documentElement);
    }
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

    // A segmented control: one choice pressed at a time, each with a Figma-style tooltip. cls adds a look (ft-seg-track
    // is UI3's one-track control); an option's 4th slot is its shortcut, shown in the tooltip.
    function segmented(options, apply, cls) {
      const seg = el("div", "ft-seg" + (cls ? " " + cls : ""));
      const btns = options.map(([value, icon, tip, key]) => {
        const b = button("ft-seg-btn", null, () => {
          apply(value);
          changed(true);
        });
        b.innerHTML = ICON[icon];
        b.setAttribute("data-ft-tip", tip);
        b.setAttribute("aria-label", tip);
        if (key) b.setAttribute("data-ft-tip-key", key);
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
        // Turn and scale at rest, since Rotate 90 and the flips build on them: a hover-scale isn't the code's.
        const scale = resting(target, "scale");
        const sc = scale === "none" ? [1, 1] : nums(scale);
        return {
          x: Math.round(r.left + window.scrollX),
          y: Math.round(r.top + window.scrollY),
          rot: turnOf(target, true),
          sx: sc[0],
          sy: sc.length > 1 ? sc[1] : sc[0],
        };
      };
      const moveBy = (dx, dy) => nudge(target, dx, dy);
      const setRot = (deg) => setTurn(target, deg);
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
        else {
          if (how === "flipH") setScale(-now.sx, now.sy);
          else setScale(now.sx, -now.sy);
          // A flip mirrors the layer on the canvas, as in Figma, so a turned layer's turn goes the other way too
          // (the scale alone would mirror it inside its own turn).
          if (Math.round(now.rot * 10) % 3600) setRot(-now.rot);
        }
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
      // Ignore auto layout, in the header as in Figma, on a layer whose parent is auto layout. On a component
      // instance it would change every instance, so it waits for an override.
      let ignore = null;
      // In a ⌘G group's auto layout (the nearer frame, so it comes first), Ignore auto layout takes the layer out of
      // the group's flow where it is, its move kept as a plain one, and the rest close up. X and Y wait while the
      // group places it, as in Figma.
      const sel = keyOf(target);
      const placed = () => {
        const L = layoutWith(target);
        return !!L && !L.ignore.includes(sel);
      };
      if (layoutWith(target)) {
        const actions = el("div", "ft-head-actions");
        ignore = iconButton(ICON.ignoreLayout, "Ignore auto layout", () => {
          const L = layoutWith(target);
          if (!L) return;
          // A layer that starts ignoring the layout stays where it is (its span margin comes off with it, see spanGaps).
          const was = !L.ignore.includes(sel) && target.getBoundingClientRect();
          L.ignore = L.ignore.includes(sel) ? L.ignore.filter((s2) => s2 !== sel) : L.ignore.concat(sel);
          flowGroup(L);
          if (was) {
            const now = target.getBoundingClientRect();
            if (Math.abs(now.left - was.left) >= 0.05 || Math.abs(now.top - was.top) >= 0.05) nudge(target, was.left - now.left, was.top - now.top);
          }
          changed(true);
        });
        actions.appendChild(ignore);
        s.firstChild.appendChild(actions);
        const why = "Auto layout places this layer";
        draws.push(() => {
          const on = placed();
          x.input.disabled = y.input.disabled = on;
          [x.wrap, y.wrap].forEach((f) => {
            if (on) f.setAttribute("data-ft-tip", why);
            else f.removeAttribute("data-ft-tip");
          });
          ignore.setAttribute("aria-pressed", String(!on));
        });
        [x.wrap, y.wrap].forEach(withTip);
      } else if (layoutParentOf(target)) {
        const actions = el("div", "ft-head-actions");
        const locked = !!sharedComponent(target, "position");
        ignore = iconButton(ICON.ignoreLayout, locked ? "Override this instance first" : "Ignore auto layout", () => {
          if (locked) return;
          setIgnoreLayout(target, !ignoresLayout(target));
          changed(true);
        });
        if (locked) {
          ignore.setAttribute("aria-disabled", "true");
          // A screen reader still names the control; why it's off goes with it as its description.
          ignore.setAttribute("aria-label", "Ignore auto layout");
          ignore.setAttribute("aria-description", "Override this instance first");
        }
        actions.appendChild(ignore);
        s.firstChild.appendChild(actions);
      }
      draws.push((force) => {
        const now = read();
        x.set(now.x, force);
        y.set(now.y, force);
        rot.set(Math.round(now.rot * 10) / 10 + "°", force);
        if (ignore && !layoutWith(target)) ignore.setAttribute("aria-pressed", String(ignoresLayout(target)));
      });
      return s;
    }

    // Alignment's More options on a plain selection, as UI3 lists them, with Figma's keys.
    const SPACING_ITEMS = [
      { label: "Distribute horizontal spacing", value: "x", keys: KEYS.distribute + "H" },
      { label: "Distribute vertical spacing", value: "y", keys: KEYS.distribute + "V" },
      { divider: true },
      { label: "Tidy up", value: "tidy", keys: KEYS.tidy + "T" },
    ];
    // A layer a ⌘G group's auto layout places goes back where the group puts it, as in Figma, so moving it alone
    // would undo itself. A whole group moved as one is fine.
    const placedAlone = (list) => selectionUnits(list).some((u) => {
      const L = u.length === 1 && layoutWith(u[0]);
      return !!L && !L.ignore.includes(keyOf(u[0]));
    });
    // Distribute spacing (how "x" or "y") or Tidy up ("tidy") on a plain selection.
    function spaceSelection(list, how) {
      if (placedAlone(list)) return toast("Auto layout places these layers");
      if (how !== "tidy" && selectionUnits(list).length < 3) return toast("Select 3 or more layers to distribute");
      if (how === "tidy") tidySelection(list);
      else distributeSelection(list, how);
      changed(true);
    }

    // Two or more layers, as in Figma: "Group" or "N selected", and X and Y for where they sit together.
    // A move moves every layer by the same amount, each recorded, so the bake keeps them together.
    function setSection(list, isGroup) {
      const s = section("Position");
      // A group with auto layout is where its frame is, padding included.
      const g = isGroup ? groupFor(list) : null;
      const read = () => {
        const u = boxOf(list, g);
        return { x: Math.round(u.left + window.scrollX), y: Math.round(u.top + window.scrollY) };
      };
      const x = numField("X");
      const y = numField("Y");
      // Measured once, then every layer moves by that much (a layer inside another selected one rides along with it).
      const outer = () => list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
      editable(x.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n)) return;
        const d = n - read().x;
        outer().forEach((t) => nudge(t, d, 0));
      });
      editable(y.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n)) return;
        const d = n - read().y;
        outer().forEach((t) => nudge(t, 0, d));
      });
      const xy = el("div", "ft-type-pair");
      xy.append(x.wrap, y.wrap);
      const act = (how) => {
        alignSelection(list, how);
        changed();
      };
      const grid = el("div", "ft-type");
      let alignment = alignRow(act);
      // A plain selection's More options at the end of the row, where UI3 keeps Distribute spacing and Tidy up.
      if (!isGroup) {
        const row = el("div", "ft-with-action");
        const more = iconButton(ICON.more, "More options", () => menu.toggle(more, SPACING_ITEMS, null, (v) => spaceSelection(list, v)));
        row.append(alignment, more);
        alignment = row;
      }
      grid.append(labeled("Alignment", alignment, true), labeled("Position", xy, true));
      // Spacing, when the layers sit in one column or row: the ones after the first move. A group's, read as it's
      // selected; with auto layout the Layout section's Gap does it instead. A plain selection's units (a ⌘G group
      // in it moves as one) are read on every draw, so a Distribute or Tidy up that lines them up shows it at once.
      const units = () => (isGroup ? list : selectionUnits(list));
      const st = isGroup ? (!layoutOf(g) ? stackOf(list) : null) : stackOf(units());
      if (isGroup ? st : true) {
        const spacing = numField(st && st.axis === "y" ? ICON.arrowsVertical : ICON.arrowsHorizontal, "Spacing");
        const icon = spacing.wrap.querySelector(".ft-field-icon");
        let axis = st ? st.axis : "x";
        const live = () => (!isGroup && placedAlone(list) ? null : stackOf(units()));
        editable(spacing.input, changed, (v) => {
          const n = parseFloat(v);
          const now = live();
          if (isNum(n) && now) setStackGap(now, n, isGroup ? "stack" : null);
        });
        const field = labeled("Spacing", spacing.wrap);
        grid.appendChild(field);
        draws.push((force) => {
          const now = live();
          if (!isGroup) field.hidden = !now;
          if (now && now.axis !== axis) {
            axis = now.axis;
            icon.innerHTML = axis === "y" ? ICON.arrowsVertical : ICON.arrowsHorizontal;
          }
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

    // A ⌘G group's Layout, as Figma's frame shows it. Without auto layout, the header's Add auto layout (⇧A), named
    // for what it would pick. With it, the container's rows (Flow, Resizing, Alignment and Gap, Padding, Clip content),
    // each writing the group's layout (edits.autoLayout); flowGroup then moves the layers to match, in the same undo
    // step. A group hugs its layers until it's in the code, so Fixed, Fill, Wrap, Gap Auto and Clip content wait,
    // shown disabled with why.
    function groupLayout(list) {
      const s = section("Layout");
      const g = groupFor(list);
      if (!layoutOf(g)) {
        const actions = el("div", "ft-head-actions");
        const addBtn = iconButton(ICON.alAddV, "Add auto layout", () => selection && selection.addAutoLayout());
        addBtn.setAttribute("data-ft-tip-key", KEYS.shift + "A");
        actions.appendChild(addBtn);
        s.firstChild.appendChild(actions);
        // Layers that can't share one element say why on the click, so the tip stays plain for them.
        draws.push((force) => {
          if (!force || groupLayoutRefusal(list)) return;
          const inf = inferGroup(list);
          const tip = "Add " + inf.flow + " auto layout" + (inf.moves || inf.reordered ? " (layers move)" : "");
          addBtn.setAttribute("data-ft-tip", tip);
          addBtn.setAttribute("aria-label", tip);
          const glyph = inf.flow === "horizontal" ? "alAddH" : "alAddV";
          if (addBtn.dataset.ftIcon !== glyph) { addBtn.innerHTML = ICON[glyph]; addBtn.dataset.ftIcon = glyph; }
        });
        // Dimensions, as Figma shows a new group's (her ask, 2026-10-17): the box around its layers. A typed W or H
        // resizes the group as Figma's does: each layer grows or shrinks along that axis by the same factor and keeps
        // its place in the box (its offset from the group's left or top scaled too); with the lock on, both axes. One
        // undo step.
        const top = list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
        const box = () => {
          const rs = top.map((t) => t.getBoundingClientRect());
          const l = Math.min(...rs.map((r) => r.left));
          const t0 = Math.min(...rs.map((r) => r.top));
          return { l, t: t0, w: Math.max(...rs.map((r) => r.right)) - l, h: Math.max(...rs.map((r) => r.bottom)) - t0 };
        };
        const resizeGroup = (axis, n) => {
          const b0 = box();
          const f = n / (axis === "w" ? b0.w : b0.h);
          if (!isNum(f) || !(f > 0) || Math.abs(f - 1) < 1e-6) return;
          const both = ratioLocked(g);
          const fx = axis === "w" || both ? f : 1;
          const fy = axis === "h" || both ? f : 1;
          if (history.timer) commitStep();
          history.quiet++;
          const starts = top.map((t) => ({ t, r: t.getBoundingClientRect() }));
          starts.forEach(({ t, r }) => typedResize(t, fx !== 1 ? r.width * fx : null, fy !== 1 ? r.height * fy : null, { locked: false }));
          // Placed once every size has landed (a wider line can wrap less and lift the ones under it), along the axes
          // that changed.
          starts.forEach(({ t, r }) => {
            const now = t.getBoundingClientRect();
            const dx = fx !== 1 ? b0.l + (r.left - b0.l) * fx - now.left : 0;
            const dy = fy !== 1 ? b0.t + (r.top - b0.t) * fy - now.top : 0;
            if (Math.abs(dx) >= 0.05 || Math.abs(dy) >= 0.05) nudge(t, dx, dy);
          });
          history.quiet--;
          noteChange();
          changed(true);
        };
        const w = numField("W");
        const h = numField("H");
        [[w, "w"], [h, "h"]].forEach(([fld, axis]) => editable(fld.input, changed, (v) => {
          const n = parseFloat(v);
          if (isNum(n) && n > 0) resizeGroup(axis, n);
        }));
        const lock = iconButton(ICON.linkBroken, "Constrain proportions", () => {
          if (g) ratioLocks.set(g, !ratioLocked(g));
          changed(true);
        });
        const dims = el("div", "ft-type-pair");
        dims.append(w.wrap, h.wrap);
        const dimsRow = el("div", "ft-with-action");
        dimsRow.append(dims, lock);
        const grid = el("div", "ft-type");
        grid.appendChild(labeled("Dimensions", dimsRow, true));
        s.appendChild(grid);
        draws.push((force) => {
          const b = box();
          w.set(Math.round(b.w), force);
          h.set(Math.round(b.h), force);
          const locked = ratioLocked(g);
          lock.setAttribute("aria-pressed", String(locked));
          if (lock.dataset.ftIcon !== String(locked)) { lock.innerHTML = locked ? ICON.lockRatio : ICON.linkBroken; lock.dataset.ftIcon = String(locked); }
        });
        return s;
      }
      // Found again on every write and draw, never held: an undo swaps the entry.
      const live = () => layoutOf(g);
      const write = (fn) => {
        const L = live();
        if (!L) return;
        fn(L);
        flowGroup(L);
      };
      const grid = el("div", "ft-type");
      const disable = (b, why, label) => {
        b.setAttribute("aria-disabled", "true");
        b.setAttribute("data-ft-tip", why);
        b.setAttribute("aria-label", label);
        b.setAttribute("aria-description", why);
      };

      // Flow: Freeform takes the auto layout off (⌥⇧A). Vertical and Horizontal trade places keeping the nine dots'
      // cell, so what was along the flow is now across it.
      const flow = segmented([["free", "flowFree", "Freeform"], ["vertical", "flowVertical", "Vertical layout"], ["horizontal", "flowHorizontal", "Horizontal layout"]], (v) => {
        const L = live();
        if (!L || v === L.flow) return;
        if (v === "free") return selection && selection.removeAutoLayout();
        write((l) => {
          l.flow = v;
          [l.main, l.cross] = [l.cross, l.main];
        });
      }, "ft-seg-track");
      const wrapBtn = iconButton(ICON.flowWrap, "Wrap", () => {});
      disable(wrapBtn, "Wrap needs a fixed width", "Wrap");
      const wrapGap = el("span", "ft-action-gap");
      const flowRow = el("div", "ft-with-action");
      flowRow.append(flow.seg, wrapBtn, wrapGap);
      grid.appendChild(labeled("Flow", flowRow, true));

      // Resizing: Hug both ways, read only.
      const hugs = "A group hugs its layers until it's in the code";
      const w = numField("W");
      const h = numField("H");
      w.input.disabled = h.input.disabled = true;
      // On the whole field, as a group layer's X and Y, so hovering its "Hug" says why too.
      [w.wrap, h.wrap].forEach((f) => {
        f.setAttribute("data-ft-tip", hugs);
        withTip(f);
      });
      const dims = el("div", "ft-type-pair");
      dims.append(w.wrap, h.wrap);
      const dimsRow = el("div", "ft-with-action");
      dimsRow.append(dims, el("span", "ft-action-gap"));
      grid.appendChild(labeled("Resizing", dimsRow, true));

      // Alignment, the nine dots: along the flow is recorded for the bake (a hugging frame has no room to move its
      // layers along it), across it lines them up.
      const box = el("div", "ft-al-box");
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", "Alignment");
      const POS = ["start", "center", "end"];
      const COL = ["left", "center", "right"];
      const ROW = ["top", "center", "bottom"];
      let built = "";
      let cells = [];
      const cellOf = (L) => {
        const m = POS.indexOf(L.main);
        const c = POS.indexOf(L.cross);
        return L.flow === "vertical" ? m * 3 + c : c * 3 + m;
      };
      const pickCell = (i) => write((L) => {
        const col = L.flow === "vertical";
        L.main = POS[col ? Math.floor(i / 3) : i % 3];
        L.cross = POS[col ? i % 3 : Math.floor(i / 3)];
      });
      const build = (L) => {
        cells = Array.from({ length: 9 }, (_, i) => {
          const r = Math.floor(i / 3);
          const c = i % 3;
          const on = ICON[L.flow === "vertical" ? "alV_" + "LCR"[c] : "alH_" + "TCB"[r]];
          const tip = "Align " + (r === 1 ? COL[c] : ROW[r] + " " + COL[c]);
          const b = button("ft-al-cell", null, () => {
            pickCell(i);
            changed(true);
          });
          b.innerHTML = '<span class="ft-al-rest">' + ICON.alDot + '</span><span class="ft-al-on">' + on + "</span>";
          b.setAttribute("data-ft-tip", tip);
          b.setAttribute("aria-label", tip);
          withTip(b);
          return b;
        });
        box.replaceChildren(...cells);
      };
      box.addEventListener("keydown", (e) => {
        const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
        const L = live();
        if (!d || !L || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
        e.preventDefault();
        const at = cellOf(L);
        const clamp = (n) => Math.min(2, Math.max(0, n));
        const next = clamp(Math.floor(at / 3) + d[0]) * 3 + clamp((at % 3) + d[1]);
        if (next === at) return;
        pickCell(next);
        changed(true);
        if (cells[next]) cells[next].focus();
      });
      // Gap: a number, never below 0. No Auto: it spreads the layers across a frame's spare room, and a hugging
      // frame has none.
      const gap = numField(ICON.arrowsVertical, "Gap between items");
      editable(gap.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) write((L) => { L.gap = Math.max(0, round1(n)); });
      });
      const alCell = labeled("Alignment", box);
      alCell.classList.add("ft-al-top");
      const gapCell = labeled("Gap", gap.wrap);
      gapCell.classList.add("ft-al-top");
      grid.append(alCell, gapCell);

      // Padding, as on a container. The frame stays where it is, as in Figma: the layers move in by the change first,
      // so the frame grows out to the right and down.
      const writePad = (sides, v) => {
        const n = parseFloat(v);
        const L = live();
        if (!isNum(n) || !L) return;
        const pad = L.pad.slice();
        sides.forEach((i) => { pad[i] = Math.max(0, round1(n)); });
        const dl = pad[3] - L.pad[3];
        const dt = pad[0] - L.pad[0];
        history.quiet++;
        if (dl || dt) alGeometry(L).flow.forEach((b) => layoutNudge(b.t, dl, dt));
        history.quiet--;
        write((l) => { l.pad = pad; });
      };
      const p0 = live().pad;
      let split = p0[0] !== p0[2] || p0[1] !== p0[3];
      const padH = numField(ICON.padH, "Horizontal padding");
      const padV = numField(ICON.padV, "Vertical padding");
      editable(padH.input, changed, (v) => writePad([1, 3], v));
      editable(padV.input, changed, (v) => writePad([0, 2], v));
      const each = el("div", "ft-span2 ft-pads");
      const toggle = iconButton(ICON.padSides, "Individual padding", () => {
        split = !split;
        each.hidden = !split;
        toggle.setAttribute("aria-pressed", String(split));
      });
      toggle.setAttribute("aria-pressed", String(split));
      each.hidden = !split;
      const side = (i, icon, tip) => {
        const f = numField(ICON[icon], tip);
        editable(f.input, changed, (v) => writePad([i], v));
        return f;
      };
      const pl = side(3, "padLeft", "Left padding");
      const pt = side(0, "padTop", "Top padding");
      const pr = side(1, "padRight", "Right padding");
      const pb = side(2, "padBottom", "Bottom padding");
      [[pl, pt], [pr, pb]].forEach(([a, b]) => {
        const pair = el("div", "ft-type-pair");
        pair.append(a.wrap, b.wrap);
        const row = el("div", "ft-with-action");
        row.append(pair, el("span", "ft-action-gap"));
        each.appendChild(row);
      });
      const padPair = el("div", "ft-type-pair");
      padPair.append(padH.wrap, padV.wrap);
      const padRow = el("div", "ft-with-action");
      padRow.append(padPair, toggle);
      grid.append(labeled("Padding", padRow, true), each);

      // Clip content cuts what spills out of an element, and the group has none until it's in the code.
      const clip = button("ft-check-row ft-span2", null, () => {});
      clip.setAttribute("role", "checkbox");
      clip.setAttribute("aria-checked", "false");
      disable(clip, "Clip needs the group in the code", "Clip content");
      withTip(clip);
      const groupBox = el("span", "ft-check");
      groupBox.innerHTML = ICON.checkDraw;
      clip.append(groupBox, el("span", null, "Clip content"));
      grid.appendChild(clip);
      s.appendChild(grid);

      draws.push((force) => {
        const L = live();
        if (!L) return;
        flow.set(L.flow);
        const horizontal = L.flow === "horizontal";
        wrapBtn.hidden = !horizontal;
        wrapGap.hidden = horizontal;
        w.set("Hug", force);
        h.set("Hug", force);
        if (L.flow !== built) {
          built = L.flow;
          build(L);
          gap.wrap.firstChild.innerHTML = ICON[horizontal ? "arrowsHorizontal" : "arrowsVertical"];
        }
        const on = cellOf(L);
        cells.forEach((b, i) => b.setAttribute("aria-pressed", String(i === on)));
        gap.set(L.gap, force);
        const p = L.pad;
        padH.set(p[3] === p[1] ? p[3] : "Mixed", force);
        padV.set(p[0] === p[2] ? p[0] : "Mixed", force);
        pt.set(p[0], force);
        pr.set(p[1], force);
        pb.set(p[2], force);
        pl.set(p[3], force);
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

    // Figma's list. Plus darker and Plus lighter are CSS's plus-darker and plus-lighter, offered where the browser
    // draws them (Chrome has no plus-darker).
    const BLENDS = [
      ["normal", "Normal"], ["darken", "Darken"], ["multiply", "Multiply"], ["plus-darker", "Plus darker"], ["color-burn", "Color burn"],
      ["lighten", "Lighten"], ["screen", "Screen"], ["plus-lighter", "Plus lighter"], ["color-dodge", "Color dodge"], ["overlay", "Overlay"],
      ["soft-light", "Soft light"], ["hard-light", "Hard light"], ["difference", "Difference"],
      ["exclusion", "Exclusion"], ["hue", "Hue"], ["saturation", "Saturation"], ["color", "Color"],
      ["luminosity", "Luminosity"],
    ].filter(([v]) => !/^plus-/.test(v) || (window.CSS && CSS.supports("mix-blend-mode", v)));

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
        e.stopPropagation();
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
        // An elliptical corner (20px / 40px) has no one radius: Mixed.
        return pairs().map(([h, v]) => (h === v ? h : NaN));
      };
      // Each corner as it draws, horizontal and vertical, in px: a % is of the box's width (horizontal) or height
      // (vertical), as CSS reads it.
      const pairs = () => {
        const cs = getComputedStyle(target);
        const m = smoothMap(smoothing(), 0, 1);
        const sz = sizeOf(target);
        const px = (tok, side) => (/%$/.test(tok) ? (parseFloat(tok) / 100) * side : parseFloat(tok) || 0);
        return CORNERS.map(([c]) => {
          const toks = cs.getPropertyValue("border-" + c + "-radius").trim().match(/calc\([^)]*\)|\S+/g) || ["0"];
          const h = px(toks[0], sz.w);
          const v = px(toks[1] || toks[0], sz.h);
          return [Math.round((h / m) * 10) / 10, Math.round((v / m) * 10) / 10];
        });
      };
      // Writes the four radii and the smoothing as the code would: one border-radius when they match, else each
      // corner's; each radius × m, and corner-shape superellipse(k) (none at 0%). A corner left as a pair (from
      // pairs()) keeps its own shape, an elliptical one included.
      function writeCorners(rs, sm) {
        if (rect) {
          const u = round1(rs[0] / vectorSize(target).sx) + "px";
          setStyle(target, "rx", u);
          setStyle(target, "ry", u);
          return;
        }
        const m = smoothMap(sm, 0, 1);
        const one = (r) => round1(Math.max(0, r) * m) + "px";
        const px = rs.map((r) => (Array.isArray(r) ? (r[0] === r[1] ? one(r[0]) : one(r[0]) + " " + one(r[1])) : one(r)));
        if (px.every((x) => x === px[0])) {
          CORNERS.forEach(([c]) => setStyle(target, "border-" + c + "-radius", ""));
          setStyle(target, "border-radius", px[0].replace(" ", " / "));
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
          // The page's own mode hands it back to the page; any other is written, Normal over the code's Multiply too.
          setStyle(target, "mix-blend-mode", v === ownValue(target, "mix-blend-mode") ? "" : v);
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
      eye.setAttribute("data-ft-tip-key", KEYS.shiftMod + "H");
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
        const radius = numField(ICON.radius, "Corner radius");
        const all = (n) => writeCorners([n, n, n, n], smoothing());
        editable(radius.input, changed, (v) => {
          const n = parseFloat(v);
          if (isNum(n) && n >= 0) all(n);
        });
        const shortSide = () => {
          const sz = sizeOf(target);
          return Math.max(1, Math.round(Math.min(sz.w, sz.h) / 2));
        };
        const drawRadius = slideIn(radius, 0, shortSide, () => Math.max(0, ...radii().filter(isNum)), all);
        const radiusRow = el("div", "ft-with-action");
        radiusRow.appendChild(radius.wrap);
        // Each corner, then Corner smoothing: open when the corners differ, as Figma opens them.
        const each = el("div", "ft-span2 ft-corners");
        if (!rect) {
          split = new Set(radii()).size > 1;
          const toggle = iconButton(ICON.corners, "Independent corners", () => {
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
              // Only this corner changes: the others are written as they draw.
              const rs = pairs();
              rs[i] = n;
              writeCorners(rs, smoothing());
            });
            draws2.push((force) => f.set(isNum(radii()[i]) ? radii()[i] : "Mixed", force));
            return f;
          });
          const top = el("div", "ft-with-action");
          const topPair = el("div", "ft-type-pair");
          topPair.append(fields[0].wrap, fields[1].wrap);
          top.append(topPair, el("span", "ft-action-gap"));
          const bottom = el("div", "ft-with-action");
          const bottomPair = el("div", "ft-type-pair");
          bottomPair.append(fields[2].wrap, fields[3].wrap);
          const smooth = iconButton(ICON.sliders, "Corner smoothing", () => smoothPop.toggle(smooth, bottom, smoothing, (v) => writeCorners(pairs(), v)));
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
          recordFill(target, layer);
          picker.sync();
        }, null, picker));
      };
      // A fill she hid draws nothing, so it's read from what the panel kept.
      const now = hiddenFill(target) || toFill(getComputedStyle(target).backgroundColor);
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
          recordFill(target, layer);
          picker.sync();
        }, (l, row) => {
          picker.closeFor(l);
          row.remove();
          clearSvgPaint(target, "fill");
          recordFill(target, { visible: true });
          s.firstChild.appendChild(add);
        }, picker));
      }
      const hid = hiddenFill(target);
      if (hid) show(hid);
      else if (paint.kind === "color") show(paint.layer);
      else if (paint.kind === "server") list.appendChild(el("div", "ft-field-label", "A gradient or pattern from the code"));
      else s.firstChild.appendChild(add);
      return s;
    }

    // An icon's fill is its color: the <svg>'s CSS color, which its shapes paint with (currentColor).
    function iconFill(target) {
      const s = section("Fill");
      const layer = hiddenFill(target) || toFill(getComputedStyle(target).color) || { hex: "000000", opacity: 100, visible: true };
      fillLayers.push(layer);
      const list = el("div", "ft-fills");
      list.appendChild(fillRow(layer, () => {
        setStyle(target, "color", layer.visible ? rgba(layer) : "transparent");
        recordFill(target, layer);
        picker.sync();
      }, null, picker));
      s.appendChild(list);
      return s;
    }

    // A line icon's stroke is its weight: stroke-width on the <svg>, which its shapes take (its color is the
    // icon's Fill). In the icon's own units, as its code writes it (Lucide's 2 in a 24 viewBox).
    function iconStroke(target) {
      const s = section("Stroke");
      const stroked = [...target.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect")].filter((e) => getComputedStyle(e).stroke !== "none");
      const shape = stroked[0];
      const weight = numField(ICON.strokeWeight, "Weight");
      const show = (force) => weight.set(Math.round(parseFloat(getComputedStyle(shape || target).strokeWidth) * 100) / 100, force);
      // The code's value again takes the edit off.
      const put = (e, n) => setStyle(e, "stroke-width", parseFloat(ownValue(e, "stroke-width")) === n ? "" : String(n));
      editable(weight.input, show, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        // A shape with a stroke-width of its own (Figma's export writes one on each path) isn't reached by the
        // <svg>'s: tried with a stand-in value, the weight goes on each of those shapes, and on the <svg> for the rest.
        still(target, true);
        const was = target.style.getPropertyValue("stroke-width");
        target.style.setProperty("stroke-width", "123.25px");
        const own = stroked.filter((e) => parseFloat(getComputedStyle(e).strokeWidth) !== 123.25);
        if (was) target.style.setProperty("stroke-width", was);
        else target.style.removeProperty("stroke-width");
        flush();
        still(target, false);
        if (own.length < stroked.length || !stroked.length) put(target, n);
        own.forEach((e) => put(e, n));
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
        const weight = numField(ICON.strokeWeight, "Weight");
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
        // An image, a video or a canvas paints its pixels over an inset box-shadow, so Inner shadow would draw nothing.
        const types = svgFx ? EFFECT_TYPES.filter(([t]) => t === "drop" || t === "layer")
          : /^(IMG|VIDEO|CANVAS)$/.test(target.tagName) ? EFFECT_TYPES.filter(([t]) => t !== "inner") : EFFECT_TYPES;
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
    // lock that keeps proportions (ratioLocks: off until she turns it on, so W and H each change only themselves).
    // Edits go on the element as inline styles, so they show live.
    function layout(target) {
      const s = section("Layout");
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
        };
      };
      // Whether the text is as wide as its words on one line (max-content), read with that width swapped in.
      // Measured with shrink off too: in a crowded flex row max-content still shrinks to the longest word, so the
      // words would wrap while this read as hugging them (her report, 2026-10-17: "Previously at Meta" in two lines).
      const textHugs = () => {
        const held = ["width", "flex-shrink"].map((p) => [p, target.style.getPropertyValue(p), target.style.getPropertyPriority(p)]);
        still(target, true);
        const now = target.offsetWidth;
        target.style.setProperty("width", "max-content");
        target.style.setProperty("flex-shrink", "0");
        const mc = target.offsetWidth;
        held.forEach(([p, v, pri]) => (v ? target.style.setProperty(p, v, pri) : target.style.removeProperty(p)));
        flush();
        still(target, false);
        return Math.abs(now - mc) < 0.5;
      };
      // Text's Resizing, read from the code as the W and H menus read theirs: Fixed size when a height holds the box
      // (its own, or the code's rules), Auto width when it's as wide as its words (max-content, or hugging in a row),
      // else Auto height.
      const textMode = () => {
        const ownH = target.style.height;
        if ((ownH && /\d/.test(ownH) && !/%/.test(ownH)) || !sizedByLayout(target, "h")) return "fixed";
        if (target.style.width === "max-content" || (!/\d/.test(target.style.width) && textHugs())) return "hug";
        return "auto";
      };
      // The height left to the words: the code's own handed back, and auto written when the code sets one.
      const freeHeight = () => {
        handBack(target, "height");
        if (!sizedByLayout(target, "h")) setStyle(target, "height", "auto");
      };
      // Auto width: max-content, written only when the code's own width doesn't already hug the words.
      const hugWidth = () => {
        handBack(target, "width");
        if (!textHugs()) setStyle(target, "width", "max-content");
      };
      // A new size, as the code writes it (a vector's geometry, anything else its width and height), as a handle drag
      // writes it: resizeLayer, so the other axis stays put unless the lock is on, and inside auto layout a typed
      // number is Fixed, as in Figma. Its top-left stays put (typedResize), as the drag keeps it.
      const resize = (nw, nh) => typedResize(target, nw, nh, { locked: ratioLocked(target) });
      const resizing = segmented([
        ["hug", "arrowLineRight", "Auto width"],
        ["auto", "resizeHeight", "Auto height"],
        ["fixed", "article", "Fixed size"],
      ], (v) => {
        boxed(target);
        const r = target.getBoundingClientRect();
        // Whole px rounded up: one rounded down cuts the words' own width (197.3 → 197) and the last word wraps.
        const wPx = Math.ceil(r.width - 0.01);
        const hPx = Math.ceil(r.height - 0.01);
        // Inside auto layout this row is Resizing too: a Fill would keep sizing the box over any width written
        // here, so it lets go first, and a px size is Fixed, with grow, shrink and stretch off.
        const lp = layoutParentOf(target);
        if (lp && lp.inFlow) {
          if (v === "hug") unfill(target, lp, "w");
          else fixAxis(target, "w", wPx);
          if (v === "fixed") fixAxis(target, "h", hPx);
          else unfill(target, lp, "h");
          if (v === "hug") hugWidth();
          // Auto width doesn't shrink in a row, as Figma's hugging text doesn't: squeezed, it would wrap at its longest
          // word while it read as hugging.
          if (v === "hug" && lp.main === "w") setUnlessOwn(target, "flex-shrink", "0");
          if (v !== "fixed") freeHeight();
          // In both auto modes the words set the height, so a stretch across a row lets go of it.
          if (v !== "fixed" && lp.main !== "h" && stretches(target, lp, "h")) setUnlessOwn(target, selfProp(lp, "h"), lp.flex ? "flex-start" : "start");
          return;
        }
        if (v === "hug") hugWidth();
        else setStyle(target, "width", wPx + "px");
        if (v === "fixed") setStyle(target, "height", hPx + "px");
        else freeHeight();
      });
      const w = numField("W");
      const h = numField("H");
      editable(w.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        resize(n, null);
      });
      editable(h.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        resize(null, n);
      });
      w.input.disabled = h.input.disabled = fixed;
      // Resizing's menus, from a caret on W and H (the kit's "_Menu resizing" order): Fixed always, Hug on an auto
      // layout container, Fill when the parent is auto layout. Text keeps its own Resizing row too; Hug for text is
      // that row's Auto width. The items are worked out when the menu opens, as a Flow change can change them.
      // A container, read as the Flow row below reads it (declared there, after this).
      const holds = !(target instanceof SVGElement) && !hasText(target) && target.children.length > 0;
      const sizeMenus = !fixed && !vector && (holds || !!layoutParentOf(target));
      const modeOf = { w: null, h: null };
      const sizeItems = (axis) => {
        const W = axis === "w";
        const lp = layoutParentOf(target);
        const items = [{ label: W ? "Fixed width" : "Fixed height", value: "fixed", icon: W ? "fixedW" : "fixedH" }];
        if (holds && /flex|grid/.test(getComputedStyle(target).display)) items.push({ label: "Hug contents", value: "hug", icon: W ? "hugW" : "hugH" });
        if (lp && lp.inFlow) items.push({ label: "Fill container", value: "fill", icon: W ? "fillW" : "fillH" });
        return items;
      };
      const carets = {};
      if (sizeMenus) {
        [["w", w], ["h", h]].forEach(([axis, f]) => {
          const caret = button("ft-field-caret", null, () => {
            const items = sizeItems(axis);
            modeOf[axis] = sizeModeOf(target, axis);
            menu.toggle(caret, items, modeOf[axis], (v) => {
              setSizeMode(target, axis, v);
              modeOf.w = modeOf.h = null;
              changed(true);
            });
          });
          caret.innerHTML = ICON.caretDown;
          caret.setAttribute("aria-label", axis === "w" ? "Width options" : "Height options");
          f.wrap.appendChild(caret);
          carets[axis] = caret;
        });
      }
      const lock = iconButton(ICON.lockRatio, "Constrain proportions", () => {
        ratioLocks.set(target, !ratioLocked(target));
        changed(true);
      });

      const dims = el("div", "ft-type-pair");
      dims.append(w.wrap, h.wrap);
      const dimsRow = el("div", "ft-with-action");
      dimsRow.append(dims, lock);
      const grid = el("div", "ft-type");
      if (hasText(target) && !inSvg(target)) grid.appendChild(labeled("Resizing", resizing.seg, true));

      // A group (a container in the code) shows its Flow, read from its CSS and written back as CSS: Vertical and
      // Horizontal are flex in a column or a row, Freeform is no flex. Grid shows only on a grid, which isn't made
      // here. On auto layout (a flex or a grid) the section is Figma's: Alignment, Gap and Padding, all CSS longhands.
      // On Freeform, Spacing moves the children after the first when they sit in one column or row, so the ones
      // below move too.
      const container = !(target instanceof SVGElement) && !hasText(target) && target.children.length > 0;
      const flowOf = () => {
        const cs = getComputedStyle(target);
        if (/grid/.test(cs.display)) return "grid";
        if (/flex/.test(cs.display)) return /column/.test(cs.flexDirection) ? "vertical" : "horizontal";
        return "free";
      };
      const wrapOf = () => /^wrap/.test(getComputedStyle(target).flexWrap);
      // The -reverse flows read as their base; the Flow tip says so.
      const dirOf = () => (/column/.test(getComputedStyle(target).flexDirection) ? "column" : "row");
      const items = () => flowChildren(target, flowOf() === "free");
      const px = (v) => (v === "normal" ? 0 : parseFloat(v) || 0);
      const gapOf = () => {
        const cs = getComputedStyle(target);
        const flow = flowOf();
        // Gap Auto is space-between along a flex's flow; a grid has none.
        const auto = (flow === "vertical" || flow === "horizontal") && mainOf(cs.justifyContent) === "auto";
        // A wrapped row and a grid have a gap each way: across (column-gap), then down (row-gap).
        if (flow === "grid" || (flow === "horizontal" && wrapOf())) return { two: true, grid: flow === "grid", x: px(cs.columnGap), y: px(cs.rowGap), auto };
        if (flow === "vertical") return { css: "row-gap", axis: "y", n: px(cs.rowGap), auto };
        if (flow === "horizontal") return { css: "column-gap", axis: "x", n: px(cs.columnGap), auto };
        const st = stackOf(items());
        if (!st) return null;
        return { stack: st, axis: st.axis, n: st.gaps.every((g) => Math.abs(g - st.gaps[0]) < 0.5) ? Math.round(st.gaps[0]) : null };
      };
      let flow = null;
      let spacing = null;
      // Auto layout's rows (Alignment, Gap, Padding), placed after Resizing.
      const alEls = [];
      if (container) {
        const now = flowOf();
        const opts = [["free", "flowFree", "Freeform"], ["vertical", "flowVertical", "Vertical layout"], ["horizontal", "flowHorizontal", "Horizontal layout"]];
        if (now === "grid") opts.push(["grid", "flowGrid", "Grid"]);
        flow = segmented(opts, (v) => {
          const was = flowOf();
          if (v === "grid" || v === was) return;
          // An inline layer stays inline (inline-flex, inline-block), so the text around it doesn't reflow.
          const own = ownValue(target, "display");
          const inline = own.startsWith("inline");
          if (v === "free") {
            toFreeform(target);
            // Figma freezes the layers where they are; here they follow the code's own layout (her call to change).
            if (was !== "free") toast("Layers follow the code's layout");
          } else if (was === "vertical" || was === "horizontal") {
            // Vertical and Horizontal trade places: the gap moves to the new axis, and the nine dots keep the same
            // cell, so what was along the flow is now across it.
            const g = gapOf();
            const a = alignOf(target);
            const from = g.two ? "column-gap" : g.css;
            const to = v === "vertical" ? "row-gap" : "column-gap";
            const n = g.two ? g.x : g.n;
            setUnlessOwn(target, "flex-direction", v === "vertical" ? "column" : "row");
            if (from !== to) {
              setPx(target, to, n);
              handBack(target, from);
            }
            if (a.main !== "auto") {
              if (a.cross !== a.main) {
                keepStretch(target);
                setAlignment(target, "justify-content", ALIGN_CSS[a.cross]);
                setAlignment(target, "align-items", ALIGN_CSS[a.main]);
                dropStretch(target);
              }
            }
          } else if (/flex/.test(own)) {
            // The code has the flex (she had picked Freeform), so it comes back as the code has it.
            handBack(target, "display");
            setUnlessOwn(target, "flex-direction", v === "vertical" ? "column" : "row");
            items().forEach((c) => takeBackSpacing(c));
          } else {
            // From Freeform on a container the code doesn't flex: the gap, padding and alignment are read from where
            // the layers sit (Figma's Add auto layout), so nothing jumps where that can hold them. The gap takes over
            // Spacing's moves. Where it can't (uneven gaps, a layer with no box to read), the toast says so.
            const inf = applyInferred(target, v);
            if (inf.reason) {
              setStyle(target, "display", inline ? "inline-flex" : "flex");
              setUnlessOwn(target, "flex-direction", v === "vertical" ? "column" : "row");
            }
            if (inf.moves || (inf.reason && inf.reason !== "empty")) toast("Some layers moved to fit the auto layout");
          }
          if (v === "vertical") {
            // Wrap is Horizontal's only (UI3 hides it on Vertical), so a wrap she turned on goes. A wrap the code
            // has stays as the code has it: writing nowrap would change the page's own layout.
            const wrapWas = originalOf(target).styles["flex-wrap"];
            if (wrapWas != null && target.style.getPropertyValue("flex-wrap") !== wrapWas) {
              handBack(target, "flex-wrap");
              if (editedHere(target, "align-content")) handBack(target, "align-content");
            }
          }
          // The section's rows change with the flow (Alignment, Gap and Padding on auto layout, Spacing off it).
          if (selection) selection.reshow();
        }, "ft-seg-track");
        // A reversed flow reads as its base, and its cell says so.
        if (/reverse/.test(getComputedStyle(target).flexDirection) && (now === "vertical" || now === "horizontal")) {
          const b = flow.seg.children[now === "vertical" ? 1 : 2];
          const tip = b.getAttribute("data-ft-tip") + " (reversed in the code)";
          b.setAttribute("data-ft-tip", tip);
          b.setAttribute("aria-label", tip);
        }
        // Wrap sits in the action column beside the track, for Horizontal only, as in UI3. Off Horizontal its
        // slot keeps the track the same width.
        const wrapBtn = iconButton(ICON.flowWrap, "Wrap", () => {
          // Turning it on where the code wraps (wrap-reverse too) hands back the code's own, so its order holds. A
          // new wrap packs its rows where the alignment holds the layers, as Figma's do, so the Vertical gap is the
          // space between them; off, that packing goes.
          if (wrapOf()) {
            setUnlessOwn(target, "flex-wrap", "nowrap");
            if (editedHere(target, "align-content")) handBack(target, "align-content");
          } else if (/^wrap/.test(ownValue(target, "flex-wrap"))) handBack(target, "flex-wrap");
          else {
            setStyle(target, "flex-wrap", "wrap");
            packRows(target, alignOf(target).cross);
          }
          // A wrapped row has a gap each way, so the section is rebuilt for what Spacing shows.
          if (selection) selection.reshow();
          changed(true);
        });
        const wrapGap = el("span", "ft-action-gap");
        const flowRow = el("div", "ft-with-action");
        flowRow.append(flow.seg, wrapBtn, wrapGap);
        grid.appendChild(labeled("Flow", flowRow, true));
        draws.push(() => {
          wrapBtn.hidden = flowOf() !== "horizontal";
          wrapGap.hidden = !wrapBtn.hidden;
          wrapBtn.setAttribute("aria-pressed", String(wrapOf()));
        });
        // Figma's suggestion on a Freeform frame: the header's Add auto layout, which names what ⇧A would pick. It's
        // read again whenever the edits change, since Spacing changes the gap it would read. A commit there redraws
        // without force, as a scroll does, so the edits themselves say when to read: a scroll leaves them as they
        // were and skips the measuring.
        if (now === "free") {
          const addActions = el("div", "ft-head-actions");
          const addBtn = iconButton(ICON.alAddV, "Add auto layout", () => selection && selection.addAutoLayout());
          addBtn.setAttribute("data-ft-tip-key", KEYS.shift + "A");
          addActions.appendChild(addBtn);
          s.firstChild.appendChild(addActions);
          let readAt = null;
          draws.push((force) => {
            const at = snapshot();
            if (at === readAt && !force) return;
            readAt = at;
            const { inf } = readInferred(target);
            const tip = inf.reason ? "Add auto layout"
              : "Add " + inf.flow + " auto layout" + (inf.moves ? " (layers move)" : "");
            addBtn.setAttribute("data-ft-tip", tip);
            addBtn.setAttribute("aria-label", tip);
            // Swapped only on a change, so a draw under the pointer never rebuilds the glyph.
            const glyph = !inf.reason && inf.flow === "horizontal" ? "alAddH" : "alAddV";
            if (addBtn.dataset.ftIcon !== glyph) { addBtn.innerHTML = ICON[glyph]; addBtn.dataset.ftIcon = glyph; }
          });
        }
        const g = gapOf();
        if (now === "free") {
          if (g) {
            spacing = numField(g.axis === "x" ? ICON.arrowsHorizontal : ICON.arrowsVertical, "Spacing");
            editable(spacing.input, changed, (v) => {
              const n = parseFloat(v);
              const now2 = gapOf();
              if (isNum(n) && now2 && now2.stack) setStackGap(now2.stack, n);
            });
          }
        } else {
          // Gap: a number, or Auto (space-between, Figma's Gap Auto). The typed gap stays under Auto as its minimum
          // (her call whether Auto zeroes it). Never below 0: CSS has no negative gap. Leaving Auto puts back the
          // alignment along the flow it had while this layer stayed selected; after that it's only known to the
          // code, so the code's own comes back (start when the code's is Auto too).
          let mainWas = null;
          const toAuto = () => {
            const a = alignOf(target);
            if (a.main !== "auto") mainWas = a.main;
            setAlignment(target, "justify-content", "space-between");
          };
          const fromAuto = () => {
            if (alignOf(target).main !== "auto") return;
            const code = mainOf(ownValue(target, "justify-content"));
            setAlignment(target, "justify-content", ALIGN_CSS[mainWas || (code === "auto" ? "start" : code)]);
          };
          const gapField = (icon, tip, css, auto) => {
            const f = numField(icon, tip);
            editable(f.input, changed, (v) => {
              if (auto && /^\s*auto\s*$/i.test(v)) return toAuto();
              const n = parseFloat(v);
              if (!isNum(n)) return;
              setPx(target, css, Math.max(0, n));
              if (auto) fromAuto();
            });
            if (auto) {
              // Figma's caret on the gap field, as on the font size: its one choice is Auto.
              const caret = button("ft-field-caret", null, () => menu.toggle(caret, [{ label: "Auto", value: "auto" }], gapOf().auto ? "auto" : null, () => {
                toAuto();
                changed(true);
              }));
              caret.innerHTML = ICON.caretDown;
              caret.setAttribute("aria-label", "Gap options");
              f.wrap.appendChild(caret);
            }
            return f;
          };
          let gapX = null;
          let gapY = null;
          let gap1 = null;
          if (g.two) {
            gapX = gapField(ICON.arrowsHorizontal, "Horizontal gap", "column-gap", !g.grid);
            gapY = gapField(ICON.arrowsVertical, "Vertical gap", "row-gap", false);
          } else gap1 = gapField(g.axis === "x" ? ICON.arrowsHorizontal : ICON.arrowsVertical, "Gap between items", g.css, true);
          draws.push((force) => {
            const gg = gapOf();
            if (!gg || gg.stack) return;
            if (gapX && gg.two) {
              gapX.set(gg.auto ? "Auto" : Math.round(gg.x), force);
              gapY.set(Math.round(gg.y), force);
            } else if (gap1 && gg.css) gap1.set(gg.auto ? "Auto" : Math.round(gg.n), force);
          });

          if (g.grid) {
            const pair = el("div", "ft-type-pair");
            pair.append(gapX.wrap, gapY.wrap);
            alEls.push(labeled("Gap", pair, true));
          } else {
            // Alignment, Figma's nine dots: along a column the rows are the flow (justify-content) and the columns
            // are across it (align-items); along a row it's the other way. The picked cell shows the flow's glyph,
            // the rest a dot that turns into it under the pointer. Under Gap Auto only the alignment across is free,
            // so the box has three cells, the picked one showing the layers spread along the flow.
            const box = el("div", "ft-al-box");
            box.setAttribute("role", "group");
            box.setAttribute("aria-label", "Alignment");
            const POS = ["start", "center", "end"];
            const COL = ["left", "center", "right"];
            const ROW = ["top", "center", "bottom"];
            let key = "";
            let cells = [];
            const state = () => {
              const dir = dirOf();
              const a = alignOf(target);
              return { dir, a, wrap: dir === "row" && wrapOf(), auto: a.main === "auto" };
            };
            const cellOf = (st) => {
              if (st.auto) return POS.indexOf(st.a.cross);
              const m = POS.indexOf(st.a.main);
              const c = POS.indexOf(st.a.cross);
              return st.dir === "column" ? m * 3 + c : c * 3 + m;
            };
            // Wrapped, align-content moves the rows too, so the Vertical gap is the space between them.
            const across = (cross) => {
              keepStretch(target);
              setAlignment(target, "align-items", ALIGN_CSS[cross]);
              dropStretch(target);
              if (wrapOf()) packRows(target, cross);
            };
            const crossTo = (st, cross) => {
              if (cross !== st.a.cross || wrapOf()) across(cross);
            };
            const pickCell = (i) => {
              const st = state();
              if (st.auto) return crossTo(st, POS[i]);
              const r = Math.floor(i / 3);
              const c = i % 3;
              const main = POS[st.dir === "column" ? r : c];
              const cross = POS[st.dir === "column" ? c : r];
              if (main !== st.a.main) setAlignment(target, "justify-content", ALIGN_CSS[main]);
              crossTo(st, cross);
            };
            // Each cell holds two glyphs: the one it shows at rest, and the one it shows picked (or under the pointer).
            const glyphs = (st, i) => {
              if (st.auto) {
                const col = st.dir === "column";
                const rest = ICON[col ? "alAutoVs_" + "LCR"[i] : "alAutoHs_" + "TCB"[i]];
                const on = (col ? ["alAutoV_T", "alAutoV_C", "alAutoV_B"] : ["alAutoH_L", "alAutoH_C", "alAutoH_R"]).map((k) => ICON[k]).join("");
                return [rest + rest + rest, on];
              }
              const r = Math.floor(i / 3);
              const c = i % 3;
              return [ICON.alDot, ICON[st.wrap ? "alW_" + "LCR"[c] : st.dir === "column" ? "alV_" + "LCR"[c] : "alH_" + "TCB"[r]]];
            };
            const build = (st) => {
              box.className = "ft-al-box" + (st.auto ? (st.dir === "column" ? " is-auto is-cols" : " is-auto is-rows") : "");
              cells = Array.from({ length: st.auto ? 3 : 9 }, (_, i) => {
                const [rest, on] = glyphs(st, i);
                const r = Math.floor(i / 3);
                const c = i % 3;
                const tip = st.auto ? "Align " + (st.dir === "column" ? COL[i] : ROW[i])
                  : "Align " + (r === 1 ? COL[c] : ROW[r] + " " + COL[c]);
                const b = button("ft-al-cell", null, () => {
                  pickCell(i);
                  changed(true);
                });
                b.innerHTML = '<span class="ft-al-rest">' + rest + '</span><span class="ft-al-on">' + on + "</span>";
                b.setAttribute("data-ft-tip", tip);
                b.setAttribute("aria-label", tip);
                withTip(b);
                return b;
              });
              box.replaceChildren(...cells);
            };
            // The arrows move the picked cell, as in Figma.
            box.addEventListener("keydown", (e) => {
              const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
              if (!d || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
              e.preventDefault();
              const st = state();
              const at = cellOf(st);
              const clamp = (n) => Math.min(2, Math.max(0, n));
              const next = st.auto ? clamp(at + (st.dir === "column" ? d[1] : d[0]))
                : clamp(Math.floor(at / 3) + d[0]) * 3 + clamp((at % 3) + d[1]);
              if (next === at) return;
              pickCell(next);
              changed(true);
              if (cells[next]) cells[next].focus();
            });
            draws.push(() => {
              const f = flowOf();
              if (f !== "vertical" && f !== "horizontal") return;
              const st = state();
              const k = [st.dir, st.wrap, st.auto].join();
              if (k !== key) {
                key = k;
                build(st);
              }
              const on = cellOf(st);
              cells.forEach((b, i) => b.setAttribute("aria-pressed", String(i === on)));
            });
            let gapEl = gap1 && gap1.wrap;
            if (g.two) {
              gapEl = el("div", "ft-al-gaps");
              gapEl.append(gapX.wrap, gapY.wrap);
            }
            const gapCell = labeled("Gap", gapEl);
            gapCell.classList.add("ft-al-top");
            const alCell = labeled("Alignment", box);
            alCell.classList.add("ft-al-top");
            alEls.push(alCell, gapCell);
          }

          // Padding: Horizontal and Vertical, or each side after Individual padding (open when the sides differ, as
          // Figma opens it). Longhands only. A Fixed frame keeps its size, so the padding comes out of its content;
          // a hugging one grows, as in Figma. Fixed is what Resizing reads (a stylesheet's size too), and the size is
          // written back only where the padding changed it (a border-box keeps its own).
          const writePad = (sides, v) => {
            const n = parseFloat(v);
            if (!isNum(n)) return;
            const sz = sizeOf(target);
            const fw = sizeModeOf(target, "w") === "fixed";
            const fh = sizeModeOf(target, "h") === "fixed";
            sides.forEach((side) => setPx(target, "padding-" + side, Math.max(0, n)));
            const now = sizeOf(target);
            const kw = fw && Math.abs(now.w - sz.w) >= 0.5;
            const kh = fh && Math.abs(now.h - sz.h) >= 0.5;
            if (kw || kh) setSize(target, kw ? sz.w : null, kh ? sz.h : null);
          };
          const p0 = padOf(target);
          let split = p0[0] !== p0[2] || p0[1] !== p0[3];
          const padH = numField(ICON.padH, "Horizontal padding");
          const padV = numField(ICON.padV, "Vertical padding");
          editable(padH.input, changed, (v) => writePad(["left", "right"], v));
          editable(padV.input, changed, (v) => writePad(["top", "bottom"], v));
          const each = el("div", "ft-span2 ft-pads");
          const toggle = iconButton(ICON.padSides, "Individual padding", () => {
            split = !split;
            each.hidden = !split;
            toggle.setAttribute("aria-pressed", String(split));
          });
          toggle.setAttribute("aria-pressed", String(split));
          each.hidden = !split;
          const side = (name, icon, tip) => {
            const f = numField(ICON[icon], tip);
            editable(f.input, changed, (v) => writePad([name], v));
            return f;
          };
          const pl = side("left", "padLeft", "Left padding");
          const pt = side("top", "padTop", "Top padding");
          const pr = side("right", "padRight", "Right padding");
          const pb = side("bottom", "padBottom", "Bottom padding");
          [[pl, pt], [pr, pb]].forEach(([a, b]) => {
            const pair = el("div", "ft-type-pair");
            pair.append(a.wrap, b.wrap);
            const row = el("div", "ft-with-action");
            row.append(pair, el("span", "ft-action-gap"));
            each.appendChild(row);
          });
          const padPair = el("div", "ft-type-pair");
          padPair.append(padH.wrap, padV.wrap);
          const padRow = el("div", "ft-with-action");
          padRow.append(padPair, toggle);
          alEls.push(labeled("Padding", padRow, true), each);
          draws.push((force) => {
            const p = padOf(target).map(round1);
            padH.set(p[3] === p[1] ? p[3] : "Mixed", force);
            padV.set(p[0] === p[2] ? p[0] : "Mixed", force);
            pt.set(p[0], force);
            pr.set(p[1], force);
            pb.set(p[2], force);
            pl.set(p[3], force);
          });
        }
      }
      // On auto layout the size is Figma's Resizing.
      grid.appendChild(labeled(alEls.length ? "Resizing" : "Dimensions", dimsRow, true));
      alEls.forEach((e) => grid.appendChild(e));
      // Clip content, as Figma's frames have it, on a container: its overflow, hidden (clipped) or visible. Checking
      // writes hidden, unchecking visible; landing back on what the code says takes the edit off.
      let clip = null;
      const clipped = () => {
        const cs = getComputedStyle(target);
        return cs.overflowX !== "visible" || cs.overflowY !== "visible";
      };
      if (container) {
        const box = el("span", "ft-check");
        box.innerHTML = ICON.checkDraw;
        clip = button("ft-check-row ft-span2", null, () => {
          toggling(clip);
          const next = clipped() ? "visible" : "hidden";
          setStyle(target, "overflow", ownValue(target, "overflow", "overflow-x") === next ? "" : next);
          changed(true);
        });
        clip.setAttribute("role", "checkbox");
        clip.append(box, el("span", null, "Clip content"));
        draws.push(() => {
          const on = clipped();
          clip.setAttribute("aria-checked", String(on));
        });
      }
      if (spacing) grid.appendChild(labeled("Spacing", spacing.wrap));
      // Clip content ends the section, as in Figma.
      if (clip) grid.appendChild(clip);
      s.appendChild(grid);
      // Text's Resizing costs forced layouts too: read on a forced draw, the first, or when its own size changed.
      let textKey = null;
      let textNow = "auto";
      draws.push((force) => {
        const now = read();
        if (hasText(target) && !inSvg(target)) {
          const key = target.style.width + "|" + target.style.height;
          if (force || key !== textKey) {
            textKey = key;
            textNow = textMode();
          }
          resizing.set(textNow);
        }
        // In Scale, the size Scale shows, to two decimals (Layout and Scale both read 134.18, as in Figma).
        if (scaleHolds(target) && !history.quiet) scaleFresh();
        const sc = scaleHolds(target) ? scaleMode : null;
        w.set(sc ? parseFloat(fmt2(sc.base.w * sc.f)) : now.w, force);
        h.set(sc ? parseFloat(fmt2(sc.base.h * sc.f)) : now.h, force);
        // Resizing's mode costs forced layouts, so it's read on a forced draw (and the first), never on a scroll.
        if (sizeMenus && (force || modeOf.w == null)) {
          [["w", w], ["h", h]].forEach(([axis, f]) => {
            // A caret with nothing but Fixed in it isn't worth a click.
            carets[axis].hidden = sizeItems(axis).length < 2;
            modeOf[axis] = carets[axis].hidden ? "fixed" : sizeModeOf(target, axis);
            f.input.placeholder = { hug: "Hug", fill: "Fill" }[modeOf[axis]] || "";
          });
        }
        const locked = ratioLocked(target);
        lock.setAttribute("aria-pressed", String(locked));
        // The kit shows the link broken when off and joined when on. Swapped only on a change, so a draw
        // under the pointer never rebuilds the glyph.
        const lockIcon = locked ? ICON.lockRatio : ICON.linkBroken;
        if (lock.dataset.ftIcon !== String(locked)) { lock.innerHTML = lockIcon; lock.dataset.ftIcon = String(locked); }
        if (flow) flow.set(flowOf());
        if (spacing) {
          const g = gapOf();
          spacing.set(!g || !g.stack ? "" : g.n == null ? "Mixed" : Math.round(g.n), force);
        }
      });
      return s;
    }

    // Typography, as in Figma: family, weight, size, line height, letter spacing, alignment.
    function typography(target) {
      const s = section("Typography");

      // Figma's Text styles, from the styles button (four circles) in the header: the type styles the page's code
      // defines (codeTextStyles). Hovering one previews it on the text, saving nothing (the inline values it covers are
      // kept to put back). A pick writes the values its class gives, one undo step, and Copy names the class over them,
      // so the bake adds the class, not the numbers.
      let held = null;
      const putBack = () => {
        if (!held) return;
        held.forEach(([p, v, pri]) => (v ? target.style.setProperty(p, v, pri) : target.style.removeProperty(p)));
        held = null;
        tidyStyle(target);
      };
      const previewStyle = (st) => {
        putBack();
        if (!st) return;
        held = Object.keys(st.decl).map((p) => [p, target.style.getPropertyValue(p), target.style.getPropertyPriority(p)]);
        Object.keys(st.decl).forEach((p) => target.style.setProperty(p, st.decl[p]));
      };
      const applyStyle = (st) => {
        if (history.timer) commitStep();
        history.quiet++;
        // One style at a time, as in Figma: what the last style she picked set, and this one doesn't, goes back to the
        // code's. The pick is kept where its values go: on a component's root, the component (as fills are, see META).
        const m = metaOf(target);
        const was = m && m.textStyle;
        if (was) Object.keys(was.styles).forEach((p) => { if (!(p in st.decl) && m.styles[p] === was.styles[p]) handBack(target, p); });
        Object.keys(st.decl).forEach((p) => setStyle(target, p, st.decl[p]));
        recordMeta(target, (x) => { x.textStyle = { name: st.name, styles: Object.assign({}, st.decl) }; });
        history.quiet--;
        noteChange();
        changed(true);
      };
      const stylesBtn = iconButton(ICON.guideStyles, "Text styles", () => textStylesPop.toggle(stylesBtn, {
        empty: "No text styles found",
        items: () => {
          const styles = codeTextStyles(target);
          // The style it has: the one she picked, while it holds, else one of its own classes that shows as it gives.
          const m = metaOf(target);
          const names = (m && m.textStyle ? [m.textStyle.name] : []).concat(Array.from(target.classList));
          const cur = names.map((n) => styles.find((st) => st.name === n)).find((st) => st && showsTextStyle(target, st));
          return styles.map((st) => {
            const ag = el("span", "ft-style-ag", "Ag");
            ag.style.fontFamily = st.face.family;
            ag.style.fontWeight = st.face.weight;
            ag.style.fontStyle = st.face.style;
            return { value: st, label: st.name, meta: st.meta, lead: ag, current: st === cur };
          });
        },
        onHover: previewStyle,
        onPick: applyStyle,
      }));
      const headActions = el("div", "ft-head-actions");
      headActions.appendChild(stylesBtn);
      s.firstChild.appendChild(headActions);

      // Figma's vertical alignment. A block or a grid honors align-content; a one-line flex box (a button, a pill)
      // ignores it, so there it's align-items, or justify-content in a column.
      const vProp = (cs) => (!/flex/.test(cs.display) ? "align-content" : /column/.test(cs.flexDirection) ? "justify-content" : "align-items");
      const vRead = (cs) => {
        const prop = vProp(cs);
        let v = cs.getPropertyValue(prop).trim().replace(/^(un)?safe /, "");
        // flex-start is the bottom in a reversed column (and normal packs from there too), or across wrap-reverse.
        const flip = prop === "justify-content" ? /reverse/.test(cs.flexDirection) : prop === "align-items" && cs.flexWrap === "wrap-reverse";
        if (flip) v = { "flex-start": "flex-end", "flex-end": "flex-start", normal: prop === "justify-content" ? "flex-end" : v }[v] || v;
        return { start: "top", "flex-start": "top", "self-start": "top", normal: "top", stretch: "top", baseline: "top",
          center: "middle", end: "bottom", "flex-end": "bottom", "self-end": "bottom" }[v] || "";
      };

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
          valign: vRead(cs),
        };
      };

      // Keep the weight if the family has it (a variable face's range counts); otherwise the nearest one it does.
      const weightIn = (f, w) => (familyHas(f, w) ? w : familyWeights(f).reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a)));
      // Figma's hover preview: the text wears each family the pointer passes over, saving nothing.
      // The inline values it had are kept here to put back.
      let before = null;
      // The field opens Figma's Fonts popover (makeFontsPop), not the dark menu.
      const family = dropdown((btn) => {
        const now = read();
        fontsPop.toggle(btn, { current: now.family, onPick: (f) => {
          // The family it has already changes nothing, as in Figma (writing it would drop the code's fallbacks).
          if (f === now.family) return;
          setStyle(target, "font-family", familyCss(f));
          const w = weightIn(f, now.weight);
          if (w !== now.weight) setStyle(target, "font-weight", String(w));
          changed(true);
        }, onHover: (f) => {
          if (f == null || f === now.family) {
            if (!before) return;
            target.style.fontFamily = before.family;
            target.style.fontWeight = before.weight;
            before = null;
            return;
          }
          if (!before) before = { family: target.style.fontFamily, weight: target.style.fontWeight };
          const w = weightIn(f, now.weight);
          target.style.fontFamily = familyCss(f);
          target.style.fontWeight = w === now.weight ? before.weight : String(w);
        } });
      });
      family.btn.classList.add("ft-span2");
      // Each weight previews on the text as the pointer passes over it, as the Fonts list does (her ask, 2026-10-17),
      // saving nothing: the inline weight it had is kept here to put back.
      let heldWeight = null;
      const weight = dropdown((btn) => {
        const now = read();
        const items = familyWeights(now.family).map((w) => ({ label: WEIGHT_NAMES[w] || String(w), value: w }));
        menu.toggle(btn, items, now.weight, (w) => {
          setStyle(target, "font-weight", String(w));
          changed(true);
        }, (w) => {
          if (w == null || w === now.weight) {
            if (heldWeight == null) return;
            target.style.fontWeight = heldWeight;
            heldWeight = null;
            return;
          }
          if (heldWeight == null) heldWeight = target.style.fontWeight;
          target.style.fontWeight = String(w);
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
      const leading = numField(ICON.lineHeight, "Line height");
      const tracking = numField(ICON.letterSpacing, "Letter spacing");

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
        setStyle(target, vProp(getComputedStyle(target)), { top: "start", middle: "center", bottom: "end" }[v]);
      });

      function draw(force) {
        // A text style's or a weight's preview resizes the text, which redraws the panel; every field stays on the
        // real values.
        if (held || heldWeight != null) return;
        const now = read();
        // A preview resizes the text, which redraws the panel; the labels stay on the real font.
        if (!before) {
          // The display name, as the Fonts popover shows it; the field still writes the real family.
          family.label.textContent = fontLabel(now.family);
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
        // Rounded, as a percent over 100 can land on float noise (2.2% is 0.022000000000000002).
        if (isNum(n)) setStyle(target, "letter-spacing", t.endsWith("px") ? n + "px" : +(n / 100).toFixed(6) + "em");
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
      const prop = svg ? "fill" : "color";
      const paint = svg ? svgPaint(target, "fill") : null;
      textLayer = hiddenFill(target) || (svg ? paint.layer : toFill(getComputedStyle(target).color)) || { hex: "000000", opacity: 100, visible: true };
      const layer = textLayer;
      // The colour token it shows (hers or the code's), read at its first change, before that writes over it: the eye
      // hides and shows the token, not the colour it is in this theme. A new colour or opacity lets the token go.
      const at = { hex: layer.hex, opacity: layer.opacity };
      const list = el("div", "ft-fills");
      list.appendChild(fillRow(layer, () => {
        if (layer.hex !== at.hex || layer.opacity !== at.opacity) layer.token = null;
        else if (layer.token === undefined) layer.token = colorTokenOf(target, prop);
        if (svg) writeSvgPaint(target, "fill", layer);
        else setStyle(target, "color", !layer.visible ? "transparent" : layer.token ? "var(" + layer.token + ")" : rgba(layer));
        recordFill(target, layer);
        picker.sync();
      }, null, picker));
      s.appendChild(list);

      // Figma's Color styles, from the styles button (four circles) in the header: the colour tokens the page's code
      // defines (codeColors). Hovering one previews it on the text, saving nothing; a pick writes the token itself
      // (var(--x)), one undo step, so the text follows the theme as the code's colours do.
      let held = null;
      const previewColor = (name) => {
        if (held) {
          if (held[0]) target.style.setProperty(prop, held[0], held[1]);
          else target.style.removeProperty(prop);
          held = null;
          tidyStyle(target);
        }
        if (!name) return;
        held = [target.style.getPropertyValue(prop), target.style.getPropertyPriority(prop)];
        target.style.setProperty(prop, "var(" + name + ")");
      };
      const applyColor = (name) => {
        if (history.timer) commitStep();
        if (svg) writeSvgPaint(target, "fill", { visible: true, token: name });
        else setStyle(target, "color", "var(" + name + ")");
        recordFill(target, { visible: true });
        // The row reads its colour once, so it's built again on the token's.
        if (selection) selection.reshow();
      };
      const stylesBtn = iconButton(ICON.guideStyles, "Color styles", () => colorStylesPop.toggle(stylesBtn, {
        empty: "No colors found",
        items: () => {
          const cur = colorTokenOf(target, prop);
          return codeColors(target).map((c) => {
            const sw = el("span", "ft-swatch");
            // Its left half opaque, as the fill row's swatch shows a colour with an opacity.
            sw.style.setProperty("--ft-c", CSS.supports("color", "rgb(from red r g b / 1)") ? "rgb(from " + c.value + " r g b / 1)" : c.value);
            sw.style.setProperty("--ft-ca", c.value);
            return { value: c.name, label: c.name.slice(2), lead: sw, current: c.name === cur };
          });
        },
        onHover: previewColor,
        onPick: applyColor,
      }));
      const headActions = el("div", "ft-head-actions");
      headActions.appendChild(stylesBtn);
      s.firstChild.appendChild(headActions);
      return s;
    }

    // Figma's Scale section (K), in place of Appearance and everything after it: Width and Height (the size it scales
    // to), Scale (the factor, with presets) and Anchor point (what stays put; a click only moves the anchor). Each typed
    // value or preset is one undo step.
    const SCALE_PRESETS = [0.5, 1, 2, 3];
    const ANCHORS = ["Top left", "Top center", "Top right", "Left center", "Center", "Right center", "Bottom left", "Bottom center", "Bottom right"];
    function scaleSection(target) {
      const list = Array.isArray(target) ? target : [target];
      const s = section("Scale");
      const actions = el("div", "ft-head-actions");
      actions.appendChild(iconButton(ICON.x, "Close", () => endScale()));
      s.firstChild.appendChild(actions);
      const commit = (f) => {
        const m = scaleMode;
        if (!m || !isNum(f) || !(f > 0)) return changed(true);
        if (history.timer) commitStep();
        const from = scaleFrom();
        history.quiet++;
        list.forEach((t) => still(t, true));
        applyScale(Math.max(scaleLeast(m), f), from);
        flush();
        list.forEach((t) => still(t, false));
        history.quiet--;
        noteChange();
        reflowFor(list);
        if (scaleMode) scaleSeal(scaleMode);
        changed(true);
      };
      const w = numField("W");
      const h = numField("H");
      editable(w.input, changed, (v) => commit(scaleMode ? parseFloat(v) / scaleMode.base.w : NaN));
      editable(h.input, changed, (v) => commit(scaleMode ? parseFloat(v) / scaleMode.base.h : NaN));
      // The factor takes 1.5, 1.5x or 150%; anything else (zero, below it, not a number) puts the old one back.
      const factor = numField(ICON.scaleSmall, "Scale");
      factor.wrap.querySelector(".ft-field-icon").setAttribute("data-ft-tip-key", "K");
      editable(factor.input, changed, (v) => {
        const m = /^\s*(\d*\.?\d+)\s*(x|%)?\s*$/i.exec(v);
        commit(m ? parseFloat(m[1]) / (m[2] === "%" ? 100 : 1) : NaN);
      });
      // Figma's Scale list needs her screenshot of it open; the kit's Export multipliers stand in for now.
      const presets = button("ft-scale-dd", null, () => menu.toggle(presets, SCALE_PRESETS.map((n) => ({ label: n + "x", value: n })),
        scaleMode ? round4(scaleMode.f) : null, (v) => commit(v)));
      presets.innerHTML = ICON.caretDown;
      presets.setAttribute("aria-label", "Scale presets");
      const combo = el("div", "ft-scale-combo");
      combo.append(factor.wrap, presets);
      // Anchor point: the nine dots' field; the picked cell's blue square fades in as the last one's fades out.
      const box = el("div", "ft-anchor-box");
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", "Anchor point");
      const pickAnchor = (i) => {
        if (scaleMode) scaleMode.anchor = [(i % 3) / 2, Math.floor(i / 3) / 2];
        changed(false);
      };
      const cells = ANCHORS.map((tip, i) => {
        const b = button("ft-anchor-cell", null, () => pickAnchor(i));
        b.innerHTML = '<span class="ft-al-rest">' + ICON.alDot + '</span><span class="ft-anchor-sq"></span>';
        b.setAttribute("data-ft-tip", tip);
        b.setAttribute("aria-label", tip);
        withTip(b);
        return b;
      });
      box.append(...cells);
      const anchorAt = () => (scaleMode ? Math.round(scaleMode.anchor[1] * 2) * 3 + Math.round(scaleMode.anchor[0] * 2) : 4);
      box.addEventListener("keydown", (e) => {
        const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
        if (!d || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
        e.preventDefault();
        // From the cell with focus (Tab can move it off the anchor), else the anchor.
        const at = cells.includes(document.activeElement) ? cells.indexOf(document.activeElement) : anchorAt();
        const clamp = (n) => Math.min(2, Math.max(0, n));
        const next = clamp(Math.floor(at / 3) + d[0]) * 3 + clamp((at % 3) + d[1]);
        if (next === at) return;
        pickAnchor(next);
        cells[next].focus();
      });
      const scaleCell = labeled("Scale", combo);
      const anchorCell = labeled("Anchor point", box);
      scaleCell.classList.add("ft-al-top");
      anchorCell.classList.add("ft-al-top");
      const grid = el("div", "ft-type ft-scale-grid");
      grid.append(labeled("Width", w.wrap), labeled("Height", h.wrap), scaleCell, anchorCell);
      s.appendChild(grid);
      draws.push((force) => {
        const m = scaleMode;
        if (!m) return;
        // An edit that wasn't a scale (Layout's W, an undo) shows the factor the size now has.
        if (!history.quiet) scaleFresh();
        w.set(fmt2(m.base.w * m.f), force);
        h.set(fmt2(m.base.h * m.f), force);
        // Never 0x: under 0.01 the factor keeps two significant digits.
        factor.set((m.f < 0.01 ? String(+m.f.toPrecision(2)) : fmt2(m.f)) + "x", force);
        const at = anchorAt();
        cells.forEach((c, i) => c.setAttribute("aria-pressed", String(i === at)));
      });
      return s;
    }
    // K: Scale on for what's selected, or off. Not on text being edited, a turned or skewed layer, or the page.
    function startScale() {
      const list = Array.isArray(shown) ? shown : [shown];
      if (shownColumn) return toast("Scale works on layers, not columns");
      if (document.querySelector("[data-ft-editing]")) return toast("Scale doesn't work while text is being edited");
      if (list.some((t) => t === document.body || t === document.documentElement)) return toast("Scale doesn't work on the page");
      if (list.some((t) => !selection || !selection.resizable(t))) return toast("Scale doesn't work on a turned layer");
      if (history.timer) commitStep();
      beginScale(list, shownKind === "group" ? groupFor(list) : null);
      showInPanel(shown, shownKind, shownColumn);
      if (selection) selection.refresh();
    }
    endScale = () => {
      if (!scaleMode) return;
      dropScale();
      showInPanel(shown, shownKind, shownColumn);
      if (selection) selection.refresh();
    };

    // The layer's kind, read from the code, and the element it is (its tag and first class or id).
    function kindLine(t) {
      const comp = document.documentElement.classList.contains("ft-motion") ? "" : componentOf(t);
      if (comp) return wordsNote(componentLine(t, comp), t);
      const kind = kindOf(t);
      const row = el("div", "ft-kind");
      row.append(el("span", "ft-kind-name", kind), el("span", "ft-kind-el", elName(t)));
      if (kind === "Group") row.append(el("span", "ft-kind-dot", "·"), itemCount(layersOf(t)));
      return wordsNote(row, t);
    }
    // Words the page rewrote after she retyped them (see watchWords) say so under the kind line, as soon as it happens:
    // what she typed there won't hold, and the bake will ask before changing the code's expression.
    function wordsNote(row, t) {
      if (!hasText(t)) return row;
      const note = el("span", "ft-kind-el", "These words are built in code: the page rewrote them.");
      const stacked = row.classList.contains("ft-kind-comp");
      const show = () => {
        const on = !!(entryOf(t) || {}).htmlComputed;
        note.hidden = !on;
        row.classList.toggle("ft-kind-comp", stacked || on);
      };
      row.appendChild(note);
      show();
      draws.push(show);
      return row;
    }
    function kindOf(t) {
      const tag = t.tagName.toLowerCase();
      return hasText(t) ? "Text" : tag === "img" ? "Image" : t instanceof SVGSVGElement ? "SVG"
        : isVector(t) ? (tag === "g" ? "Group" : "Vector") : t.children.length ? "Group" : "Box";
    }
    function elName(t) {
      return t.tagName.toLowerCase() + (t.id ? "#" + t.id : t.classList.length ? "." + t.classList[0] : "");
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
        showInPanel(shown, shownKind, shownColumn);
      });
      override.setAttribute("aria-pressed", String(on));
      const mark = el("span");
      mark.innerHTML = ICON.instance;
      override.append(mark, el("span", null, "Override"));
      // A cva component's variant follows its name, as a group's count follows its element ("Button · outline"):
      // an edit reaches the instances of that variant only (see componentKey).
      const variant = parseKey(componentKey(t)).variant;
      let head = el("span", "ft-kind-name", name);
      if (variant != null) {
        const nameEl = head;
        head = el("span", "ft-kind-head");
        head.append(nameEl, el("span", "ft-kind-dot", "·"), el("span", "ft-kind-el", variant));
      }
      // One given no variant isn't called by a name its cva may not have (see variantOf).
      const every = variant === NO_VARIANT ? name + " given no variant" : (variant != null ? variant + " " : "") + name;
      row.append(head, el("span", "ft-kind-el", on ? "Editing only this " + name + "." : "Editing every " + every + "."), override);
      return row;
    }

    // How many items a group holds, after the element's name in its small type, with a caret: it opens
    // the items as a menu (each as its kind line would read it), to select one she knows without hunting for it on
    // the page; hovering an item outlines it on the page (her ask, 2026-10-14).
    function itemCount(list) {
      const n = list.length;
      const b = button("ft-kind-count", null, () => menu.toggle(b,
        list.map((t, i) => ({ label: kindOf(t) + " · " + elName(t), value: i })), null,
        (i) => selection.selectItem(list[i]),
        (i) => selection.preview(i == null ? null : list[i]), b.closest(".ft-kind")));
      b.append(el("span", null, n + (n === 1 ? " item" : " items")), caret());
      return b;
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
      if (isGroup) row.appendChild(itemCount(list));
      return row;
    }

    // Motion, as Figma's Prototype tab, true to the code: for one layer its Animation; with nothing selected, the
    // page's Animations. Several layers show their kind line only: motion is set one layer at a time. Drawn while
    // the tab shows.
    const motionChosen = el("div", "ft-chosen");
    // The drawn Animation section's listeners (on its layers and their JavaScript animations), let go when Motion
    // redraws; watchJs hears a new animate() call on a layer while that section shows.
    let motionOff = null;
    let watchJs = null;
    let shown = null;
    let shownKind = null;
    // A column of the layout guide picked with (or without) the layers shown, as { i }.
    let shownColumn = null;

    // Figma's help card (its "Creating a connection"), for lining layers up with a column. At the bottom of the
    // panel while a columns layout shows and nothing is selected, with a close that puts it away for good in this
    // browser; shorter, without the close, as the panel when just a column is picked.
    const COLUMN_TIP_KEY = "finetune:tip:column";
    // With a key, the how-to gets Figma's trailing close (the row's 24 icon button at the panel's right edge, level
    // with the first line); closing puts it away for this session (sessionStorage "finetune:tip:<key>").
    // icon: null for words alone (the column and stretch rows, her call 2026-10-14; the help cards keep theirs).
    function helpRow(icon, text, key) {
      const body = el("div", "ft-help-body");
      if (icon) {
        const mark = el("span", "ft-help-icon");
        mark.innerHTML = ICON[icon];
        body.appendChild(mark);
      }
      body.appendChild(el("p", "ft-help-text", text));
      if (key) {
        const store = "finetune:tip:" + key;
        body.classList.add("ft-help-closable");
        try { body.hidden = sessionStorage.getItem(store) === "closed"; } catch (e) {}
        body.appendChild(iconButton(ICON.dismiss, "Close", () => {
          body.hidden = true;
          try { sessionStorage.setItem(store, "closed"); } catch (e) {}
        }));
      }
      return body;
    }
    function helpCard(title, icon, text, onClose) {
      const s = el("div", "ft-section ft-help");
      const head = el("div", "ft-section-head");
      head.appendChild(el("span", null, title));
      if (onClose) head.appendChild(iconButton(ICON.dismiss, "Close", onClose));
      s.append(head, helpRow(icon, text));
      return s;
    }
    let tipClosed = false;
    try { tipClosed = localStorage.getItem(COLUMN_TIP_KEY) === "closed"; } catch (e) {}
    // ⌥-click, since most pages leave no empty space in a column to click (Option on a Mac, Alt elsewhere).
    const altClick = MAC ? "Option-click" : "Alt-click";
    const colTip = helpCard("Aligning layers to a column", "gridColumn", altClick + " a column to select it, and shift-" + altClick.toLowerCase() + " to add more. Then shift-click layers to align them to the columns or match their width.", () => {
      tipClosed = true;
      try { localStorage.setItem(COLUMN_TIP_KEY, "closed"); } catch (e) {}
      drawColumnTip();
    });
    // Motion's: how to give a layer new motion, under Animations while nothing is selected, with the same close.
    const MOTION_TIP_KEY = "finetune:tip:motion";
    let motionTipClosed = false;
    try { motionTipClosed = localStorage.getItem(MOTION_TIP_KEY) === "closed"; } catch (e) {}
    const motionTip = helpCard("Adding motion to layers", "motion", "Select a layer on the page, then use Add CSS animation to give it new motion.", () => {
      motionTipClosed = true;
      try { localStorage.setItem(MOTION_TIP_KEY, "closed"); } catch (e) {}
      motionTip.hidden = true;
    });
    motionTip.hidden = motionTipClosed;
    const drawColumnTip = () => { colTip.hidden = tipClosed || !!(shown || shownColumn) || !guides.some((g) => g.visible); };
    afterGuides = () => {
      drawColumnTip();
      if (selection) selection.guidesChanged();
    };
    drawColumnTip();

    // The columns picked, named as Figma names a layer: "Column 3", "Columns 3–5" (in a row) or "Columns 2, 5", of
    // how many, and how many layers are picked with them.
    function columnLine(cols, n) {
      const g = guides.find((gd) => gd.visible);
      const nums = cols.map((i) => i + 1);
      const name = nums.length === 1 ? "Column " + nums[0]
        : "Columns " + (columnSpan(cols) === nums.length ? nums[0] + "–" + nums[nums.length - 1] : nums.join(", "));
      const row = el("div", "ft-kind");
      row.append(el("span", "ft-kind-name", name), el("span", "ft-kind-el", g ? "of " + g.count : ""));
      if (n) row.appendChild(el("span", "ft-kind-name ft-kind-count", n + (n === 1 ? " layer" : " layers")));
      // A click on the line opens the Page settings, where the layout these columns come from lives.
      row.classList.add("ft-kind-link");
      row.addEventListener("click", () => {
        if (selection) selection.selectLayers([]);
        guideSec.scrollIntoView({ block: "nearest" });
      });
      return row;
    }
    // Columns and layers: Alignment lines the layers up with them, and its how-to sits under it.
    function columnSection(cols, list) {
      const many = cols.length > 1;
      const s = section("Position");
      const row = el("div", "ft-type-pair");
      row.append(actionSeg(many ? COLUMNS_ACROSS : COLUMN_ACROSS, (how) => alignColumns(cols, list, how)), el("div"));
      const grid = el("div", "ft-type");
      const help = many ? helpRow(null, "Line layers up with the leftmost, center, or rightmost column.", "align")
        : helpRow(null, "Line layers up with this column's left edge, center, or right edge.", "align");
      grid.appendChild(labeled(many ? "Align to columns" : "Align to column", row, true));
      s.append(grid, help);
      return s;
    }
    // Two or more columns and layers: Layout, with the layers' Dimensions and Match item width to the columns.
    function columnLayout(cols, list) {
      const s = section("Layout");
      const top = list.filter((t) => !list.some((o) => o !== t && o.contains(t)));
      const sizes = () => top.map(sizeOf);
      const same = (k) => {
        const v = sizes().map((z) => Math.round(z[k]));
        return v.every((x) => x === v[0]) ? v[0] : "Mixed";
      };
      const w = numField("W");
      const h = numField("H");
      [[w, "w"], [h, "h"]].forEach(([f, k]) => editable(f.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        top.forEach((t) => typedResize(t, k === "w" ? n : null, k === "h" ? n : null, { locked: ratioLocked(t) }));
      }));
      const dims = el("div", "ft-type-pair");
      dims.append(w.wrap, h.wrap);
      const n = columnSpan(cols);
      const match = button("ft-choice ft-choice-icon ft-add-anim ft-match-cols", null, () => {
        matchColumns(cols, list);
        changed(true);
        offerStyle();
      });
      const icon = el("span");
      icon.innerHTML = ICON.spanWidth;
      match.append(icon, el("span", null, "Make selected " + n + " cols wide"));
      const help = helpRow(null, "Stretch layers across the columns, from the leftmost edge to the rightmost.", "fitWidth");
      const grid = el("div", "ft-type");
      grid.append(labeled("Dimensions", dims, true));
      s.append(grid, match, help);
      draws.push((force) => {
        w.set(same("w"), force);
        h.set(same("h"), force);
      });
      return s;
    }
    function alignColumns(cols, list, how) {
      alignToColumns(cols, list, how);
      changed(true);
      offerStyle();
    }
    // After adding a layout, changing one's numbers, or lining layers up with a column of a layout that isn't a saved
    // style yet (once a visit per layout): a toast offers to save it, for this page or every page. Typing in the
    // fields redraws on every keystroke, so the offer waits until the numbers have stood still for a moment.
    const offered = new Set();
    let offerTimer = 0;
    function offerSoon(g) {
      clearTimeout(offerTimer);
      offerTimer = setTimeout(() => offerStyle(g), 1200);
    }
    function offerStyle(edited) {
      const g = edited || guides.find((gd) => gd.visible);
      if (!g) return;
      const name = styleName(g);
      // The page's own grid isn't new: Styles lists it as "Page grid".
      if (pageDefault && styleName(pageDefault) === name) return;
      if (offered.has(name) || [stylesPage(), STYLES_ALL].some((k) => loadStyles(k).some((st) => st.name === name))) return;
      offered.add(name);
      toast("Use this new layout guide as active default?", [{ label: "Page", run: () => saveStyle(stylesPage(), true) }, { label: "Website", run: () => saveStyle(STYLES_ALL, true) }], 15000);
    }

    function drawMotion() {
      motionChosen.textContent = "";
      if (motionOff) motionOff.abort();
      motionOff = null;
      animsSec.hidden = !!shown;
      motionTip.hidden = motionTipClosed || !!shown;
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

      // What the fields last saw of these keyframes away from rest (moveShape; each aspect's keyframes, by offset), so
      // one typed back to rest edits the same keyframes when it's typed again.
      let shape = null;
      let restAt = {};
      const fieldOf = (info, aspect) => {
        const x = info && info[aspect];
        if (!x) return null;
        if (!x.rest) restAt[aspect] = x.frames.map((f) => f.at);
        else if (restAt[aspect]) {
          const fr = x.frames.filter((f) => restAt[aspect].includes(f.at));
          if (fr.length) x.frames = fr;
        }
        return x;
      };

      function build() {
        const name = a.first("animation-name");
        // A CSS animation can play other @keyframes of the page's; a JavaScript one's keyframes are in its call,
        // so its name is a label.
        let which = null;
        if (a.swap) {
          which = dropdown((btn) => menu.toggle(btn, keyframeChoices(), name, (v) => {
            a.put("animation-name", keyframesFrom(v));
            dropUnusedKeyframes();
            shape = null;
            restAt = {};
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
          // A move at 0 has no direction of its own: it shows the one it had, and a pick only sets where the next
          // distance goes.
          if (info.distance.n) shape = moveShape(info);
          else if (shape) info.direction = shape.direction;
          const dir = segmented(MOVES, (v) => {
            if (!info.distance.n) {
              shape = turnShape(shape || stillShape(info), v);
              return build();
            }
            if (v !== info.direction) turnMoves(info, v);
            after();
          });
          dir.set(info.direction);
          what.push(label("Direction"), dir.seg, label("Distance"), num(ICON.ruler, "Distance",
            () => lengthText(info.distance), (n) => {
              if (n >= 0 && info.distance.n) scaleMoves(info, n);
              else if (n > 0) putShape(info, shape || stillShape(info), n);
              after();
            }));
        }
        ["scale", "rotate", "opacity"].forEach((aspect) => fieldOf(info, aspect));
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
      showInPanel(shown, shownKind, shownColumn);
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
      // Play and Pause follow the animations as they start and end: a CSS one's events on its layers, a JavaScript
      // one's own finish and cancel (a later animate() call's too). The listeners go when Motion redraws (a looping
      // animation never fires again to let them go itself).
      const off = new AbortController();
      if (motionOff) motionOff.abort();
      motionOff = off;
      const follow = () => {
        if (!s.isConnected) return off.abort();
        drawPlay();
      };
      const hearJs = (x) => ["finish", "cancel"].forEach((type) => x.addEventListener(type, follow, { signal: off.signal }));
      layers.forEach((t) => ["animationstart", "animationend"].forEach((type) => t.addEventListener(type, follow, { signal: off.signal })));
      jsAnims().forEach(hearJs);
      // A page calling animate() every frame redraws the icon once a frame, not once a call.
      let soonPlay = 0;
      const watch = (t, x) => {
        if (!layers.includes(t)) return;
        hearJs(x);
        if (!soonPlay) soonPlay = requestAnimationFrame(() => {
          soonPlay = 0;
          if (s.isConnected) drawPlay();
        });
      };
      watchJs = watch;
      off.signal.addEventListener("abort", () => {
        if (watchJs === watch) watchJs = null;
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
          w.on.forEach((e) => {
            if (e.classList.contains(w.cls)) return;
            if (!playClasses.has(e)) playClasses.set(e, new Set());
            playClasses.get(e).add(w.cls);
            e.classList.add(w.cls);
          });
          requestAnimationFrame(() => { if (selection) selection.selectLayers(w.animated); });
        });
        row.append(el("span", "ft-anim-name", layerNames(w.animated)), el("span", "ft-anim-meta", w.names.join(", ")), play);
        return row;
      }));
    }

    // Figma's order: Position, Layout, Appearance, then Typography and the text's Fill for
    // text, the image's Fill for an img, the background Fill for anything else, then Stroke and Effects.
    showInPanel = (target, kind, col) => {
      menu.close();
      imagePop.close();
      fontsPop.close();
      textStylesPop.close();
      colorStylesPop.close();
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
      shownColumn = col || null;
      // Scale stays on only while the same layers are shown (another selection, or none, leaves it).
      if (scaleMode && (shownColumn || !scaleHolds(target))) dropScale();
      drawMotion();
      page.hidden = guideSec.hidden = !!(target || shownColumn);
      // The theme may have switched while the Page rows were hidden.
      if (!page.hidden) readPageOwn();
      drawColumnTip();
      if (shownColumn) {
        const list = !target ? [] : Array.isArray(target) ? target : [target];
        const cols = shownColumn.cols;
        chosen.appendChild(columnLine(cols, list.length));
        if (list.length) {
          chosen.appendChild(columnSection(cols, list));
          if (cols.length > 1) chosen.appendChild(columnLayout(cols, list));
        } else if (cols.length > 1) {
          chosen.appendChild(helpCard("Aligning layers to columns", "gridColumns", "Shift-click layers to align them to these columns or match their width."));
        } else {
          chosen.appendChild(helpCard("Aligning layers to a column", "gridColumn", "Shift-click layers to align them to this column. Shift-" + altClick.toLowerCase() + " more columns to align across them or match their width."));
        }
        changed(true);
        return;
      }
      if (!target) return;
      // An edit to what's shown (not a scroll, which changes no edit) lets a group's auto layout place its layers
      // again first, so the sections after it read where they land. Not during a drag or an undo (both quiet): the
      // drag places them when it ends, and an undo's step has them placed already. Selecting alone moves nothing.
      flowTick = editTick;
      const reflowList = Array.isArray(target) ? target : [target];
      draws.push(() => {
        if (history.quiet || flowTick === editTick) return;
        flowTick = editTick;
        reflowAround(reflowList);
      });
      if (Array.isArray(target)) {
        chosen.append(kindLineMany(target, kind === "group"), setSection(target, kind === "group"));
        if (kind === "group") chosen.appendChild(groupLayout(target));
        if (scaleMode) chosen.appendChild(scaleSection(target));
        changed(true);
        return;
      }
      if (scaleMode) {
        chosen.append(kindLine(target), position(target), layout(target), scaleSection(target));
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
      // A style row's preview goes first (⌘Z can come while one is hovered); put back after the step, it would write
      // the values from before it over the step's.
      textStylesPop.close();
      colorStylesPop.close();
      // ⌘D copies the step takes away go first (the edits on and inside them resolve to nothing once the node is
      // out); ones the step brings come after the layers' styles land, cloned from the original as the step leaves it.
      const nextDups = next.duplicates || [];
      edits.duplicates.filter((d) => !nextDups.some((x) => x.key === d.key)).forEach((d) => {
        const t = applied.get(d.key);
        applied.delete(d.key);
        if (t) t.remove();
      });
      const sels = new Set(Object.keys(edits.elements).concat(Object.keys(next.elements)));
      // The element each edit was made on (see resolve), not whatever its selector finds now.
      const found = (sel) => resolve(sel, next.elements[sel] || edits.elements[sel]);
      // Words first: new words are new layers inside, which then take their own edits again (images and
      // deletes included, as they're fresh).
      const rewritten = [];
      sels.forEach((sel) => {
        const t = found(sel);
        const a = edits.elements[sel] || {};
        const b = next.elements[sel] || {};
        if (!t || a.html === b.html) return;
        const h = b.html != null ? b.html : (originals[sel] || {}).html;
        if (h == null) return;
        // By React's rule (see writeWords): words it builds from several parts are left as they are.
        if (!writeWords(t, h)) return void (b.html != null && wordsHeld.add(sel));
        wordsHeld.delete(sel);
        rewritten.push(t);
        if (b.html != null) watchWords(t);
      });
      sels.forEach((sel) => {
        const t = found(sel);
        if (!t) return;
        const fresh = rewritten.some((r) => r !== t && r.contains(t));
        if (next.elements[sel]) applied.set(sel, t);
        const a = fresh ? { styles: {} } : edits.elements[sel] || { styles: {} };
        const b = next.elements[sel] || { styles: {} };
        const o = originals[sel] || { styles: {} };
        new Set(Object.keys(a.styles).concat(Object.keys(b.styles))).forEach((prop) => {
          const v = prop in b.styles ? b.styles[prop] : o.styles[prop] || "";
          if (v) t.style.setProperty(prop, v);
          else t.style.removeProperty(prop);
        });
        tidyStyle(t);
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
        if (!!a.deleted !== !!b.deleted) t.toggleAttribute("data-ft-deleted", !!b.deleted);
        if (!!a.ungrouped !== !!b.ungrouped) t.toggleAttribute("data-ft-ungrouped", !!b.ungrouped);
        new Set(Object.keys(a.attrs || {}).concat(Object.keys(b.attrs || {}))).forEach((name) => {
          const v = b.attrs && name in b.attrs ? b.attrs[name] : (o.attrs || {})[name];
          if (v != null) t.setAttribute(name, v);
          else t.removeAttribute(name);
        });
      });
      const newDups = nextDups.filter((d) => !edits.duplicates.some((x) => x.key === d.key));
      edits.elements = next.elements;
      edits.duplicates = nextDups;
      // The copies the step brings (a redo of ⌘D), remade now the originals are as the step leaves them, then the
      // edits saved on them and on the layers inside them.
      newDups.forEach((d) => {
        const clone = remakeDup(d, resolve(d.of));
        if (!clone) return;
        const e = edits.elements[d.key];
        if (e && e.html != null) applyWords(d.key, clone);
        if (e) applyEntry(d.key, clone);
      });
      if (newDups.length) Object.keys(edits.elements).forEach((sel) => {
        const e = edits.elements[sel];
        if (!e.inDup || (applied.get(sel) && applied.get(sel).isConnected)) return;
        const t = resolve(sel);
        if (!t) return;
        if (e.html != null) applyWords(sel, t);
        applyEntry(sel, t);
      });
      // Components after the layers' own edits, so an override taken off falls back to the component's value.
      forgetInstances();
      sourceCache = new WeakMap();
      const nextComps = next.components || {};
      // Each instance is written once, with every key that reaches it after the step (see paintComps), and the
      // code's own back for what a key set before it.
      const touched = new Map();
      new Set(Object.keys(edits.components).concat(Object.keys(nextComps))).forEach((name) => {
        const a = (edits.components[name] || { styles: {} }).styles;
        const b = (nextComps[name] || { styles: {} }).styles;
        const adjA = (edits.components[name] || {}).adjust;
        const adjB = (nextComps[name] || {}).adjust;
        if (JSON.stringify(adjA) !== JSON.stringify(adjB)) setToneFilter(toneId("component " + name), adjB || NO_ADJUST);
        instancesOf(name).forEach((t) => {
          appliedComp.add(t);
          const props = touched.get(t) || touched.set(t, new Set()).get(t);
          Object.keys(a).concat(Object.keys(b)).forEach((p) => props.add(p));
        });
      });
      touched.forEach((props, t) => paintComps(t, Array.from(props), nextComps, (next.elements[keyOf(t)] || { styles: {} }).styles));
      edits.components = nextComps;
      edits.overrides = next.overrides || [];
      edits.groups = next.groups;
      // A group's auto layout needs no relayout here: the moves that show it are element styles, put back above.
      edits.autoLayout = next.autoLayout || [];
      paintNewKeyframes(next.newKeyframes || {});
      edits.newKeyframes = next.newKeyframes || {};
      paintKeyframes(next.keyframes);
      edits.waapi = next.waapi || {};
      waapi.forEach(applyWaapi);
      edits.keyframes = next.keyframes;

      layers.forEach((l) => picker.closeFor(l));
      edits.page = next.page;
      if (next.page && next.pageView) edits.pageView = next.pageView;
      else delete edits.pageView;
      if (next.page && next.pageBase) edits.pageBase = next.pageBase;
      else delete edits.pageBase;
      if (next.page) {
        layers.splice(0, layers.length, ...next.page.map((l) => Object.assign({}, l)));
        paint();
      } else {
        livePage().style.backgroundColor = pageOwn.color;
        pageEl.style.backgroundImage = pageOwn.image;
        // Back to the page's own fill as it is now: the theme may have switched since it was read.
        pageOwn.layer = ownFill();
        layers.splice(0, layers.length, Object.assign({}, pageOwn.layer));
      }
      drawRows();

      guidePop.close();
      edits.guides.splice(0, edits.guides.length, ...next.guides);
      drawGuides();
      // A step back to a guide on the page's numbers, at a width with no grid now, sets it aside again.
      followPage();
      if (selection) selection.reshow();
    };

    // A single-page app moved to another page and called finetune() there: the last page's edits come off what's
    // left of it, and this page's (what Save kept for it) go on with a fresh history, its fill and its grid read
    // off this page, as a load of it would.
    switchPage = () => {
      finishTyping();
      if (selection) selection.selectLayers([]);
      closeStyles();
      closeSave();
      history.quiet++;
      applyEdits(blankRecord());
      Object.keys(originals).forEach((k) => delete originals[k]);
      // The last page's elements were its own.
      applied.clear();
      wordsHeld.clear();
      forgetInstances();
      sourceCache = new WeakMap();
      editsPath = location.pathname;
      const next = loadEdits();
      Object.keys(next).forEach((k) => { if (k !== "guides") edits[k] = next[k]; });
      guides.splice(0, guides.length, ...next.guides);
      restoreEdits();
      pageEl = pageCanvas();
      Object.assign(pageOwn, {
        layer: ownFill(),
        color: pageEl.style.backgroundColor,
        image: pageEl.style.backgroundImage,
      });
      layers.splice(0, layers.length, ...(edits.page ? edits.page.map((l) => Object.assign({}, l)) : [Object.assign({}, pageOwn.layer)]));
      if (edits.page) paint();
      drawRows();
      takePageGrid();
      drawGuides();
      history.quiet--;
      history.past = [];
      history.future = [];
      startHistory();
    };

    // Chosen first: it's empty while the page's sections show, and they hide while it's full, so either way
    // the last shown section is a last child (see the double-line rule in PANEL LOOK).
    // Figma's shortcuts for what finetune does too (same key, same action), shown in their buttons' tooltips: ⌥8 and
    // ⌥9 Design and Motion, ⌥⌘S Save, ⇧⌘E Copy changes, and in Design ⌥A ⌥H ⌥D ⌥W ⌥V ⌥S the alignments, ⌃⌥H ⌃⌥V
    // Distribute spacing and ⌃⌥T Tidy up, ⇧H and ⇧V the flips, ⇧⌘H
    // show or hide, 1 to 0 opacity (10% to 100%), and the arrows a nudge (Shift for 10). Undo, Redo, ⌘G, ⇧⌘G, ⇧A,
    // ⌥⇧A and ⌘\ are handled where those live. None fires while typing in a field or in words being edited.
    function flipLayer(t, across) {
      // At rest, as the panel's flips read it: a hover-scale or turn isn't the code's.
      const scale = resting(t, "scale");
      const sc = scale === "none" ? [1, 1] : scale.trim().split(/\s+/).map(parseFloat);
      const sx = across ? -sc[0] : sc[0];
      const sy = across ? (sc.length > 1 ? sc[1] : sc[0]) : -(sc.length > 1 ? sc[1] : sc[0]);
      const turn = turnOf(t, true);
      boxed(t);
      turnInPlace(t);
      setStyle(t, "scale", sx === 1 && sy === 1 ? "" : sx + " " + sy);
      // Mirrored on the canvas, as the panel's flips are: a turned layer's turn goes the other way too.
      if (Math.round(turn * 10) % 3600) setTurn(t, -turn);
    }
    const ALIGN_KEYS = { KeyA: "left", KeyH: "hcenter", KeyD: "right", KeyW: "top", KeyV: "vcenter", KeyS: "bottom" };
    // As the selection's keys: one acted on here goes no further than document.
    document.addEventListener("keydown", (e) => {
      const was = e.defaultPrevented;
      designKey(e);
      if (!was && e.defaultPrevented) e.stopPropagation();
    });
    function designKey(e) {
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
      // Distribute spacing and Tidy up (SPACING_ITEMS), on a plain selection in Design. Checked before the
      // alignments: only() leaves Control out, so on a Mac ⌃⌥H would otherwise align.
      const ctrlAlt = e.ctrlKey && e.altKey && !e.metaKey && !e.shiftKey;
      const spread = MAC ? ctrlAlt : e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey;
      const spaceHow = spread && e.code === "KeyH" ? "x" : spread && e.code === "KeyV" ? "y" : ctrlAlt && e.code === "KeyT" ? "tidy" : null;
      if (spaceHow) {
        if (root.getAttribute("data-tab") !== "design" || shownColumn || !Array.isArray(shown) || shownKind === "group") return;
        e.preventDefault();
        return spaceSelection(shown, spaceHow);
      }
      if (root.getAttribute("data-tab") === "design" && shownColumn && shown && only(false, true, false) && COLUMN_KEYS[e.code]) {
        e.preventDefault();
        return alignColumns(shownColumn.cols, Array.isArray(shown) ? shown : [shown], COLUMN_KEYS[e.code]);
      }
      // Figma's K, the Scale tool: on and off. V (the Move tool) leaves it too.
      if (root.getAttribute("data-tab") === "design" && only(false, false, false) && e.code === "KeyK") {
        e.preventDefault();
        if (scaleMode) return endScale();
        return shown ? startScale() : toast("Select a layer to scale");
      }
      if (scaleMode && only(false, false, false) && e.code === "KeyV") {
        e.preventDefault();
        return endScale();
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
    }

    designPane.append(chosen, page, guideSec, colTip);
    // Playback speed, for debugging, shown while an animation is selected: its layers play slower (or faster)
    // while she watches them, from 0.25× to 1.5×; the rest of the page keeps its own speed. It's only a way of viewing:
    // nothing is edited, saved or copied, and leaving Motion (or the selection) puts them back as they were. A replay,
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
    // The animations it changed, with the rate each had: the speed is a multiple of the page's own rate, and only
    // these go back, to that rate, so a page's own playback rates are left alone.
    const sped = new Map();
    const watched = () => (motionPane.hidden || !shown ? [] : Array.isArray(shown) ? shown : [shown]);
    let sweepAt = 100;
    function speedOne(x) {
      // A watched layer the page animates every frame: the calls that are over go back now, not on leaving (looked
      // at once the list doubles, so it costs little per call).
      if (sped.size > sweepAt) {
        sped.forEach((rate, a) => {
          if (a.playState !== "finished" && a.playState !== "idle") return;
          a.playbackRate = rate;
          sped.delete(a);
        });
        sweepAt = Math.max(100, sped.size * 2);
      }
      if (!sped.has(x)) sped.set(x, x.playbackRate);
      const rate = sped.get(x) * speed;
      if (x.playbackRate !== rate) x.playbackRate = rate;
    }
    function applySpeed() {
      const now = new Set();
      watched().forEach((t) => {
        t.getAnimations({ subtree: true }).forEach((x) => {
          if (x.effect && x.effect.target === t && !(x instanceof CSSTransition)) now.add(x);
        });
        waapiOf(t).forEach((en) => {
          const tg = en.targets.get(t);
          if (tg) now.add(tg.anim);
        });
      });
      sped.forEach((rate, x) => {
        if (now.has(x)) return;
        x.playbackRate = rate;
        sped.delete(x);
      });
      now.forEach(speedOne);
    }
    document.addEventListener("animationstart", (e) => {
      if (watched().includes(e.target)) applySpeed();
    }, true);
    // A new animate() call: only one on a watched layer is touched, so the page's calls stay as quick as without finetune.
    afterAnimate = (t, x) => {
      if (!sped.size && speed === 1 && !watchJs) return;
      if (watched().includes(t)) speedOne(x);
      if (watchJs) watchJs(t, x);
    };
    const speedLabel = el("div", "ft-speed-label", "Playback speed for debugging only");
    const speedRow = el("div", "ft-labeled");
    speedRow.append(speedLabel, speedSeg);
    speedSec.appendChild(speedRow);
    drawSpeed();
    speedSec.hidden = true;
    motionPane.append(motionChosen, animsSec, waitSec, motionTip);
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
    // After the panel, so the overlay hides with it (.ft-inspector[hidden] ~ .ft-guides).
    document.body.append(root, overlay);
    return root;
  }

  function finetune(opts) {
    opts = opts || {};
    // Display names for the Fonts popover, added to any an earlier call gave (they only label rows).
    if (opts.fontNames && typeof opts.fontNames === "object") Object.assign(fontNames, opts.fontNames);
    const id = String(opts.id || "finetune");
    const hotkey = String(opts.key || "d").toLowerCase();
    // A later call without a layout keeps the one declared; one with a layout hands it to a panel already built.
    if (opts.layout) {
      declaredGrid = readLayout(opts.layout);
      // On another page of a single-page app, the switch to it takes the grid up (see mount).
      if (declaredGrid && inspector && location.pathname === editsPath) adoptPageGrid();
    }
    const target = opts.target || ":root";
    const presets = opts.presets || {};
    const onChange = typeof opts.onChange === "function" ? opts.onChange : null;
    // Its own prefix, so an id like "theme" or "styles" can't write over finetune's own keys.
    const storeKey = "finetune:tuner:" + id;
    const oldKey = "finetune:" + id;

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
        let s = localStorage.getItem(storeKey);
        // Values kept before the prefix moved over once. Only a plain object is a tuner's: a theme string
        // or a styles array under the old key is finetune's own and stays where it is.
        if (s == null) {
          const old = localStorage.getItem(oldKey);
          const o = old == null ? null : JSON.parse(old);
          if (o && typeof o === "object" && !Array.isArray(o)) {
            s = old;
            localStorage.setItem(storeKey, old);
            localStorage.removeItem(oldKey);
          }
        }
        const raw = JSON.parse(s);
        return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
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
        // No min or max on the number: typing past the slider's ends is allowed. A text box, not type=number, so it
        // takes a sum as the inspector's fields do (60-4 is 56, see mathValue); ↑ and ↓ still step it.
        // No inputMode: a phone's full keyboard keeps the minus and the operators a sum needs.
        const num = el("input", "ft-num");
        num.type = "text";
        num.spellcheck = false;
        const dp = decimals(c.step);
        // Slider steps can land on float noise (0.30000000000000004); round to the step's precision.
        slider.addEventListener("input", () => set(k, Number(parseFloat(slider.value).toFixed(dp))));
        // Live as she types, a sum once it adds up. A sum left unfinished or refused (16-, 24+10%) goes back to the
        // value from before the typing on blur, as the inspector's fields do; so does Escape.
        let start = values[k];
        const back = () => { if (values[k] !== start) set(k, start); };
        num.addEventListener("focus", () => { start = values[k]; });
        num.addEventListener("input", () => {
          const v = parseFloat(mathValue(num.value));
          if (isNum(v)) set(k, v);
        });
        num.addEventListener("keydown", (e) => {
          if (e.key === "Enter") return num.blur();
          if (e.key === "Escape") {
            back();
            return num.blur();
          }
          const d = e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          // A preset can hand over a number as a string ("8").
          const base = Number(values[k]);
          if (!isNum(base)) return;
          set(k, Number((base + d * c.step).toFixed(dp)));
          num.value = values[k];
        });
        num.addEventListener("blur", () => {
          if (mathValue(num.value) === null) back();
          sync[k]();
        });
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
        // Labels never wrap (PANEL LOOK), so when the widest one is wider than a column at `cols`, the grid takes
        // fewer columns instead. Every chip keeps one width and one height, and the panel never scrolls sideways.
        // Measured, not guessed: the width depends on the font, which may still be loading.
        const fitCols = () => {
          if (!grid.isConnected) return document.fonts && document.fonts.removeEventListener("loadingdone", fitCols);
          const w = grid.clientWidth;
          if (!w) return; // hidden: the resize when it shows measures again
          let widest = 0;
          btns.forEach((b) => {
            b.style.width = "max-content";
            widest = Math.max(widest, b.offsetWidth);
            b.style.width = "";
          });
          const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
          let n = c.cols;
          while (n > 1 && n * widest + (n - 1) * gap > w) n--;
          grid.style.gridTemplateColumns = "repeat(" + n + ", minmax(0, 1fr))";
        };
        if (window.ResizeObserver) new ResizeObserver(fitCols).observe(grid);
        if (document.fonts) document.fonts.addEventListener("loadingdone", fitCols);
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

    // A tuner belongs to the page that declared it. In an app that changes pages without a reload, the script
    // (and this panel) outlive that page, so the panel stays hidden wherever its target isn't on the page.
    function here() {
      try {
        return !!document.querySelector(target);
      } catch (e) {
        return true;
      }
    }
    bindHideKey();

    keys.forEach((k) => sync[k]());

    function mount() {
      if (!document.getElementById(STYLE_ID)) {
        const style = el("style");
        style.id = STYLE_ID;
        style.textContent = PANEL_LOOK;
        document.head.appendChild(style);
        loadInter();
      }
      const first = !inspector;
      if (first) {
        inspector = makeInspector();
        toolbar = makeToolbar(hotkey, opts.help !== false);
        selection = makeSelection();
        // open: false starts it hidden, for a page where something else (a button, the hotkey) opens it.
        noteHotkey = hotkey;
        if (opts.open === false) showPanel(false);
        else if (opts.hotkeyNote !== false) hotkeyNote(hotkey);
      }
      // The controls panel: on the page when the call has controls (the inspector alone otherwise), shown and
      // hidden with the inspector (the hotkey, open: false).
      if (keys.length) {
        document.body.appendChild(panel);
        panel.hidden = inspector.hidden || !here();
      }
      apply();
      // After apply, so the page's own onChange doesn't write over a saved edit.
      if (first) {
        restoreEdits();
        // From here on, edits follow the elements React re-creates.
        watchPage();
        startHistory();
        afterReset();
      } else if (location.pathname !== editsPath) {
        // A grid declared by the last page was that page's; this one's call declares its own, or none.
        if (!opts.layout) declaredGrid = null;
        switchPage();
      }
    }
    // Called from <head>, the body isn't there yet; wait for it.
    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount, { once: true });

    live[id] = () => {
      document.removeEventListener("DOMContentLoaded", mount);
      panel.remove();
      delete live[id];
    };
    live[id].key = hotkey;
    live[id].refresh = () => {
      if (keys.length && inspector) panel.hidden = inspector.hidden || !here();
    };
  }

  // Shows or hides the inspector and toolbar together; no argument flips them.
  function showPanel(show) {
    if (!inspector) return;
    inspector.hidden = show === undefined ? !inspector.hidden : !show;
    toolbar.hidden = inspector.hidden;
    minimized = false;
    if (bare) setBare(false);
    if (inspector.hidden) document.documentElement.classList.remove("ft-dim");
    selection.sync();
    hideTip();
    drawUiButton();
    refreshPanels();
  }

  // finetune.toggle() for a page's own button; finetune.toggle(false) hides it, say when the page goes away.
  finetune.toggle = showPanel;
  // finetune.remove(id) takes a tuner's panel and hotkey off, for a page that goes away without a reload.
  finetune.remove = (id) => {
    if (live[id]) live[id]();
  };
  // finetune.reset() for a page's own Reset button: the same as the panel's.
  finetune.reset = resetEdits;
  // finetune.hotkeyNote() for a page that held the first-visit note back (hotkeyNote: false).
  finetune.hotkeyNote = () => hotkeyNote(noteHotkey);
  window.finetune = finetune;
})();
