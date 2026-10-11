# Build a Universal Production-Grade Coding-Agent Plugin

## Mission

Build a production-grade, portable **agent engineering plugin/platform** that can be installed and used with different coding agents, especially:

- Claude Code
- OpenAI Codex CLI
- OpenCode
- Any future coding agent that supports project instructions, skills, tools, MCP, CLI execution, or agent plugins

The project should combine and extend the most useful agent-engineering ideas and tooling from Peter Steinberger's public GitHub ecosystem, with **`agent-scripts` as the foundational skills/rules layer**.

The goal is NOT to build another LLM.

The goal is NOT to replace Claude, Codex, or OpenCode.

The goal is to build a **universal agent augmentation layer** that makes whichever coding agent is underneath it substantially better at producing reliable, tested, reviewed, production-quality software.

---

# 1. PRIMARY REFERENCES

You MUST inspect the following repositories before designing or implementing the system.

## Peter Steinberger

GitHub profile:

https://github.com/steipete

## Foundation

### agent-scripts

https://github.com/steipete/agent-scripts

This is the primary reference and foundation.

Study:

- `AGENTS.md`
- `skills/`
- skill metadata
- skill routing
- scripts
- hooks
- validation
- synchronization/install mechanisms
- Claude/Codex integration
- repository/project detection
- conventions around reusable agent instructions

Do not blindly copy it. Understand its architecture and improve/extend it.

---

# 2. RELEVANT PETER STEINBERGER PROJECTS

Study and selectively integrate ideas, implementations, interfaces, or compatible dependencies from the following projects.

## Core agent/runtime projects

### OpenClaw

https://github.com/openclaw/openclaw

Study especially:

- agent loop
- sessions
- context assembly
- tool execution
- hooks
- lifecycle
- sub-agents
- skill system
- state
- orchestration
- tool routing
- agent lifecycle events

Do NOT make OpenClaw a mandatory dependency.

We are building a portable layer that can work independently.

---

### acpx

https://github.com/steipete/acpx

Study:

- stateful agent sessions
- headless agent execution
- session management
- ACP concepts
- process interaction

---

### mcporter

https://github.com/steipete/mcporter

Study:

- MCP discovery
- MCP invocation
- CLI packaging
- tool abstraction
- TypeScript interfaces

This should inform the plugin's universal tool layer.

---

### lobster

https://github.com/steipete/lobster

Study:

- typed workflows
- pipelines
- deterministic execution
- approval gates
- structured workflow composition

The final system should support deterministic workflows around otherwise autonomous agents.

---

### Crabbox

https://github.com/steipete/crabbox

Study:

- isolated execution
- repository changes
- syncing diffs
- test execution
- reproducibility
- sandbox-oriented workflows

---

### Crabfleet

https://github.com/steipete/crabfleet

Study:

- agent run orchestration
- mission/control-plane concepts
- coordinating multiple agent runs
- execution management

Multi-agent support should be optional, not required for the first version.

---

### clawpatch

https://github.com/steipete/clawpatch

Study:

- automated code review
- automated fixes
- review → patch → verification loops
- GitHub integration
- agent-driven code quality

This is highly relevant to the production-quality objective.

---

### fs-safe

https://github.com/steipete/fs-safe

Study:

- filesystem safety
- root-bounded operations
- race-resistant filesystem primitives
- security boundaries

Do not give coding agents unrestricted filesystem access.

---

# 3. ADDITIONAL CAPABILITY REFERENCES

Study these repositories for optional capability modules.

### summarize

https://github.com/steipete/summarize

Use as inspiration for:

- URL ingestion
- file ingestion
- context extraction
- context compression
- document summarization

---

### sweetlink

https://github.com/steipete/sweetlink

Study:

- browser automation
- current-tab interaction
- browser-based agent loops
- observation → action → observation

---

### Peekaboo

https://github.com/steipete/Peekaboo

Study:

- screenshot capture
- GUI automation
- computer-use patterns
- MCP/CLI interfaces

Make this an optional capability, not a hard dependency.

---

### oracle

https://github.com/steipete/oracle

Study:

- escalation to another model
- second-opinion reasoning
- stuck-agent recovery
- external reasoning calls

---

### gogcli

https://github.com/steipete/gogcli

Study:

- CLI-based external service integrations
- composable agent tools
- Google service automation

Do not make Google services mandatory.

---

### gitcrawl

https://github.com/steipete/gitcrawl

Study:

- GitHub issue/PR intelligence
- repository history
- local-first project knowledge

---

# 4. IMPORTANT: DO NOT CLONE EVERYTHING

Do NOT blindly merge Peter's entire GitHub account.

His GitHub contains many unrelated projects involving:

- macOS utilities
- audio
- smart home
- messaging
- personal utilities
- Swift projects
- unrelated CLI tools
- legacy projects

Only incorporate functionality relevant to:

1. Coding agents
2. Agent orchestration
3. Agent skills
4. Tool use
5. Context management
6. Code execution
7. Testing
8. Code review
9. Repair loops
10. Browser/computer use
11. Security
12. Sessions
13. Git/GitHub
14. Multi-agent workflows

---

# 5. CORE PRODUCT IDEA

The product should sit ABOVE existing coding agents.

Architecture:

```text
                         USER
                          │
                          ▼
                ┌───────────────────┐
                │ UNIVERSAL AGENT   │
                │ ENGINEERING LAYER │
                └─────────┬─────────┘
                          │
       ┌──────────────────┼──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
   Claude Code          Codex             OpenCode
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
                    Shared Protocol
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
       Skills          Policies          Tools
          │               │                │
          └───────────────┼────────────────┘
                          ▼
                     Agent Loop
                          │
                          ▼
                      Execution
                          │
                          ▼
                       Testing
                          │
                          ▼
                       Review
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                  PASS         FAIL
                    │           │
                    ▼           ▼
                  SHIP        REPAIR
                                │
                                └──────→ VERIFY
```

---

# 6. UNIVERSAL AGENT ADAPTER

Create a common abstraction for different coding agents.

Conceptually:

```typescript
interface AgentBackend {
    name(): string;

    capabilities(): AgentCapabilities;

    run(task: AgentTask): Promise<AgentResult>;

    resume(sessionId: string): Promise<AgentResult>;

    stop(sessionId: string): Promise<void>;
}
```

Implement adapters for:

```text
Claude Code
Codex CLI
OpenCode
```

The architecture MUST allow additional backends later.

Do not tightly couple the core system to one vendor.

---

# 7. AGENT-SCRIPTS COMPATIBILITY

`agent-scripts` should be treated as the foundation.

Preserve compatibility with:

```text
AGENTS.md
SKILL.md
skills/
scripts/
hooks/
```

The system should be able to:

- discover existing skills
- load relevant skills
- install/sync skills
- validate skills
- expose skills to Claude Code
- expose skills to Codex
- expose skills to OpenCode
- avoid duplicate skill definitions
- respect repository-local instructions
- respect global instructions
- resolve instruction precedence

Do not destroy or overwrite an existing user's agent configuration.

Use safe installation and backups.

---

# 8. UNIVERSAL SKILL SYSTEM

Create a portable skill format.

Example:

```text
skills/
├── planning/
│   └── SKILL.md
├── implementation/
│   └── SKILL.md
├── debugging/
│   └── SKILL.md
├── testing/
│   └── SKILL.md
├── security/
│   └── SKILL.md
├── code-review/
│   └── SKILL.md
├── architecture/
│   └── SKILL.md
└── production-readiness/
    └── SKILL.md
```

Each skill should contain:

```yaml
---
name: production-readiness
description: Verify that a software change is production ready.
version: 1.0.0
triggers:
  - production
  - release
  - production-ready
---
```

Then instructions.

Skills should be:

- composable
- discoverable
- versioned
- independently testable
- portable
- backend agnostic

---

# 9. SKILL ROUTING

Implement intelligent skill selection.

Given:

```text
"Add OAuth authentication to this API"
```

the system should identify relevant skills such as:

```text
architecture
backend
security
authentication
testing
code-review
production-readiness
```

Do NOT load every skill into every context.

Use progressive disclosure.

Only inject the skills relevant to the task.

---

# 10. PRODUCTION AGENT LOOP

The default workflow should be:

```text
TASK
  ↓
RECON
  ↓
RESEARCH
  ↓
CONTEXT
  ↓
PLAN
  ↓
IMPLEMENT
  ↓
TEST
  ↓
REVIEW
  ↓
REPAIR
  ↓
VERIFY
  ↓
FINALIZE
```

The loop must be able to repeat:

```text
IMPLEMENT
   ↓
TEST
   ↓
FAIL
   ↓
DIAGNOSE
   ↓
REPAIR
   ↓
TEST
```

with configurable limits.

---

# 11. REPOSITORY RECON

Before making significant changes, inspect:

```text
README
package manifests
lock files
source tree
tests
CI configuration
Docker configuration
environment configuration
database configuration
API contracts
architecture
existing conventions
git status
recent git history
```

The system should determine:

```text
language
framework
package manager
test framework
linting
type checking
build system
CI
deployment style
```

Do not assume a technology stack.

---

# 12. PLAN BEFORE IMPLEMENTATION

For non-trivial tasks, require a structured plan.

Example:

```yaml
task:
  objective: ...

analysis:
  existing_architecture: ...
  affected_components:
    - ...

plan:
  - step: ...
  - step: ...

risks:
  - ...

verification:
  - command: ...
```

The plan should be stored in agent state.

---

# 13. DETERMINISTIC VERIFICATION

This is one of the most important requirements.

Never trust an LLM saying:

> "The tests should pass."

Actually execute them.

Detect available commands such as:

```text
npm test
pnpm test
yarn test

pytest
go test ./...
cargo test

dotnet test

mvn test
gradle test
```

Also detect:

```text
lint
typecheck
build
format
security scanning
```

Capture:

```json
{
  "command": "...",
  "exitCode": 0,
  "duration": 1234,
  "stdout": "...",
  "stderr": "..."
}
```

The machine result is authoritative.

---

# 14. PRODUCTION READINESS CHECK

Create a production-readiness evaluator.

It should inspect:

### Correctness

- tests
- edge cases
- error handling
- null handling
- concurrency
- retries

### Security

- secrets
- authentication
- authorization
- injection
- unsafe filesystem access
- command execution
- dependency vulnerabilities

### Reliability

- timeouts
- retries
- failure recovery
- resource handling
- logging

### Maintainability

- architecture
- duplication
- naming
- complexity
- documentation

### Observability

- logging
- metrics
- tracing
- meaningful errors

### Deployment

- environment variables
- configuration
- migrations
- build
- CI

---

# 15. REVIEW → REPAIR LOOP

Implement:

```text
Implementation
      ↓
Automated Tests
      ↓
LLM Review
      ↓
Static Analysis
      ↓
Security Review
      ↓
Production Review
      ↓
       ┌─────────────┐
       │             │
      PASS          FAIL
       │             │
       ↓             ↓
    COMPLETE       REPAIR
                       │
                       ↓
                    TEST
                       │
                       └──→ REVIEW
```

The agent should be able to automatically repair issues discovered by:

- tests
- compiler
- linter
- type checker
- security scanner
- reviewer

Set limits:

```yaml
repair:
  max_iterations: 5
  max_runtime_minutes: 30
  max_cost_usd: 5
```

---

# 16. SECOND-OPINION / ESCALATION

Use the `oracle` project as architectural inspiration.

If the primary agent is stuck:

```text
Primary Agent
      ↓
attempt
      ↓
failure
      ↓
escalation
      ↓
secondary model/agent
      ↓
recommendation
      ↓
primary agent
```

This should be optional.

Never make one specific model provider mandatory.

---

# 17. TOOL SYSTEM

Build a universal tool abstraction.

Support:

```text
Shell
Filesystem
Git
GitHub
MCP
Browser
HTTP
Search
Documentation
Database
Testing
Build
```

MCP support should be implemented in a way inspired by:

https://github.com/steipete/mcporter

The system should be able to discover and invoke MCP tools.

---

# 18. BROWSER CAPABILITY

Make browser automation optional.

Study:

https://github.com/steipete/sweetlink

Support:

```text
observe
navigate
click
type
extract
screenshot
```

Use observation/action loops:

```text
OBSERVE
  ↓
REASON
  ↓
ACT
  ↓
OBSERVE
```

---

# 19. COMPUTER-USE CAPABILITY

Make GUI automation optional.

Study:

https://github.com/steipete/Peekaboo

Do not make macOS-specific functionality part of the core.

Define a capability interface:

```typescript
interface ComputerUseProvider {
    screenshot(): Promise<Image>;

    click(x: number, y: number): Promise<void>;

    type(text: string): Promise<void>;
}
```

---

# 20. WORKFLOW ENGINE

Study:

https://github.com/steipete/lobster

Create a workflow abstraction supporting:

```text
sequential
parallel
conditional
approval
retry
timeout
rollback
```

Example:

```yaml
workflow: feature

steps:
  - recon
  - plan
  - implementation
  - test
  - review
  - repair
  - verify
```

Workflows must be inspectable and resumable.

---

# 21. EXECUTION ISOLATION

Study:

https://github.com/steipete/crabbox

Agent code execution should support:

```text
host
container
sandbox
```

with configurable permissions.

Never assume the agent should have unlimited access.

Integrate concepts from:

https://github.com/steipete/fs-safe

for filesystem boundaries.

---

# 22. GIT SAFETY

The plugin should understand:

```text
git status
git diff
git diff --cached
git log
git branch
```

Before modifying anything:

```text
capture baseline
```

After changes:

```text
capture diff
```

Never silently:

- delete unrelated user changes
- reset user work
- force push
- rewrite history
- overwrite uncommitted changes

Require explicit approval for dangerous operations.

---

# 23. PROJECT MEMORY

Create:

```text
.forge/
├── state.json
├── architecture.md
├── conventions.md
├── decisions.md
├── task-history/
├── reviews/
├── failures/
└── sessions/
```

Store useful project knowledge.

Do not store secrets.

Do not store raw credentials.

The system should allow future agent runs to understand previous decisions.

---

# 24. COST / LOOP CONTROL

Every run should track:

```text
tokens if available
estimated cost
runtime
number of iterations
tool calls
test runs
repair attempts
```

Provide:

```yaml
limits:
  max_iterations: 20
  max_repairs: 5
  max_runtime_minutes: 30
  max_cost_usd: 5
```

Prevent runaway agents.

---

# 25. MULTI-AGENT SUPPORT

Do not make multi-agent mandatory.

But design for:

```text
Orchestrator
   │
   ├── Research Agent
   ├── Implementation Agent
   ├── Review Agent
   └── Test Agent
```

Study:

https://github.com/steipete/crabfleet

for orchestration concepts.

Agents should communicate through structured artifacts rather than enormous raw transcripts.

---

# 26. UNIVERSAL INSTALLATION

The most important product requirement:

## The plugin must be easy to install.

Support:

```bash
npm install -g agent-superset
```

or an equivalent package manager.

Then:

```bash
agent-superset init
```

It should detect installed coding agents:

```text
Claude Code
Codex
OpenCode
```

and configure the appropriate integration.

Example:

```bash
agent-superset install claude
agent-superset install codex
agent-superset install opencode
```

Also support:

```bash
agent-superset install --all
```

---

# 27. NON-DESTRUCTIVE INSTALLATION

Never overwrite existing configuration without backup.

Before modifying:

```text
~/.claude/
~/.codex/
~/.config/opencode/
project configuration
```

create backups when necessary.

Installation must be idempotent:

```text
install
install again
install again
```

must not duplicate configuration.

---

# 28. PORTABLE CONFIGURATION

Use a central configuration:

```text
~/.agent-superset/
```

and project-level:

```text
.forge/
```

Possible structure:

```text
~/.agent-superset/
├── config.yaml
├── skills/
├── workflows/
├── adapters/
├── tools/
└── cache/
```

---

# 29. CLI

Implement:

```bash
agent-superset init
agent-superset install
agent-superset doctor
agent-superset status

agent-superset skills
agent-superset skills list
agent-superset skills validate

agent-superset run
agent-superset run --backend claude
agent-superset run --backend codex
agent-superset run --backend opencode

agent-superset review
agent-superset verify
agent-superset repair

agent-superset workflow list
agent-superset workflow run <name>

agent-superset doctor
agent-superset logs
agent-superset config
```

---

# 30. DOCTOR COMMAND

Implement:

```bash
agent-superset doctor
```

It should detect:

```text
✓ Node
✓ Git
✓ Docker
✓ Claude Code
✓ Codex
✓ OpenCode
✓ MCP
✓ project type
✓ test framework
✓ package manager
```

and show actionable errors.

---

# 31. OBSERVABILITY

Every agent run should produce structured logs.

Example:

```json
{
  "runId": "...",
  "backend": "codex",
  "task": "...",
  "startedAt": "...",
  "duration": 123,
  "iterations": 4,
  "toolCalls": 27,
  "tests": {
    "passed": true
  },
  "review": {
    "passed": true
  },
  "status": "completed"
}
```

Provide human-readable output as well.

---

# 32. BENCHMARK SYSTEM

Build an evaluation framework.

This is REQUIRED.

Create benchmark tasks representing:

```text
bug fixes
new features
refactors
API changes
database changes
security fixes
performance fixes
frontend changes
dependency upgrades
```

Run the same task using:

```text
Claude only
Codex only
OpenCode only
agent-superset + Claude
agent-superset + Codex
agent-superset + OpenCode
```

Measure:

```text
task success
tests passed
review score
repair count
runtime
cost
regressions
human intervention
```

This is how we determine whether the plugin actually improves agent performance.

---

# 33. TESTING REQUIREMENTS

The project itself must have:

### Unit tests

For:

- skill discovery
- configuration
- adapters
- routing
- workflows
- state
- limits

### Integration tests

For:

- Claude adapter
- Codex adapter
- OpenCode adapter
- MCP
- Git
- test execution
- filesystem isolation

### End-to-end tests

Example:

```text
Create test repository
        ↓
Give agent task
        ↓
Agent modifies repository
        ↓
Tests execute
        ↓
Review executes
        ↓
Repair if needed
        ↓
Final verification
```

---

# 34. SECURITY REQUIREMENTS

Treat this as production infrastructure.

Never:

- execute arbitrary downloaded code without warning
- expose credentials to LLM prompts
- log secrets
- silently upload source code
- silently modify unrelated repositories
- run destructive commands without policy
- allow unrestricted filesystem access by default

Implement:

```text
permission policies
command allowlists/denylists
filesystem boundaries
secret redaction
audit logging
approval gates
```

---

# 35. LICENSE / UPSTREAM COMPLIANCE

Before copying code from any repository:

1. Inspect its license.
2. Preserve required copyright/license notices.
3. Keep attribution where required.
4. Do not copy code if its license is incompatible.
5. Prefer adapters, dependencies, or reimplementations when appropriate.
6. Clearly document upstream components.

Do not assume every repository has the same license.

---

# 36. DO NOT OVERENGINEER THE FIRST VERSION

Build in stages.

## Phase 1

Implement:

```text
agent-scripts compatibility
+
skill discovery
+
Claude adapter
+
Codex adapter
+
OpenCode adapter
+
CLI
+
basic workflows
+
verification
```

## Phase 2

Add:

```text
MCP
+
acpx
+
lobster-style workflows
+
review/repair
+
project memory
```

## Phase 3

Add:

```text
sandbox
+
Crabbox concepts
+
fs-safe concepts
+
browser
+
computer use
```

## Phase 4

Add:

```text
multi-agent
+
Crabfleet concepts
+
benchmarking
+
model routing
+
cost optimization
```

---

# 37. TECHNOLOGY CHOICE

Before implementation, inspect the referenced projects and select a technology stack that minimizes complexity and maximizes compatibility.

Prefer:

```text
TypeScript / Node.js
```

if appropriate because the plugin must integrate with multiple CLI-based coding agents and MCP.

Do not introduce unnecessary frameworks.

Use simple modules with clear interfaces.

---

# 38. REPOSITORY STRUCTURE

Start with:

```text
agent-superset/
│
├── README.md
├── LICENSE
├── package.json
├── tsconfig.json
│
├── src/
│   ├── cli/
│   ├── core/
│   ├── adapters/
│   │   ├── claude/
│   │   ├── codex/
│   │   └── opencode/
│   ├── skills/
│   ├── workflows/
│   ├── tools/
│   ├── execution/
│   ├── verification/
│   ├── review/
│   ├── memory/
│   ├── security/
│   └── telemetry/
│
├── skills/
│   ├── planning/
│   ├── implementation/
│   ├── debugging/
│   ├── testing/
│   ├── security/
│   ├── code-review/
│   └── production-readiness/
│
├── workflows/
│   ├── feature.yaml
│   ├── bugfix.yaml
│   ├── refactor.yaml
│   └── production.yaml
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
    ├── architecture.md
    ├── installation.md
    ├── integrations.md
    ├── skills.md
    ├── workflows.md
    └── security.md
```

---

# 39. IMPLEMENTATION PROCESS

Do not immediately start writing hundreds of files.

First:

### Step 1

Inspect all primary upstream repositories.

### Step 2

Produce:

```text
docs/upstream-analysis.md
```

containing:

```text
repository
purpose
important components
reusable components
dependencies
license
integration strategy
what we will use
what we will not use
```

### Step 3

Produce:

```text
docs/architecture.md
```

### Step 4

Implement the smallest functional vertical slice.

### Step 5

Run tests.

### Step 6

Integrate the next capability.

### Step 7

Run tests again.

### Step 8

Continuously verify the final product.

---

# 40. IMPORTANT ENGINEERING RULE

Do not confuse:

```text
more tools
```

with:

```text
better agent
```

The plugin should intelligently decide:

```text
which skill
which tool
which workflow
which model/backend
which verification
which reviewer
```

for each task.

Avoid loading everything into every agent context.

---

# 41. EXPECTED FINAL USER EXPERIENCE

A developer should be able to install:

```bash
npm install -g agent-superset
```

then:

```bash
cd my-project

agent-superset init
```

Then use:

```bash
agent-superset run "Implement refresh token rotation"
```

or:

```bash
agent-superset run --backend codex "Implement refresh token rotation"
```

The plugin should:

```text
detect project
      ↓
inspect repository
      ↓
select skills
      ↓
create plan
      ↓
invoke selected coding agent
      ↓
execute changes
      ↓
run tests
      ↓
review changes
      ↓
repair failures
      ↓
run tests again
      ↓
security check
      ↓
production-readiness check
      ↓
final verification
      ↓
report
```

The developer should receive a concise final report:

```text
✓ Implementation complete

Changed:
  8 files

Tests:
  47 passed
  0 failed

Lint:
  passed

Typecheck:
  passed

Security:
  passed

Review:
  passed

Repair iterations:
  2

Backend:
  Codex

Status:
  PRODUCTION READY
```

---

# 42. FINAL PRINCIPLE

The resulting project should combine the best relevant ideas from:

- https://github.com/steipete/agent-scripts
- https://github.com/openclaw/openclaw
- https://github.com/steipete/acpx
- https://github.com/steipete/mcporter
- https://github.com/steipete/lobster
- https://github.com/steipete/crabbox
- https://github.com/steipete/crabfleet
- https://github.com/steipete/clawpatch
- https://github.com/steipete/fs-safe
- https://github.com/steipete/summarize
- https://github.com/steipete/sweetlink
- https://github.com/steipete/Peekaboo
- https://github.com/steipete/oracle
- https://github.com/steipete/gogcli
- https://github.com/steipete/gitcrawl

But **do not blindly copy them**.

The final product should be a coherent, portable, maintainable system.

The foundation is:

```text
agent-scripts
```

The execution/session layer is inspired by:

```text
acpx
OpenClaw
```

The tool layer is inspired by:

```text
mcporter
```

The workflow layer is inspired by:

```text
lobster
```

The isolated execution layer is inspired by:

```text
Crabbox
fs-safe
```

The orchestration layer is inspired by:

```text
Crabfleet
```

The review/repair layer is inspired by:

```text
clawpatch
```

The capability layer is inspired by:

```text
summarize
sweetlink
Peekaboo
gogcli
gitcrawl
oracle
```

The result must work **with Claude Code, Codex CLI, and OpenCode without forcing the user to switch agent platforms**.

Build it as a genuine production software project, not as a collection of prompts.

Start by researching the upstream repositories and producing `docs/upstream-analysis.md`. Then produce the architecture and begin implementation.