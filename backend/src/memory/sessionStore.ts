type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_MESSAGES = 12;
const sessions = new Map<string, ChatMessage[]>();

export const getSessionMessages = (sessionId: string) => {
  return sessions.get(sessionId) ?? [];
};

export const appendSessionMessage = (sessionId: string, message: ChatMessage) => {
  const existing = sessions.get(sessionId) ?? [];
  const updated = [...existing, message].slice(-MAX_MESSAGES);
  sessions.set(sessionId, updated);
};
