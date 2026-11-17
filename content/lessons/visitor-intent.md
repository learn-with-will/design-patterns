---
slug: visitor-intent
title: "Visitor: Intent & Externalized Operations"
topic: behavioral-traversal
kind: pattern
summary: "Represent an operation to be performed on the elements of an object structure, defining new operations without modifying classes."
tags:
  - behavioral
  - visitor
  - operations
  - double-dispatch
  - ast
related:
  - double-dispatch-mechanism
  - visitor-tradeoffs
  - composite-intent
---

> **In one line:** Visitor lets you define a new operation over an object structure without modifying the classes of the elements.

## The idea

Imagine having a complex object structure (such as a document containing paragraphs, tables, images, and code blocks, or an AST representing a program).

Initially, each element class only has a `render()` method. Soon, you need to add an `exportToXML()` method. Then you need a `spellCheck()` method. Then you need an `exportToPDF()` method. If you add these methods directly to the element classes, the classes become bloated with unrelated concerns, violating the Single Responsibility and Open/Closed Principles.

The Gang of Four's **Visitor** pattern solves this. Its official intent is: **"Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates."** Operations are moved out of the elements and encapsulated into standalone Visitor classes.

| Participant | Role | Responsibility |
|---|---|---|
| **Visitor** | Interface declaring visit methods for each element | `visitParagraph()`, `visitImage()`, `visitTable()` |
| **ConcreteVisitor** | Implements specific operation across all elements | `XmlExportVisitor`, `SpellCheckVisitor` |
| **Element** | Interface declaring the accept method | Declares `accept(visitor: Visitor): void` |
| **ConcreteElement** | Specific element node in the structure | Implements `accept(v) { v.visitConcreteElement(this); }` |

> **Note:** Visitor inverts the standard object-oriented approach: instead of grouping operations by data type (inside classes), it groups all logic for an operation into a single cohesive Visitor class.

## See it

```typescript
// Visitor contract
interface DocumentVisitor {
  visitParagraph(p: Paragraph): void;
  visitImage(i: ImageElement): void;
}

// Element interface
interface DocElement {
  accept(visitor: DocumentVisitor): void;
}

class Paragraph implements DocElement {
  constructor(public text: string) {}
  accept(v: DocumentVisitor) { v.visitParagraph(this); }
}

class ImageElement implements DocElement {
  constructor(public src: string) {}
  accept(v: DocumentVisitor) { v.visitImage(this); }
}
```

## Go deeper

Compilers, linters (like ESLint), and code formatters (like Prettier) rely on the Visitor pattern to analyze code. The AST parser produces a fixed syntax tree of nodes (VariableDeclaration, FunctionDeclaration, IfStatement). Linter rules are implemented as Visitors that traverse the tree, inspecting specific node types and reporting code smells without modifying the AST node classes.

## Watch out

- Do not use Visitor if your element class hierarchy changes frequently; adding a new element breaks all visitors.
- Avoid Visitor when simple polymorphic methods on the elements are sufficient.

## Remember

- Visitor externalizes operations from data structures into dedicated operation classes.
- New operations can be added across the entire structure without modifying existing element classes.
- It is the standard pattern for compilers, linters, and document export systems.
