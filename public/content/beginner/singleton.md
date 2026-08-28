---
id: lesson-07
slug: singleton
title: "Singleton"
level: beginner
order: 7
duration: 16
tags:
  - creational
  - singleton
  - global-state
  - trade-offs
  - gof
summary: "The Singleton pattern — ensure a class has just one instance with a global access point — presented honestly: how to build one, why many consider it an anti-pattern (global state, hidden dependencies, hard testing), and why in TypeScript a module is often the simpler single instance."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Singleton pattern and implement one in TypeScript.
- Explain, **honestly**, the serious criticisms of Singleton.
- Use a **module** as the natural single instance in TypeScript/JavaScript.
- Decide when a single shared instance is justified — and when it's a trap.

# Why It Matters

Singleton is the most famous — and most **controversial** — of the creational patterns. It's easy to
reach for ("there should only be one configuration!") and easy to regret, because it introduces
**global state** through the back door. Learning it means learning *when not to use it*, which is why
this lesson leans hard on the trade-offs.

# Concept Explanation

### Intent

> **Ensure a class has only one instance, and provide a global point of access to it.** — Gang of Four

### A classic implementation

```typescript
class Config {
  private static instance: Config | null = null;
  public readonly values: Record<string, string>;

  // Private constructor blocks `new Config()` from outside.
  private constructor() {
    this.values = { apiUrl: "/api" };
  }

  static getInstance(): Config {
    if (Config.instance === null) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

const a = Config.getInstance();
const b = Config.getInstance();
// a === b  → true: both refer to the one instance.
```

The two moves that make it a Singleton: a **private constructor** (so nobody else can create one) and a
**static accessor** that lazily creates and returns the single instance.

### Why many consider it an anti-pattern

Singleton is widely criticized. Be clear-eyed about why:

- **It's global state in disguise.** Any code can call `Config.getInstance()` and mutate shared state,
  so effects happen "at a distance" and become hard to trace.
- **It hides dependencies.** A class that reaches for a singleton internally doesn't *declare* that it
  needs it. Its true dependencies are invisible in its constructor — the opposite of Dependency
  Injection.
- **It makes testing hard.** A single, persistent instance carries state **between tests**, and you
  can't easily substitute a fake. Tests become order-dependent and flaky.
- **It can violate the Single Responsibility Principle** by mixing "manage my one instance" with the
  class's real job.

Because of this, many teams prefer to create one instance and **inject** it where needed (DI) rather
than have classes fetch a global.

### In TypeScript, a module is already a singleton

ES modules are evaluated **once** and their exports are shared everywhere they're imported. So the
simplest "one shared thing" usually needs no Singleton class at all:

```typescript
// config.ts — evaluated once; every import shares this object.
export const config = { apiUrl: "/api" };
```

This gives you a single shared instance with none of the private-constructor ceremony (though it shares
the same global-state caution).

### A note on thread-safety

Classic Singleton lessons warn about two threads creating two instances at once. In **single-threaded
JavaScript** that race doesn't happen, so the naive lazy version above is fine. In multi-threaded
languages (Java, C#, C++), Singleton needs explicit synchronization — a reminder that a pattern's
implementation details depend on the platform.

### Consequences

- **Good (when justified):** one controlled access point; lazy creation; guaranteed single instance
  for a genuinely single resource.
- **Cost:** global mutable state, hidden dependencies, testing pain, and tight coupling to a concrete
  global.

# Key Terminology

- **Singleton** — a class restricted to a single instance with a global access point.
- **Private constructor** — prevents outside code from creating instances.
- **Global state** — data reachable and mutable from anywhere; Singleton's core hazard.
- **Module singleton** — a single shared instance provided by an ES module's one-time evaluation.

# Options and Trade-offs

| Need | Singleton class | Dependency Injection | Module export |
| ---- | --------------- | -------------------- | ------------- |
| One shared instance | Yes, with ceremony | Create once, pass in | Yes, simplest in TS |
| Testability | Poor (shared state) | Good (swap a fake) | Moderate |
| Explicit dependencies | Hidden | Declared in constructor | Import is visible |
| When to prefer | Rarely; a truly single resource | Most application code | Simple shared config/util in TS |

# Worked Example

Compare fetching a global versus injecting a dependency:

```typescript
// Hidden dependency: Service secretly grabs the global. Hard to test.
class ServiceA {
  run() { return Config.getInstance().values.apiUrl; }
}

// Declared dependency: Service asks for what it needs. Easy to test with a fake.
class ServiceB {
  constructor(private config: { values: Record<string, string> }) {}
  run() { return this.config.values.apiUrl; }
}
```

`ServiceB` is testable without touching any global — the same benefit DIP promised in the SOLID lesson.

# Real World Analogy

A Singleton is like a town having exactly **one town clock** everyone reads. Handy — until you realize
*anyone* can climb up and change the time, and now every appointment in town is wrong and nobody knows
who moved the hands. A single shared thing is convenient and dangerous for the same reason: everyone
depends on it, and everyone can change it.

# Examples

## Example 1 — Basic: the identity check

`Config.getInstance() === Config.getInstance()` is `true`. That guaranteed identity is what Singleton
provides.

**Why this works:** the static field caches the one instance and hands it back every time.

## Example 2 — Real-world: prefer a module or DI

Instead of a Singleton logger that every class fetches globally, export one `logger` from a module and
`import` it — or better, **inject** it — so dependencies stay visible and tests can supply a fake.

**Why this works:** you keep "one instance" while avoiding the hidden-dependency and testing problems.

## Example 3 — Pitfall: shared state leaks across tests

A Singleton cache holds entries from Test 1 into Test 2, so Test 2 passes or fails depending on order.
The bug isn't in either test — it's the persistent global.

**Why this bites:** singletons live for the whole program, so their state outlives the code that should
own it.

# Common Mistakes

- **Using Singleton as a convenient global variable.** That's the anti-pattern, not the pattern.
- **Ignoring testability.** Shared, persistent state makes tests order-dependent.
- **Adding Singleton ceremony in TypeScript** when a module export already gives one instance.

# Best Practices

- Prefer **Dependency Injection**: create one instance and pass it in, keeping dependencies explicit.
- In TypeScript, use a **module-level export** for simple shared values.
- Reserve a true Singleton for a genuinely single resource, and keep its state **immutable** where you
  can.

# Summary

- **Singleton** ensures one instance with a global access point (private constructor + static
  accessor).
- It's **controversial**: it's global state in disguise, hides dependencies, and hurts testability.
- In **TypeScript**, a module is already a single shared instance — often the better default.
- Prefer **injecting** a single instance over fetching a global; use a real Singleton sparingly.

# Flash Cards

Q: What is the intent of the Singleton pattern?
A: Ensure a class has only one instance and provide a global point of access to it.

Q: Which two implementation details make a class a Singleton?
A: A private constructor (so outsiders can't instantiate it) and a static accessor that lazily creates and returns the single instance.

Q: Name two common criticisms of Singleton.
A: It introduces global mutable state and hides dependencies, which also makes code hard to test (shared state leaks between tests).

Q: Why is a Singleton class often unnecessary in TypeScript?
A: An ES module is evaluated once and its exports are shared everywhere it's imported, so a module-level export already provides a single instance.

Q: Is Singleton's classic thread-safety warning relevant in JavaScript?
A: No — JavaScript is single-threaded, so the two-threads-create-two-instances race doesn't occur (it does matter in multi-threaded languages).

Q: What is usually a better alternative to a Singleton for application code?
A: Dependency Injection — create one instance and pass it in, so dependencies are explicit and a fake can be substituted in tests.

# Exercises

### Easy
List three reasons Singleton is criticized, and for each, name the SOLID principle or testing concern
it works against.

### Medium
Rewrite a Singleton-based class so that instead of calling `Config.getInstance()` inside, it receives
the config through its constructor (Dependency Injection). Show how a test can now pass a fake config.

### Challenging
Replace a Singleton with a **module export** in TypeScript. Then write a short paragraph on what you
gained (less ceremony, visible imports) and what caution still remains (it's still shared global state).

# Further Reading

- Gamma et al. — *Design Patterns*, "Singleton".
- Refactoring.Guru — *Singleton*: <https://refactoring.guru/design-patterns/singleton>
- Martin Fowler — *Inversion of Control Containers and the Dependency Injection pattern*: <https://martinfowler.com/articles/injection.html>
