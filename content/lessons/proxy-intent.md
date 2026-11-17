---
slug: proxy-intent
title: "Proxy: Intent & Surrogate Objects"
topic: structural-proxies
kind: pattern
summary: "Proxy provides a surrogate or placeholder for another object to control, meter, or delay access to it."
tags:
  - structural
  - proxy
  - surrogate
  - access-control
related:
  - virtual-proxy-lazy-loading
  - protection-and-caching-proxies
  - proxy-vs-decorator-vs-adapter
---

> **In one line:** Proxy provides a surrogate placeholder that controls, delays, or audits access to another target object.

## The idea

In software development, you often need to access objects that are resource-intensive to create (a massive image file, a remote database connection), sensitive to access (requiring authentication checks), or located across a network boundary.

Instantiating or accessing these heavy objects directly can degrade application performance, violate security boundaries, or introduce network latency into UI threads.

The Gang of Four's **Proxy** pattern addresses this. Its official intent is: **"Provide a surrogate or placeholder for another object to control access to it."** A Proxy implements the exact same interface as the real service object. When clients interact with the proxy, the proxy intercepts the calls and performs intermediate tasks—such as lazy initialization, access permission checks, caching, or logging—before forwarding the request to the real service.

| Participant | Role | Example |
|---|---|---|
| **Subject** | Common interface implemented by both RealSubject and Proxy | `interface VideoDownloader` |
| **RealSubject** | The actual service object that does the real heavy work | `class YouTubeService` |
| **Proxy** | Intercepts calls, controls access, and delegates to RealSubject | `class CachedYouTubeProxy` |
| **Client** | Interacts exclusively via the Subject interface | Application UI view |

> **Note:** Because the Proxy and the RealSubject share the exact same interface, the proxy is completely transparent to clients: you can substitute a proxy in place of the real object without altering client code.

## See it

```typescript
// Subject interface
interface DatabaseAccess {
  query(sql: string): string;
}

// RealSubject: heavy or privileged
class RealDatabaseAccess implements DatabaseAccess {
  query(sql: string) { return `Results for ${sql}`; }
}

// Proxy controls access
class LoggingDatabaseProxy implements DatabaseAccess {
  constructor(private realDb: RealDatabaseAccess) {}

  query(sql: string): string {
    console.log(`[AUDIT LOG] Query executed: ${sql} at ${new Date().toISOString()}`);
    return this.realDb.query(sql); // Delegating to real subject
  }
}
```

## Go deeper

The Gang of Four categorized several classic varieties of Proxy based on their intent:
- **Virtual Proxy**: Defers expensive instantiation until the object is actually used (lazy loading).
- **Protection Proxy**: Verifies caller security credentials and permissions.
- **Remote Proxy**: Represents an object located on a remote server or process (RPC / RMI).
- **Caching Proxy**: Caches responses to identical calls to eliminate redundant network or disk I/O.

## Watch out

- Ensure the proxy implements the full Subject interface so client polymorphism remains unbroken.
- Watch out for added latency if the proxy executes complex pre-processing on high-throughput method calls.

## Remember

- Proxy provides a surrogate placeholder that controls and manages access to a target object.
- The Proxy and the RealSubject implement the exact same interface for complete client transparency.
- Proxies handle lazy loading, security checks, caching, and audit logging before delegating calls.
