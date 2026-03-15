---
name: No em dashes in content
description: Never use em dash (\u2014 / —) in user-facing text content — use colons, commas, periods, or semicolons instead
type: feedback
---

Never use em dashes (— / \u2014) in generated text content. They read as AI-generated.

**Why:** The user flagged that em dashes "scream AI." Every instance across 5 stop data files had to be replaced.

**How to apply:** When writing any user-facing text (slide content, UI copy, descriptions), use `:`, `,`, `.`, or `;` instead of `—`. This applies to all content strings in data files, not just slides.
