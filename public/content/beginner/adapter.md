---
id: lesson-08
slug: adapter
title: "Adapter"
level: beginner
order: 8
duration: 15
tags:
  - structural
  - adapter
  - interface
  - integration
  - gof
summary: "The Adapter pattern — wrap an object with an incompatible interface so it fits the interface your code expects, letting classes that couldn't otherwise cooperate (like third-party or legacy code) work together."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Adapter pattern.
- Build an **object adapter** in TypeScript that wraps and delegates.
- Explain where Adapter fits when integrating **third-party or legacy** code.
- Begin distinguishing Adapter from the other "wrapper" patterns.

# Why It Matters

Your code expects one shape of interface; a library or an old module offers another. Rewriting either
side is risky or impossible (you may not own the library). **Adapter** is the translator in between: a
small class that presents *your* expected interface and quietly forwards calls to the *other* object.
It's how mismatched parts snap together without editing either one. This is our first **structural**
pattern — patterns about composing objects into larger structures.

# Concept Explanation

### Intent

> **Convert the interface of a class into another interface clients expect. Adapter lets classes work
> together that couldn't otherwise because of incompatible interfaces.** — Gang of Four

### The participants

- **Target** — the interface your code wants to use (`Logger`).
- **Adaptee** — the existing class with an incompatible interface (`LegacyLogger`).
- **Adapter** — implements the Target and holds an Adaptee, translating each call.
- **Client** — uses the Target interface, unaware of the Adaptee.

```text
   Client ──▶ Target (interface)
                  △
                  │ implements
              Adapter ──holds──▶ Adaptee (incompatible)
```

### Object adapter in TypeScript

The **object adapter** uses **composition**: the adapter *holds* the adaptee and delegates to it. (A
"class adapter" using multiple inheritance exists in some languages, but TypeScript classes have single
inheritance, so object adapters are the norm.)

```typescript
// The interface our app expects.
interface Logger {
  log(message: string): void;
}

// A third-party/legacy class with a different shape — we can't change it.
class LegacyLogger {
  writeLine(text: string, level: number): void {
    console.log(`[${level}] ${text}`);
  }
}

// Adapter: presents OUR Logger interface, forwards to THEIR method.
class LegacyLoggerAdapter implements Logger {
  constructor(private legacy: LegacyLogger) {}
  log(message: string): void {
    this.legacy.writeLine(message, 1); // translate the call shape
  }
}

function run(logger: Logger) {
  logger.log("started"); // client only knows Logger
}

run(new LegacyLoggerAdapter(new LegacyLogger()));
```

`run` only speaks `Logger`. The adapter absorbs the mismatch — method name, argument order, defaults —
so nothing else has to.

### Adapter vs the other wrappers (a first look)

Several patterns "wrap" an object; they differ by **intent** (you'll compare all four in the Proxy
lesson):

- **Adapter** — changes an object's **interface** to a different one.
- **Facade** — provides a **simpler** interface to a whole subsystem.
- **Decorator** — **adds behavior** while keeping the **same** interface.
- **Proxy** — **controls access** while keeping the **same** interface.

### Consequences

- **Good:** integrates incompatible/third-party/legacy code without changing it; keeps the mismatch in
  one place; supports OCP (add adapters without touching clients).
- **Cost:** one more class and a layer of indirection; a pile of adapters can hide how much of your
  code is really "translation glue."

# Key Terminology

- **Target** — the interface the client wants.
- **Adaptee** — the existing, incompatible class.
- **Adapter** — the class that maps Target calls onto the Adaptee.
- **Object adapter** — an adapter that holds the adaptee via composition (the TypeScript norm).

# Options and Trade-offs

| Concern | Adapter | Change the caller | Change the library | How to choose |
| ------- | ------- | ----------------- | ------------------ | ------------- |
| You don't own the library | Wrap it | Painful everywhere | Impossible | Adapter is the natural fit. |
| One-off mismatch | Small adapter | Inline conversion | — | A tiny inline conversion may be enough for a single call site. |
| Many call sites | One adapter, reused | Repeated conversions | — | Adapter centralizes the translation. |

# Worked Example

Two mapping libraries expose different method names; your app wants a single `MapService`:

```typescript
interface MapService { locate(query: string): string; }

class GoogleMaps { searchPlace(q: string) { return `google:${q}`; } }
class OpenStreet { findAddress(text: string) { return `osm:${text}`; } }

class GoogleAdapter implements MapService {
  constructor(private g: GoogleMaps) {}
  locate(query: string) { return this.g.searchPlace(query); }
}
class OpenStreetAdapter implements MapService {
  constructor(private o: OpenStreet) {}
  locate(query: string) { return this.o.findAddress(query); }
}

function findOnMap(service: MapService) { return service.locate("Paris"); }
```

`findOnMap` works with either provider; each adapter translates `locate` to that library's method.

# Real World Analogy

Adapter is exactly a **travel power adapter**. Your laptop's plug (the client) doesn't fit the wall
socket in another country (the adaptee). You don't rewire the laptop or the building — you slot a small
adapter between them that presents the shape your plug expects and connects to the shape the wall
provides.

# Examples

## Example 1 — Basic: translating a method call

`LegacyLoggerAdapter.log()` calls `legacy.writeLine(message, 1)`. The name and arguments differ; the
adapter maps one onto the other so `run(logger)` never notices.

**Why this works:** the mismatch is handled in exactly one place — the adapter.

## Example 2 — Real-world: swapping a third-party service

By coding to a `MapService` interface and writing an adapter per provider, you can switch from Google to
OpenStreetMap by changing one line where the adapter is constructed — the rest of the app is untouched.

**Why this works:** clients depend on your interface, not the vendor's, so vendors become replaceable.

## Example 3 — Pitfall: adapting when you should refactor

If *you own both sides*, hiding a mismatch behind an adapter can be a way to avoid fixing an
inconsistent design. Adapters are for boundaries you can't change — not an excuse to leave your own
interfaces messy.

**Why this bites:** an adapter you didn't need is just extra indirection over code you could have
aligned.

# Common Mistakes

- **Confusing Adapter with Facade.** Adapter makes one interface look like another; Facade *simplifies*
  a complex subsystem.
- **Adapting code you control** instead of aligning the interfaces directly.
- **Leaking the adaptee.** The client should see only the Target interface, not the wrapped object.

# Best Practices

- Use Adapter at **boundaries** — third-party libraries, legacy modules, external services.
- Keep the adapter **thin**: translate the call, don't add business logic.
- Have clients depend on the **Target interface**, so adaptees stay swappable.

# Summary

- **Adapter** converts an object's interface into the one a client expects, letting incompatible
  classes cooperate.
- Participants: **Target**, **Adaptee**, **Adapter**, **Client**; TypeScript uses the **object
  adapter** (composition).
- It shines at **integration boundaries** (third-party, legacy) you can't or shouldn't change.
- It differs from Facade (simplify), Decorator (add behavior), and Proxy (control access) — all
  compared later.

# Flash Cards

Q: What is the intent of the Adapter pattern?
A: Convert the interface of a class into another interface clients expect, so classes with incompatible interfaces can work together.

Q: What are the four participants in Adapter?
A: Target (the wanted interface), Adaptee (the incompatible class), Adapter (maps Target to Adaptee), and Client (uses the Target).

Q: Why does TypeScript typically use an "object adapter"?
A: Object adapters use composition (the adapter holds the adaptee), which suits TypeScript's single-inheritance classes; class adapters rely on multiple inheritance.

Q: How does Adapter differ from Facade?
A: Adapter changes one interface into a different expected interface; Facade provides a simpler interface over a complex subsystem.

Q: When is Adapter the right tool?
A: At boundaries you can't change — integrating third-party or legacy code whose interface doesn't match what your code expects.

Q: What is a sign you're misusing Adapter?
A: Adapting code you own to avoid aligning your own interfaces — that's extra indirection instead of a real fix.

# Exercises

### Easy
Identify the Target, Adaptee, and Adapter in the `LegacyLogger` example, and explain in one sentence
what the adapter translates.

### Medium
Write an adapter that makes a third-party `class Stripe { charge(cents: number) }` satisfy your app's
`interface Payment { pay(dollars: number): void }`. Remember to convert dollars to cents.

### Challenging
Suppose your app must support two email providers with different APIs. Define a `Mailer` interface and
write an adapter for each provider. Then explain how you would switch providers with a one-line change,
and why the rest of the app is unaffected.

# Further Reading

- Gamma et al. — *Design Patterns*, "Adapter".
- Refactoring.Guru — *Adapter*: <https://refactoring.guru/design-patterns/adapter>
- Refactoring.Guru — *Adapter in TypeScript*: <https://refactoring.guru/design-patterns/adapter/typescript/example>
