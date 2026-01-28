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

Set the following environment variables to use the Gemini model via Vertex AI:

- `GOOGLE_APPLICATION_CREDENTIALS` - Path to your Google service account JSON key
- `GOOGLE_PROJECT_ID` - Your GCP project ID (recommended for service accounts)
- `GOOGLE_LOCATION` - Vertex AI region (defaults to `us-central1`)

## Endpoints

- `GET /health` - Health check endpoint
- `GET /api/hello` - Example API endpoint
- `POST /api/agent` - Agent chat endpoint (JSON: `{ "message": "..." }`)

The server runs on `http://localhost:3001` by default.