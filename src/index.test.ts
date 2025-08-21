import { test, expect, describe } from 'vitest';
import {
  getAvailableLength,
  getCommentPrefix,
  isCommentBreak,
  isCommentEnd,
  isCommentStart,
  isListItemOrJsDocTag,
  normalizeCommentPrefix,
  splitIntoChunks,
  splitIntoLines,
  stripFormatting,
  wrapComment,
} from './index.js';

describe('isCommentStart', () => {
  test.each([
    ['// No buy year wolf chambray kale chips.', false],
    ['  // No buy year wolf chambray kale chips.', false],
    ['\t// No buy year wolf chambray kale chips.', false],
    ['  /* No buy year wolf chambray kale chips. */', true],
    ['  /** No buy year wolf chambray kale chips. */', true],
    ['  {/* No buy year wolf chambray kale chips. */}', true],
    ['  # No buy year wolf chambray kale chips.', false],
    ['No buy year wolf chambray kale chips.', false],
  ])('returns prefix: %s', (input, expected) => {
    const result = isCommentStart(input);
    expect(result).toBe(expected);
  });
});

describe('isCommentEnd', () => {
  test.each([
    ['// No buy year wolf chambray kale chips.', false],
    ['  // No buy year wolf chambray kale chips.', false],
    ['\t// No buy year wolf chambray kale chips.', false],
    ['  /* No buy year wolf chambray kale chips. */', true],
    ['  /** No buy year wolf chambray kale chips. */', true],
    ['  {/* No buy year wolf chambray kale chips. */}', true],
    ['  # No buy year wolf chambray kale chips.', false],
    ['No buy year wolf chambray kale chips.', false],
  ])('returns prefix: %s', (input, expected) => {
    const result = isCommentEnd(input);
    expect(result).toBe(expected);
  });
});

describe('isCommentBreak', () => {
  test.each([
    ['// No buy year wolf chambray kale chips.', false],
    ['  // No buy year wolf chambray kale chips.', false],
    ['\t// No buy year wolf chambray kale chips.', false],
    ['  /* No buy year wolf chambray kale chips. */', false],
    ['  /** No buy year wolf chambray kale chips. */', false],
    ['  {/* No buy year wolf chambray kale chips. */}', false],
    ['  # No buy year wolf chambray kale chips.', false],
    ['No buy year wolf chambray kale chips.', false],
    ['  #', true],
    ['  //', true],
    ['  *', true],
  ])('returns prefix: %s', (input, expected) => {
    const result = isCommentBreak(input);
    expect(result).toBe(expected);
  });
});

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
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '  // No buy year wolf chambray kale chips.',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '//No buy year wolf chambray kale chips.',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      `  // Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
      // asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
      [
        `Bicycle rights disrupt craft beer butcher bagel biodiesel vintage`,
        `asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
      ],
    ],
    [
      '/* No buy year wolf chambray kale chips. */',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '  /* No buy year wolf chambray kale chips. */',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '/*No buy year wolf chambray kale chips.*/',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      `/*
     * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
     * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
     * kitsch.
     */`,
      [
        'Bicycle rights disrupt craft beer butcher bagel biodiesel vintage',
        'asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia',
        'kitsch.',
      ],
    ],
    [
      `* Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
     * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
     * kitsch.`,
      [
        'Bicycle rights disrupt craft beer butcher bagel biodiesel vintage',
        'asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia',
        'kitsch.',
      ],
    ],
    [
      '/** No buy year wolf chambray kale chips. */',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '  /** No buy year wolf chambray kale chips. */',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '/**No buy year wolf chambray kale chips.*/',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      `/**
     * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
     * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
     * kitsch.
     */`,
      [
        'Bicycle rights disrupt craft beer butcher bagel biodiesel vintage',
        'asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia',
        'kitsch.',
      ],
    ],
    [
      '{/* No buy year wolf chambray kale chips. */}',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '  {/* No buy year wolf chambray kale chips. */}',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      '{/*No buy year wolf chambray kale chips.*/}',
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      `{/*
     * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
     * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
     * kitsch.
     */}`,
      [
        'Bicycle rights disrupt craft beer butcher bagel biodiesel vintage',
        'asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia',
        'kitsch.',
      ],
    ],
  ])('returns normalized prefix: %s', (input, expected) => {
    const result = stripFormatting(input);
    expect(result).toEqual(expected);
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

describe('splitIntoLines', () => {
  test.each([
    ['Tacos al pastor', ['Tacos al pastor']],
    ['- Eins\n- Zwei\n- Polizei', ['- Eins', '- Zwei', '- Polizei']],
    [
      'Tacos al pastor\nTacos de kolbasa\n\nTacos de something else',
      ['Tacos al pastor', 'Tacos de kolbasa', 'Tacos de something else'],
    ],
  ])('returns an array of chunks: %s', (text, expected) => {
    const result = splitIntoLines(text);
    expect(result).toEqual(expected);
  });
});

describe('isListItemOrJsDocTag', () => {
  test.each([
    ['Tacos al pastor', false],
    ['- Eins', true],
    ['-Eins', true],
    ['* Eins', true],
    ['*Eins', true],
    ['- [ ] Eins', true],
    ['- [ ]Eins', true],
    ['* [ ] Eins', true],
    ['* [ ]Eins', true],
    ['- [x] Eins', true],
    ['- [x]Eins', true],
    ['* [x] Eins', true],
    ['* [x]Eins', true],
    ['- [X] Eins', true],
    ['- [X]Eins', true],
    ['* [X] Eins', true],
    ['* [X]Eins', true],
    ['@param foo', true],
  ])('returns true if list or JSDoc: %s', (text, expected) => {
    const result = isListItemOrJsDocTag(text);
    expect(result).toEqual(expected);
  });
});

describe('splitIntoChunks', () => {
  test.each([
    [
      ['No buy year wolf chambray kale chips.'],
      ['No buy year wolf chambray kale chips.'],
    ],
    [
      ['No buy year wolf', 'chambray kale', 'chips.'],
      ['No buy year wolf\nchambray kale\nchips.'],
    ],
    [
      [
        'No buy year wolf chambray kale chips.',
        '- Eins',
        '- Zwei',
        '- Polizei',
      ],
      [
        'No buy year wolf chambray kale chips.',
        '- Eins',
        '- Zwei',
        '- Polizei',
      ],
    ],
    [['- Eins,', '  zwei, polizei'], ['- Eins,\n  zwei, polizei']],
    [['- Eins,', 'zwei, polizei'], ['- Eins,\nzwei, polizei']],
    [
      [
        'No buy year wolf chambray kale chips.',
        '@param foo Something',
        '@param bar Something else',
      ],
      [
        'No buy year wolf chambray kale chips.',
        '@param foo Something',
        '@param bar Something else',
      ],
    ],
    [
      ['- Eins', '* Zwei'],
      ['- Eins', '* Zwei'],
    ],
    [
      ['-Eins', '*Zwei'],
      ['-Eins', '*Zwei'],
    ],
    [
      ['- [ ] Polizei', '- [x] Polizei', '* [ ] Polizei', '* [x] Polizei'],
      ['- [ ] Polizei', '- [x] Polizei', '* [ ] Polizei', '* [x] Polizei'],
    ],
  ])('returns an array of chunks: %s', (lines, expected) => {
    const result = splitIntoChunks(lines);
    expect(result).toEqual(expected);
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
      // Wraps a paragraph inside a /* ... */ comment
      `  * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
      `  * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
  * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
  * kitsch.`,
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
    [
      // Comments with multiple chunks: Markdown list
      'No buy year wolf chambray kale chips.\n- Eins, zwei, polizei\n- Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.',
      `No buy year wolf chambray kale chips.
- Eins, zwei, polizei
- Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical
  wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.`,
    ],
    [
      // Comments with multiple chunks: JSDoc
      '\t/** Bicycle rights disrupt craft beer\nbutcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.\n\t * @param foo Short one\n\t * @param bar Artisan messenger bag Helvetica TikTok whatever Mauerpark fanny pack meh jean shorts freegan direct trade  aesthetic sustainable small batch. */',
      `\t/**
\t * Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
\t * asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
\t * kitsch.
\t * @param foo Short one
\t * @param bar Artisan messenger bag Helvetica TikTok whatever Mauerpark fanny pack
\t *     meh jean shorts freegan direct trade aesthetic sustainable small batch.
\t */`,
    ],
  ])('wraps comment: %s', (input, expected) => {
    const result = wrapComment(input);
    expect(result).toBe(expected);
  });
});
