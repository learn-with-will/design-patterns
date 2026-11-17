---
slug: prototype-registry
title: "Prototype Registries & Catalogs"
topic: creational-objects
kind: technique
summary: "Maintain a key-value registry of pre-configured prototype objects that clients can clone on demand."
tags:
  - creational
  - prototype
  - registry
  - catalog
related:
  - prototype-intent
  - shallow-vs-deep-cloning
  - prototype-vs-js-prototypes
---

> **In one line:** A Prototype Registry stores a catalog of pre-warmed prototypes accessible by key for rapid cloning.

## The idea

In real-world applications, developers rarely keep loose prototype instances scattered across different variables. Instead, they organize prototypes using a **Prototype Registry** (also known as a Prototype Manager or Catalog).

The Prototype Registry is an associative map (or dictionary) that associates string keys or identifiers with pre-initialized prototype instances.

When client code needs an object, it requests it from the registry by key (e.g., `registry.get('button.primary')` or `registry.get('goblin.archer')`). The registry looks up the matching prototype, invokes its `clone()` method, and returns a fresh, independent instance ready for customization.

| Step | Action in Prototype Registry |
|---|---|
| **1. Initialization** | Application startup instantiates and tunes baseline objects |
| **2. Registration** | Baseline objects are stored in the registry map with human-readable keys |
| **3. Request** | Client requests a clone: `catalog.get('warrior')` |
| **4. Return** | Registry locates prototype, calls `.clone()`, and returns the duplicate |

> **Tip:** You can combine the Prototype Registry with the Factory pattern: instead of using a switch statement to instantiate classes, a factory can query a prototype registry to clone requested objects.

## See it

```typescript
interface Cloneable<T> {
  clone(): T;
}

class Monster implements Cloneable<Monster> {
  constructor(public type: string, public attack: number) {}
  clone(): Monster {
    return new Monster(this.type, this.attack);
  }
}

class MonsterRegistry {
  private prototypes = new Map<string, Monster>();

  register(key: string, monster: Monster): void {
    this.prototypes.set(key, monster);
  }

  create(key: string): Monster {
    const proto = this.prototypes.get(key);
    if (!proto) throw new Error(`Prototype ${key} not found`);
    return proto.clone();
  }
}
```

## Go deeper

Prototype registries provide exceptional flexibility because prototypes can be registered or updated dynamically at runtime. For instance, in a customizable content management system or dashboard builder, plugins can register their own custom widget prototypes into the global registry during runtime bootup without recompiling core code.

## Watch out

- Ensure the registry returns a clone and never leaks the original prototype reference directly.
- Throw informative errors when a client requests a prototype key that was never registered.

## Remember

- A Prototype Registry stores pre-configured objects in a key-value catalog for quick retrieval.
- Clients request objects by key, and the registry returns a newly cloned instance.
- Registries allow dynamic runtime registration of new object templates without modifying core code.
