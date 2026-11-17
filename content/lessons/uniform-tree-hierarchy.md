---
slug: uniform-tree-hierarchy
title: "Uniform Treatment of Leaves and Nodes"
topic: structural-composition
kind: technique
summary: "Define a common interface for simple leaf objects and complex container composites containing child nodes."
tags:
  - structural
  - composite
  - polymorphism
  - trees
related:
  - composite-intent
  - composite-recursive-operations
  - composite-tradeoffs
---

> **In one line:** Uniform treatment eliminates type checking, allowing clients to execute operations across trees polymorphically.

## The idea

The defining architectural benefit of the Composite pattern is **uniform treatment**. 

In procedural code without Composite, calculating the total price of an order containing standalone items and bundled gift baskets requires complex conditional checks:
```text
for each item:
  if item is Bundle:
    calculate bundle subtotal...
  else if item is Product:
    add product price...
```

With Composite, the client simply calls `item.getPrice()`. If the item is a single Product leaf, it returns its unit price. If the item is a Composite bundle, it queries its children and returns the aggregated sum. The client code is completely free of conditional branching and type casting.

| Aspect | Procedural Hierarchy | Composite Pattern Hierarchy |
|---|---|---|
| **Client Code** | Cluttered with `instanceof` checks | Pure polymorphic calls (`item.operation()`) |
| **Adding New Node Types** | Forces edits to all client traversal loops | Add a new class implementing Component (OCP) |
| **Nesting Depth** | Hardcoded or limited | Arbitrarily deep recursive nesting |

> **Tip:** In TypeScript, you can model tree nodes with discriminated unions or class hierarchies. Class-based Composite is ideal when containers encapsulate complex recursive methods.

## See it

```typescript
interface Graphic {
  draw(): void;
}

class Dot implements Graphic {
  constructor(protected x: number, protected y: number) {}
  draw() { console.log(`Dot at ${this.x},${this.y}`); }
}

class CompoundGraphic implements Graphic {
  private children: Graphic[] = [];
  add(child: Graphic) { this.children.push(child); }

  draw(): void {
    // Uniform treatment: delegate to all children polymorphically
    for (const child of this.children) {
      child.draw();
    }
  }
}

const root = new CompoundGraphic();
root.add(new Dot(1, 2));
root.draw();
```

## Go deeper

Uniformity simplifies client interactions, but creates a classic design dilemma: **Transparency versus Safety**. If you place child-management methods (`add`, `remove`, `getChildren`) directly on the base `Component` interface, all nodes are transparent, but calling `add()` on a Leaf is semantically invalid. If you place them only on `Composite`, type safety is preserved, but clients lose complete uniformity.

## Watch out

- Decide intentionally between Transparency (methods on Component) and Safety (methods only on Composite).
- Ensure that leaf elements throw clear, descriptive errors if invalid container methods are called on them.

## Remember

- Uniform treatment removes the need for instanceof type checks and nested procedural loops.
- Clients execute operations on tree elements polymorphically regardless of depth or structure.
- Adding new leaf or composite node types adheres strictly to the Open/Closed Principle.
