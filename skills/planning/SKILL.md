---
name: planning
description: Create a structured plan before non-trivial changes.
version: 1.0.0
triggers: [planning,architecture,feature,plan,design]
---

# Planning

Create a structured plan before non-trivial changes.

## When

Any task larger than a single-file edit, any new subsystem, any API or schema change.

## Steps

1. Run repository recon: manifests, lock files, source tree, tests, CI, git status, recent history.
2. Record the objective in one sentence.
3. List affected components with existing-file references.
4. Order steps smallest-safe-first; each step must be independently verifiable.
5. List risks (unrelated workspace changes, security-sensitive behavior, missing tests).
6. Attach the verification commands recon detected (test/lint/typecheck/build).

## Output

Store the plan in `.forge/state.json` via the run state; never keep it only in chat.

## Rules

- Never plan around assumptions about the stack; recon output is authoritative.
- If the plan requires touching more than ~10 files, split it into sequential sub-tasks.
- Preserve repository-local conventions over generic style preferences.
