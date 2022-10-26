# deconstruct-merge

[![npm](https://img.shields.io/npm/v/deconstruct-merge.svg)](https://www.npmjs.com/package/deconstruct-merge)

A _simple_ library for merging _complex_ options. First deconstruct, then merge.

## Example

```js
const Mergeable = require('deconstruct-merge')

const config = new Mergeable({
  foo: 'flat',
  bar: 'array',
  baz: [
    'assign',
    'override',
  ],
})

config
  .merge({
    foo: 1,
    baz: [
      { a: 1 },
      { b: 2 },
    ],
  })
  .merge({
    foo: [2],
    bar: [2],
  })
  .merge(undefined)
  .merge({
    bar: 3,
    baz: [
      { a: 2, b: 3 },
      { c: 4 },
    ]
  })
  .value()

// output:
// { foo: [ 1, 2 ],
//   bar: [ [ 2 ], 3 ],
//   baz: [ { a: 2, b: 3 }, { c: 4 } ] }
```
