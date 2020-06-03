'use strict';

function makePrefix(key, last) {
  let str = last ? '└' : '├';
  if (key) {
    str += '─ ';
  } else {
    str += '──┐';
  }
  return str;
}

function filterKeys(obj) {
  const keys = Object.entries(obj)
    .filter((tuple) => typeof tuple[1] !== 'function')
    .map((tuple) => tuple[0]);
  return keys;
}

function growBranch(key, root, last, lastStates, callback) {
  let line = '';
  let index = 0;
  let lastKey;
  let circular;
  const lastStatesCopy = [...lastStates];

  lastStatesCopy.push([root, last]);
  if (lastStates.length > 0) {
    // based on the "was last element" states of whatever we're nested within,
    // we need to append either blankness or a branch to our line
    lastStates.forEach((lastState, idx) => {
      if (idx > 0) {
        line += (lastState[1] ? ' ' : '│') + '  ';
      }
      if (!circular && lastState[0] === root) {
        circular = true;
      }
    });

    // the prefix varies based on whether the key contains something to show and
    // whether we're dealing with the last element in this collection
    line += makePrefix(key, last) + key;

    // append values and the circular reference indicator
    const rootIsStrigifiable = typeof root !== 'object' || root instanceof Date || root instanceof Error || root === null;
    if (rootIsStrigifiable) line += ': ' + root;
    if (circular) line += ' (Circular)';

    callback(line);
  }

  // check whether can we descend to the next item
  if (!circular && typeof root === 'object' && root !== null) {
    const keys = filterKeys(root);
    keys.forEach((branch) => {
      // check whether current key is the last one
      lastKey = ++index === keys.length;

      growBranch(branch, root[branch], lastKey, lastStatesCopy, callback);
    });
  }
}

const stringifyTree = (obj, treeName) => {
  let tree = `${treeName}\n`;
  growBranch('.', obj, false, [], (line) => {
    tree += line + '\n';
  });
  return tree;
};

module.exports = {
  stringifyTree,
};
