---
id: lesson-13
slug: flyweight
title: "Flyweight"
level: intermediate
order: 13
duration: 15
tags:
  - structural
  - flyweight
  - memory
  - sharing
  - gof
summary: "The Flyweight pattern — support very large numbers of objects by sharing the parts they have in common (intrinsic state) and keeping only the parts that differ (extrinsic state) outside, the one GoF pattern whose explicit purpose is saving memory."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Flyweight pattern.
- Split object state into **intrinsic** (shared) and **extrinsic** (unique).
- Implement a flyweight **factory** that reuses shared objects.
- Judge when the memory saving is worth the added complexity.

# Why It Matters

Occasionally you need a *huge* number of similar objects — every character in a document, every tree in
a forest, every tile on a map. Giving each its own full copy of shared data (font, texture, sprite)
can exhaust memory. **Flyweight** stores that common data **once** and shares it across all the
instances, keeping only the truly-unique bits per object. It's the one GoF pattern whose stated purpose
is **resource efficiency**.

# Concept Explanation

### Intent

> **Use sharing to support large numbers of fine-grained objects efficiently.** — Gang of Four

### Intrinsic vs extrinsic state

The key idea is splitting an object's state:

- **Intrinsic state** — shared and **context-independent**; the same across many objects (a tree's
  species name, color, texture). Stored **inside** the flyweight and treated as **immutable**.
- **Extrinsic state** — **context-dependent** and unique per use (a tree's x/y position). Kept
  **outside** the flyweight and passed in when needed.

Thousands of trees can point at a handful of shared `TreeType` flyweights, each tree holding only its
coordinates.

### A flyweight factory

A factory hands out shared flyweights, creating a new one only for a genuinely new combination of
intrinsic state:

```typescript
// Intrinsic (shared) state — created once per unique kind.
class TreeType {
  constructor(readonly name: string, readonly color: string) {}
  draw(x: number, y: number): string { return `${this.name}(${this.color}) at ${x},${y}`; }
}

// Factory: returns a shared TreeType per unique name+color.
class TreeTypeFactory {
  private static cache = new Map<string, TreeType>();
  static get(name: string, color: string): TreeType {
    const key = `${name}:${color}`;
    let type = TreeTypeFactory.cache.get(key);
    if (!type) {
      type = new TreeType(name, color);
      TreeTypeFactory.cache.set(key, type);
    }
    return type; // same object handed back every time
  }
}

// Extrinsic (unique) state stays on each Tree; the type is shared.
class Tree {
  constructor(private x: number, private y: number, private type: TreeType) {}
  draw() { return this.type.draw(this.x, this.y); }
}

// 1,000,000 trees, but only as many TreeType objects as there are distinct kinds.
const forest: Tree[] = [];
for (let i = 0; i < 1_000_000; i++) {
  forest.push(new Tree(i % 100, i % 80, TreeTypeFactory.get("Oak", "green")));
}
```

Every "Oak/green" tree shares **one** `TreeType`, so a million trees cost a million small `Tree` objects
plus a single shared type — not a million copies of the texture data.

### Consequences

- **Good:** dramatic memory savings when you have many objects sharing common data.
- **Cost:** added complexity (the intrinsic/extrinsic split, a factory); you may trade memory for CPU
  (recomputing or passing extrinsic state); intrinsic state **must be immutable** since it's shared.

# Key Terminology

- **Flyweight** — a shared object holding intrinsic (common) state.
- **Intrinsic state** — shared, context-independent, immutable data stored in the flyweight.
- **Extrinsic state** — unique, context-dependent data kept outside and passed in.
- **Flyweight factory** — returns shared flyweights, creating one only for a new intrinsic combination.

# Options and Trade-offs

| Concern | Flyweight | One full object each | How to choose |
| ------- | --------- | -------------------- | ------------- |
| Object count | Millions, sharing data | Fine for thousands | Flyweight only at large scale. |
| Memory vs CPU | Saves memory, may cost CPU | Simpler, more memory | Flyweight when memory is the bottleneck. |
| Mutability | Intrinsic must be immutable | Any | Don't share mutable state. |

# Worked Example

Text rendering shares a `Glyph` per character, positioned per occurrence:

```typescript
class Glyph { constructor(readonly char: string) {} render(x: number) { return `${this.char}@${x}`; } }

const glyphs = new Map<string, Glyph>();
function glyphFor(char: string): Glyph {
  let g = glyphs.get(char);
  if (!g) { g = new Glyph(char); glyphs.set(char, g); }
  return g;
}

// "aaaa" reuses ONE Glyph for 'a'; positions (extrinsic) differ per character.
const positions = [..."aaaa"].map((c, i) => glyphFor(c).render(i));
```

# Real World Analogy

Flyweight is like a **library**. A city doesn't give every reader a personal copy of every book; it
keeps **one shared copy** on the shelf (intrinsic) and tracks who has it checked out and until when
(extrinsic). Thousands of readers, a handful of physical books — sharing the common thing is the whole
point.

# Examples

## Example 1 — Basic: shared tree types

Every "Oak/green" `Tree` gets the *same* `TreeType` from the factory, so a million trees don't hold a
million copies of the type data.

**Why this works:** intrinsic data is created once and reused; only coordinates differ per tree.

## Example 2 — Real-world: glyphs, tiles, and particles

Editors share a glyph per character; games share a sprite per tile or particle type. The shared asset
is heavy; the per-instance data (position, velocity) is tiny.

**Why this works:** the expensive, common part is shared; the cheap, unique part stays local.

## Example 3 — Pitfall: applying it too early

Wrapping a few hundred objects in flyweights adds an intrinsic/extrinsic split and a factory for a
memory saving you'll never notice.

**Why this bites:** Flyweight is a **scale** optimization. Below large numbers, it's just complexity —
and premature optimization at that.

# Common Mistakes

- **Making intrinsic state mutable.** Shared state that can change corrupts every user of it.
- **Using Flyweight prematurely.** It only pays off with a very large number of objects.
- **Confusing sharing with caching in general.** Flyweight specifically shares fine-grained,
  immutable, intrinsic state.

# Best Practices

- Keep **intrinsic state immutable** so sharing is safe.
- Use a **factory** to guarantee flyweights are reused, not duplicated.
- Measure first — apply Flyweight only when object count actually strains memory.

# Summary

- **Flyweight** shares common (**intrinsic**) state across many objects and keeps unique (**extrinsic**)
  state outside.
- It's the GoF pattern explicitly about **saving memory** at large object counts.
- A **factory** ensures shared instances are reused; intrinsic state must be **immutable**.
- Use it only at **scale** — otherwise it's needless complexity.

# Flash Cards

Q: What is the intent of the Flyweight pattern?
A: Use sharing to support large numbers of fine-grained objects efficiently, saving memory.

Q: What is the difference between intrinsic and extrinsic state?
A: Intrinsic state is shared, context-independent, and stored in the flyweight (immutable); extrinsic state is unique per use and kept outside, passed in when needed.

Q: What is the job of the flyweight factory?
A: To return shared flyweight instances, creating a new one only for a genuinely new combination of intrinsic state.

Q: Why must intrinsic state be immutable?
A: Because it is shared across many objects; if it could change, a mutation would corrupt every object using that flyweight.

Q: Which resource does Flyweight primarily aim to save?
A: Memory — it's the one GoF pattern whose explicit purpose is efficient use of memory for many objects.

Q: When is Flyweight the wrong choice?
A: When you have only a modest number of objects — the intrinsic/extrinsic split and factory add complexity for a saving you'd never notice.

# Exercises

### Easy
In the tree example, list which fields are intrinsic (shared) and which are extrinsic (per tree), and
explain why coordinates can't live in the flyweight.

### Medium
Add a `TreeType` for "Pine/darkgreen" and create trees of both kinds. Show (by comparing references)
that all "Oak/green" trees share one `TreeType` instance.

### Challenging
Estimate the memory difference between one million trees each holding a full copy of a 1 KB texture
versus sharing a `TreeType` flyweight. Then explain one situation where Flyweight would NOT help
(e.g. when every object's data is unique).

# Further Reading

- Gamma et al. — *Design Patterns*, "Flyweight".
- Refactoring.Guru — *Flyweight*: <https://refactoring.guru/design-patterns/flyweight>
- Refactoring.Guru — *Flyweight in TypeScript*: <https://refactoring.guru/design-patterns/flyweight/typescript/example>
