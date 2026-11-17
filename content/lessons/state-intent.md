---
slug: state-intent
title: "State: Intent & Internal Transitions"
topic: behavioral-algorithms
kind: pattern
summary: "Allow an object to alter its behavior when its internal state changes, appearing to change its class."
tags:
  - behavioral
  - state
  - state-machine
  - transitions
related:
  - state-machine-transitions
  - strategy-vs-state-distinction
  - strategy-intent
---

> **In one line:** State allows an object to alter its behavior when its internal state changes, appearing to change its class.

## The idea

Many domain entities progress through distinct lifecycle phases. For example, an order in an e-commerce workflow transitions through: `Placed`, `Shipped`, and `Cancelled`.

In each state, the entity behaves differently:
- Calling `cancel()` on a Placed order transitions to Cancelled.
- Calling `cancel()` on a Shipped order is rejected as invalid.
- Calling `ship()` on an already Shipped order is ignored.

If modeled procedurally, every method becomes an ever-growing conditional: `if (this.state === 'placed') ... else if (this.state === 'shipped') ...`. Adding a new state requires modifying every single method across the class!

The Gang of Four's **State** pattern solves this. Its official intent is: **"Allow an object to alter its behavior when its internal state changes. The object will appear to change its class."** Each state becomes an independent class implementing a common State interface. The Context delegates operations to its current state object.

| Participant | Role | Responsibility |
|---|---|---|
| **State** | Interface declaring state-specific behaviors | Defines operations common to all states |
| **ConcreteState** | Encapsulates behavior for one specific state | Executes action; triggers transitions |
| **Context** | The primary domain entity | Maintains reference to current State; delegates calls |

> **Note:** The key hallmark of the State pattern is that the state objects themselves frequently initiate state transitions on the Context: `this.context.changeState(new ShippedState())`.

## See it

```typescript
interface OrderState {
  cancel(ctx: OrderContext): void;
  ship(ctx: OrderContext): void;
}
class OrderContext {
  constructor(private state: OrderState) {}
  setState(s: OrderState) { this.state = s; }
  cancel() { this.state.cancel(this); }
  ship() { this.state.ship(this); }
}
class PlacedState implements OrderState {
  cancel(ctx: OrderContext) { ctx.setState(new CancelledState()); }
  ship(ctx: OrderContext) { ctx.setState(new ShippedState()); }
}
class ShippedState implements OrderState {
  cancel() { throw new Error('Cannot cancel shipped order'); }
  ship() { /* already shipped */ }
}
class CancelledState implements OrderState {
  cancel() { /* already cancelled */ }
  ship() { throw new Error('Cannot ship cancelled order'); }
}
```

## Go deeper

The State pattern is an object-oriented implementation of a Finite State Machine (FSM). While formal FSM tables list all state/event/transition tuples declaratively, the GoF State pattern decentralizes transition logic into individual state classes. For small-to-medium state machines, this structure is clean, self-documenting, and maintainable. It eliminates sprawling switch statements and localizes state rules.

## Watch out

- Do not use the State pattern if an entity only has one or two states with trivial conditional checks.
- Watch out for circular state transitions that create infinite loops in automated processes.

## Remember

- State encapsulates state-specific behaviors into dedicated, polymorphic classes.
- It eliminates massive conditional branching across entity methods.
- States themselves trigger transitions by updating the Context's current state reference.
