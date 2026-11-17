---
slug: originator-caretaker-memento
title: "Originator, Caretaker, and Memento Roles"
topic: behavioral-coordination
kind: technique
summary: "The Originator creates and restores snapshots; the Caretaker holds mementos safely without inspecting their contents."
tags:
  - behavioral
  - memento
  - caretaker
  - originator
  - roles
related:
  - memento-intent
  - memento-state-snapshots
  - memento-tradeoffs
---

> **In one line:** The Originator creates and unpacks mementos; the Caretaker manages their storage and lifecycle.

## The idea

The Gang of Four defines three distinct participants in the Memento pattern:

1. **The Originator**: The domain object that possesses the internal state. The originator creates a Memento containing a snapshot of its current state via `save()`, and restores its state when passed a Memento via `restore(memento)`.
2. **The Memento**: The immutable snapshot object. It stores the originator's internal state. In classic GoF design, the memento exposes a wide interface to the originator (allowing full state read) and a narrow interface to everyone else (opaque or empty).
3. **The Caretaker**: The manager responsible for the memento's safekeeping (e.g., an undo manager, history list, or save-file repository). The Caretaker never inspects or mutates memento contents; it simply stores them in an array or map and hands them back to the originator when requested.

| Participant | What It Knows | What It Is Allowed To Do |
|---|---|---|
| **Originator** | Its own full internal state | Creates mementos; restores state from mementos |
| **Memento** | Saved snapshot state | Stores state immutably; exposes data to Originator |
| **Caretaker** | History list / timestamps | Stores and retrieves mementos; **never** alters contents |

> **Tip:** In TypeScript, you can enforce the narrow interface by typing the memento as an empty marker interface `interface Memento {}` for the Caretaker, while the Originator casts it internally to read state.

## See it

```typescript
// Narrow interface for the Caretaker
interface Memento {}

class ConcreteMemento implements Memento {
  constructor(public readonly state: string) {}
}

class TextOriginator {
  private text = '';
  setText(t: string) { this.text = t; }
  getText() { return this.text; }

  save(): Memento { return new ConcreteMemento(this.text); }
  restore(m: Memento): void {
    this.text = (m as ConcreteMemento).state;
  }
}

// Caretaker manages history safely without touching contents
class Caretaker {
  private history: Memento[] = [];
  push(m: Memento) { this.history.push(m); }
  pop(): Memento | undefined { return this.history.pop(); }
}
```

## Go deeper

In languages like C++, the Memento pattern was implemented using `friend class`, making the memento's private constructors and fields accessible exclusively to the Originator. In TypeScript, TypeScript private identifiers, symbols, or module-scoped types provide equivalent encapsulation guarantees.

## Watch out

- Ensure the Caretaker does not attempt to parse or modify memento state properties directly.
- Be careful when restoring mementos that dependencies referenced inside the memento are still valid.

## Remember

- The Originator creates and restores snapshots using its full private knowledge.
- The Caretaker stores and manages mementos without inspecting or altering their contents.
- Narrow and wide interfaces ensure state remains strictly encapsulated within the Originator.
