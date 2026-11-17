---
slug: abstract-factory-families
title: "Implementing Abstract Factory in TypeScript"
topic: creational-factories
kind: technique
summary: "Define abstract factory interfaces producing multiple related products like buttons, checkboxes, and windows."
tags:
  - creational
  - abstract-factory
  - typescript
  - families
related:
  - abstract-factory-intent
  - abstract-factory-vs-factory-method
  - abstract-factory-tradeoffs
---

> **In one line:** Implement Abstract Factory in TypeScript by grouping product contracts into cohesive factory interfaces.

## The idea

To implement Abstract Factory in TypeScript, start by declaring an interface for each distinct product type in the family. Next, define the `AbstractFactory` interface containing a factory method for each product type.

Each concrete factory class implements the `AbstractFactory` interface and instantiates the concrete products for its specific theme or platform.

Finally, the client class receives the factory instance—typically via constructor Dependency Injection. At application initialization (the "composition root"), the environment determines which concrete factory to supply based on runtime configuration, environment variables, or operating system detection. This cleanly separates instantiation logic from runtime UI rendering, guaranteeing strict platform consistency across all rendered widgets.

| Component | TypeScript Definition | Responsibility |
|---|---|---|
| **Abstract Products** | `interface Button`, `interface Checkbox` | Define product capabilities |
| **Abstract Factory** | `interface GUIFactory` | Groups creation method signatures |
| **Concrete Factory 1** | `class WinFactory implements GUIFactory` | Instantiates Windows products |
| **Concrete Factory 2** | `class MacFactory implements GUIFactory` | Instantiates Mac products |

> **Tip:** You can combine Abstract Factory with Singleton or dependency injection containers, ensuring that only one factory instance exists for the active theme throughout the application lifetime.

## See it

```typescript
class WindowsButton implements Button { paint() { console.log('Win Button'); } }
class WindowsCheckbox implements Checkbox { check() { console.log('Win Check'); } }

class MacButton implements Button { paint() { console.log('Mac Button'); } }
class MacCheckbox implements Checkbox { check() { console.log('Mac Check'); } }

// Concrete factories producing consistent product families
class WindowsFactory implements GUIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
}

const app = new Application(new WindowsFactory());
app.renderUI();
```

## Go deeper

Abstract Factory is widely used beyond graphical user interfaces. In database persistence layers, an abstract `StorageFactory` might create `UserDAO`, `OrderDAO`, and `InvoiceDAO`. The `PostgreSQLStorageFactory` produces SQL-backed DAOs, while `InMemoryStorageFactory` produces fast in-memory DAOs for unit testing. This architecture enables developers to switch entire persistence engines without altering a single line of domain business logic.

## Watch out

- Ensure that all concrete factories implement all methods in the factory interface to satisfy the contract.
- Do not expose concrete product return types in the factory interface; always return abstract product types.

## Remember

- Abstract Factory interfaces declare factory methods for every product in a related family.
- Concrete factory implementations return specific concrete products matching their theme.
- The composition root configures which concrete factory to inject at application startup.
