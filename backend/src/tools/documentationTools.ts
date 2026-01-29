import { z } from 'zod';
import { createTrackedTool } from './baseTool';
import {
  addSessionTopic,
  getCurrentResponse,
  getCurrentSessionId,
  hasDocumentationSearched,
  markDocumentationSearched
} from '../memory/sessionStore';

const FAKE_DOCS = [
  {
    id: 'doc-001',
    title: 'Agent Tool Patterns',
    summary: 'Guidance on chaining tools and gating behavior.'
  },
  {
    id: 'doc-002',
    title: 'Documentation Search',
    summary: 'Tips for extracting context before drafting topics.'
  },
  {
    id: 'doc-003',
    title: 'Topic Drafting',
    summary: 'How to turn research into concise docs.'
  }
];

export const searchDocumentationTool = createTrackedTool(
  async ({ query }: { query: string }) => {
    const sessionId = getCurrentSessionId();
    if (sessionId) {
      markDocumentationSearched(sessionId);
    }
    const normalized = query.toLowerCase();
    const matches = FAKE_DOCS.filter((doc) =>
      doc.title.toLowerCase().includes(normalized)
      || doc.summary.toLowerCase().includes(normalized)
    );
    return JSON.stringify({
      query,
      results: matches.length > 0 ? matches : FAKE_DOCS
    });
  },
  {
    name: 'search_documentation',
    description: 'Searches documentation and returns relevant summaries.',
    schema: z.object({
      query: z.string().describe('Search query for documentation')
    })
  }
);

export const createTopicTool = createTrackedTool(
  async ({ topic, summary }: { topic: string; summary?: string }) => {
    const sessionId = getCurrentSessionId();
    if (!sessionId) {
      throw new Error('Missing session context.');
    }
    if (!hasDocumentationSearched(sessionId)) {
      throw new Error('Missing documentation context. Search first.');
    }

    const title = topic.trim();
    const topicSummary =
      summary?.trim()
      || 'A concise documentation topic drafted from search results.';
    const updatedTopics = addSessionTopic(sessionId, {
      title,
      summary: topicSummary
    });
    const response = getCurrentResponse();
    const reply =
      summary?.trim()
      || `Created topic "${topic}".`;

    if (response && !response.headersSent) {
      response.json({
        reply,
        topics: updatedTopics
      });
    }

    return JSON.stringify({
      topic: title,
      topics: updatedTopics
    });
  },
  {
    name: 'create_topic',
    description:
      'Creates a documentation topic using prior context.',
    schema: z.object({
      topic: z.string().describe('Topic title to create'),
      summary: z.string().optional().describe('Optional summary for the topic')
    })
  }
);
