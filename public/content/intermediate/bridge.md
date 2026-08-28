---
id: lesson-09
slug: bridge
title: "Bridge"
level: intermediate
order: 9
duration: 16
tags:
  - structural
  - bridge
  - abstraction
  - composition
  - gof
summary: "The Bridge pattern — split an abstraction from its implementation so the two can vary independently through composition, avoiding the combinatorial explosion of subclasses you'd get by combining every variant with inheritance."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Bridge pattern.
- Spot the **combinatorial explosion** of subclasses it prevents.
- Implement a bridge in TypeScript by **composing** two hierarchies.
- Tell Bridge apart from Adapter.

# Why It Matters

When a design has **two independent dimensions** — say, shapes *and* rendering back-ends, or remotes
*and* devices — combining them with inheritance explodes: `VectorCircle`, `RasterCircle`,
`VectorSquare`, `RasterSquare`… every new shape multiplies by every renderer. **Bridge** turns that
multiplication into addition by letting each dimension live in its own hierarchy, connected by
composition.

# Concept Explanation

### Intent

> **Decouple an abstraction from its implementation so that the two can vary independently.** — Gang of
> Four

### The two hierarchies

- **Abstraction** — the high-level control the client uses (e.g. `Remote`). It **holds** an
  Implementation and delegates the low-level work to it.
- **Refined Abstraction** — a variant of the abstraction (`AdvancedRemote`).
- **Implementation (Implementor)** — the interface for the low-level part (`Device`).
- **Concrete Implementation** — a specific back-end (`TV`, `Radio`).

The "bridge" is the **composition link** from Abstraction to Implementation:

```text
   Remote ───has-a───▶ Device (interface)
     △                     △
 AdvancedRemote        ┌───┴───┐
                       TV     Radio
```

### In TypeScript

```typescript
// Implementation side — the "how".
interface Device {
  isEnabled(): boolean;
  enable(): void;
  setVolume(percent: number): void;
}

class TV implements Device {
  private on = false; private volume = 30;
  isEnabled() { return this.on; }
  enable() { this.on = true; }
  setVolume(p: number) { this.volume = Math.max(0, Math.min(100, p)); }
}
class Radio implements Device { /* ...same interface, different guts... */
  private on = false; private volume = 20;
  isEnabled() { return this.on; }
  enable() { this.on = true; }
  setVolume(p: number) { this.volume = p; }
}

// Abstraction side — the "what". Holds a Device and delegates.
class Remote {
  constructor(protected device: Device) {}
  togglePower() { this.device.enable(); }
  volumeUp() { /* read + setVolume on the device */ }
}

// A refined abstraction adds features without touching Device.
class AdvancedRemote extends Remote {
  mute() { this.device.setVolume(0); }
}

new AdvancedRemote(new TV());   // any remote works with any device
new Remote(new Radio());
```

Add a new device? One class on the implementation side. Add a new remote? One class on the abstraction
side. They never multiply.

### Bridge vs Adapter

- **Adapter** makes two **existing, incompatible** interfaces work together *after the fact* — it's
  reactive.
- **Bridge** is designed **up front** to keep two dimensions independent so both can grow.

### Consequences

- **Good:** the two hierarchies vary independently (no explosion); you can switch implementations at
  runtime; abstraction and implementation details are decoupled.
- **Cost:** more indirection and interfaces up front; overkill if you truly have only one dimension of
  change.

# Key Terminology

- **Abstraction** — the high-level side that holds and delegates to an implementation.
- **Implementation (Implementor)** — the interface for the low-level side.
- **Bridge** — the composition link between the two hierarchies.
- **Combinatorial explosion** — the multiplication of subclasses when two dimensions are combined via
  inheritance.

# Options and Trade-offs

| Concern | Bridge (two hierarchies) | One big inheritance tree | How to choose |
| ------- | ------------------------ | ------------------------ | ------------- |
| Two independent dimensions | Add classes linearly | Multiply subclasses | Bridge when both dimensions grow. |
| Runtime switching | Swap the implementation object | Fixed at compile time | Bridge to change back-ends at runtime. |
| Simplicity | More interfaces | Fewer, until it explodes | Skip Bridge if there's only one dimension. |

# Worked Example

Shapes rendered by different graphics APIs — two dimensions kept apart:

```typescript
interface Renderer { drawCircle(r: number): string; } // implementation
class VectorRenderer implements Renderer { drawCircle(r: number) { return `vector circle r=${r}`; } }
class RasterRenderer implements Renderer { drawCircle(r: number) { return `pixels circle r=${r}`; } }

abstract class Shape { constructor(protected renderer: Renderer) {} abstract draw(): string; } // abstraction
class Circle extends Shape {
  constructor(renderer: Renderer, private radius: number) { super(renderer); }
  draw() { return this.renderer.drawCircle(this.radius); }
}

new Circle(new VectorRenderer(), 5).draw();
new Circle(new RasterRenderer(), 5).draw();
```

Two shapes × two renderers would need four subclasses with inheritance. With Bridge it's `2 + 2`.

# Real World Analogy

Bridge is like the split between a **TV set and its remote**, or a **wall switch and the light it
controls**. Any remote can operate any TV because they meet at a standard interface. The remotes evolve
(add buttons) and the TVs evolve (bigger screens) independently — neither hierarchy forces changes on
the other.

# Examples

## Example 1 — Basic: any remote, any device

`new AdvancedRemote(new TV())` and `new Remote(new Radio())` mix and match freely because the remote
only depends on the `Device` interface.

**Why this works:** the abstraction holds an implementation *interface*, not a concrete device.

## Example 2 — Real-world: cross-platform back-ends

A messaging abstraction (`Notification`, `UrgentNotification`) can sit over swappable implementations
(`EmailChannel`, `SmsChannel`). New notification types and new channels each grow their own side.

**Why this works:** message *policy* and delivery *mechanism* are genuinely independent, so Bridge maps
the design perfectly.

## Example 3 — Pitfall: a bridge with only one dimension

If there's only ever one implementation, the extra interface and delegation buy nothing — you added a
bridge to nowhere.

**Why this bites:** Bridge pays off when **both** sides vary; with one fixed side it's pure overhead.

# Common Mistakes

- **Confusing Bridge with Adapter.** Bridge is planned up front; Adapter reconciles existing
  mismatches.
- **Using Bridge with a single implementation.** No second dimension means no benefit.
- **Letting the abstraction depend on a concrete implementation** instead of the implementor interface.

# Best Practices

- Reach for Bridge when you can name **two independent axes of change**.
- Keep the abstraction depending only on the **implementor interface**.
- Allow the implementation to be **injected** so it can change at runtime.

# Summary

- **Bridge** decouples an abstraction from its implementation so both can vary **independently**.
- It replaces a **combinatorial explosion** of subclasses with two hierarchies joined by
  **composition**.
- The link (the "bridge") lets you swap implementations, even at runtime.
- It's planned up front — unlike **Adapter**, which reconciles interfaces after the fact.

# Flash Cards

Q: What is the intent of the Bridge pattern?
A: Decouple an abstraction from its implementation so that the two can vary independently.

Q: What problem does Bridge prevent?
A: The combinatorial explosion of subclasses that happens when two independent dimensions are combined through inheritance.

Q: What is the "bridge" in the Bridge pattern?
A: The composition link by which the abstraction holds and delegates to an implementation interface.

Q: How does Bridge differ from Adapter?
A: Bridge is designed up front to keep two dimensions independent; Adapter reconciles two existing, incompatible interfaces after the fact.

Q: With two shapes and two renderers, how many classes does Bridge need versus inheritance?
A: Bridge needs 2 + 2 (four classes across two hierarchies); combining them with inheritance needs 2 × 2 = four subclasses that multiply as either side grows.

Q: When is Bridge overkill?
A: When there's really only one dimension of change (e.g. a single implementation) — the extra interface and delegation add no value.

# Exercises

### Easy
Name the abstraction and the implementation in the Remote/Device example, and explain which side you'd
extend to add a `SmartSpeaker` device.

### Medium
Extend the Shape/Renderer example with a `Square` shape and a `SvgRenderer`. Count how many new classes
you wrote, and compare that to the number of subclasses a single inheritance tree would need.

### Challenging
Model a report system with two axes: report *type* (Summary, Detailed) and output *format* (HTML, PDF).
Design it with Bridge, and explain what would have to change to add a third format — versus a design
that subclassed every type×format combination.

# Further Reading

- Gamma et al. — *Design Patterns*, "Bridge".
- Refactoring.Guru — *Bridge*: <https://refactoring.guru/design-patterns/bridge>
- Refactoring.Guru — *Bridge in TypeScript*: <https://refactoring.guru/design-patterns/bridge/typescript/example>
