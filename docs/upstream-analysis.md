# Upstream Analysis

This document records the integration strategy required by the specification. Agent Superset reimplements the necessary contracts rather than copying upstream source. Research was performed against the public GitHub repositories on 2026-06.

Note: several projects originally under `steipete` have moved to the `openclaw` GitHub organization (`acpx`, `mcporter`, `lobster`, `crabbox`, `crabfleet`, `clawpatch`, `fs-safe`, `Peekaboo`, `gitcrawl`, `gogcli`, and OpenClaw itself). Both locations are noted below. All inspected projects are MIT-licensed.

| Repository | Purpose / important components | Reusable concepts | Integration strategy | Use / not use |
|---|---|---|---|---|
| steipete/agent-scripts | Canonical shared `AGENTS.MD`, `skills/` with `SKILL.md` YAML front matter (`name`, `description`), `scripts/`, `hooks/` (validate-skills, sync-skills), idempotent symlink-mirror install to `~/.codex`, `~/.claude` | SKILL.md format, front-matter validation, pointer-style AGENTS.md, non-destructive idempotent sync | Compatible skill discovery/validation and marked (never clobbering) instruction merging | Use format and conventions; do not copy personal helpers |
| openclaw/openclaw | Gateway control plane, sessions, tools, skills, plugins, lifecycle hooks, sandboxing | Session/lifecycle abstraction, tools as extensions, treat inbound as untrusted | Inform lifecycle/session design only | No mandatory dependency |
| openclaw/acpx | Headless CLI for stateful ACP sessions; named sessions, `exec` one-shot, JSON/NDJSON output, permission modes, `--cwd` filesystem boundary | Stateful session model, permission modes, structured output | Future ACP-based backend adapter; current CLI adapter keeps the same task/result contract | Optional Phase 2 |
| openclaw/mcporter | MCP discovery/invocation runtime; stdio + Streamable HTTP, filtered env, credential-safe config | MCP client boundary, filtered child env, tool listing/calling | Minimal JSON-RPC stdio MCP client reimplemented in `src/tools/mcp.ts` | Use pattern; no dependency |
| openclaw/lobster | Typed JSON-first workflow pipelines, approval gates, resume via state files, env-var arg passing for shell safety | Workflow steps, retries, approval, checkpoint/resume, dry-run | YAML workflow engine with checkpointing under `.forge/sessions` | Reimplemented |
| openclaw/crabbox | Warm sandbox, sync diff, run suite; container/VM providers, isolated test runs | Execution isolation modes, diff-sync test model | host/container(Docker)/bubblewrap modes in `security/policy.ts` | No dependency; Phase 3 |
| openclaw/crabfleet | NOTE: has pivoted to a VNC remote-desktop app; not an agent-run orchestrator anymore | Limited current relevance | Multi-agent orchestration designed independently (structured artifacts, role agents) | Optional Phase 4, conceptual only |
| openclaw/clawpatch | Review → patch → revalidate loop; resumable findings, feature mapping, provider adapters, read-only review default | Review/repair/revalidation loop, evidence-backed findings, dirty-worktree refusal | Bounded repair loop in `orchestration/loop.ts`; review gates in `review/review.ts` | Reimplemented |
| openclaw/fs-safe | Race-resistant root-bounded filesystem primitives (Go os.Root equivalent for Node) | Root-bounded path resolution, fail-closed boundary errors | `SafeWorkspace.resolve()` root-boundary check | Reimplemented; Phase 3 can adopt native lib |
| steipete/summarize | URL/file/media ingestion, extraction-first pipeline, stable JSON envelopes | Context ingestion for research phase | Future research/context tool behind `UniversalTools` | Optional |
| steipete/sweetlink | Browser agent interaction (observation → action loops) | observe/reason/act loop | `BrowserProvider` contract in `tools/contracts.ts`; optional Playwright provider | Optional |
| openclaw/Peekaboo | macOS screenshot/GUI automation CLI + MCP; semantic actions, window pinning | Computer-use capability interface | `ComputerUseProvider` contract; never in core | Optional, non-core |
| steipete/oracle | Second-model escalation CLI + MCP; bundles prompt + files, session storage | Stuck-agent escalation with structured recommendation | `SecondOpinionProvider` + `CliSecondOpinion` adapter | Optional, no provider lock-in |
| openclaw/gogcli | Google Workspace CLI with readonly mode, safety profiles, JSON output | Read-only-by-default tool posture, machine-readable output | Future composable tools | Not mandatory |
| openclaw/gitcrawl | Local-first GitHub issue/PR mirror in SQLite, local search, JSON output | Local-first project knowledge | Future repository-context tool | Not mandatory |

## Licensing

Every inspected repository is MIT-licensed. No upstream source is copied into this repository; all integrations are reimplementations of public interface concepts. Before incorporating any third-party code, its license must be re-checked and attribution/notice requirements preserved. Agent Superset itself is MIT (see `LICENSE`).

## Key takeaways applied

1. **agent-scripts is the foundation**: SKILL.md YAML front matter, terse operational skill bodies, pointer-style shared instructions, and idempotent non-destructive install are all preserved.
2. **Machine results are authoritative** (crabbox/clawpatch/lobster): verification executes real commands and records exit codes; the loop never trusts model claims.
3. **Fail closed at boundaries** (fs-safe/crabbox): root-bounded paths, argv-based execution, filtered child environments, blocked destructive commands, container/sandbox opt-ins.
4. **Bounded autonomy** (lobster/clawpatch): repair iterations, runtime, and test-run limits; approval metadata for dangerous steps; checkpoints make runs resumable.
5. **No vendor lock-in** (acpx/mcporter/oracle): backends, MCP servers, and second-opinion providers are pluggable contracts, not imports.
