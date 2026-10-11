# Installation

```bash
npm install -g agent-superset
cd my-project
agent-superset init
agent-superset install --all
```

Then:

```bash
agent-superset doctor
agent-superset run "Implement refresh token rotation"
```

Select an agent explicitly with `--backend claude`, `--backend codex`, or `--backend opencode`. Use `--execution container` for a Docker-isolated run or `--execution sandbox` on Linux with bubblewrap.

Installation is idempotent and backs up existing agent instruction files before modification.
