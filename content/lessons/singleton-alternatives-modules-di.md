---
slug: singleton-alternatives-modules-di
title: "Modern Alternatives: Modules & DI"
topic: creational-objects
kind: technique
summary: "Replace classical Singletons with TypeScript module exports or container-managed singleton lifetimes in DI."
tags:
  - creational
  - singleton
  - modules
  - dependency-injection
related:
  - singleton-intent
  - singleton-drawbacks-and-antipattern
  - dip-vs-di-vs-ioc
---

> **In one line:** Modern TypeScript replaces classical Singletons with ES module exports or Dependency Injection singleton lifetimes.

## The idea

In modern TypeScript and JavaScript development, you rarely need to write classical GoF Singleton classes with private constructors and static `getInstance()` methods. Two superior alternatives exist.

**Alternative 1: ES Module Singleton**. The ES module system caches modules when they are imported. If you instantiate an object at module scope and export it, every file that imports that instance receives the exact same cached object reference. This provides a single shared instance without boilerplate class mechanics.

**Alternative 2: Dependency Injection Singleton Lifetime**. Modern DI containers (such as InversifyJS, NestJS, or manual composition roots) manage object lifecycles externally. The class itself is written as a clean, standard class with a public constructor and no global state. The DI container is configured to instantiate it once and inject that same instance wherever requested.

| Approach | Boilerplate | Testability | Dependency Declaration |
|---|---|---|---|
| **Classical GoF Singleton** | High (private ctor + static) | Very Poor | Hidden inside method bodies |
| **ES Module Export** | Minimal (single export) | Moderate (can mock module) | Imported explicitly |
| **DI Singleton Lifetime** | Low (standard class) | Excellent (inject mock class) | Declared in constructor (DIP) |

> **Tip:** By separating the *class implementation* from its *lifecycle management*, Dependency Injection gives you the benefit of a single shared instance in production while retaining full mockability in unit tests.

## See it

```typescript
// Alternative 1: Idiomatic ES Module Singleton (logger.ts)
class Logger {
  log(msg: string) { console.log(`[LOG]: ${msg}`); }
}
// Export a single instantiated instance
export const logger = new Logger();

// Alternative 2: Standard class used with DI Container
export class DatabaseService {
  constructor(private url: string) {}
  connect() { /* ... */ }
}
// Composition Root configures it with singleton lifetime:
// container.bind(DatabaseService).toSelf().inSingletonScope();
```

## Go deeper

The crucial distinction between a Singleton class and a Singleton lifetime in DI is ownership. When a class enforces its own singleton constraint, it forces all consumers everywhere to share that instance. When a DI container manages a singleton lifetime, the class itself remains flexible—you can easily create 10 independent instances in your test suite, while the container serves a single instance in production.

## Watch out

- Be aware that in some monorepo setups or bundling environments, duplicate package copies can duplicate module singletons.
- Do not let module-level singletons accumulate unmanaged mutable state across hot-reloads.

## Remember

- TypeScript ES module exports provide natural single-instance sharing without boilerplate.
- Dependency Injection manages singleton lifetimes externally without polluting class design.
- Decoupling object lifecycle from class design ensures effortless mocking and automated testing.
