---
slug: flyweight-intent
title: "Flyweight: Intent & Memory Optimization"
topic: structural-proxies
kind: pattern
summary: "Flyweight uses sharing to support large numbers of fine-grained objects efficiently, reducing memory footprint."
tags:
  - structural
  - flyweight
  - memory
  - optimization
  - sharing
related:
  - intrinsic-vs-extrinsic-state
  - flyweight-factory-and-cache
  - flyweight-tradeoffs-memory
---

> **In one line:** Flyweight minimizes memory usage by sharing common immutable state among massive numbers of fine-grained objects.

## The idea

When an application needs to render or manage hundreds of thousands of fine-grained objects (such as characters in a word processor, particles in a physics simulation, or trees in a 3D forest), allocating separate memory for each instance exhausts RAM and triggers severe garbage collection pauses.

Crucially, most of the data in these objects is redundant and identical across thousands of instances. For example, 100,000 pine trees share the exact same 3D mesh model, branch texture, and foliage color.

The Gang of Four's **Flyweight** pattern solves this. Its official intent is: **"Use sharing to support large numbers of fine-grained objects efficiently."** Flyweight is the only GoF design pattern whose sole purpose is **memory optimization**. It strips shared, immutable data into a single reusable object (the Flyweight), while keeping unique context-dependent data externalized.

| Without Flyweight (100,000 Trees) | With Flyweight Pattern |
|---|---|
| 100,000 separate mesh & texture objects in RAM | **1** shared `TreeType` mesh/texture object in RAM |
| Memory: ~500 MB (duplicated textures) | Memory: ~3 MB (1 shared texture + 100k tiny coordinate pairs) |
| High GC overhead and allocation lag | Minimal memory allocation and instant rendering |

> **Note:** The word "flyweight" originates from boxing, denoting the lightest weight class. In software, a flyweight object is stripped down to minimum mass by externalizing its context.

## See it

```typescript
// The shared Flyweight: holds heavy immutable data
class TreeType {
  constructor(public name: string, public color: string, public texture: string) {}

  draw(x: number, y: number) {
    console.log(`Rendering ${this.name} tree at ${x},${y} with ${this.color}`);
  }
}

// Context object: stores only lightweight extrinsic coordinates
class Tree {
  constructor(public x: number, public y: number, public type: TreeType) {}
  draw() { this.type.draw(this.x, this.y); }
}

const sharedPine = new TreeType('Pine', 'Green', 'pine_texture.png');
const forest = [
  new Tree(10, 20, sharedPine),
  new Tree(15, 25, sharedPine), // Both reference the EXACT same TreeType!
];
```

## Go deeper

Modern operating systems and programming languages use Flyweight internally. String interning (where identical string literals share the exact same memory address in a global string pool) is a native implementation of the Flyweight pattern. Similarly, the Java Integer cache (-128 to 127) shares boxed number instances.

## Watch out

- Never mutate the internal state of a shared Flyweight, as it will corrupt all references across the entire application.
- Do not apply Flyweight unless profiling shows memory consumption is a genuine bottleneck.

## Remember

- Flyweight is designed exclusively to reduce memory consumption when handling massive object counts.
- It shares common immutable data across thousands of objects instead of duplicating memory.
- Extrinsic, context-dependent state is stripped from the flyweight and passed in as method parameters.
