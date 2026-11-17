---
slug: object-adapter-vs-class-adapter
title: "Object Adapter vs Class Adapter"
topic: structural-adapters
kind: concept
summary: "Object adapters wrap adaptee instances via composition; class adapters inherit from both classes via multiple inheritance."
tags:
  - structural
  - adapter
  - composition
  - inheritance
related:
  - adapter-intent
  - adapter-in-practice
  - design-principles-interfaces-composition
---

> **In one line:** Object adapters wrap an adaptee using composition; class adapters inherit from both classes.

## The idea

The Gang of Four catalog presents two distinct structural forms of the Adapter pattern: **Class Adapter** and **Object Adapter**.

A **Class Adapter** relies on **multiple inheritance**. The adapter class inherits from both the expected Target class and the Adaptee class simultaneously. It overrides Target methods and translates them by invoking inherited Adaptee methods. Because TypeScript and JavaScript do not support multiple class inheritance (a class can only `extend` one parent class), traditional Class Adapters are rarely idiomatic in TypeScript.

An **Object Adapter** relies on **object composition**. The adapter implements the Target interface and holds a private reference to an Adaptee instance passed via its constructor. This adheres to the foundational principle: *favor object composition over class inheritance*.

| Dimension | Class Adapter | Object Adapter |
|---|---|---|
| **Mechanism** | Multiple class inheritance | Object composition |
| **Coupling** | High: tightly bound to specific Adaptee class | Low: adapts Adaptee and all its subclasses |
| **TypeScript Viability** | Restricted (single class inheritance) | Fully supported and idiomatic |
| **Flexibility** | Static compile-time binding | Dynamic runtime reference binding |

> **Tip:** In TypeScript, you can simulate a Class Adapter by inheriting from an Adaptee class while implementing an abstract Target interface: `class Adapter extends Adaptee implements Target`. However, the Object Adapter remains universally preferred.

## See it

```typescript
interface TargetLogger {
  log(message: string): void;
}

class ThirdPartyLogger {
  writeToConsole(str: string): void { console.log(`[EXTERNAL] ${str}`); }
}

// Preferred: Object Adapter via composition
class ObjectLoggerAdapter implements TargetLogger {
  constructor(private adaptee: ThirdPartyLogger) {}
  log(msg: string): void {
    this.adaptee.writeToConsole(msg);
  }
}

const adapter = new ObjectLoggerAdapter(new ThirdPartyLogger());
adapter.log('Hello world');
```

## Go deeper

A major advantage of the Object Adapter is that a single adapter instance can adapt not only the concrete Adaptee class, but also any of its subclasses. Because it holds a reference to the adaptee polymorphically, any derived adaptee variant works transparently through the exact same adapter wrapper.

## Watch out

- Avoid attempting multiple class inheritance workarounds in TypeScript when composition is simpler.
- Ensure that the adapter does not accidentally leak underlying adaptee methods to client code.

## Remember

- Object Adapter uses composition to wrap an adaptee instance inside an adapter class.
- Class Adapter requires multiple inheritance and is rarely suitable for modern TypeScript.
- Object Adapters are more flexible because they can adapt an entire hierarchy of adaptee subclasses.
