---
id: lesson-12
slug: facade
title: "Facade"
level: intermediate
order: 12
duration: 14
tags:
  - structural
  - facade
  - subsystem
  - simplify
  - gof
summary: "The Facade pattern — put a simple, unified interface in front of a complicated subsystem so clients can do the common thing with one easy call, without hiding the subsystem for those who need its full power."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Facade pattern.
- Build a facade in TypeScript over a multi-class subsystem.
- Explain how it **reduces coupling** without locking away the subsystem.
- Distinguish Facade from Adapter.

# Why It Matters

Powerful subsystems are often complicated: to place an order you must reserve inventory, charge a card,
*then* schedule shipping, in the right order. Making every caller learn that dance couples them to the
subsystem's guts. A **Facade** offers one friendly method — `placeOrder(...)` — that does the common
sequence for you, so callers depend on a simple front door instead of many rooms.

# Concept Explanation

### Intent

> **Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level
> interface that makes the subsystem easier to use.** — Gang of Four

### The participants

- **Facade** — the simplified interface that delegates to the right subsystem classes in the right
  order.
- **Subsystem classes** — the many collaborating classes that do the real work.
- **Client** — talks to the Facade for the common cases.

```text
   Client ──▶ Facade ──┬──▶ Inventory
                       ├──▶ Payment
                       └──▶ Shipping
```

### In TypeScript

```typescript
class Inventory { reserve(item: string) { return true; } }
class Payment { charge(amount: number) { return `charged ${amount}`; } }
class Shipping { schedule(item: string) { return `scheduled ${item}`; } }

// Facade: one method hides the ordering and wiring of three subsystems.
class OrderFacade {
  private inventory = new Inventory();
  private payment = new Payment();
  private shipping = new Shipping();

  placeOrder(item: string, amount: number): string {
    if (!this.inventory.reserve(item)) return "out of stock";
    this.payment.charge(amount);
    return this.shipping.schedule(item);
  }
}

new OrderFacade().placeOrder("book", 20); // one call; the facade does the steps
```

The client no longer needs to know inventory comes before payment comes before shipping — the facade
encodes that.

### It simplifies without imprisoning

A Facade **doesn't remove** the subsystem or forbid using it directly. Advanced callers can still reach
`Payment` for a special case. The facade just provides the **easy path** for the common 90%, reducing
coupling for everyone who takes it.

### Facade vs Adapter

- **Adapter** makes **one** existing object fit a **specific expected** interface (interface
  conversion).
- **Facade** wraps **many** classes behind a **new, simpler** interface of your own design
  (simplification).

### Consequences

- **Good:** decouples clients from a complex subsystem; a single obvious entry point; you can refactor
  the subsystem behind the facade.
- **Cost:** the facade can grow into a **god object** if it accumulates every feature; it may hide
  capabilities callers occasionally need.

# Key Terminology

- **Facade** — a simplified, higher-level interface over a subsystem.
- **Subsystem** — the set of collaborating classes doing the real work.
- **Coupling** — how much one part depends on the internals of another; Facade lowers it.
- **God object** — an object that does too much; the risk if a facade over-grows.

# Options and Trade-offs

| Concern | Facade | Call subsystem directly | How to choose |
| ------- | ------ | ----------------------- | ------------- |
| Common workflow | One simple method | Repeat the steps everywhere | Facade for the frequent path. |
| Rare/advanced case | Bypass the facade | Full control | Keep the subsystem reachable for edge cases. |
| Risk | Facade may bloat | Callers tightly coupled | Keep the facade focused on common tasks. |

# Worked Example

A media player facade hides codec details behind one `play` call:

```typescript
class FileLoader { load(path: string) { return `bytes of ${path}`; } }
class Decoder { decode(bytes: string) { return `frames from ${bytes}`; } }
class Speaker { output(frames: string) { return `playing ${frames}`; } }

class MediaFacade {
  private loader = new FileLoader();
  private decoder = new Decoder();
  private speaker = new Speaker();
  play(path: string): string {
    return this.speaker.output(this.decoder.decode(this.loader.load(path)));
  }
}

new MediaFacade().play("song.mp3"); // load → decode → output, in one call
```

# Real World Analogy

A Facade is like the **front desk of a hotel**. You ask the concierge for a taxi, a dinner reservation,
and a wake-up call, and they coordinate housekeeping, the kitchen, and the switchboard behind the
scenes. You *could* call each department yourself, but the front desk is the simple, unified interface
you actually use.

# Examples

## Example 1 — Basic: one call, three subsystems

`OrderFacade.placeOrder("book", 20)` runs reserve → charge → schedule in order. The client wrote one
line and stayed ignorant of the sequence.

**Why this works:** the workflow's complexity lives in the facade, not in every caller.

## Example 2 — Real-world: an SDK entry point

Client libraries often ship a facade — a single `Client` class whose easy methods wrap authentication,
retries, serialization, and transport. Beginners use the facade; experts can drop to the lower layers.

**Why this works:** the common case is one call; the full power is still there when needed.

## Example 3 — Pitfall: the facade becomes a god object

If every new feature gets bolted onto the facade, it swells into a 3,000-line class that knows about
everything — the very complexity it was meant to hide, relocated.

**Why this bites:** a facade should stay a **thin, focused** entry point, not absorb the whole system.

# Common Mistakes

- **Confusing Facade with Adapter.** Facade simplifies many classes; Adapter converts one interface to
  another.
- **Letting the facade grow unbounded** into a god object.
- **Forbidding direct subsystem access** when advanced callers legitimately need it.

# Best Practices

- Keep the facade **focused** on the common workflows.
- Let clients **bypass** it for rare, advanced needs.
- Use it to **decouple** client code from a subsystem you expect to refactor.

# Summary

- **Facade** provides a **simple, unified interface** over a complex subsystem.
- It **reduces coupling** by giving clients one entry point — without hiding the subsystem entirely.
- It differs from **Adapter** (interface conversion of one object) by **simplifying many** classes
  behind a new interface.
- Watch that it doesn't swell into a **god object**.

# Flash Cards

Q: What is the intent of the Facade pattern?
A: Provide a unified, higher-level interface to a set of interfaces in a subsystem, making the subsystem easier to use.

Q: Does a Facade prevent using the subsystem directly?
A: No — it provides an easy path for common tasks but leaves the subsystem reachable for advanced or rare needs.

Q: How does Facade differ from Adapter?
A: Adapter converts one object's interface into a specific expected interface; Facade wraps many classes behind a new, simpler interface of your own design.

Q: What is the main benefit of a Facade?
A: It reduces coupling between client code and a complex subsystem by giving clients a single simple entry point.

Q: What is the main risk of a Facade?
A: It can grow into a god object that accumulates too many responsibilities, relocating the very complexity it was meant to hide.

Q: In the order example, what does placeOrder() encode that clients no longer need to know?
A: The correct sequence and wiring — reserve inventory, then charge payment, then schedule shipping.

# Exercises

### Easy
List the subsystem classes hidden by `OrderFacade`, and state the one workflow its `placeOrder` method
encodes.

### Medium
Add a `cancelOrder(item)` method to `OrderFacade` that releases inventory and refunds payment. Keep the
facade thin — note what logic belongs in the subsystems versus the facade.

### Challenging
Take a subsystem you know (e.g. sending an email: template rendering, SMTP connection, retry logic) and
design a facade with one `send(to, subject, data)` method. Explain how you'd still allow an advanced
caller to control retries directly.

# Further Reading

- Gamma et al. — *Design Patterns*, "Facade".
- Refactoring.Guru — *Facade*: <https://refactoring.guru/design-patterns/facade>
- Refactoring.Guru — *Facade in TypeScript*: <https://refactoring.guru/design-patterns/facade/typescript/example>
