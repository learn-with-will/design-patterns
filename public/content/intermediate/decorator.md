---
id: lesson-11
slug: decorator
title: "Decorator"
level: intermediate
order: 11
duration: 16
tags:
  - structural
  - decorator
  - wrapper
  - composition
  - gof
summary: "The Decorator pattern — wrap an object to add responsibilities dynamically while keeping the same interface, a flexible alternative to subclassing that lets you stack behaviors, and how it differs from the TypeScript language feature that shares its name."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Decorator pattern.
- Implement stackable decorators in TypeScript that share the component's interface.
- Explain why it's a flexible alternative to **subclassing**.
- Distinguish the GoF Decorator from TypeScript's `@decorator` language feature.

# Why It Matters

You want to add features — logging, caching, a milk-and-sugar add-on — to *some* objects, in
*combinations*, chosen at **runtime**. Subclassing every combination explodes (`LoggedCachedService`,
`CachedService`, …). **Decorator** instead **wraps** an object in another object that shares its
interface and adds a bit of behavior. Wrap again to stack more. Same interface throughout, so the rest
of your code never notices.

# Concept Explanation

### Intent

> **Attach additional responsibilities to an object dynamically. Decorators provide a flexible
> alternative to subclassing for extending functionality.** — Gang of Four

### The participants

- **Component** — the shared interface (`Coffee`).
- **Concrete Component** — the base object being decorated (`Espresso`).
- **Decorator** — implements the Component *and* holds a Component, forwarding calls and adding
  behavior.
- **Concrete Decorator** — a specific add-on (`Milk`, `Sugar`).

```text
   Component (cost, description)
        △
   ┌────┴──────────┐
 Espresso     CoffeeDecorator ──holds──▶ Component
 (concrete)        △
              ┌────┴────┐
            Milk      Sugar
```

### In TypeScript

```typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class Espresso implements Coffee {
  cost() { return 2.0; }
  description() { return "espresso"; }
}

// Base decorator: same interface, wraps another Coffee, forwards by default.
abstract class CoffeeDecorator implements Coffee {
  constructor(protected inner: Coffee) {}
  cost() { return this.inner.cost(); }
  description() { return this.inner.description(); }
}

class Milk extends CoffeeDecorator {
  cost() { return this.inner.cost() + 0.5; }
  description() { return `${this.inner.description()} + milk`; }
}
class Sugar extends CoffeeDecorator {
  cost() { return this.inner.cost() + 0.2; }
  description() { return `${this.inner.description()} + sugar`; }
}

// Stack decorators at runtime.
const order: Coffee = new Sugar(new Milk(new Espresso()));
order.description(); // "espresso + milk + sugar"
order.cost();        // 2.7
```

Because every decorator **is a** `Coffee`, you can wrap in any order and any depth, and callers still
just see a `Coffee`.

### Same interface — that's the key

A Decorator keeps the **same interface** as the thing it wraps and **adds** to its behavior. Contrast:
**Adapter** changes the interface; **Proxy** keeps the interface but **controls access** rather than
adding features; plain **inheritance** fixes behavior at compile time instead of composing it at
runtime.

### GoF Decorator vs TypeScript's `@decorator`

TypeScript/JavaScript has a **language feature** also called "decorators" (`@Component`, `@log`) —
annotations that modify classes or members. It's inspired by the idea but is a **different mechanism**
from the GoF pattern. Don't conflate the wrapping *pattern* with the `@` *syntax*.

### Consequences

- **Good:** add/remove responsibilities at runtime; combine behaviors freely; avoids a subclass per
  combination; each decorator is small and single-purpose (SRP).
- **Cost:** many small wrapper objects; a deep stack is harder to debug; a decorator that forgets to
  forward a call breaks the chain.

# Key Terminology

- **Component** — the shared interface being decorated.
- **Decorator** — a wrapper that implements the Component and holds one, adding behavior.
- **Wrapping / stacking** — nesting decorators so their behaviors combine.
- **Transparent** — decorators keep the same interface, so clients can't tell they're there.

# Options and Trade-offs

| Concern | Decorator | Subclass per combination | How to choose |
| ------- | --------- | ------------------------ | ------------- |
| Combining features | Stack wrappers at runtime | Class per combo (explodes) | Decorator when features combine in many ways. |
| Timing | Runtime | Compile time | Decorator when the choice is dynamic. |
| Debuggability | Deep stacks can be opaque | Flatter | A couple of options may be simpler as flags. |

# Worked Example

Add cross-cutting behavior to a data source without changing it:

```typescript
interface DataSource { read(): string; }
class FileSource implements DataSource { read() { return "raw data"; } }

class UpperCaseDecorator implements DataSource {
  constructor(private inner: DataSource) {}
  read() { return this.inner.read().toUpperCase(); }
}
class LoggingDecorator implements DataSource {
  constructor(private inner: DataSource) {}
  read() { const v = this.inner.read(); console.log("read:", v); return v; }
}

const source: DataSource = new LoggingDecorator(new UpperCaseDecorator(new FileSource()));
source.read(); // logs, and returns "RAW DATA"
```

Reading logic, upper-casing, and logging are three independent decorators you can mix as needed.

# Real World Analogy

Decorator is like **getting dressed**. Your body (the component) is the same underneath; you add a
shirt, then a sweater, then a raincoat (decorators). Each layer adds warmth or waterproofing without
changing that you're still *you*, and you can add or remove layers depending on the weather — at
runtime, in any sensible order.

# Examples

## Example 1 — Basic: stacking add-ons

`new Sugar(new Milk(new Espresso()))` produces "espresso + milk + sugar" at cost 2.7. Each wrapper added
its bit and forwarded the rest.

**Why this works:** every decorator shares the `Coffee` interface, so wrapping composes cleanly.

## Example 2 — Real-world: middleware

Server "middleware" is Decorator in spirit: each layer wraps the request handler to add auth, logging,
or compression, then calls the next. You assemble the stack from small, reusable pieces.

**Why this works:** cross-cutting concerns become independent layers instead of tangled code in one
handler.

## Example 3 — Pitfall: a decorator that forgets to forward

If a decorator overrides `read()` but forgets to call `this.inner.read()`, the wrapped object's
behavior silently vanishes.

**Why this bites:** decorators must forward the calls they don't specifically change, or the chain
breaks.

# Common Mistakes

- **Confusing it with Proxy or Adapter.** Decorator adds behavior with the *same* interface; Proxy
  controls access; Adapter changes the interface.
- **Forgetting to delegate** unmodified calls to the wrapped object.
- **Over-stacking** until the behavior is impossible to follow.

# Best Practices

- Keep each decorator **small and single-purpose**.
- Always **forward** calls you don't intend to change.
- Depend on the **Component interface** so decorators and the base are interchangeable.

# Summary

- **Decorator** wraps an object to **add responsibilities dynamically** while keeping the **same
  interface**.
- It's a flexible alternative to **subclassing** and lets behaviors **stack** in any combination.
- It differs from Adapter (changes interface) and Proxy (controls access) — all keep coming up together.
- Don't confuse the GoF pattern with TypeScript's `@decorator` language feature.

# Flash Cards

Q: What is the intent of the Decorator pattern?
A: Attach additional responsibilities to an object dynamically, providing a flexible alternative to subclassing for extending behavior.

Q: What must a decorator keep the same as the object it wraps?
A: Its interface — a decorator implements the same Component interface, so clients can't tell it's wrapped.

Q: Why is Decorator preferred over subclassing for combining features?
A: Subclassing needs a class per combination (which explodes); decorators stack at runtime in any combination without new subclasses.

Q: How does Decorator differ from Proxy?
A: Both wrap an object with the same interface, but Decorator adds behavior, while Proxy controls access to the object.

Q: What common bug breaks a decorator chain?
A: Overriding a method but forgetting to forward (delegate) to the wrapped object, so its behavior silently disappears.

Q: How is the GoF Decorator different from TypeScript's @decorator syntax?
A: The GoF Decorator is a wrapping design pattern; TypeScript's @decorator is a language feature for annotating classes/members — related in spirit but a different mechanism.

# Exercises

### Easy
Explain why `new Sugar(new Milk(new Espresso()))` costs 2.7, tracing each decorator's contribution.

### Medium
Add a `WhippedCream` decorator (+0.7) and produce an order with espresso, milk, and whipped cream.
Confirm the description and cost, and note that you didn't modify `Espresso` at all.

### Challenging
Implement a `CachingDecorator` for the `DataSource` example that stores the first `read()` result and
returns it on later calls. Explain why forwarding-then-caching keeps the same interface, and one risk of
caching in a decorator.

# Further Reading

- Gamma et al. — *Design Patterns*, "Decorator".
- Refactoring.Guru — *Decorator*: <https://refactoring.guru/design-patterns/decorator>
- Refactoring.Guru — *Decorator in TypeScript*: <https://refactoring.guru/design-patterns/decorator/typescript/example>
