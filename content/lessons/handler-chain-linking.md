---
slug: handler-chain-linking
title: "Building Linked Handler Chains"
topic: behavioral-requests
kind: technique
summary: "Link successor handlers using abstract base classes so each handler either processes or forwards requests."
tags:
  - behavioral
  - chain-of-responsibility
  - linking
  - typescript
related:
  - chain-of-responsibility-intent
  - middleware-pipelines
  - chain-of-responsibility-tradeoffs
---

> **In one line:** Assemble handler chains dynamically by linking successors into an executable pipeline.

## The idea

Implementing a linked handler chain in TypeScript begins with an abstract base class that encapsulates the successor pointer.

The base class provides a fluent helper method (commonly named `setNext(handler)`) that assigns the `next` reference and returns the passed handler. This allows client code to link multiple handlers together in a single expressive statement: `auth.setNext(cache).setNext(validator)`.

Each concrete handler class overrides the handling method. It inspects the incoming request:
- If the handler can satisfy the request, it completes the work and optionally terminates propagation.
- If it cannot, it delegates execution to `super.handle(request)`, passing the request to the next node in the chain.

| Step | Handler Action | When Chosen |
|---|---|---|
| **1. Evaluate Condition** | Checks request criteria | Always on request receipt |
| **2. Consume & Halt** | Handles request; does not forward | If request matches handler domain |
| **3. Forward to Successor** | Calls `this.next.handle(req)` | If handler cannot satisfy request |
| **4. End of Chain** | Default fallback / error logging | When `this.next === null` |

> **Tip:** Returning the next handler from `setNext()` creates a fluent API for chain construction: `const chain = h1; h1.setNext(h2).setNext(h3);`.

## See it

```typescript
class FrontDeskSupport extends SupportHandler {
  handle(issue: string, severity: number): void {
    if (severity <= 1) {
      console.log(`[Front Desk] Resolved basic issue: ${issue}`);
    } else {
      console.log('[Front Desk] Escalating issue...');
      super.handle(issue, severity);
    }
  }
}

class SeniorEngineerSupport extends SupportHandler {
  handle(issue: string, severity: number): void {
    if (severity <= 3) {
      console.log(`[Senior Dev] Resolved complex issue: ${issue}`);
    } else {
      console.log('[Senior Dev] Critical severity! Escalating...');
      super.handle(issue, severity);
    }
  }
}

const support = new FrontDeskSupport();
support.setNext(new SeniorEngineerSupport());
support.handle('Server outage', 3);
```

## Go deeper

You can construct circular chains where requests loop until a condition is met, but you must include a loop termination counter or visited set to prevent infinite recursion. In practice, strictly linear chains with explicit end-of-chain fallbacks are significantly safer and easier to maintain.

## Watch out

- Do not forget to forward unhandled requests; omitting the super call silently drops requests.
- Ensure that handlers do not mutate shared request objects in ways that corrupt subsequent handlers.

## Remember

- An abstract base handler stores the successor link and default forwarding logic.
- Fluent setNext() methods enable clean, readable chain assembly in client setup.
- Concrete handlers inspect request criteria and either resolve the work or delegate downward.
