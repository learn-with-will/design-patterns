---
slug: double-dispatch-mechanism
title: "Double Dispatch in TypeScript"
topic: behavioral-traversal
kind: technique
summary: "Call element.accept(visitor), which in turn calls visitor.visitConcreteElement(this), routing to the correct operation."
tags:
  - behavioral
  - visitor
  - double-dispatch
  - polymorphism
related:
  - visitor-intent
  - visitor-tradeoffs
  - composite-recursive-operations
---

> **In one line:** Double dispatch binds an operation based on two runtime types: the element and the visitor.

## The idea

The secret mechanism that powers the Visitor pattern is **Double Dispatch**.

Most object-oriented languages (including TypeScript and JavaScript) support only **Single Dispatch**: when you call `element.operation()`, the runtime selects which method to execute based on a single runtime type: the type of `element`. If an operation depends on the runtime types of *two* objects (e.g., "how does this specific Visitor handle this specific Element?"), single dispatch is insufficient.

Double Dispatch solves this through a two-step handshake:
1. **First Dispatch**: The client calls `element.accept(visitor)`. Polymorphism routes execution to the concrete element's `accept` implementation.
2. **Second Dispatch**: Inside that `accept` method, the element calls `visitor.visitConcreteElement(this)`. Passing `this` gives the visitor the concrete element's exact type, routing to the matching visitor method!

| Step | Call | What Is Resolved |
|---|---|---|
| **Step 1** | `element.accept(visitor)` | Resolves the concrete **Element** type |
| **Step 2** | `visitor.visitX(this)` | Resolves the concrete **Visitor** operation for that Element |

> **Tip:** In TypeScript, `this` inside `class Paragraph { accept(v) { v.visitParagraph(this); } }` is statically known by the compiler to be of type `Paragraph`, providing compile-time type safety for the handshake.

## See it

```typescript
// Concrete Visitor implementing XML Export operation
class XmlExportVisitor implements DocumentVisitor {
  public output = '';

  visitParagraph(p: Paragraph): void {
    this.output += `<p>${p.text}</p>
`;
  }

  visitImage(i: ImageElement): void {
    this.output += `<img src="${i.src}" />
`;
  }
}

// Double dispatch in action:
const elements: DocElement[] = [new Paragraph('Hello'), new ImageElement('pic.jpg')];
const exporter = new XmlExportVisitor();

for (const el of elements) {
  el.accept(exporter); // Double dispatch routes to correct visit method!
}
console.log(exporter.output);
```

## Go deeper

Double Dispatch is also the classical solution for multi-object collisions in game physics (e.g., determining what happens when a `Spaceship` collides with an `Asteroid` versus a `SpaceStation`). Without double dispatch, developers write brittle `if (a instanceof X && b instanceof Y)` tables. Double dispatch resolves the pairing cleanly through two polymorphic method calls.

## Watch out

- Every concrete element must implement accept() explicitly; you cannot inherit accept() from a base class because "this" typing would blur.
- Ensure visitors do not violate element encapsulation by exposing unnecessary private fields.

## Remember

- Double dispatch resolves method execution based on the runtime types of two collaborating objects.
- The client calls element.accept(visitor), and the element immediately calls visitor.visitX(this).
- It allows TypeScript to statically verify that all element types are handled by the visitor.
