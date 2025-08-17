import { test, expect, describe } from 'vitest';
import {
  getAvailableLength,
  getCommentPrefix,
  normalizeCommentPrefix,
  stripFormatting,
  wrapComment,
} from './index.js';

describe('getCommentPrefix', () => {
  test.each([
    ['// No buy year wolf chambray kale chips.', '// '],
    ['  // No buy year wolf chambray kale chips.', '  // '],
    ['\t// No buy year wolf chambray kale chips.', '\t// '],
    ['  /* No buy year wolf chambray kale chips. */', '  /* '],
    ['  /** No buy year wolf chambray kale chips. */', '  /** '],
    ['  # No buy year wolf chambray kale chips.', '  # '],
    ['No buy year wolf chambray kale chips.', ''],
  ])('returns prefix: %s', (input, expected) => {
    const result = getCommentPrefix(input);
    expect(result).toBe(expected);
  });
});

describe('normalizeCommentPrefix', () => {
  test.each([
    ['// ', '// '],
    ['  // ', '  // '],
    ['\t// ', '\t// '],
    ['  /* ', '   * '],
    ['  /** ', '   * '],
    ['  {/* ', '   * '],
    ['  # ', '  # '],
    ['', ''],
  ])('returns normalized prefix: %s', (input, expected) => {
    const result = normalizeCommentPrefix(input);
    expect(result).toBe(expected);
  });
});

describe('stripFormatting', () => {
  test.each([
    [
      '// No buy year wolf chambray kale chips.',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '  // No buy year wolf chambray kale chips.',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '//No buy year wolf chambray kale chips.',
      'No buy year wolf chambray kale chips.',
    ],
    [
      `  // Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
  // asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
      `Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
    ],
    [
      '/* No buy year wolf chambray kale chips. */',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '  /* No buy year wolf chambray kale chips. */',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '/*No buy year wolf chambray kale chips.*/',
      'No buy year wolf chambray kale chips.',
    ],
    [
      `/*
 * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
 * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
 * kitsch.
 */`,
      `Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
    ],
    [
      '/** No buy year wolf chambray kale chips. */',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '  /** No buy year wolf chambray kale chips. */',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '/**No buy year wolf chambray kale chips.*/',
      'No buy year wolf chambray kale chips.',
    ],
    [
      `/**
 * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
 * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
 * kitsch.
 */`,
      `Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
    ],
    [
      '{/* No buy year wolf chambray kale chips. */}',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '  {/* No buy year wolf chambray kale chips. */}',
      'No buy year wolf chambray kale chips.',
    ],
    [
      '{/*No buy year wolf chambray kale chips.*/}',
      'No buy year wolf chambray kale chips.',
    ],
    [
      `{/*
 * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
 * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
 * kitsch.
 */}`,
      `Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
    ],
  ])('returns normalized prefix: %s', (input, expected) => {
    const result = stripFormatting(input);
    expect(result).toBe(expected);
  });
});

describe('getAvailableLength', () => {
  test.each([
    ['// ', 80, 77],
    ['', 80, 80],
  ])('returns available length: %s', (prefix, maxLength, expected) => {
    const result = getAvailableLength(prefix, maxLength);
    expect(result).toBe(expected);
  });
});

describe('wrapComment', () => {
  test.each([
    [
      // Returns a short text as is
      'No buy year wolf chambray kale chips.',
      'No buy year wolf chambray kale chips.',
    ],
    [
      // Returns a short comment as is
      '// No buy year wolf chambray kale chips.',
      '// No buy year wolf chambray kale chips.',
    ],
    [
      // Wraps basic // comment
      '// Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.',
      `// Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
// asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
// kitsch.`,
    ],
    [
      // Wraps basic text
      'Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.',
      `Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical
wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
    ],
    [
      // Wraps basic /* ... */ comment
      '/* Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch. */',
      `/*
 * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
 * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
 * kitsch.
 */`,
    ],
    [
      // Wraps basic /** ... */ comment
      '/** Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch. */',
      `/**
 * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
 * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
 * kitsch.
 */`,
    ],
    [
      // Wraps basic {/* ... */} comment
      '{/* Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch. */}',
      `{/*
 * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
 * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
 * kitsch.
 */}`,
    ],
  ])('wraps comment: %s', (input, expected) => {
    const result = wrapComment(input);
    expect(result).toBe(expected);
  });
});
