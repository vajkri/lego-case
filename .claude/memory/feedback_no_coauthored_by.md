---
name: no-co-authored-by
description: Never append Co-Authored-By lines to commit messages
type: feedback
---

Never append `Co-Authored-By: Claude ...` (or any Co-Authored-By trailer) to commit messages.

**Why:** User explicitly does not want these lines in commit history.

**How to apply:** Omit Co-Authored-By entirely when writing or amending any commit message. This applies to all commits in this project, including those created by subagents.
