import { Router, Request, Response } from 'express';
import { getAgent } from '../agents/agentFactory';
import { appendSessionMessage, getSessionMessages } from '../memory/sessionStore';
import { extractReply } from '../utils/extractReply';

type AgentRequestBody = {
  message?: string;
  sessionId?: string;
};

export const agentRouter = Router();

agentRouter.post('/', async (req: Request<{}, {}, AgentRequestBody>, res: Response) => {
  const message = req.body?.message?.trim();
  const sessionId = req.body?.sessionId?.trim();
  if (!message || !sessionId) {
    res.status(400).json({ error: 'Message and sessionId are required.' });
    return;
  }

  try {
    const agent = getAgent();
    console.log('Agent request received:', {
      messageLength: message.length
    });
    appendSessionMessage(sessionId, { role: 'user', content: message });
    const history = getSessionMessages(sessionId);
    const result = await agent.invoke({ messages: history });
    const reply = extractReply(result) || 'No response generated.';
    appendSessionMessage(sessionId, { role: 'assistant', content: reply });
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
