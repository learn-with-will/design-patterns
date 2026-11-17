---
slug: iterator-intent
title: "Iterator: Intent & Traversal Decoupling"
topic: behavioral-traversal
kind: pattern
summary: "Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation."
tags:
  - behavioral
  - iterator
  - traversal
  - collections
related:
  - custom-iterator-implementation
  - js-iterators-and-generators
  - composite-intent
---

> **In one line:** Iterator provides sequential access to collection elements without exposing its internal data structure.

## The idea

Collections of data come in numerous underlying data structures: arrays, linked lists, binary search trees, hash sets, and graphs.

If client code needs to traverse a collection, having the client inspect internal nodes or array indexes tightly couples the client to that specific data structure. If you change a collection from a sorted array to a balanced tree, all client iteration loops break.

The Gang of Four's **Iterator** pattern solves this. Its official intent is: **"Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation."** An Iterator encapsulates the traversal algorithm and current cursor position in a standalone object, providing simple `next()` and `hasNext()` methods. Clients traverse any collection uniformly without knowing whether it is backed by an array, list, or tree.

| Participant | Role | Responsibility |
|---|---|---|
| **Iterator** | Interface for accessing elements | Declares `next()`, `hasNext()`, `current()` |
| **ConcreteIterator** | Tracks current traversal state | Computes next element across specific data structure |
| **Aggregate** | Collection interface | Declares `createIterator()` factory method |
| **ConcreteAggregate** | Concrete data structure (Array/Tree) | Returns instance of matching ConcreteIterator |

> **Note:** A collection can have multiple iterators traversing it simultaneously. Because each iterator object stores its own independent cursor state, multiple loops can iterate over the same collection concurrently without interference.

## See it

```typescript
// Minimal Iterator contract
interface SimpleIterator<T> {
  hasNext(): boolean;
  next(): T;
}

interface IterableCollection<T> {
  createIterator(): SimpleIterator<T>;
}

// Client code traverses uniformly
function printAll<T>(collection: IterableCollection<T>): void {
  const iterator = collection.createIterator();
  while (iterator.hasNext()) {
    console.log(iterator.next());
  }
}
```

## Go deeper

Iterator also enables multiple distinct traversal algorithms over the exact same data structure. A binary tree collection can expose `createInOrderIterator()`, `createPreOrderIterator()`, and `createBreadthFirstIterator()`. The tree data remains unchanged; each iterator encapsulates a distinct mathematical traversal strategy.

## Watch out

- Watch out for concurrent modification errors if a collection is mutated while an active iterator is traversing it.
- Avoid implementing complex manual iterators when built-in language iterators are available.

## Remember

- Iterator decouples collection traversal algorithms from underlying data structure storage.
- Clients traverse disparate data structures uniformly without knowing internal arrangements.
- Multiple independent iterators can traverse the same collection simultaneously.
