---
slug: js-iterators-and-generators
title: "JavaScript Iterables & Generator Functions"
topic: behavioral-traversal
kind: api
summary: "Implement Symbol.iterator and generator functions (function*) to leverage native for...of loops and spread syntax."
tags:
  - behavioral
  - iterator
  - javascript
  - generators
  - symbol-iterator
related:
  - iterator-intent
  - custom-iterator-implementation
  - interpreter-intent
---

> **In one line:** Implement Symbol.iterator and generator functions to make custom collections natively iterable in JavaScript.

## The idea

In modern JavaScript and TypeScript, you rarely need to write manual GoF iterator classes because the Iterator pattern is **built directly into the language syntax**.

JavaScript defines the **Iterable Protocol**: any object that implements a method keyed by the well-known symbol `[Symbol.iterator]()` is recognized by the JavaScript runtime engine as an Iterable.

When an object conforms to this standard protocol, it automatically supports:
- Native `for (const item of collection)` loops.
- Array spread syntax: `[...collection]`.
- Positional array destructuring: `const [first, second] = collection`.
- Standard library constructor APIs: `Array.from(collection)`, `new Set(collection)`, `new Map(entries)`.

Furthermore, generator functions (`function*` with `yield`) make implementing `[Symbol.iterator]()` remarkably concise, replacing dozens of lines of manual cursor math and state tracking with clean, readable procedural yields.

| JavaScript Feature | Role in Iterator Pattern | Example |
|---|---|---|
| **`Symbol.iterator`** | Standardized aggregate interface hook | `[Symbol.iterator]() { ... }` |
| **Iterator Result** | Standardized return structure | `{ value: T, done: boolean }` |
| **Generator (`function*`)** | Synthesizes an iterator with state | `yield item;` |
| **`for...of` Loop** | Native language consumer | `for (const x of iterable)` |

> **Tip:** Generator functions pause execution at each `yield` statement and resume on the next `next()` call, maintaining state in local variables automatically without manual index math.

## See it

```typescript
class Team {
  constructor(public members: string[]) {}

  // Native JavaScript Iterable implementation via generator
  *[Symbol.iterator]() {
    for (const member of this.members) {
      yield member; // Pauses and emits next value
    }
  }
}

const team = new Team(['Alice', 'Bob', 'Charlie']);

// 1. Native for...of loop works out of the box!
for (const person of team) {
  console.log(person);
}

// 2. Spread operator works automatically!
const memberArray = [...team];
```

## Go deeper

Generators also support infinite sequences. Because values are evaluated lazily on demand when `next()` is called, you can write a generator that yields Fibonacci numbers or auto-incrementing IDs infinitely: `while (true) yield id++`. The consumer takes only what it needs, consuming zero excess memory. This capability powers streaming pipelines, reactive processing, and high-throughput data transformations without allocating huge intermediate arrays.

## Watch out

- Remember that generator functions return iterators that are exhausted after one full traversal.
- Do not forget the asterisk (*) when declaring generator methods: *[Symbol.iterator]().

## Remember

- The JavaScript Iterable protocol standardizes Iterator pattern integration in language syntax.
- Implementing [Symbol.iterator]() unlocks native for...of loops and spread syntax.
- Generator functions (function* / yield) eliminate manual cursor tracking and boundary math.
