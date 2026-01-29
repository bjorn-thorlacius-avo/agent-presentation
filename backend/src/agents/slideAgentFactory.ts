import { createAgent } from 'langchain';
import { getAgent } from './agentFactory';
import {
  createSlide03OneToolAgent,
  createSlide03TwoToolAgent
} from './slide03Agents';
import { createSlide04NotificationAgent } from './slide04Agents';
import { createSlide05Agent } from './slide05Agents';

let cachedTwoToolAgent: ReturnType<typeof createAgent> | null = null;
let cachedOneToolAgent: ReturnType<typeof createAgent> | null = null;
let cachedSlide04Agent: ReturnType<typeof createAgent> | null = null;
let cachedSlide05Agent: ReturnType<typeof createAgent> | null = null;

export const getSlideAgent = (
  agentId?: string
): ReturnType<typeof createAgent> => {
  if (agentId === 'two-tool') {
    const agent = cachedTwoToolAgent ?? createSlide03TwoToolAgent();
    cachedTwoToolAgent = agent;
    return agent;
  }
  if (agentId === 'one-tool') {
    const agent = cachedOneToolAgent ?? createSlide03OneToolAgent();
    cachedOneToolAgent = agent;
    return agent;
  }
  if (agentId === 'slide-4') {
    const agent = cachedSlide04Agent ?? createSlide04NotificationAgent();
    cachedSlide04Agent = agent;
    return agent;
  }
  if (agentId === 'slide-5') {
    const agent = cachedSlide05Agent ?? createSlide05Agent();
    cachedSlide05Agent = agent;
    return agent;
  }
  return getAgent();
};
