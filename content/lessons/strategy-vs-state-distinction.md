---
slug: strategy-vs-state-distinction
title: "Strategy vs State: Same Structure, Different Intent"
topic: behavioral-algorithms
kind: concept
summary: "Strategy lets clients choose independent algorithms; State switches behavior automatically during internal lifecycle changes."
tags:
  - behavioral
  - strategy
  - state
  - comparison
related:
  - strategy-intent
  - state-intent
  - design-principles-interfaces-composition
---

> **In one line:** Strategy and State have identical class structures, but Strategy varies algorithms while State tracks lifecycle phases.

## The idea

In the Gang of Four catalog, **Strategy** and **State** have almost **identical class diagrams**: a Context class holds a reference to an interface, delegates work to it, and concrete subclasses provide specific implementations.

Despite having the same structural shape, their **architectural intents** and runtime behaviors are fundamentally different:

**Strategy** is about **interchangeable algorithms**. The client explicitly chooses which algorithm to use and passes it into the Context. The different strategies are completely independent and oblivious to each other. Strategies rarely trigger changes to the Context.

**State** is about **internal lifecycle transitions**. The client usually interacts with the Context without knowing what state it is currently in. As actions execute, the state changes automatically based on internal conditions. The concrete state classes frequently know about each other and trigger transitions between themselves.

| Dimension | Strategy Pattern | State Pattern |
|---|---|---|
| **Primary Intent** | Interchangeable algorithms | Internal lifecycle phase transitions |
| **Who Changes It** | The **Client** chooses and configures strategy | The **Context/States** change state automatically |
| **State Knowledge** | Strategies are completely oblivious to each other | States frequently know about successor states |
| **Analogy** | Choosing a route algorithm (Driving vs Walking) | Traffic light transitions (Green ➔ Yellow ➔ Red) |

> **Note:** A simple distinction: Strategy is about *how* something is done (the algorithm). State is about *what condition* the object is in (its lifecycle phase).

## See it

```typescript
// Strategy: Client selects HOW to sort
interface SortStrategy { sort(items: number[]): number[]; }
class QuickSort implements SortStrategy {
  sort(items: number[]) { return items.sort((a, b) => a - b); }
}
const sorter = new Sorter(new QuickSort());
sorter.sort([3, 1, 2]);

// State: Context transitions WHAT condition it is in automatically
const connection = new TCPConnection(); // Starts in ClosedState
connection.open();  // Transitions internally to ListeningState
connection.send('data');  // Transitions internally to EstablishedState
// Client doesn't swap states manually; internal lifecycle drives it!
```

## Go deeper

This contrast highlights a core design patterns principle: **Structure does not define a pattern; Intent defines a pattern.** Two patterns can have the exact same UML structure (like Strategy and State, or Decorator and Proxy), but solve completely different architectural problems. Grasping the distinction between algorithm interchangeability and lifecycle transitions solidifies your architectural judgement.

## Watch out

- Never swap state instances from outside client code if the entity is supposed to manage its own lifecycle.
- Do not make strategy classes transition each other; strategies must remain strictly independent.

## Remember

- Strategy and State share an identical structural class diagram but have opposing intents.
- Strategy provides interchangeable algorithms selected and injected by clients.
- State manages internal lifecycle transitions triggered automatically during execution.
