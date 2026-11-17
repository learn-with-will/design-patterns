---
slug: abstract-factory-intent
title: "Abstract Factory: Intent & Families"
topic: creational-factories
kind: pattern
summary: "Abstract Factory provides an interface for creating families of related objects without naming concrete classes."
tags:
  - creational
  - abstract-factory
  - families
  - composition
related:
  - abstract-factory-families
  - abstract-factory-vs-factory-method
  - factory-method-intent
---

> **In one line:** Abstract Factory provides an interface for creating entire families of related or dependent objects.

## The idea

In many complex applications, objects are designed to work together in distinct families or themes. For example, a cross-platform desktop UI library must render buttons, scrollbars, and checkboxes that all match the host operating system (Windows, macOS, or Linux).

Mixing products from different families (such as rendering a Windows button next to a macOS scrollbar) creates jarring visual bugs and broken functionality.

The Gang of Four's **Abstract Factory** pattern solves this. Its official intent is: **"Provide an interface for creating families of related or dependent objects without specifying their concrete classes."** An Abstract Factory interface declares creation methods for each distinct product in the family. Concrete factory implementations produce an entire consistent suite of products.

| Product Family | Button Product | Scrollbar Product | Checkbox Product |
|---|---|---|---|
| **Windows Family** | `WindowsButton` | `WindowsScrollbar` | `WindowsCheckbox` |
| **Mac Family** | `MacButton` | `MacScrollbar` | `MacCheckbox` |
| **Linux Family** | `LinuxButton` | `LinuxScrollbar` | `LinuxCheckbox` |

> **Note:** The key distinction of Abstract Factory is the concept of **product families**. While Factory Method creates one product, Abstract Factory creates an entire suite of coordinated products.

## See it

```typescript
// Product family interfaces
interface Button { paint(): void; }
interface Checkbox { check(): void; }

// Abstract Factory contract
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Client operates purely on the abstract factory and product interfaces
class Application {
  constructor(private factory: GUIFactory) {}

  renderUI(): void {
    const btn = this.factory.createButton();
    const chk = this.factory.createCheckbox();
    btn.paint();
    chk.check();
  }
}
```

## Go deeper

Abstract Factory enforces consistency by construction. Because client code receives a single concrete factory instance (configured at startup), it is structurally impossible for the client to accidentally mix products from conflicting families. If the `MacFactory` is active, every UI widget produced belongs guaranteed to the Mac family.

## Watch out

- Do not use Abstract Factory if you only have a single product type; use Factory Method instead.
- Remember that adding a new product type to the family forces modifications to every existing concrete factory.

## Remember

- Abstract Factory creates whole families of related products without coupling to concrete classes.
- It guarantees that products from different families are never accidentally mixed.
- Clients consume factories and products exclusively through abstract interface contracts.
