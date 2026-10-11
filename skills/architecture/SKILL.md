---
name: architecture
description: Evaluate structural changes, boundaries, and long-term maintainability.
version: 1.0.0
triggers: [architecture,structure,module,boundaries,migration,scale]
---

# Architecture

Evaluate structural changes, boundaries, and long-term maintainability.

## Rules

- Derive the current architecture from recon; never invent it.
- New modules must have a single responsibility and a clear public interface.
- Prefer composition over inheritance; prefer explicit dependencies over global state.
- Cross-cutting concerns (logging, config, errors) follow existing project patterns.
- Data and API changes require migration and backward-compatibility analysis.
- Record significant structural decisions in `.forge/decisions.md` with context and alternatives.