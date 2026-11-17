---
slug: memento-state-snapshots
title: "Implementing Snapshots and Checkpoints"
topic: behavioral-coordination
kind: technique
summary: "Save game checkpoints or text editor document states into immutable memento objects for point-in-time recovery."
tags:
  - behavioral
  - memento
  - checkpoints
  - snapshots
  - immutability
related:
  - memento-intent
  - originator-caretaker-memento
  - memento-tradeoffs
---

> **In one line:** Implement point-in-time checkpoints by serializing deep immutable state snapshots into mementos.

## The idea

When implementing Memento for real-world applications—such as game level checkpoints or financial ledger snapshots—the snapshot data must be completely insulated from subsequent object mutations.

If the Originator stores complex mutable objects (such as inventory arrays or configuration dictionaries) directly into the Memento by reference, future mutations to the Originator will silently alter the "saved" memento!

To ensure genuine state preservation, the Originator must perform a **deep clone** or serialize its state when producing the memento. Using native JavaScript `structuredClone()` or JSON serialization guarantees that the memento represents an unalterable point-in-time snapshot.

| Snapshot Technique | Performance | Safety | Use Case |
|---|---|---|---|
| **Shallow Copy** | Fastest | Unsafe: nested objects shared | Pure primitive state only |
| **Deep Clone (structuredClone)** | Fast | Safe: complete state isolation | Complex nested objects and maps |
| **JSON Serialization** | Moderate | Safe: unalterable string snapshot | Save-to-disk / persistent checkpoint |
| **Delta Compression** | Advanced | Safe: stores diff only | Frequent snapshots with huge state |

> **Tip:** You can attach metadata to mementos (such as timestamp, snapshot name, or user description) accessible to the Caretaker, so the UI can display a list of named save points to users.

## See it

```typescript
interface GameState { level: number; score: number; inventory: string[]; }

class GameCheckpoint {
  constructor(
    private readonly state: GameState,
    public readonly timestamp: Date
  ) {}
  getState(): GameState { return structuredClone(this.state); }
}

class GameSession {
  private state: GameState = { level: 1, score: 0, inventory: ['sword'] };

  levelUp() { this.state.level++; this.state.score += 500; }
  addLoot(item: string) { this.state.inventory.push(item); }

  createCheckpoint(): GameCheckpoint {
    // Deep clone state to guarantee immutability
    return new GameCheckpoint(structuredClone(this.state), new Date());
  }

  loadCheckpoint(cp: GameCheckpoint): void {
    this.state = cp.getState();
  }
}
```

## Go deeper

For very large states (e.g., an interactive graphics canvas with 50,000 vectors), capturing full-state snapshots on every user stroke consumes excessive memory. Advanced implementations use **Delta Mementos**: the memento records only the difference (diff) between the previous state and the current state, achieving dramatic memory efficiency.

## Watch out

- Never store mutable object references directly into mementos without deep copying.
- Remember that restoring a memento replaces current state completely; confirm user intent before loading.

## Remember

- Mementos must capture completely independent, immutable copies of the originator's state.
- Deep cloning via structuredClone() ensures subsequent mutations do not corrupt saved snapshots.
- Mementos can expose public metadata (such as timestamps) to assist caretakers in managing history.
