---
name: implementation
description: Implement the smallest coherent change while preserving local conventions.
version: 1.0.0
triggers: [implement,implementation,feature,refactor,build,add,create]
---

# Implementation

Implement the smallest coherent change while preserving local conventions.

## Rules

- Follow the stored plan; if reality diverges, update the plan before continuing.
- Match existing naming, file layout, error handling, and logging patterns.
- Never modify unrelated files, delete user changes, or reformat untouched code.
- Prefer editing existing modules over creating parallel abstractions.
- No placeholder code, no TODO comments as substitutes for implementation.
- Every new error path must produce an actionable message.

## Completion criteria

- The change compiles/type-checks.
- Relevant tests exist and pass via actual command execution.
- The diff contains only task-related changes.
