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

Set the following environment variables to use Ollama locally:

- `OLLAMA_BASE_URL` - Ollama host (defaults to `http://127.0.0.1:11434`)
- `OLLAMA_MODEL` - Model name to run (defaults to `gpt-oss:20b`)

Then pull the model before starting the backend:

```bash
ollama pull gpt-oss:20b
```

## Endpoints

- `GET /health` - Health check endpoint
- `GET /api/hello` - Example API endpoint
- `POST /api/agent` - Agent chat endpoint (JSON: `{ "message": "..." }`)

The server runs on `http://localhost:3001` by default.