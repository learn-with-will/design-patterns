---
slug: decorator-intent
title: "Decorator: Intent & Dynamic Wrapping"
topic: structural-composition
kind: pattern
summary: "Decorator attaches additional responsibilities to an object dynamically as an alternative to subclassing."
tags:
  - structural
  - decorator
  - wrapper
  - composition
related:
  - wrapping-behavior-dynamically
  - stacking-multiple-decorators
  - decorator-vs-inheritance
---

> **In one line:** Decorator dynamically attaches additional responsibilities to an object by wrapping it in identical interfaces.

## The idea

Extending class behavior through subclassing is static: the behavior is locked in at compile time, and applies across all instances of the class. If you need to combine multiple optional features (such as encryption, compression, and logging on a data stream), inheritance leads to a class explosion: `CompressedStream`, `EncryptedStream`, `CompressedAndEncryptedStream`.

The Gang of Four's **Decorator** pattern (also known as the **Wrapper**) solves this cleanly. Its official intent is: **"Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality."**

A Decorator wraps the original object, implements the exact same interface as the wrapped object, and forwards incoming requests to it while adding its own behavior before or after the delegation. Because the wrapper and target share the same interface, decorators can be stacked recursively in any arbitrary combination at runtime.

| Participant | Role | Example |
|---|---|---|
| **Component** | Interface for objects that can have responsibilities added | `interface Notifier` |
| **ConcreteComponent** | The base object defining core behavior | `class EmailNotifier` |
| **BaseDecorator** | Implements Component; wraps a Component reference | `class NotifierDecorator` |
| **ConcreteDecorator** | Adds specific responsibilities before/after delegation | `SMSDecorator`, `SlackDecorator` |

> **Note:** The key difference between Decorator and Adapter is that Decorator preserves the *exact same interface* while enhancing behavior; Adapter converts one interface into a *different* interface.

## See it

```typescript
interface Coffee {
  getCost(): number;
  getDescription(): string;
}

class SimpleCoffee implements Coffee {
  getCost() { return 2.0; }
  getDescription() { return 'Simple coffee'; }
}

// Base Decorator forwards calls to wrapped component
abstract class CoffeeDecorator implements Coffee {
  constructor(protected wrapped: Coffee) {}
  getCost() { return this.wrapped.getCost(); }
  getDescription() { return this.wrapped.getDescription(); }
}

class MilkDecorator extends CoffeeDecorator {
  getCost() { return super.getCost() + 0.5; }
  getDescription() { return `${super.getDescription()}, with milk`; }
}
```

## Go deeper

Java's classic I/O Streams library is the canonical textbook example of the Decorator pattern:
`new BufferedReader(new InputStreamReader(new FileInputStream("data.txt")))`. Each stream wrapper enhances the underlying byte stream with buffering, character decoding, or decompression without altering the core stream interface.

## Watch out

- Do not confuse the GoF Decorator design pattern with TypeScript or Python @decorator annotations.
- Watch out for deep decorator stacks that can make stack traces and debugging more complex.

## Remember

- Decorator adds responsibilities to objects dynamically at runtime without subclassing.
- Decorators implement the exact same interface as the objects they wrap.
- Multiple decorators can be stacked recursively to combine arbitrary optional features.
