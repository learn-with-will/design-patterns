---
slug: intrinsic-vs-extrinsic-state
title: "Intrinsic vs Extrinsic State"
topic: structural-proxies
kind: concept
summary: "Separate immutable shared intrinsic state stored in the flyweight from context-dependent extrinsic state passed in."
tags:
  - structural
  - flyweight
  - state
  - immutability
related:
  - flyweight-intent
  - flyweight-factory-and-cache
  - flyweight-tradeoffs-memory
---

> **In one line:** Intrinsic state is invariant and stored inside the flyweight; extrinsic state varies by context and is passed in.

## The idea

The conceptual core of the Flyweight pattern is dividing an object's properties cleanly into two categories: **Intrinsic State** and **Extrinsic State**.

**Intrinsic State**: Data that is invariant, constant, and independent of the object's context. Because it never changes based on where or when the object is used, intrinsic state is safely stored *inside* the Flyweight object and shared across thousands of references.

**Extrinsic State**: Data that is unique to each individual occurrence and depends entirely on the surrounding context (such as spatial coordinates, timestamp, or parent container). Extrinsic state is *never stored* inside the Flyweight; it is held by client context objects and passed into flyweight methods as arguments.

| State Type | Where Stored | Mutability | Shared? | Examples |
|---|---|---|---|---|
| **Intrinsic** | Inside the Flyweight object | Strictly immutable | Yes, across all instances | Font glyph shape, 3D mesh, texture image, product SKU |
| **Extrinsic** | In the client / context object | Can be mutable | No, unique per instance | X/Y screen coordinates, font size, color highlight, stock count |

> **Watch out:** Intrinsic state MUST be strictly immutable. If intrinsic state is modified on a shared flyweight, every single object in your application referencing that flyweight will be altered!

## See it

```typescript
// Intrinsic state: strictly immutable and shared
class ParticleType {
  constructor(public readonly sprite: string, public readonly color: string) {}

  render(x: number, y: number, velocity: number): void {
    console.log(`Particle ${this.sprite} at (${x},${y}) speed ${velocity}`);
  }
}

// Extrinsic context holder
class Particle {
  constructor(
    public x: number,
    public y: number,
    public velocity: number,
    private type: ParticleType
  ) {}

  update() {
    this.x += this.velocity;
    this.type.render(this.x, this.y, this.velocity);
  }
}
```

## Go deeper

When refactoring toward Flyweight, analyze object fields and ask: "If I have 50,000 of these objects, which fields are identical across 99% of them?" Move those identical fields into a new Flyweight class. The remaining unique fields become the lightweight extrinsic context.

## Watch out

- Never store extrinsic state (like coordinates or IDs) as properties on the flyweight instance.
- Ensure flyweight methods accept extrinsic data as method arguments rather than reading instance fields.

## Remember

- Intrinsic state is context-free, immutable, and stored inside the shared flyweight object.
- Extrinsic state is context-dependent, unique, and passed into flyweight methods at runtime.
- Strict immutability of intrinsic state is mandatory to prevent cross-object data corruption.
