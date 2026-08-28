---
id: lesson-06
slug: prototype
title: "Prototype"
level: beginner
order: 6
duration: 15
tags:
  - creational
  - prototype
  - cloning
  - copy
  - gof
summary: "The Prototype pattern — create new objects by cloning an existing 'prototype' instead of building them from scratch, with the crucial shallow-versus-deep-copy distinction and how it relates to (but differs from) JavaScript's own prototypal inheritance."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Prototype pattern.
- Implement a `clone()` method in TypeScript.
- Explain the **shallow vs deep copy** trap and how to avoid it.
- Distinguish the pattern from **JavaScript's prototypal inheritance** (same word, different idea).

# Why It Matters

Sometimes the easiest way to make a new object is to **copy one you already have** — especially when
creating it from scratch is expensive (heavy setup, a database round-trip) or when you'd otherwise need
a factory subclass for every configuration. **Prototype** makes cloning a first-class operation, so an
object knows how to produce a copy of itself.

# Concept Explanation

### Intent

> **Specify the kinds of objects to create using a prototypical instance, and create new objects by
> copying this prototype.** — Gang of Four

### A clone() method

The pattern gives objects a `clone()` method that returns a copy of the same type:

```typescript
interface Cloneable<T> {
  clone(): T;
}

class Document implements Cloneable<Document> {
  constructor(public title: string, public tags: string[]) {}

  clone(): Document {
    // Copy the array so the clone doesn't share the original's mutable state.
    return new Document(this.title, [...this.tags]);
  }
}

const template = new Document("Untitled", ["draft"]);
const copy = template.clone();
copy.tags.push("urgent");
// template.tags is still ["draft"] — the clone has its own array.
```

### Shallow vs deep copy — the trap

A **shallow** copy duplicates the top level but shares nested objects; a **deep** copy duplicates
everything. If `clone()` only spreads the top level, two "copies" secretly share the same inner arrays
and objects — a mutation to one changes the other.

```typescript
// Shallow: the clone shares the SAME tags array — a bug waiting to happen.
clone() { return Object.assign(new Document("", []), this); }
```

Modern JavaScript offers **`structuredClone(value)`** for a deep copy of plain data. Note its limits:
it copies data, **not** class instances' methods or prototype (you get a plain object), and it can't
clone functions. So use it for data structures, and hand-write `clone()` when you need to preserve the
class.

### Prototype the pattern vs prototypes in JavaScript

Confusingly, JavaScript's own inheritance is called **prototypal inheritance** — every object links to
a *prototype* object it borrows methods from. That's a **language feature** for sharing behavior. The
**Prototype pattern** is about **copying objects to create new ones**. Same word, different idea — don't
mix them up.

### Consequences

- **Good:** clone expensive-to-build objects cheaply; add/remove product types at runtime; avoid a
  parallel hierarchy of factories.
- **Cost:** cloning objects with **circular references** or deep nested state is fiddly; you must get
  deep vs shallow copy right, or clones share state by accident.

# Key Terminology

- **Prototype** — an existing instance used as the template for new objects.
- **clone()** — a method returning a copy of the object.
- **Shallow copy** — duplicates the top level; nested objects are shared.
- **Deep copy** — duplicates every level; nothing is shared.
- **structuredClone** — a built-in JS function that deep-copies plain data.

# Options and Trade-offs

| Concern | Prototype (clone) | `new` from scratch | How to choose |
| ------- | ----------------- | ------------------ | ------------- |
| Costly setup | Copy a ready object | Rebuild every time | Clone when construction is expensive and you need many similar objects. |
| Copy depth | Must choose shallow/deep | N/A | Deep-copy anything mutable and shared, or clones will alias state. |
| Preserving class | Hand-written clone() | N/A | Use clone() (not structuredClone) when methods/prototype must survive. |

# Worked Example

A drawing app duplicates shapes. Instead of a factory per shape, each shape clones itself:

```typescript
class Shape implements Cloneable<Shape> {
  constructor(public x: number, public y: number, public style: { color: string }) {}
  clone(): Shape {
    // Deep-copy the nested style object so the copy can be recolored independently.
    return new Shape(this.x, this.y, { ...this.style });
  }
}

const original = new Shape(0, 0, { color: "amber" });
const duplicate = original.clone();
duplicate.style.color = "orange"; // original stays amber
```

The nested `style` is copied, so recoloring the duplicate doesn't touch the original.

# Real World Analogy

Prototype is like using a **cookie cutter with a finished cookie as the template**, or hitting
"**Duplicate**" on a slide. You start from a completed example and stamp out copies you then tweak —
far faster than assembling each one from raw ingredients.

# Examples

## Example 1 — Basic: independent clones

After `copy = template.clone()`, pushing a tag onto `copy` leaves `template` unchanged — because
`clone()` copied the array. That independence is the whole point.

**Why this works:** the clone owns its own copies of mutable state.

## Example 2 — Real-world: snapshots and defaults

Editors clone a "default document" as the starting point for a new file; games clone a configured enemy
"prototype" many times. Cloning a prepared object is cheaper and simpler than reconstructing it.

**Why this works:** the expensive setup happens once, on the prototype; copies are cheap.

## Example 3 — Pitfall: an accidental shallow copy

A `clone()` that does `Object.assign(new Thing(), this)` shares every nested object. Later, editing one
"copy" silently changes another. The bug is invisible until two clones interact.

**Why this bites:** shallow copies *look* independent but alias their inner state — the classic
Prototype mistake.

# Common Mistakes

- **Shipping a shallow copy where a deep one is needed.** Nested mutable state gets shared.
- **Reaching for `structuredClone` on class instances.** You lose methods and the prototype; you get a
  plain object.
- **Confusing the pattern with JavaScript's prototypal inheritance.** Different concept entirely.

# Best Practices

- Decide **deep vs shallow** deliberately; deep-copy anything mutable that could be shared.
- Give objects their own `clone()` when the **class/type must be preserved**.
- Use `structuredClone` for **plain data** structures, and know its limits.

# Summary

- **Prototype** creates new objects by **cloning** an existing instance rather than building from
  scratch.
- The key hazard is **shallow vs deep copy**: shallow copies share nested state and cause subtle bugs.
- `structuredClone` deep-copies plain data but drops methods/prototypes; hand-write `clone()` to keep
  the class.
- It's not the same as JavaScript's **prototypal inheritance**, despite the shared name.

# Flash Cards

Q: What is the intent of the Prototype pattern?
A: Create new objects by copying an existing prototypical instance instead of constructing them from scratch.

Q: What is the difference between a shallow and a deep copy?
A: A shallow copy duplicates only the top level and shares nested objects; a deep copy duplicates every level so nothing is shared.

Q: Why is a shallow clone() often a bug?
A: The "copies" share the same nested objects/arrays, so mutating one silently changes the other.

Q: What does structuredClone do, and what is its main limitation for this pattern?
A: It deep-copies plain data, but it drops methods and the class prototype (you get a plain object) and can't clone functions.

Q: How is the Prototype pattern different from JavaScript's prototypal inheritance?
A: The pattern is about copying objects to create new ones; prototypal inheritance is a language feature for sharing behavior via a linked prototype object.

Q: When is Prototype especially useful?
A: When creating an object from scratch is expensive, or to avoid maintaining a separate factory subclass for every configuration.

# Exercises

### Easy
Explain, with the `Document` example, why `clone()` copies the `tags` array with `[...this.tags]`
instead of just passing `this.tags`.

### Medium
Write a `clone()` for an object that has a nested object field (like `Shape`'s `style`). Show a test
that mutating the clone's nested field does not affect the original.

### Challenging
Take an object with a nested array of objects (two levels deep). Write a correct deep `clone()`, then
show how `structuredClone` handles it — and what happens to any methods on the objects.

# Further Reading

- Gamma et al. — *Design Patterns*, "Prototype".
- Refactoring.Guru — *Prototype*: <https://refactoring.guru/design-patterns/prototype>
- MDN — *structuredClone()*: <https://developer.mozilla.org/en-US/docs/Web/API/structuredClone>
