---
slug: memento-intent
title: "Memento: Intent & Encapsulated Snapshots"
topic: behavioral-coordination
kind: pattern
summary: "Without violating encapsulation, capture and externalize an object's internal state so it can be restored later."
tags:
  - behavioral
  - memento
  - snapshot
  - encapsulation
related:
  - originator-caretaker-memento
  - memento-state-snapshots
  - memento-tradeoffs
---

> **In one line:** Memento captures and externalizes an object's internal state without violating encapsulation for future restoration.

## The idea

In interactive applications, you frequently need to take snapshots of an object's state: saving game checkpoints, creating backup points, or supporting an undo mechanism.

The naive approach is to make all fields of the object `public` so an external manager can read them, save them, and write them back later. However, exposing internal fields completely destroys **encapsulation**. Internal implementation details leak into outside managers, tightly coupling the manager to the object's private data structures.

The Gang of Four's **Memento** pattern solves this dilemma. Its official intent is: **"Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later."** The object itself (the Originator) packages its private state into an opaque snapshot object (the Memento). Outside classes can hold the memento, but cannot inspect or modify its contents.

| Approach | Encapsulation | Coupling | Security of Internal State |
|---|---|---|---|
| **Public Getters/Setters** | Destroyed: private fields exposed | High: manager tied to internal data | Poor: anyone can mutate internals |
| **Memento Pattern** | **Preserved**: fields stay private | Zero: manager treats snapshot as opaque | High: only Originator can read/restore |

> **Note:** A Memento is an opaque box: external caretakers hold the box, pass the box, and store the box on disk, but only the Originator that created the box has the key to open it.

## See it

```typescript
// Memento: stores immutable snapshot of state
class EditorMemento {
  constructor(private readonly state: string) {}
  getState(): string { return this.state; } // Accessible to Originator
}

// Originator: the object with private state to preserve
class Editor {
  private content = '';

  type(words: string) { this.content += words; }
  getContent() { return this.content; }

  // Creates snapshot without leaking private field references
  save(): EditorMemento {
    return new EditorMemento(this.content);
  }

  // Restores state from snapshot
  restore(memento: EditorMemento): void {
    this.content = memento.getState();
  }
}
```

## Go deeper

Memento is essential for transactional databases and games. When a player reaches a save point, the game engine creates a Memento capturing health, inventory, and world flags. The save-game manager writes the opaque memento to disk. If the player dies, the engine loads the memento and passes it back to the game world originator to restore state.

## Watch out

- Do not allow outside classes to mutate memento internal data; mementos must be strictly immutable.
- Watch out for memory consumption when creating frequent full-state mementos of massive objects.

## Remember

- Memento captures an object's internal state without violating object encapsulation.
- The snapshot is treated as an opaque black box by external storage managers.
- Only the Originator that created the memento has the authority to read and restore its contents.
