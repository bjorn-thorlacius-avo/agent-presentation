import { AsyncLocalStorage } from 'node:async_hooks';
import type { Response } from 'express';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_MESSAGES = 12;
const sessions = new Map<string, ChatMessage[]>();
const MAX_TOOL_CALLS = 30;
const toolCalls = new Map<string, ToolCall[]>();
const docsSearched = new Map<string, boolean>();
type SessionTopic = {
  title: string;
  summary: string;
};

const sessionTopics = new Map<string, SessionTopic[]>();
type SessionContext = {
  sessionId: string;
  response?: Response;
};

const sessionContext = new AsyncLocalStorage<SessionContext>();

type ToolCallStatus = 'started' | 'completed' | 'failed';

export type ToolCall = {
  id: string;
  name: string;
  status: ToolCallStatus;
  startedAt: string;
  endedAt?: string;
  input?: unknown;
  output?: unknown;
  error?: string;
};

export const getSessionMessages = (sessionId: string) => {
  return sessions.get(sessionId) ?? [];
};

export const appendSessionMessage = (sessionId: string, message: ChatMessage) => {
  const existing = sessions.get(sessionId) ?? [];
  const updated = [...existing, message].slice(-MAX_MESSAGES);
  sessions.set(sessionId, updated);
};

export const getSessionToolCalls = (sessionId: string) => {
  return toolCalls.get(sessionId) ?? [];
};

export const appendSessionToolCall = (sessionId: string, call: ToolCall) => {
  const existing = toolCalls.get(sessionId) ?? [];
  const updated = [...existing, call].slice(-MAX_TOOL_CALLS);
  toolCalls.set(sessionId, updated);
};

export const updateSessionToolCall = (
  sessionId: string,
  callId: string,
  updates: Partial<ToolCall>
) => {
  const existing = toolCalls.get(sessionId);
  if (!existing) {
    return;
  }
  const updated = existing.map((call) =>
    call.id === callId ? { ...call, ...updates } : call
  );
  toolCalls.set(sessionId, updated);
};

export const markDocumentationSearched = (sessionId: string) => {
  docsSearched.set(sessionId, true);
};

export const hasDocumentationSearched = (sessionId: string) => {
  return docsSearched.get(sessionId) ?? false;
};

export const addSessionTopic = (
  sessionId: string,
  topic: SessionTopic
) => {
  const existing = sessionTopics.get(sessionId) ?? [];
  const updated = [...existing, topic];
  sessionTopics.set(sessionId, updated);
  return updated;
};

export const getSessionTopics = (sessionId: string) => {
  return sessionTopics.get(sessionId) ?? [];
};

export const runWithSessionContext = <T>(
  context: SessionContext,
  fn: () => T
) => {
  return sessionContext.run(context, fn);
};

export const getCurrentSessionId = () => sessionContext.getStore()?.sessionId;

export const getCurrentResponse = () => sessionContext.getStore()?.response;
