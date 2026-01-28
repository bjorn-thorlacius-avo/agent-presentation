import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { agentRouter } from './routes/agent';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  app.get('/api/hello', (_req, res) => {
    res.json({ message: 'Hello from the backend!' });
  });

  app.use('/api/agent', agentRouter);

  return app;
};
