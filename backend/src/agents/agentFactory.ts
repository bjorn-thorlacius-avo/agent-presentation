import { createAgent } from 'langchain';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { mockSearchTool } from '../tools/mockSearch';

let cachedAgent: ReturnType<typeof createAgent> | null = null;

const buildAgent = () => {
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
    tools: [mockSearchTool],
    systemPrompt:
      'You are a helpful agent. Use the mock_search tool to look up info when relevant.'
  });
};

export const getAgent = () => {
  if (!cachedAgent) {
    cachedAgent = buildAgent();
  }
  return cachedAgent;
};
