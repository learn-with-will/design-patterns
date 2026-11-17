---
slug: prototype-vs-js-prototypes
title: "GoF Prototype vs JavaScript Prototypes"
topic: creational-objects
kind: concept
summary: "The GoF Prototype pattern is an explicit cloning method, distinct from JavaScript's prototype inheritance chain."
tags:
  - creational
  - prototype
  - javascript
  - inheritance
related:
  - prototype-intent
  - shallow-vs-deep-cloning
  - prototype-registry
---

> **In one line:** The GoF Prototype pattern is an explicit cloning method, distinct from JavaScript's prototype inheritance chain.

## The idea

Because JavaScript features prototype-based inheritance natively, developers often confuse JavaScript's language mechanism with the Gang of Four **Prototype design pattern**. They share a name, but address different architectural problems.

**JavaScript's Prototypal Inheritance** is a language-level mechanism for sharing methods and property lookup. When you access `obj.method()`, JavaScript walks up the `__proto__` prototype chain to find the function. If an object does not have a property, it delegates to its prototype.

**The GoF Prototype Pattern** is a creational design pattern where an object explicitly implements a `clone()` method to duplicate its full state into a distinct new memory location. The clone is an independent object, not merely a link in a delegate lookup chain.

| Dimension | GoF Prototype Pattern | JavaScript Prototype Chain |
|---|---|---|
| **What it is** | A creational design pattern | A language inheritance mechanism |
| **Core Operation** | Explicit `clone()` returning duplicate | Implicit property lookup delegation via `Object.getPrototypeOf` |
| **Memory State** | Cloned object holds independent copy | Objects share memory of methods on prototype |
| **Modification** | Mutating clone does not affect prototype | Mutating prototype alters behavior for all instances |

> **Note:** You can use JavaScript's `Object.create(proto)` to create an object whose prototype chain points to `proto`. While related, it delegates property reads rather than creating an independent deep clone.

## See it

```typescript
// JS Prototype Delegation: shared lookup chain
const baseWeapon = { damage: 10 };
const sword = Object.create(baseWeapon);
console.log(sword.damage); // 10 (delegated via prototype chain)

// GoF Prototype Pattern: explicit state duplication
class Weapon {
  constructor(public damage: number) {}
  clone(): Weapon {
    return new Weapon(this.damage);
  }
}

const axe = new Weapon(15);
const clonedAxe = axe.clone(); // Separate object in memory
```

## Go deeper

Brendan Eich designed JavaScript in 1995 using prototype delegation inspired by the Self programming language. Self replaced classes entirely with prototypes. However, the Gang of Four pattern catalog was published in 1994 and describes object duplication in traditional class-based languages (C++ and Smalltalk). Knowing this history clarifies why the same word is used for both concepts.

## Watch out

- Do not assume Object.create() satisfies the GoF Prototype pattern; it delegates rather than duplicates.
- Never mutate the prototype chain at runtime (e.g., modifying Object.prototype), as it causes severe performance de-optimizations.

## Remember

- The GoF Prototype pattern is about explicit state cloning via a clone() method.
- JavaScript prototypal inheritance is a language mechanism for shared property delegation.
- A GoF clone is a distinct instance in memory that can be modified without altering other objects.
