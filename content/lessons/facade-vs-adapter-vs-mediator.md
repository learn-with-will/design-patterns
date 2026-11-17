---
slug: facade-vs-adapter-vs-mediator
title: "Facade vs Adapter vs Mediator"
topic: structural-proxies
kind: concept
summary: "Facade simplifies a subsystem; Adapter reconciles an incompatible interface; Mediator coordinates peer objects."
tags:
  - structural
  - facade
  - adapter
  - mediator
  - comparison
related:
  - facade-intent
  - adapter-intent
  - mediator-intent
---

> **In one line:** Facade simplifies access; Adapter translates interfaces; Mediator centralizes multidirectional communication.

## The idea

Facade, Adapter, and Mediator all wrap or coordinate other objects, which often leads to confusion. However, their architectural intents are fundamentally different:

**Adapter** wraps a single existing object to **translate its interface** into an interface expected by a client. It does not simplify or change behavior; it only makes incompatible APIs talk to each other.

**Facade** defines a **new, simplified interface** to an entire subsystem of multiple classes. It provides a higher-level view to make complex systems easier to consume from the outside. Communication is strictly one-directional: client ➔ Facade ➔ subsystem.

**Mediator** coordinates **multidirectional communication** between equal peer objects (colleagues). The colleagues know about the mediator and send events to it; the mediator routes events back to other colleagues.

| Pattern | Primary Intent | Interface Changes | Direction of Communication |
|---|---|---|---|
| **Adapter** | Translate an existing interface | Matches expected target interface | Client ➔ Adapter ➔ Single Adaptee |
| **Facade** | Simplify a complex subsystem | Creates new high-level coarse API | Client ➔ Facade ➔ Subsystem classes |
| **Mediator** | Coordinate peer communication | Coordinates colleague interactions | Colleague A 🠄➔ Mediator 🠄➔ Colleague B |

> **Note:** Remember: Adapter makes things work together; Facade makes things easier to use; Mediator prevents messy many-to-many communication between peers.

## See it

```typescript
// Adapter: Interface translation
class MicroAdapter implements TargetAPI {
  constructor(private legacy: LegacyLib) {}
  execute() { this.legacy.oldDo(); }
}

// Facade: Unidirectional subsystem simplification
class SubsystemFacade {
  constructor(private a: ServiceA, private b: ServiceB) {}
  simpleRun() { this.a.init(); this.b.process(); }
}

// Mediator: Multidirectional peer coordination
class DialogMediator {
  notify(sender: object, event: string) {
    // Coordinates two-way peer reactions between components
  }
}
```

## Go deeper

You can combine Facade and Mediator: an entire subsystem can have an internal Mediator that coordinates how its internal peer objects interact with each other, while exposing a public Facade to outside clients who only want simple, coarse-grained commands.

## Watch out

- Do not introduce a Mediator when a simple one-way Facade meets the client requirement.
- Do not confuse an Adapter wrapping a single class with a Facade wrapping an entire multi-class subsystem.

## Remember

- Adapter translates an existing incompatible interface into a target interface.
- Facade creates a new, simplified, unidirectional interface to a complex subsystem.
- Mediator coordinates complex multidirectional interactions between peer colleague objects.
