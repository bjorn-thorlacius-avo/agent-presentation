type AgentResult = {
  output?: unknown;
  structuredResponse?: unknown;
  messages?: Array<{ role?: string; content?: unknown; kwargs?: { content?: unknown } }>;
};

const extractFromCandidate = (candidate: unknown) => {
  if (typeof candidate === 'string') {
    return candidate;
  }
  if (candidate && typeof candidate === 'object') {
    const text = (candidate as { text?: string }).text;
    if (typeof text === 'string') {
      return text;
    }
    if (Array.isArray(candidate)) {
      return candidate
        .map((part) => {
          if (typeof part === 'string') {
            return part;
          }
          if (part && typeof part === 'object' && 'text' in part) {
            return String((part as { text?: string }).text ?? '');
          }
          return '';
        })
        .join('');
    }
  }
  return '';
};

export const extractReply = (result: unknown) => {
  if (!result) {
    return '';
  }

  if (typeof result === 'string') {
    return result;
  }

  const typedResult = result as AgentResult;

  if (typedResult.structuredResponse) {
    return JSON.stringify(typedResult.structuredResponse);
  }

  if (typedResult.output) {
    return typeof typedResult.output === 'string'
      ? typedResult.output
      : JSON.stringify(typedResult.output);
  }

  if (typedResult.messages?.length) {
    const lastMessage = typedResult.messages[typedResult.messages.length - 1];
    const candidate = lastMessage?.content ?? lastMessage?.kwargs?.content ?? null;
    return extractFromCandidate(candidate);
  }

  return '';
};
