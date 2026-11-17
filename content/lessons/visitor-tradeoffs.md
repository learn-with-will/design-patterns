---
slug: visitor-tradeoffs
title: "Visitor Trade-offs & The Expression Problem"
topic: behavioral-traversal
kind: pitfall
summary: "Visitor makes adding operations easy but adding new element classes requires updating every visitor interface."
tags:
  - behavioral
  - visitor
  - tradeoffs
  - expression-problem
  - complexity
related:
  - visitor-intent
  - double-dispatch-mechanism
  - composite-tradeoffs
---

> **In one line:** Visitor makes adding new operations easy, but makes adding new element classes difficult.

## The idea

The Visitor pattern is one of the most intellectually satisfying design patterns, but it introduces a severe architectural trade-off known in computer science as the **Expression Problem**.

The trade-off is an asymmetry in extensibility:
- **Adding new operations is trivial**: You create a new class implementing `Visitor` (e.g., `MarkdownExportVisitor`). Zero existing element classes are modified (Open/Closed Principle satisfied).
- **Adding new element classes is excruciating**: If you introduce a new element (e.g., `VideoElement`), you must add `visitVideo(v: VideoElement)` to the `Visitor` interface. This change immediately breaks compilation across **every single existing visitor class** in your entire codebase!

Therefore, Visitor is only suitable when the element class hierarchy is **stable and mature**, and new operations are frequently needed.

| Axis of Change | Object-Oriented (Standard) | Visitor Pattern |
|---|---|---|
| **Adding New Element Class** | **Easy**: create new class | **Very Hard**: breaks all visitors |
| **Adding New Operation** | **Hard**: edit all element classes | **Very Easy**: create one new visitor class |
| **Encapsulation** | Strong: state stays private in class | Weak: elements must expose public getters to visitors |

> **Watch out:** Do not adopt Visitor if your domain frequently introduces new element types. If elements change weekly, the maintenance cost of updating all visitor interfaces is unbearable.

## See it

```typescript
// Adding a new element breaks all existing visitors!
interface DocumentVisitor {
  visitParagraph(p: Paragraph): void;
  visitImage(i: ImageElement): void;
  // BREAKING CHANGE: If we add VideoElement, EVERY visitor in the project fails!
  // visitVideo(v: VideoElement): void;
}

// In TypeScript, discriminated unions often provide a simpler functional alternative:
type DocNode = 
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string };

function exportToXml(node: DocNode): string {
  switch (node.type) {
    case 'paragraph': return `<p>${node.text}</p>`;
    case 'image': return `<img src="${node.src}" />`;
  }
}
```

## Go deeper

Philip Wadler coined the term "Expression Problem" in 1998, observing that object-oriented programming makes it easy to add new data types but hard to add new functions, while functional programming makes it easy to add new functions but hard to add new data types. Visitor essentially flips an OOP language into functional decomposition.

## Watch out

- Never use Visitor if your element hierarchy is actively evolving and adding new classes.
- Watch for leaky encapsulation: visitors often pressure elements into exposing internal private state.

## Remember

- The Expression Problem explains the fundamental trade-off of the Visitor pattern.
- Visitor makes adding new operations easy, but adding new element classes breaks all visitors.
- Apply Visitor only when the data structure elements are stable and unchanging.
