---
slug: protection-and-caching-proxies
title: "Protection, Caching, and Remote Proxies"
topic: structural-proxies
kind: technique
summary: "Use proxies to verify user permissions, cache expensive remote responses, and log execution metrics."
tags:
  - structural
  - proxy
  - security
  - caching
  - remote
related:
  - proxy-intent
  - virtual-proxy-lazy-loading
  - proxy-vs-decorator-vs-adapter
---

> **In one line:** Protection proxies enforce security permissions, while caching proxies store results to avoid redundant calls.

## The idea

Beyond lazy loading, two of the most critical proxy variants in enterprise application development are **Protection Proxies** and **Caching Proxies**.

A **Protection Proxy** enforces role-based access control (RBAC). It intercepts method calls, inspects the current user's security context or auth token, and verifies that the caller has sufficient permissions to execute the operation. If authorized, it delegates to the real service; otherwise, it throws an authorization exception.

A **Caching Proxy** maintains a local cache of responses from an expensive service (such as a third-party billing API or slow database query). When a method is called with identical arguments, the proxy returns the cached result immediately, bypassing the expensive real service entirely.

| Proxy Variant | Primary Concern | When Intercepting |
|---|---|---|
| **Protection Proxy** | Security & Authorization | Checks user role/token before allowing execution |
| **Caching Proxy** | Performance & I/O Reduction | Checks cache map before invoking underlying service |
| **Remote Proxy** | Network Encapsulation | Marshals parameters across network sockets / HTTP |

> **Tip:** You can stack multiple proxies together: a client can talk to a `ProtectionProxy` that guards a `CachingProxy` that delegates to a `RealService`. Each proxy focuses strictly on its single responsibility.

## See it

```typescript
interface WeatherService {
  getTemperature(city: string): string;
}

class RealWeatherService implements WeatherService {
  getTemperature(city: string) {
    console.log(`Fetching live weather API for ${city}...`);
    return '22°C';
  }
}

class CachingWeatherProxy implements WeatherService {
  private cache = new Map<string, string>();
  constructor(private service: WeatherService) {}

  getTemperature(city: string): string {
    if (!this.cache.has(city)) {
      const temp = this.service.getTemperature(city);
      this.cache.set(city, temp);
    }
    return this.cache.get(city)!;
  }
}
```

## Go deeper

Remote Proxies hide the complexity of distributed systems. In gRPC or RPC frameworks, the client generates a local client stub. To the programmer, calling `userService.getUser(id)` looks like a normal local method call. Under the hood, the remote proxy serializes arguments into Protocol Buffers, transmits them over HTTP/2, receives the response, and returns the result.

## Watch out

- Ensure caching proxies implement appropriate TTL (time-to-live) expiration to prevent stale data.
- Never rely solely on client-side protection proxies for security; always validate permissions on server boundaries.

## Remember

- Protection proxies intercept calls to verify user credentials and access permissions.
- Caching proxies store results to eliminate redundant network requests and database queries.
- Remote proxies encapsulate network serialization, making remote calls appear local to clients.
