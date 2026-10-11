---
name: production-readiness
description: Check deployment, observability, reliability, configuration, and failure recovery.
version: 1.0.0
triggers: [production,release,production-ready,deploy,ship]
---

# Production Readiness

Check deployment, observability, reliability, configuration, and failure recovery.

## Gates

- Correctness: full test suite, lint, and typecheck pass via actual execution.
- Reliability: timeouts, retries, and cleanup on failure paths; no leaked processes or files.
- Observability: failure paths log actionable messages; no bare `console.log` in library code.
- Configuration: environment variables documented; no hard-coded hosts or ports.
- Deployment: build succeeds; migrations and config changes identified.
- Security: no secrets in the diff; dependency changes reviewed.

## Rules

- Every gate is verified by machine result, not by assertion.
- If any gate fails, report the exact failing gate and command output.
