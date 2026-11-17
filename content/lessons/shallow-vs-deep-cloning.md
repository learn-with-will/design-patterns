---
slug: shallow-vs-deep-cloning
title: "Shallow vs Deep Copying in TypeScript"
topic: creational-objects
kind: technique
summary: "Distinguish shallow reference sharing from deep recursive duplication when implementing clone methods."
tags:
  - creational
  - prototype
  - cloning
  - deep-copy
related:
  - prototype-intent
  - prototype-registry
  - prototype-vs-js-prototypes
---

> **In one line:** Shallow copies duplicate top-level primitive values, while deep copies recursively duplicate nested object references.

## The idea

The most critical pitfall when implementing the Prototype pattern is the distinction between a **shallow copy** and a **deep copy**.

A **shallow copy** duplicates the primitive fields of an object (numbers, strings, booleans). However, if an object contains nested references to other objects (arrays, dates, child objects), a shallow copy merely copies the memory pointer. Both the original object and the clone point to the exact same nested instances. Mutating a nested array on the clone silently mutates the original object!

A **deep copy** recursively duplicates every object in the reference tree. The clone receives its own independent copies of all nested arrays, objects, and children, ensuring complete state isolation across all memory references.

| Copy Type | Primitives | Nested Objects / Arrays | Risk |
|---|---|---|---|
| **Shallow Copy** | Copied by value | Copied by reference (shared) | High: mutations bleed across clones |
| **Deep Copy** | Copied by value | Recursively duplicated | Safe: complete state isolation |

> **Tip:** Modern JavaScript and TypeScript runtimes support the native global `structuredClone()` function, which produces true deep copies of complex nested objects, arrays, Maps, Sets, and Dates without external libraries.

## See it

```typescript
class Character {
  constructor(public name: string, public stats: { hp: number; mana: number }) {}

  // Shallow copy hazard: stats object is shared!
  shallowClone(): Character {
    return new Character(this.name, this.stats);
  }

  // Deep copy: nested object is completely isolated
  deepClone(): Character {
    return new Character(this.name, structuredClone(this.stats));
  }
}

const hero = new Character('Knight', { hp: 100, mana: 50 });
const clone = hero.deepClone();
clone.stats.hp = 50;
console.log(hero.stats.hp); // Still 100! Complete state isolation.
```

## Go deeper

While `structuredClone()` handles nested data, it cannot clone functions, DOM nodes, or prototypes of class instances (it copies data properties, but the result loses class methods). When implementing Prototype on classes with behavior, you must manually construct a new class instance and deeply clone its internal data. Understanding this boundary ensures your cloned entities retain full method functionality.

## Watch out

- Never use JSON.parse(JSON.stringify(obj)) for cloning if your data contains Dates, undefined, or circular references.
- Watch out for performance degradation when deep-cloning massive object graphs with thousands of nodes.

## Remember

- Shallow copies share nested object references; mutating child state impacts both objects.
- Deep copies recursively duplicate all nested structures, providing complete mutation safety.
- Use native structuredClone() for data structures, or custom clone() methods for class instances.
