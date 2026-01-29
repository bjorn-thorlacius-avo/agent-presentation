import { tool } from 'langchain';
import { z } from 'zod';
import {
  appendSessionToolCall,
  getCurrentSessionId,
  updateSessionToolCall
} from '../memory/sessionStore';

type TrackedToolOptions<TSchema extends z.ZodTypeAny> = {
  name: string;
  description: string;
  schema: TSchema;
};

const generateCallId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `tool-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createTrackedTool = <TSchema extends z.ZodTypeAny, TResult>(
  handler: (input: z.infer<TSchema>) => Promise<TResult>,
  options: TrackedToolOptions<TSchema>
) => {
  return tool(async (input: z.infer<TSchema>) => {
    const sessionId = getCurrentSessionId();
    const startedAt = new Date().toISOString();
    const callId = generateCallId();

    if (sessionId) {
      appendSessionToolCall(sessionId, {
        id: callId,
        name: options.name,
        status: 'started',
        startedAt,
        input
      });
    }

    try {
      const result = await handler(input);
      if (sessionId) {
        updateSessionToolCall(sessionId, callId, {
          status: 'completed',
          endedAt: new Date().toISOString(),
          output: result
        });
      }
      return result;
    } catch (error) {
      if (sessionId) {
        updateSessionToolCall(sessionId, callId, {
          status: 'failed',
          endedAt: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Tool failed.'
        });
      }
      throw error;
    }
  }, options);
};
