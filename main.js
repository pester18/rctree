'use strict';

const { getRecursiveTree } = require('./lib/call-tree');
const { stringifyTree } = require('./lib/stringify-tree');

const fibObj = {
  name: 'fib',
  body: (n) => (n > 1 ? fib(n - 1) + fib(n - 2) : 1),
};

const callTree = getRecursiveTree(fibObj, 4);
const treeString = stringifyTree(callTree, 'fibonacci(4)');

console.log(treeString);
