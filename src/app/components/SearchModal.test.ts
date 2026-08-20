import { describe, it, expect } from 'vitest';
import { findMockResult } from './SearchModal';

describe('findMockResult', () => {
  it('returns the transformer result for a matching query', () => {
    const res = findMockResult('how does a transformer work?');
    expect(res.topic).toContain('Transformer');
    expect(res.resources.length).toBeGreaterThan(0);
  });

  it('returns the RAG result when the query mentions rag', () => {
    const res = findMockResult('rag basics');
    expect(res.topic).toContain('RAG');
  });

  it('falls back to the default result for unknown topics', () => {
    const res = findMockResult('quantum computing');
    expect(res.topic).toBe('quantum computing');
    expect(res.resources.length).toBeGreaterThan(0);
  });

  it('is case-insensitive', () => {
    const res = findMockResult('LANGCHAIN agents');
    expect(res.topic).toContain('LangChain');
  });
});