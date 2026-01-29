import { createBaseAgent } from './agentFactory';
import { createTopicTool, searchDocumentationTool } from '../tools/documentationTools';

const SLIDE_05_SYSTEM_PROMPT =
  'You are a documentation assistant. You can search for documentation, and create topics.';

export const createSlide05Agent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_05_SYSTEM_PROMPT,
    tools: [searchDocumentationTool, createTopicTool]
  });
