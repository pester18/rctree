'use strict';

const createCallNode = (args, result) => ({ args, result, calls: [] });

const appendRecursiveCall = (callNode, args, res) => {
  const secondaryCallNode = createCallNode(args, res);
  callNode.calls.push(secondaryCallNode);
  return secondaryCallNode;
};

const getRecursiveTree = (fnDesc, ...args) => {
  const { name, body } = fnDesc;
  const root = createCallNode(args, null);
  let currentNode = null;

  const wrappedFn = (...args) => {
    const parentNode = currentNode;

    currentNode = !currentNode
      ? root
      : appendRecursiveCall(currentNode, args, null);

    const res = body(...args);

    currentNode.result = res;
    currentNode = parentNode;
    return res;
  };

  global[name] = wrappedFn;

  global[name](...args);

  global[name] = undefined;

  return root;
};

module.exports = {
  getRecursiveTree,
};
