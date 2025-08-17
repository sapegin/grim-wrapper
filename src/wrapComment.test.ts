import { test, expect } from 'vitest';
import { wrapComment } from './warpComment';

test.each([
  [
    // Returns a short comment as is
    '// No buy year wolf chambray kale chips.',
    '// No buy year wolf chambray kale chips.',
  ],
])('wraps a comment %s', (input, expected) => {
  const result = wrapComment(input);
  expect(result).toBe(expected);
});
