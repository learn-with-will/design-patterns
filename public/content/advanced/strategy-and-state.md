---
id: lesson-21
slug: strategy-and-state
title: "Strategy & State"
level: advanced
order: 21
duration: 18
tags:
  - behavioral
  - strategy
  - state
  - composition
  - gof
summary: "Two behavioral patterns with nearly identical structure but different intent — Strategy makes a family of algorithms interchangeable so a client can pick one, while State lets an object change its behavior (and often trigger its own transitions) as its internal state changes — taught together so you never confuse them."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of both **Strategy** and **State**.
- Implement each in TypeScript by delegating to a swappable object.
- Explain why they share a structure but differ in **intent** and **who drives the change**.
- Choose the right one for a given problem.

# Why It Matters

Strategy and State look almost the same on a class diagram — a **context** that holds an object
implementing a common interface and delegates to it. That's exactly why they're constantly confused.
The difference is in **intent**: Strategy is about **choosing an algorithm**; State is about an object
whose **behavior changes as it moves between states**. Learning them side by side fixes the confusion
for good.

# Concept Explanation

### Strategy: interchangeable algorithms

> **Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets
> the algorithm vary independently from the clients that use it.** — Gang of Four

The client (or context) is configured with a **strategy** and can swap it. The strategies are
independent and don't know about each other.

```typescript
interface PricingStrategy {
  price(base: number): number;
}
class RegularPrice implements PricingStrategy { price(b: number) { return b; } }
class MemberPrice implements PricingStrategy { price(b: number) { return b * 0.9; } }
class ClearancePrice implements PricingStrategy { price(b: number) { return b * 0.5; } }

class Cart {
  constructor(private strategy: PricingStrategy) {}
  setStrategy(s: PricingStrategy) { this.strategy = s; } // client chooses
  checkout(base: number) { return this.strategy.price(base); }
}

const cart = new Cart(new RegularPrice());
cart.checkout(100);              // 100
cart.setStrategy(new MemberPrice());
cart.checkout(100);              // 90
```

### State: behavior that changes with internal state

> **Allow an object to alter its behavior when its internal state changes. The object will appear to
> change its class.** — Gang of Four

The context delegates to a **state** object; but here the states represent the object's *situation*, and
a state often **triggers the transition** to the next state.

```typescript
interface TrafficState {
  readonly label: string;
  next(light: TrafficLight): void;
}
class Red implements TrafficState {
  label = "red";
  next(light: TrafficLight) { light.state = new Green(); }   // the state moves the machine on
}
class Green implements TrafficState {
  label = "green";
  next(light: TrafficLight) { light.state = new Yellow(); }
}
class Yellow implements TrafficState {
  label = "yellow";
  next(light: TrafficLight) { light.state = new Red(); }
}

class TrafficLight {
  state: TrafficState = new Red();
  change() { this.state.next(this); }
  get color() { return this.state.label; }
}

const light = new TrafficLight();
light.color;            // "red"
light.change(); light.color; // "green"
light.change(); light.color; // "yellow"
```

State replaces a tangle of `if (this.status === "red") … else if …` with one class per state.

### Same structure, different intent

| Aspect | Strategy | State |
| ------ | -------- | ----- |
| **Intent** | Pick one of several **algorithms** | Change behavior as **internal state** changes |
| **Who chooses** | The **client** sets the strategy | The object **transitions** itself (states often know the next state) |
| **Do the parts know each other?** | Strategies are **independent** | States often **reference and trigger** other states |
| **How often it changes** | Often set once (or occasionally) | Changes repeatedly over the object's lifetime |

Structurally twins; conceptually different. Ask: *am I choosing an algorithm (Strategy), or modeling an
object that moves through states (State)?*

### Consequences

- **Strategy — good:** swap algorithms at runtime; replaces conditionals; each algorithm is testable in
  isolation. **Cost:** clients must know the strategies exist to choose among them.
- **State — good:** removes sprawling state conditionals; makes transitions explicit and localized.
  **Cost:** more classes; transition logic is spread across state classes.

# Key Terminology

- **Strategy** — an interchangeable algorithm object selected by the client.
- **State** — an object representing a mode of behavior; may trigger transitions.
- **Context** — the object that holds and delegates to the current strategy/state.
- **Transition** — moving from one state to another (a State concept).

# Options and Trade-offs

| Question | Choose Strategy | Choose State |
| -------- | --------------- | ------------ |
| Are you swapping an algorithm? | Yes | No |
| Does behavior depend on a changing mode/status? | No | Yes |
| Do the parts trigger each other? | No (independent) | Yes (states transition) |
| Replacing an `if/else` on a "type"? | Strategy | Replacing one on a "status"? State |

# Worked Example

The same delegation shape, two intents:

```text
Strategy: Cart --price()--> [ Regular | Member | Clearance ]   (client picks)
State:    Light --next()--> [ Red -> Green -> Yellow -> Red ]   (states advance themselves)
```

Notice `Cart` never changes its own strategy on its own — you do. `TrafficLight` advances through its
states by itself when you call `change()`. That's the tell.

# Real World Analogy

- **Strategy** is choosing your **route app's mode**: fastest, shortest, or avoid-tolls. You pick the
  algorithm; each computes a route independently.
- **State** is a **traffic light**: it moves red → green → yellow → red on its own schedule, behaving
  differently in each state and deciding when to advance.

# Examples

## Example 1 — Basic: a Strategy you select

`cart.setStrategy(new MemberPrice())` swaps the pricing algorithm; `checkout(100)` now returns 90. You
chose the algorithm; the cart just used it.

**Why this works:** interchangeable algorithms behind one interface, selected by the client.

## Example 2 — Real-world: a State machine

An order moves `Pending → Paid → Shipped → Delivered`, behaving differently in each state (e.g. only
`Paid` can ship). Each state is a class that knows the valid next state.

**Why this works:** the object's behavior and its legal transitions live in small, explicit state
classes instead of a giant conditional.

## Example 3 — Pitfall: calling a State a Strategy (or vice versa)

Treating traffic-light phases as "strategies the client picks" misses that the light **advances
itself**; treating pricing algorithms as "states" implies transitions that don't exist.

**Why this bites:** the structures match, so the wrong label leads to the wrong design (client-driven
vs self-transitioning).

# Common Mistakes

- **Confusing the two** because their class diagrams match — always check *intent* and *who drives the
  change*.
- **Using State for a one-off algorithm choice** (that's Strategy).
- **Using Strategy where an object clearly transitions through modes** (that's State).

# Best Practices

- Pick by **intent**: choosing an algorithm → Strategy; behavior tied to a changing mode → State.
- Keep strategies **independent**; let states own their **transitions**.
- Prefer either over a sprawling `if/else`/`switch` on a "type" or "status" field.

# Summary

- **Strategy** makes a family of **algorithms interchangeable**, chosen by the **client**.
- **State** lets an object **change behavior as its internal state changes**, often **transitioning
  itself**.
- They share a structure (context delegates to a swappable object) but differ in **intent** and **who
  drives the change**.
- Both replace messy conditionals with small, focused classes.

# Flash Cards

Q: What is the intent of the Strategy pattern?
A: Define a family of algorithms, encapsulate each one, and make them interchangeable so the algorithm can vary independently from the clients that use it.

Q: What is the intent of the State pattern?
A: Allow an object to alter its behavior when its internal state changes, so it appears to change its class.

Q: Strategy and State share a structure — what is the key difference?
A: Intent and who drives the change: in Strategy the client picks an interchangeable algorithm; in State the object changes behavior as its state changes and often triggers its own transitions.

Q: In State, who usually triggers moving to the next state?
A: The state objects themselves — a state typically knows and sets the next state, so the object transitions on its own.

Q: In Strategy, do the different strategies know about each other?
A: No — strategies are independent and unaware of one another; the client selects among them.

Q: If you're replacing a big if/else on a "status" that changes over time, which pattern fits?
A: State — it models an object moving through modes; a big if/else on a "type" of algorithm choice would be Strategy.

# Exercises

### Easy
Write one sentence each stating the intent of Strategy and of State, then name which one the client
explicitly selects.

### Medium
Add a `StudentPrice` strategy (20% off) to the `Cart` example and switch to it at runtime. Separately,
add a `flashing` state to the traffic light that transitions to `Red`. Note which change you drove and
which the object drove.

### Challenging
Model an order lifecycle (`Pending → Paid → Shipped → Delivered`) with the State pattern, where illegal
transitions (e.g. shipping an unpaid order) are rejected. Then explain, in two sentences, why this is
State and not Strategy.

# Further Reading

- Gamma et al. — *Design Patterns*, "Strategy" and "State".
- Refactoring.Guru — *Strategy*: <https://refactoring.guru/design-patterns/strategy>
- Refactoring.Guru — *State*: <https://refactoring.guru/design-patterns/state>
