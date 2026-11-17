---
slug: when-to-use-patterns
title: "When to Use Patterns (and When Not To)"
topic: foundations
kind: pitfall
summary: "Patterns add indirection and complexity; apply them to real recurring forces, never speculatively."
tags:
  - pitfall
  - yagni
  - refactoring
  - simplicity
related:
  - what-is-a-design-pattern
  - how-to-choose-a-design-pattern
  - avoiding-overengineering-yagni
---

> **In one line:** Patterns introduce indirection and cognitive load; apply them only when real architectural pressures emerge.

## The idea

One of the most dangerous phases for a software developer occurs immediately after learning design patterns: the urge to apply every pattern everywhere. This syndrome is often known as "Patternitis" or the "Golden Hammer" anti-pattern.

Design patterns are not a score of code quality. They are solutions to specific design tensions. Every pattern introduces a trade-off: additional classes, extra interfaces, and layers of runtime indirection. If the specific problem a pattern addresses does not exist in your codebase, you have incurred the complexity cost without receiving any architectural benefit.

The golden rule of design patterns is to **refactor toward patterns** rather than starting with them. Begin with the simplest design that accomplishes the requirement. When duplication, complex branching, or rigid dependencies cause pain during subsequent feature additions, refactor that specific friction into the appropriate pattern.

| Scenario | Direct Solution | Pattern Candidate |
|---|---|---|
| Single unchanging product creation | Direct `new Order()` | Factory Method if variants expand |
| Pure data transformation | Simple standalone function | Strategy if algorithms multiply |
| One-off service instance | Standard TS module export | Singleton only if strict global state |
| Small notification trigger | Direct callback function | Observer if subscribers grow dynamic |

> **Watch out:** The XP principle YAGNI ("You Aren't Gonna Need It") applies directly to architecture. Speculatively adding a pattern for imagined future requirements almost always results in dead boilerplate.

## See it

```typescript
// Before: Over-engineered Factory and Strategy for a simple discount
// class DiscountFactory { createDiscount(): DiscountStrategy { ... } }

// After: Idiomatic, straightforward TypeScript function
type DiscountTier = 'standard' | 'vip' | 'wholesale';

function calculatePrice(basePrice: number, tier: DiscountTier): number {
  const rates: Record<DiscountTier, number> = {
    standard: 1.0,
    vip: 0.8,
    wholesale: 0.6,
  };
  return basePrice * rates[tier];
}

console.log(calculatePrice(100, 'vip')); // 80
```

## Go deeper

Dynamic and multi-paradigm languages like TypeScript natively eliminate the need for several classic GoF patterns. First-class functions often replace Strategy and Command classes. Module singletons replace Singleton classes. Built-in iterators and generators supersede manual Iterator classes. Always consider whether language idioms solve the issue before constructing class hierarchies.

## Watch out

- Never judge engineering competence by how many design patterns are crammed into a module.
- Beware of adding abstraction layers for features that might never be requested.

## Remember

- Patterns introduce indirection and extra code; apply them only in response to real recurring forces.
- Refactor toward patterns incrementally instead of architecting speculative abstractions upfront.
- Leverage TypeScript language features like first-class functions before building heavy class hierarchies.
