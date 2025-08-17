const prefixRegExp = /^\s*(?:\/\/|#|\*|\/\*\*|\/\*)\s*/i;

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
 * Returns a prefix that should be used to prefix each line of comments.
 *
 * Examples:
 * `//` → `//`
 * `#` → `#`
 * `/*` → ` *`
 * `/**` → ` *`
 */
export function normalizeCommentPrefix(prefix: string) {
  return prefix.replace(/\/\*+/, ' *');
}

/**
 * Returns comment as a single line of text: strips all comment markers and
 * removes line breaks.
 */
export function stripFormatting(text: string) {
  // TODO: Support other types of line breaks
  const lines = text.split(/\n+/);
  const cleanLines = lines.map((line) => line.replace(prefixRegExp, ''));
  return cleanLines.join(' ');
}

/**
 * Returns the number of available characters inside the comment.
 */
export function getAvailableLength(prefix: string, maxLength: number) {
  return maxLength - prefix.length;
}

// TODO: Wrap comment paragraph?
export function wrapComment(comment: string, maxLength = 80) {
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

  return lines.map((line) => `${normalizedPrefix}${line}`).join('\n');
}
