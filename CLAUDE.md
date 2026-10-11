# Claude instructions: finetune

These override default behavior. Follow them exactly.

## Build only what is asked
- Do exactly what the ask says, nothing more. No extra controls, options, demos, styling or polish that wasn't requested. "Scaffold" means the files named in the ask with the content named in the ask, and nothing else.
- If more seems needed, finish the literal ask, then ask. Wait for a yes.
- We build incrementally and together. Stop after the asked step.

## The library's shape
- `src/finetune.js` is ONE classic script with zero dependencies and no build step. It must run from an HTML file opened straight from Finder (`file://`), so no ES module syntax in it: Chrome blocks module imports on `file://`. It sets `window.finetune`.
- The panel's look lives in the one fenced block at the top of the file, labelled PANEL LOOK. It is a placeholder until the design lands. To change the look, change only that block.
- A schema's keys are the CSS custom properties they write. Keep that: the schema is the output format.
- The library never writes to disk and never persists beyond localStorage. Bake is a separate, deliberate step, done by a person or by the skill.
- `docs/PLAN.md` is the spec for v0. Anything not in it is a question, not a feature.
- Type: every component finetune makes (the panel, the demo pages, the finetune page on her main site) is set in Inter. The page loads Inter (Google Fonts); the library itself never loads a font, it just puts `"Inter"` first in PANEL LOOK's font stack.

## Writing
- Plain English in the README, the comments and the skill. Short sentences. No em dashes.
- Comments say why, not what.

## Tokens and tone
- Be concise. No narration of work that wasn't requested, no long summaries.

## Verification
- A light check that the file parses (`node --check src/finetune.js`) is welcome. Nothing beyond that unless asked. She opens the demo in Chrome and judges it herself.
- Don't start or kill dev servers.

## Git
- Ask before committing. Commit only your own hunks; other sessions may be editing the same files.
- Never push and never create the GitHub repo unless asked in that session.
- Never save anything to `~/Desktop`. No parallel agents or workflows.
