import { Router, Request, Response } from 'express';
import { getAgent } from '../agents/agentFactory';
import { extractReply } from '../utils/extractReply';

type AgentRequestBody = {
  message?: string;
};

export const agentRouter = Router();

agentRouter.post('/', async (req: Request<{}, {}, AgentRequestBody>, res: Response) => {
  const message = req.body?.message?.trim();
  if (!message) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  try {
    const agent = getAgent();
    console.log('Agent request received:', {
      messageLength: message.length
    });
    const result = await agent.invoke({
      messages: [{ role: 'user', content: message }]
    });
    const reply = extractReply(result) || 'No response generated.';
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
