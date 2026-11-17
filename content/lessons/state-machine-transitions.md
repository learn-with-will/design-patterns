---
slug: state-machine-transitions
title: "State-Driven Transitions in TypeScript"
topic: behavioral-algorithms
kind: technique
summary: "Represent document or order states as classes that trigger transitions to subsequent states directly on the context."
tags:
  - behavioral
  - state
  - transitions
  - typescript
related:
  - state-intent
  - strategy-vs-state-distinction
  - strategy-intent
---

> **In one line:** Manage state transitions cleanly in TypeScript by injecting the context and swapping state instances.

## The idea

In the State pattern, there are two primary approaches for deciding where **state transitions** should occur:

1. **State-Driven Transitions**: The concrete state classes themselves know the transition rules. When an operation completes, the current state invokes a method on the Context to transition to the next state: `context.changeState(new ShippedState())`. This approach is natural when states logically follow a sequential progression.
2. **Context-Driven Transitions**: The Context evaluates conditions and controls transitions, while states merely execute business logic. This approach is preferred when transitions depend on global application state that individual states do not see.

In TypeScript, state-driven transitions are typically implemented by passing the Context reference into state methods, or by having the Context set itself on the state object during assignment. This keeps transition boundaries clear and self-documenting.

| Transition Approach | Where Logic Lives | Advantages | Disadvantages |
|---|---|---|---|
| **State-Driven** | Inside concrete state classes | Decentralized; states know their successors | States depend on each other's classes |
| **Context-Driven** | Inside the Context class | States are completely decoupled from each other | Context contains transition conditional logic |

> **Tip:** You can reuse stateless ConcreteState instances by storing them in static class fields: `context.changeState(PublishedState.instance)`, preventing garbage collection churn during rapid state flipping.

## See it

```typescript
interface AudioState {
  pressPlay(player: AudioPlayer): void;
}

class AudioPlayer {
  constructor(private state: AudioState) {}
  setState(s: AudioState) { this.state = s; }
  play() { this.state.pressPlay(this); }
}

class StoppedState implements AudioState {
  pressPlay(player: AudioPlayer): void {
    console.log('Playing audio...');
    player.setState(new PlayingState());
  }
}

class PlayingState implements AudioState {
  pressPlay(player: AudioPlayer): void {
    console.log('Pausing audio...');
    player.setState(new StoppedState());
  }
}
```

## Go deeper

When states share common default behavior (such as throwing an error for unsupported actions like "invalid transition"), you can create an abstract `DefaultState` base class. Specific concrete states only override the specific methods that represent valid operations from that state, automatically rejecting everything else with informative error messages. This pattern keeps concrete states minimal and robust against unexpected input.

## Watch out

- Ensure that the Context's state reference is always valid; never allow it to become null or undefined.
- Be mindful of tight coupling between state classes when states instantiate their successor classes directly.

## Remember

- State transitions can be controlled either by concrete states or centrally by the Context.
- Passing the Context reference into state methods allows states to trigger transitions cleanly.
- Abstract default state base classes provide safe fallback behavior for invalid transitions.
