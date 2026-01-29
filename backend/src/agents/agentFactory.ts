import { createAgent } from 'langchain';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TOOLS } from './agentDefaults';

let cachedAgent: ReturnType<typeof createAgent> | null = null;

type AgentOptions = Parameters<typeof createAgent>[0];
type AgentOverrides = Pick<AgentOptions, 'tools' | 'systemPrompt'>;

const buildAgent = (overrides: Partial<AgentOverrides> = {}) => {
  const missingEnv: string[] = [];
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    missingEnv.push('GOOGLE_APPLICATION_CREDENTIALS');
  }
  if (missingEnv.length > 0) {
    throw new Error(`Missing env vars: ${missingEnv.join(', ')}`);
  }

  const llm = new ChatVertexAI({
    model: 'gemini-2.5-flash',
    location: process.env.GOOGLE_LOCATION || 'us-central1',
    authOptions: {
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      projectId: process.env.GOOGLE_PROJECT_ID
    }
  });

  return createAgent({
    model: llm,
    tools: overrides.tools ?? DEFAULT_TOOLS,
    systemPrompt: overrides.systemPrompt ?? DEFAULT_SYSTEM_PROMPT
  });
};

export const getAgent = (): ReturnType<typeof createAgent> => {
  if (!cachedAgent) {
    cachedAgent = buildAgent();
  }
  return cachedAgent;
};

export const createBaseAgent = (overrides: Partial<AgentOverrides> = {}) =>
  buildAgent(overrides);
