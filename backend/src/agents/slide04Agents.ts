import { createBaseAgent } from './agentFactory';
import { notificationTool } from '../tools/notificationTool';

const SLIDE_04_SYSTEM_PROMPT =
  'You are a demo agent for slide 4. You can send notifications.';

export const createSlide04NotificationAgent = () =>
  createBaseAgent({
    systemPrompt: SLIDE_04_SYSTEM_PROMPT,
    tools: [notificationTool]
  });
