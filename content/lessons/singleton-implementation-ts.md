---
slug: singleton-implementation-ts
title: "Implementing Singleton in TypeScript"
topic: creational-objects
kind: technique
summary: "Use a private constructor and a static getInstance method or class property to enforce a single instance."
tags:
  - creational
  - singleton
  - typescript
  - lazy-initialization
related:
  - singleton-intent
  - singleton-drawbacks-and-antipattern
  - singleton-alternatives-modules-di
---

> **In one line:** Implement Singleton in TypeScript using private constructors and static fields with lazy or eager evaluation.

## The idea

In TypeScript, implementing the classical GoF Singleton pattern requires two language features: access modifiers (specifically `private`) and static members.

There are two primary evaluation strategies for Singleton instantiation:
1. **Lazy Initialization**: The instance is not created until the first time `getInstance()` is invoked. This conserves memory and startup time if the resource is expensive and might not be needed immediately.
2. **Eager Initialization**: The instance is allocated immediately when the module is evaluated by initializing the static field directly.

In TypeScript, both strategies are straightforward to implement, with lazy initialization being the canonical GoF pattern.

| Strategy | When Instantiated | Memory Impact | Startup Speed |
|---|---|---|---|
| **Lazy** | On first call to `getInstance()` | Zero until consumed | Instant application boot |
| **Eager** | When module is first loaded | Consumed immediately | Slight boot time cost |

> **Tip:** You can enforce immutability on a Singleton instance by freezing it inside the constructor using `Object.freeze(this)`, preventing consumers from monkey-patching properties onto the global instance.

## See it

```typescript
class DatabasePool {
  private static instance: DatabasePool;
  private isConnected = false;

  private constructor() {
    this.isConnected = true;
    console.log('Database pool established');
  }

  public static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  public query(sql: string) { return `Executing ${sql}`; }
}

const pool1 = DatabasePool.getInstance();
const pool2 = DatabasePool.getInstance();
console.log(pool1 === pool2); // true
```

## Go deeper

TypeScript access modifiers like `private` are enforced only at compile time by the compiler. At runtime, the compiled JavaScript outputs standard ES classes or constructor functions. However, modern JavaScript supports native private fields using the hash prefix (`#instance`), which enforces true runtime privacy that cannot be bypassed even via reflection or `Object.keys()`.

## Watch out

- Do not expose public reset() methods on your production Singleton, as other consumers depend on its persistence.
- Watch out for sub-classing Singletons; singletons should generally be marked final or have constructors remain private.

## Remember

- A private constructor blocks direct invocation of new from outside the class.
- A static getInstance() method implements lazy initialization on demand.
- Both references point to the exact same memory location (reference equality holds).
