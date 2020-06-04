'use strict';

const { stringifyTree } = require('../lib/stringify-tree');
const assert = require('assert').strict;

const argsList = [
  [
    {
      uno: {
        dos: {
          tres: {
            quattro: 4,
          },
        },
      },
    },
    'test',
  ],
  [
    {
      field: {
        array: ['one', 'two'],
        numeric: 123,
        decimal: 12.34,
        bool: false,
        str: 'somestring',
        nil: null,
        undef: undefined,
        date: new Date(2018, 0, 1),
        error: new Error(),
      },
    },
    'test',
  ],
  [null, 'test'],
];

const expectedResults = [
  [
    'test',
    '└─ uno',
    '   └─ dos',
    '      └─ tres',
    '         └─ quattro: 4',
    '',
  ],
  [
    'test',
    '└─ field',
    '   ├─ array',
    '   │  ├─ 0: one',
    '   │  └─ 1: two',
    '   ├─ numeric: 123',
    '   ├─ decimal: 12.34',
    '   ├─ bool: false',
    '   ├─ str: somestring',
    '   ├─ nil: null',
    '   ├─ undef: undefined',
    '   ├─ date: Mon Jan 01 2018 00:00:00 GMT+0200 (GMT+02:00)',
    '   └─ error: Error',
    '',
  ],
  ['test', ''],
];

function stringifyTreeTestCase(argsList, expectedResults) {
  let i = 0;
  for (const args of argsList) {
    const expectedResult = expectedResults[i].join('\n');
    const result = stringifyTree(...args);
    assert.equal(
      result,
      expectedResult,
      `Wrong result of stringifyTree with args:${args}, ` +
        `expected:${expectedResult}, result:${result}`
    );
    i++;
  }
}

stringifyTreeTestCase(argsList, expectedResults);
