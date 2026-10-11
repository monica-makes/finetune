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
     Placeholder. Kept plain until the real panel design lands; that design
     replaces this block and nothing else in the file.
     ========================================================================== */
  const PANEL_LOOK = `
.ft-panel {
  position: fixed; top: 16px; right: 16px; z-index: 2147483647;
  width: 280px; max-height: calc(100vh - 32px); overflow: auto;
  background: #1c1c1c; color: #e8e8e8;
  border: 1px solid #3a3a3a; border-radius: 8px;
  font: 12px/1.4 system-ui, -apple-system, sans-serif;
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
  resize: vertical; font-family: ui-monospace, Menlo, monospace;
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
      panel.hidden = !panel.hidden;
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
      document.body.appendChild(panel);
      apply();
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

  window.finetune = finetune;
})();
