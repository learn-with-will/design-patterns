---
id: lesson-16
slug: command
title: "Command"
level: intermediate
order: 16
duration: 16
tags:
  - behavioral
  - command
  - undo
  - queue
  - gof
summary: "The Command pattern — turn a request into a standalone object carrying everything needed to perform it, so requests can be passed around, queued, logged, and — crucially — undone, decoupling the object that triggers an action from the one that performs it."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Command pattern.
- Implement commands with `execute()` and `undo()` in TypeScript.
- Explain how Command enables **undo/redo, queues, and logging**.
- Know when a plain function is enough and when the object form pays off.

# Why It Matters

A button, a menu item, and a keyboard shortcut might all "save the document." If each hard-codes the
save logic, you can't reuse it, queue it, log it, or undo it. **Command** wraps the *action* in an
object — with all the data it needs — so the thing that **triggers** it (the button) is decoupled from
the thing that **performs** it. Once an action is an object, you can store it, replay it, and reverse
it.

# Concept Explanation

### Intent

> **Encapsulate a request as an object, thereby letting you parameterize clients with different
> requests, queue or log requests, and support undoable operations.** — Gang of Four

### The participants

- **Command** — the interface, typically `execute()` (and often `undo()`).
- **Concrete Command** — binds a **receiver** to an action and stores any needed arguments.
- **Receiver** — the object that knows how to do the real work.
- **Invoker** — triggers the command (`execute`) without knowing what it does.
- **Client** — creates commands and wires them to receivers.

```text
   Invoker ─▶ Command.execute() ─▶ Receiver does the work
                    ▲
                 Client builds it
```

### In TypeScript

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver: knows how to do the actual work.
class Light {
  isOn = false;
}

// Concrete command: binds an action to a receiver, and knows how to reverse it.
class TurnOn implements Command {
  constructor(private light: Light) {}
  execute() { this.light.isOn = true; }
  undo() { this.light.isOn = false; }
}

// Invoker: triggers commands and keeps a history for undo.
class RemoteControl {
  private history: Command[] = [];
  submit(command: Command) {
    command.execute();
    this.history.push(command);
  }
  undoLast() {
    this.history.pop()?.undo();
  }
}

const light = new Light();
const remote = new RemoteControl();
remote.submit(new TurnOn(light)); // light.isOn === true
remote.undoLast();                // light.isOn === false
```

The `RemoteControl` doesn't know or care what a command does — it just calls `execute()` and, for undo,
`undo()`.

### What "an action as an object" unlocks

- **Undo/redo** — keep a history of executed commands and call `undo()` (often paired with **Memento**,
  covered later, to restore state).
- **Queuing / scheduling** — put commands on a queue to run later or on another thread/worker.
- **Logging / replay** — record commands to re-run them (e.g. to rebuild state after a crash).
- **Macros** — a command that runs a list of other commands.

### A function is often enough in TypeScript

Because functions are first-class, a simple "do this" can just be `() => light.on = true`. The **object**
form of Command earns its keep when you also need **undo**, **serialization**, or **metadata** — things a
bare function can't easily carry.

### Consequences

- **Good:** decouples invoker from receiver; makes actions storable, queueable, loggable, and
  undoable; supports macros and OCP (new commands without changing invokers).
- **Cost:** a class per action can be a lot of boilerplate for simple cases.

# Key Terminology

- **Command** — an object representing an action, usually with `execute()`/`undo()`.
- **Receiver** — the object that performs the real work.
- **Invoker** — triggers the command without knowing its details.
- **Macro command** — a command composed of several commands.

# Options and Trade-offs

| Concern | Command object | Plain function | How to choose |
| ------- | -------------- | -------------- | ------------- |
| Undo/redo | Built in via undo() | Hard to reverse | Command object when you need undo. |
| Queue/log/serialize | Natural | Awkward | Command object for queuing/logging. |
| Simplicity | Class per action | One line | A function is fine for fire-and-forget actions. |

# Worked Example

A macro command groups several commands and undoes them in reverse:

```typescript
class Macro implements Command {
  constructor(private commands: Command[]) {}
  execute() { this.commands.forEach((c) => c.execute()); }
  undo() { [...this.commands].reverse().forEach((c) => c.undo()); }
}

const light = new Light();
const both = new Macro([new TurnOn(light), new TurnOn(light)]);
both.execute(); // runs each
both.undo();    // reverses each, in reverse order
```

Undoing in reverse order matters — the last action taken is the first one undone.

# Real World Analogy

A Command is like a **written work order** (or a restaurant ticket). The order slip contains everything
needed to carry out the task — what to do, for whom, with what — so it can be handed to any worker,
placed in a queue, kept as a record, and, if needed, cancelled. The person who *writes* the order is
separate from the person who *fills* it.

# Examples

## Example 1 — Basic: execute then undo

`remote.submit(new TurnOn(light))` turns the light on and records the command; `remote.undoLast()`
reverses it. The invoker never touched the light directly.

**Why this works:** the action and its reverse live together in one object the invoker can replay.

## Example 2 — Real-world: editors and job queues

Text editors implement undo/redo as a stack of commands; task queues store commands to run later; both
rely on "an action you can hold onto."

**Why this works:** turning actions into objects makes history, scheduling, and replay straightforward.

## Example 3 — Pitfall: a command per trivial action

Wrapping a one-liner with no undo, queue, or logging need in a full command class is pure boilerplate.

**Why this bites:** Command's power is undo/queue/log/serialize; without any of those, a function is
clearer.

# Common Mistakes

- **Using Command where a function would do.** Reserve it for undo/queue/log/serialize needs.
- **Forgetting to record history** when you want undo.
- **Undoing in the wrong order** in a macro — reverse the sequence.

# Best Practices

- Keep `execute()` and `undo()` **symmetric** so undo truly reverses execute.
- Store executed commands in a **history** to power undo/redo.
- Prefer a **function** for fire-and-forget actions; use the object form for its extra powers.

# Summary

- **Command** turns a request into an **object** carrying the action and its data.
- It **decouples** the invoker (button) from the receiver (worker), and enables **undo/redo, queues,
  logging, and macros**.
- Undo is often paired with **Memento** to restore prior state.
- In TypeScript, prefer a plain **function** unless you need Command's extra capabilities.

# Flash Cards

Q: What is the intent of the Command pattern?
A: Encapsulate a request as an object, so you can parameterize clients with requests, queue or log them, and support undoable operations.

Q: Name the four main roles in Command.
A: Command (the action object), Receiver (does the work), Invoker (triggers execute without knowing details), and Client (creates and wires commands).

Q: What capabilities does turning an action into an object unlock?
A: Undo/redo, queuing/scheduling, logging/replay, and macros (composing commands).

Q: Which method typically accompanies execute() to support undo?
A: undo(), which reverses the effect of execute(); a history of executed commands enables undo/redo.

Q: In TypeScript, when is a plain function enough instead of a Command object?
A: For fire-and-forget actions; the object form pays off when you also need undo, serialization, queuing, or metadata a bare function can't carry.

Q: Which other pattern is often paired with Command to implement undo?
A: Memento — it captures and restores an object's prior state so undo can roll back to it.

# Exercises

### Easy
Identify the Command, Receiver, and Invoker in the light example, and explain what `undoLast()` does.

### Medium
Add a `Dimmer` receiver with a `level` and write `SetLevel` commands whose `undo()` restores the
previous level. Show a submit-then-undo returning the dimmer to its earlier value.

### Challenging
Implement a simple undo/redo stack in the `RemoteControl`: `undoLast()` moves a command to a redo stack,
and `redo()` re-executes it. Explain why symmetric `execute()`/`undo()` is essential for this to work.

# Further Reading

- Gamma et al. — *Design Patterns*, "Command".
- Refactoring.Guru — *Command*: <https://refactoring.guru/design-patterns/command>
- Refactoring.Guru — *Command in TypeScript*: <https://refactoring.guru/design-patterns/command/typescript/example>
