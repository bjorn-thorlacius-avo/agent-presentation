import { z } from 'zod';
import { createTrackedTool } from './baseTool';

type MockRecord = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  updatedAt: string;
};

const MOCK_RECORDS = new Map<string, MockRecord>();

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const updateRecord = (payload: {
  id?: string;
  title: string;
  summary: string;
  tags: string[];
}) => {
  const id = payload.id?.trim() || generateId();
  const record: MockRecord = {
    id,
    title: payload.title,
    summary: payload.summary,
    tags: payload.tags,
    updatedAt: new Date().toISOString()
  };
  MOCK_RECORDS.set(id, record);
  return record;
};

const validateRecord = (id: string) => {
  const record = MOCK_RECORDS.get(id);
  const errors: string[] = [];

  if (!record) {
    errors.push('Record not found.');
    return { id, isValid: false, errors };
  }

  if (record.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters.');
  }
  if (record.summary.trim().length < 10) {
    errors.push('Summary must be at least 10 characters.');
  }
  if (record.tags.length === 0) {
    errors.push('At least one tag is required.');
  }

  return {
    id,
    isValid: errors.length === 0,
    errors
  };
};

export const updateMockRecordTool = createTrackedTool(
  async (payload: { id?: string; title: string; summary: string; tags: string[] }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const record = updateRecord(payload);
    return JSON.stringify({
      id: record.id,
      record
    });
  },
  {
    name: 'update_mock_record',
    description: 'Updates a mock database record and returns its id.',
    schema: z.object({
      id: z.string().optional().describe('Optional id to update an existing record'),
      title: z.string().describe('Title for the record'),
      summary: z.string().describe('Summary for the record'),
      tags: z.array(z.string()).describe('Tags for the record')
    })
  }
);

export const validateMockRecordTool = createTrackedTool(
  async ({ id }: { id: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = validateRecord(id);
    return JSON.stringify(result);
  },
  {
    name: 'validate_mock_record',
    description: 'Validates a mock database record using its id.',
    schema: z.object({
      id: z.string().describe('Id returned from update_mock_record')
    })
  }
);

export const updateAndValidateRecordTool = createTrackedTool(
  async (payload: { id?: string; title: string; summary: string; tags: string[] }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const record = updateRecord(payload);
    const result = validateRecord(record.id);
    return JSON.stringify({
      id: record.id,
      record,
      validation: result,
      status: result.isValid ? 'ok' : 'error',
      error: result.isValid ? undefined : 'Validation failed.'
    });
  },
  {
    name: 'update_and_validate_record',
    description: 'Updates a mock record, validates it, and reports validation errors.',
    schema: z.object({
      id: z.string().optional().describe('Optional id to update an existing record'),
      title: z.string().describe('Title for the record'),
      summary: z.string().describe('Summary for the record'),
      tags: z.array(z.string()).describe('Tags for the record')
    })
  }
);
