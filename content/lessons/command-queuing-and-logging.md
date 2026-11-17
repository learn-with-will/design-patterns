---
slug: command-queuing-and-logging
title: "Command Queues, Macros & First-Class Functions"
topic: behavioral-requests
kind: technique
summary: "Queue asynchronous background jobs or compose macro commands; compare GoF Command with first-class TS closures."
tags:
  - behavioral
  - command
  - queues
  - macros
  - closures
related:
  - command-intent
  - command-pattern-implementation
  - undo-redo-with-commands
---

> **In one line:** Command objects can be queued for background execution, recorded for replay, or combined into composite macros.

## The idea

Because Command turns an action into a standalone object in memory, it unlocks architectural capabilities far beyond direct method calls:

1. **Job Queuing & Throttling**: Commands can be placed in an array queue. A background worker pool pulls commands off the queue and processes them sequentially or throttles execution rate to protect downstream databases.
2. **Macro Commands (Composite Command)**: A Macro Command contains an internal array of multiple sub-commands. When its `execute()` method runs, it executes all child commands in sequence, enabling complex multi-step batch scripts.
3. **Transaction Logging & Replay**: Commands can be serialized and written to an append-only log on disk. If the server crashes, the system reads the command log and replays them to reconstruct exact state.

| Advanced Command Capability | Description | Common Real-World Example |
|---|---|---|
| **Command Queue** | Buffers operations for rate-limited processing | BullMQ, background email queue |
| **Macro Command** | Composite pattern applied to commands | Photoshop recording actions batch |
| **Crash Recovery Log** | Append-only journal of executed operations | Database Write-Ahead Logging (WAL) |

> **Note:** In TypeScript, a function closure (`() => void`) is already a command! When you pass a callback to `setTimeout()` or an event listener, you are using first-class functions as lightweight commands.

## See it

```typescript
// Macro Command: Composite of multiple commands
class MacroCommand implements Command {
  private commands: Command[] = [];

  add(cmd: Command): void { this.commands.push(cmd); }

  execute(): void {
    console.log(`Executing macro batch of ${this.commands.length} commands:`);
    for (const cmd of this.commands) {
      cmd.execute();
    }
  }

  undo(): void {
    // Undo in reverse order!
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}
```

## Go deeper

In Peter Norvig's design pattern study, he noted that in languages with first-class functions, the Command pattern is largely built-in. A closure captures its lexical environment (the receiver and parameters) and exposes a callable interface. However, class-based Commands remain valuable when operations require bidirectional `undo()`, serialization, or metadata inspection.

## Watch out

- Remember to execute undo operations in reverse chronological order when rolling back macro commands.
- Watch out for memory leaks if long-running command queues accumulate without being drained.

## Remember

- Command queues allow asynchronous execution, rate-limiting, and background scheduling.
- Macro commands compose multiple actions into a single atomic executable unit.
- TypeScript closures provide lightweight commands; use class commands when undo state is required.
