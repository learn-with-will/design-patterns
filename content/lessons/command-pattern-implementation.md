---
slug: command-pattern-implementation
title: "Implementing Command in TypeScript"
topic: behavioral-requests
kind: technique
summary: "Define a Command interface with execute and undo methods invoked by invokers and performed by receivers."
tags:
  - behavioral
  - command
  - typescript
  - architecture
related:
  - command-intent
  - undo-redo-with-commands
  - command-queuing-and-logging
---

> **In one line:** Implement Command in TypeScript by coupling invokers to command interfaces rather than concrete services.

## The idea

Implementing the Command pattern in TypeScript involves coordinating four structural elements:

1. **The Command Interface**: Declares at minimum an `execute(): void` method, and optionally an `undo(): void` method.
2. **The Receiver**: The existing domain service containing core business methods (e.g., `DatabaseConnection`, `CanvasRenderer`).
3. **Concrete Commands**: Classes implementing `Command`. They accept the Receiver in their constructor along with any parameters required for execution. When `execute()` is called, they invoke the appropriate receiver methods.
4. **The Invoker**: The component that initiates the command (e.g., a toolbar, scheduled job runner, or shortcut listener). The invoker holds a reference to a Command and triggers it upon user interaction.

| Step | TypeScript Artifact | Key Responsibility |
|---|---|---|
| **1. Contract** | `interface Command` | Declares `execute()` and optional `undo()` |
| **2. Receiver** | `class TextEditor` | Implements actual text insertion / deletion |
| **3. Command** | `class InsertTextCommand` | Captures receiver reference + text payload |
| **4. Invoker** | `class ToolbarButton` | Stores command; calls `execute()` on click |

> **Tip:** In TypeScript, you can parameterize commands with closures. If a command does not require reversible undo state, passing a simple lambda function `() => void` often suffices as a lightweight Command.

## See it

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver
class TextDocument {
  public content = '';
  write(text: string) { this.content += text; }
  erase(length: number) { this.content = this.content.slice(0, -length); }
}

// Concrete Command holding state for execution and reversal
class WriteCommand implements Command {
  constructor(private doc: TextDocument, private text: string) {}
  execute(): void { this.doc.write(this.text); }
  undo(): void { this.doc.erase(this.text.length); }
}

const doc = new TextDocument();
const cmd = new WriteCommand(doc, 'Hello world');
cmd.execute();
cmd.undo();
```

## Go deeper

Commands can be serialized to JSON and transmitted across network boundaries or stored in a persistent queue. In distributed systems, this is known as the "Transactional Command" pattern: worker nodes pull serialized command payloads from message brokers (like RabbitMQ or SQS) and deserialize them into executable command instances.

## Watch out

- Ensure the command stores all parameters needed for execution at creation time.
- Do not let invokers bypass the command to talk directly to receivers.

## Remember

- The Command interface defines execute() and undo() contracts.
- Concrete commands encapsulate receivers and capture operational parameters.
- Invokers trigger commands polymorphically, decoupling UI elements from domain services.
