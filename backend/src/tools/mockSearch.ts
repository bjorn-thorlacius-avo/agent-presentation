import { tool } from 'langchain';
import { z } from 'zod';

const MOCK_RECORDS = [
  {
    id: 'agent-001',
    title: 'LangChain Intro',
    summary: 'Overview of LangChain agents and tools.',
    tags: ['langchain', 'agents', 'tools']
  },
  {
    id: 'agent-002',
    title: 'Gemini Models',
    summary: 'Notes about Gemini 2.5 Flash and Vertex AI.',
    tags: ['gemini', 'vertex', 'model']
  },
  {
    id: 'agent-003',
    title: 'Tooling Patterns',
    summary: 'Examples of mock tools with simulated latency.',
    tags: ['tools', 'latency', 'mock']
  }
];

export const mockSearchTool = tool(
  async ({ query }: { query: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const normalized = query.toLowerCase();
    const matches = MOCK_RECORDS.filter((record) => {
      return (
        record.title.toLowerCase().includes(normalized) ||
        record.summary.toLowerCase().includes(normalized) ||
        record.tags.some((tag) => tag.toLowerCase().includes(normalized))
      );
    });

    if (matches.length === 0) {
      return JSON.stringify({ results: [], note: 'No matches found.' });
    }

    return JSON.stringify({
      results: matches.map((record) => ({
        id: record.id,
        title: record.title,
        summary: record.summary
      }))
    });
  },
  {
    name: 'mock_search',
    description: 'Searches a mock database with a small delay.',
    schema: z.object({
      query: z.string().describe('Search query for the mock database')
    })
  }
);
