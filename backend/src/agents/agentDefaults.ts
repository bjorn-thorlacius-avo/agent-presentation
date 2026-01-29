import { recordSearchTool } from '../tools/recordSearch';

export const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful agent. Use the record_search tool to look up info when relevant.';

export const DEFAULT_TOOLS = [recordSearchTool];
