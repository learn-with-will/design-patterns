---
slug: abstract-factory-tradeoffs
title: "Abstract Factory Trade-offs & Complexity"
topic: creational-factories
kind: pitfall
summary: "Abstract Factory requires introducing extensive interfaces; adding a new product requires editing every factory."
tags:
  - creational
  - abstract-factory
  - tradeoffs
  - complexity
related:
  - abstract-factory-intent
  - abstract-factory-families
  - avoiding-overengineering-yagni
---

> **In one line:** Abstract Factory introduces high interface complexity and makes adding new product types difficult.

## The idea

While Abstract Factory provides unmatched consistency when managing product families, it imposes notable architectural trade-offs that developers must weigh carefully.

The primary limitation of Abstract Factory is that **supporting new kinds of products is difficult**. The `AbstractFactory` interface fixes the set of products that can be created. If your UI toolkit needs to add a `Slider` widget, you must modify the `GUIFactory` interface, adding `createSlider()`. This change cascades into breaking changes across *every existing concrete factory class* in your codebase.

Furthermore, Abstract Factory requires a large amount of upfront boilerplate: interfaces for every product, concrete classes for every product variant, an abstract factory interface, and concrete factory implementations.

| Dimension | Impact of Abstract Factory |
|---|---|
| **Adding a New Product Family** | Trivial: create one new concrete factory class (Open/Closed) |
| **Adding a New Product Type** | Difficult: forces edits to all existing concrete factory classes |
| **Code Overhead** | High: generates numerous interfaces and parallel classes |
| **Runtime Safety** | High: guarantees compatible products across the entire application |

> **Watch out:** Avoid Abstract Factory when the set of product types is unstable or constantly expanding. It is ideal only when the product family structure is mature and well-defined.

## See it

```typescript
// Adding 'createSlider()' breaks all concrete factories!
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  // Breaking change: Every factory in the project now fails compilation!
  // createSlider(): Slider;
}

// In TypeScript, an object dictionary can provide a more flexible alternative:
type WidgetFactoryMap = {
  [platform: string]: {
    button: () => Button;
    checkbox: () => Checkbox;
    [customWidget: string]: () => unknown;
  };
};
```

## Go deeper

To mitigate the pain of expanding product families, some systems use a prototype-based or parameterized abstract factory. Instead of declaring dedicated methods like `createButton()` and `createCheckbox()`, the factory exposes a single generic method `create<T>(widgetType: string): T`. However, this sacrifices type safety for flexibility.

## Watch out

- Do not adopt Abstract Factory if your application frequently adds new product categories.
- Beware of over-engineering theme systems that only ever have a single production implementation.

## Remember

- Adding new product families is easy with Abstract Factory, but adding new product types is painful.
- Every new product type requires editing the abstract interface and all implementing factories.
- Use Abstract Factory only when product family boundaries are stable and well-understood.
