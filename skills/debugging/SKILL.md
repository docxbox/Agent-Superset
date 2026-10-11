---
name: debugging
description: Diagnose failures from authoritative logs and reproduce before repairing.
version: 1.0.0
triggers: [debug,debugging,bug,fix,failure,error,broken]
---

# Debugging

Diagnose failures from authoritative logs and reproduce before repairing.

## Loop

1. Reproduce: capture the exact failing command and its machine output (exit code, stderr).
2. Locate: read the failing code path; do not guess from the error message alone.
3. Hypothesize: state the suspected cause in one sentence.
4. Repair: make the smallest change that addresses the cause, not the symptom.
5. Verify: re-run the exact failing command plus the full relevant test suite.

## Rules

- Never claim a fix without re-executing the failing command.
- If a failure cannot be reproduced, say so explicitly instead of shipping speculative changes.
- Prefer adding a regression test that fails before the fix.
- Escalate to a second opinion after the configured repair limit is reached.
