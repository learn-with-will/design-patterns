---
slug: singleton-drawbacks-and-antipattern
title: "Singleton Pitfalls & Anti-Pattern Risks"
topic: creational-objects
kind: pitfall
summary: "Singletons introduce hidden dependencies, tight coupling, testing hurdles, and global mutable state."
tags:
  - creational
  - singleton
  - antipattern
  - pitfall
  - testing
related:
  - singleton-intent
  - singleton-implementation-ts
  - singleton-alternatives-modules-di
---

> **In one line:** Singleton is widely considered an anti-pattern because it introduces global mutable state and breaks unit testing.

## The idea

Despite being cataloged by the Gang of Four, Singleton is today widely regarded by senior software architects as an **anti-pattern** when used improperly.

The first critical drawback is that Singletons introduce **hidden dependencies**. When a class calls `DatabasePool.getInstance().query()`, its constructor signature does not declare that it depends on the database. The dependency is concealed deep within method implementations, making the class dishonest about its requirements.

The second major drawback is that Singletons ruin **unit testing**. Unit tests must run in complete isolation. Because a Singleton persists state globally across the entire runtime process, changes made to the Singleton by Test A leak into Test B, causing intermittent test failures that are notoriously difficult to debug. Furthermore, mocking a singleton requires brittle reflection hacks that destabilize test suites.

| SOLID Principle | Singleton Impact |
|---|---|
| **Single Responsibility (SRP)** | Violates: manages both its business logic AND its own lifecycle |
| **Open/Closed (OCP)** | Violates: hard to extend or replace with an alternative implementation |
| **Dependency Inversion (DIP)** | Violates: callers depend directly on the concrete Singleton class |

> **Watch out:** Global mutable state is the root cause of countless bugs in long-running applications. Singletons are effectively glorified global variables disguised behind an object-oriented class facade.

## See it

```typescript
// Bad: Hidden dependency & impossible to mock in a unit test
class OrderService {
  processOrder(amount: number) {
    // Hidden global dependency! Cannot test OrderService without live PaymentGateway
    PaymentGateway.getInstance().charge(amount);
  }
}

// Good: Explicit dependency injected via constructor
interface PaymentGatewayInterface { charge(amount: number): boolean; }

class TestableOrderService {
  constructor(private gateway: PaymentGatewayInterface) {}
  
  processOrder(amount: number): boolean {
    return this.gateway.charge(amount); // Trivially testable with mocks!
  }
}
```

## Go deeper

Michael Feathers, author of *Working Effectively with Legacy Code*, identified global Singletons as one of the primary obstacles to writing automated tests for legacy codebases. Singletons create tight coupling that prevents replacing real hardware drivers, file systems, or databases with lightweight in-memory test doubles. Embracing Dependency Injection preserves test isolation while allowing controlled single-instance lifetimes.

## Watch out

- Never use Singleton merely as a shortcut to avoid passing parameters down through a call stack.
- Avoid storing mutable session data or user state inside a process-wide Singleton.

## Remember

- Singletons hide class dependencies, making architectures difficult to reason about.
- Global mutable state makes unit tests brittle and prone to test-pollution failures.
- Singletons violate SRP and DIP by binding client code to a specific concrete instance.
