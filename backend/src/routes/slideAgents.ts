import { getSlideAgent } from '../agents/slideAgentFactory';
import { createAgentRouter } from './agentRouterFactory';

export const slideAgentRouter = createAgentRouter(getSlideAgent);
