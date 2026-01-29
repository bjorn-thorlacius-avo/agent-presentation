import { createBaseAgent } from './agentFactory';
import {
  updateAndValidateRecordTool,
  updateMockRecordTool,
  validateMockRecordTool
} from '../tools/mockRecordTools';

const TWO_TOOL_SYSTEM_PROMPT =
  'You are a demo agent. Use update_mock_record first, then pass its id into validate_mock_record. If validation errors exist, report them clearly.';

const ONE_TOOL_SYSTEM_PROMPT =
  'You are a demo agent. Use update_and_validate_record to update and validate in one step. If validation errors exist, report them clearly.';

export const createTwoToolAgent = () =>
  createBaseAgent({
    systemPrompt: TWO_TOOL_SYSTEM_PROMPT,
    tools: [updateMockRecordTool, validateMockRecordTool]
  });

export const createOneToolAgent = () =>
  createBaseAgent({
    systemPrompt: ONE_TOOL_SYSTEM_PROMPT,
    tools: [updateAndValidateRecordTool]
  });
