---
id: lesson-20
slug: observer
title: "Observer"
level: advanced
order: 20
duration: 16
tags:
  - behavioral
  - observer
  - events
  - pub-sub
  - gof
summary: "The Observer pattern — define a one-to-many dependency so that when a subject changes, all its registered observers are notified automatically — the idea behind event listeners, pub/sub, and reactive programming, taught with its real pitfalls like memory leaks from forgotten unsubscribes."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Observer pattern.
- Implement subscribe / notify in TypeScript.
- Explain **push vs pull** and the **memory-leak** pitfall.
- Relate Observer honestly to pub/sub and reactive libraries.

# Why It Matters

Lots of things need to react when something else changes: the UI updates when data changes, a logger
records events, a cache invalidates. Hard-wiring the changed object to call each of them couples it to
everything. **Observer** flips it around: interested parties **subscribe**, and the subject simply
**notifies** whoever is listening. It's the backbone of event systems, and understanding it (including
its traps) demystifies a huge amount of everyday code.

# Concept Explanation

### Intent

> **Define a one-to-many dependency between objects so that when one object changes state, all its
> dependents are notified and updated automatically.** — Gang of Four

### The participants

- **Subject (Observable)** — holds a list of observers and offers `subscribe`/`unsubscribe`; when its
  state changes, it **notifies** them.
- **Observer** — has an `update` method the subject calls.
- **Concrete Observer** — reacts to the notification.

```text
   Subject ──notify()──▶ Observer A
        │                Observer B
        └──────────────▶ Observer C
```

### In TypeScript

```typescript
interface Observer {
  update(value: number): void;
}

class Thermometer {
  private observers = new Set<Observer>();
  private _temp = 0;

  subscribe(o: Observer) { this.observers.add(o); }
  unsubscribe(o: Observer) { this.observers.delete(o); } // important: allow removal

  set temperature(t: number) {
    this._temp = t;
    for (const o of this.observers) o.update(t); // notify everyone
  }
}

class Display implements Observer {
  update(value: number) { console.log(`display: ${value}°`); }
}

const thermo = new Thermometer();
const display = new Display();
thermo.subscribe(display);
thermo.temperature = 21; // display logs "display: 21°"
thermo.unsubscribe(display);
```

The `Thermometer` doesn't know what a `Display` does — only that observers exist and want updates.

### Push vs pull

- **Push** — the subject sends the changed data to observers (`update(value)` above).
- **Pull** — the subject notifies with minimal info and observers **ask** for what they need
  (`update(subject)` then read from it).

Push is simple; pull decouples the subject from what each observer wants.

### The memory-leak pitfall

Observers that **forget to unsubscribe** keep the subject holding a reference to them, so they're never
garbage-collected — a classic leak in long-lived apps. **Always unsubscribe** when an observer goes away
(component unmounts, dialog closes). This is a real, common bug — so common that **Java deprecated its
`java.util.Observer`/`Observable`** classes in Java 9 because the naive built-in was too limited. The
*pattern* is sound; the naive *implementation* is what to avoid.

### Observer vs pub/sub and reactive

Observer is the **basis** of event listeners, the publish/subscribe model, and reactive libraries
(like RxJS), but it isn't identical to them. Pub/sub usually adds a **broker/event channel** between
publishers and subscribers (they don't know each other at all); reactive streams add operators,
scheduling, and composition. Treat Observer as the core idea those build on — don't overclaim they're
the same.

### Consequences

- **Good:** loose coupling between subject and observers; add/remove observers at runtime; supports
  broadcast communication.
- **Cost:** **memory leaks** if you don't unsubscribe; **notification order** isn't guaranteed;
  cascading updates can be hard to follow or cause loops.

# Key Terminology

- **Subject / Observable** — the object being watched; notifies observers on change.
- **Observer** — an object that reacts to notifications via `update`.
- **Subscribe / unsubscribe** — register or remove an observer.
- **Push vs pull** — whether the subject sends the data or observers fetch it.

# Options and Trade-offs

| Concern | Observer | Direct calls | How to choose |
| ------- | -------- | ------------ | ------------- |
| Coupling | Subject unaware of concrete observers | Subject calls each dependent | Observer when dependents vary or are many. |
| Data delivery | Push or pull | N/A | Push for simplicity; pull to decouple from observer needs. |
| Lifetime | Must unsubscribe | N/A | Always remove observers to avoid leaks. |

# Worked Example

Multiple observers react to one change, and one leaves:

```typescript
class Logger implements Observer { update(v: number) { console.log("log", v); } }

const thermo = new Thermometer();
const display = new Display();
const logger = new Logger();
thermo.subscribe(display);
thermo.subscribe(logger);
thermo.temperature = 30; // both display and logger get 30
thermo.unsubscribe(logger);
thermo.temperature = 31; // only display gets 31
```

One state change fans out to all current subscribers — no more, no fewer.

# Real World Analogy

Observer is a **newsletter subscription**. You subscribe; when a new issue is published, it's sent to
everyone on the list automatically. The publisher doesn't need to know who you are — and if you
**unsubscribe**, you stop getting issues (and they stop "holding onto" you). Forgetting to unsubscribe
is like mail piling up forever.

# Examples

## Example 1 — Basic: broadcast on change

Setting `thermo.temperature = 21` notifies every subscriber. The subject just loops over its observers.

**Why this works:** observers registered their interest, so the subject can notify them generically.

## Example 2 — Real-world: UI data binding and events

DOM `addEventListener`, framework state updating the view, and RxJS streams are all Observer at heart:
something changes, and registered listeners react.

**Why this works:** decoupling the source of a change from the reactions to it scales to many listeners.

## Example 3 — Pitfall: the forgotten unsubscribe

A component subscribes on mount but never unsubscribes on unmount. The subject keeps a reference, the
component can't be collected, and updates keep firing on a dead component.

**Why this bites:** un-removed observers cause **memory leaks** and stray updates — the most common
Observer bug.

# Common Mistakes

- **Never unsubscribing.** Leaks memory and fires updates on defunct observers.
- **Assuming a notification order.** It isn't guaranteed; don't depend on it.
- **Overclaiming Observer == pub/sub == reactive.** They build on Observer but add brokers, operators,
  and more.

# Best Practices

- **Always unsubscribe** when an observer's life ends.
- Choose **push or pull** deliberately based on how much observers need to know.
- Guard against **cascades/loops** where a notification triggers more notifications.

# Summary

- **Observer** defines a **one-to-many** dependency: a subject notifies all registered observers when
  it changes.
- Delivery can be **push** (send data) or **pull** (observers fetch it).
- The big pitfall is **memory leaks** from forgotten unsubscribes (why Java deprecated its naive
  built-in).
- It's the **basis** of events, pub/sub, and reactive programming — related but not identical.

# Flash Cards

Q: What is the intent of the Observer pattern?
A: Define a one-to-many dependency so that when a subject changes state, all its registered observers are notified and updated automatically.

Q: What is the difference between push and pull in Observer?
A: In push, the subject sends the changed data to observers; in pull, the subject notifies minimally and observers ask the subject for what they need.

Q: What is the most common bug with Observer, and how do you avoid it?
A: A memory leak from observers that never unsubscribe; always remove an observer when it goes away so the subject stops referencing it.

Q: Is Observer the same as pub/sub or reactive programming?
A: No — it's the basis of them, but pub/sub adds a broker between publishers and subscribers, and reactive libraries add operators and scheduling.

Q: What are the two main roles in Observer?
A: The Subject (Observable), which holds observers and notifies them, and the Observer, which reacts via an update method.

Q: Why did Java deprecate java.util.Observer/Observable?
A: The naive built-in implementation was too limited; it's a caution about naive implementations, not about the pattern itself, which remains sound.

# Exercises

### Easy
Explain what happens when `thermo.temperature = 21` runs, and why the `Thermometer` doesn't need to know
what a `Display` does.

### Medium
Add an `unsubscribe` in a simulated component lifecycle: "mount" subscribes, "unmount" unsubscribes.
Show that after unmount, changing the temperature no longer calls the component's `update`.

### Challenging
Convert the example from **push** to **pull**: change `update` to receive the subject, and have each
observer read only the field it cares about. Explain one advantage pull has when observers need
different data.

# Further Reading

- Gamma et al. — *Design Patterns*, "Observer".
- Refactoring.Guru — *Observer*: <https://refactoring.guru/design-patterns/observer>
- MDN — *EventTarget.addEventListener()*: <https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener>
