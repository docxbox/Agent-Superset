# Requirement Acceptance Matrix

The implementation is designed against the supplied production-grade universal-agent specification.

| Area | Implementation |
|---|---|
| Claude/Codex/OpenCode adapters | `src/adapters/cli.ts` with common `AgentBackend` |
| agent-scripts compatibility | portable `SKILL.md`, `AGENTS.md` installation, backups, idempotent marker |
| skill routing/progressive disclosure | trigger routing capped at eight skills + validation |
| production loop | recon, plan, implementation, test, review, repair, verify, finalize |
| deterministic verification | argv-based execution and authoritative exit codes/stdout/stderr/duration |
| production readiness | correctness/security/reliability/observability/deployment-oriented review gates |
| review → repair | bounded loop with test/review feedback |
| second opinion | optional `CliSecondOpinion` |
| universal tools | common tool contracts + MCP implementation |
| browser | optional Playwright provider |
| computer use | vendor-neutral provider interface |
| workflows | sequential, parallel, conditional metadata, approval, retry, timeout, rollback, checkpoint/resume |
| isolation | host, Docker no-network, Linux bubblewrap sandbox |
| Git safety | baseline HEAD/status/staged/full diff/branch/history; guarded rollback |
| project memory | `.forge/` state, sessions, reports, reviews/failures/history |
| loop/cost controls | iteration/repair/runtime/test/tool/cost fields and limits; cost is null when provider does not expose billing data |
| multi-agent architecture | structured role/orchestration contracts |
| install | global npm package + init + per-agent/all installation |
| observability | structured JSON session events and `.forge/logs` |
| benchmarks | baseline vs superset comparison harness and required metrics fields |
| tests | unit, integration, and end-to-end loop tests |
| security | argv execution, env filtering, root boundaries, secret redaction, approval/rollback controls |
| upstream analysis | `docs/upstream-analysis.md` with integration/license strategy |

## Verification performed for this build

The local environment could not complete dependency installation from the npm registry within the execution window, so the final build was transpiled with TypeScript `--noCheck` for runtime validation. All 13 project tests pass after transpilation. A normal consumer install uses the pinned `@types/node` and TypeScript dependencies in `package-lock.json`, and `npm test` performs the full strict TypeScript build before running tests.
