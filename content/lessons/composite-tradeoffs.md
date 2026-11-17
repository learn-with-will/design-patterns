---
slug: composite-tradeoffs
title: "Composite Trade-offs & Type Safety"
topic: structural-composition
kind: pitfall
summary: "Making leaf and composite interfaces identical can dilute type safety and allow invalid child modifications."
tags:
  - structural
  - composite
  - tradeoffs
  - type-safety
related:
  - composite-intent
  - uniform-tree-hierarchy
  - visitor-tradeoffs
---

> **In one line:** Composite sacrifices static type safety to gain uniformity between leaf nodes and containers.

## The idea

The primary architectural trade-off of the Composite pattern is the tension between **uniformity** and **type safety**.

To treat leaves and composites uniformly, both must implement the same interface. But leaves inherently cannot hold children. If you declare child-management methods like `add(child)` and `remove(child)` on the shared `Component` interface, you introduce a type-safety flaw: client code can call `leaf.add(item)` at compile time, forcing the leaf to throw a runtime error.

Conversely, if you place `add()` and `remove()` strictly on the `Composite` class, the interface is completely safe, but clients lose uniformity: they must cast nodes to `Composite` before adding children, reintroducing type checks and conditional code.

| Design Choice | Transparency Approach | Safety Approach |
|---|---|---|
| **Child Methods** | Declared on base `Component` interface | Declared only on `Composite` class |
| **Uniformity** | Maximum: all nodes look identical | Reduced: client must distinguish container types |
| **Compile Safety** | Lower: calling `leaf.add()` fails at runtime | Maximum: compiler forbids `leaf.add()` |
| **GoF Recommendation** | Favors Transparency for clean client code | Favors Safety when invalid operations are fatal |

> **Watch out:** In TypeScript, you can strike a balance using type guards: expose child management on `Composite`, and use a method like `isComposite(): this is Composite` on the base interface to safely narrow types without casting.

## See it

```typescript
// Safety approach with TypeScript Type Guard
abstract class NodeComponent {
  abstract getName(): string;
  isComposite(): this is ContainerNode { return false; }
}

class LeafNode extends NodeComponent {
  constructor(private name: string) { super(); }
  getName() { return this.name; }
}

class ContainerNode extends NodeComponent {
  private children: NodeComponent[] = [];
  constructor(private name: string) { super(); }
  getName() { return this.name; }
  isComposite(): this is ContainerNode { return true; }

  addChild(child: NodeComponent) { this.children.push(child); }
}

const node: NodeComponent = new ContainerNode('Root');
if (node.isComposite()) {
  node.addChild(new LeafNode('Child')); // Type-safe!
}
```

## Go deeper

Another trade-off of Composite is that it makes it difficult to restrict which types of components can be added as children. If a composite should only accept specific subtypes of children (e.g., a `Form` composite that only accepts `FormElement` children, but not `Window` elements), you cannot enforce this via a generic Component interface without runtime checks.

## Watch out

- Do not silently ignore invalid operations like leaf.add(); throw an explicit descriptive exception.
- Beware of memory leaks in long-lived trees; removing a node should clean up child and parent references.

## Remember

- Composite creates a design tension between interface transparency and static type safety.
- Declaring child methods on Component is transparent; declaring them on Composite is type-safe.
- TypeScript user-defined type guards allow type-safe narrowing of composite containers.
