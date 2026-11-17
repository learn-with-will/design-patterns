---
slug: singleton-intent
title: "Singleton: Intent & Global Instance"
topic: creational-objects
kind: pattern
summary: "Singleton ensures a class has only one instance and provides a global access point to it."
tags:
  - creational
  - singleton
  - global-state
  - lifecycle
related:
  - singleton-implementation-ts
  - singleton-drawbacks-and-antipattern
  - singleton-alternatives-modules-di
---

> **In one line:** Singleton guarantees a class has only one instance while providing a global access point to it.

## The idea

Certain resources in an application represent unique physical hardware or system coordinators. Examples include a hardware printer spooler, a global application configuration registry, or a central logging service.

Having multiple competing instances of these managers can lead to resource contention, conflicting writes, and corrupted application state.

The Gang of Four's **Singleton** pattern addresses this. Its official intent is: **"Ensure a class only has one instance, and provide a global point of access to it."** The class itself is responsible for keeping track of its sole instance, intercepting instantiation requests, and returning that single shared instance to all callers. This encapsulates the creation process and guarantees that no rogue secondary instances can ever be instantiated by client code.

| Singleton Responsibility | Implementation Mechanism |
|---|---|
| **Prevent Multiple Instances** | Mark constructor as `private` so `new` cannot be called externally |
| **Manage Instance Lifecycle** | Store the single instance in a private static class field |
| **Global Access Point** | Expose a public static `getInstance()` method |

> **Note:** Singleton is the only GoF creational pattern that strictly limits the number of instances rather than helping create more of them.

## See it

```typescript
class AppConfig {
  private static instance: AppConfig | null = null;
  private settings: Record<string, string> = {};

  // 1. Private constructor blocks direct "new AppConfig()"
  private constructor() {}

  // 2. Global access point returns the sole instance
  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public set(key: string, val: string) { this.settings[key] = val; }
  public get(key: string) { return this.settings[key]; }
}

const config = AppConfig.getInstance();
config.set('env', 'production');
console.log(AppConfig.getInstance().get('env')); // 'production'
```

## Go deeper

In multi-threaded languages like Java or C++, Singleton implementations require careful thread-synchronization techniques (such as the "Double-Checked Locking" pattern) to prevent race conditions where two threads invoke `getInstance()` simultaneously and instantiate two copies. In JavaScript and TypeScript, the single-threaded event loop eliminates thread race conditions during object creation, significantly simplifying implementation mechanics.

## Watch out

- Do not reach for Singleton simply because an object is currently used in one place; use it only when having two instances is catastrophic.
- Remember that global singletons make unit testing challenging by sharing state across test runs.

## Remember

- Singleton guarantees a class has exactly one instance throughout the application lifecycle.
- A private constructor prevents external code from instantiating the class directly.
- A public static getInstance() method provides the universal access point to that instance.
