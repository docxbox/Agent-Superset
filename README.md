# agent-superset

Portable production-grade engineering layer for Claude Code, OpenAI Codex CLI, OpenCode, and future coding agents.

## What it does

Agent Superset sits above an existing coding agent. It detects the repository, routes relevant skills, creates a structured plan, invokes the selected agent, runs deterministic verification, reviews the complete Git diff, repairs failures within bounded limits, checks security and production readiness, and writes a structured run report under `.forge/`.

## Install

```bash
npm install -g agent-superset
agent-superset init
agent-superset install --all
```

## Run

```bash
agent-superset run "Implement refresh token rotation"
agent-superset run --backend codex "Implement refresh token rotation"
agent-superset run --backend claude --execution container "Fix the authentication bug"
```

## Inspect

```bash
agent-superset doctor
agent-superset status
agent-superset recon
agent-superset skills validate
agent-superset verify
agent-superset review
agent-superset workflow list
agent-superset benchmark run
```

## Safety

The safe executor does not invoke `/bin/sh -lc`; commands are executable + argv. Child environments are filtered, workspace paths are bounded, destructive commands are blocked, and container/sandbox modes are available. Host mode should be used only for trusted repositories.

## Architecture

See `docs/architecture.md`, `docs/security.md`, `docs/upstream-analysis.md`, `docs/integrations.md`, `docs/skills.md`, `docs/workflows.md`, and `docs/installation.md`.

## License

MIT.
