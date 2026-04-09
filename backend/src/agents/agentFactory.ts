import { createAgent } from 'langchain';
import { SLIDE_02_SYSTEM_PROMPT, SLIDE_02_TOOLS } from './slide02Agents';

let cachedAgent: ReturnType<typeof createAgent> | null = null;

type AgentOptions = Parameters<typeof createAgent>[0];
type AgentOverrides = Pick<AgentOptions, 'tools' | 'systemPrompt'>;

const buildAgent = (overrides: Partial<AgentOverrides> = {}) => {
  const ollamaModel = process.env.OLLAMA_MODEL || 'gpt-oss:20b';
  process.env.OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';

  return createAgent({
    model: `ollama:${ollamaModel}`,
    tools: overrides.tools ?? SLIDE_02_TOOLS,
    systemPrompt: overrides.systemPrompt ?? SLIDE_02_SYSTEM_PROMPT
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
