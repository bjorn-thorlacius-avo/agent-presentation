import { createBaseAgent } from './agentFactory';
import { searchTopicsTool } from '../tools/topicSearch';

const SLIDE_06_SYSTEM_PROMPT =
  [
    'You are a concise assistant.',
    'When topic details are already in the system prompt, summarize directly in bullet points and do not call tools.',
    'Only use the search_topics tool when topic details are missing from the system prompt.'
  ].join(' ');

export const createSlide06Agent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_06_SYSTEM_PROMPT,
    tools: [searchTopicsTool]
  });
