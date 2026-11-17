---
slug: undo-redo-with-commands
title: "Undo/Redo Stacks with Reversible Commands"
topic: behavioral-requests
kind: technique
summary: "Store executed command instances on an undo stack and popped commands on a redo stack for full undoability."
tags:
  - behavioral
  - command
  - undo-redo
  - history
  - stacks
related:
  - command-intent
  - command-pattern-implementation
  - memento-intent
---

> **In one line:** Implement universal Undo and Redo operations using dual command stacks that record execution history.

## The idea

The classic application that showcases the power of the Command pattern is implementing a multi-level **Undo/Redo** system in productivity software (text editors, graphic canvases, spreadsheet engines).

To support undo, each Command object implements an `undo()` method that reverses the effects of its `execute()` method. The command must store whatever prior state is necessary to restore the receiver (such as deleted text or prior coordinates).

The application maintains two stacks: an **Undo Stack** and a **Redo Stack**:
1. **Execute**: When an action occurs, `command.execute()` runs, the command is pushed onto the Undo Stack, and the Redo Stack is cleared.
2. **Undo**: Pop the latest command from the Undo Stack, call `command.undo()`, and push it onto the Redo Stack.
3. **Redo**: Pop the command from the Redo Stack, call `command.execute()`, and push it back onto the Undo Stack.

| User Action | Undo Stack State | Redo Stack State |
|---|---|---|
| User types "A" | `[CommandA]` | `[]` (cleared on new action) |
| User types "B" | `[CommandA, CommandB]` | `[]` |
| User presses **Undo** | `[CommandA]` | `[CommandB]` |
| User presses **Redo** | `[CommandA, CommandB]` | `[]` |

> **Tip:** You should limit the maximum depth of the Undo Stack (e.g., 50 commands) to prevent unbounded memory consumption during long editing sessions.

## See it

```typescript
class CommandHistory {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(cmd: Command): void {
    cmd.execute();
    this.undoStack.push(cmd);
    this.redoStack = []; // Clear redo on fresh action
  }

  undo(): void {
    const cmd = this.undoStack.pop();
    if (cmd) { cmd.undo(); this.redoStack.push(cmd); }
  }

  redo(): void {
    const cmd = this.redoStack.pop();
    if (cmd) { cmd.execute(); this.undoStack.push(cmd); }
  }
}
```

## Go deeper

Command can be combined with the **Memento pattern** for complex state reversal. Instead of calculating reverse deltas manually inside `undo()`, the command asks the receiver for a Memento snapshot before executing. When `undo()` is called, the command simply restores the saved Memento snapshot back onto the receiver.

## Watch out

- Always clear the Redo Stack whenever the user executes a brand-new command; otherwise history branches unpredictably.
- Ensure that undo() perfectly inverts all side effects produced by execute().

## Remember

- Reversible commands store the necessary state to undo their own operations.
- An Undo Stack records historical commands, while a Redo Stack stores undone operations.
- Executing any new command must immediately invalidate and clear the Redo Stack.
