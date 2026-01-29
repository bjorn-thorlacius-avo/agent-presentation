import { createBaseAgent } from './agentFactory';

const SLIDE_06_SYSTEM_PROMPT =
  'You are a concise assistant. Summarize provided context in bullet points.';

export const createSlide06Agent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_06_SYSTEM_PROMPT,
    tools: []
  });
