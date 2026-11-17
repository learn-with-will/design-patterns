---
slug: observer-intent
title: "Observer: Intent & One-to-Many Events"
topic: behavioral-coordination
kind: pattern
summary: "Define a one-to-many dependency between objects so that when one object changes state, all dependents are notified."
tags:
  - behavioral
  - observer
  - events
  - pub-sub
  - reactivity
related:
  - subject-observer-subscription
  - push-vs-pull-observer
  - observer-memory-leaks-and-cleanup
---

> **In one line:** Observer defines a one-to-many subscription model where state changes in a Subject automatically notify dependents.

## The idea

In event-driven architectures, you frequently have a central data entity (the Subject) whose state changes must be observed by multiple independent components (the Observers): UI views, analytics loggers, cache invalidators, and audit trailers.

If the Subject hardcodes direct method calls to every interested component, the Subject becomes hopelessly coupled to concrete UI and logging classes. Adding a new listener requires modifying the Subject class, violating the Open/Closed Principle.

The Gang of Four's **Observer** pattern (also known as **Publish-Subscribe** or **Listener**) solves this cleanly. Its official intent is: **"Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically."** The Subject maintains a dynamic list of subscribers and broadcasts notifications without knowing who the observers are or what they do.

| Participant | Role | Responsibility |
|---|---|---|
| **Subject** | Publisher of state changes | Maintains subscriber list; provides `attach()` & `notify()` |
| **Observer** | Subscriber contract | Declares the update method invoked by the subject |
| **ConcreteSubject** | State owner | Notifies observers whenever its internal state mutates |
| **ConcreteObserver** | Specific listener | Reacts to notifications; updates UI or performs work |

> **Note:** The fundamental payoff of Observer is loose coupling: the Subject only knows that its observers implement `interface Observer { update(): void; }`. Observers can be registered and removed dynamically at runtime.

## See it

```typescript
// Observer contract
interface Observer {
  update(price: number): void;
}

// Subject
class CryptoCurrency {
  private observers: Observer[] = [];
  constructor(private price: number) {}

  attach(o: Observer) { this.observers.push(o); }
  setPrice(newPrice: number) {
    this.price = newPrice;
    this.notifyAll();
  }
  private notifyAll() {
    for (const o of this.observers) o.update(this.price);
  }
}

// Concrete observer
class PriceDisplay implements Observer {
  update(p: number) { console.log(`Display updated price: $${p}`); }
}
```

## Go deeper

Observer is the bedrock of modern reactive programming frameworks (RxJS, Signals in Angular 17+, and Vue Reactivity). Whenever you create an Observable and call `.subscribe()`, or track a signal that updates a UI template, you are applying the principles of the Observer pattern.

## Watch out

- Watch out for memory leaks caused by forgetting to detach registered observers (the Lapsed Listener problem).
- Avoid triggering subject mutations from inside an observer update() method, which can cause infinite notification loops.

## Remember

- Observer establishes a decoupled, dynamic one-to-many subscription model.
- Subjects maintain lists of subscribers and broadcast notifications upon state changes.
- Observers can be attached, detached, and replaced dynamically at runtime.
