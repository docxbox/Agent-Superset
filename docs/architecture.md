# Agent Superset Architecture

Agent Superset is a portable engineering layer above Claude Code, Codex CLI, OpenCode, and future CLI agents. The core never imports a vendor SDK: adapters implement `AgentBackend` and the orchestration loop consumes only the common contract.

## Runtime lifecycle

`TASK → RECON → RESEARCH/CONTEXT → PLAN → IMPLEMENT → TEST → REVIEW → REPAIR/DIAGNOSE → VERIFY → FINALIZE`.

Machine verification is authoritative. A successful model response cannot make a failed test pass. The repair loop is bounded by iterations, repairs, runtime, test runs, tool calls, and cost.

## Safety boundaries

- Commands are represented as executable + argv; no `/bin/sh -lc` is used by the safe executor.
- Environment variables are allowlisted and credential-shaped variables are excluded from child processes.
- Workspace paths are root-bounded.
- Host, Docker container, and Linux bubblewrap sandbox execution modes are supported.
- Git baseline captures HEAD, status, staged diff, full HEAD diff, branch, and history.
- Rollback refuses to operate if HEAD or unrelated workspace state changed.

## State

`.forge/` stores non-secret run state, plans, reports, sessions, reviews, failures, and decisions. Credentials and raw secrets are never intentionally persisted.

## Skills

Portable `SKILL.md` files retain agent-scripts compatibility (`AGENTS.md`, `skills/`, `scripts/`, `hooks/`) while adding semantic routing and validation. Only relevant skills are selected for a task.

## Workflows

Workflows are declarative and inspectable. The engine supports sequential execution, retry, timeout, conditional/approval metadata, and step results. Agent-backed implementation steps remain optional so a workflow can be used as a deterministic verification pipeline.
