# finetune guide

A reference for people using finetune: how to use it, and what every control, button, key and term means.

## What finetune is

finetune puts a Figma-style Design panel on your live web page. You select things on the page, change them in the panel, and see each change on the page as you make it. When it looks right, you copy a list of your changes and Claude Code writes them into your code.

The loop is **select, edit, Copy, bake**:

1. **Select** a layer on the page, as you would on a Figma canvas.
2. **Edit** it in the panel. The page is the preview.
3. **Copy** the list of every change (the toolbar's Copy, or ⇧⌘E).
4. **Bake**: paste the list into Claude Code. It writes each change where it lives in your code, then lists every file and line it touched.

After a bake, press **Reset**. The page reloads as the code now writes it, so you see the baked result.

finetune only edits what is already on the page. Every edit is plain CSS on that element, which is why it bakes cleanly.

## Getting started

Add the script and one call to the page:

```html
<script src="https://cdn.jsdelivr.net/gh/monica-makes/finetune@main/src/finetune.js"></script>
<script>
  finetune({ id: "home" });
</script>
```

The call can sit in `<head>` or at the end of `<body>`. It mounts as soon as the page has a body. It also works on a file opened straight from Finder, with no server.

- **Open the page** and the panel shows: the toolbar on the left, the Design panel on the right, and the Design / Motion bar at the bottom.
- **The first time**, a tip in the middle of the window says "Press D to toggle overlays off and on". It shows once per browser.
- **Hide it** with **D** (the default hotkey) or ⌘\ (Ctrl+\ on Windows). This is **Hide UI**: the panel, toolbar, bar, grid and selection outline go, and only the Hide UI button stays, in a small box, so you can bring them back. Your selection is kept.
- **Start hidden** with `finetune({ id: "home", open: false })`. Then the hotkey or a button on your page (calling `finetune.toggle()`) opens it.
- **Change the hotkey** with the `key` option, for example `key: "f"`.

Two things for an app:

- In an app that changes pages without a reload (Next.js, React Router), call `finetune.remove(id)` and `finetune.toggle(false)` when the page goes away.
- Put `data-finetune-ui` on your page's own controls (its nav, its buttons). finetune never selects them, and they keep working while it's open. Don't put it on content you want to edit.

The panel is set in Inter. If your page doesn't load Inter, finetune loads it from Google Fonts while it's open. Nothing else on your page changes.

**Theme.** The panel follows your system's light or dark setting. ⌥⌘T (Ctrl+Alt+T on Windows) flips it. The flip is kept in this browser. Flipping back to the system's theme goes back to following the system.

## Keyboard shortcuts

None of these fire while you type in a field or edit words on the page. Most are Figma's own keys. In the table, Windows uses Ctrl for ⌘, Alt for ⌥ and Shift for ⇧ unless a different key is shown.

### Everywhere

| Action | Mac | Windows |
| --- | --- | --- |
| Hide UI (show or hide the panel and overlays) | D (the `key` option), ⌘\ or ⇧⌘\ | D, Ctrl+\ or Ctrl+Shift+\ |
| Hide the panels, keep editing | E | E |
| Dim the panels so you can see and click through them | T | T |
| Flip the panel's theme | ⌥⌘T | Ctrl+Alt+T |
| Design tab | ⌥8 | Alt+8 |
| Motion tab | ⌥9 | Alt+9 |
| Undo | ⌘Z | Ctrl+Z |
| Redo | ⇧⌘Z | Ctrl+Shift+Z |
| Save | ⌥⌘S | Ctrl+Alt+S |
| Copy changes | ⇧⌘E | Ctrl+Shift+E |
| Show or hide the layout grid | ⌃G | Ctrl+Shift+4 |

### Selecting and moving (Design)

| Action | Mac | Windows |
| --- | --- | --- |
| Select | click | click |
| Add to or take from the selection | Shift-click | Shift-click |
| Select the deepest layer under the pointer | ⌘-click | Ctrl-click |
| Pick the column under the pointer | ⌥-click | Alt-click |
| Add or remove a column | ⇧⌥-click | Shift+Alt-click |
| Layer list under the pointer | right-click | right-click |
| Go one level in (on words: edit them) | double-click | double-click |
| Step back out a level, or deselect | Escape | Escape |
| Select the children (on text: edit the words) | Enter | Enter |
| Select the parent | Shift+Enter or \ | Shift+Enter or \ |
| Next / previous layer at the same level | Tab / Shift+Tab | Tab / Shift+Tab |
| Nudge 1px / 10px | arrow keys / Shift+arrow keys | same |

### Editing (Design, with a selection)

| Action | Mac | Windows |
| --- | --- | --- |
| Group | ⌘G | Ctrl+G |
| Ungroup | ⇧⌘G | Ctrl+Shift+G |
| Duplicate | ⌘D | Ctrl+D |
| Delete | Delete or Backspace | Delete or Backspace |
| Show or hide | ⇧⌘H | Ctrl+Shift+H |
| Opacity 10% to 100% | 1 to 9, 0 | 1 to 9, 0 |
| Align left / horizontal centers / right | ⌥A / ⌥H / ⌥D | Alt+A / Alt+H / Alt+D |
| Align top / vertical centers / bottom | ⌥W / ⌥V / ⌥S | Alt+W / Alt+V / Alt+S |
| Distribute horizontal spacing | ⌃⌥H | Alt+Shift+H |
| Distribute vertical spacing | ⌃⌥V | Alt+Shift+V |
| Tidy up | ⌃⌥T | Ctrl+Alt+T |
| Flip horizontal / vertical | ⇧H / ⇧V | Shift+H / Shift+V |
| Add auto layout | ⇧A | Shift+A |
| Remove auto layout | ⌥⇧A | Alt+Shift+A |
| Scale tool on and off | K | K |
| Leave the Scale tool | V | V |

Notes:

- ⌘D is only taken while layers are selected, so the browser's bookmark key works otherwise.
- With columns picked, ⌥A, ⌥H and ⌥D line the layers up with the columns instead.
- Distribute and Tidy up work on several layers that aren't one ⌘G group.
- If your Hide UI key is `t` or `e`, that key keeps its Hide UI job and T or E don't dim or hide the panels.
- Each button's tooltip shows its key.

## The toolbar and the panel's top row

### Toolbar (left rail)

Icons only. Hover one to see its name and key. None stays pressed: they're actions.

| Button | What it does |
| --- | --- |
| **ft mark** | Opens the finetune repo in a new tab ("View the repo"). |
| **Copy** | "Copy changes and prompt". Copies the list of every change on screen, saved or not, ready to paste into Claude Code. See [Copy and bake](#copy-and-bake). |
| **Save** | "Save changes in this browser". Keeps your edits in this browser so they survive a reload. Never touches your code. |
| **Reset** | "Reset to the code's last presets". Forgets every edit, saved or not, and reloads the page as the code writes it. Greyed out when there's nothing to reset. |

### Panel's top row

| Control | What it does |
| --- | --- |
| **Undo** and **Redo** (left) | Step back and forward through your edits. Greyed out when there's nothing to step to. |
| **Hide UI** (right) | Hides the panel, toolbar, bar, grid and selection outline. It stays in place as a small box; press it to bring everything back. |

The top row stays put when the panel scrolls.

### Design / Motion bar (bottom)

Two tabs. **Design** (blue) is the Design panel. **Motion** (pink) tunes animations. The chosen one is filled with its colour. The bar hides with the panel.

### T and E

- **T** dims the panel, toolbar, Hide UI and any tuner panel to 20% and lets clicks through them, so you can see and pick what they cover. T again brings them back.
- **E** hides the panels completely while selecting, dragging, resizing, retyping, every shortcut, the outline and the grid keep working. E again, D or ⌘\ brings them back.
- If you press on a panel's empty space over a layer it covers, a tip says "Press E to hide the panels and keep editing, or T to see through them". It shows once a visit.

## Help and resources

The round ? button in the bottom right corner opens a menu with two rows.

- **Keyboard shortcuts** opens a sheet along the bottom of the window with the View keys: every way to show and hide finetune, finetune's own first (D, E and T), then Figma's (⌘\ and ⇧⌘\; Ctrl on Windows). A key you have used this visit lights up in the mode's colour, blue in Design and pink in Motion. Close it with its × or Escape.
- **User guide** opens this guide.

The menu's hovered row also takes the mode's colour. A page with its own help can turn the button off with `help: false`.

## Selecting

The page is the canvas. The page's body (or a wrapper that fills the whole window) is never selected: clicking it shows the **Page** settings.

### Clicks

- **Click** picks the outermost layer under the pointer at the level you're in. At first that's the page's level. The hover outline shows what a click would pick.
- **Shift-click** adds a layer to the selection, or takes it back off.
- **⌘-click** (Ctrl-click) picks the deepest layer under the pointer, even inside a group.
- **Double-click** goes one level in. On words, it starts editing them, however deep they sit (except inside a ⌘G group you haven't entered: that double-click enters the group first).
- **Escape** steps back out a level.
- **A press on the selected layer keeps it.** It doesn't jump back out to the layer around it.

Wrappers that draw nothing of their own (no fill, border, shadow, words and so on, or the same size as their only child) are passed through, so you don't need a click per wrapper. Images, vectors, controls, links and components are always layers.

### Marquee

Drag from empty page space to draw a marquee. It selects every layer it touches that a click would pick. Shift-drag adds to the selection. A click without a drag clears it.

### Layer keys

- **Enter** selects all the selection's children. On a text layer it edits the words instead.
- **Shift+Enter** or **\\** selects the parent.
- **Tab** and **Shift+Tab** select the next and previous layer at the same level, in the code's order.

### Right-click: Select layer

Right-click (in Design) opens **Select layer**, a menu of every layer under the pointer, indented by level, named as their kind line reads. Hover a row to outline that layer. Click to select it. Escape or a click elsewhere closes it. On finetune's own UI, in Motion, or while editing words, the browser's own menu opens instead.

### Groups

There are two kinds:

- **The code's containers.** An element that holds other elements reads as a **Group**, with its item count ("main.gv-pane · 6 items"). Click the count to drop down a list of its items: hover one to outline it, click to select it.
- **⌘G groups.** Select two or more layers and press ⌘G. A ⌘G group selects and moves as one unit. It only exists in finetune until the bake wraps its layers in a new element in your code. A layer can't be grouped with a layer it holds.

A click on any layer in a ⌘G group selects the whole group. Double-click goes in and selects that layer. ⇧⌘G ungroups it and leaves its layers selected.

⇧⌘G on a container from the code is **Ungroup a container**: its box goes and its layers stay exactly where they are on screen. Live, the wrapper gets `display: contents`; the bake takes it out of your code. A link can't be ungrouped.

### The selection box and handles

| On the canvas | What it does |
| --- | --- |
| **Drag the layer** | Moves it (and the rest of the selection when you press inside it). Writes a `translate`. One undo step. |
| **Side handles** | Size one axis: left and right the width, top and bottom the height. The opposite side stays put. |
| **Corner handles** | Size both axes freely. Shift, or the proportions lock, keeps the proportions. |
| **Just outside a corner** | The cursor turns to the rotate cursor. Drag to turn the layer about its pivot (its `transform-origin`, the centre by default). Shift snaps to 15° steps. |
| **Size label** | Shows the layer's width and height. |

Resize handles show on one layer that isn't rotated. A rotated layer keeps its rotation zones. A ⌘G group has no handles: resize it with K or with Make selected N cols wide. A drag that ends where it started leaves no edit.

Components show their outline, handles and size label in purple, with the component's name over the top left.

### Scale (K)

K turns on the Scale tool, as Figma's. It grows or shrinks everything together: text size, line height, padding, gaps, radius, borders, shadows, blurs, and the layers inside. Without K, resizing never changes text size, stroke or corner radius.

While Scale is on, the panel shows **Scale** in place of Appearance and the sections after it:

- **Width** and **Height**: the size it scales to. Typing one sets the factor.
- **Scale**: the factor (`1.5`, `1.5x` or `150%`), with a caret for presets (0.5x, 1x, 2x, 3x).
- **Anchor point**: the nine dots. The point that stays still while it scales.

All eight handles scale around the opposite point. At 1x every value goes back to the code's own. K writes real CSS values, never `zoom` or a scale transform. It refuses a turned or skewed layer, text being edited, and the page.

Leave Scale with K, V, Escape, the section's ×, switching to Motion, or another selection.

## The Design panel

What the panel shows depends on what's selected. For one layer, sections come in this order:

1. The kind line
2. Position
3. Layout
4. Appearance
5. Typography (text only)
6. Fill
7. Stroke (not on text)
8. Effects (not on text)

With nothing selected, it shows **Page** and the **Horizontal layout**. With several layers, it shows the kind line, Position, and Layout for a ⌘G group.

**Number fields take maths**, as Figma's do: `60-4`, `1112/2`, `(100-8)/2`, keeping the unit (`12%+4` is 16%). A sum that can't be worked out changes nothing. Clicking into a field and out again records nothing: only a typed change counts. Escape in a field puts the old value back.

### The kind line

The first line names what's selected, read from the code:

- **One layer**: its kind (Group, Text, Image, Vector, SVG or Box) and its element (`nav.hl-links`). A Group also shows its item count.
- **A ⌘G group**: "Group" with its item count. It has no element name, since it isn't in the code yet.
- **Several layers**: "N selected".
- **Columns**: "Column 3", "Columns 3–5" or "Columns 2, 5", then "of 12".

**Components.** When the layer is a component's outermost element (a React component's root, or a custom element), the line shows the component's name, then a note, "Editing every DemoButton.", and an **Override** button.

- Until you press Override, an edit to its look reaches every instance of that component on the page, and is recorded once, for the component. Moves, turns, flips and words are always this instance's own.
- **Override** makes this instance's edits its own. The note then reads "Editing only this DemoButton." Press it again to edit every instance again.
- **Variants**: when instances are given a string `variant` prop (like `outline`), each variant is its own set. The header reads "Button · outline" and edits reach the outline Buttons only.

### Page

Shown with nothing selected, or after a click on the page itself.

- **Page fill**: the page's background. With no fill of your own, the row shows the page's fill as it is now, and follows the page's theme switch.
- **Horizontal layout**: the layout grid. See below.

### Horizontal layout (layout grid)

A column guide drawn over the page, as Figma's layout grid. It's for placing things. It's saved with Save but never copied, so it never reaches your code.

**Where it comes from.** It starts as the page's own grid when the code has one, in this order:

1. The grid your `finetune()` call declares with the `layout` option.
2. The widest CSS grid with four or more equal columns, at least half the window wide.
3. The page's content column (a `.container`, `mx-auto max-w-7xl px-6` and the like) and the grids inside it.

With none, it says "Layout not defined." and offers **Add layout** (8 stretched columns, 200 margin, 20 gutter, red at 10%). ⌃G with no layout adds one too.

It starts hidden. ⌃G or its eye shows it. It follows the window: resize and it reads the page's grid again. A layout you've changed stays as you set it.

**The row** reads "Columns (8)". The swatch sets the columns' colour. The eye shows or hides it.

**Fields:**

| Field | What it sets |
| --- | --- |
| **Count** | How many columns. |
| **Type** | **Stretch** (columns fill the width between the margins) or packed **Left**, **Center**, **Right**. |
| **Width** | Each column's width. Auto when stretched. |
| **Margin** | Space at each side (Stretch). |
| **Offset** | Space from the packed side (Left, Center, Right). |
| **Gutter** | Space between columns. |

Typing redraws the columns on every keystroke.

**Header buttons:**

- **Use as active grid** (the bookmark): pick **Apply to all pages** or **Just this page**. That layout becomes the one every page, or this page, opens on. It's kept in this browser the moment you pick, not with Save. It also saves the layout as a style.
- **Styles** (four circles): opens **Layout guide styles**. **Currently used by site** shows the layout in use (a **+** saves it as a style). **Additional styles** lists the page's own grid ("Page grid · …") and your saved ones. Hover a row to preview it, click to apply it, and use the trash can to delete one. Styles are kept in this browser as soon as they're saved.

**Align items to nearest column**: left, horizontally, and right. Each moves every item on the page, snapping its edge to the nearest column edge (horizontally centres it on the page). A full-width band (a header, a section) stays put and the items inside it are aligned instead. The moves are ordinary `translate` edits, so they are copied and baked.

**After you add or change a layout**, a toast may ask "Use this new layout guide as active default?" with **Page** and **Website**.

#### Aligning to columns

While the layout shows:

1. **Pick a column.** Click empty space inside a column, or **⌥-click** (Alt-click) to pick the column under the pointer whatever covers it. **⇧⌥-click** adds or removes more columns.
2. **Add layers.** Shift-click layers to add them.
3. **Line them up.** **Position** shows **Align to column(s)**: left, center and right line the layers up with the column's edges and middle (or several columns' leftmost edge, middle and rightmost edge). ⌥A, ⌥H and ⌥D do the same.
4. **Match the width** (two or more columns). **Layout** shows the layers' **Dimensions** and **Make selected N cols wide**, which gives each layer the span's width and lines it up with its left edge.

Escape, a click elsewhere or switching to Motion lets the columns go. Copy notes which columns each layer went to, so the bake can place it in the grid.

### Position

| Control | What it does | CSS |
| --- | --- | --- |
| **Alignment** | Lines the layer up inside its parent (left, horizontal center, right, top, vertical center, bottom). With several layers, lines them up with each other on the selection's box. A ⌘G group moves as one. | `translate` |
| **X**, **Y** | The layer's place. With several layers, moves them all together. | `translate` |
| **Rotation** | The layer's turn, in degrees. | `rotate` |
| **Rotate 90° right** | Turns it a quarter. | `rotate` |
| **Flip horizontal**, **Flip vertical** | Mirror it. | `scale: -1 1` |
| **Ignore auto layout** (header) | On a child of a flex or grid parent: takes it out of the flow where it sits. Press again to put it back. | `position: absolute` with `left` / `top`; `position: relative` on the container |
| **Spacing** | When the layers sit in one row or column: the gap between them, or Mixed. Typing a number moves each one after the first so every gap is that number. | `translate` |
| **More options** (⋯) | On several layers: **Distribute horizontal spacing**, **Distribute vertical spacing** and **Tidy up**. | `translate` |

- **Distribute** keeps the outermost layers where they are and spaces the ones between evenly. It needs three or more.
- **Tidy up** reads the layers into rows and columns and spaces them at their most common gap.
- A move adds to any `translate` the code already has, so nothing jumps.
- Inline text (a span) gets `display: inline-block` the first time you move, turn or resize it, since inline text ignores those otherwise.

### Layout

Layout shows a layer's size, and on a container (a layer that holds others) its auto layout.

**On any layer:**

| Control | What it does | CSS |
| --- | --- | --- |
| **W**, **H** (Dimensions) | Width and height. Each axis on its own: W changes only the width. | `width`, `height` |
| **Constrain proportions** (the link) | When on, the other axis follows in proportion. Off for every layer until you turn it on. | |

When the width changes, what's inside wraps, and an image inside keeps its proportions. An `<img>` or `<video>` that changes shape gets `object-fit: cover` where the code has none, so it crops rather than stretches.

**Text** has its own **Resizing** row, as in Figma:

| Mode | What it does | CSS |
| --- | --- | --- |
| **Auto width** | The box hugs the words on one line. | `width: max-content` |
| **Auto height** | Fixed width, height follows the words. | width in px, `height: auto` |
| **Fixed size** | Both fixed. | width and height in px |

**On a container:**

| Control | What it does | CSS |
| --- | --- | --- |
| **Flow** | **Freeform** (no auto layout), **Vertical**, **Horizontal**, and **Grid** on a CSS grid (Grid isn't made here). | `display: flex` + `flex-direction`; Freeform is `block` |
| **Wrap** (beside Flow, Horizontal only) | Lets the layers wrap onto more rows. | `flex-wrap: wrap` |
| **Resizing** (W, H on auto layout) | Each has a caret: **Fixed width / height**, **Hug contents**, **Fill container**. | see below |
| **Alignment** | Nine dots: where the layers sit along and across the flow. Arrow keys move the picked cell. | `justify-content`, `align-items` |
| **Gap** | Space between layers. Never below 0. Its caret (or typing "auto") gives **Auto**, which spreads them apart. With Wrap or on a grid: **Horizontal gap** and **Vertical gap**. | `row-gap` / `column-gap`; Auto is `justify-content: space-between` |
| **Padding** | **Horizontal padding** and **Vertical padding**, each Mixed when its two sides differ. **Individual padding** opens one field per side. Never below 0. | `padding-left` / `-right`, `padding-top` / `-bottom` |
| **Clip content** | Hides what spills out of the container. | `overflow: hidden` (unchecked: `overflow: visible`) |
| **Add auto layout** (header, on Freeform) | Same as ⇧A. Its tip says what it would add. | |
| **Spacing** (on Freeform) | When the children sit in one row or column, the gap between them. Can go negative, since here it's moves. | `translate` |

**Resizing modes:**

- **Fixed**: a set px size. Typing a number sets Fixed.
- **Hug contents**: the container is as big as what's inside (`fit-content`).
- **Fill container**: a child of auto layout fills its parent along that axis (`flex-grow: 1` along the flow, `align-self: stretch` across it).

**Add auto layout (⇧A)** reads how the layers already sit (direction, gap, padding, alignment) so nothing moves where the gaps are even. If gaps are uneven, they're evened out and the toast says the layers moved. It refuses, and says why, when it can't apply (already auto layout, layers placed with `position: absolute`, layers overlap, and so on). **Remove auto layout (⌥⇧A)** goes back to Freeform.

**A ⌘G group's Layout:**

- Without auto layout: **Dimensions** (W, H of the box around its layers, with the proportions lock) and **Add auto layout**. A typed W or H resizes each layer by the same factor.
- With auto layout (⇧A on the group, or on two or more layers that share a parent): Flow, Alignment, Gap (a number, no Auto) and Padding. A group always hugs its layers. Wrap, Resizing and Clip content are disabled until the group is in the code. The layers after the group don't make room for it until the bake wraps it in a real element.

On a component root, Flow, Gap and Padding change every instance.

### Appearance

| Control | What it does | CSS |
| --- | --- | --- |
| **Opacity** | Field and slider, 0 to 100%. | `opacity` |
| **Eye** (beside Opacity) | Hides the layer. | |
| **Corner radius** | Field and slider, 0 to half the layer's short side. | `border-radius` |
| **Independent corners** | Four fields: top left, top right, bottom left, bottom right. The main field reads Mixed when they differ. | `border-*-radius` |
| **Corner smoothing** | Figma's smoothing, 0 to 100%, with a mark at 60% (iOS). | `corner-shape: superellipse(k)`, radii scaled to match. Not every browser draws it yet. |
| **Blend mode** | Figma's list of blend modes. | `mix-blend-mode` |
| **Adjustments** (header, not on text) | Seven image sliders. On a box they apply to the whole element. On an image they open its image popover. | `filter` |

A `%` radius reads as the px it draws.

### Typography

On text only.

| Control | What it does | CSS |
| --- | --- | --- |
| **Text styles** (four circles, header) | Lists the text style classes your CSS defines, under "Defined in code". Hover to preview, click to apply. | the class's declarations |
| **Family** | Opens the **Fonts** popover. | `font-family` |
| **Weight** | A menu of the weights the family has. Hover a weight to preview it. | `font-weight` |
| **Size** | A number, with a caret of preset sizes. | `font-size` (px) |
| **Line height** | A number (px), a `%`, or Auto. | `line-height` (Auto is `normal`) |
| **Letter spacing** | A percent by default, or px if you type `px`. | `letter-spacing` (em) |
| **Alignment** | Left, center, right, then top, middle, bottom. | `text-align`; vertical is `align-content`, or `align-items` / `justify-content` on flex text |

**Fonts popover.** It lists only your project's fonts: the ones loaded on the page or named in its CSS. Each name is drawn in its own face. The **All fonts** dropdown filters to Sans serif, Serif or Mono. Hover a row to preview it, click to apply it. The weight stays if the new family has it, else the nearest one. The name shown is a display name; the pick still writes the family your code registers, so Copy and the bake are unchanged. Set display names yourself with the `fontNames` option.

**Text styles.** A text style is a plain class that sets a size and at least one of family, weight, line height or letter spacing, and nothing but type. Each row shows "Ag" in the style's face, the class name, and its size and line height (`b1 · 16/24`). The one the text has now is filled blue. The bake adds the class, never the numbers behind it.

**Editing words.** Double-click text, or press Enter on a text layer, to retype it. Words your code builds from several parts (`Plan {name} pricing`) can't be retyped here: a toast says "Editing this component would break the code. Change it with Claude Code."

### Fill

| Layer | What Fill is | CSS |
| --- | --- | --- |
| A box | Its background colour. **+** (Add fill) adds white. | `background-color` |
| Text | Its colour. | `color` |
| An icon (an `<svg>` painted with `currentColor`) | Its colour. | the svg's `color` |
| A vector shape | Its fill. **+** adds Figma's D9D9D9. | SVG `fill` |
| An image | A thumbnail, opacity and eye. The thumbnail opens the image popover. | |

**The fill row:** the swatch opens the colour picker (a square, hue and opacity tracks, an eyedropper and a hex field), then opacity, then the eye. The eye hides the fill (as `transparent`) but keeps its colour, so one click shows it again.

**Color styles** (four circles, on text): lists the colour tokens your CSS sets on the root (`--text-primary`), in the theme the page shows now. Hover to preview, click to apply. A pick writes `color: var(--x)`, so it follows the theme. The bake writes the token, never changes the token itself.

**Image popover:** the fit (**Fill**, **Fit**, **Crop**, **Stretch**, written as `object-fit`), the preview with **Replace image** (picks a file from your computer; Save keeps it in this browser's storage, which holds about 5MB), and the seven adjustment sliders.

### Stroke

Not on text.

- **+** adds a stroke: black, Inside, 1.
- Its row: colour, opacity, eye, remove.
- **Position**: Inside, Center, Outside.
- **Weight**: its thickness.

It's written as an `outline` (Inside and Center by a negative `outline-offset`), so it never moves the layout. Your page's own outline shows as a stroke; a CSS `border` doesn't.

On vectors, Stroke is SVG `stroke` and `stroke-width`, always Center. On a line icon, Stroke is just its **Weight** (`stroke-width`, in the icon's own units).

### Effects

Not on text.

- **+** adds a drop shadow at the top: 0 4, blur 4, black at 25%.
- Each row: the sun icon (its settings), the type, remove, and the eye. The top row paints on top.

| Type | Settings | CSS |
| --- | --- | --- |
| **Drop shadow** | X, Y, Blur, Spread, Color | `box-shadow` |
| **Inner shadow** | X, Y, Blur, Spread, Color | `box-shadow: inset` (not on images, videos or canvases) |
| **Layer blur** | Blur | `filter: blur()` |
| **Background blur** | Blur | `backdrop-filter` |

Blurs are Figma's numbers, twice the CSS radius. Removing an effect the page had writes `none`. On any `<svg>`, Effects are Drop shadow and Layer blur only, as `filter`s, so the shadow follows the drawing.

### Delete and Duplicate

- **Delete** (Delete or Backspace) hides the selected layers live and toasts "Deleted N layers" with Undo. Copy lists each as a `delete` line; the bake takes it out of your code. Reset brings it back.
- **Duplicate** (⌘D) puts a copy right after each selected layer and selects the copies. Copy lists each as `duplicate of`, for the bake to copy the element in the code.

### What the panel leaves alone

An icon's weight, or which icon it is, is a prop in your code, not CSS, so the panel doesn't change them.

## The Motion tab

Motion (⌥9) tunes animations your code already has: one you described to Claude Code, say, whose timing or easing isn't right yet. Its colour is pink. Every group with an animation is outlined in pink on the page.

### What it reads

- **CSS animations**: `@keyframes` and the `animation` properties.
- **JavaScript animations made with `element.animate()`**, the browser's own animation call, and libraries built on it. finetune watches every call, so an edit also applies the next time the page runs it.
- **CSS animations that haven't started yet**, waiting on a class the page adds later (on scroll, on a click). These are listed under **Not started yet**; each row's **Play** adds the class so you can see and tune them without scrolling. That's the page's own state (a reload puts it back), not an edit.

### What it can't tune

- Libraries that animate frame by frame themselves. They change a style on every frame and leave no animation for the browser to read.
- An animation that starts some other way (a hover, an attribute) until it has started.
- CSS transitions. Transitions stay in the code.

### Groups and picking

Layers that run the same animations (the same `animation-name` list, or the same `animate()` keyframes) are one **group**: outlined, picked and tuned as one. Its kind line reads "Group", the layer count and the animation (`3 layers · hl-rise`).

In Motion, a click picks the nearest layer with motion under the pointer and takes its whole group. A press only selects: moving, resizing, grouping and editing words are Design's. Several layers that run different animations show only their kind line.

With nothing selected, **Animations** lists every group on the page. Click a row to select it. With none: "No animations running on this page."

### Playback speed

Under the kind line: **0.25×**, **0.5×**, **1×**, **1.5×**. The selected animation plays at that speed while the rest of the page keeps its own. It's for watching motion slowly. It's never an edit: nothing is saved or copied, and leaving Motion or the selection puts the speed back.

### The Animation section

- **Play / Pause** and **Replay** in its header drive the page's animation. They aren't edits.
- One row per animation: its `@keyframes` name and duration, or for a JavaScript one, the properties it animates and "JS · 400ms". Click a row to open its settings.
- Every edit replays the layers, so you see the change on the page.

**Settings:**

| Setting | What it does |
| --- | --- |
| **Keyframes** | Which `@keyframes` play. A JavaScript animation's keyframes are in its call, so this is a label. |
| **Direction** | Left, Right, Down, Up: which way it moves. Shown only when it moves. |
| **Distance** | How far it moves. |
| **Scale** | Shown when it scales. |
| **Rotation** | Shown when it turns. |
| **Opacity** | Shown when it fades. |
| **Easing** | Linear, Ease, Ease in, Ease out, Ease in and out, Ease in back, Ease out back, Ease in and out back, or **Custom bezier**, which shows a curve editor with two handles to drag. |
| **Duration** | Length in ms. |
| **Delay** | When it starts, in ms. For a group: when the first layer starts. |
| **Stagger** | For a group: the step from one layer to the next. Typing spaces them evenly. Mixed when the code's steps aren't even. |
| **Iterations** | A number, or ∞. |
| **Playback** | `animation-direction`: Normal, Reverse, Alternate, Alternate reverse. |
| **Fill mode** | None, Forwards, Backwards, Both. |

Timing edits are the layer's `animation-*` properties. Keyframe edits change the page's own `@keyframes`, so every layer using them follows, as the code would. A value set with `var()`, `calc()` or mixed units isn't offered.

### Adding an animation

A layer (or group) with no animation shows **Add CSS animation**. It opens a list:

- **Your tokens**: the page's own `@keyframes`.
- **Presets**: Figma's generic ones: Dissolve, Move in, Move out, Push, Slide in, Slide out.

Picking one adds it with Figma's default timing (ease out, 300ms, filling both ends). Then Direction and Distance turn it. A preset becomes a new `@keyframes` on the page (`slide-in`), and Copy lists it whole, so the bake adds it to your code.

Motion edits are one layer (or one group) at a time.

## Save, Reset and Undo

**Nothing saves on its own.** Edits show live but stay in memory. A reload before Save drops them.

| | What it keeps | Where | Survives a reload |
| --- | --- | --- | --- |
| **Undo / Redo** | Each change as one step once it settles, so a drag or a burst of typing undoes as one. | Memory, for this visit | No. Save keeps the result, not the history. |
| **Save** | Every edit on the page now. | This browser's localStorage, per page address (`finetune:edits:<path>`) | Yes |
| **Reset** | Nothing: it forgets every edit, saved or not, and reloads the page as the code writes it. | | |

- **Save never touches your code.** Only the bake does.
- **Save with no edits** stores nothing and says "No changes to save" (or clears an earlier save, with Undo).
- **Reset** shows a toast, "Your edits were reset to what's in the code", with **Undo** for 10 seconds. Undo brings back what showed before, saved edits saved and unsaved ones unsaved.
- **Undo toasts.** Save, Reset, group, ungroup, delete, duplicate, Align all items, add and remove auto layout, and the style actions each show a toast with **Undo** for 10 seconds.
- **Undoing past the first edit** puts back exactly what the page had.

Kept in this browser straight away, without Save: the active grid, layout guide styles, the panel's theme, and closed tips.

Reset leaves the active grid and styles as they are.

**When the page changes.** Each edit remembers which element it was made on. If the page re-renders, edits go back on the new element. If an element is gone, a toast says "N saved edits no longer match the page", and Copy notes it.

## Copy and bake

### What Copy gives you

**Copy** (⇧⌘E) copies a list of every change on screen, saved or not. The toast says "Copied 3 changes. Paste into Claude Code to bake."

The list looks like this:

```
Bake these finetune changes into the code with the finetune skill:
finetune changes · /Users/you/Projects/site/index.html · 1440×900
page                 background: #1E1E1E
h1                   font-size: 44px; letter-spacing: -0.014em
p.eyebrow            text: Studio · Redesign 2
group 1              div.hl-place, div.hl-bio
```

- **First line**: the request for the bake, so you don't need to type anything.
- **Header**: the page's path, the window's width and height (which tells the bake which breakpoint you saw), and the page's theme when finetune found a switch for one.
- **Then one line per layer**: its selector, then what changed, as CSS. `text:` is retyped words. Only what changed is listed.
- **`@ file:line`** after a selector says where that element is written, when your development build records it (React's development build, Lovable, TanStack Start). Without it, the bake finds the element by its selector.
- **Other lines**: `component` lines for component edits, `group N` for ⌘G groups, `delete`, `duplicate of`, `ungroup`, new `@keyframes`, and `animate()` changes.

Never copied: the layout grid and Motion's playback speed.

### Baking

Install the finetune skill in Claude Code once (see the README). Then paste the list into Claude Code. That's the whole request.

**Bake** means: take the changes and write each one where it lives in your code. Claude Code then lists every file and line it touched, and asks before committing.

- **On a Tailwind site**, it writes utilities in the element's `className`, using your theme's tokens where one matches (`bg-primary`, `gap-6`). Where none does, it writes the value (`gap-[18px]`) and tells you.
- **On plain CSS**, it writes into your stylesheet, using your tokens where one matches.
- **Moves** become `translate`, or are folded into `left` / `top` if the code places the element that way.
- **A ⌘G group** becomes a new wrapper element; one with auto layout becomes a new `div` with the flex on it.
- **A replaced image**: the bake asks where the file should live.

### Then press Reset

After the bake, press **Reset**. Your saved edits are forgotten and the page reloads from the code, so what you see is what the code now says.

## Token tuners

Sometimes you want a few sliders for values you're still deciding, like a hero's size or a brand colour. Pass `controls` and finetune adds a small panel of them:

```js
finetune({
  id: "hero",
  controls: {
    "--hero-size": { type: "range", value: 40, min: 24, max: 96, unit: "px" },
  },
});
```

- A key that starts with `--` is a CSS custom property, written on `target` (default `:root`) as you drag. Anything that reads `var(--hero-size)` updates live.
- A key without `--` only reaches `onChange(values)`, for JavaScript values like an animation speed or a line of copy.

| type | What it is |
| --- | --- |
| `range` | A slider plus a number you can type. Takes `min`, `max`, `step`, `unit`. |
| `select` | A button grid of `options`. |
| `toggle` | Writes `on` or `off` (default `1` and `0`). |
| `color` | Chips plus a hex field. |
| `text` | For copy, applied in `onChange`. |

- **Copy JSON** copies the values object. **Copy CSS** copies a `:root { … }` block.
- **Reset** puts every control back to its `value`. **Presets** set the keys they name.
- The panel remembers its last values per `id` in this browser.
- **Bake a tuner** by pasting Copy CSS into your stylesheet and removing the `finetune()` call, or ask Claude Code to "bake the hero tuner".

All options: `skills/finetune/references/tuner-api.md`.

## Glossary

| Term | Meaning |
| --- | --- |
| **Active grid** | The layout guide a page opens on, for every page or just this one. Set with Use as active grid. |
| **Anchor point** | In Scale, the point that stays still while the layer grows or shrinks. |
| **Auto layout** | Figma's name for a container that arranges its layers in a row or column with a gap and padding. In CSS: `display: flex`. |
| **Bake** | Writing your changes into the code. Claude Code does it from the Copy list. finetune itself never writes to disk. |
| **Color style** | A colour token your CSS defines on the root, like `--text-primary`. |
| **Column** | One column of the layout guide. |
| **Component** | An element a component in your code renders as its outermost element (a React component's root, or a custom element). Edits reach every instance until you press Override. |
| **Constrain proportions** | The link beside W and H. When on, changing one axis changes the other in proportion. |
| **Copy changes** | The list of every change on screen, ready to paste into Claude Code. |
| **Duplicate** | A copy of a layer, placed right after it. The bake copies the element in the code. |
| **Fill** | A layer's colour: background for a box, colour for text, `fill` for a vector. Also a Resizing mode, below. |
| **Fill container** | A child of auto layout that stretches to fill its parent on that axis. |
| **Fixed** | A set px size. |
| **Flow** | The direction of auto layout: Freeform, Vertical, Horizontal, or Grid. |
| **Freeform** | No auto layout. Layers sit where the code places them. |
| **Group** | A layer that holds other elements in the code. Also short for a ⌘G group. |
| **⌘G group** | Layers you grouped in finetune. They select and move as one. Exists only in finetune until the bake wraps them in a new element. |
| **Gutter** | The space between columns in the layout guide. |
| **Hide UI** | Hides the panel, toolbar, bar, grid and outline, leaving one button to bring them back. |
| **Horizontal layout** | The layout guide's columns. finetune's name for Figma's layout grid. |
| **Hug** | The container is as big as what's inside it (`fit-content`). |
| **Instance** | One use of a component on the page. |
| **Kind line** | The first line of the panel, naming what's selected. |
| **Layer** | Anything you can select on the page: an element, a text, an image, a vector. Figma's word for what's on the canvas. |
| **Layout guide** | The columns drawn over the page for placing things. Never copied or baked. |
| **Layout guide style** | A saved layout guide, kept in this browser. |
| **Margin** | In the layout guide, the space at each side of a stretched set of columns. |
| **Marquee** | The box you drag on empty page space to select every layer it touches. |
| **Mixed** | Shown when the selected layers, or a layer's sides, have different values. |
| **Offset** | In the layout guide, the space from the packed side for Left, Center or Right columns. |
| **Override** | Makes a component instance's edits its own, instead of reaching every instance. |
| **Page grid** | The grid finetune read from your page's own CSS. Listed in Styles. |
| **Preset** | A ready-made value: Motion's generic animations, Scale's factors, font sizes, or a tuner's named set of values. |
| **Reset** | Forgets every edit and reloads the page as the code writes it. |
| **Save** | Keeps your edits in this browser, per page address. Never touches code. |
| **Scale (K)** | A tool that grows or shrinks a layer and everything about it together, text and borders included. |
| **Selector** | The CSS name for an element in the Copy list, like `div.card`. |
| **Stagger** | In Motion, the step from one layer's start to the next in a group. |
| **Stretch** | Layout guide columns that fill the width between the margins. |
| **Stroke** | A line around a layer, written as a CSS `outline`. |
| **Text style** | A plain class your CSS defines that sets only type (size, family, weight and so on), like `.b1`. |
| **Token** | A named value in your code, usually a CSS custom property like `--hero-size` or a Tailwind theme value. |
| **Token tuner** | A small panel of sliders and pickers for CSS custom properties, set with the `controls` option. |
| **Wrap** | In horizontal auto layout, lets layers flow onto more rows (`flex-wrap: wrap`). |
