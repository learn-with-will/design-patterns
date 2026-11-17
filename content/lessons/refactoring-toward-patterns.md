---
slug: refactoring-toward-patterns
title: "Refactoring Toward Patterns"
topic: architecture-selection
kind: technique
summary: "Introduce patterns incrementally when duplicate code or conditional branching indicates natural design pressure points."
tags:
  - architecture
  - refactoring
  - evolution
  - design-smells
related:
  - how-to-choose-a-design-pattern
  - avoiding-overengineering-yagni
  - recognizing-software-antipatterns
---

> **In one line:** Introduce design patterns incrementally through refactoring as real code smells and pressures emerge.

## The idea

In *Refactoring to Patterns*, Joshua Kerievsky demonstrated that the most resilient software architectures are not designed with patterns upfront. Instead, they **evolve toward patterns** through disciplined refactoring.

Attempting to predict all future requirements on day one leads to speculative complexity. The superior approach is:
1. Write the simplest possible code that passes tests (TDD).
2. As new requirements arrive, observe where friction and code smells emerge.
3. Refactor that specific smell toward the appropriate design pattern.

Code smells provide direct hints for pattern refactorings:
- Repeated `switch` statements on type codes ➔ Refactor to **Strategy** or **State**.
- Deep, messy constructor calls with booleans ➔ Refactor to **Builder**.
- Direct instantiation of external APIs scattered across services ➔ Refactor to **Adapter** or **Factory Method**.

| Code Smell | Architectural Friction | Target Pattern |
|---|---|---|
| Large Class with divergent reasons to change | Violates SRP | Extract classes via **Facade** or **Strategy** |
| Feature Envy (class accessing another's data) | High coupling | Move method or apply **Visitor** |
| Conditional logic checking object types | Violates OCP | Replace conditional with **Polymorphism / Strategy** |
| Duplicate tree traversal algorithms | Code duplication | Extract to **Iterator** or **Composite** |

> **Tip:** Always have a comprehensive suite of automated unit tests in place before refactoring toward a pattern. Tests ensure that structural refactoring does not alter runtime behavior.

## See it

```typescript
// Before: Smelly switch statement in checkout
function getTax(amount: number, country: string): number {
  switch (country) {
    case 'US': return amount * 0.08;
    case 'UK': return amount * 0.20;
    default: throw new Error('Unsupported country');
  }
}

// After: Refactored toward Strategy via dictionary mapping
const taxStrategies: Record<string, (n: number) => number> = {
  US: (n) => n * 0.08,
  UK: (n) => n * 0.20,
};

function getTaxRefactored(amount: number, country: string): number {
  const strategy = taxStrategies[country];
  if (!strategy) throw new Error(`Unsupported: ${country}`);
  return strategy(amount);
}
```

## Go deeper

Refactoring is a two-way street: you should also **refactor away from patterns** when requirements simplify. If a system once had 8 payment strategies but business pivots to a single exclusive provider, keeping the Strategy hierarchy is dead weight. Refactor back to a simple direct service call.

## Watch out

- Never refactor toward a pattern without automated regression tests to verify behavior.
- Do not hesitate to remove a design pattern if the design complexity it managed no longer exists.

## Remember

- Evolve toward patterns incrementally in response to concrete code smells.
- Code smells like repeated switch statements and fat constructors point to specific pattern targets.
- Refactoring away from patterns when requirements simplify keeps architectures lean and clean.
