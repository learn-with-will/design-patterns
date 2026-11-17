---
slug: open-closed-principle
title: "Open/Closed Principle (OCP)"
topic: solid-principles
kind: concept
summary: "Software entities should be open for extension but closed for modification through polymorphism."
tags:
  - solid
  - ocp
  - polymorphism
  - extensibility
related:
  - single-responsibility-principle
  - liskov-substitution-principle
  - strategy-intent
---

> **In one line:** Software entities should be open for extension but closed for modification.

## The idea

Formulated by Bertrand Meyer in 1988 and integrated into SOLID by Robert C. Martin, the Open/Closed Principle (OCP) asserts that software artifacts (classes, modules, functions) should be:
- **Open for extension**: The behavior of the module can be extended as requirements change.
- **Closed for modification**: The existing source code of the module remains untouched and stable.

At first glance, these two goals seem contradictory. How can you alter behavior without editing code? The answer is **abstraction and polymorphism**.

When code violates OCP, adding a new feature involves opening an existing function and appending an additional `case` to an ever-growing `switch` statement. Every modification risks breaking existing, tested behavior and forces re-testing of the entire pipeline. By programming against interfaces, new features are introduced simply by providing new classes that satisfy the established interface.

| Aspect | Violating OCP (Switch-Driven) | Adhering to OCP (Polymorphic) |
|---|---|---|
| **Adding New Feature** | Edit existing switch/if blocks | Create a new implementing class |
| **Risk of Regression** | High: touches working logic | Near zero: existing code unchanged |
| **Testing Requirement** | Must re-test all switch branches | Test only the newly added class |
| **Design Pattern** | Procedural conditional branching | Strategy, Template Method, Decorator |

> **Note:** OCP is the architectural rationale behind plugins, middleware, and drivers. The core engine remains untouched while third-party developers extend its capabilities.

## See it

```typescript
// OCP in action: Adding a new discount does not modify DiscountCalculator
interface DiscountRule {
  apply(total: number): number;
}

class StandardDiscount implements DiscountRule {
  apply(total: number): number { return total; }
}

class BlackFridayDiscount implements DiscountRule {
  apply(total: number): number { return total * 0.7; }
}

class DiscountCalculator {
  calculate(total: number, rule: DiscountRule): number {
    return rule.apply(total);
  }
}
```

## Go deeper

Many classic GoF design patterns exist primarily to uphold OCP:
- **Strategy**: Allows algorithms to be swapped and added without altering the client context.
- **Decorator**: Dynamically adds behavior to objects without modifying original class definitions.
- **Factory Method**: Subclasses introduce new concrete product types without editing base creator logic.

## Watch out

- Do not design 100% of your codebase for hypothetical extension upfront; apply OCP where requirements actually change.
- Watch out for leaky abstractions where adding a new plugin forces unexpected changes to core interfaces.

## Remember

- Open for extension means new capabilities can be added; closed for modification means stable code is untouched.
- Polymorphism and interfaces are the primary mechanisms for achieving OCP in TypeScript.
- Key design patterns like Strategy, Decorator, and Factory Method are direct applications of OCP.
