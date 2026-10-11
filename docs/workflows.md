# Workflows

Built-in workflows are `feature`, `bugfix`, `refactor`, and `production`. Each is inspectable YAML and can be run with:

```bash
agent-superset workflow list
agent-superset workflow run feature
```

Supported step controls include sequential order, retry, timeout, approval metadata, conditional metadata, and command-backed steps. Built-in structural steps: `recon` runs repository reconnaissance, `plan` marks planning (the engineering loop creates the actual plan), `test`/`verify` execute detected verification commands, `review`/`security`/`production-readiness` run diff review, and `repair` defers to the bounded repair loop when a backend is attached. Results are returned for every step so a run can be inspected and resumed by an external controller; checkpoints persist under `.forge/sessions/`.
