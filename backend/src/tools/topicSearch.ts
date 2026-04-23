import { z } from 'zod';
import { createTrackedTool } from './baseTool';

type TopicRecord = {
  title: string;
  info: string;
};

const TOPICS: TopicRecord[] = [
  {
    title: 'Release cadence',
    info: 'The product ships monthly, on the first Tuesday. Security fixes are released within 48 hours.'
  },
  {
    title: 'Pricing tiers',
    info: 'Starter is $29/month, Pro is $99/month, Enterprise is custom with annual contracts.'
  },
  {
    title: 'Support hours',
    info: 'Support is available 24/7 for enterprise and 9am-5pm local time for other tiers.'
  }
];

export const searchTopicsTool = createTrackedTool(
  async ({ query, maxResults }: { query: string; maxResults: number }) => {
    const normalized = query.toLowerCase().trim();
    const matches = TOPICS.filter((topic) => (
      topic.title.toLowerCase().includes(normalized)
      || topic.info.toLowerCase().includes(normalized)
    )).slice(0, maxResults);

    return JSON.stringify({
      query,
      results: matches.length > 0 ? matches : TOPICS.slice(0, maxResults)
    });
  },
  {
    name: 'search_topics',
    description:
      'Search topics and read their details when topic information is missing from prompt context.',
    schema: z.object({
      query: z.string().describe('Topic query to search for'),
      maxResults: z.number().int().min(1).max(5).default(3)
    })
  }
);
