---
slug: factory-method-implementation
title: "Implementing Factory Method in TypeScript"
topic: creational-factories
kind: technique
summary: "Create an abstract creator class with a factory method overridden by concrete subclasses."
tags:
  - creational
  - factory-method
  - typescript
  - polymorphism
related:
  - factory-method-intent
  - parameterized-factory-methods
  - factory-method-tradeoffs
---

> **In one line:** Implement Factory Method in TypeScript using abstract classes and methods to decouple creation from domain operations.

## The idea

Implementing Factory Method in TypeScript involves setting up two parallel class structures: the Product hierarchy and the Creator hierarchy. 

The Creator class is typically an `abstract class`. It contains domain methods (such as `renderDialog()` or `deliverPackage()`) that perform core operations. Crucially, whenever the creator needs an instance of a product, it calls its own `createButton()` or `createTransport()` factory method instead of calling `new` directly.

Concrete creators extend the base creator and implement the abstract factory method, returning their respective concrete product instances. Client code then interacts with the creator through its base class interface, oblivious to which concrete subclass is active.

| Step | Action | TypeScript Construct |
|---|---|---|
| **1. Define Contract** | Specify product capabilities | `interface Transport { deliver(): void; }` |
| **2. Concrete Products** | Implement actual product logic | `class Truck implements Transport { ... }` |
| **3. Base Creator** | Declare abstract factory method | `abstract class Logistics { abstract create(): Transport; }` |
| **4. Subclass Creators** | Return specific products | `class RoadLogistics extends Logistics { ... }` |

> **Tip:** TypeScript's `abstract` keyword ensures that neither the base creator nor un-implemented factory methods can be called accidentally at runtime, providing compile-time safety.

## See it

```typescript
abstract class Dialog {
  // Factory Method
  abstract createButton(): DialogButton;

  // Domain logic uses the product returned by the factory method
  render(): void {
    const okButton = this.createButton();
    okButton.render();
    okButton.onClick(() => console.log('Dialog dismissed'));
  }
}

class WindowsDialog extends Dialog {
  createButton(): DialogButton {
    return new WindowsButton();
  }
}

class MacDialog extends Dialog {
  createButton(): DialogButton {
    return new MacButton();
  }
}
```

## Go deeper

In TypeScript, you can provide a default implementation in the base creator instead of making the factory method strictly abstract. If a subclass does not require specialized product creation, it inherits the default product behavior. This approach is useful for creating customizable UI component libraries.

## Watch out

- Do not call complex constructor logic inside the factory method; keep instantiation straightforward.
- Ensure that concrete products strictly conform to the shared Product interface to prevent runtime errors.

## Remember

- Declare an abstract factory method inside the base creator class.
- Subclasses override the factory method to return specific concrete products.
- Base creator domain methods consume products strictly through their common interface.
