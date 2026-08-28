---
id: lesson-19
slug: memento
title: "Memento"
level: advanced
order: 19
duration: 15
tags:
  - behavioral
  - memento
  - undo
  - state
  - gof
summary: "The Memento pattern — capture an object's internal state into an opaque snapshot that can be stored and later used to restore the object, all without exposing or breaking the object's encapsulation, the foundation of reliable undo."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Memento pattern.
- Name its three roles: **Originator**, **Memento**, **Caretaker**.
- Implement save/restore snapshots in TypeScript.
- Explain how Memento preserves **encapsulation** and pairs with Command for undo.

# Why It Matters

Undo is everywhere — editors, drawing apps, forms — and the honest way to implement it is to
**snapshot** an object's state and restore it later. But you don't want to expose all of an object's
internals just to save them, or every other class could poke at them. **Memento** captures state in an
**opaque** snapshot: the object produces it and can read it back, while everyone else can only hold it,
not inspect it.

# Concept Explanation

### Intent

> **Without violating encapsulation, capture and externalize an object's internal state so that the
> object can be restored to this state later.** — Gang of Four

### The three roles

- **Originator** — the object whose state you snapshot; it **creates** mementos and **restores** itself
  from them.
- **Memento** — the snapshot. It holds the state but is **opaque** to everyone except the originator.
- **Caretaker** — keeps mementos (e.g. an undo history) but **never inspects or changes** them; it just
  stores and hands them back.

```text
   Originator ──save()──▶ Memento ──kept by──▶ Caretaker (history)
   Originator ◀─restore()── Memento ◀─handed back─ Caretaker
```

### In TypeScript

```typescript
// Memento: an opaque snapshot. Only the Editor is meant to read it back.
class EditorMemento {
  constructor(readonly content: string) {}
}

// Originator: creates and restores snapshots of its own state.
class Editor {
  private content = "";
  type(text: string) { this.content += text; }
  getContent() { return this.content; }

  save(): EditorMemento { return new EditorMemento(this.content); }
  restore(memento: EditorMemento) { this.content = memento.content; }
}

// Caretaker: keeps a history of mementos but doesn't look inside them.
class History {
  private stack: EditorMemento[] = [];
  push(m: EditorMemento) { this.stack.push(m); }
  undo(): EditorMemento | undefined { return this.stack.pop(); }
}

const editor = new Editor();
const history = new History();

editor.type("Hello");
history.push(editor.save());   // snapshot after "Hello"
editor.type(", world");
const previous = history.undo();
if (previous) editor.restore(previous); // back to "Hello"
```

The `History` never reads `content`; it only stores and returns mementos. Encapsulation is preserved —
only the `Editor` knows what's inside its snapshot.

### Encapsulation in TypeScript

The Memento's promise is that the caretaker can't tamper with the snapshot. TypeScript's `readonly` and
`#private` fields help enforce this. (Historically, TypeScript's `private` is a compile-time check
only; runtime-private `#fields` make the snapshot genuinely opaque.) Either way, the intent is: **only
the originator interprets the memento**.

### Memento and Command

Memento is the natural partner of **Command** for undo. A command can capture a memento before it runs
and restore it in `undo()`, so complex changes roll back cleanly without the command needing to know how
to reverse every field.

### Consequences

- **Good:** enables undo/rollback and snapshots without exposing internals; keeps state-saving logic
  inside the originator.
- **Cost:** snapshots can be **memory-heavy** if state is large or you keep a long history; deciding
  *what* to include in a memento takes care.

# Key Terminology

- **Originator** — the object being snapshotted; creates and restores mementos.
- **Memento** — the opaque state snapshot.
- **Caretaker** — stores mementos without inspecting them.
- **Snapshot** — a captured copy of state at a moment in time.

# Options and Trade-offs

| Concern | Memento | Expose all fields for saving | How to choose |
| ------- | ------- | ---------------------------- | ------------- |
| Encapsulation | Preserved (opaque snapshot) | Broken (everyone sees internals) | Memento to keep internals private. |
| Memory | Snapshots cost space | — | Limit history depth or store diffs for large state. |
| Simplicity | Three roles | Fewer, but leaky | For trivial state a simple copy may suffice. |

# Worked Example

Bound the undo history so memory doesn't grow forever:

```typescript
class BoundedHistory {
  private stack: EditorMemento[] = [];
  constructor(private limit = 50) {}
  push(m: EditorMemento) {
    this.stack.push(m);
    if (this.stack.length > this.limit) this.stack.shift(); // drop the oldest
  }
  undo() { return this.stack.pop(); }
}
```

Keeping only the last 50 snapshots caps memory while still supporting plenty of undo steps.

# Real World Analogy

A Memento is like a **video game save point** or the **"restore from backup"** button. The game writes
your progress into a save file (opaque to you — you don't hand-edit it) and can reload it later to put
you exactly where you were. The save manager keeps the files but doesn't understand their contents.

# Examples

## Example 1 — Basic: undo one step

After typing "Hello", saving, then typing ", world", restoring the saved memento returns the editor to
"Hello". The caretaker only stored the snapshot.

**Why this works:** the originator captured and restored its own state; the caretaker stayed hands-off.

## Example 2 — Real-world: editors and forms

Text editors, graphics tools, and multi-step forms snapshot state so a user can step backward. Each
"undo" pops a memento and restores it.

**Why this works:** restoring a whole prior state is simpler and safer than trying to reverse each
individual change.

## Example 3 — Pitfall: unbounded, heavy snapshots

Saving a deep copy of a large document on every keystroke, forever, exhausts memory.

**Why this bites:** mementos cost memory; you must bound the history or store compact diffs for large
state.

# Common Mistakes

- **Letting the caretaker read or modify mementos.** They must stay opaque to preserve encapsulation.
- **Snapshotting too much, too often.** Bound the history and snapshot at meaningful points.
- **Confusing Memento with Command.** Memento stores state to restore; Command represents an action to
  perform/undo (they often work together).

# Best Practices

- Keep mementos **opaque** — only the originator interprets them (use `readonly`/`#private`).
- **Bound** the history or store **diffs** for large state.
- Pair Memento with **Command** to implement clean undo/redo.

# Summary

- **Memento** captures an object's state in an **opaque snapshot** so it can be restored later, without
  breaking encapsulation.
- Its three roles are **Originator** (save/restore), **Memento** (the snapshot), and **Caretaker**
  (stores it, hands-off).
- It's the foundation of **undo**, and pairs naturally with **Command**.
- Watch memory: bound the history or store diffs for large state.

# Flash Cards

Q: What is the intent of the Memento pattern?
A: Capture and externalize an object's internal state, without violating encapsulation, so the object can be restored to that state later.

Q: What are the three roles in Memento?
A: Originator (creates and restores snapshots of its own state), Memento (the opaque snapshot), and Caretaker (stores mementos without inspecting them).

Q: Why must the caretaker treat a memento as opaque?
A: To preserve encapsulation — only the originator should interpret the snapshot, so other objects can't read or tamper with the saved internals.

Q: Which pattern does Memento commonly pair with, and for what?
A: Command — a command can capture a memento before executing and restore it in undo(), giving clean undo/redo.

Q: What is the main cost of using Memento?
A: Memory — snapshots can be large, and keeping a long history multiplies that, so you often bound the history or store diffs.

Q: How does Memento differ from Command?
A: Memento stores state so it can be restored; Command represents an action to perform (and possibly undo). They frequently work together.

# Exercises

### Easy
Identify the Originator, Memento, and Caretaker in the editor example, and explain why `History` never
reads `content`.

### Medium
Add a `redo()` capability: keep a second stack so that undoing pushes the current state onto a redo
stack, and redo restores it. Use mementos for both.

### Challenging
The editor snapshots the entire content on every save, which is wasteful for large documents. Sketch a
memento that stores a **diff** (what changed) instead of the full content, and describe the trade-off
versus full snapshots.

# Further Reading

- Gamma et al. — *Design Patterns*, "Memento".
- Refactoring.Guru — *Memento*: <https://refactoring.guru/design-patterns/memento>
- Refactoring.Guru — *Memento in TypeScript*: <https://refactoring.guru/design-patterns/memento/typescript/example>
