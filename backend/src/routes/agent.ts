import { getAgent } from '../agents/agentFactory';
import { createAgentRouter } from './agentRouterFactory';

export const agentRouter = createAgentRouter(() => getAgent());
