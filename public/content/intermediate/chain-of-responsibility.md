---
id: lesson-15
slug: chain-of-responsibility
title: "Chain of Responsibility"
level: intermediate
order: 15
duration: 15
tags:
  - behavioral
  - chain
  - decoupling
  - handlers
  - gof
summary: "The Chain of Responsibility pattern — pass a request along a chain of handlers so each one either handles it or forwards it to the next, decoupling the sender from whichever receiver ends up dealing with it."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of Chain of Responsibility.
- Build a chain of handlers in TypeScript that forward a request.
- Explain why a request might go **unhandled**, and why order matters.
- Recognize the pattern in real systems like middleware.

# Why It Matters

Often several objects *could* handle a request, and you don't want the sender hard-wired to a specific
one. Think of a support ticket that goes to tier 1, then tier 2, then a manager — each handles what it
can and passes the rest up. **Chain of Responsibility** lines up handlers and sends the request down the
line until someone deals with it, so the sender never needs to know who that is. This is our first
**behavioral** pattern — patterns about how objects communicate.

# Concept Explanation

### Intent

> **Avoid coupling the sender of a request to its receiver by giving more than one object a chance to
> handle the request. Chain the receiving objects and pass the request along the chain until an object
> handles it.** — Gang of Four

### The participants

- **Handler** — declares the interface (`handle`) and usually holds a link to the **next** handler.
- **Concrete Handler** — either handles the request or passes it to the next.
- **Client** — sends the request to the head of the chain.

```text
   Client ─▶ Auth ─▶ Validate ─▶ Log ─▶ (end)
             handle    handle    handle
```

### In TypeScript

```typescript
abstract class Handler {
  private next?: Handler;

  // Returns the handler you pass in, so links can be chained fluently.
  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }

  handle(request: string): string {
    // Default: pass along, or report "unhandled" at the end of the chain.
    return this.next ? this.next.handle(request) : `unhandled: ${request}`;
  }
}

class AuthHandler extends Handler {
  handle(request: string): string {
    if (request === "no-token") return "rejected: not authenticated";
    return super.handle(request); // not mine — forward
  }
}

class ValidateHandler extends Handler {
  handle(request: string): string {
    if (request === "bad-data") return "rejected: invalid";
    return super.handle(request);
  }
}

class LogHandler extends Handler {
  handle(request: string): string {
    console.log("handling", request);
    return `ok: ${request}`; // terminal handler
  }
}

const chain = new AuthHandler();
chain.setNext(new ValidateHandler()).setNext(new LogHandler());

chain.handle("no-token"); // "rejected: not authenticated" (stops at Auth)
chain.handle("hello");    // logs, returns "ok: hello"
```

Each handler makes one decision: *deal with it* or *pass it on*. The sender just calls
`chain.handle(...)`.

### A request may go unhandled — and order matters

A defining feature: **no handler is guaranteed to act**. A request can fall off the end unhandled, so
you decide what that means (ignore, error, default). And because the request travels in order, the
**sequence of handlers** changes behavior — auth before validation is not the same as the reverse.

### Consequences

- **Good:** decouples sender from receiver; you can add, remove, or reorder handlers freely (OCP);
  each handler is small and focused (SRP).
- **Cost:** no guarantee a request is handled; a long chain can be hard to trace; slightly harder to
  debug "who handled this?".

# Key Terminology

- **Handler** — an object that can process a request or forward it.
- **Chain** — the ordered sequence of handlers.
- **Forwarding** — passing the request to the next handler.
- **Unhandled request** — one that reaches the end without being processed.

# Options and Trade-offs

| Concern | Chain of Responsibility | One big if/else | How to choose |
| ------- | ----------------------- | --------------- | ------------- |
| Adding/removing steps | Add or drop a handler | Edit the conditional | Chain when steps change often. |
| Decoupling | Sender doesn't know the receiver | Sender knows all cases | Chain to decouple sender and handlers. |
| Guarantee of handling | None (may fall off end) | Explicit else | Add a terminal/default handler if handling is required. |

# Worked Example

Reorder the same handlers and watch behavior change:

```typescript
const validateFirst = new ValidateHandler();
validateFirst.setNext(new AuthHandler()).setNext(new LogHandler());

validateFirst.handle("bad-data"); // "rejected: invalid" — validation now runs before auth
```

Same handlers, different order, different outcome — proof that the chain's sequence is part of the
design.

# Real World Analogy

Chain of Responsibility is like **escalating a customer complaint**. You explain it to the front-line
rep; if they can't resolve it, they pass you to a supervisor; if not, to a manager. You (the sender)
don't need to know who will ultimately fix it — you hand it to the first person, and it travels up until
someone can act (or you're told nobody can).

# Examples

## Example 1 — Basic: stop or forward

`chain.handle("no-token")` stops at `AuthHandler`; `chain.handle("hello")` passes all the way to
`LogHandler`. Each handler chose to act or forward.

**Why this works:** the sender is decoupled from which handler ultimately responds.

## Example 2 — Real-world: web middleware

Server middleware (auth, body-parsing, logging) is Chain of Responsibility: each layer inspects the
request and either responds or calls `next()`. You compose behavior by ordering handlers.

**Why this works:** cross-cutting steps become independent, reorderable links.

## Example 3 — Pitfall: the silently-dropped request

If no handler acts and there's no default, the request vanishes with no error — a bug that's easy to
miss.

**Why this bites:** the pattern doesn't guarantee handling, so you must design the "end of chain"
deliberately.

# Common Mistakes

- **Assuming something will always handle the request.** Add a default/terminal handler if it must be.
- **Ignoring order.** The sequence of handlers is part of the behavior.
- **Building an enormous chain** that's hard to reason about.

# Best Practices

- Keep each handler **single-purpose** (handle one thing, or forward).
- Decide explicitly what an **unhandled** request means.
- Make the chain **configurable** so handlers can be added, removed, or reordered.

# Summary

- **Chain of Responsibility** passes a request along a line of handlers until one handles it.
- It **decouples** the sender from whichever receiver acts.
- Handlers can be added, removed, and **reordered** — but a request may go **unhandled**, so plan the
  end of the chain.
- Middleware is the everyday example.

# Flash Cards

Q: What is the intent of the Chain of Responsibility pattern?
A: Give more than one object a chance to handle a request by passing it along a chain of handlers until one handles it, decoupling sender from receiver.

Q: What are a handler's two choices when it receives a request?
A: Handle the request itself, or forward it to the next handler in the chain.

Q: Why might a request go unhandled in this pattern?
A: There is no guarantee any handler will act; if none does, the request reaches the end of the chain unhandled — so you must design a default or terminal handler if handling is required.

Q: Why does the order of handlers matter?
A: The request travels through handlers in sequence, so reordering them (e.g. auth before vs after validation) changes the outcome.

Q: What everyday web construct is an example of Chain of Responsibility?
A: Middleware — each layer inspects the request and either responds or calls next() to pass it along.

Q: What does the pattern decouple?
A: The sender of a request from the specific receiver that ends up handling it.

# Exercises

### Easy
List the handlers in the example chain in order, and say what happens to the request "no-token" and why
it stops where it does.

### Medium
Add a `RateLimitHandler` that rejects the request "too-many". Insert it at the front of the chain and
show that other requests still flow through.

### Challenging
Design a chain for approving an expense: amounts under $100 approved by a team lead, under $1,000 by a
manager, otherwise a director. Decide what happens to a request nobody can approve, and explain why the
order of handlers matters.

# Further Reading

- Gamma et al. — *Design Patterns*, "Chain of Responsibility".
- Refactoring.Guru — *Chain of Responsibility*: <https://refactoring.guru/design-patterns/chain-of-responsibility>
- Refactoring.Guru — *in TypeScript*: <https://refactoring.guru/design-patterns/chain-of-responsibility/typescript/example>
