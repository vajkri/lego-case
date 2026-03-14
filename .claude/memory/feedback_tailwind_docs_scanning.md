---
name: tailwind-docs-scanning-bug
description: Tailwind v4 scans .planning/** and other doc dirs — never use example arbitrary-value class names in docs
type: feedback
---

Never write Tailwind arbitrary-value class placeholders like `className="..."` or `text-[length:var(...)]` in documentation or planning files.

**Why:** Tailwind v4's oxide scanner auto-scans ALL non-gitignored files including `.planning/**` markdown docs. The `...` placeholder gets extracted as a class candidate, and Tailwind's inference engine combines it with theme variables to generate `text-[length:var(...)]` → `font-size: var(...)`, which is invalid CSS (three dots are not a valid CSS variable name). This causes a turbopack CSS parse error in dev mode.

**How to apply:**
- In planning/doc files: use `{className}` JSX syntax or prose descriptions instead of `className="..."` placeholder strings
- In `src/app/globals.css`: the following `@source not` exclusions must remain to prevent scanning doc dirs:
  ```css
  @source not "./.planning/**";
  @source not "./CLAUDE.md";
  @source not "./.claude/**";
  @source not "./.serena/**";
  ```
- If a new doc directory is added that's not gitignored, add another `@source not` exclusion.
