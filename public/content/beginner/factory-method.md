---
id: lesson-03
slug: factory-method
title: "Factory Method"
level: beginner
order: 3
duration: 16
tags:
  - creational
  - factory
  - inheritance
  - gof
  - decoupling
summary: "The Factory Method pattern — define a method for creating an object but let subclasses decide which concrete class to instantiate, so the code that uses a product is decoupled from the code that creates it."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Factory Method pattern.
- Identify its **participants** (creator, product, and their concrete subclasses).
- Implement Factory Method in TypeScript with an abstract creator.
- Explain how it supports the **Open/Closed Principle** — and when it's overkill.

# Why It Matters

Calling `new ConcreteClass()` everywhere quietly hard-wires your code to that exact class. The day you
need a different variant, you're hunting down every `new` and editing it. **Factory Method** removes
that coupling: it puts object creation behind a method that **subclasses override**, so the code that
*uses* an object doesn't need to know which concrete class it got.

# Concept Explanation

### Intent

> **Define an interface for creating an object, but let subclasses decide which class to instantiate.
> Factory Method lets a class defer instantiation to subclasses.** — Gang of Four

### The participants

- **Product** — the interface of the objects the factory creates (`Transport`).
- **Concrete Product** — a specific implementation (`Truck`, `Ship`).
- **Creator** — declares the **factory method** returning a Product, and usually contains the
  higher-level code that *uses* the product.
- **Concrete Creator** — overrides the factory method to return a particular Concrete Product.

```text
        Creator                       Product
   + createTransport()  ───creates──▶ (interface)
   + planDelivery()                       △
        △                          ┌──────┴──────┐
   ┌────┴─────┐                  Truck          Ship
 RoadLogistics SeaLogistics
```

### In TypeScript

```typescript
interface Transport {
  deliver(): string;
}

class Truck implements Transport {
  deliver() { return "by road in a box"; }
}
class Ship implements Transport {
  deliver() { return "by sea in a container"; }
}

abstract class Logistics {
  // The factory method: subclasses decide the concrete product.
  abstract createTransport(): Transport;

  // Higher-level code that works only with the Product interface.
  planDelivery(): string {
    const transport = this.createTransport();
    return `Delivering ${transport.deliver()}`;
  }
}

class RoadLogistics extends Logistics {
  createTransport() { return new Truck(); }
}
class SeaLogistics extends Logistics {
  createTransport() { return new Ship(); }
}

console.log(new RoadLogistics().planDelivery()); // Delivering by road in a box
console.log(new SeaLogistics().planDelivery());  // Delivering by sea in a container
```

`planDelivery()` never mentions `Truck` or `Ship`. A new transport (say `Drone`) is a new subclass —
nothing existing changes.

### When to use it

Use Factory Method when a class **can't anticipate** the class of objects it must create, or when you
want subclasses to specify those objects. It's a good fit when creation logic would otherwise be a
growing `if/switch` on a "type" flag.

### Consequences

- **Good:** removes coupling between creator and concrete products; honors OCP (new products = new
  subclasses); puts creation in one place.
- **Cost:** you may end up creating a subclass just to change the product — extra classes for a small
  gain. In TypeScript you can often pass a factory *function* instead of subclassing.

# Key Terminology

- **Factory Method** — a method, overridden by subclasses, that returns a product.
- **Product** — the interface the created objects share.
- **Creator / Concrete Creator** — the base class declaring the factory method / the subclass that
  implements it.
- **Deferring instantiation** — letting a subclass decide the concrete class to create.

# Options and Trade-offs

| Concern | Factory Method | Plain `new` in place | How to choose |
| ------- | -------------- | -------------------- | ------------- |
| Coupling | Caller depends on the Product interface | Caller depends on a concrete class | Use the pattern when more than one product variant is likely. |
| Adding a variant | New subclass, no edits | Edit each `new` / `switch` | Factory Method when variants keep appearing. |
| Simplicity | More classes | Fewest classes | Just `new` it when there's one obvious class and no variation. |

# Worked Example

A cross-platform dialog renders a button, but *which* button depends on the platform:

```typescript
interface Button { render(): string; }
class WebButton implements Button { render() { return "<button>OK</button>"; } }
class NativeButton implements Button { render() { return "[ OK ]"; } }

abstract class Dialog {
  abstract createButton(): Button;      // factory method
  renderOkDialog(): string {
    return `Dialog: ${this.createButton().render()}`;
  }
}

class WebDialog extends Dialog { createButton() { return new WebButton(); } }
class NativeDialog extends Dialog { createButton() { return new NativeButton(); } }
```

`renderOkDialog()` is shared by every platform; only the one line that *creates* the button varies, and
that variation lives in a subclass.

# Real World Analogy

Think of a **hiring manager** who follows the same interview process for every role but delegates *who
to hire* to the specialist team. The process (`planDelivery` / `renderOkDialog`) is fixed; the concrete
choice (a backend engineer vs a designer) is decided by the team that specializes in that role. The
manager doesn't need to know the details of each specialty.

# Examples

## Example 1 — Basic: one factory method, two products

`RoadLogistics` and `SeaLogistics` share all of `planDelivery()` and differ only in `createTransport()`.
That single overridden method is the entire pattern.

**Why this works:** the varying decision (which product) is isolated to one small method.

## Example 2 — Real-world: a factory *function* in TypeScript

Because functions are first-class in TS, you often skip the subclass entirely:

```typescript
type TransportFactory = () => Transport;
function planDelivery(create: TransportFactory) {
  return `Delivering ${create().deliver()}`;
}
planDelivery(() => new Truck());
```

**Why this works:** the *intent* (defer creation to the caller) is met with far less ceremony — a
reminder that patterns adapt to the language.

## Example 3 — Pitfall: subclass explosion

If you add a subclass for every tiny creation tweak, you get dozens of near-empty creators. That's the
pattern's cost with none of its benefit.

**Why this bites:** Factory Method earns its keep when the *product* varies meaningfully — not for a
one-line difference a parameter could handle.

# Common Mistakes

- **Confusing it with Abstract Factory.** Factory Method creates **one** product via inheritance; the
  next lesson's Abstract Factory creates **families** via composition.
- **Using it for a single, fixed product.** If there's only ever one class, just `new` it.
- **Putting business logic in the factory method.** Keep it focused on *creating* the product.

# Best Practices

- Return the **Product interface**, never a concrete type, so callers stay decoupled.
- Consider a **factory function** in TypeScript before adding a whole subclass hierarchy.
- Give the method a name that says what it makes (`createTransport`), not `factory()`.

# Summary

- **Factory Method** defines a method for creating a product and lets **subclasses** choose the
  concrete class.
- Participants: **Product**, **Concrete Product**, **Creator**, **Concrete Creator**.
- It decouples the code that *uses* an object from the code that *creates* it, supporting **OCP**.
- It creates **one** product through **inheritance** — contrast with Abstract Factory (families,
  composition) next.

# Flash Cards

Q: What is the intent of the Factory Method pattern?
A: Define a method for creating an object but let subclasses decide which concrete class to instantiate — deferring instantiation to subclasses.

Q: Which OOP mechanism does Factory Method use to vary the product?
A: Inheritance — a subclass overrides the factory method to return a specific concrete product.

Q: Name the four participants in Factory Method.
A: Product (interface), Concrete Product, Creator (declares the factory method), and Concrete Creator (overrides it).

Q: How does Factory Method support the Open/Closed Principle?
A: Adding a new product means adding a new subclass; the existing creator and the code that uses the product don't change.

Q: In TypeScript, what lighter alternative often replaces a Factory Method subclass?
A: Passing a factory function (a first-class function that returns the product), since functions can carry the creation decision without a new class.

Q: What is the main cost of Factory Method?
A: It can multiply subclasses — you may create a subclass just to change one product, which is overkill when a parameter would do.

# Exercises

### Easy
List the four participants of Factory Method and, for the Logistics example, say which concrete class
plays each role.

### Medium
Add a `Drone` transport and an `AirLogistics` creator to the Logistics example. Confirm that
`planDelivery()` needs no changes, and explain why.

### Challenging
Rewrite the Logistics example using a **factory function** instead of subclasses (as in Example 2).
Then write one sentence on when the subclass version is still worth the extra ceremony.

# Further Reading

- Gamma et al. — *Design Patterns*, "Factory Method".
- Refactoring.Guru — *Factory Method*: <https://refactoring.guru/design-patterns/factory-method>
- Refactoring.Guru — *Factory Method in TypeScript*: <https://refactoring.guru/design-patterns/factory-method/typescript/example>
