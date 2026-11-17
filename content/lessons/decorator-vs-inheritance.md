---
slug: decorator-vs-inheritance
title: "Decorator vs Subclassing & TS Annotations"
topic: structural-composition
kind: concept
summary: "GoF Decorator uses runtime object composition, distinct from compile-time TypeScript class decorators."
tags:
  - structural
  - decorator
  - inheritance
  - annotations
related:
  - decorator-intent
  - wrapping-behavior-dynamically
  - design-principles-interfaces-composition
---

> **In one line:** The GoF Decorator pattern is runtime object composition; TypeScript @decorators are compile-time metaprogramming annotations.

## The idea

Developers frequently confuse the classic **Gang of Four Decorator design pattern** with **TypeScript and Python `@decorator` language annotations**.

**The GoF Decorator Pattern** is a structural pattern based on **runtime object composition**. You instantiate objects and wrap them inside wrapper objects at runtime. Different instances of the same class can have completely different decorators attached.

**TypeScript `@decorators`** (Stage 3 ECMAScript decorators) are **metaprogramming annotations** evaluated once when classes and methods are defined at import time. They modify class definitions, attach metadata, or wrap class prototypes. They apply globally to all instances of that class and cannot be attached or detached per-instance dynamically at runtime.

| Dimension | GoF Decorator Pattern | TypeScript `@decorator` Annotation |
|---|---|---|
| **Mechanism** | Object composition & wrapper delegation | Metaprogramming function modifying class definition |
| **When Applied** | Dynamically at runtime per instance | Statically at module import time per class |
| **Granularity** | Instance-specific (Instance A decorated, B not) | Universal to all instances of the class |
| **Interface** | Wrapper matches target interface | Modifies target prototype / descriptor |

> **Note:** A class hierarchy attempting to provide all combinations of 4 optional features requires up to 16 subclasses (`2^N`). The GoF Decorator pattern requires only 4 decorator classes that can be composed on demand.

## See it

```typescript
// GoF Pattern: Instance-level dynamic wrapping
const baseLogger = new ConsoleLogger();
const securedLogger = new AuthDecorator(baseLogger); // Only this instance is decorated!

// TypeScript @decorator annotation: Class-level static decoration
function logged(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${key}`);
    return original.apply(this, args);
  };
}

class UserService {
  @logged // Applies to EVERY instance of UserService forever
  getUser(id: string) { return { id }; }
}
```

## Go deeper

Choosing between Decorator and Subclassing comes down to flexibility:
- Use **Subclassing** when behavior is static, known upfront, and applies universally to all instances of a specialized type.
- Use **Decorator** when behavior must be added or removed dynamically at runtime, or when combining multiple independent features would cause subclass explosion.

## Watch out

- Never confuse the GoF pattern with language annotations when writing architectural documentation.
- Do not use Decorators when simple inheritance captures a permanent, unchanging domain specialization.

## Remember

- The GoF Decorator pattern wraps individual object instances dynamically at runtime.
- TypeScript @annotations modify class prototypes globally at module load time.
- Decorator replaces exponential subclass hierarchies with modular, composable wrapper classes.
