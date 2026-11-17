---
slug: how-to-choose-a-design-pattern
title: "How to Choose the Right Design Pattern"
topic: architecture-selection
kind: technique
summary: "Identify what varies in your system and select patterns based on design pressures rather than pattern popularity."
tags:
  - architecture
  - selection
  - decision-making
  - design-pressures
related:
  - refactoring-toward-patterns
  - avoiding-overengineering-yagni
  - recognizing-software-antipatterns
---

> **In one line:** Choose patterns by identifying what varies in your system and matching it to specific design pressures.

## The idea

With 23 Gang of Four patterns available, selecting the right pattern can seem overwhelming. The secret is never to browse the catalog asking: "Which pattern can I use here?"

Instead, start by diagnosing the **design pressure** in your system. Design patterns exist to encapsulate variability. The Gang of Four explicitly advised: **"Consider what should be variable in your design. This approach is the opposite of focusing on the cause of the redesign."**

Ask yourself: "What dimension of my system changes frequently, and what part stays constant?"
- If the *creation* of objects varies: look at Creational patterns.
- If the *composition* of structures varies: look at Structural patterns.
- If the *communication or algorithms* vary: look at Behavioral patterns.

| If Your Design Pressure Is... | The Candidate Patterns Are... |
|---|---|
| Need to create families of related objects | **Abstract Factory** |
| Complex multi-step construction with optional args | **Builder** |
| Reconciling incompatible third-party interfaces | **Adapter** |
| Simplifying a massive subsystem for casual callers | **Facade** |
| Dynamic runtime feature addition without subclassing | **Decorator** |
| Tree structures with uniform leaf/container handling | **Composite** |
| Swapping algorithms on the fly | **Strategy** |
| Broadcasting state changes to dynamic listeners | **Observer** |

> **Tip:** If no design pressure exists—if the code is simple, stable, and easy to modify—do not use any pattern! A plain function or simple class is always the superior choice.

## See it

```typescript
// Decision Process:
// 1. Symptom: Sprawling switch statement calculating shipping rates
// 2. Variable factor: The calculation algorithm changes by carrier
// 3. Constant factor: The order checkout workflow
// 4. Pattern match: Strategy Pattern!

interface ShippingCalculator {
  calculate(weight: number): number;
}

class FedExShipping implements ShippingCalculator {
  calculate(w: number) { return 10 + w * 1.5; }
}

class UPSShipping implements ShippingCalculator {
  calculate(w: number) { return 8 + w * 1.8; }
}
```

## Go deeper

Patterns also combine and transition naturally. A system often starts with **Factory Method**; as product variants expand into families, it evolves into **Abstract Factory**. An algorithm begins as a simple **Strategy**; as its steps become standardized, it incorporates **Template Method**. Understanding these natural evolution paths makes selection intuitive.

## Watch out

- Never select a pattern based on popularity or resume-driven development.
- Do not force-fit a pattern if the problem does not exhibit the specific forces the pattern was designed to resolve.

## Remember

- Identify what varies in your system to pinpoint the appropriate pattern category.
- Patterns are solutions to specific design pressures, not universal quality badges.
- When code has no design friction, plain functions and simple classes are always preferred.
