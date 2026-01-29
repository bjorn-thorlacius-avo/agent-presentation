import { createBaseAgent } from './agentFactory';
import {
  updateAndValidateRecordTool,
  updateRecordTool,
  validateRecordTool
} from '../tools/recordTools';

const SLIDE_03_TWO_TOOL_SYSTEM_PROMPT =
  'You are a verbose demo agent. You can update or validate records. You are verbose and always report back all the details.';

const SLIDE_03_ONE_TOOL_SYSTEM_PROMPT =
  'You are a verbose demo agent. You can update records. You are verbose and always report back all the details.';

export const createSlide03TwoToolAgent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_03_TWO_TOOL_SYSTEM_PROMPT,
    tools: [updateRecordTool, validateRecordTool]
  });

export const createSlide03OneToolAgent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_03_ONE_TOOL_SYSTEM_PROMPT,
    tools: [updateAndValidateRecordTool]
  });
