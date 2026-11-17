---
slug: template-method-vs-strategy
title: "Template Method vs Strategy & Hollywood Principle"
topic: behavioral-algorithms
kind: concept
summary: "Template Method varies algorithm steps via inheritance; Strategy varies the entire algorithm via composition."
tags:
  - behavioral
  - template-method
  - strategy
  - comparison
related:
  - template-method-intent
  - strategy-intent
  - design-principles-interfaces-composition
---

> **In one line:** Template Method uses inheritance to vary parts of an algorithm; Strategy uses composition to vary the whole algorithm.

## The idea

Template Method and Strategy both allow developers to vary algorithmic behavior, but they achieve this variability through opposite mechanisms:

**Template Method** relies on **class inheritance**. The base class defines the invariant skeleton, and subclasses override specific steps. The variability is at the **step level**: the algorithm structure is locked in, and subclasses fill in the blanks. Control is static (compile time).

**Strategy** relies on **object composition**. The entire algorithm is encapsulated inside an independent strategy object and passed to a Context. The variability is at the **macro level**: the client can swap the entire algorithm dynamically at runtime.

| Dimension | Template Method | Strategy Pattern |
|---|---|---|
| **Mechanism** | Class Inheritance (`extends`) | Object Composition (`has-a`) |
| **Granularity** | Varies individual *steps* of an algorithm | Replaces the *entire* algorithm |
| **Binding Time** | Compile time (static) | Runtime (dynamic) |
| **Coupling** | High: subclass coupled to base class skeleton | Low: Context and Strategy interact via interface |

> **Note:** Remember the rule of thumb: If you need to change *how specific steps* are done inside a fixed workflow, use **Template Method**. If you need to switch *how the whole job* is done, use **Strategy**.

## See it

```typescript
// Template Method: Inheritance varies STEPS
abstract class BaseCook {
  makeMeal() { this.prep(); this.cook(); this.cleanup(); }
  abstract cook(): void; // Varies step
  prep() { console.log('Chop veggies'); }
  cleanup() { console.log('Wash pans'); }
}

// Strategy: Composition varies ENTIRE ALGORITHM
interface CookingStrategy { cook(): void; }
class GrillStrategy implements CookingStrategy {
  cook() { console.log('Grilling steaks over coals'); }
}
class Chef {
  constructor(private strategy: CookingStrategy) {}
  prepareMeal() { this.strategy.cook(); } // Entire job delegated
}
```

## Go deeper

You can combine both patterns: a class can use the Strategy pattern to select an overarching algorithm, and that Strategy object can internally use the Template Method pattern to execute its steps. This provides dynamic runtime swapping combined with clean step-by-step code reuse.

## Watch out

- Avoid Template Method if you need to switch algorithms dynamically on the fly at runtime.
- Do not choose Template Method if subclassing creates deep, rigid inheritance hierarchies.

## Remember

- Template Method varies individual algorithm steps through class inheritance.
- Strategy replaces the entire algorithm at runtime through object composition.
- Template Method is static and rigid; Strategy is dynamic, loose, and runtime-configurable.
