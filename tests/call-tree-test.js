'use strict';

const assert = require('assert').strict;
const { getRecursiveTree } = require('../lib/call-tree');

const checkCallTree = (
  callNode,
  fn,
  numOfSecondaryCalls,
  nonRecursiveCondition,
  deepEqualMode
) => {
  try {
    const expectedResult = fn(...callNode.args);

    if (deepEqualMode) {
      assert.deepEqual(
        expectedResult,
        callNode.result,
        `Wrong result of ${fn.name} in callNode ` +
          `with args:${callNode.args} are not equal! ` +
          `expected:${expectedResult}, result:${callNode.result}`
      );
    } else {
      assert.equal(
        expectedResult,
        callNode.result,
        `Wrong result of ${fn.name} in callNode ` +
          `with args:${callNode.args} are not equal! ` +
          `expected:${expectedResult}, result:${callNode.result}`
      );
    }
  } catch (error) {
    assert.ok(
      callNode.result instanceof Error,
      `Function ${fn.name} is expected to throw error with args:${callNode.args}!`
    );
    assert.equal(
      callNode.calls.length,
      0,
      `Call node is not expected to save secondary calls, when function throws error!`
    );
    return;
  }

  if (nonRecursiveCondition(...callNode.args)) {
    assert.equal(
      callNode.calls.length,
      0,
      `Function ${fn.name} is not expected to make secondary calls, ` +
        `but made ${callNode.calls.length} ` +
        `with args:${callNode.args}!`
    );
  } else {
    assert.equal(
      callNode.calls.length,
      numOfSecondaryCalls,
      `Function ${fn.name} is expected to make ` +
        `${numOfSecondaryCalls} secondary calls, ` +
        `but made ${callNode.calls.length} ` +
        `with args:${callNode.args}!`
    );

    for (const secondaryCallNode of callNode.calls) {
      checkCallTree(
        secondaryCallNode,
        fn,
        numOfSecondaryCalls,
        nonRecursiveCondition,
        deepEqualMode
      );
    }
  }
};

const testCallTreeGenerating = (
  fn,
  fnDesc,
  numOfSecondaryCalls,
  nonRecursiveCondition,
  argsList,
  deepEqualMode
) => {
  for (const args of argsList) {
    const callTree = getRecursiveTree(fnDesc, ...args);
    checkCallTree(
      callTree,
      fn,
      numOfSecondaryCalls,
      nonRecursiveCondition,
      deepEqualMode
    );
  }
};

const fibObj = {
  name: 'fib',
  body: (n) => {
    if (n < 0) throw new RangeError('N expected to be >= 0');
    // eslint-disable-next-line no-undef
    return n > 1 ? fib(n - 1) + fib(n - 2) : 1;
  },
};

const fibonacci = (n) => {
  if (n < 0) throw new RangeError('N expected to be >= 0');
  return n > 1 ? fibonacci(n - 1) + fibonacci(n - 2) : 1;
};

function fibonacciTestCase() {
  const argsList = [[-3], [1], [4], [7], [25]];
  const numOfSecondaryCalls = 2;
  const nonRecursiveCondition = (n) => n <= 1;
  testCallTreeGenerating(
    fibonacci,
    fibObj,
    numOfSecondaryCalls,
    nonRecursiveCondition,
    argsList,
    false
  );
}

fibonacciTestCase();
