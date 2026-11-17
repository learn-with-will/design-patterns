---
slug: liskov-substitution-principle
title: "Liskov Substitution Principle (LSP)"
topic: solid-principles
kind: concept
summary: "Subtypes must be substitutable for their base types without altering program correctness."
tags:
  - solid
  - lsp
  - inheritance
  - polymorphism
  - subtyping
related:
  - open-closed-principle
  - interface-segregation-principle
  - design-principles-interfaces-composition
---

> **In one line:** Subtypes must be substitutable for their base types without breaking client expectations or program correctness.

## The idea

Introduced by Turing Award laureate Barbara Liskov in 1987, the Liskov Substitution Principle (LSP) establishes the semantic rules for valid inheritance. LSP states: **"If S is a subtype of T, then objects of type T may be replaced with objects of type S without altering any of the desirable properties of the program."**

In simple terms, a subclass must genuinely fulfill the behavioral contract of its parent. Merely matching method signatures is insufficient; the subtype must not violate invariants, weaken preconditions, or strengthen postconditions expected by callers.

The classic violation is the Rectangle and Square hierarchy. In mathematics, a square is a rectangle. But in object-oriented programming, calling `setWidth(10)` and `setHeight(5)` on a Rectangle guarantees an area of 50. If Square overrides setters to maintain equal sides, it violates caller expectations and breaks client calculations.

| Contract Rule | Subtype Requirement | Violation Example |
|---|---|---|
| **Preconditions** | Cannot be strengthened | Requiring non-null arguments when parent accepts null |
| **Postconditions** | Cannot be weakened | Failing to populate expected return properties |
| **Invariants** | Must be strictly preserved | Mutating internal balance below minimum limit |
| **Exceptions** | Can only throw parent-compatible errors | Throwing new unexpected unhandled runtime errors |

> **Watch out:** If you find yourself writing `if (obj instanceof Subclass)` inside client code, you have almost certainly violated the Liskov Substitution Principle.

## See it

```typescript
// Before: Square breaks Rectangle expectations
// class Square extends Rectangle { setWidth(w) { this.width = this.height = w; } }

// After: Model shapes via a shared interface that honors LSP
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  getArea(): number { return this.width * this.height; }
}

class Square implements Shape {
  constructor(public side: number) {}
  getArea(): number { return this.side * this.side; }
}
```

## Go deeper

Design by Contract (DbC), pioneered by Bertrand Meyer, formalizes LSP:
1. Subclasses cannot demand more than the base class (no stronger preconditions).
2. Subclasses must promise at least as much as the base class (no weaker postconditions).
3. Subclasses must preserve all baseline constraints and invariants established by the base class.

## Watch out

- Never inherit simply to reuse code if the subclass cannot uphold all behavioral expectations of the parent.
- Watch out for overridden methods that throw "NotImplementedError" or "UnsupportedOperationException".

## Remember

- Subtypes must be seamlessly substitutable for base types without breaking client assumptions.
- Inheritance requires behavioral compatibility, not merely syntactic type matching.
- Avoid inheriting from classes when you need to disable or throw exceptions from parent methods.
