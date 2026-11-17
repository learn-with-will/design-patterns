---
slug: command-intent
title: "Command: Intent & Action Encapsulation"
topic: behavioral-requests
kind: pattern
summary: "Encapsulate a request as an object, thereby letting you parameterize clients with different requests and log them."
tags:
  - behavioral
  - command
  - encapsulation
  - actions
related:
  - command-pattern-implementation
  - undo-redo-with-commands
  - command-queuing-and-logging
---

> **In one line:** Command turns a request or operation into a standalone object containing all information needed to execute it.

## The idea

In standard programming, invoking an action means calling a method directly: `editor.saveDocument()`. However, directly calling methods couples the user interface (a UI button, a keyboard shortcut, or a menu item) to specific business operations.

What if you want the same "Save" button to trigger different actions in different contexts? What if you need to queue requests, execute them asynchronously, log them to a transaction audit file, or implement a universal **Undo/Redo** system?

The Gang of Four's **Command** pattern (also called **Action** or **Transaction**) solves this. Its official intent is: **"Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations."** By turning an operation into a standalone object with an `execute()` method, actions become first-class data entities that can be passed, stored, and reversed.

| Participant | Role | Example |
|---|---|---|
| **Command** | Interface declaring the execution contract | `interface Command { execute(): void; }` |
| **ConcreteCommand** | Encapsulates receiver and specific operation | `class CopyCommand`, `class PasteCommand` |
| **Invoker** | Triggers the command without knowing its logic | UI `Button`, Menu item, Key shortcut |
| **Receiver** | Performs the actual underlying business work | `DocumentEditor`, `AudioTrack` |

> **Note:** A Command acts as a bridge: the Invoker calls `command.execute()`, and the Command forwards the call to the appropriate method on the Receiver.

## See it

```typescript
interface Command { execute(): void; }

// Receiver: knows how to perform real business logic
class LightReceiver {
  turnOn() { console.log('Light is ON'); }
}

// Concrete Command binding receiver to an action
class TurnOnLightCommand implements Command {
  constructor(private light: LightReceiver) {}
  execute(): void { this.light.turnOn(); }
}

// Invoker: reusable UI element
class RemoteButton {
  constructor(private command: Command) {}
  press(): void { this.command.execute(); }
}

const light = new LightReceiver();
const button = new RemoteButton(new TurnOnLightCommand(light));
button.press(); // "Light is ON"
```

## Go deeper

Command is foundational to Redux and CQRS (Command Query Responsibility Segregation). In Redux, "actions" are command descriptors dispatched to reducers. In CQRS, write operations are modeled as Command objects containing all payload parameters, completely decoupled from read queries.

## Watch out

- Do not confuse the Receiver (the object that does the work) with the Command (the wrapper that invokes it).
- Avoid making commands too heavy; they should delegate actual domain work to receiver classes.

## Remember

- Command encapsulates an operation as a standalone object containing all execution parameters.
- Invokers trigger commands polymorphically without coupling to underlying receiver classes.
- Encapsulating actions as objects unlocks undo/redo, queuing, serialization, and audit logging.
