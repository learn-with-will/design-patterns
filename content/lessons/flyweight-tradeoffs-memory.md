---
slug: flyweight-tradeoffs-memory
title: "Flyweight Trade-offs: CPU vs Memory"
topic: structural-proxies
kind: pitfall
summary: "Flyweight saves RAM at the cost of computation cycles and complex extrinsic state management; only use at scale."
tags:
  - structural
  - flyweight
  - tradeoffs
  - performance
  - complexity
related:
  - flyweight-intent
  - intrinsic-vs-extrinsic-state
  - when-to-use-patterns
---

> **In one line:** Flyweight trades CPU cycles and architectural complexity for memory savings; use it only under heavy RAM pressure.

## The idea

The Flyweight pattern is an optimization pattern, and like all optimization patterns, it introduces architectural complexity that is only justified when measuring against real performance bottlenecks.

The primary trade-off of Flyweight is trading **CPU time for RAM**:
- By externalizing extrinsic state, methods must calculate or pass coordinates and context parameters repeatedly on every call.
- The Flyweight Factory incurs hash lookup overhead on every object access.
- Code becomes significantly more complex: developers must maintain two separate classes (the flyweight and the context holder) and carefully segregate state.

If your application only instantiates a few hundred or a few thousand objects, modern computers have plenty of RAM to hold them directly. In that scenario, adopting Flyweight introduces cognitive complexity for negligible memory gains.

| Scenario | Apply Flyweight? | Rationale |
|---|---|---|
| 50,000+ graphic particles in browser canvas | **Yes** | Prevents tab crashes and aggressive GC stutter |
| Text editor rendering 500,000 characters | **Yes** | Shared font glyphs keep memory negligible |
| 50 items in an e-commerce shopping cart | **No** | Premature optimization; direct objects are cleaner |
| User profile records in a web service | **No** | Standard database entities without heavy repeated assets |

> **Watch out:** Never introduce Flyweight speculatively. Profile your memory heap first using Chrome DevTools or Node.js heap profilers. If object allocation is not causing memory pressure, skip Flyweight.

## See it

```typescript
// Measure before applying Flyweight!
// Direct objects: Simple, readable, but consumes RAM for massive collections
class SimpleParticle {
  constructor(
    public x: number,
    public y: number,
    public color: string,
    public sprite: string // Duplicated across 100k instances
  ) {}
}

// Only refactor to Flyweight when heap profiling reveals
// that duplicate sprite strings are exhausting available heap memory!
```

## Go deeper

In JavaScript, memory consumption is also influenced by hidden classes (V8 shapes). Creating thousands of objects with identical property order is heavily optimized by the V8 JavaScript engine. Often, simply ensuring objects share consistent shapes provides significant memory efficiency before needing full Flyweight refactoring.

## Watch out

- Do not apply Flyweight if your application does not suffer from measurable RAM exhaustion.
- Beware of passing too many extrinsic parameters, which can lead to messy, unreadable method signatures.

## Remember

- Flyweight trades CPU lookup time and code simplicity for substantial memory savings.
- It requires rigorous separation of intrinsic state from extrinsic context parameters.
- Apply Flyweight only when managing tens of thousands of objects under proven memory pressure.
