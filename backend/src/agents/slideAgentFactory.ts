import { createAgent } from 'langchain';
import { getAgent } from './agentFactory';
import { createOneToolAgent, createTwoToolAgent } from './slideAgents';

let cachedTwoToolAgent: ReturnType<typeof createAgent> | null = null;
let cachedOneToolAgent: ReturnType<typeof createAgent> | null = null;

export const getSlideAgent = (
  agentId?: string
): ReturnType<typeof createAgent> => {
  if (agentId === 'two-tool') {
    const agent = cachedTwoToolAgent ?? createTwoToolAgent();
    cachedTwoToolAgent = agent;
    return agent;
  }
  if (agentId === 'one-tool') {
    const agent = cachedOneToolAgent ?? createOneToolAgent();
    cachedOneToolAgent = agent;
    return agent;
  }
  return getAgent();
};
