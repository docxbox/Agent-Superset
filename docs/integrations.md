# Integrations

## Backends

- `claude` → `claude` CLI
- `codex` → `codex` CLI
- `opencode` → `opencode` CLI

Each adapter receives a task, working directory, bounded timeout, and filtered environment. Add a future backend by implementing `AgentBackend` without changing orchestration.

## agent-scripts compatibility

The installer writes a marked section into the relevant global `AGENTS.md`, preserving existing content and creating a timestamped backup before the first modification. Existing marked sections are not duplicated.

## MCP

`src/tools/mcp.ts` provides a minimal subprocess boundary with credential-shaped environment filtering. A production deployment should configure explicit MCP servers and permissions rather than inheriting the host environment.
