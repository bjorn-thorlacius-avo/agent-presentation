# AI Agent Presentation Backend

Simple Node.js TypeScript Express backend server.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm start
```

## Environment

Set the following environment variables to use Anthropic:

- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `ANTHROPIC_MODEL` - Model name (defaults to `claude-sonnet-4-6`)

The backend uses Anthropic Sonnet 4.6 through the Anthropic API.

## Endpoints

- `GET /health` - Health check endpoint
- `GET /api/hello` - Example API endpoint
- `POST /api/agent` - Agent chat endpoint (JSON: `{ "message": "..." }`)

The server runs on `http://localhost:3001` by default.