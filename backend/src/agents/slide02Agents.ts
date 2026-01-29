import { recordSearchTool } from '../tools/recordSearch';

export const SLIDE_02_SYSTEM_PROMPT =
  'You are a helpful agent. Use the record_search tool to look up info when relevant.';

export const SLIDE_02_TOOLS = [recordSearchTool];
