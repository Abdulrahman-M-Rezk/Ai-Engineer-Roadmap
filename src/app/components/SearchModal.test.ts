import { describe, it, expect } from 'vitest';
import { parseAiJson } from './SearchModal';

describe('parseAiJson', () => {
  it('parses a valid JSON response', () => {
    const json = '{"title":"RAG","description":"شرح","actionable_steps":["step one","step two"]}';
    const res = parseAiJson(json);
    expect(res?.title).toBe('RAG');
    expect(res?.description).toBe('شرح');
    expect(res?.actionable_steps).toEqual(['step one', 'step two']);
  });

  it('strips markdown code fences', () => {
    const json = '```json\n{"title":"Docker","description":"d","actionable_steps":["x"]}\n```';
    const res = parseAiJson(json);
    expect(res?.title).toBe('Docker');
    expect(res?.actionable_steps).toEqual(['x']);
  });

  it('extracts JSON embedded in surrounding text', () => {
    const json = 'Here you go: {"title":"LangChain","description":"d","actionable_steps":["s1","s2"]} That is all.';
    const res = parseAiJson(json);
    expect(res?.title).toBe('LangChain');
    expect(res?.actionable_steps.length).toBe(2);
  });

  it('filters out non-string steps', () => {
    const json = '{"title":"T","description":"d","actionable_steps":["a", 42, null, "b"]}';
    const res = parseAiJson(json);
    expect(res?.actionable_steps).toEqual(['a', 'b']);
  });

  it('parses valid resources with urls', () => {
    const json = '{"title":"RAG","description":"d","actionable_steps":["s"],"resources":[{"name":"freeCodeCamp","url":"https://www.freecodecamp.org"},{"name":"Docs","url":"https://docs.python.org"}]}';
    const res = parseAiJson(json);
    expect(res?.resources.length).toBe(2);
    expect(res?.resources[0]).toEqual({ name: 'freeCodeCamp', url: 'https://www.freecodecamp.org' });
  });

  it('drops resources with missing or invalid urls', () => {
    const json = '{"title":"T","description":"d","actionable_steps":[],"resources":[{"name":"Bad","url":"not-a-url"},{"name":"NoUrl"},{"name":"Good","url":"https://ok.dev"}]}';
    const res = parseAiJson(json);
    expect(res?.resources).toEqual([{ name: 'Good', url: 'https://ok.dev' }]);
  });

  it('returns null for invalid input', () => {
    expect(parseAiJson('not json at all')).toBeNull();
    expect(parseAiJson('')).toBeNull();
  });

  it('returns null when no recognizable fields exist', () => {
    expect(parseAiJson('{"foo":"bar"}')).toBeNull();
  });
});