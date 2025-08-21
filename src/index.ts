// TODO: HTML comments: <!-- -->

// JSDoc tags are indented to a fixed size:
// https://google.github.io/styleguide/jsguide.html#jsdoc-line-wrapping
const JSDOC_INDENT = 4;

// Comment prefixes: //, #, *, /**, /*, {/*
const prefixRegExp = /^\s*(?:\/\/|#|\*|\/\*\*|\/\*|\{\/\*)\s*/i;

// Comment suffixes: */, */}
const suffixRegExp = /\s*(?:\*\/|\*\/\})\s*$/i;

// Prefixes that require their own line in multi-line comments: /**, /*, {/*
const singleLinePrefixes = ['/**', '/*', '{/*'];

// Suffixes that require their own line in multi-line comments: /**, /*, {/*
const singleLineSuffixes = ['*/', '*/}'];

// List item markers: -, *, - [ ], - [x], etc.
const listItemRegExp = /^\s*([-*])(\s+\[[ x]\])?\s*/i;

// JSDoc tag: @param, @returns
const jsDocRegExp = /^\s*@\w+\s*/;

/**
 * Returns first line comment prefix.
 *
 * `  // Example` → `  //`
 */
export function getCommentPrefix(text: string) {
  const match = text.match(prefixRegExp);
  return match ? match[0] : '';
}

/**
 * Returns last line comment prefix.
 *
 * Examples:
 * `  // Example` → ``
 * `  /* Example *_/` → `*_/` (ignore _)
 */
export function getCommentSuffix(text: string) {
  const match = text.match(suffixRegExp);
  return match ? match[0] : '';
}

/**
 * Returns a prefix that should be used to prefix each line of comments.
 *
 * Examples:
 * `//` → `//`
 * `#` → `#`
 * `/*` → ` *`
 * `/**` → ` *`
 */
export function normalizeCommentPrefix(prefix: string) {
  return prefix.replace(/\{?\/\*+/, ' *');
}

/**
 * Returns comment as an array of lines of text: strips all comment markers and
 * squashes multiple line breaks into one. Multiple paragraphs are treated as a single paragraph.
 */
export function stripFormatting(text: string) {
  const lines = splitIntoLines(text);

  return (
    lines
      // Remove suffixes (*/)
      .map((line) => line.replace(suffixRegExp, ''))
      // Remove prefixes (/*, //)
      .map((line) => line.replace(prefixRegExp, ''))
      // Remove leading/trailing whitespace
      .map((line) => line.trim())
      // Filter out empty lines
      .filter((line) => line !== '')
  );
}

/**
 * Returns the number of available characters inside the comment.
 */
export function getAvailableLength(prefix: string, maxLength: number) {
  return maxLength - prefix.length;
}

/**
 * Splits the text into an array of lines. Ignores empty lines.
 */
export function splitIntoLines(text: string) {
  return text.split(/(?:\r?\n)+/);
}

/**
 * Checks whether a given line starts with a list marker or JSDoc tag.
 */
export function isListItemOrJsDocTag(text: string) {
  return listItemRegExp.test(text) || jsDocRegExp.test(text);
}

/**
 * Splits the text into chunks. A chunk could be:
 * - a block of text
 * - a list item (starts with `-` or `*`)
 * - a checklist item (starts with `- [ ]` or `* [ ]` or `- [x]` or `* [x]` )
 * - a JSDoc item (starts with @tagname)
 *
 * We assume that text blocks could only be placed before list items or JSDocs
 * tags.
 */
export function splitIntoChunks(lines: string[]): string[] {
  const chunks: string[][] = [];
  let currentChunk: string[] = [];

  for (const line of lines) {
    // A list item marker or JSDoc tag starts a new chunk
    if (isListItemOrJsDocTag(line) && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = [];
    }
    currentChunk.push(line);
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks.map((chunk) => chunk.join('\n'));
}

/**
 * Wraps a single text block.
 */
export function wrapTextBlock(text: string, maxLength: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const isFirstWord = currentLine === '';
    const nextCurrentLine = `${currentLine}${isFirstWord ? '' : ' '}${word}`;
    if (nextCurrentLine.length > maxLength) {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    } else {
      currentLine = nextCurrentLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Wraps a single list item or JDoc tag.
 */
export function wrapListItem(chunk: string, maxLength: number) {
  const match = chunk.match(listItemRegExp) || chunk.match(jsDocRegExp);
  const prefix = Array.isArray(match) ? match[0] : '';
  const prefixLength = prefix.length;
  const indentLength = jsDocRegExp.test(chunk) ? JSDOC_INDENT : prefix.length;

  // Wrap lines by available length minus indentation, pad the beginning of the first line with spaces to accommodate the difference between the size of indentation and the prefix
  const cleanChunk =
    ' '.repeat(prefixLength - indentLength) + chunk.replace(prefix, '');
  const lines = wrapTextBlock(cleanChunk, maxLength - indentLength);

  // Return the prefix and indent following lines
  const formattedLines = lines.map((line, index) =>
    index === 0
      ? `${prefix}${line.trimStart()}`
      : `${' '.repeat(indentLength)}${line}`
  );

  return formattedLines;
}

/**
 * Wrap a single paragraph in a code comment, Markdown, or plain text.
 */
export function wrapComment(comment: string, maxLength = 80) {
  if (comment.length <= maxLength) {
    // The whole comment is short enough, no need to do anything
    return comment;
  }

  const chunks = splitIntoChunks(stripFormatting(comment));

  const firstLinePrefix = getCommentPrefix(comment);
  const normalizedPrefix = normalizeCommentPrefix(firstLinePrefix);
  const availableMaxLength = getAvailableLength(normalizedPrefix, maxLength);

  const lines = [];
  for (const chunk of chunks) {
    const wrappedLines = isListItemOrJsDocTag(chunk)
      ? wrapListItem(chunk, availableMaxLength)
      : wrapTextBlock(chunk, availableMaxLength);

    lines.push(...wrappedLines);
  }

  const prefixedLines = lines.map((line) => `${normalizedPrefix}${line}`);

  // Restore opening /*, /**, etc.
  const cleanFirstLinePrefix = firstLinePrefix.trim();
  if (singleLinePrefixes.includes(cleanFirstLinePrefix)) {
    prefixedLines.unshift(firstLinePrefix.trimEnd());
  }

  // Restore closing */, etc.
  const lastLineSuffix = getCommentSuffix(comment);
  const cleanLastLineSuffix = lastLineSuffix.trim();
  if (singleLineSuffixes.includes(cleanLastLineSuffix)) {
    const indentedLastLineSuffix = normalizedPrefix
      .replace(normalizedPrefix.trim(), cleanLastLineSuffix)
      .trimEnd();
    prefixedLines.push(indentedLastLineSuffix);
  }

  return prefixedLines.join('\n');
}
