# Agent Presentation

Monorepo with a React frontend and Node.js backend for the AI agent presentation.

## Setup

Requires [pnpm](https://pnpm.io/) and Node.js 18+.

```bash
pnpm install
```

## Development

Run backend and frontend together:

```bash
pnpm dev
```

## Scripts

| Command   | Description                    |
| --------- | ------------------------------ |
| `pnpm dev`   | Start backend + frontend (Turborepo) |
| `pnpm build` | Build all packages             |
| `pnpm start` | Start all packages (production) |

## Structure

- **backend/** — Express API (LangChain, agents)
- **frontend/** — React + Vite app

See each package’s README for more detail.
