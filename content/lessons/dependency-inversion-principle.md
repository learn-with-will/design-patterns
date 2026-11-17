---
slug: dependency-inversion-principle
title: "Dependency Inversion Principle (DIP)"
topic: solid-principles
kind: concept
summary: "High-level modules should depend on abstractions rather than low-level concrete implementations."
tags:
  - solid
  - dip
  - decoupling
  - abstractions
related:
  - dip-vs-di-vs-ioc
  - single-responsibility-principle
  - open-closed-principle
---

> **In one line:** High-level business policies should depend on abstractions, never on low-level implementation details.

## The idea

The Dependency Inversion Principle (DIP) is the final rule of the SOLID principles. It asserts two interconnected rules:
1. **High-level modules should not depend on low-level modules. Both should depend on abstractions.**
2. **Abstractions should not depend on details. Details should depend on abstractions.**

In traditional top-down software design, high-level business policies directly instantiate and call low-level components (such as specific database drivers, file system utilities, or cloud APIs). This direct coupling makes high-level business logic brittle; when the storage layer or payment provider changes, business code requires extensive rewrites.

DIP "inverts" this relationship. High-level modules define abstract interfaces that describe *what* they require to function. Low-level components then implement those interfaces. Ownership of the contract shifts to the high-level policy.

| Direction | Traditional Direct Coupling | Inverted Dependency (DIP) |
|---|---|---|
| **Control Flow** | High-Level ➔ Low-Level Implementation | High-Level ➔ Abstract Interface 🠔 Low-Level |
| **Dependency Owner** | Low-Level concrete class | High-Level domain policy owns interface |
| **Testability** | Hard: requires live databases / APIs | Trivial: mock interfaces in memory |
| **Portability** | Bound to specific vendor APIs | Agnostic: switch vendors by providing new adapter |

> **Note:** Dependency Inversion is the cornerstone of Clean Architecture and Hexagonal (Ports & Adapters) architecture. Domain entities remain pure and oblivious to database or UI frameworks.

## See it

```typescript
// High-level domain defines the required abstraction (Port)
interface UserRepository {
  findById(id: string): { id: string; name: string } | null;
}

// High-level service depends solely on the abstraction
class UserService {
  constructor(private userRepo: UserRepository) {}

  getUserDisplayName(id: string): string {
    const user = this.userRepo.findById(id);
    return user ? user.name : 'Unknown User';
  }
}

// Low-level detail implements the abstraction (Adapter)
class MongoUserRepository implements UserRepository {
  findById(id: string) {
    console.log(`Fetching ${id} from MongoDB collection`);
    return { id, name: 'Alice' };
  }
}
```

## Go deeper

The inversion in DIP refers to the inversion of compile-time dependency arrows relative to runtime control flow. At runtime, the control flows from high-level to low-level code. But at compile-time, both high-level and low-level source code point toward the abstract interface, inverting the traditional dependency structure.

## Watch out

- Do not confuse the architectural principle (DIP) with dependency injection frameworks or containers.
- Avoid defining interfaces that expose low-level database primitives (e.g., exposing SQL result cursors).

## Remember

- High-level domain logic must never import or depend directly on low-level infrastructure modules.
- Both high-level and low-level code must depend on abstract interface contracts.
- DIP enables effortless unit testing and frictionless technology migration without touching business rules.
