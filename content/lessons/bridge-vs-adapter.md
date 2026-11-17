---
slug: bridge-vs-adapter
title: "Bridge vs Adapter"
topic: structural-adapters
kind: concept
summary: "Bridge is designed upfront to let abstractions and implementations vary; Adapter reconciles existing incompatible classes."
tags:
  - structural
  - bridge
  - adapter
  - comparison
related:
  - adapter-intent
  - bridge-intent
  - design-principles-interfaces-composition
---

> **In one line:** Bridge is architected upfront to support two independent dimensions; Adapter makes existing incompatible systems work together.

## The idea

Bridge and Adapter share a very similar structural form: in both patterns, an outer class delegates calls to an inner interface via composition. Because of this visual similarity in UML diagrams, developers frequently confuse them.

The crucial difference lies in their **intent** and **lifecycle timing**:

**Adapter** is applied **retroactively** (after code is already written). You have two existing, incompatible classes that cannot be modified, and you introduce an Adapter to bridge the impedance mismatch so they can communicate seamlessly.

**Bridge** is designed **upfront** (before code is written). You anticipate that a system will vary along two independent orthogonal axes (such as domain logic vs platform execution), and you deliberately design the abstraction and implementor hierarchies to evolve independently without class explosion.

| Dimension | Adapter | Bridge |
|---|---|---|
| **Design Timing** | Retroactive (after systems exist) | Proactive (upfront architectural design) |
| **Intent** | Convert an existing incompatible interface | Decouple abstraction from implementation |
| **Participants** | Adaptee usually already exists | Abstraction and Implementor designed together |
| **Goal** | Make mismatched classes cooperate | Prevent combinatorial subclass explosion |

> **Note:** A simple mnemonic: *Adapter makes things work after they're designed; Bridge makes them work before they are.*

## See it

```typescript
// Adapter: Retroactive fix for incompatible existing APIs
class LegacyTaxCalculator {
  computeOldTax(n: number) { return n * 0.15; }
}
class TaxAdapter {
  constructor(private legacy: LegacyTaxCalculator) {}
  calculate(amount: number) { return this.legacy.computeOldTax(amount); }
}

// Bridge: Upfront design for independent orthogonal evolution
interface StorageDriver {
  persist(key: string, data: string): void;
}
abstract class DataStore {
  constructor(protected driver: StorageDriver) {} // Upfront bridge
  abstract saveRecord(record: { id: string; val: string }): void;
}
```

## Go deeper

The Gang of Four explicitly noted this contrast in their summary: *Adapter focuses on resolving incompatibilities between two existing interfaces. Bridge, on the other hand, bridges an abstraction and its (potentially numerous) implementations, providing a stable interface while implementations vary.* Knowing this boundary enables you to choose the right structural pattern with confidence.

## Watch out

- Never use Bridge when you only have one concrete implementation and no foreseeable variation.
- Do not confuse an Adapter that translates an interface with a Bridge that coordinates two full hierarchies.

## Remember

- Adapter is a retroactive solution that fixes incompatible interfaces between existing classes.
- Bridge is an upfront architectural pattern designed to let two dimensions vary independently.
- Adapter makes incompatible things work together; Bridge prevents class explosion in complex hierarchies.
