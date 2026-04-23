import { z } from 'zod';
import { createTrackedTool } from './baseTool';
import { abortCurrentRun, getCurrentResponse } from '../memory/sessionStore';

const notificationSchema = z.object({
  message: z.string().min(1),
  title: z.string().optional(),
  reply: z.string().optional()
});

export const notificationTool = createTrackedTool(async (input) => {
  const response = getCurrentResponse();
  const title = input.title?.trim() || 'Notification';
  const reply = input.reply?.trim();
  const canSend = Boolean(response && !response.headersSent);

  if (canSend) {
    response?.json({
      ...(reply ? { reply } : {}),
      notification: {
        title,
        message: input.message
      }
    });
    abortCurrentRun('notification response sent');
  }

  return {
    sent: canSend,
    notification: { title, message: input.message }
  };
}, {
  name: 'notification',
  description:
    'Send a user-facing notification and finish the HTTP response from this tool.',
  schema: notificationSchema
});
