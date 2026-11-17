---
slug: middleware-pipelines
title: "Chain of Responsibility in HTTP Middleware"
topic: behavioral-requests
kind: technique
summary: "Implement Express-like request pipelines where authentication, logging, and rate-limiting execute sequentially."
tags:
  - behavioral
  - chain-of-responsibility
  - middleware
  - http
  - express
related:
  - chain-of-responsibility-intent
  - handler-chain-linking
  - chain-of-responsibility-tradeoffs
---

> **In one line:** Modern web frameworks use Chain of Responsibility to implement sequential HTTP request middleware pipelines.

## The idea

In modern web development, HTTP server architectures (such as Express, Koa, Fastify, and ASP.NET Core) represent the most ubiquitous real-world application of the Chain of Responsibility pattern: the **Middleware Pipeline**.

When an HTTP request arrives, it must pass through multiple operational concerns before reaching the final business controller:
1. **Logging Middleware**: Logs HTTP method, URL, and timestamp.
2. **CORS Middleware**: Validates and attaches cross-origin headers.
3. **Authentication Middleware**: Decodes and verifies JWT bearer tokens.
4. **Rate Limiting Middleware**: Checks Redis request quotas.

Each middleware function acts as a handler in the chain. It can inspect and mutate the request context, reject the request early (e.g., returning HTTP 401 Unauthorized), or invoke `next()` to pass control to the subsequent middleware.

| Middleware Phase | Action Taken | Can Halt Chain? |
|---|---|---|
| **Logger** | Records start time | No: always calls `next()` |
| **Auth** | Verifies token | **Yes**: returns 401 if invalid |
| **Rate Limiter** | Checks quota | **Yes**: returns 429 if quota exceeded |
| **Controller** | Returns response | Terminates chain; returns JSON |

> **Tip:** The `next()` function parameter in Express or Koa is the programmatic successor pointer in the Chain of Responsibility, abstracting object references into a functional callback.

## See it

```typescript
type HttpContext = { path: string; authorized: boolean };
type Middleware = (ctx: HttpContext, next: () => void) => void;

class Pipeline {
  private middlewares: Middleware[] = [];
  use(fn: Middleware): this { this.middlewares.push(fn); return this; }

  execute(ctx: HttpContext): void {
    let index = 0;
    const next = () => {
      if (index < this.middlewares.length) {
        this.middlewares[index++](ctx, next);
      }
    };
    next();
  }
}

const app = new Pipeline();
app.use((ctx, next) => { console.log(`Request to ${ctx.path}`); next(); });
app.use((ctx, next) => {
  if (!ctx.authorized) { console.log('401 Unauthorized!'); return; }
  next();
});
app.execute({ path: '/admin', authorized: false });
```

## Go deeper

Koa popularized the "Onion Model" of middleware. In an onion model, each middleware executes its pre-processing logic, calls `await next()`, and then resumes execution to perform post-processing *after* all downstream handlers and controllers have finished. This combines Chain of Responsibility with Decorator mechanics in an elegant async pipeline.

## Watch out

- Forgetting to call next() causes the request pipeline to hang indefinitely, timing out client connections.
- Calling next() multiple times inside a single handler can trigger race conditions and corrupted responses.

## Remember

- HTTP middleware pipelines are functional adaptations of Chain of Responsibility.
- Handlers can short-circuit the pipeline early by returning error responses directly.
- Calling next() forwards execution to the subsequent handler in the pipeline.
