---
slug: subject-observer-subscription
title: "Implementing Subject & Observer in TypeScript"
topic: behavioral-coordination
kind: technique
summary: "Maintain an observer list on the Subject with attach, detach, and notify methods invoked upon state updates."
tags:
  - behavioral
  - observer
  - typescript
  - subscription
related:
  - observer-intent
  - push-vs-pull-observer
  - observer-memory-leaks-and-cleanup
---

> **In one line:** Implement Subject and Observer in TypeScript using clean subscription management and unsubscription disposables.

## The idea

Implementing the Observer pattern in TypeScript requires defining two interfaces: `Subject` and `Observer`.

A robust Subject implementation provides three essential methods:
1. `attach(observer: Observer): void` (or `subscribe`): Adds an observer to the internal subscriber list.
2. `detach(observer: Observer): void` (or `unsubscribe`): Removes an observer from the list.
3. `notify(): void`: Iterates over the subscriber collection and invokes each observer's update method.

In modern TypeScript, it is idiomatic to return an **Unsubscription Disposable** directly from the `subscribe()` method. This pattern (standardized by RxJS and event libraries) allows callers to clean up subscriptions easily without retaining manual references to the Subject.

| Method | Action | TypeScript Best Practice |
|---|---|---|
| **subscribe(obs)** | Registers observer | Return `{ unsubscribe(): void }` for ergonomic cleanup |
| **unsubscribe(obs)** | Removes observer | Use `Set<Observer>` for O(1) removal efficiency |
| **notify(data)** | Broadcasts to list | Iterate over a shallow copy of the set to prevent mutation bugs |

> **Tip:** Use a JavaScript `Set<Observer>` instead of an array to hold observers. A `Set` prevents accidental duplicate subscriptions and allows O(1) removal without manual index searching.

## See it

```typescript
interface Observer<T> { update(data: T): void; }

class Subject<T> {
  private observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): { unsubscribe: () => void } {
    this.observers.add(observer);
    return { unsubscribe: () => this.observers.delete(observer) };
  }

  notify(data: T): void {
    for (const observer of Array.from(this.observers)) {
      observer.update(data);
    }
  }
}

const news = new Subject<string>();
const sub = news.subscribe({ update: (msg) => console.log(msg) });
news.notify('New release!');
sub.unsubscribe();
```

## Go deeper

When an observer unregisters itself during its own `update()` execution (or when one observer causes another observer to be attached/detached), iterating over an active collection causes skipped elements or concurrent modification bugs. Iterating over a shallow copy (`Array.from(this.observers)`) provides complete iteration safety.

## Watch out

- Never allow an uncaught exception in one observer update() to crash the loop and prevent other observers from being notified.
- Wrap individual observer notification calls in try/catch blocks if observers are third-party plugins.

## Remember

- Subjects manage a collection of subscribers using attach, detach, and notify methods.
- Returning an unsubscribe function provides an ergonomic, leak-resistant cleanup API.
- Use Sets for O(1) observer storage and iterate over copies to prevent concurrent modification errors.
