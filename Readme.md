# Grim Wrapper

[![npm](https://img.shields.io/npm/v/grim-wrapper.svg)](https://www.npmjs.com/package/grim-wrapper) [![Node.js CI status](https://github.com/sapegin/grim-wrapper/workflows/Node.js%20CI/badge.svg)](https://github.com/sapegin/grim-wrapper/actions)

Rewrap comment blocks to make them readable.

[![Washing your code. A book on clean code for frontend developers](https://sapegin.me/images/washing-code-github.jpg)](https://sapegin.me/book/)

## Features

- Very small, no dependencies.
- Works in most popular programming languages, Markdown, and plain text.
- Supports Markdown lists and JavaDoc/JSDoc/XMLDoc tags.
- Limited scope to a single paragraph (part of a comment separated by empty lines).
- Almost zero config: the only option is maximum line length.

## Getting started

1. Install Grim Wrapper from npm:

```bash
npm install grim-wrapper
```

2. Call the `wrapComment` function with the comment text and the desired maximum line length. Note that it works with comment paragraphs (lines between “empty” lines).

```js
import { wrapComment } from 'grim-wrapper';

wrapComment(
  '// Bicycle rights disrupt craft beer butcher bagel biodiesel vintage asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia kitsch.',
  80
);
// →
// Bicycle rights disrupt craft beer butcher bagel biodiesel vintage
// asymmetrical wet cappuccino underconsuption High Life Prenzlauer Berg chia
// kitsch.
```

## Motivation

I’ve been using [Rewrap](https://stkb.github.io/Rewrap/) for a long time, but it doesn’t always do what I want:

- No support for JSX comments.
- Often weird formatting of multiline comments (`/* ... */`, etc.).
- I don’t like the way it format Markdown todos and JSDoc tags.

Check out [samples](https://github.com/sapegin/vscode-grim-wrapper/tree/main/samples) to get an idea how it formats comments.

## Guidelines

- Separate the comment from the marker with a space (`// Comment` or `/* Comment */`).
- Write in sentence case (`Comment here, comment there`).
- Finish sentences with a dot (`.`) for JSDoc comments, feel free to skip it for single-line comments.
- Prefer line comments (`//` or `#`) to block comments (`/* ... */`) for documenting code inside functions.
- Prefer JSDocs comments (`/** ... */`) to document functions, methods, classes, constants, types, etc.
- Prefer comments on their own line. Avoid end-of-line comments.
- Use prefixes such as `TODO` or `HACK` to highlight unfinished or hacky code.

## Sources

- [Google style guides](https://google.github.io/styleguide/)
- [Airbnb JavaScript style guide](https://github.com/airbnb/javascript?tab=readme-ov-file#comments)
- [Principles of writing consistent, idiomatic CSS by Nicolas Gallagher](https://github.com/necolas/idiomatic-css?tab=readme-ov-file#comments)
- [CSS guidelines by Harry Roberts](https://cssguidelin.es/#commenting)
- [jQuery HTML Style Guide](https://contribute.jquery.org/style-guide/html/#comments)

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217"></a>

## Contributing

Bug fixes are welcome, but not new features. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/grim-wrapper/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
