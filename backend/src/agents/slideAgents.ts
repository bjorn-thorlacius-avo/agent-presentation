import { createBaseAgent } from './agentFactory';
import {
  updateAndValidateRecordTool,
  updateRecordTool,
  validateRecordTool
} from '../tools/recordTools';

const TWO_TOOL_SYSTEM_PROMPT =
  'You are a verbose demo agent. You can update or validate records. You are verbose and always report back all the details.';

const ONE_TOOL_SYSTEM_PROMPT =
  'You are a verbose demo agent. You can update records. You are verbose and always report back all the details.';

export const createTwoToolAgent = () =>
  createBaseAgent({
    systemPrompt: TWO_TOOL_SYSTEM_PROMPT,
    tools: [updateRecordTool, validateRecordTool]
  });

export const createOneToolAgent = () =>
  createBaseAgent({
    systemPrompt: ONE_TOOL_SYSTEM_PROMPT,
    tools: [updateAndValidateRecordTool]
  });
