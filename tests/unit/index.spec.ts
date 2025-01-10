import { describe, expect, it } from 'vitest';

describe('Calculate', () => {
  it('should add 1 + 1', () => {
    const one = 1;
    const two = 1;

    const result = one + two;

    expect(result).toBe(2);
  });
});
