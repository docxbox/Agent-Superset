---
name: code-review
description: Review the diff for correctness, maintainability, regressions, and missing tests.
version: 1.0.0
triggers: [review,code-review,diff,audit]
---

# Code Review

Review the diff for correctness, maintainability, regressions, and missing tests.

## Dimensions

1. Correctness: logic errors, off-by-one, null/undefined handling, race conditions, error paths.
2. Regressions: does the diff change behavior of untouched call sites?
3. Tests: are new branches covered? do existing tests still test the right thing?
4. Security: run the security checklist for any auth, I/O, or execution changes.
5. Maintainability: naming, duplication, complexity, dead code.
6. Observability: meaningful errors and logging for failure paths.

## Rules

- Review the complete diff, not selected files.
- Ground every finding in the diff; no speculative findings.
- Findings are evidence-backed: file, line, why it matters, suggested fix.
- A finding blocks completion until repaired or explicitly waived with reason.
