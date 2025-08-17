// TODO: Markdown lists
// TODO: JSDoc tags

// Comment prefixes: //, #, *, /**, /*, {/*
const prefixRegExp = /^\s*(?:\/\/|#|\*|\/\*\*|\/\*|\{\/\*)\s*/i;

// Comment suffixes: */, */}
const suffixRegExp = /\s*(?:\*\/|\*\/\})\s*$/i;

// Prefixes that require their own line in multi-line comments: /**, /*, {/*
const singleLinePrefixes = ['/**', '/*', '{/*'];

// Suffixes that require their own line in multi-line comments: /**, /*, {/*
const singleLineSuffixes = ['*/', '*/}'];

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
 * Returns comment as a single line of text: strips all comment markers and
 * removes line breaks. Multiple paragraphs are treated as a single paragraph.
 */
export function stripFormatting(text: string) {
  // TODO: Support other types of line breaks
  const lines = text.split(/\n+/);

  const cleanLines = lines
    // Remove suffixes (*/)
    .map((line) => line.replace(suffixRegExp, ''))
    // Remove prefixes (/*, //)
    .map((line) => line.replace(prefixRegExp, ''))
    // Remove leading/trailing whitespace
    .map((line) => line.trim())
    // Filter out empty lines
    .filter((line) => line !== '');

  // Merge lines using spaces instead of line breaks
  return cleanLines.join(' ');
}

/**
 * Returns the number of available characters inside the comment.
 */
export function getAvailableLength(prefix: string, maxLength: number) {
  return maxLength - prefix.length;
}

// TODO: Wrap comment paragraph?
/**
 * Wrap a single paragraph in a code comment, Markdown, or plain text.
 */
export function wrapComment(comment: string, maxLength = 80) {
  if (comment.length <= maxLength) {
    // The whole comment is short enough, no need to do anything
    return comment;
  }

  const firstLinePrefix = getCommentPrefix(comment);
  const normalizedPrefix = normalizeCommentPrefix(firstLinePrefix);
  const availableMaxLength = getAvailableLength(normalizedPrefix, maxLength);
  const text = stripFormatting(comment);

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const isFirstWord = currentLine === '';
    const nextCurrentLine = `${currentLine}${isFirstWord ? '' : ' '}${word}`;
    if (nextCurrentLine.length > availableMaxLength) {
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
