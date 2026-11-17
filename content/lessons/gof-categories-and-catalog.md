---
slug: gof-categories-and-catalog
title: "The GoF Catalog & Three Categories"
topic: foundations
kind: concept
summary: "The Gang of Four catalog classifies 23 patterns into creational, structural, and behavioral categories."
tags:
  - gof
  - catalog
  - creational
  - structural
  - behavioral
related:
  - what-is-a-design-pattern
  - design-principles-interfaces-composition
  - when-to-use-patterns
---

> **In one line:** The 23 classic Gang of Four patterns are partitioned into creational, structural, and behavioral categories.

## The idea

In 1994, the Gang of Four cataloged exactly 23 patterns in their seminal work, *Design Patterns: Elements of Reusable Object-Oriented Software*. To make this reference practical, they classified each pattern into one of three distinct categories based on its primary design intent.

Creational patterns handle the mechanics of object instantiation. Instead of scattering direct `new` constructor calls throughout a codebase, creational patterns decouple object creation from client consumption, allowing configurations to vary dynamically.

Structural patterns govern how classes and objects are assembled into larger, cohesive architectures. They use inheritance to compose interfaces and composition to assemble objects, ensuring systems remain flexible when requirements shift.

Behavioral patterns focus on algorithms and the assignment of responsibilities between objects. They describe not just patterns of objects or classes, but the communication patterns between them, decoupling senders from receivers.

| Category | Focus | Count | Canonical Examples |
|---|---|---|---|
| **Creational** | Object instantiation & lifecycle | 5 | Factory Method, Abstract Factory, Builder, Prototype, Singleton |
| **Structural** | Class & object composition | 7 | Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy |
| **Behavioral** | Object communication & control flow | 11 | Command, Iterator, Mediator, Memento, Observer, State, Strategy |

> **Note:** Memorizing the 23 pattern names is less valuable than recognizing their classification intent. When faced with a design friction, asking whether you need to instantiate, structure, or coordinate objects immediately narrows down candidate solutions.

## See it

```typescript
// Behavioral pattern in action: decoupling sender from receiver via Strategy
interface FormattingStrategy {
  format(text: string): string;
}

const upperCaseStrategy: FormattingStrategy = {
  format: (t) => t.toUpperCase(),
};

const titleCaseStrategy: FormattingStrategy = {
  format: (t) => t.replace(/\b\w/g, (c) => c.toUpperCase()),
};

class DocumentPrinter {
  constructor(private formatter: FormattingStrategy) {}
  print(content: string): void {
    console.log(this.formatter.format(content));
  }
}
```

## Go deeper

Beyond the 23 GoF patterns, modern software engineering features architectural patterns such as Model-View-Controller (MVC), Repository, and Dependency Injection. Martin Fowler categorized these enterprise application architectures separately from the Gang of Four's localized object-level patterns. Keeping this distinction clear prevents architectural confusion.

## Watch out

- Do not confuse GoF object patterns with broader enterprise architectural patterns like microservices or MVC.
- Never miscount the original catalog: exactly 5 creational, 7 structural, and 11 behavioral patterns.

## Remember

- The GoF catalog contains exactly 23 patterns split into creational, structural, and behavioral groups.
- Creational governs creation, structural governs assembly, and behavioral governs communication.
- Categorization directs you to appropriate patterns based on whether object lifecycle, composition, or flow is the problem.
