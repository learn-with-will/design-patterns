---
slug: flyweight-factory-and-cache
title: "Flyweight Factories & Object Pooling"
topic: structural-proxies
kind: technique
summary: "Manage shared flyweights using a factory pool that returns existing instances before allocating new ones."
tags:
  - structural
  - flyweight
  - factory
  - caching
related:
  - flyweight-intent
  - intrinsic-vs-extrinsic-state
  - flyweight-tradeoffs-memory
---

> **In one line:** A Flyweight Factory acts as a cache, returning existing shared instances before creating new ones.

## The idea

In the Flyweight pattern, client code should never instantiate flyweight objects directly using `new Flyweight()`. If clients call `new` directly, duplicate instances with identical intrinsic state will multiply, defeating the purpose of the pattern.

Instead, all flyweight creation is routed through a **Flyweight Factory**.

The Flyweight Factory maintains an internal cache (a Map or dictionary) of existing flyweight instances keyed by their intrinsic properties. When a client requests a flyweight, the factory inspects its cache:
- If a flyweight with matching intrinsic state already exists, the factory returns the existing cached instance.
- If it does not exist, the factory creates a new instance, stores it in the cache, and returns it.

| Step | Client Request | Flyweight Factory Action |
|---|---|---|
| **1** | Request `TreeType('Oak', 'Green')` | Not in cache: creates new `TreeType`, caches it, returns it |
| **2** | Request `TreeType('Pine', 'DarkGreen')` | Not in cache: creates new `TreeType`, caches it, returns it |
| **3** | Request `TreeType('Oak', 'Green')` | **Found in cache**: returns existing instance directly (no `new`) |

> **Tip:** In TypeScript, use composite cache keys (such as ``${name}_${color}_${texture}``) to uniquely identify intrinsic configurations in the factory's internal Map.

## See it

```typescript
class GlyphFlyweight {
  constructor(public readonly char: string, public readonly font: string) {}
}

class GlyphFactory {
  private static cache = new Map<string, GlyphFlyweight>();

  static getGlyph(char: string, font: string): GlyphFlyweight {
    const key = `${char}_${font}`;
    let glyph = this.cache.get(key);
    
    if (!glyph) {
      glyph = new GlyphFlyweight(char, font);
      this.cache.set(key, glyph);
      console.log(`[Factory] Created new flyweight for '${key}'`);
    }
    return glyph;
  }

  static getCacheCount(): number { return this.cache.size; }
}

const g1 = GlyphFactory.getGlyph('A', 'Arial');
const g2 = GlyphFactory.getGlyph('A', 'Arial');
console.log(g1 === g2); // true! Exact same instance returned
```

## Go deeper

Flyweight factories are closely related to Object Pools. However, in an **Object Pool**, pooled objects are loaned out exclusively to one client at a time and returned when done. In a **Flyweight Factory**, a single flyweight instance is shared simultaneously among thousands of clients concurrently because it is completely immutable.

## Watch out

- Do not allow external code to bypass the Flyweight Factory; make flyweight constructors package-private if possible.
- Be mindful of memory leaks if the factory cache accumulates millions of unique flyweight keys over time.

## Remember

- Flyweight creation must be strictly encapsulated behind a Flyweight Factory cache.
- The factory returns existing shared instances before allocating new memory.
- Composite keys in a Map allow rapid lookup of identical intrinsic state configurations.
