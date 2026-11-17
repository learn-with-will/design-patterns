---
slug: memento-tradeoffs
title: "Memento Trade-offs & Memory Cost"
topic: behavioral-coordination
kind: pitfall
summary: "Frequent full-state mementos consume heavy memory; use delta-compression or limit caretaker history depth."
tags:
  - behavioral
  - memento
  - tradeoffs
  - memory
  - pitfall
related:
  - memento-intent
  - memento-state-snapshots
  - command-intent
---

> **In one line:** Memento can rapidly exhaust memory if full-state snapshots are captured frequently without retention limits.

## The idea

The Memento pattern provides unparalleled safety and simplicity when implementing state rollback, but its primary liability is **unbounded memory consumption**.

If an application object contains a 10 MB document and captures a full-state Memento on every single keystroke or command, saving 100 undo steps consumes 1 GB of RAM! In browser environments or mobile devices, this leads to aggressive garbage collection pauses and out-of-memory crashes.

To keep Memento practical in production systems, architects must implement retention policies and memory optimization strategies:
1. **History Capping**: Limit the Caretaker to a rolling window (e.g., maximum 30 undo snapshots), discarding the oldest mementos.
2. **Delta Compression**: Store only the delta (diff) between successive states rather than full snapshots.
3. **Lazy Storage**: Serialize inactive mementos to IndexedDB or local disk and evict them from active memory.

| Optimization Strategy | Memory Impact | Complexity |
|---|---|---|
| **Capped History Stack** | Predictable upper memory limit | Trivial: slice array when length > N |
| **Delta State Diffing** | 90% reduction in memory footprint | Moderate: requires diff/patch algorithms |
| **Hybrid with Command** | Reversible actions calculate reverse deltas | High: commands must implement full undo logic |

> **Watch out:** Be careful when choosing between Command undo and Memento undo. Command undo stores instructions (minimal memory, complex code); Memento stores state (heavy memory, simple code).

## See it

```typescript
class BoundedHistoryCaretaker {
  private history: GameCheckpoint[] = [];
  constructor(private maxDepth = 20) {}

  save(cp: GameCheckpoint): void {
    this.history.push(cp);
    // Enforce bounded history to prevent memory leaks
    if (this.history.length > this.maxDepth) {
      this.history.shift(); // Discard oldest snapshot
    }
  }

  pop(): GameCheckpoint | undefined {
    return this.history.pop();
  }
}
```

## Go deeper

In functional programming and modern state libraries (like Redux with Immer), persistent data structures (structural sharing) provide an elegant solution to Memento's memory problem. When an object is modified, unchanged branches of the state tree share memory pointers with the previous snapshot; only modified nodes allocate new memory.

## Watch out

- Never allow an unbounded history array to grow indefinitely in long-running single-page applications.
- Do not store open file handles, active socket connections, or DOM nodes inside mementos.

## Remember

- Frequent full-state mementos can rapidly exhaust system memory.
- Bound caretaker history depth to ensure predictable upper memory limits.
- Consider structural sharing or delta diffing when state trees exceed several megabytes.
