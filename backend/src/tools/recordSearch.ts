import { z } from 'zod';
import { createTrackedTool } from './baseTool';

const RECORDS = [
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
    summary: 'Examples of tool usage with simulated latency.',
    tags: ['tools', 'latency', 'demo']
  }
];

export const recordSearchTool = createTrackedTool(
  async ({ query, numberOfResults }: { query: string; numberOfResults: number }) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const normalized = query.toLowerCase();
    const matches = RECORDS.filter((record) => {
      return (
        record.title.toLowerCase().includes(normalized) ||
        record.summary.toLowerCase().includes(normalized) ||
        record.tags.some((tag) => tag.toLowerCase().includes(normalized))
      );
    }).slice(0, numberOfResults);

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
    name: 'record_search',
    description: 'Searches the record database with a small delay.',
    schema: z.object({
      query: z.string().describe('Search query for the record database'),
      numberOfResults: z.number().describe('Number of results to return')
    })
  }
);
