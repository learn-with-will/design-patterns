---
slug: abstract-factory-vs-factory-method
title: "Abstract Factory vs Factory Method"
topic: creational-factories
kind: concept
summary: "Factory Method creates one product via inheritance; Abstract Factory creates families of products via composition."
tags:
  - creational
  - factory-method
  - abstract-factory
  - comparison
related:
  - factory-method-intent
  - abstract-factory-intent
  - design-principles-interfaces-composition
---

> **In one line:** Factory Method relies on inheritance to create one product; Abstract Factory uses composition to create families.

## The idea

Factory Method and Abstract Factory are both creational patterns, and their similar names often confuse developers. However, their structural mechanisms and primary intents are fundamentally distinct.

**Factory Method** relies on **inheritance**. A base creator defines an abstract method that subclasses override to create a single product. The creator class itself usually contains business logic that operates on that product.

**Abstract Factory** relies on **object composition**. An independent factory object is passed into client code. The client delegates object creation to this factory object, which produces an entire suite of related products. The factory class itself has no business logic; its sole responsibility is creating objects.

| Feature | Factory Method | Abstract Factory |
|---|---|---|
| **Mechanism** | Class Inheritance (overrides method) | Object Composition (injected factory object) |
| **Product Scope** | Creates a single product | Creates families of multiple related products |
| **Class Focus** | Creator contains business logic | Factory is purely a creation helper |
| **Extension Point** | Subclassing the creator | Supplying a new concrete factory implementation |

> **Note:** Internally, an Abstract Factory class is often implemented using a collection of Factory Methods, where each method in the factory class creates a specific product in the family.

## See it

```typescript
// Factory Method: Inheritance creates ONE product
abstract class DataImporter {
  abstract createParser(): Parser; // Factory Method
  importData() {
    const parser = this.createParser();
    parser.parse();
  }
}

// Abstract Factory: Composition creates a FAMILY of products
interface CloudResourceFactory {
  createStorage(): CloudStorage;
  createCompute(): CloudCompute;
}

class InfrastructureManager {
  constructor(private cloud: CloudResourceFactory) {} // Injected object
  spinUp() {
    const storage = this.cloud.createStorage();
    const compute = this.cloud.createCompute();
  }
}
```

## Go deeper

Choosing between the two depends on the problem space:
- If you have an existing class hierarchy that needs to vary what product it uses internally, use **Factory Method**.
- If your system needs to be configured with an entire coordinated suite of products across multiple domains, use **Abstract Factory**.

## Watch out

- Do not use Abstract Factory when there is only one product; an injected Factory Method or function is simpler.
- Never confuse the two in technical interviews: emphasize inheritance for Factory Method vs composition for Abstract Factory.

## Remember

- Factory Method uses class inheritance to instantiate a single product.
- Abstract Factory uses object composition to produce coordinated families of products.
- Abstract Factory classes often use Factory Methods internally to create their individual products.
