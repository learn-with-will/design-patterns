---
id: lesson-01
slug: what-are-design-patterns
title: "What Are Design Patterns?"
level: beginner
order: 1
duration: 16
tags:
  - foundations
  - gof
  - oop
  - uml
  - overview
summary: "What a design pattern is (a named, reusable solution to a recurring design problem) and what it isn't, where the idea came from, the three Gang of Four categories, a quick UML primer, the two guiding principles, and an honest look at when a pattern helps versus when it's just over-engineering."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain a **design pattern** in plain language — and say what it is *not*.
- Recount where the idea came from: **Christopher Alexander** and the **Gang of Four**.
- Name the **three categories** of patterns and what each one is about.
- Read a basic **UML class diagram** and state the two guiding design principles.
- Judge, honestly, **when a pattern helps** and when it is just extra complexity.

# Why It Matters

Every programmer eventually re-solves the same design problems: "how do I create this object without
hard-wiring its class?", "how do I add a feature without rewriting what already works?", "how do I let
these objects talk without tangling them together?". Long ago, experienced developers noticed that the
*good* answers repeat. A **design pattern** captures one of those repeatable answers and gives it a
name.

That naming is the real payoff. When a teammate says *"let's make this a Strategy"*, a whole design —
its shape, its trade-offs, its pitfalls — arrives in one word. Patterns are a **shared vocabulary**
for talking about design, plus a catalog of solutions you don't have to reinvent.

# Concept Explanation

### What a design pattern is

A **design pattern** is a **named, general, reusable solution to a commonly occurring problem** in
software design. It is a *description* of how to arrange classes and objects to solve that problem —
not code you copy, and not a library you install.

The Gang of Four describe every pattern with four essential parts:

- **Name** — the word the team can say (e.g. "Observer").
- **Problem** — when to apply it; the situation and its forces.
- **Solution** — the arrangement of classes/objects, their roles, and how they collaborate.
- **Consequences** — the results and trade-offs (patterns always cost *something*).

### What a design pattern is not

- **Not copy-paste code.** A pattern is a template you *adapt* to your situation; two uses look
  different in the details.
- **Not a finished design.** It solves one sub-problem inside a larger design.
- **Not a rule you must apply.** Reaching for a pattern where a plain function would do makes code
  *worse*, not better.
- **Not an algorithm.** An algorithm (like quicksort) computes a result; a pattern arranges
  responsibilities.

### Where the idea came from

The word "pattern" was borrowed from **building architecture**. Architect **Christopher Alexander**,
in *A Pattern Language* (1977), described recurring solutions to design problems in towns and
buildings. In 1994, four authors — **Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides**,
nicknamed the **"Gang of Four" (GoF)** — adapted the idea to software in *Design Patterns: Elements of
Reusable Object-Oriented Software*. That book cataloged **23 patterns**, and it is still the reference
today.

### The three categories

GoF sorts the 23 patterns into three groups by *what they help you do*:

- **Creational** — about **object creation**: making the process of *getting* an object flexible
  (Factory Method, Abstract Factory, Builder, Prototype, Singleton).
- **Structural** — about **composition**: assembling classes and objects into larger structures
  (Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy).
- **Behavioral** — about **communication**: how objects interact and share responsibility (Chain of
  Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy,
  Template Method, Visitor).

### Two principles behind almost every pattern

The GoF book distills two guiding principles that most patterns follow:

1. **Program to an interface, not an implementation.** Depend on *what* an object can do (its
   interface), not *how* it does it (its concrete class). This lets you swap implementations freely.
2. **Favor object composition over class inheritance.** Building behavior by *combining* objects is
   usually more flexible than locking it into a deep inheritance tree.

Here is the first principle in TypeScript — `checkout` depends on the `PaymentMethod` *interface*, so
new payment methods need no change to it:

```typescript
interface PaymentMethod {
  pay(amount: number): void;
}

class CreditCard implements PaymentMethod {
  pay(amount: number) {
    console.log(`Paid ${amount} by credit card`);
  }
}

class PayPal implements PaymentMethod {
  pay(amount: number) {
    console.log(`Paid ${amount} via PayPal`);
  }
}

// Works with ANY PaymentMethod — adding a new one doesn't touch this function.
function checkout(method: PaymentMethod, amount: number) {
  method.pay(amount);
}
```

### A quick UML primer

Patterns are often drawn as **UML class diagrams**. You only need a few symbols to read them:

```text
        <<interface>>
        PaymentMethod          A box is a class or interface.
        + pay(amount)          "+" means public.
             △                 A hollow triangle points at the
             ┊  (implements)   thing being implemented/inherited.
     ┌───────┴────────┐
 CreditCard         PayPal      CreditCard and PayPal implement PaymentMethod.
```

Common relationships: **inheritance/implementation** (hollow triangle), **association** (a plain
line — "knows about"), **aggregation** (hollow diamond — "has, but parts can live on their own"), and
**composition** (filled diamond — "owns; parts die with the whole").

# Key Terminology

- **Design pattern** — a named, reusable solution to a recurring design problem.
- **Gang of Four (GoF)** — Gamma, Helm, Johnson & Vlissides, authors of the 1994 catalog of 23
  patterns.
- **Creational / Structural / Behavioral** — the three GoF categories (creation, composition,
  communication).
- **Interface** — a contract describing *what* an object can do, with no implementation.
- **UML** — Unified Modeling Language, a standard notation for diagramming classes and objects.
- **Over-engineering** — adding flexibility or structure the problem does not (yet) need.

# Options and Trade-offs

| Decision | Option A | Option B | How to choose |
| -------- | -------- | -------- | ------------- |
| Reaching for a pattern | Apply a pattern up front | Write the simple code first | Prefer the simple code; introduce a pattern when a *real*, recurring pressure appears. |
| Reuse strategy | Inheritance | Composition | Favor composition; use inheritance only for genuine "is-a" relationships. |
| Depending on a type | A concrete class | An interface | Depend on an interface when you expect more than one implementation or want to test in isolation. |

# Worked Example

Suppose two teammates describe the same idea:

```text
Without a pattern name:
  "Let's make an interface with one method, put each sorting rule in its own class
   that implements it, and let the caller pass whichever one it wants at runtime."

With a pattern name:
  "Let's use the Strategy pattern for the sort order."
```

Both describe the *same design*. The second sentence is shorter, unambiguous, and instantly tells the
listener the trade-offs (interchangeable algorithms, one extra class each). That compression — a whole
design in one shared word — is what patterns buy you.

# Real World Analogy

Design patterns are like **chess openings**. A beginner calculates every move from scratch; a stronger
player recognizes "this is a Sicilian Defense" and instantly knows the plans, strengths, and traps
that come with it. The opening isn't a script that wins the game — you still adapt to your opponent —
but the *name* carries hard-won experience. Patterns do the same for code.

# Examples

## Example 1 — Basic: program to an interface

In the `checkout` code above, the function never mentions `CreditCard` or `PayPal`. It only knows
`PaymentMethod`. Adding Apple Pay means writing one new class — `checkout`, and everything that calls
it, stays exactly the same.

**Why this works:** depending on the *contract* instead of a concrete class is the seed of most
patterns (and of the SOLID principles in the next lesson).

## Example 2 — Real-world: a shared vocabulary on a team

A new developer joins and reads: *"The notification system uses Observer; the export uses a Factory
Method."* Before opening a single file, they already expect a subject with subscribers, and a method
that subclasses override to choose a product. The patterns act as a **map** of the codebase.

**Why this works:** patterns document *intent*. The names tell you why the code is shaped the way it
is.

## Example 3 — Pitfall: a pattern for its own sake

A junior developer wraps a one-line configuration read in an Abstract Factory, three interfaces, and a
Singleton — "to be enterprise-ready." Six months later nobody can find where a value is set. The
"flexibility" was never used; it only added indirection.

**Why this bites:** patterns have a **cost** (more classes, more indirection). Paying it with no
matching benefit is **over-engineering** — the exact opposite of good design.

# Common Mistakes

- **Applying patterns everywhere.** A pattern is a tool for a specific problem, not a quality badge.
- **Confusing a pattern with copy-pasted code.** You adapt patterns; you don't clone them verbatim.
- **Starting from a pattern instead of the problem.** Understand the forces first; the pattern comes
  second.
- **Forgetting the consequences.** Every pattern trades something (usually simplicity) for something
  else (usually flexibility).

# Best Practices

- Learn each pattern's **intent** first — the *why* matters more than the class diagram.
- Prefer the **simplest thing that works**; let patterns emerge during **refactoring**.
- Use the **names** in code review and comments — they document design cheaply.
- Remember the two principles: **program to an interface** and **favor composition**.

# Summary

- A **design pattern** is a named, reusable solution to a recurring design problem — described by its
  name, problem, solution, and consequences.
- The idea came from architect **Christopher Alexander** and was brought to software by the **Gang of
  Four** in 1994, cataloging **23 patterns**.
- Patterns fall into three categories: **creational** (creation), **structural** (composition), and
  **behavioral** (communication).
- Two principles run through them: **program to an interface** and **favor composition over
  inheritance**.
- Patterns cost something. Use them when a real problem calls for one — not as decoration.

# Flash Cards

Q: In one sentence, what is a design pattern?
A: A named, general, reusable solution to a commonly occurring problem in software design — a description you adapt, not code you copy.

Q: Who were the "Gang of Four" and what did they do?
A: Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides, who cataloged 23 object-oriented design patterns in the 1994 book *Design Patterns*.

Q: What are the three GoF categories and what does each address?
A: Creational (object creation), structural (composition of classes/objects), and behavioral (communication between objects).

Q: What does "program to an interface, not an implementation" mean?
A: Depend on what an object can do (its interface/contract) rather than its concrete class, so implementations can be swapped freely.

Q: Why is "favor composition over inheritance" a guiding principle?
A: Combining objects is usually more flexible and less brittle than locking behavior into a deep class-inheritance tree.

Q: Give one honest reason NOT to use a pattern.
A: Patterns add classes and indirection; applying one where simple code would do is over-engineering and makes the design worse.

# Exercises

### Easy
In your own words, write the four parts the GoF use to describe every pattern (name, problem,
solution, consequences), and explain why the *name* is so useful on a team.

### Medium
Take the `PaymentMethod` example and add a third implementation (say, `BankTransfer`) without changing
the `checkout` function. Note which parts of the code you had to touch and which you didn't — that's
"program to an interface" in action.

### Challenging
Find a small piece of code you've written that uses a deep inheritance chain (three or more levels).
Sketch how you could achieve the same behavior with **composition** instead (one object holding
another), and list one advantage and one disadvantage of the change.

# Further Reading

- Gamma, Helm, Johnson & Vlissides — *Design Patterns: Elements of Reusable Object-Oriented Software*
  (1994), Introduction.
- Refactoring.Guru — *What's a design pattern?*: <https://refactoring.guru/design-patterns/what-is-pattern>
- Refactoring.Guru — *Classification of patterns*: <https://refactoring.guru/design-patterns/classification>
- The TypeScript Handbook — *Interfaces / Classes*: <https://www.typescriptlang.org/docs/handbook/2/objects.html>
