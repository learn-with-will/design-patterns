---
slug: factory-method-intent
title: "Factory Method: Intent & Problem"
topic: creational-factories
kind: pattern
summary: "Factory Method defines an interface for creating objects but lets subclasses decide which class to instantiate."
tags:
  - creational
  - factory-method
  - decoupling
  - inheritance
related:
  - factory-method-implementation
  - parameterized-factory-methods
  - abstract-factory-vs-factory-method
---

> **In one line:** Factory Method defines an object-creation method in a base class, deferring instantiation to subclasses.

## The idea

Direct instantiation using `new ConcreteClass()` couples client code tightly to concrete implementations. When new product variations are introduced or construction parameters change, every file containing a direct constructor invocation must be modified.

The Gang of Four's **Factory Method** pattern solves this coupling. Its official intent is: **"Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses."**

The creator class declares an abstract factory method (or provides a sensible default). The core business logic in the creator operates entirely against an abstract Product interface returned by that method. When you need a new product variant, you create a new creator subclass that overrides the factory method, leaving the original creator code untouched.

| Participant | Role in Factory Method | Collaborates With |
|---|---|---|
| **Product** | Interface defining the contract for created objects | Consumed by Creator |
| **ConcreteProduct** | Specific class implementing the Product interface | Created by ConcreteCreator |
| **Creator** | Declares factory method and uses abstract products | Overridden by ConcreteCreator |
| **ConcreteCreator** | Overrides factory method to instantiate ConcreteProduct | Instantiates ConcreteProduct |

> **Note:** The defining hallmark of Factory Method is its reliance on **class inheritance**. The base creator defines the workflow, while subclasses override the creation hook.

## See it

```typescript
// The abstract Product interface
interface DialogButton {
  render(): void;
  onClick(action: () => void): void;
}

// Concrete products
class WindowsButton implements DialogButton {
  render() { console.log('Drawing Windows style button'); }
  onClick(action: () => void) { action(); }
}

class MacButton implements DialogButton {
  render() { console.log('Drawing macOS rounded button'); }
  onClick(action: () => void) { action(); }
}
```

## Go deeper

Factory Method frequently serves as a framework hook. When developing extensible application frameworks, the framework core controls the overarching application lifecycle (such as opening documents or rendering windows). The framework exposes a factory method that client applications override to supply their own document or window types.

## Watch out

- Do not confuse a simple factory function with the Gang of Four Factory Method pattern, which requires inheritance.
- Avoid creating parallel class hierarchies if your product types rarely change.

## Remember

- Factory Method defers concrete object instantiation to subclasses via method overriding.
- The base creator works exclusively with the abstract Product interface.
- New product variants are added by introducing new subclasses without modifying base creator logic.
