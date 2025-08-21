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

2.

```js
import { wrapComment } from 'grim-wrapper';

wrapComment('...');
// → ...
```

## The Name

...

## Motivation

...

## Sponsoring

This software has been developed with lots of coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217"></a>

## Contributing

Bug fixes are welcome, but not new features. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/grim-wrapper/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
