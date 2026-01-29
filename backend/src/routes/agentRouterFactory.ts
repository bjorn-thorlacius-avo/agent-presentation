import { Router, Request, Response } from 'express';
import { createAgent } from 'langchain';
import { createBaseAgent } from '../agents/agentFactory';
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
  context?: {
    topic?: {
      title?: string;
      info?: string;
    };
  };
};

type AgentResolver = (agentId?: string) => ReturnType<typeof createAgent>;

export const createAgentRouter = (resolveAgent: AgentResolver) => {
  const router = Router();

  const buildSlide06Prompt = (topic?: { title?: string; info?: string }) => {
    const title = topic?.title?.trim() || 'Untitled topic';
    const info = topic?.info?.trim() || 'No additional context provided.';
    return [
      'You are a concise assistant.',
      'Use the provided topic context without calling any tools to fetch it.',
      'Summarize the topic in bullet points.',
      '',
      `Topic title: ${title}`,
      `Topic info: ${info}`
    ].join('\n');
  };

  router.post('/', async (req: Request<{}, {}, AgentRequestBody>, res: Response) => {
    const message = req.body?.message?.trim();
    const sessionId = req.body?.sessionId?.trim();
    const agentId = req.body?.agentId?.trim();
    const topicContext = req.body?.context?.topic;
    if (!message || !sessionId) {
      res.status(400).json({ error: 'Message and sessionId are required.' });
      return;
    }

    try {
      const agent =
        agentId === 'slide-6' && topicContext
          ? createBaseAgent({
            systemPrompt: buildSlide06Prompt(topicContext),
            tools: []
          })
          : resolveAgent(agentId);
      console.log('Agent request received:', {
        messageLength: message.length
      });
      const reply = await runWithSessionContext(
        {
          sessionId,
          response:
            agentId === 'slide-4'
            || agentId === 'slide-5'
              ? res
              : undefined
        },
        async () => {
        appendSessionMessage(sessionId, { role: 'user', content: message });
        const history = getSessionMessages(sessionId);
        const result = await agent.invoke({ messages: history });
        const reply = extractReply(result) || 'No response generated.';
        appendSessionMessage(sessionId, { role: 'assistant', content: reply });
        return reply;
        }
      );
      console.log('Agent response ready:', {
        replyLength: reply.length
      });
      if (!res.headersSent) {
        res.json({ reply });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected agent error.';
      if (!res.headersSent) {
        res.status(500).json({ error: message });
      }
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
