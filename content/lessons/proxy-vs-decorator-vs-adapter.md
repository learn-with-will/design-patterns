---
slug: proxy-vs-decorator-vs-adapter
title: "Proxy vs Decorator vs JavaScript Proxy"
topic: structural-proxies
kind: concept
summary: "Proxy controls access with an identical interface; Decorator enriches behavior; JS Proxy is a built-in metaprogramming hook."
tags:
  - structural
  - proxy
  - decorator
  - adapter
  - comparison
related:
  - proxy-intent
  - decorator-intent
  - adapter-intent
---

> **In one line:** Proxy controls access to a target; Decorator dynamically enriches behavior; JavaScript Proxy is a built-in runtime hook.

## The idea

Because Proxy, Decorator, and Adapter all wrap other objects, distinguishing their boundaries is an essential software architecture skill. Additionally, modern JavaScript features a built-in `Proxy` global object that must be understood in context.

**Adapter** provides a **different interface** to an existing object to resolve an API incompatibility.

**Decorator** provides the **exact same interface**, but its primary intent is to **add new behaviors and responsibilities** dynamically (e.g., adding encryption, borders, or logging).

**Proxy** provides the **exact same interface**, but its primary intent is to **control access** to the real subject (e.g., lazy loading, authorization, caching, or remote surrogate). The proxy does not add business features; it controls *when and how* the real object is accessed.

**JavaScript's `Proxy` object** (`new Proxy(target, handler)`) is a built-in language feature for metaprogramming that intercepts object operations (property get/set, method apply, construct). It is a powerful tool often used to *implement* the GoF Proxy or Decorator patterns, but is distinct as a language mechanism.

| Pattern | Interface | Primary Intent | Relationship to Target |
|---|---|---|---|
| **Adapter** | Different from target | Reconcile incompatible interfaces | Wraps existing adaptee instance |
| **Decorator** | Same as target | Add new behavior/features dynamically | Wraps component; often stacked |
| **Proxy** | Same as target | Control access, lifecycle, or location | Manages lifecycle of target instance |
| **JS `Proxy`** | Dynamic trap handler | Intercept language operations | Metaprogramming wrapper in JS engine |

> **Note:** A key structural difference: A Decorator is passed its component by the client (`new Decorator(comp)`). A Proxy often manages the creation of its RealSubject internally (`if (!this.real) this.real = new Real()`).

## See it

```typescript
// Built-in JavaScript Proxy implementing a logging proxy
const realUser = { name: 'Alice', role: 'admin' };

const loggedUserProxy = new Proxy(realUser, {
  get(target, prop, receiver) {
    console.log(`Property '${String(prop)}' was accessed`);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log(`Setting '${String(prop)}' to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log(loggedUserProxy.name); // Logs access, returns 'Alice'
```

## Go deeper

Frameworks like Vue 3 use JavaScript's built-in `Proxy` object to implement their reactivity system. When component state properties are accessed during template rendering, the proxy traps track dependencies; when properties are mutated, the proxy setter triggers component re-renders. This is an elegant real-world synthesis of the Proxy and Observer patterns.

## Watch out

- Do not use Proxy when your intent is to add optional business capabilities; use Decorator instead.
- Be aware that built-in JavaScript Proxies carry minor performance overhead compared to raw object property access.

## Remember

- Proxy controls access, lifecycle, and security without changing the core business interface.
- Decorator enhances and layers new behavior onto objects using identical interfaces.
- JavaScript's native Proxy object is a metaprogramming trap hook ideal for implementing proxy patterns.
