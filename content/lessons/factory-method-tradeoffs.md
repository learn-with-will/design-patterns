---
slug: factory-method-tradeoffs
title: "Factory Method Trade-offs & Limits"
topic: creational-factories
kind: pitfall
summary: "Factory Method requires subclassing creator hierarchies; avoid it when simple functions suffice."
tags:
  - creational
  - factory-method
  - tradeoffs
  - pitfall
related:
  - factory-method-intent
  - abstract-factory-vs-factory-method
  - when-to-use-patterns
---

> **In one line:** Factory Method requires subclassing creator hierarchies; use it only when creation logic must be deferred.

## The idea

While Factory Method effectively decouples client code from concrete product classes, it introduces architectural overhead that may not always be justified.

The primary disadvantage of Factory Method is that it requires subclassing. To instantiate a new concrete product, you are often forced to write a corresponding creator subclass. If your application has 10 product types, you may end up with 10 creator subclasses, unnecessarily doubling the number of classes in your codebase.

In TypeScript and modern JavaScript, functions are first-class citizens. A standalone factory function that returns an interface, or an object literal acting as a constructor map, frequently achieves the exact same decoupling in a fraction of the code without any inheritance hierarchy.

| Solution | Class Count | Boilerplate | When to Choose |
|---|---|---|---|
| **GoF Factory Method** | High (Product + Creator pairs) | High (requires subclasses) | Frameworks with extensible base classes |
| **Simple Factory Function** | Low (Single function) | Minimal | Application-level product creation |
| **Constructor Map / Dictionary** | Minimal (Object lookup) | Low | Dynamically registered product types |

> **Watch out:** If the only reason you are creating a subclass is to override a single factory method, you are likely over-engineering. Pass a factory function into the constructor instead.

## See it

```typescript
// Before: Over-engineered Factory Method hierarchy
// class MacDialog extends Dialog { createButton() { return new MacButton(); } }

// After: Idiomatic TypeScript factory function passed as a dependency
type ButtonFactory = () => DialogButton;

class FlexibleDialog {
  constructor(private makeButton: ButtonFactory) {}

  render(): void {
    const button = this.makeButton();
    button.render();
  }
}

// Client configures instantiation without any subclassing
const dialog = new FlexibleDialog(() => new WindowsButton());
```

## Go deeper

In Peter Norvig's famous analysis of design patterns in dynamic languages, he demonstrated that 16 of the 23 GoF patterns are simplified or rendered invisible by first-class functions and dynamic typing. Factory Method is a prime example: passing constructor functions or lambda expressions directly replaces rigid creator class hierarchies.

## Watch out

- Do not introduce a creator subclass if a simple callback function fulfills the instantiation requirement.
- Beware of parallel inheritance hierarchies where changes to product hierarchies force edits to creators.

## Remember

- Factory Method can lead to class explosion by forcing paired creator and product subclasses.
- In TypeScript, passing factory functions or constructors directly is often simpler and more flexible.
- Reserve classic Factory Method for extensible frameworks where base classes coordinate complex lifecycles.
