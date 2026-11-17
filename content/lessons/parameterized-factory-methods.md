---
slug: parameterized-factory-methods
title: "Parameterized Factory Methods"
topic: creational-factories
kind: technique
summary: "Pass an identifier to a single factory method to select which concrete product subclass to create."
tags:
  - creational
  - factory-method
  - parameterized
  - typescript
related:
  - factory-method-intent
  - factory-method-implementation
  - factory-method-tradeoffs
---

> **In one line:** Parameterized factory methods accept an identifier to generate multiple variations of related products.

## The idea

A classic variation of the Factory Method pattern accepts a parameter that specifies which kind of product to create. Instead of creating a distinct creator subclass for every single product variant, a single creator can support multiple product types via an argument.

In TypeScript, string literal union types and discriminated unions make parameterized factory methods type-safe and self-documenting. If a client passes an unsupported product type, the TypeScript compiler flags the error immediately during compilation.

This variation is especially useful when creator subclasses need to generate more than one kind of product or when products vary along predictable feature dimensions, such as image formats (`'png' | 'jpeg' | 'webp'`) or database connectors.

| Approach | Mechanism | Advantage | Disadvantage |
|---|---|---|---|
| **Subclass Factory Method** | Subclass overrides method | Open/Closed Principle compliant | Proliferation of creator subclasses |
| **Parameterized Factory** | Argument selects product | Fewer subclasses needed | Creator must know supported variants |
| **Registry-based Factory** | Dynamic map lookup | Extensible without switch edits | Slightly more runtime configuration |

> **Tip:** Use a TypeScript `switch` statement with an `assertNever(x: never)` default branch to ensure exhaustive compile-time checking when handling union types in a parameterized factory.

## See it

```typescript
type DocumentFormat = 'pdf' | 'markdown' | 'html';

interface Exporter {
  exportData(data: string): void;
}

class PdfExporter implements Exporter {
  exportData(data: string) { console.log(`[PDF] ${data}`); }
}

class HtmlExporter implements Exporter {
  exportData(data: string) { console.log(`[HTML] ${data}`); }
}

class DocumentManager {
  // Parameterized factory method
  createExporter(format: DocumentFormat): Exporter {
    if (format === 'pdf') return new PdfExporter();
    if (format === 'html') return new HtmlExporter();
    throw new Error(`Unsupported format: ${format}`);
  }
}
```

## Go deeper

Parameterized factory methods can be combined with a dynamic registration dictionary. Instead of hardcoding conditional branching inside the method, classes register their constructor functions into a lookup map. The parameterized method simply queries the map, achieving full compliance with the Open/Closed Principle.

## Watch out

- Avoid letting parameterized factories grow into massive switch statements containing hundreds of product lines.
- Always validate that the parameter is strictly typed using TypeScript literal types rather than arbitrary strings.

## Remember

- Parameterized factory methods accept arguments to select and instantiate product variants.
- TypeScript string literal unions provide compile-time safety for factory parameters.
- Use exhaustive type checking to ensure all supported product variants are properly handled.
