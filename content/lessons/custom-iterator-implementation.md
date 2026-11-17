---
slug: custom-iterator-implementation
title: "Implementing Custom Iterators in TypeScript"
topic: behavioral-traversal
kind: technique
summary: "Create collection iterators tracking current indexes with hasNext and next methods across trees and graphs."
tags:
  - behavioral
  - iterator
  - typescript
  - custom-collection
related:
  - iterator-intent
  - js-iterators-and-generators
  - composite-recursive-operations
---

> **In one line:** Implement custom Iterator classes in TypeScript by managing cursor state and boundary checks.

## The idea

To implement a custom GoF Iterator class in TypeScript, you separate the data storage class from the iteration cursor class.

The **Collection class** stores elements in its internal data structure (e.g., a private array or linked node tree). It exposes a `getIterator()` method that instantiates and returns a new iterator, passing itself (or its internal array) to the iterator's constructor.

The **Iterator class** holds a reference to the collection and maintains a private `cursorIndex` integer.
- `hasNext(): boolean`: Returns true if the cursor has not exceeded collection bounds.
- `next(): T`: Retrieves the element at the current cursor, advances the cursor forward by one, and returns the element.

| Step | Method | Implementation Detail |
|---|---|---|
| **Boundary Check** | `hasNext()` | `return this.cursor < this.items.length;` |
| **Value Retrieval** | `next()` | Throws if out of bounds; returns `this.items[this.cursor++]` |
| **Factory Hook** | `createIterator()` | `return new ArrayIterator(this.items);` |

> **Tip:** Always throw an explicit error or return a boundary indicator if `next()` is called when `hasNext()` is false, preventing silent undefined value bugs.

## See it

```typescript
class UserList {
  private users: string[] = [];
  add(user: string) { this.users.push(user); }
  getUsers() { return this.users; }
  getIterator(): SimpleIterator<string> { return new UserIterator(this); }
}

class UserIterator implements SimpleIterator<string> {
  private cursor = 0;
  constructor(private list: UserList) {}

  hasNext(): boolean { return this.cursor < this.list.getUsers().length; }

  next(): string {
    if (!this.hasNext()) throw new Error('No more elements');
    return this.list.getUsers()[this.cursor++];
  }
}

const list = new UserList();
list.add('Alice');
const it = list.getIterator();
while (it.hasNext()) console.log(it.next());
```

## Go deeper

For reverse iteration, you do not need to reverse the array in memory (which is slow and mutates data). You simply write a `ReverseIterator` whose constructor sets `cursor = items.length - 1`, checks `cursor >= 0`, and decrements `cursor--` on each call to `next()`. This achieves zero-cost reverse traversal.

## Watch out

- Do not mutate collection elements while iterating; cursor indexes will drift out of synchronization.
- Ensure that iterators hold private references and do not expose internal collection arrays directly.

## Remember

- Custom iterators manage cursor pointers independently from underlying collection storage.
- hasNext() verifies collection boundaries before next() accesses and advances the cursor.
- Custom iterators can traverse in reverse, skip elements, or filter items on the fly.
