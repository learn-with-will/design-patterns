---
slug: step-by-step-builder
title: "Step-by-Step Object Construction"
topic: creational-objects
kind: technique
summary: "Assemble an object stage-by-stage using dedicated builder methods before calling a build method."
tags:
  - creational
  - builder
  - assembly
  - validation
related:
  - builder-intent
  - fluent-builder-in-typescript
  - builder-director-and-variants
---

> **In one line:** Construct objects stage-by-stage across time and application boundaries before finalizing with build().

## The idea

A major advantage of the Builder pattern over direct instantiation is that construction steps can be distributed over time and across different application boundaries.

Unlike a constructor, which must execute in a single synchronous call, a builder can be passed through multiple processing stages, middleware pipelines, or user wizard forms. Each phase of your application adds its relevant parameters to the builder instance.

Only when all prerequisite data has been collected and verified does the application invoke `builder.build()`. This guarantees that partially initialized objects are never exposed to domain logic, preserving system invariants.

| Construction Stage | Application Responsibility | Builder Action |
|---|---|---|
| **Stage 1: Routing** | Determine requested endpoint | `builder.setPath('/api/users')` |
| **Stage 2: Auth Middleware** | Attach bearer token | `builder.setHeader('Authorization', token)` |
| **Stage 3: Body Parser** | Attach payload | `builder.setBody(JSON.stringify(data))` |
| **Stage 4: Dispatcher** | Validate and send | `const req = builder.build()` |

> **Tip:** You can implement a reset method on the builder (such as `builder.reset()`) to reuse the same builder instance for assembling subsequent objects in high-throughput loops.

## See it

```typescript
class HttpRequestBuilder {
  private url = '';
  private method: 'GET' | 'POST' = 'GET';
  private headers: Record<string, string> = {};

  setUrl(url: string) { this.url = url; }
  setMethod(method: 'GET' | 'POST') { this.method = method; }
  addHeader(key: string, val: string) { this.headers[key] = val; }

  build() {
    if (!this.url) throw new Error('Cannot build request without URL');
    return {
      url: this.url,
      method: this.method,
      headers: { ...this.headers },
    };
  }
}

const reqBuilder = new HttpRequestBuilder();
reqBuilder.setUrl('https://api.example.com/items');
reqBuilder.addHeader('Accept', 'application/json');
const request = reqBuilder.build();
```

## Go deeper

In strongly typed languages like TypeScript, advanced developers can use the "Step Builder" or "Type-Safe Builder" pattern with phantom types. By changing the builder's generic type parameter after each step, the compiler forces callers to invoke required setter methods in an exact sequence, preventing calls to `build()` until all mandatory steps are satisfied.

## Watch out

- Prevent mutation of the assembled object after build() has executed; return frozen or cloned data.
- Watch out for shared mutable state if a builder instance is reused across concurrent asynchronous tasks.

## Remember

- Builder allows object assembly to occur in distinct stages over time.
- Incomplete objects are kept isolated inside the builder until build() is triggered.
- Validation in build() ensures only fully valid objects enter domain business logic.
