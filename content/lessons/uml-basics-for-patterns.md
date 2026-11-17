---
slug: uml-basics-for-patterns
title: "UML Class Diagrams for Patterns"
topic: foundations
kind: technique
summary: "Read class diagrams with generalization, interface realization, association, and composition relationships."
tags:
  - uml
  - diagrams
  - oop
  - notation
related:
  - what-is-a-design-pattern
  - design-principles-interfaces-composition
  - gof-categories-and-catalog
---

> **In one line:** Unified Modeling Language (UML) class diagrams visually map class structures, contracts, and object relationships.

## The idea

The Unified Modeling Language (UML) class diagram provides a concise visual notation for modeling object-oriented systems and design patterns. Understanding the four primary UML relationship types allows you to read pattern blueprints across technical documentation and textbooks effortlessly.

Each class in UML is represented as a box divided into three horizontal compartments: the class name at the top, attributes or fields in the middle, and methods or operations at the bottom.

Arrows connecting these boxes represent specific structural relationships:
1. **Generalization (Inheritance)**: A solid line with a hollow triangle pointing to the superclass.
2. **Realization (Interface Implementation)**: A dashed line with a hollow triangle pointing to the interface.
3. **Association / Aggregation**: A solid line indicating that one object holds a reference to another.
4. **Composition**: A solid line with a filled diamond indicating an owned lifecycle where the child cannot exist independently of the parent.

| Relationship | Notation | TypeScript Syntax | Meaning |
|---|---|---|---|
| **Realization** | Dashed line, hollow triangle | `implements Interface` | Class fulfills interface contract |
| **Generalization** | Solid line, hollow triangle | `extends BaseClass` | Subclass inherits parent members |
| **Association** | Solid arrow line | `private helper: Helper` | Class references collaborator |
| **Composition** | Solid line, filled diamond | `this.part = new Part()` | Parent exclusively owns lifecycle |

> **Note:** In ASCII diagrams and technical prose, realization is written as `..|>` and inheritance as `--|>`. Association is represented with a directional arrow `-->`.

## See it

```typescript
// UML Realization and Association in TypeScript
interface WorkerRole {
  executeTask(): void;
}

class Developer implements WorkerRole {
  executeTask(): void {
    console.log('Writing clean TypeScript');
  }
}

class ProjectManager {
  // Association: Manager references a WorkerRole without rigid inheritance
  constructor(private teamMember: WorkerRole) {}

  deliverMilestone(): void {
    this.teamMember.executeTask();
  }
}
```

## Go deeper

UML visibility indicators prefix member names: `+` denotes public, `-` denotes private, `#` denotes protected, and `~` denotes package or internal scope. In TypeScript, modern `#privateField` syntax and compile-time access modifiers map directly to these standardized UML visibility conventions.

## Watch out

- Do not confuse realization (dashed line to interface) with generalization (solid line to superclass).
- Avoid building overly ornate UML models before writing code; use diagrams to clarify intent, not as rigid dogma.

## Remember

- Realization represents interface implementation with dashed lines and hollow arrowheads.
- Generalization represents class inheritance with solid lines and hollow arrowheads.
- Association and composition represent reference relationships and lifecycle ownership.
