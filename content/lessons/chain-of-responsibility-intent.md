---
slug: chain-of-responsibility-intent
title: "Chain of Responsibility: Intent"
topic: behavioral-requests
kind: pattern
summary: "Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request."
tags:
  - behavioral
  - chain-of-responsibility
  - handlers
  - decoupling
related:
  - handler-chain-linking
  - middleware-pipelines
  - chain-of-responsibility-tradeoffs
---

> **In one line:** Chain of Responsibility passes a request along a chain of handlers until one of them handles it.

## The idea

In many software systems, a single incoming request might need to be processed by one of several different handlers depending on runtime conditions, user permissions, or request parameters.

If the client sending the request contains nested `if/else` or `switch` statements that explicitly instantiate and invoke each potential receiver, the sender becomes tightly coupled to every single handler class. Adding or reordering handlers requires modifying client code, violating the Open/Closed Principle.

The Gang of Four's **Chain of Responsibility** pattern eliminates this coupling. Its official intent is: **"Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it."** The sender only knows about the first handler in the chain; each handler independently decides whether to process the request or pass it to its successor.

| Participant | Role | Responsibility |
|---|---|---|
| **Handler** | Base interface or abstract class | Declares handling method and maintains successor link |
| **ConcreteHandler** | Specific handling node | Processes request if eligible; otherwise forwards down chain |
| **Client** | Sender of the request | Sends request to the first handler in the chain |

> **Note:** Handlers can either follow a "pure" chain (where exactly one handler consumes the request and halts propagation) or an "interceptor" chain (where all handlers inspect or transform the request in sequence, like HTTP middleware).

## See it

```typescript
abstract class SupportHandler {
  protected next: SupportHandler | null = null;

  setNext(handler: SupportHandler): SupportHandler {
    this.next = handler;
    return handler; // Enables chaining
  }

  handle(issue: string, severity: number): void {
    if (this.next) {
      this.next.handle(issue, severity);
    } else {
      console.log(`Issue '${issue}' unhandled; logged for review`);
    }
  }
}
```

## Go deeper

GUI event bubbling in web browsers (e.g., DOM event propagation from a button up through `<div>` containers to `window`) is a classic real-world implementation of Chain of Responsibility. If a clicked button does not capture the event, the event propagates up parent DOM nodes until an element with an active listener handles it or `stopPropagation()` is called.

## Watch out

- A request can reach the end of the chain unhandled; always provide a fallback default handler.
- Watch out for broken successor chains where a handler forgets to call super.handle() or forward the request.

## Remember

- Chain of Responsibility decouples the request sender from concrete receiver classes.
- Handlers are linked sequentially, forwarding requests along the chain until processed.
- The chain can be dynamically assembled, reordered, or extended at runtime without altering clients.
