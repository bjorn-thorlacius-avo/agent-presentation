import { Router, Request, Response } from 'express';
import { createAgent } from 'langchain';
import {
  appendSessionMessage,
  getSessionMessages,
  getSessionToolCalls,
  runWithSessionContext
} from '../memory/sessionStore';
import { extractReply } from '../utils/extractReply';

type AgentRequestBody = {
  message?: string;
  sessionId?: string;
  agentId?: string;
};

type AgentResolver = (agentId?: string) => ReturnType<typeof createAgent>;

export const createAgentRouter = (resolveAgent: AgentResolver) => {
  const router = Router();

  router.post('/', async (req: Request<{}, {}, AgentRequestBody>, res: Response) => {
    const message = req.body?.message?.trim();
    const sessionId = req.body?.sessionId?.trim();
    if (!message || !sessionId) {
      res.status(400).json({ error: 'Message and sessionId are required.' });
      return;
    }

    try {
      const agent = resolveAgent(req.body?.agentId);
      console.log('Agent request received:', {
        messageLength: message.length
      });
      const reply = await runWithSessionContext(sessionId, async () => {
        appendSessionMessage(sessionId, { role: 'user', content: message });
        const history = getSessionMessages(sessionId);
        const result = await agent.invoke({ messages: history });
        const reply = extractReply(result) || 'No response generated.';
        appendSessionMessage(sessionId, { role: 'assistant', content: reply });
        return reply;
      });
      console.log('Agent response ready:', {
        replyLength: reply.length
      });
      res.json({ reply });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected agent error.';
      res.status(500).json({ error: message });
    }
  });

  router.get(
    '/tool-calls',
    (req: Request<{}, {}, {}, { sessionId?: string }>, res: Response) => {
      const rawSessionId = req.query?.sessionId;
      const sessionId =
        typeof rawSessionId === 'string' ? rawSessionId.trim() : '';
      if (!sessionId) {
        res.status(400).json({ error: 'sessionId is required.' });
        return;
      }
      res.json({ toolCalls: getSessionToolCalls(sessionId) });
    }
  );

  return router;
};
