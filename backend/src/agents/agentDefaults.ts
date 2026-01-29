import { mockSearchTool } from '../tools/mockSearch';

export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful agent. Use the mock_search tool to look up info when relevant.';

export const DEFAULT_TOOLS = [mockSearchTool];
