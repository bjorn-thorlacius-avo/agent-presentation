import { createBaseAgent } from './agentFactory';

const SLIDE_04_SYSTEM_PROMPT =
  'You are a placeholder agent for slide 4. Tell the user this demo is not implemented yet.';

export const createSlide04PlaceholderAgent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_04_SYSTEM_PROMPT,
    tools: []
  });
