---
slug: composite-intent
title: "Composite: Intent & Tree Structures"
topic: structural-composition
kind: pattern
summary: "Composite composes objects into tree structures to represent part-whole hierarchies with uniform handling."
tags:
  - structural
  - composite
  - trees
  - hierarchies
related:
  - uniform-tree-hierarchy
  - composite-recursive-operations
  - composite-tradeoffs
---

> **In one line:** Composite organizes objects into part-whole tree hierarchies, allowing clients to treat leaves and containers uniformly.

## The idea

In many software systems, entities naturally arrange themselves into hierarchical tree structures. Examples include file systems (files inside folders, which can be inside other folders), graphical user interfaces (buttons inside panels inside windows), and corporate organizational charts.

Without a standardized pattern, client code that traverses these hierarchies must constantly perform type checks: "Is this object a single leaf file, or is it a container folder?" This results in fragmented, brittle code filled with `if (item instanceof Folder)` checks.

The Gang of Four's **Composite** pattern resolves this. Its official intent is: **"Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly."** Both simple individual elements (Leaves) and containers containing children (Composites) implement the exact same common interface.

| Participant | Role | Responsibilities |
|---|---|---|
| **Component** | Common interface for all tree elements | Declares operations common to leaves and containers |
| **Leaf** | Individual end-point element (no children) | Implements behavior directly for basic items |
| **Composite** | Container element with child components | Stores children; delegates operations recursively |
| **Client** | Consumes tree through Component interface | Treats leaves and composites identically |

> **Note:** Because both Leaf and Composite implement the Component interface, client code does not need to care whether it is talking to a single item or a composite tree of 10,000 nested items.

## See it

```typescript
// Component interface
interface FileSystemItem {
  getName(): string;
  getSize(): number;
}

// Leaf element
class FileItem implements FileSystemItem {
  constructor(private name: string, private size: number) {}
  getName() { return this.name; }
  getSize() { return this.size; }
}

// Composite element
class Directory implements FileSystemItem {
  private children: FileSystemItem[] = [];
  constructor(private name: string) {}

  add(item: FileSystemItem) { this.children.push(item); }
  getName() { return this.name; }
  getSize() {
    return this.children.reduce((sum, item) => sum + item.getSize(), 0);
  }
}
```

## Go deeper

The DOM (Document Object Model) in web browsers is one of the world's most famous implementations of the Composite pattern. Every HTML node (such as text nodes, paragraph elements, and `<div>` containers) implements the base `Node` interface. Calling `element.getBoundingClientRect()` or dispatching an event executes uniformly across leaves and nested containers alike.

## Watch out

- Avoid making the Component interface too bloated with child-management methods that Leaves cannot support.
- Watch out for infinite recursion loops if a composite tree accidentally contains circular references.

## Remember

- Composite represents part-whole object hierarchies as tree structures.
- Clients treat individual leaf elements and composite containers identically via a shared interface.
- Composite containers delegate operations down to their child components recursively.
