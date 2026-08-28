---
id: lesson-02
slug: solid-principles
title: "The SOLID Principles"
level: beginner
order: 2
duration: 18
tags:
  - solid
  - principles
  - oop
  - design
  - foundations
summary: "The five SOLID principles of object-oriented design — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion — each with a tiny TypeScript example, plus how Dependency Inversion differs from Dependency Injection and Inversion of Control."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Name and explain the **five SOLID principles**.
- Recognize code that **violates** each one and how a pattern-friendly design fixes it.
- Read a small TypeScript example for each principle.
- Tell apart **Dependency Inversion**, **Dependency Injection**, and **Inversion of Control**.

# Why It Matters

Design patterns don't come from nowhere — they are concrete ways of honoring a handful of deeper
**principles**. The best-known set is **SOLID**, five principles for object-oriented design collected
by **Robert C. Martin** (the acronym itself was coined by Michael Feathers). Understanding SOLID makes
the rest of this course click: nearly every pattern exists to satisfy one or more of these principles.
Follow them and your code bends instead of breaking when requirements change.

# Concept Explanation

### S — Single Responsibility Principle (SRP)

**A class should have one reason to change.** Put differently: it should do one job. When a class mixes
concerns (say, business rules *and* saving to a file *and* formatting a report), a change to any one
concern risks breaking the others.

```typescript
// Violation: this class changes if the invoice math changes OR if storage changes.
class Invoice {
  total() { /* ... */ }
  saveToDatabase() { /* ... */ }   // a second reason to change
}

// Better: one responsibility each.
class Invoice { total() { /* ... */ } }
class InvoiceRepository { save(invoice: Invoice) { /* ... */ } }
```

### O — Open/Closed Principle (OCP)

**Software entities should be open for extension but closed for modification.** You should be able to
add new behavior by adding new code, not by editing code that already works and is already tested.

```typescript
interface Shape { area(): number; }
class Circle implements Shape { constructor(private r: number) {} area() { return Math.PI * this.r ** 2; } }
class Square implements Shape { constructor(private s: number) {} area() { return this.s ** 2; } }

// Adding a Triangle means writing a NEW class — totalArea never changes.
function totalArea(shapes: Shape[]) {
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}
```

The alternative — a growing `if (shape.type === "circle") … else if …` — must be *edited* for every
new shape, which is exactly what OCP tells you to avoid.

### L — Liskov Substitution Principle (LSP)

**Objects of a subtype must be usable anywhere their base type is expected, without breaking things.**
Named after **Barbara Liskov**. A subclass must honor the *contract* of its parent — same expectations,
no nasty surprises.

```typescript
// Violation: a Penguin "is-a" Bird, but can't fly — so it breaks code that calls fly().
class Bird { fly() { /* ... */ } }
class Penguin extends Bird { fly() { throw new Error("penguins can't fly"); } }
```

The fix is to model the hierarchy so substitution always holds (e.g. separate `FlyingBird`, or don't
put `fly()` on `Bird` at all).

### I — Interface Segregation Principle (ISP)

**Prefer many small, client-specific interfaces over one large, general-purpose one.** No class should
be forced to implement methods it doesn't use.

```typescript
// Violation: a simple printer is forced to implement scan() and fax().
interface AllInOne { print(): void; scan(): void; fax(): void; }

// Better: split by capability; a class implements only what it truly does.
interface Printer { print(): void; }
interface Scanner { scan(): void; }
```

### D — Dependency Inversion Principle (DIP)

**Depend on abstractions, not on concretions.** High-level code (policy) should not depend on
low-level details; both should depend on an interface in the middle.

```typescript
interface MessageSender { send(text: string): void; }          // the abstraction

class EmailSender implements MessageSender { send(text: string) { /* ... */ } }

class Notifier {
  constructor(private sender: MessageSender) {}                 // depends on the interface
  alert(text: string) { this.sender.send(text); }
}
```

`Notifier` never mentions `EmailSender`. Swap in an `SmsSender` and `Notifier` is untouched.

### DIP vs DI vs IoC — three things people confuse

- **Dependency Inversion (DIP)** — a *principle*: depend on abstractions.
- **Dependency Injection (DI)** — a *technique*: pass a dependency **in** (via the constructor above)
  instead of creating it inside with `new`. It's how you *achieve* DIP in practice. DI is **not** a
  GoF pattern.
- **Inversion of Control (IoC)** — the *broad idea* that a framework calls your code rather than your
  code calling the framework. DI is one form of IoC.

As Martin Fowler puts it, they're related but distinct: DIP is the goal, DI is a way to reach it, and
IoC is the wider principle both live under.

# Key Terminology

- **SRP** — one class, one reason to change.
- **OCP** — extend behavior by adding code, not editing existing code.
- **LSP** — subtypes must be substitutable for their base type.
- **ISP** — small, focused interfaces beat one fat interface.
- **DIP** — depend on abstractions, not concrete classes.
- **Dependency Injection** — passing dependencies in from outside; the usual way to satisfy DIP.

# Options and Trade-offs

| Situation | Following SOLID | Ignoring it | How to choose |
| --------- | --------------- | ----------- | ------------- |
| Adding a new variant | New class, no edits (OCP) | Edit a growing `switch` | OCP wins when variants keep appearing; a one-off `if` is fine for two fixed cases. |
| Getting a dependency | Inject an interface (DIP/DI) | `new ConcreteThing()` inside | Inject when you need to test in isolation or swap implementations; direct `new` is fine for stable, internal helpers. |
| Interface size | Several small interfaces (ISP) | One big interface | Split when different clients need different subsets; don't over-split trivially. |

# Worked Example

Watch OCP and DIP work together. A report needs to be exportable to new formats over time:

```typescript
interface Exporter { export(data: string): string; }

class JsonExporter implements Exporter { export(d: string) { return `json:${d}`; } }
class CsvExporter implements Exporter { export(d: string) { return `csv:${d}`; } }

class Report {
  constructor(private exporter: Exporter) {}   // DIP: depends on the abstraction (DI: passed in)
  save(data: string) { return this.exporter.export(data); }
}

// Adding XML export = one new class. Report and save() never change (OCP).
class XmlExporter implements Exporter { export(d: string) { return `xml:${d}`; } }
```

Every new format is *additive*. Nothing already tested gets edited — that is the whole point.

# Real World Analogy

SOLID is like the wiring in a house built to a **standard socket**. Because every appliance depends on
the *socket* (an interface), not on the power plant's internals (DIP), you can plug in a lamp, a
toaster, or next year's gadget without rewiring the walls (OCP). Any appliance fits any socket (LSP),
and a lamp socket isn't forced to also provide water and gas (ISP). Standards make the parts
swappable — and so does SOLID.

# Examples

## Example 1 — Basic: SRP splits a class

The `Invoice` above did math *and* storage. Splitting `InvoiceRepository` out means a change to the
database no longer risks the invoice math. Each class now has a single reason to change.

**Why this works:** fewer entangled concerns means changes stay local and tests stay simple.

## Example 2 — Real-world: DIP makes tests easy

Because `Notifier` takes a `MessageSender`, a test can pass a fake sender that records calls instead of
sending real email. No network, no waiting, no flakiness.

**Why this works:** depending on an abstraction lets you substitute a test double — the same trick DIP
enables in production.

## Example 3 — Pitfall: an LSP violation that compiles fine

`Penguin extends Bird` compiles happily, but the moment some loop calls `bird.fly()` on a list that
includes a penguin, it throws. The type system was satisfied; the *contract* was not.

**Why this bites:** LSP is about behavior, not just types. A subtype that can't stand in for its parent
is a landmine that the compiler won't catch.

# Common Mistakes

- **Treating SOLID as five unrelated rules.** They reinforce each other — OCP usually needs DIP, which
  usually needs an interface (ISP).
- **Confusing DIP with DI.** DIP is the principle; DI is one technique that achieves it.
- **Faking LSP with a type check.** Throwing in an overridden method "to satisfy the interface" breaks
  substitutability.
- **Over-splitting.** SRP and ISP taken to an extreme create a fog of tiny classes. Balance matters.

# Best Practices

- Ask "**what would make this class change?**" If there's more than one answer, consider splitting (SRP).
- Add variation behind an **interface** so new cases are new classes (OCP + DIP).
- **Inject** dependencies you'll want to swap or test (DI).
- Keep interfaces **focused** on what a specific client needs (ISP).

# Summary

- **SOLID** = Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation,
  Dependency Inversion — five principles of object-oriented design.
- They exist to make code **easy to extend and safe to change**; most GoF patterns are ways to honor
  them.
- **DIP** (depend on abstractions) is a principle; **Dependency Injection** is the technique that
  usually implements it; **Inversion of Control** is the broader idea.
- The principles work **together** — you'll see them recur in every pattern that follows.

# Flash Cards

Q: What does the Single Responsibility Principle say?
A: A class should have only one reason to change — it should do one job.

Q: State the Open/Closed Principle.
A: Software entities should be open for extension but closed for modification — add new behavior with new code, don't edit working code.

Q: What is the Liskov Substitution Principle about?
A: Subtypes must be substitutable for their base type without breaking a program's correctness; a subclass must honor its parent's contract.

Q: What does the Dependency Inversion Principle tell you to depend on?
A: Abstractions (interfaces), not concrete classes — so high-level policy doesn't depend on low-level details.

Q: How do Dependency Inversion and Dependency Injection differ?
A: Dependency Inversion is a principle (depend on abstractions); Dependency Injection is a technique (pass dependencies in instead of creating them internally) used to achieve it.

Q: What does the "I" in SOLID stand for, and what does it recommend?
A: Interface Segregation — prefer several small, client-specific interfaces over one large one, so classes aren't forced to implement methods they don't use.

# Exercises

### Easy
Write one sentence for each letter of SOLID in your own words. Then circle the two principles you find
hardest to keep and note why.

### Medium
Find (or write) a class that has two responsibilities — for example, one that both calculates
something and prints/saves it. Split it into two classes and describe what each one's "single reason to
change" now is.

### Challenging
Take a function that uses `new SomeConcreteClass()` inside it. Refactor it to accept the dependency
through its constructor or parameters (Dependency Injection) behind an interface. Then write a tiny
fake implementation of that interface to show how the code is now testable in isolation.

# Further Reading

- Robert C. Martin — *The Principles of OOD* (SOLID): <https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html>
- Refactoring.Guru — *Design principles*: <https://refactoring.guru/design-patterns/what-is-pattern>
- Martin Fowler — *Inversion of Control Containers and the Dependency Injection pattern*: <https://martinfowler.com/articles/injection.html>
- The TypeScript Handbook — *Classes*: <https://www.typescriptlang.org/docs/handbook/2/classes.html>
