---
slug: observer-memory-leaks-and-cleanup
title: "Lapsed Listeners & Unsubscription Cleanup"
topic: behavioral-coordination
kind: pitfall
summary: "Failing to detach registered observers creates memory leaks through dangling references; always unsubscribe."
tags:
  - behavioral
  - observer
  - memory-leaks
  - cleanup
  - lapsed-listener
related:
  - observer-intent
  - subject-observer-subscription
  - push-vs-pull-observer
---

> **In one line:** Failing to detach registered observers prevents garbage collection, causing the infamous Lapsed Listener memory leak.

## The idea

The most notorious architectural hazard of the Observer pattern is the **Lapsed Listener Problem**—one of the leading causes of memory leaks in long-running graphical applications and single-page web apps.

When an observer registers itself with a long-lived Subject (such as a global event bus, window resize listener, or application store), the Subject adds the observer to its internal collection. This creates a strong memory reference pointing from the Subject to the Observer.

If the user closes the UI component (e.g., navigating away from a page), you might assume the component is destroyed. However, because the long-lived Subject still holds a reference to it in its subscriber list, the garbage collector **cannot reclaim the component**. The component stays alive in memory, continuing to process notifications and wasting CPU cycles and RAM.

| Lifecycle Stage | Correct Behavior | Leaky Behavior |
|---|---|---|
| **Mount / Init** | Attach observer to subject | Attach observer to subject |
| **Execution** | Receives notifications | Receives notifications |
| **Unmount / Destroy** | **Explicitly detach observer** | Forget to detach (stays in subject list) |
| **Garbage Collector** | Successfully reclaims component memory | **BLOCKED**: subject reference keeps object alive |

> **Watch out:** In React `useEffect` hooks, always return a cleanup function that unsubscribes. In Angular components, implement `ngOnDestroy` and unsubscribe from all active subscriptions.

## See it

```typescript
// Memory Leak Trap: Component destroyed but remains in Subject
class GlobalEventBus {
  static listeners: Array<() => void> = [];
  static subscribe(fn: () => void) { this.listeners.push(fn); }
  static unsubscribe(fn: () => void) {
    this.listeners = this.listeners.filter(cb => cb !== fn);
  }
}

class LeakyWidget {
  private handler = () => console.log('Widget active');
  mount() { GlobalEventBus.subscribe(this.handler); }
  // Bug: No destroy() or cleanup implemented!
  // Widget will NEVER be garbage collected!
}

class CleanWidget {
  private handler = () => console.log('Widget active');
  mount() { GlobalEventBus.subscribe(this.handler); }
  destroy() { GlobalEventBus.unsubscribe(this.handler); } // Memory safe!
}
```

## Go deeper

Modern JavaScript provides `WeakRef` and `FinalizationRegistry`, which allow the creation of "Weak Observers". A subject holding a `WeakRef` to an observer does not prevent the observer from being garbage collected. However, weak references add complexity; explicit deterministic unsubscription remains the industry standard.

## Watch out

- Never use anonymous inline arrow functions in subscribe() if you need to unsubscribe later by reference equality.
- Watch for multi-page component transitions where forgotten listeners duplicate notifications on each page visit.

## Remember

- The Lapsed Listener problem occurs when long-lived subjects hold strong references to dead observers.
- Failing to unsubscribe prevents garbage collection and leaks memory continuously.
- Always implement deterministic cleanup in component teardown lifecycles (destroy/unmount).
