# rctree
Rctree is a library designed for debugging of functions with direct recursion and visualisation of recursive function call tree.

## Example

```js
'use strict';

const { getRecursiveTree, stringifyTree } = require('rctree');

const factDesc = {
  name: 'fact',
  body: n => (n > 1 ? n * fact(n - 1) : 1),
};

const callTree = getRecursiveTree(factDesc, 7);
const treeString = stringifyTree(callTree, 'factorial(7)');

console.log(treeString);

```
