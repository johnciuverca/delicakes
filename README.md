# DELICAKES

DELICAKES is a full-stack web application for browsing cake recipes and managing application data through a React frontend, Node.js services, and a PostgreSQL-backed API.

The project includes a main recipe experience, authentication flows, a recipes API, and a separate expense-tracker interface.

## Technology stack

- React and React DOM
- TypeScript
- React Router
- React Hook Form
- Node.js and Express
- PostgreSQL
- Webpack
- Vitest and Testing Library
- Git and GitHub

## Features

- Homepage with cake carousel
- Recipe browsing and case-insensitive recipe search
- Empty-state handling when no recipes match a search
- About and Contact pages
- Login and registration flows
- Authentication middleware and protected API behavior
- Recipes API backed by PostgreSQL
- Expense-tracker interface
- Responsive, component-based user interfaces

## Repository structure

- `app/UI/mainUI` — main React and TypeScript user interface
- `app/UI/expense-tracker` — expense-tracker frontend
- `app/server` — main Node.js and Express application server
- `api` — PostgreSQL-backed API service
- `docs` — planning and technical documentation

## Development setup

### Prerequisites

- Node.js and npm
- PostgreSQL for the data-backed API features

### Start the application

From the repository root:

```bash
./scripts/start-servers.sh --watch
```

- Application server: http://localhost:3000
- Data API: http://localhost:3100

To start without automatic dependency installation:

```bash
./scripts/start-servers.sh --watch --no-install
```

### Stop the application

```bash
./scripts/stop-servers.sh
```

## Useful commands

Build the main UI:

```bash
npm --prefix app/UI/mainUI run build
```

Build the API:

```bash
npm --prefix api run build
```

Run the main UI checks:

```bash
npm --prefix app/UI/mainUI run test
npm --prefix app/UI/mainUI run lint
```

## Project diagrams

### Use-case diagram

<img width="864" height="398" alt="DELICAKES use-case diagram" src="https://github.com/user-attachments/assets/8cecd145-cfad-4af5-8679-202f6fd601b2">

### `addTransaction` flow diagram

<img width="257" height="418" alt="addTransaction flow diagram" src="https://github.com/user-attachments/assets/5fb150a3-e545-4afe-bdc5-030e66b906db">

### `addTransaction` sequence diagram

<img width="688" height="443" alt="addTransaction sequence diagram" src="https://github.com/user-attachments/assets/87fb4342-e3bd-46b7-a9fb-34c689130ae1">

### `addTransaction` diagrams

<img width="403" height="352" alt="addTransaction diagrams" src="https://github.com/user-attachments/assets/01f33df2-22fe-4b7f-b1f6-27d3ccce5811">

## Recipe search

The recipes page includes a search box that:

- Updates the recipe list as the user types
- Matches recipe names case-insensitively
- Matches any part of a recipe name
- Shows a `No recipes found` message when there are no matches
- Restores the full list when the search is cleared

## Development workflow

Work is tracked through GitHub Issues and Project boards. Changes are developed on branches and merged through pull requests rather than committed directly to `main`.

The repository uses the following branch prefixes:

- `feat` — new functionality
- `fix` — bug fixes
- `chore` — maintenance or tooling
- `docs` — documentation-only changes

## Current status

DELICAKES is under active development. The application is being expanded incrementally with additional API functionality, authentication behavior, recipes features, testing, and documentation.
