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
.ft-inspector, .ft-toolbar {
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
.ft-tabs { display: flex; gap: 4px; padding: 12px 8px 8px 12px; border-bottom: 1px solid var(--ft-i-line); }
.ft-tabs-end { display: flex; margin-left: auto; }
.ft-icon-btn:disabled { opacity: 0.4; pointer-events: none; }
.ft-toast {
  position: fixed; left: 50%; bottom: 24px; z-index: 2147483647; transform: translateX(-50%);
  padding: 8px 12px; border-radius: 8px; background: #1E1E1E; color: #FFFFFF; pointer-events: none;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-toast[hidden] { display: none; }
.ft-tab { display: inline-flex; align-items: center; height: 24px; padding: 0 8px; border-radius: 5px; font-weight: 550; }
.ft-tab[aria-selected="true"] { background: var(--ft-i-field); }
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

.ft-pop {
  position: fixed; width: 240px; background: #FFFFFF; border-radius: 13px;
  box-shadow: 0 0 0.5px rgba(0, 0, 0, 0.15), 0 5px 12px rgba(0, 0, 0, 0.13), 0 1px 3px rgba(0, 0, 0, 0.1);
}
.ft-pop[hidden] { display: none; }
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
  position: fixed; z-index: 1; min-width: 104px; max-height: calc(100vh - 16px); overflow-y: auto; padding: 8px;
  background: #1E1E1E; color: #FFFFFF; border-radius: 13px;
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
.ft-caret { display: grid; place-items: center; width: 16px; height: 16px; color: var(--ft-i-text-2); }
.ft-caret svg { display: block; width: 10px; height: 10px; }

.ft-tip {
  position: fixed; z-index: 2147483647; pointer-events: none;
  padding: 4px 8px; border-radius: 5px; background: #1E1E1E; color: #FFFFFF;
  font: 450 11px/16px "Inter", system-ui, -apple-system, sans-serif; letter-spacing: 0.005em;
  white-space: nowrap; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ft-tip[hidden] { display: none; }
.ft-tip::before {
  content: ""; position: absolute; top: -4px; left: calc(var(--ft-caret, 50%) - 4px);
  border-style: solid; border-width: 0 4px 4px; border-color: transparent transparent #1E1E1E;
}
.ft-tip[data-side="right"]::before {
  top: calc(50% - 4px); left: -4px;
  border-width: 4px 4px 4px 0; border-color: transparent #1E1E1E transparent transparent;
}

.ft-toolbar {
  position: fixed; top: 12px; left: 12px; z-index: 2147483646;
  display: flex; flex-direction: column; gap: 8px; padding: 8px;
  background: var(--ft-i-bg); border: 1px solid var(--ft-i-border); border-radius: 999px;
  color: var(--ft-i-text); cursor: default; user-select: none;
}
.ft-toolbar[hidden] { display: none; }
.ft-toolbar, .ft-toolbar * { box-sizing: border-box; }
.ft-toolbar :where(button) { margin: 0; padding: 0; border: 0; background: none; color: inherit; outline: none; }
.ft-tool { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; }
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
.ft-num-input { flex: 1; min-width: 0; height: 24px; padding-left: 8px; }
.ft-field-icon + .ft-num-input { padding-left: 0; }
.ft-field-caret { display: grid; place-items: center; flex: none; width: 20px; height: 24px; color: var(--ft-i-text-2); }
.ft-field-caret svg { display: block; width: 10px; height: 10px; }
.ft-labeled { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.ft-field-label { color: var(--ft-i-text-2); }
.ft-type-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ft-seg { display: flex; height: 24px; border-radius: 5px; background: var(--ft-i-field); }
.ft-seg-btn { display: grid; place-items: center; flex: 1; height: 24px; border-radius: 5px; }
.ft-seg-btn:hover { background: var(--ft-i-hover); }
.ft-seg-btn[aria-pressed="true"] { background: #FFFFFF; box-shadow: inset 0 0 0 1px var(--ft-i-line); }
.ft-seg-btn svg { display: block; width: 16px; height: 16px; }
.ft-head-actions, .ft-btn-group { display: flex; }
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
.ft-img-preview::after {
  content: "Choose image"; position: absolute; inset: 0; display: grid; place-items: center;
  background: rgba(0, 0, 0, 0.4); color: #FFFFFF; opacity: 0; transition: opacity 120ms;
}
.ft-img-preview:hover::after { opacity: 1; }
.ft-adjust { display: grid; grid-template-columns: 76px 1fr; align-items: center; row-gap: 12px; }
.ft-adjust-label { color: var(--ft-i-text-2); }
.ft-adj-track {
  position: relative; height: 16px; border-radius: 8px; touch-action: none;
  background: var(--ft-i-field); box-shadow: inset 0 0 0 1px var(--ft-i-line);
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
.ft-handle {
  position: absolute; width: 7px; height: 7px; box-sizing: border-box;
  background: #FFFFFF; border: 1px solid #0D99FF;
}
.ft-nw { left: -4px; top: -4px; }
.ft-ne { right: -4px; top: -4px; }
.ft-sw { left: -4px; bottom: -4px; }
.ft-se { right: -4px; bottom: -4px; }
.ft-sel-box.is-editing .ft-handle { display: none; }
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

  // Phosphor icons (MIT), regular weight, inlined so the file stays dependency-free.
  const ICON = {
    angle: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M96,72a8,8,0,0,1,8-8A104.11,104.11,0,0,1,208,168a8,8,0,0,1-16,0,88.1,88.1,0,0,0-88-88A8,8,0,0,1,96,72ZM240,192H80V32a8,8,0,0,0-16,0V64H32a8,8,0,0,0,0,16H64V200a8,8,0,0,0,8,8H240a8,8,0,0,0,0-16Z"/></svg>',
    arrowClockwise: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/></svg>',
    flipVertical: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M56,120H216a16,16,0,0,0,6.23-30.74l-.14-.06-159.93-64A16,16,0,0,0,40,40v64A16,16,0,0,0,56,120Zm0-80,.15.06L216,104H56l0-64Zm160,96H56a16,16,0,0,0-16,16v64a16,16,0,0,0,22.15,14.78l159.93-64,.14-.06A16,16,0,0,0,216,136ZM56.15,215.93,56,216V152H216Z"/></svg>',
    drop: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118,16.53,13,72,60.75,72,118A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"/></svg>',
    checkerboard: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-12.69,88L136,60.69V48h12.69L208,107.32V120ZM136,83.31,172.69,120H136Zm72,1.38L171.31,48H208ZM120,48v72H48V48ZM107.31,208,48,148.69V136H60.69L120,195.31V208ZM120,172.69,83.31,136H120Zm-72-1.38L84.69,208H48ZM208,208H136V136h72v72Z"/></svg>',
    frameCorners: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,80v32a8,8,0,0,1-16,0V88H160a8,8,0,0,1,0-16h32A8,8,0,0,1,200,80ZM96,168H72V144a8,8,0,0,0-16,0v32a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16ZM232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,200V56H40V200H216Z"/></svg>',
    linkSimple: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z"/></svg>',
    copy: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"/></svg>',
    arrowCounterClockwise: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"/></svg>',
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
    cursor: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M168,132.69,214.08,115l.33-.13A16,16,0,0,0,213,85.07L52.92,32.8A15.95,15.95,0,0,0,32.8,52.92L85.07,213a15.82,15.82,0,0,0,14.41,11l.78,0a15.84,15.84,0,0,0,14.61-9.59l.13-.33L132.69,168,184,219.31a16,16,0,0,0,22.63,0l12.68-12.68a16,16,0,0,0,0-22.63ZM195.31,208,144,156.69a16,16,0,0,0-26,4.93c0,.11-.09.22-.13.32l-17.65,46L48,48l159.85,52.2-45.95,17.64-.32.13a16,16,0,0,0-4.93,26h0L208,195.31Z"/></svg>',
    square: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Z"/></svg>',
    penNib: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z"/></svg>',
    plus: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/></svg>',
    eye: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/></svg>',
    x: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/></svg>',
    eyedropper: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,67.3a35.79,35.79,0,0,0-11.26-25.66c-14-13.28-36.72-12.78-50.62,1.13L142.8,62.2a24,24,0,0,0-33.14.77l-9,9a16,16,0,0,0,0,22.64l2,2.06-51,51a39.75,39.75,0,0,0-10.53,38l-8,18.41A13.68,13.68,0,0,0,36,219.3a15.92,15.92,0,0,0,17.71,3.35L71.23,215a39.89,39.89,0,0,0,37.06-10.75l51-51,2.06,2.06a16,16,0,0,0,22.62,0l9-9a24,24,0,0,0,.74-33.18l19.75-19.87A35.75,35.75,0,0,0,224,67.3ZM97,193a24,24,0,0,1-24,6,8,8,0,0,0-5.55.31l-18.1,7.91L57,189.41a8,8,0,0,0,.25-5.75A23.88,23.88,0,0,1,63,159l51-51,33.94,34ZM202.13,82l-25.37,25.52a8,8,0,0,0,0,11.3l4.89,4.89a8,8,0,0,1,0,11.32l-9,9L112,83.26l9-9a8,8,0,0,1,11.31,0l4.89,4.89a8,8,0,0,0,11.33,0l24.94-25.09c7.81-7.82,20.5-8.18,28.29-.81a20,20,0,0,1,.39,28.7Z"/></svg>',
    caretDown: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>',
    minus: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"/></svg>',
    eyeClosed: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M228,175a8,8,0,0,1-10.92-3l-19-33.2A123.23,123.23,0,0,1,162,155.46l5.87,35.22a8,8,0,0,1-6.58,9.21A8.4,8.4,0,0,1,160,200a8,8,0,0,1-7.88-6.69l-5.77-34.58a133.06,133.06,0,0,1-36.68,0l-5.77,34.58A8,8,0,0,1,96,200a8.4,8.4,0,0,1-1.32-.11,8,8,0,0,1-6.58-9.21L94,155.46a123.23,123.23,0,0,1-36.06-16.69L39,172A8,8,0,1,1,25.06,164l20-35a153.47,153.47,0,0,1-19.3-20A8,8,0,1,1,38.22,99c16.6,20.54,45.64,45,89.78,45s73.18-24.49,89.78-45A8,8,0,1,1,230.22,109a153.47,153.47,0,0,1-19.3,20l20,35A8,8,0,0,1,228,175Z"/></svg>',
  };
  // Phosphor has no horizontal flip in this set; it is the vertical one turned a quarter.
  ICON.flipHorizontal = ICON.flipVertical.replace("<svg ", "<svg style=\"transform: rotate(90deg)\" ");


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
  function fillRow(layer, onChange, onRemove, picker) {
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
    const eye = iconButton(ICON.eye, "Hide fill", () => {
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
      const tip = layer.visible ? "Hide fill" : "Show fill";
      eye.setAttribute("data-ft-tip", tip);
      eye.setAttribute("aria-label", tip);
    }

    hex.addEventListener("blur", () => {
      const v = parseHex(hex.value);
      if (v) {
        layer.hex = v;
        onChange();
      }
      draw(true);
    });
    alpha.addEventListener("blur", () => {
      const v = parseFloat(alpha.value);
      if (isNum(v)) {
        layer.opacity = Math.min(100, Math.max(0, Math.round(v)));
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
      const minus = iconButton(ICON.minus, "Remove fill", () => onRemove(layer, row));
      minus.classList.add("ft-fill-remove");
      actions.append(minus);
    }
    actions.append(eye);
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
      commit(input.value);
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

    const pop = el("div", "ft-pop");
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
  let tool = "Move";
  // Set by the inspector: shows a selected element's sections, or the page when given null.
  let showInPanel = () => {};
  // Set by the inspector: redraws the selection's numbers after the element changes size.
  let refreshPanel = () => {};

  // Left toolbar, after pen.dev's. Move selects and edits what's on the page;
  // Rectangle and Pen are placeholders: picking one only selects it.
  function makeToolbar() {
    const bar = el("div", "ft-toolbar");
    const tools = [["cursor", "Move"], ["square", "Rectangle"], ["penNib", "Pen"]].map(([icon, name], i) => {
      const b = button("ft-tool", null, () => {
        tools.forEach((t) => t.setAttribute("aria-pressed", String(t === b)));
        tool = name;
        if (selection) selection.sync();
      });
      b.innerHTML = ICON[icon];
      b.setAttribute("aria-label", name);
      b.setAttribute("aria-pressed", String(i === 0));
      b.setAttribute("data-ft-tip", name);
      b.setAttribute("data-ft-tip-side", "right");
      withTip(b);
      return b;
    });
    bar.append(...tools);
    document.body.appendChild(bar);
    return bar;
  }

  // Text means an element with words of its own, not just inside its children.
  const hasText = (e) => Array.from(e.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim());
  // [data-finetune-ui] marks a page's own controls (its nav, its buttons): never selected, and they keep
  // working while the Move tool is on.
  const isUi = (t) => !t || !t.closest || !!t.closest(".ft-inspector, .ft-toolbar, .ft-tip, .ft-toast, [data-finetune-ui]");

  // Every edit made in the panel, kept per page in localStorage so a reload puts it back,
  // and copied out as a list for the bake skill to write into the code. Never written to disk.
  // Figma's image adjustments, -100 to 100 each; zero is untouched.
  const NO_ADJUST = { exposure: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0 };
  const EDITS_KEY = "finetune:edits:" + location.pathname;
  let edits = loadEdits();
  let editsChanged = () => {};

  // Anything stored in a shape this file no longer writes is dropped, not trusted.
  function loadEdits() {
    const out = { page: null, elements: {} };
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
        if (e.src && typeof e.src.name === "string" && /^data:image\//.test(e.src.data)) {
          entry.src = { name: e.src.name, data: e.src.data };
        }
        out.elements[sel] = entry;
      });
    }
    return out;
  }

  // Saved a beat after the last change, so dragging a slider doesn't write on every frame.
  // A reload inside that beat still saves, on pagehide; Reset turns saving off first.
  let saveTimer = 0;
  let saving = true;
  function writeEdits() {
    clearTimeout(saveTimer);
    if (!saving) return;
    try {
      localStorage.setItem(EDITS_KEY, JSON.stringify(edits));
    } catch (e) {
      // Storage blocked or full (a large swapped-in image): edits still show, they just won't survive a reload.
    }
  }
  window.addEventListener("pagehide", writeEdits);

  function saveEdits() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(writeEdits, 150);
    editsChanged();
  }

  const editCount = () => Object.keys(edits.elements).length + (edits.page ? 1 : 0);

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

  function record(target, change) {
    const sel = selectorFor(target);
    const entry = edits.elements[sel] || { styles: {} };
    change(entry);
    if (Object.keys(entry.styles).length || entry.html != null || entry.adjust || entry.src) edits.elements[sel] = entry;
    else delete edits.elements[sel];
    saveEdits();
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
    const id = toneId(selectorFor(target));
    setToneFilter(id, a);
    setStyle(target, "filter", adjustFilter(id, a));
    record(target, (entry) => {
      if (Object.keys(a).some((k) => a[k])) entry.adjust = Object.assign({}, a);
      else delete entry.adjust;
    });
  }

  // Every style the panel changes goes through here, so it shows live and is remembered.
  function setStyle(target, prop, value) {
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
      if (entry.html != null) t.innerHTML = entry.html;
      if (entry.src) {
        t.removeAttribute("srcset");
        t.src = entry.src.data;
      }
      if (entry.adjust) setToneFilter(toneId(sel), entry.adjust);
      Object.keys(entry.styles).forEach((p) => t.style.setProperty(p, entry.styles[p]));
    });
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
    if (edits.page) lines.push(["page", "background: " + pageBackground(edits.page)]);
    Object.keys(edits.elements).forEach((sel) => {
      const e = edits.elements[sel];
      const parts = Object.keys(e.styles).map((p) => p + ": " + e.styles[p]);
      if (e.html != null) parts.push("text: " + e.html);
      if (e.src) parts.push('src: new image "' + e.src.name + '", chosen from her computer');
      lines.push([sel, parts.join("; ")]);
      // The SVG filter its url() points at, for the bake to put in the page.
      if (e.adjust && hasTone(e.adjust)) lines.push([sel + " svg", toneMarkup(toneId(sel), e.adjust)]);
    });
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
    hoverBox.hidden = true;
    selBox.hidden = true;
    document.body.append(hoverBox, selBox);
    let selected = null;
    let editing = null;
    let before = "";

    const active = () => tool === "Move" && !!inspector && !inspector.hidden;
    const pickable = (t) => (t && t !== document.body && t !== document.documentElement && !isUi(t) ? t : null);

    function frame(b, t) {
      const r = t.getBoundingClientRect();
      b.style.left = r.left + "px";
      b.style.top = r.top + "px";
      b.style.width = r.width + "px";
      b.style.height = r.height + "px";
    }

    function place() {
      if (!selected) return;
      frame(selBox, selected);
      // offsetWidth is the size before any rotation, as Figma shows it; SVG elements have none.
      const r = selected.getBoundingClientRect();
      const w = selected.offsetWidth != null ? selected.offsetWidth : r.width;
      const h = selected.offsetHeight != null ? selected.offsetHeight : r.height;
      sizeLabel.textContent = Math.round(w) + " × " + Math.round(h);
    }
    function moved() {
      place();
      refreshPanel();
    }
    const sizes = new ResizeObserver(moved);

    function select(t) {
      if (t === selected) return;
      stopEditing();
      if (selected) sizes.unobserve(selected);
      selected = t;
      selBox.hidden = !t;
      hoverBox.hidden = true;
      if (t) {
        sizes.observe(t);
        place();
      }
      showInPanel(t);
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
      if (t.innerHTML !== before) record(t, (entry) => { entry.html = t.innerHTML; });
    }

    document.addEventListener("pointermove", (e) => {
      const t = active() && !editing ? pickable(e.target) : null;
      hoverBox.hidden = !t || t === selected;
      if (!hoverBox.hidden) frame(hoverBox, t);
    }, { passive: true });

    // mousedown, not pointerdown: preventing it is what stops the page starting a text selection.
    document.addEventListener("mousedown", (e) => {
      if (!active() || e.button !== 0 || isUi(e.target)) return;
      if (editing && editing.contains(e.target)) return;
      e.preventDefault();
      select(pickable(e.target));
    }, true);

    // While Move is on, the page's own links and buttons don't fire.
    document.addEventListener("click", (e) => {
      if (!active() || isUi(e.target) || (editing && editing.contains(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);

    document.addEventListener("dblclick", (e) => {
      if (!active() || editing || isUi(e.target)) return;
      const t = pickable(e.target);
      if (!t || !hasText(t)) return;
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
      if (!selected || typing(e.target)) return;
      if (e.key === "Escape") select(null);
      else if (e.key === "Enter" && hasText(selected)) {
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
        select(null);
      }
    }
    sync();

    return { sync, refresh: place };
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
  function makeMenu(root) {
    const menu = el("div", "ft-menu");
    menu.hidden = true;
    root.appendChild(menu);
    let anchor = null;

    function close() {
      menu.hidden = true;
      anchor = null;
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
      toggle(btn, items, current, onPick) {
        if (anchor === btn) return close();
        anchor = btn;
        menu.textContent = "";
        items.forEach((it) => {
          const item = button("ft-menu-item", null, () => {
            close();
            onPick(it.value);
          });
          const check = el("span", "ft-menu-check");
          if (same(it.value, current)) check.innerHTML = ICON.check;
          item.append(check, el("span", null, it.label));
          menu.appendChild(item);
        });
        menu.hidden = false;
        const r = btn.getBoundingClientRect();
        const i = Math.max(0, items.findIndex((it) => same(it.value, current)));
        // Kept on screen: a button near the right edge opens its menu leftward.
        menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 8)) + "px";
        menu.style.top = Math.max(8, Math.min(r.top - 8 - i * 24, window.innerHeight - menu.offsetHeight - 8)) + "px";
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
      else i.textContent = icon;
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
    head.append(el("span", null, "Image"), iconButton(ICON.x, "Close", close));

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
    const previewImg = el("img");
    previewImg.alt = "";
    preview.appendChild(previewImg);
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
        t.removeAttribute("srcset");
        t.src = String(reader.result);
        record(t, (entry) => { entry.src = { name: f.name, data: String(reader.result) }; });
        draw();
        onChange();
      };
      reader.readAsDataURL(f);
    });

    const sliders = el("div", "ft-adjust");
    const knobs = {};
    ADJUSTMENTS.forEach(([key, label]) => {
      const track = el("div", "ft-adj-track");
      const knob = el("div", "ft-adj-knob");
      track.appendChild(knob);
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
      knobs[key] = knob;
      sliders.append(el("span", "ft-adjust-label", label), track);
    });

    const body = el("div", "ft-pop-body");
    body.append(mode.btn, preview, sliders);
    pop.append(head, body, file);
    root.appendChild(pop);

    function draw() {
      if (!target) return;
      previewImg.src = target.currentSrc || target.src;
      mode.label.textContent = fitLabel(getComputedStyle(target).objectFit);
      ADJUSTMENTS.forEach(([key]) => knobs[key].style.setProperty("--ft-x", (adjust[key] + 100) / 200));
    }

    function open(t, row, thumb) {
      target = t;
      anchor = thumb;
      adjust = adjustOf(t);
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

  function makeInspector() {
    // Shown on load, like Figma's panel.
    const root = el("div", "ft-inspector");

    const tabs = el("div", "ft-tabs");
    const design = el("div", "ft-tab", "Design");
    design.setAttribute("aria-selected", "true");
    // Copy changes: the list the bake skill reads. Reset: forget them and reload the page as written.
    const copyBtn = iconButton(ICON.copy, "Copy changes", () => {
      const n = editCount();
      copyText(changesText()).then((ok) => {
        toast(ok ? "Copied " + n + (n === 1 ? " change" : " changes") + ". Paste into Claude Code and say bake." : "Couldn't reach the clipboard");
      });
    });
    const resetBtn = iconButton(ICON.arrowCounterClockwise, "Reset changes", () => {
      saving = false;
      try {
        localStorage.removeItem(EDITS_KEY);
      } catch (e) {
        // Nothing stored to clear.
      }
      location.reload();
    });
    const tabActions = el("div", "ft-tabs-end");
    tabActions.append(copyBtn, resetBtn);
    tabs.append(design, tabActions);
    editsChanged = () => {
      copyBtn.disabled = resetBtn.disabled = !editCount();
    };
    editsChanged();

    // A page fill saved from an earlier visit comes back; the bottom layer is the base.
    const layers = edits.page ? edits.page.map((l) => Object.assign({}, l)) : [
      toFill(getComputedStyle(document.body).backgroundColor)
        || toFill(getComputedStyle(document.documentElement).backgroundColor)
        || { hex: "FFFFFF", opacity: 100, visible: true },
    ];
    const base = layers[layers.length - 1];
    const picker = makePicker(root);

    // Fills stack like Figma's: the top row paints on top.
    function paint() {
      const shown = layers.filter((l) => l.visible).map((l) => "linear-gradient(" + rgba(l) + ", " + rgba(l) + ")");
      document.body.style.backgroundColor = "transparent";
      document.body.style.backgroundImage = shown.length ? shown.join(", ") : "none";
      picker.sync();
    }

    function paintAndSave() {
      paint();
      edits.page = layers.map((l) => Object.assign({}, l));
      saveEdits();
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
    layers.forEach((l) => list.appendChild(fillRow(l, paintAndSave, l === base ? null : remove, picker)));
    if (edits.page) paint();
    page.append(head, list);

    const menu = makeMenu(root);
    const imagePop = makeImagePop(root, menu, () => changed(false));
    let fillLayers = [];
    const chosen = el("div");
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
      const moveBy = (dx, dy) => {
        const t = nums(target.style.translate);
        const tx = Math.round(((t[0] || 0) + dx) * 10) / 10;
        const ty = Math.round(((t[1] || 0) + dy) * 10) / 10;
        setStyle(target, "translate", tx || ty ? tx + "px " + ty + "px" : "");
      };
      const setRot = (deg) => {
        const d = Math.round((((deg % 360) + 360) % 360) * 10) / 10;
        setStyle(target, "rotate", d ? d + "deg" : "");
      };
      const setScale = (sx, sy) => setStyle(target, "scale", sx === 1 && sy === 1 ? "" : sx + " " + sy);

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
      const turns = el("div", "ft-btn-group");
      turns.append(
        iconButton(ICON.arrowClockwise, "Rotate 90° right", () => {
          setRot(read().rot + 90);
          changed(true);
        }),
        iconButton(ICON.flipHorizontal, "Flip horizontal", () => {
          const now = read();
          setScale(-now.sx, now.sy);
          changed(true);
        }),
        iconButton(ICON.flipVertical, "Flip vertical", () => {
          const now = read();
          setScale(now.sx, -now.sy);
          changed(true);
        })
      );

      const xy = el("div", "ft-type-pair");
      xy.append(x.wrap, y.wrap);
      const rotRow = el("div", "ft-type-pair");
      rotRow.append(rot.wrap, turns);
      const grid = el("div", "ft-type");
      grid.append(labeled("Position", xy, true), labeled("Rotation", rotRow, true));
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        x.set(now.x, force);
        y.set(now.y, force);
        rot.set(Math.round(now.rot * 10) / 10 + "°", force);
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
      const read = () => {
        const cs = getComputedStyle(target);
        return {
          hidden: cs.visibility === "hidden",
          blend: cs.mixBlendMode,
          opacity: Math.round(parseFloat(cs.opacity) * 100),
          radius: Math.round(parseFloat(cs.borderTopLeftRadius) || 0),
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
      s.firstChild.appendChild(actions);

      const opacity = numField(ICON.checkerboard, "Opacity");
      const radius = numField(ICON.frameCorners, "Corner radius");
      editable(opacity.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n)) setOpacity(target, n);
      });
      editable(radius.input, changed, (v) => {
        const n = parseFloat(v);
        if (isNum(n) && n >= 0) setStyle(target, "border-radius", n + "px");
      });
      const grid = el("div", "ft-type");
      grid.append(labeled("Opacity", opacity.wrap), labeled("Corner radius", radius.wrap));
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        eye.innerHTML = now.hidden ? ICON.eyeClosed : ICON.eye;
        eye.setAttribute("data-ft-tip", now.hidden ? "Show" : "Hide");
        eye.setAttribute("aria-label", now.hidden ? "Show" : "Hide");
        blend.setAttribute("aria-pressed", String(now.blend !== "normal"));
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

    // Layout, as in Figma: Resizing (text only) and Dimensions, labelled W and H, with the
    // lock that keeps proportions (on for images, as in Figma).
    // Edits go on the element as inline styles, so they show live.
    function layout(target) {
      const s = section("Layout");
      let locked = target.tagName === "IMG";
      const read = () => {
        // The size before any rotation, as Figma shows it; SVG elements have no offset size.
        const r = target.getBoundingClientRect();
        return {
          w: Math.round(target.offsetWidth != null ? target.offsetWidth : r.width),
          h: Math.round(target.offsetHeight != null ? target.offsetHeight : r.height),
          resizing: target.style.width === "max-content" ? "hug" : target.style.height ? "fixed" : "auto",
        };
      };
      const resizing = segmented([
        ["hug", "arrowLineRight", "Auto width"],
        ["auto", "textAlignJustify", "Auto height"],
        ["fixed", "article", "Fixed size"],
      ], (v) => {
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
        setStyle(target, "width", n + "px");
        if (locked && now.w) setStyle(target, "height", Math.round((n * now.h) / now.w) + "px");
      });
      editable(h.input, changed, (v) => {
        const n = parseFloat(v);
        if (!isNum(n) || n < 0) return;
        const now = read();
        setStyle(target, "height", n + "px");
        if (locked && now.h) setStyle(target, "width", Math.round((n * now.w) / now.h) + "px");
      });
      const lock = iconButton(ICON.linkSimple, "Constrain proportions", () => {
        locked = !locked;
        changed(true);
      });

      const dims = el("div", "ft-type-pair");
      dims.append(w.wrap, h.wrap);
      const dimsRow = el("div", "ft-with-action");
      dimsRow.append(dims, lock);
      const grid = el("div", "ft-type");
      if (hasText(target)) grid.appendChild(labeled("Resizing", resizing.seg, true));
      grid.appendChild(labeled("Dimensions", dimsRow, true));
      s.appendChild(grid);
      draws.push((force) => {
        const now = read();
        resizing.set(now.resizing);
        w.set(now.w, force);
        h.set(now.h, force);
        lock.setAttribute("aria-pressed", String(locked));
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
          align: { start: "left", left: "left", center: "center", end: "right", right: "right" }[cs.textAlign] || "",
          // Figma's vertical alignment maps to align-content, which block elements honor in current browsers.
          valign: { start: "top", "flex-start": "top", normal: "top", center: "middle", end: "bottom", "flex-end": "bottom" }[cs.alignContent] || "",
        };
      };

      const family = dropdown((btn) => {
        const now = read();
        menu.toggle(btn, pageFamilies(now.family).map((f) => ({ label: f, value: f })), now.family, (f) => {
          setStyle(target, "font-family", '"' + f + '"');
          // Keep the weight if the new family has it; otherwise the nearest one it does.
          const ws = familyWeights(f);
          if (!ws.includes(now.weight)) {
            setStyle(target, "font-weight", String(ws.reduce((a, b) => (Math.abs(b - now.weight) < Math.abs(a - now.weight) ? b : a))));
          }
          changed(true);
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
      ], (v) => setStyle(target, "text-align", v));
      const valign = segmented([
        ["top", "arrowLineUp", "Align top"],
        ["middle", "arrowsInLineVertical", "Align middle"],
        ["bottom", "arrowLineDown", "Align bottom"],
      ], (v) => setStyle(target, "align-content", { top: "start", middle: "center", bottom: "end" }[v]));

      function draw(force) {
        const now = read();
        family.label.textContent = now.family;
        weight.label.textContent = WEIGHT_NAMES[now.weight] || String(now.weight);
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
      alignRow.append(align.seg, valign.seg);

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
      textLayer = toFill(getComputedStyle(target).color) || { hex: "000000", opacity: 100, visible: true };
      const layer = textLayer;
      const list = el("div", "ft-fills");
      list.appendChild(fillRow(layer, () => {
        setStyle(target, "color", layer.visible ? rgba(layer) : "transparent");
        picker.sync();
      }, null, picker));
      s.appendChild(list);
      return s;
    }

    // Figma's order: Position, Layout, Appearance, then Typography and the text's Fill for
    // text, the image's Fill for an img, the background Fill for anything else.
    showInPanel = (target) => {
      menu.close();
      imagePop.close();
      if (textLayer) picker.closeFor(textLayer);
      fillLayers.forEach((l) => picker.closeFor(l));
      textLayer = null;
      fillLayers = [];
      draws = [];
      chosen.textContent = "";
      page.hidden = !!target;
      if (!target) return;
      chosen.append(position(target), layout(target), appearance(target));
      if (hasText(target)) chosen.append(typography(target), textFill(target));
      else if (target.tagName === "IMG") chosen.appendChild(imageFill(target));
      else chosen.appendChild(boxFill(target));
      changed(true);
    };

    root.append(tabs, page, chosen);
    document.body.appendChild(root);
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
      showPanel();
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
        toolbar = makeToolbar();
        selection = makeSelection();
        // open: false starts it hidden, for a page where something else (a button, the hotkey) opens it.
        if (opts.open === false) showPanel(false);
      }
      // The controls panel stays off the page for now; the inspector is built up one piece at a time.
      apply();
      // After apply, so the page's own onChange doesn't write over a saved edit.
      if (first) restoreEdits();
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
    selection.sync();
    hideTip();
  }

  // finetune.toggle() for a page's own button; finetune.toggle(false) hides it, say when the page goes away.
  finetune.toggle = showPanel;
  window.finetune = finetune;
})();
