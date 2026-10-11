# Skills

Skills are `skills/<name>/SKILL.md` documents with YAML front matter for `name`, `description`, `version`, and `triggers`. They remain portable and backend-agnostic.

The router always includes baseline planning/testing/review/production-readiness skills and adds trigger matches, capped at eight skills to prevent context bloat. `agent-superset skills validate` checks metadata, versions, triggers, and duplicates.
