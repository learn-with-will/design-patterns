---
slug: design-principles-interfaces-composition
title: "Core Principles: Interfaces & Composition"
topic: foundations
kind: concept
summary: "Program to an interface, not an implementation, and favor object composition over class inheritance."
tags:
  - foundations
  - oop
  - principles
  - composition
  - interfaces
related:
  - what-is-a-design-pattern
  - single-responsibility-principle
  - uml-basics-for-patterns
---

> **In one line:** Two foundational GoF principles underpin almost all 23 patterns: interface abstraction and composition over inheritance.

## The idea

The Gang of Four distilled two foundational object-oriented design principles that inspire nearly every pattern in their catalog. Mastering these two rules is more impactful than memorizing individual pattern implementations.

The first principle is: **"Program to an interface, not an implementation."** Client code should depend strictly on abstract contracts (TypeScript interfaces or abstract classes) rather than concrete classes. This prevents clients from being tied to specific implementations, allowing developers to swap or introduce new behaviors without modifying existing business logic.

The second principle is: **"Favor object composition over class inheritance."** While class inheritance is simple to write, it exposes subclass implementations to parent internals, often termed "white-box reuse". This tight coupling creates rigid inheritance hierarchies that break when parent classes evolve. In contrast, composition ("black-box reuse") assembles behavior by referencing collaborator objects through well-defined interfaces.

| Property | Class Inheritance (is-a) | Object Composition (has-a) |
|---|---|---|
| **Coupling** | High: tightly bound to parent class | Low: interacts strictly via interface |
| **Flexibility** | Static: determined at compile time | Dynamic: can change collaborators at runtime |
| **Encapsulation** | Weak: subclasses see parent internals | Strong: collaborators remain black boxes |
| **Hierarchy Depth** | Risk of deep, fragile hierarchies | Flat, modular networks of collaborating objects |

> **Tip:** In TypeScript, interfaces carry zero runtime overhead because they are erased during compilation. You get strict compile-time verification without adding bundle size or runtime performance penalties.

## See it

```typescript
// Before: Fragile inheritance tree
// class SuperReport extends PrintableReport { ... }

// After: Composition via interfaces
interface OutputChannel {
  send(message: string): void;
}

class EmailChannel implements OutputChannel {
  send(msg: string): void { console.log(`Emailing: ${msg}`); }
}

class ReportService {
  // Composing an output strategy instead of inheriting from an emailer
  constructor(private channel: OutputChannel) {}
  
  publishReport(title: string): void {
    this.channel.send(`Report summary: ${title}`);
  }
}
```

## Go deeper

Inheritance violates encapsulation whenever subclasses rely on undocumented parent class implementation details. This hazard is known as the Fragile Base Class problem. Composition circumvents this fragility entirely because collaborator objects interact solely through public interfaces without exposing internal state.

## Watch out

- Avoid creating inheritance hierarchies deeper than two levels; favor composing focused collaborator objects.
- Do not program against concrete classes when an interface allows independent testing and mocking.

## Remember

- Program to an interface, not an implementation, to decouple consumer code from concrete types.
- Favor object composition over class inheritance to prevent fragile base class coupling.
- Interfaces provide compile-time guarantees in TypeScript with zero runtime JavaScript overhead.
