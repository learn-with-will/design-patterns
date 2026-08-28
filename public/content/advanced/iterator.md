---
id: lesson-17
slug: iterator
title: "Iterator"
level: advanced
order: 17
duration: 15
tags:
  - behavioral
  - iterator
  - iterable
  - generators
  - gof
summary: "The Iterator pattern — access the elements of a collection one by one without exposing how the collection stores them — and how TypeScript and JavaScript build it right into the language through Symbol.iterator, the iterator protocol, and generators."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Iterator pattern.
- Describe the **iterator protocol** (`next()` returning `{ value, done }`).
- Make a class iterable in TypeScript with `Symbol.iterator` and **generators**.
- Explain why Iterator is a pattern the language mostly gives you for free.

# Why It Matters

You want to walk through a collection's elements — a list, a tree, a range — without the calling code
needing to know *how* they're stored. **Iterator** provides a standard way to step through elements one
at a time, hiding the structure behind it. It's one of the clearest examples of a GoF pattern that
modern languages, TypeScript included, have **baked in**: `for...of`, spread, and destructuring all run
on it.

# Concept Explanation

### Intent

> **Provide a way to access the elements of an aggregate object sequentially without exposing its
> underlying representation.** — Gang of Four

### The iterator protocol

In JavaScript/TypeScript, an **iterator** is any object with a `next()` method that returns
`{ value, done }`:

```typescript
// A hand-written iterator over a range.
function rangeIterator(start: number, end: number): Iterator<number> {
  let current = start;
  return {
    next(): IteratorResult<number> {
      return current <= end
        ? { value: current++, done: false }
        : { value: undefined, done: true };
    },
  };
}
```

An **iterable** is any object with a `[Symbol.iterator]()` method that returns an iterator. `for...of`,
spread (`[...x]`), and destructuring all consume iterables.

### Making a class iterable — the easy way with generators

Writing `next()` by hand is tedious. A **generator function** (`function*` with `yield`) produces an
iterator automatically, so implementing `[Symbol.iterator]` is a few lines:

```typescript
class NumberRange implements Iterable<number> {
  constructor(private start: number, private end: number) {}

  *[Symbol.iterator](): Iterator<number> {
    for (let i = this.start; i <= this.end; i++) {
      yield i; // pauses here and resumes on the next request
    }
  }
}

for (const n of new NumberRange(1, 4)) {
  console.log(n); // 1, 2, 3, 4
}
[...new NumberRange(1, 3)]; // [1, 2, 3]
```

The caller never learns whether `NumberRange` stores an array, computes on the fly, or reads from a
file — it just iterates. That hiding is the pattern.

### Why this is "free" in TypeScript

Peter Norvig's observation that some GoF patterns are "invisible" in higher-level languages fits
Iterator perfectly: the protocol is part of the language. You rarely hand-write an iterator class —
you implement `[Symbol.iterator]` (often with a generator) and let `for...of` do the rest. The *pattern*
is still there; the language just provides the plumbing.

### Consequences

- **Good:** uniform traversal across different collections; hides internal structure; supports multiple
  simultaneous traversals; generators make **lazy** and even **infinite** sequences easy.
- **Cost:** for a plain array, a direct loop is simpler; a custom iterator is only worth it for
  non-trivial structures.

# Key Terminology

- **Iterator** — an object with `next()` returning `{ value, done }`.
- **Iterable** — an object with `[Symbol.iterator]()` that returns an iterator.
- **Generator** — a `function*` that produces an iterator via `yield`.
- **Protocol** — the agreed shape (`Symbol.iterator` / `next`) that `for...of` relies on.

# Options and Trade-offs

| Concern | Iterator | Expose the array | How to choose |
| ------- | -------- | ---------------- | ------------- |
| Hiding structure | Internal representation stays private | Callers depend on the array | Iterator when the structure may change or is complex. |
| Laziness | Generators compute on demand | Whole collection materialized | Iterator/generator for large or infinite sequences. |
| Simplicity | A generator method | A `for` loop | A plain loop is fine for a simple array. |

# Worked Example

Traverse a tree in order without exposing its nodes:

```typescript
class TreeNode<T> {
  children: TreeNode<T>[] = [];
  constructor(public value: T) {}
  *[Symbol.iterator](): Iterator<T> {
    yield this.value;
    for (const child of this.children) yield* child; // recurse via the child's iterator
  }
}

const root = new TreeNode("a");
root.children.push(new TreeNode("b"), new TreeNode("c"));
[...root]; // ["a", "b", "c"] — depth-first, structure hidden
```

`yield*` delegates to each child's iterator, so one small generator walks the whole tree.

# Real World Analogy

An Iterator is like a **TV remote's channel button**. You press "next" and get the next channel without
knowing how channels are stored, ordered, or tuned internally. You don't reach inside the TV — you use a
simple, uniform "give me the next one" control.

# Examples

## Example 1 — Basic: for...of over a custom class

`for (const n of new NumberRange(1, 4))` prints 1–4 because `NumberRange` implements
`[Symbol.iterator]`. The loop doesn't know how the numbers are produced.

**Why this works:** `for...of` speaks the iterator protocol, and the class supplies an iterator.

## Example 2 — Real-world: lazy and infinite sequences

A generator can yield values forever (`while (true) yield n++`) and callers take only what they need
with `for...of` + `break`, or a `take(n)` helper. You process items without building the whole list.

**Why this works:** generators pause between values, so infinite or huge sequences cost only what's
consumed.

## Example 3 — Pitfall: leaking the internal structure

If a collection exposes its backing array directly, callers start depending on it being an array —
changing the storage later breaks them. That's exactly what Iterator prevents.

**Why this bites:** the point of Iterator is to hide representation; handing out the raw structure
defeats it.

# Common Mistakes

- **Hand-writing `next()`** when a generator would be far simpler.
- **Exposing the backing collection** instead of an iterator, coupling callers to the structure.
- **Reusing a one-shot iterator** — many iterators are exhausted after one pass; return a fresh one from
  `[Symbol.iterator]`.

# Best Practices

- Implement `[Symbol.iterator]` (usually with a **generator**) to make a class work with `for...of`.
- Keep the internal structure **private**; expose iteration, not the container.
- Use generators for **lazy** traversal of large or infinite sequences.

# Summary

- **Iterator** provides sequential access to a collection **without exposing** its internal structure.
- The JS/TS **protocol** is `Symbol.iterator` + `next()` returning `{ value, done }`.
- **Generators** (`function*`/`yield`) implement iterators with minimal code and enable lazy/infinite
  sequences.
- It's a pattern the language largely provides for you — you supply `[Symbol.iterator]`, `for...of` does
  the rest.

# Flash Cards

Q: What is the intent of the Iterator pattern?
A: Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.

Q: What does an iterator's next() method return in JavaScript/TypeScript?
A: An object of the shape { value, done }, where done becomes true when iteration is finished.

Q: What makes an object "iterable" in TypeScript?
A: Having a [Symbol.iterator]() method that returns an iterator; iterables work with for...of, spread, and destructuring.

Q: How do generators simplify implementing Iterator?
A: A function* with yield automatically produces an iterator, so you implement [Symbol.iterator] in a few lines instead of hand-writing next().

Q: Why is Iterator often called a pattern the language gives you "for free"?
A: The iterator protocol is built into JavaScript/TypeScript, so for...of and spread work as long as you implement Symbol.iterator (often via a generator).

Q: What advantage do generators give for large or infinite sequences?
A: They compute values lazily, pausing between them, so you only pay for the values you actually consume.

# Exercises

### Easy
Explain what `{ value, done }` means, and when `done` becomes `true`, using the `NumberRange` example.

### Medium
Write an iterable `EvenNumbers` class (using a generator) that yields even numbers from 0 up to a given
limit, and iterate it with `for...of`.

### Challenging
Implement an **infinite** generator `naturals()` that yields 1, 2, 3, … forever, plus a `take(iter, n)`
helper that returns the first `n` values. Explain why this doesn't loop forever when you only take a few.

# Further Reading

- Gamma et al. — *Design Patterns*, "Iterator".
- MDN — *Iteration protocols*: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols>
- Refactoring.Guru — *Iterator*: <https://refactoring.guru/design-patterns/iterator>
