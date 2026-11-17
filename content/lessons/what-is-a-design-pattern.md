---
slug: what-is-a-design-pattern
title: "What Is a Design Pattern?"
topic: foundations
kind: concept
summary: "A design pattern is a named, reusable solution to a recurring software design problem that you adapt to your context."
tags:
  - foundations
  - gof
  - architecture
  - vocabulary
related:
  - gof-categories-and-catalog
  - design-principles-interfaces-composition
  - when-to-use-patterns
---

> **In one line:** A design pattern is a named, general template for arranging objects to solve a recurring software architecture problem.

## The idea

Every programmer eventually encounters the same architectural obstacles: how to instantiate an object without coupling to a concrete class, how to extend existing features without rewriting stable code, or how to coordinate components without creating spaghetti dependencies.

Experienced software engineers observed that certain structural arrangements consistently succeed. A design pattern captures one of these repeatable arrangements and gives it an established name. When developers say "let us use an Observer here", an entire architectural configuration—its participants, interactions, and trade-offs—is communicated immediately.

A pattern is not finished executable code, an off-the-shelf npm library, or an algorithm. Algorithms like binary search compute discrete mathematical values. In contrast, design patterns organize structural relationships and partition operational responsibilities between collaborating objects.

| Aspect | Design Pattern | Algorithm | Library / Framework |
|---|---|---|---|
| **Primary Goal** | Organize object interactions | Compute specific outputs | Provide prebuilt components |
| **Form** | Architectural blueprint | Concrete logic steps | Packaged executable code |
| **Adaptation** | Customized to domain | Implemented directly | Imported as dependency |
| **Payoff** | Shared team vocabulary | Predictable runtime | Rapid development |

> **Note:** The Gang of Four formulated four essential elements for every pattern: its recognized Name, the Problem context where it applies, the structural Solution of participants, and the associated Consequences or trade-offs.

## See it

```typescript
// Patterns describe relationships through interfaces rather than rigid classes
interface PaymentProcessor {
  processPayment(amount: number): boolean;
}

class StripeService implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Charging ${amount} via Stripe API`);
    return true;
  }
}

// Client depends solely on the abstract contract
function completeCheckout(processor: PaymentProcessor, total: number): void {
  processor.processPayment(total);
}
```

## Go deeper

Architect Christopher Alexander introduced pattern languages in 1977 for physical architecture, observing that towns and buildings share recurring design solutions. In 1994, Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides (the Gang of Four or GoF) ported this insight to object-oriented software engineering. Their landmark work remains the universal standard for design pattern terminology across modern software systems.

## Watch out

- Do not treat patterns as recipes to copy blindly; adapt the underlying concept to your specific domain.
- Never force a design pattern where a simple standalone function or plain object literal is sufficient.

## Remember

- A design pattern is a reusable architectural blueprint for solving recurring object design problems.
- Patterns establish a standardized engineering vocabulary that accelerates technical communication.
- Patterns are not algorithms or libraries; they govern object responsibilities and architectural boundaries.
