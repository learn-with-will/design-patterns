---
slug: strategy-implementation-ts
title: "Implementing Strategy in TypeScript"
topic: behavioral-algorithms
kind: technique
summary: "Pass strategy objects or plain functions to a context class to select routing algorithms or discount calculations."
tags:
  - behavioral
  - strategy
  - typescript
  - functions
related:
  - strategy-intent
  - strategy-vs-state-distinction
  - template-method-vs-strategy
---

> **In one line:** Implement Strategy in TypeScript using interfaces, classes, or first-class higher-order functions.

## The idea

When implementing the Strategy pattern in TypeScript, you have two primary architectural approaches depending on complexity:

1. **Class-based Strategy**: Use when the algorithm is complex, holds internal state or configuration, or implements multiple related methods. You define an `interface Strategy` and create classes implementing that contract.
2. **Function-based Strategy**: Use when the algorithm is a pure data transformation function (taking inputs and returning outputs). In TypeScript, you define a function type: `type PricingStrategy = (price: number) => number`.

The Context class accepts the strategy—either via its constructor or via a setter method—enabling runtime strategy switching. This keeps the calling context completely agnostic of calculation specifics, isolating changes to dedicated strategy modules.

| Approach | Mechanism | When to Choose |
|---|---|---|
| **Class Strategy** | Classes implementing `interface Strategy` | Algorithms with private state, helpers, or configuration |
| **Function Strategy** | First-class functions / lambdas | Pure algorithmic calculations without mutable state |
| **Strategy Map** | Dictionary lookup `Record<string, Strategy>` | Selecting strategies by runtime string flags |

> **Tip:** Storing strategies in a lookup Map or dictionary allows you to eliminate `switch` statements entirely, achieving 100% compliance with the Open/Closed Principle.

## See it

```typescript
// Function-based Strategy in TypeScript
type DiscountStrategy = (amount: number) => number;

const regularDiscount: DiscountStrategy = (price) => price;
const premiumDiscount: DiscountStrategy = (price) => price * 0.85;
const clearanceDiscount: DiscountStrategy = (price) => price * 0.50;

class ShoppingCart {
  constructor(private strategy: DiscountStrategy = regularDiscount) {}

  setDiscount(strategy: DiscountStrategy) { this.strategy = strategy; }

  calculateTotal(subtotal: number): number {
    return this.strategy(subtotal);
  }
}

const cart = new ShoppingCart();
console.log(cart.calculateTotal(100)); // 100
cart.setDiscount(clearanceDiscount);
console.log(cart.calculateTotal(100)); // 50
```

## Go deeper

Strategy objects should generally be stateless. If a strategy holds mutable state across method invocations, sharing a single strategy instance among concurrent requests or multiple Context objects introduces subtle race conditions. When strategies are pure and stateless, a single strategy instance can be safely shared application-wide. This promotes memory efficiency and simplifies concurrency management in asynchronous environments.

## Watch out

- Avoid creating stateful strategies that can cause data leakage when shared across contexts.
- Do not let Strategy objects access private fields of the Context; pass data explicitly via parameters.

## Remember

- TypeScript supports both class-based and pure function-based Strategy implementations.
- Context classes delegate algorithmic work to the injected strategy reference.
- Stateless strategies can be safely cached, reused, and shared across multiple concurrent contexts.
