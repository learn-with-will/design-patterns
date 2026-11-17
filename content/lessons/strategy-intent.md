---
slug: strategy-intent
title: "Strategy: Intent & Algorithm Swapping"
topic: behavioral-algorithms
kind: pattern
summary: "Define a family of algorithms, encapsulate each one, and make them interchangeable to vary independently from clients."
tags:
  - behavioral
  - strategy
  - algorithms
  - polymorphism
related:
  - strategy-implementation-ts
  - state-intent
  - strategy-vs-state-distinction
---

> **In one line:** Strategy defines a family of interchangeable algorithms, enabling clients to swap algorithms independently at runtime.

## The idea

In software development, you often encounter classes that perform a specific task that can be calculated in multiple ways: route navigation (walking, driving, bicycling, transit), sorting algorithms, payment gateways, or tax calculation rules.

If all these algorithmic variants are hardcoded inside a single class using sprawling `if/else` or `switch` statements, the class becomes bloated, difficult to maintain, and a nightmare to unit test. Adding a new algorithm requires editing the existing class, directly violating the Open/Closed Principle.

The Gang of Four's **Strategy** pattern solves this. Its official intent is: **"Define a family of algorithms, encapsulate each one, and make them interchangeable. Strategy lets the algorithm vary independently from clients that use it."** The context class delegates the calculation to a Strategy interface. Concrete strategy classes implement the algorithm independently, allowing clients to swap strategies dynamically at runtime.

| Participant | Role | Responsibility |
|---|---|---|
| **Strategy** | Common interface for all algorithms | Declares execution method (e.g., `calculateRoute()`) |
| **ConcreteStrategy** | Specific algorithm implementation | Implements algorithm variant (`DrivingStrategy`) |
| **Context** | Maintains reference to Strategy object | Delegates calculation across strategy interface |
| **Client** | Selects and injects desired strategy | Passes strategy instance to Context |

> **Note:** Strategy replaces massive conditional branching with clean polymorphism. Instead of `switch(type)`, you instantiate the specific Strategy class needed.

## See it

```typescript
// Strategy contract
interface RouteStrategy {
  buildRoute(from: string, to: string): string;
}

class DrivingStrategy implements RouteStrategy {
  buildRoute(from: string, to: string) { return `Fastest highway from ${from} to ${to}`; }
}

class WalkingStrategy implements RouteStrategy {
  buildRoute(from: string, to: string) { return `Scenic pedestrian path from ${from} to ${to}`; }
}

// Context delegates to injected strategy
class Navigator {
  constructor(private strategy: RouteStrategy) {}
  setStrategy(s: RouteStrategy) { this.strategy = s; }
  navigate(a: string, b: string) { console.log(this.strategy.buildRoute(a, b)); }
}
```

## Go deeper

In languages with first-class functions like TypeScript, a Strategy pattern does not always require a full class hierarchy. A function signature type (e.g., `type RouteStrategy = (a: string, b: string) => string`) can serve as the Strategy interface, and plain lambda functions can be passed as concrete strategies, drastically reducing boilerplate.

## Watch out

- Do not use Strategy if you only have a single algorithm that never changes.
- Beware of passing too many contextual parameters from the Context into the Strategy methods.

## Remember

- Strategy encapsulates a family of algorithms behind a common polymorphic interface.
- Clients can swap algorithm implementations dynamically at runtime without modifying Context logic.
- In TypeScript, first-class functions often serve as clean, lightweight Strategy implementations.
