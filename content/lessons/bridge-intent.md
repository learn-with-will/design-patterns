---
slug: bridge-intent
title: "Bridge: Intent & Orthogonal Variations"
topic: structural-adapters
kind: pattern
summary: "Bridge decouples an abstraction from its implementation so that both can vary independently without class explosion."
tags:
  - structural
  - bridge
  - decoupling
  - cartesian-product
related:
  - separating-abstraction-implementation
  - bridge-in-cross-platform-code
  - bridge-vs-adapter
---

> **In one line:** Bridge decouples an abstraction from its implementation so that both dimensions can vary independently.

## The idea

When a class hierarchy varies along two independent dimensions, traditional class inheritance causes a combinatorial explosion of subclasses.

Imagine modeling graphical shapes (`Circle`, `Square`) that need to be rendered in different graphics APIs (`SVG`, `Canvas`). Using inheritance, you would need: `SvgCircle`, `CanvasCircle`, `SvgSquare`, and `CanvasSquare`. If you add 3 new shapes and 2 new rendering engines, the number of classes multiplies exponentially (`Shapes × Renderers`).

The Gang of Four's **Bridge** pattern prevents this Cartesian explosion. Its official intent is: **"Decouple an abstraction from its implementation so that the two can vary independently."** Instead of coupling shapes to renderers via inheritance, the Shape abstraction holds a reference (a "bridge") to a Renderer interface. Shapes and Renderers can now be extended completely independently, transforming multiplicative subclass hierarchies into clean linear relationships.

| Approach | Class Count (5 Shapes, 4 Renderers) | Adding 1 Shape | Adding 1 Renderer |
|---|---|---|---|
| **Inheritance** | 5 × 4 = **20 classes** | +4 new classes | +5 new classes |
| **Bridge Pattern** | 5 + 4 = **9 classes** | +1 class only | +1 class only |

> **Note:** In Bridge terminology, "Abstraction" refers to the high-level control layer (the Shape), while "Implementation" refers to the low-level platform operations (the Renderer).

## See it

```typescript
// Implementation contract (Renderer)
interface Renderer {
  renderCircle(radius: number): void;
}

class SvgRenderer implements Renderer {
  renderCircle(r: number) { console.log(`<circle r="${r}" />`); }
}

class CanvasRenderer implements Renderer {
  renderCircle(r: number) { console.log(`canvas.arc(${r})`); }
}

// Abstraction hierarchy
abstract class Shape {
  constructor(protected renderer: Renderer) {} // The Bridge
  abstract draw(): void;
}

class Circle extends Shape {
  constructor(renderer: Renderer, private radius: number) { super(renderer); }
  draw(): void { this.renderer.renderCircle(this.radius); }
}
```

## Go deeper

Bridge is an upfront design pattern. Unlike Adapter, which is applied retroactively to fix mismatched existing interfaces, Bridge is architected intentionally at system conception to ensure that independent dimensions of variability do not cause monolithic subclass hierarchies. This makes Bridge an indispensable pattern when designing foundational operating system shells or graphics engines.

## Watch out

- Do not apply Bridge if your class hierarchy only varies along a single dimension.
- Ensure the Implementor interface provides primitive operations that abstractions can combine effectively.

## Remember

- Bridge decouples high-level abstractions from low-level platform implementations.
- It converts exponential class explosion (M × N) into linear class growth (M + N).
- Abstractions delegate primitive work across an object bridge reference to the implementor.
