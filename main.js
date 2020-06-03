'use strict';

const { getRecursiveTree } = require('./lib/call-tree');
const { stringifyTree } = require('./lib/stringify-tree');

const fibObj = {
  name: 'fib',
  body: (n) => (n > 1 ? fib(n - 1) + fib(n - 2) : 1),
};

const callTree = getRecursiveTree(fibObj, 9);
const treeString = stringifyTree(callTree, 'fibonacci(9)');

const callTreeError = getRecursiveTree(fibObj, 1000000);
const treeStringWithError = stringifyTree(callTreeError, 'fibonacci(1000000)');

console.log(callTree);
console.log(treeString);

console.log(callTreeError);
console.log(treeStringWithError);

