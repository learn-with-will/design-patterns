---
id: lesson-14
slug: proxy
title: "Proxy"
level: intermediate
order: 14
duration: 16
tags:
  - structural
  - proxy
  - access-control
  - wrapper
  - gof
summary: "The Proxy pattern — stand in for another object with the same interface to control access to it (lazy loading, permissions, caching, remote calls) — plus a side-by-side comparison of the four 'wrapper' patterns: Adapter, Facade, Decorator, and Proxy."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Proxy pattern and name its common varieties.
- Implement a **virtual (lazy) proxy** in TypeScript.
- Clearly separate **Proxy, Decorator, Adapter, and Facade**.
- Relate the pattern to JavaScript's built-in `Proxy` object.

# Why It Matters

Sometimes you can't (or shouldn't) let code talk to an object directly: it's expensive to create,
needs a permission check, lives on another server, or its results should be cached. A **Proxy** is a
stand-in that has the **same interface** as the real object and sits in front of it, adding that
**access control** before (or instead of) forwarding the call. Callers can't tell the difference — which
is exactly the point.

# Concept Explanation

### Intent

> **Provide a surrogate or placeholder for another object to control access to it.** — Gang of Four

### The participants

- **Subject** — the shared interface of the real object and its proxy (`Image`).
- **Real Subject** — the actual object doing the work (`RealImage`).
- **Proxy** — implements the Subject, holds (or creates) the Real Subject, and controls access to it.

### Common kinds of proxy

- **Virtual proxy** — delays creating an expensive object until it's actually needed (lazy loading).
- **Protection proxy** — checks permissions before forwarding.
- **Remote proxy** — represents an object living in another process or on another machine.
- **Caching / smart proxy** — caches results or adds bookkeeping (reference counts, logging).

### A virtual (lazy) proxy in TypeScript

```typescript
interface Image {
  display(): string;
}

class RealImage implements Image {
  constructor(private file: string) { this.loadFromDisk(); }
  private loadFromDisk() { /* expensive work happens here */ }
  display() { return `showing ${this.file}`; }
}

// Proxy: same interface, but defers the expensive RealImage until first use.
class LazyImage implements Image {
  private real?: RealImage;
  constructor(private file: string) {}
  display() {
    if (!this.real) this.real = new RealImage(this.file); // load on demand
    return this.real.display();
  }
}

const image: Image = new LazyImage("huge.png"); // nothing loaded yet
image.display(); // now the RealImage is created and shown
```

The `LazyImage` is a drop-in `Image`. The expensive load happens only if and when `display()` is
called.

### The four "wrapper" patterns, side by side

These patterns all wrap an object, and they're constantly confused. The difference is **intent**:

| Pattern | Interface vs the wrapped object | Purpose |
| ------- | ------------------------------- | ------- |
| **Adapter** | **Different** (converts it) | Make an incompatible interface fit what a client expects |
| **Facade** | **New & simpler** (over many classes) | Simplify access to a whole subsystem |
| **Decorator** | **Same** | **Add** responsibilities dynamically |
| **Proxy** | **Same** | **Control access** to the object |

Decorator and Proxy both keep the same interface; the tell is *why* — adding behavior (Decorator) vs
gatekeeping access (Proxy).

### JavaScript's built-in `Proxy`

JavaScript ships a `Proxy` object that wraps a target and **traps** operations (get, set, has). It's a
language-level way to implement proxy-like behavior:

```typescript
const target = { balance: 100 };
const guarded = new Proxy(target, {
  get(obj, prop) { return prop in obj ? (obj as any)[prop] : `no ${String(prop)}`; },
});
```

It's a handy tool, but the **pattern** is the general idea of a controlling surrogate — not tied to that
API.

### Consequences

- **Good:** control access transparently (lazy, secure, cached, remote) without changing the real
  object or its callers.
- **Cost:** an extra layer; a proxy that changes timing or caching can introduce subtle behavior
  differences.

# Key Terminology

- **Proxy** — a surrogate with the same interface that controls access to a real object.
- **Real Subject** — the object the proxy stands in for.
- **Virtual / protection / remote / caching proxy** — the common varieties by purpose.
- **Transparent** — the proxy shares the subject's interface, so callers are unaware of it.

# Options and Trade-offs

| Concern | Proxy | Direct access | How to choose |
| ------- | ----- | ------------- | ------------- |
| Expensive creation | Lazy proxy defers it | Always builds up front | Proxy when creation is costly and sometimes skipped. |
| Access rules | Protection proxy enforces | Checks scattered in callers | Proxy centralizes the gatekeeping. |
| Simplicity | Extra layer | Fewer moving parts | Skip the proxy when access needs no control. |

# Worked Example

A protection proxy enforces a permission before forwarding:

```typescript
interface Documents { read(id: string): string; }
class RealDocuments implements Documents { read(id: string) { return `contents of ${id}`; } }

class ProtectedDocuments implements Documents {
  constructor(private real: Documents, private role: string) {}
  read(id: string) {
    if (this.role !== "admin") return "access denied";
    return this.real.read(id); // forward only when allowed
  }
}

new ProtectedDocuments(new RealDocuments(), "guest").read("secret"); // "access denied"
```

# Real World Analogy

A Proxy is like a **security guard at a building's front desk**, or a **credit card** standing in for
your bank account. You interact with the stand-in exactly as you would the real thing, but it can check
your ID, delay entry, or forward your request to the vault — adding a layer of control without changing
what's inside.

# Examples

## Example 1 — Basic: lazy loading

`new LazyImage("huge.png")` loads nothing. Only the first `display()` triggers the expensive
`RealImage`. If it's never displayed, the cost is never paid.

**Why this works:** the proxy shares the `Image` interface, so it substitutes seamlessly while deferring
work.

## Example 2 — Real-world: ORMs and lazy relations

Object-relational mappers return proxy objects for related records; the database query fires only when
you actually access the relation. Same interface, deferred cost.

**Why this works:** callers use the object normally; the proxy decides *when* to hit the database.

## Example 3 — Pitfall: a proxy that silently changes behavior

A caching proxy that returns stale data, or a lazy proxy whose load throws at an unexpected moment, can
surprise callers who assumed direct, immediate access.

**Why this bites:** a proxy shares the interface but not always the exact *timing or freshness* — a
subtle contract change.

# Common Mistakes

- **Confusing Proxy with Decorator.** Same interface, but Proxy controls access while Decorator adds
  behavior.
- **Confusing Proxy with Adapter/Facade.** Those change or simplify interfaces; Proxy keeps the same
  one.
- **Hiding heavy side effects** (a slow load, a stale cache) behind a "transparent" proxy without
  telling callers.

# Best Practices

- Keep the proxy's interface **identical** to the real subject's.
- Pick the variety that matches the need (**virtual, protection, remote, caching**).
- Be explicit in docs when a proxy changes **timing or freshness**.

# Summary

- **Proxy** provides a **same-interface surrogate** that **controls access** to a real object.
- Common kinds: **virtual** (lazy), **protection** (permissions), **remote**, and **caching**.
- It sits with Adapter, Facade, and Decorator as a "wrapper" — distinguished by **intent** (control
  access).
- JavaScript's built-in `Proxy` object is one way to implement proxy-like control.

# Flash Cards

Q: What is the intent of the Proxy pattern?
A: Provide a surrogate or placeholder for another object to control access to it.

Q: Name three common kinds of proxy.
A: Virtual (lazy loading), protection (permission checks), remote (object in another process/machine), and caching/smart proxies.

Q: How do Proxy and Decorator differ, given both keep the same interface?
A: Decorator adds new responsibilities to the object; Proxy controls access to it (lazy, secure, cached, remote).

Q: What does a virtual proxy do?
A: It defers creating an expensive real object until it's actually needed, then forwards to it.

Q: How do Proxy and Adapter differ?
A: Proxy keeps the same interface and controls access; Adapter converts an object's interface into a different one that the client expects.

Q: What is JavaScript's built-in Proxy object?
A: A language feature that wraps a target and traps operations (get/set/has) — one way to implement proxy-like access control.

# Exercises

### Easy
State which proxy variety each is: (a) defers loading a large file, (b) checks a user's role before
reading, (c) represents a service on another server.

### Medium
Write a caching proxy for `interface Api { fetch(id: string): string }` that remembers results per id
and returns the cached value on repeat calls. Note one risk your cache introduces.

### Challenging
Take the same wrapped object and write both a Decorator (adds a "logged" behavior) and a Proxy (denies
access to non-admins) for it. Then explain, in one sentence each, how their *intent* differs even though
both share the object's interface.

# Further Reading

- Gamma et al. — *Design Patterns*, "Proxy".
- Refactoring.Guru — *Proxy*: <https://refactoring.guru/design-patterns/proxy>
- MDN — *Proxy*: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy>
