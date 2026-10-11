# Changelog

## 1.0.1

- Fixed Windows command execution: `.cmd`/`.bat` shims (npm, pnpm, claude, codex, etc.) are now resolved via `where` (preferring real executables) and routed through `cmd.exe /d /s /c` with strict argv quoting; multi-line batch arguments are rejected.
- Extended the sanitized child environment with non-credential Windows variables (SystemRoot, ComSpec, TEMP, APPDATA, etc.) so verification and backends run on Windows.
- Fixed `assertSafeCommand` absolute-executable bypass on Windows (`C:\...` paths were not detected).
- Fixed stateful global-regex review bug: repeated reviews now detect secrets consistently.
- Fixed SKILL.md front-matter parsing to tolerate CRLF line endings.
- Fixed `doctor` Docker detection output (unawaited promise serialized as `{}`).
- Added `config` and `logs` CLI command implementations with `--tail` support.
- `install claude` now also writes a pointer line into `~/.claude/CLAUDE.md` and syncs skills to `~/.agent-superset/skills`; still idempotent and non-destructive.
- Enriched all skills to operational 1.0.0 bodies and added the `architecture` skill.
- Corrected `docs/upstream-analysis.md` with verified repository locations (openclaw org migration), licenses, and takeaways.

## 1.0.0

- Added universal Claude/Codex/OpenCode backend lifecycle with resumable/stoppable CLI sessions.
- Added production engineering loop with recon, structured plan, deterministic verification, review, bounded repair, security and production gates.
- Replaced shell-string execution with argv-based execution and filtered child environments.
- Added host, Docker-isolated and Linux bubblewrap execution modes.
- Added Git baseline/diff safety, project memory, structured telemetry and workflow checkpoints.
- Added workflow retry/timeout/approval/conditional/parallel/rollback metadata and resumability.
- Added MCP JSON-RPC stdio client, optional Playwright browser provider and second-opinion adapter.
- Added benchmark baseline-vs-superset harness and unit/integration/E2E tests.
- Added upstream architecture/license analysis and security documentation.
