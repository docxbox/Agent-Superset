---
name: testing
description: Execute relevant tests, lint, typecheck, and build commands; report machine results.
version: 1.0.0
triggers: [test,testing,verify,lint,typecheck,ci]
---

# Testing

Execute relevant tests, lint, typecheck, and build commands; report machine results.

## Rules

- Detect commands from the repository (package scripts, pytest, go test, cargo test, mvn, gradle); never assume a framework.
- Execute them; the exit code is authoritative. A passing-by-inspection test does not count.
- Report each command with exit code, duration, and the failing output tail on failure.
- New behavior requires a new test; bug fixes require a regression test.
- Tests must not depend on network access unless the suite already does.

## Output shape

Per command: `command`, `exitCode`, `duration`, and stdout/stderr summaries.
