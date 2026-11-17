---
slug: hooks-and-abstract-steps
title: "Hooks vs Abstract Steps"
topic: behavioral-algorithms
kind: technique
summary: "Use abstract steps for mandatory subclass logic and virtual hook methods with default implementations for optional overrides."
tags:
  - behavioral
  - template-method
  - hooks
  - extensibility
related:
  - template-method-intent
  - base-algorithm-skeleton
  - template-method-vs-strategy
---

> **In one line:** Abstract steps mandate subclass implementation; hooks provide optional interception points with default behavior.

## The idea

In the Template Method pattern, base classes communicate with subclasses through two distinct kinds of overridable methods: **Abstract Steps** and **Hooks**.

**Abstract Steps** represent **mandatory behavior**. The base class cannot function without them, so the method has no body and is marked `abstract`. Every subclass is forced by the TypeScript compiler to implement this method.

**Hooks** represent **optional behavior**. The base class provides an empty method (or a sensible default). Subclasses can choose to override the hook if they wish to intercept execution at that point, or ignore it completely. Hooks frequently control conditional branches inside the template method (e.g., `if (this.shouldNotify()) ...`).

| Feature | Abstract Step | Hook Method |
|---|---|---|
| **Base Declaration** | `protected abstract step(): void;` | `protected hook(): void {}` (empty default) |
| **Subclass Obligation** | **Mandatory**: fails compilation if omitted | **Optional**: override only when needed |
| **Typical Purpose** | Core domain logic (parsing, rendering) | Optional lifecycle triggers, boolean guards |
| **Example** | `abstract compileSource(): void;` | `beforeDeploy(): void {}`, `shouldCache(): boolean` |

> **Tip:** Boolean hook methods (predicate hooks like `customerWantsReceipt(): boolean { return true; }`) allow subclasses to dynamically toggle entire branches of the template algorithm on or off.

## See it

```typescript
abstract class OrderProcessor {
  processOrder(): void {
    this.validateCart();
    this.chargePayment();
    // Hook controls conditional execution
    if (this.shouldSendGiftReceipt()) {
      this.printGiftReceipt();
    }
    this.dispatchNotification();
  }

  // Mandatory abstract step
  protected abstract chargePayment(): void;

  // Optional hook with default implementation
  protected shouldSendGiftReceipt(): boolean {
    return false; // Default: no gift receipt
  }

  private validateCart() { console.log('Cart validated'); }
  private printGiftReceipt() { console.log('Gift receipt printed'); }
  private dispatchNotification() { console.log('Order complete email sent'); }
}
```

## Go deeper

React class components historically used hooks in their Template Method lifecycle: `componentDidMount()` and `componentWillUnmount()` were empty hook methods in `React.Component`. React's internal reconciliation loop called them during render cycles, but subclasses were never forced to implement them.

## Watch out

- Do not create so many hooks that subclasses become confused about where to inject behavior.
- Ensure that default hook implementations do not perform unexpected side effects.

## Remember

- Abstract steps enforce mandatory implementation for core domain variations.
- Hooks provide optional extension points with empty or sensible default implementations.
- Predicate boolean hooks allow subclasses to toggle entire branches of the template method.
