# Security Model

Agent Superset treats repository execution as privileged infrastructure.

## Defaults

- No unrestricted shell strings. Safe execution uses `execFile` with argv.
- Dangerous Git and destructive command patterns are blocked before execution.
- Child processes receive a minimal environment; credential-like environment variables are filtered.
- Repository paths are bounded to the selected workspace.
- Container mode uses Docker with no network, dropped capabilities, and no-new-privileges.
- Linux sandbox mode uses bubblewrap when installed; unsupported hosts fail closed rather than pretending to be isolated.
- Secrets found in review output and telemetry are redacted.
- Installation backs up existing agent instruction files and uses a stable marker for idempotence.
- Git rollback requires the baseline HEAD and workspace status to remain unchanged.

## Trust model

Host mode is appropriate only for trusted repositories. For untrusted source or downloaded code, use container/sandbox mode and an explicit permission policy. Container/sandbox availability is surfaced by `doctor`.

## Approval gates

Dangerous operations, workflow approval steps, and future privileged tools should require explicit approval. The platform never force-pushes, rewrites history, resets user work, or silently deletes unrelated files.
