# delicakes

## Development Setup

### Prerequisites

- Node.js + npm installed
- macOS (the helper scripts open new Terminal windows)

### Start (dev)

From the repo root:

```bash
./scripts/start-servers.sh --watch
```

- App server: http://localhost:3000
- Data API: http://localhost:3100

### Stop

```bash
./scripts/stop-servers.sh
```

## Windows (batch scripts)

From the repo root in `cmd.exe` or PowerShell:

```bat
scripts\start-servers.bat
```

Optional UI watch mode (opens a third terminal for `mainUI` + `expense-tracker` watches):

```bat
scripts\start-servers.bat --watch
```

Stop all terminals started by the batch script:

```bat
scripts\stop-servers.bat
```

### Notes

- `app/server` is the main entrypoint (it also builds/watches `mainUI` and `expense-tracker`).
- If you don’t want installs to run automatically, use:

```bash
./scripts/start-servers.sh --watch --no-install
```

## Use-Case Diagram

<img width="864" height="398" alt="image" src="https://github.com/user-attachments/assets/8cecd145-cfad-4af5-8679-202f6fd601b2" />

## Flow Diagram (addTransaction)

<img width="257" height="418" alt="image" src="https://github.com/user-attachments/assets/5fb150a3-e545-4afe-bdc5-030e66b906db" />

## Sequence Diagram (addTransaction)

<img width="688" height="443" alt="image" src="https://github.com/user-attachments/assets/87fb4342-e3bd-46b7-a9fb-34c689130ae1" />

## Diagrams (addTransaction)

<img width="403" height="352" alt="image" src="https://github.com/user-attachments/assets/01f33df2-22fe-4b7f-b1f6-27d3ccce5811" />

## Development Workflow

### Project Tracking

Work is tracked in the GitHub Project board:
https://github.com/users/johnciuverca/projects/5

Project states:

1. Backlog
2. In Progress
3. In Review
4. Done

All work must be completed on a branch and merged through a pull request.
Do not commit directly to main.

### Branch Naming

Use this branch format:

type/TICKET-short-description

Allowed branch type prefixes:

1. feat for new features
2. fix for bug fixes
3. chore for maintenance or tooling work
4. docs for documentation-only changes

Examples:

1. feat/ENG-001-delivery-workflow-baseline
2. feat/ENG-002-recipe-search
3. feat/ENG-003-recipe-filter-category
4. chore/ENG-006-lint-test-ci-baseline
5. docs/ENG-001-workflow-docs

### Pull Requests

Every pull request must:

1. Include a real GitHub issue reference
2. Include manual test notes
3. Include a risk summary
4. Include screenshots or video for UI changes

## Automated Testing

Automated tests are not yet enforced by CI. This is a known gap and will be addressed in a future ticket. Currently, only linting and formatting are enforced as quality gates.

{displayedRecipes.length === 0 && (

  <div>No recipes found</div>
)}
