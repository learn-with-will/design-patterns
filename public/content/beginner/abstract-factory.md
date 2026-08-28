---
id: lesson-04
slug: abstract-factory
title: "Abstract Factory"
level: beginner
order: 4
duration: 17
tags:
  - creational
  - factory
  - families
  - composition
  - gof
summary: "The Abstract Factory pattern — provide an interface for creating whole families of related objects without naming their concrete classes, so an entire set of products can be swapped consistently, and how it differs from Factory Method."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of Abstract Factory and what a "family" of products means.
- Implement it in TypeScript with a factory interface and concrete factories.
- Explain how it keeps a set of products **consistent**.
- Clearly distinguish **Abstract Factory** from **Factory Method**.

# Why It Matters

Sometimes objects come in **matched sets**. A "light theme" needs a light button *and* a light
checkbox *and* a light menu — mixing a light button with a dark checkbox looks broken. **Abstract
Factory** creates a whole family of related products through one factory object, so you can switch the
entire set at once and never accidentally mix incompatible pieces.

# Concept Explanation

### Intent

> **Provide an interface for creating families of related or dependent objects without specifying
> their concrete classes.** — Gang of Four

### The participants

- **Abstract Factory** — the interface with one creation method per product (`createButton`,
  `createCheckbox`).
- **Concrete Factory** — implements those methods to produce one consistent family (`LightFactory`).
- **Abstract Product** — the interface for each kind of product (`Button`, `Checkbox`).
- **Concrete Product** — a family-specific implementation (`LightButton`, `DarkCheckbox`).
- **Client** — uses only the abstract factory and abstract products; it never names a concrete class.

```text
        UIFactory (abstract)              Button        Checkbox
   + createButton(): Button              (abstract)     (abstract)
   + createCheckbox(): Checkbox              △              △
        △                              ┌────┴───┐     ┌────┴────┐
   ┌────┴─────┐                    LightButton  Dark  LightCheck Dark
 LightFactory DarkFactory
```

### In TypeScript

```typescript
interface Button { render(): string; }
interface Checkbox { render(): string; }

// A factory that makes a whole matched family of widgets.
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class LightButton implements Button { render() { return "[ Light Button ]"; } }
class LightCheckbox implements Checkbox { render() { return "[x] light"; } }
class DarkButton implements Button { render() { return "( Dark Button )"; } }
class DarkCheckbox implements Checkbox { render() { return "(x) dark"; } }

class LightFactory implements UIFactory {
  createButton() { return new LightButton(); }
  createCheckbox() { return new LightCheckbox(); }
}
class DarkFactory implements UIFactory {
  createButton() { return new DarkButton(); }
  createCheckbox() { return new DarkCheckbox(); }
}

// The client works with the interfaces only — swap the factory, swap the whole theme.
function renderForm(factory: UIFactory): string {
  return `${factory.createButton().render()} ${factory.createCheckbox().render()}`;
}

renderForm(new LightFactory()); // [ Light Button ] [x] light
renderForm(new DarkFactory());  // ( Dark Button ) (x) dark
```

Because `renderForm` only ever holds a `UIFactory`, it's impossible to mix a light button with a dark
checkbox — the factory guarantees a consistent set.

### Abstract Factory vs Factory Method

This is the most-confused pair in the catalog. Keep it straight:

- **Factory Method** creates **one** product and varies it through **inheritance** (override a method
  in a subclass).
- **Abstract Factory** creates a **family of related** products and varies it through **composition**
  (you hold a factory object and call its methods). An Abstract Factory is often *implemented using*
  several Factory Methods.

### Consequences

- **Good:** guarantees product families stay consistent; isolates concrete classes; swapping the whole
  family is a one-line change (pass a different factory).
- **Cost:** adding a **new kind of product** to the family means changing the factory interface and
  *every* concrete factory — so it's rigid if the *set* of products changes often.

# Key Terminology

- **Abstract Factory** — an interface for creating a family of related products.
- **Family of products** — a set of objects meant to be used together (a theme, a platform's widgets).
- **Concrete Factory** — produces one specific, internally consistent family.
- **Client** — depends only on the abstract factory and abstract products.

# Options and Trade-offs

| Concern | Abstract Factory | Factory Method | How to choose |
| ------- | ---------------- | -------------- | ------------- |
| What it creates | A **family** of related products | A **single** product | Family that must stay consistent → Abstract Factory. |
| Mechanism | **Composition** (hold a factory) | **Inheritance** (override a method) | Prefer composition when you swap sets at runtime. |
| Adding a product *kind* | Change the factory interface + all factories | Just a new subclass | Abstract Factory is costly when the product set grows. |

# Worked Example

A cross-platform app needs matching widgets per operating system:

```typescript
interface Widget { paint(): string; }

interface OSFactory {
  button(): Widget;
  scrollbar(): Widget;
}

class MacFactory implements OSFactory {
  button() { return { paint: () => "🍎 button" }; }
  scrollbar() { return { paint: () => "🍎 scrollbar" }; }
}
class WinFactory implements OSFactory {
  button() { return { paint: () => "🪟 button" }; }
  scrollbar() { return { paint: () => "🪟 scrollbar" }; }
}

function draw(f: OSFactory) {
  return [f.button().paint(), f.scrollbar().paint()].join(" + ");
}
```

Pick `MacFactory` or `WinFactory` **once**, and every widget the app draws matches that platform.

# Real World Analogy

Abstract Factory is like buying **furniture in a collection**. If you choose the "Victorian" line, the
sofa, chair, and coffee table all match. Choosing "Modern" instead swaps the whole set — and you can't
end up with a Victorian sofa next to a Modern table, because the collection (the factory) only hands
out pieces that go together.

# Examples

## Example 1 — Basic: swapping a theme

`renderForm(new DarkFactory())` produces an all-dark form; `new LightFactory()` an all-light one. The
client code is identical — only the factory changed.

**Why this works:** one object (the factory) decides the whole family, so the set stays coherent.

## Example 2 — Real-world: database drivers

An app that must support PostgreSQL and MySQL can use an Abstract Factory that produces a matching
`Connection`, `Command`, and `Transaction` for the chosen database — never a Postgres connection paired
with a MySQL command.

**Why this works:** related objects that must cooperate are produced together, guaranteeing
compatibility.

## Example 3 — Pitfall: an ever-growing product set

If you frequently add *new kinds* of product (today buttons and checkboxes; tomorrow menus, sliders,
tooltips…), every concrete factory must be edited each time. The pattern resists that kind of change.

**Why this bites:** Abstract Factory is stable when the *families* vary but the *set of product kinds*
is fixed — and rigid when the opposite is true.

# Common Mistakes

- **Calling any factory an "Abstract Factory."** It's only Abstract Factory if it creates a **family**
  of related products.
- **Confusing it with Factory Method** (one product, inheritance).
- **Using it when products aren't actually related** — then a set of separate factory functions is
  simpler.

# Best Practices

- Reach for it when products **must be used together** and mixing them would be a bug.
- Keep the **set of product kinds stable**; let the *families* be what varies.
- Have the client depend only on the **abstract** factory and products.

# Summary

- **Abstract Factory** creates **families of related objects** through one factory object, keeping the
  set consistent.
- Participants: **Abstract Factory**, **Concrete Factory**, **Abstract Product**, **Concrete Product**,
  **Client**.
- It varies products through **composition** — contrast with Factory Method's **inheritance** and
  single product.
- It's ideal when families vary but rigid when you keep adding new *kinds* of product.

# Flash Cards

Q: What is the intent of the Abstract Factory pattern?
A: Provide an interface for creating families of related or dependent objects without specifying their concrete classes.

Q: How does Abstract Factory differ from Factory Method?
A: Abstract Factory creates a family of related products via composition (you hold a factory object); Factory Method creates a single product via inheritance (override a method in a subclass).

Q: What guarantee does Abstract Factory give about the objects it produces?
A: That they belong to one consistent family and can be used together — you can't accidentally mix products from different families.

Q: What is the main weakness of Abstract Factory?
A: Adding a new KIND of product forces you to change the factory interface and every concrete factory.

Q: In the theme example, what does the client (renderForm) depend on?
A: Only the abstract UIFactory and the abstract Button/Checkbox interfaces — never a concrete product class.

Q: An Abstract Factory is often implemented using several of which other pattern?
A: Factory Methods — one factory method per product kind inside each concrete factory.

# Exercises

### Easy
In one sentence each, define "family of products" and explain why Abstract Factory prevents mixing
products from different families.

### Medium
Add a third theme (`HighContrastFactory`) to the light/dark example. Note that `renderForm` doesn't
change — but also note what you'd have to touch if you added a new product kind (`createMenu`).

### Challenging
Take the Factory Method Logistics example from the previous lesson and argue whether it should be an
Abstract Factory. Decide based on whether it creates a *single* product or a *family*, and justify your
answer.

# Further Reading

- Gamma et al. — *Design Patterns*, "Abstract Factory".
- Refactoring.Guru — *Abstract Factory*: <https://refactoring.guru/design-patterns/abstract-factory>
- Refactoring.Guru — *Factory comparison*: <https://refactoring.guru/design-patterns/factory-comparison>
